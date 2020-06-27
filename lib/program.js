// Extends commander with options and functions used by all subcommands.
process.on('unhandledRejection', (reason, promise) => console.log(reason))
const program = require('@wikibasejs/commander')
const applyEnvAndConfigDefault = require('./apply_env_and_config_default')
const logCommandExamples = require('./log_command_examples')
const globalOptionsHelp = require('./global_options_help')

program.process = command => {
  if (command) {
    const metadata = require(`../metadata/${command}`)
    const { args, description, options, examples, doc } = metadata
    program.arguments(args)
    program.description(description)
    Object.keys(globalOptionsHelp).forEach(key => {
      if (options[key]) program.option(...globalOptionsHelp[key])
    })
    // Register the options so that it doesn't throw when they are passed
    // but do not display those in help menus
    if (!options.instance) program.ignore(...globalOptionsHelp.instance)
    if (!options.sparqlEndpoint) program.ignore(...globalOptionsHelp.sparqlEndpoint)

    program.on('--help', () => logCommandExamples(command, examples, doc))
  }
  const { helpOption, argv } = parseArgv(process.argv)
  program.parse(argv)
  if (commandsWithCustomHelpMenu.includes(command)) {
    program.helpOption = helpOption || (program.args.length === 0 && !program.batch)
  } else if (helpOption && !commandsWithCustomHelpMenu) {
    program.helpAndExit(0)
  } else if (program.args.length === 0 && !commandsAcceptingZeroArguments.includes(command) && !program.batch) {
    program.helpAndExit(0)
  }
  applyEnvAndConfigDefault(program)
}

const commandsAcceptingZeroArguments = [
  // Can be called without argument
  'props',
  // Accepts ids on stdin
  'data',
  'generate-template',
  // All arguments are passed as options values
  // making program.args.length === 0 likely
  'query',
  // Needs to also log the current config
  'config'
]

const commandsWithCustomHelpMenu = [
  // Required to be able to show help for templates
  'edit-entity',
  'create-entity'
]

const parseArgv = argv => {
  // Make a copy to be able to mutate the array without affecting other operations
  // that might rely on that array being intact
  argv = argv.slice(0)
  let index
  if (argv.includes('-h')) {
    index = argv.indexOf('-h')
  } else if (argv.includes('--help')) {
    index = argv.indexOf('--help')
  }
  if (index != null) {
    argv.splice(index, 1)
    return { helpOption: true, argv }
  } else {
    return { helpOption: false, argv }
  }
}

program.helpAndExit = exitCode => {
  program.help()
  process.exit(exitCode)
}

// Prevent logging an EPIPE error when piping the output
// cf https://github.com/maxlath/wikibase-cli/issues/7
process.stdout.on('error', err => {
  if (err.code === 'EPIPE') process.exit(0)
  else throw err
})

module.exports = program
