# Write operations

Those command modify Wikibase so you will be asked your Wikibase **username** and **password** to use them. Those will be **persisted in clear text** in this module's folder: `./config.json`. Alternatively, in the case writing to this module's folder would require special rights, the config file with your crendentials can be found in your home folder: `~/.config/wikibase-cli/config.json`. This allows not having to re-enter crendentials everytimes, but it can problematic on a non-personal computer: in such a case, make sure to run `wb config clear` once you're done.

The following documentation assumes that the Wikibase instance we work with is Wikidata (using the `wd` command, which is just an alias of the `wb` command bound to Wikidata config), unless specified otherwise (using the `wb` command and custom instance host (`-i`) and SPARQL endpoint (`-e`).

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [labels](#labels)
  - [wb set-label](#wb-set-label)
- [descriptions](#descriptions)
  - [wb set-description](#wb-set-description)
- [aliases](#aliases)
  - [wb add-alias](#wb-add-alias)
  - [wb remove-alias](#wb-remove-alias)
  - [wb set-alias](#wb-set-alias)
- [claims](#claims)
  - [wb add-claim](#wb-add-claim)
    - [rich values](#rich-values)
      - [JSON format](#json-format)
      - [query string format](#query-string-format)
    - [with a reference](#with-a-reference)
    - [special claim snaktypes](#special-claim-snaktypes)
  - [wb update-claim](#wb-update-claim)
  - [wb move-claim](#wb-move-claim)
  - [wb remove-claim](#wb-remove-claim)
- [qualifiers](#qualifiers)
  - [wb add-qualifier](#wb-add-qualifier)
    - [special qualifier snaktypes](#special-qualifier-snaktypes)
  - [wb update-qualifier](#wb-update-qualifier)
  - [wb move-qualifier](#wb-move-qualifier)
  - [wb remove-qualifier](#wb-remove-qualifier)
- [references](#references)
  - [wb add-reference](#wb-add-reference)
  - [wb remove-reference](#wb-remove-reference)
- [entity](#entity)
  - [wb create-entity](#wb-create-entity)
  - [wb edit-entity](#wb-edit-entity)
    - [Pass data as inline JSON](#pass-data-as-inline-json)
    - [Pass data as a JSON file](#pass-data-as-a-json-file)
    - [Pass data as a static JS object file](#pass-data-as-a-static-js-object-file)
    - [Pass data as a dynamic JS function file returning an object](#pass-data-as-a-dynamic-js-function-file-returning-an-object)
      - [transform input](#transform-input)
      - [fetch additional data](#fetch-additional-data)
      - [inspect generated data](#inspect-generated-data)
  - [wb merge-entity](#wb-merge-entity)
  - [wb delete-entity](#wb-delete-entity)
- [edit summary](#edit-summary)
- [batch mode](#batch-mode)
  - [Batch process logs](#batch-process-logs)
  - [Handle batch errors](#handle-batch-errors)
- [Options](#options)
  - [maxlag](#maxlag)
- [Demos](#demos)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### labels
See [Wikidata:Glossary#Label](https://www.wikidata.org/wiki/Wikidata:Glossary#Label)
#### wb set-label

Set a label on an entity in a given language
```sh
wb set-label <entity> <language> <label>
# Alias:
wb sl <entity> <language> <label>
```
Examples:
```sh
# Set the label 'lorem ipsum' to the item Q4115189 in French
wb set-label Q4115189 fr "lorem ipsum"
```

For more advanced use cases (such as setting multiple labels on a single entity at once) you should rather use [`edit-entity`](#wb-edit-entity).

### descriptions
See [Wikidata:Glossary#Description](https://www.wikidata.org/wiki/Wikidata:Glossary#Description)

#### wb set-description

Set a description on an entity in a given language
```sh
wb set-description <entity> <language> <description>
# Alias:
wb sd <entity> <language> <description>
```
Examples:
```sh
# Set the description "lorem ipsum" to the item Q4115189 in French
wb set-description Q4115189 fr "lorem ipsum"
```

For more advanced use cases (such as setting multiple descriptions on a single entity at once) you should rather use [`edit-entity`](#wb-edit-entity).

### aliases
See [Wikidata:Glossary#Alias](https://www.wikidata.org/wiki/Wikidata:Glossary#Alias)

#### wb add-alias
Add one or several aliases to the list of aliases of an entity in a given language
```sh
wb add-alias <entity> <language> <alias>
# Alias:
wb aa <entity> <language> <alias>
```

```sh
# Add an alias
wb add-alias Q4115189 fr foo
# Add several aliases separated by a pipe
wb add-alias Q4115189 fr "foo|bar"
```

For more advanced use cases, you should rather use [`edit-entity`](#wb-edit-entity).

#### wb remove-alias
Remove one or several aliases from the list of aliases of an entity in a given language
```sh
wb remove-alias <entity> <language> <alias>
# Alias:
wb ra <entity> <language> <alias>
```

```sh
# Remove an alias
wb remove-alias Q4115189 fr foo
# Remove several aliases separated by a pipe
wb remove-alias Q4115189 fr "foo|bar"
```

For more advanced use cases, you should rather use [`edit-entity`](#wb-edit-entity).

#### wb set-alias
Set the list of aliases of an entity in a given language
```sh
wb set-alias <entity> <language> <alias>
# Alias:
wb sa <entity> <language> <alias>
```
```sh
# Replace all Q4115189's French alias by 'foo'
wb set-alias Q4115189 fr foo
# Replace all Q4115189's French alias by 'foo' and 'bar'
wb set-alias Q4115189 fr "foo|bar"
```

For more advanced use cases, you should rather use [`edit-entity`](#wb-edit-entity).

### claims
See [Wikidata:Glossary#Claim](https://www.wikidata.org/wiki/Wikidata:Glossary#Claim)

#### wb add-claim

Add a claim to an entity.<br>
*Alternative*: [QuickStatements](https://tools.wmflabs.org/wikidata-todo/quick_statements.php)

```sh
wb add-claim <entity> <property> <value>
# Alias:
wb ac <entity> <property> <value>
```

Examples:
```sh
# Add the Twitter account (P2002) 'bulgroz' to the Sandbox (Q4115189) entity
wd add-claim Q4115189 P2002 bulgroz
# The same but using the command alias
wd ac Q4115189 P2002 bulgroz
# Add the statement that the Sandbox (Q4115189) has for part (P527) the sand (Q34679)
wd ac Q4115189 P527 Q34679
```

For more advanced use cases, such as adding a claim with qualifiers and references, you should rather use [`edit-entity`](#wb-edit-entity).

##### rich values
Some values like monolingual text, quatities with a unit, or time with a precision, require to pass more data than a simple primitive value. This can be done by passing an object, either in a JSON or a query string format:

###### JSON format
```sh
wd ac Q4115189 P1476 '{"text":"bac à sable","language":"fr"}'
wd ac Q4115189 P1106 '{"amount":123,"unit":"Q4916"}'
# On precision, see https://www.wikidata.org/wiki/Help:Dates#Precision
wd ac Q4115189 P578 '{"time":"1800","precision":7}'
# Set a coordinate on another celestial body than Earth (here, Mars (Q111))
wd ac Q4115189 P626 '{ "latitude": 18.65, "longitude": 226.2, "precision": 0.01, "globe": "http://www.wikidata.org/entity/Q111" }'
```

###### query string format
```sh
wd ac Q4115189 P1476 'text=bac à sable&language=fr'
wd ac Q4115189 P1106 'amount=123&unit=Q4916'
wd ac Q4115189 P578 'time=1800&precision=7'
```

##### with a reference
Workflow example to add a claim with a reference, using [jq](https://stedolan.github.io/jq/). See [`wb add-reference`](#wb-add-reference) for more details.
``` sh
claim_guid=$(wd add-claim Q4115189 P369 Q34679 | jq -r .claim.id)
# Add the reference that this claim is imported from (P143) Wikipedia in Uyghur (Q60856)
wd add-reference $claim_guid P143 Q60856
```

##### special claim snaktypes
You can add [`novalue` and `somevalue`](https://www.wikidata.org/wiki/Help:Statements/en#Unknown_or_no_values) claims by passing the desired snaktype in a JSON object as values:
```sh
wd ac Q4115189 P1106 '{"snaktype":"novalue"}'
wd ac Q4115189 P1106 '{"snaktype":"somevalue"}'
```

#### wb update-claim
Update a claim value while keeping its qualifiers and references
```sh
wb update-claim <entity-id> <property> <old-value> <new-value>
# OR
wb update-claim <guid> <new-value>
# Alias:
wb uc <entity-id> <property> <old-value> <new-value>
wb uc <guid>
```

Examples:
```sh
# change the the Sandbox (Q4115189) Twitter account (P2002) from 'Zorglub' to 'Bulgroz'
wd update-claim Q4115189 P2002 Zorglub Bulgroz
# or using the claim's guid
wd uc 'Q4115189$F00E22C2-AEF7-4145-A743-2AB6292ABFA3' Bulgroz

# change a coordinate from Mars (Q112) to Venus (Q313)
wd uc Q4115189 P626 '{ "latitude": 18.65, "longitude": 226.2, "precision": 0.01, "globe": "http://www.wikidata.org/entity/Q111" }' '{ "latitude": 18.65, "longitude": 226.2, "precision": 0.01, "globe": "http://www.wikidata.org/entity/Q313" }'
# or using the claim's guid
wd uc 'Q4115189$F00E22C2-AEF7-4145-A743-2AB6292ABFA3' '{ "latitude": 18.65, "longitude": 226.2, "precision": 0.01, "globe": "http://www.wikidata.org/entity/Q313" }'
```

#### wb move-claim
Move claims from an entity to another and/or from a property to another
```sh
wb move-claim <guid|property-claims-id> <target-entity-id> <target-property-id>
# Alias
wb mc <guid|property-claims-id> <target-entity-id> <target-property-id>
```

Examples:
```sh
Q4115189_P19_claim_guid='Q4115189$13681798-47F7-4D51-B3B4-BA8C7E044E1F'

# change the property of a claim (without changing entity)
wb mc $Q4115189_P19_claim_guid Q4115189 P20
# move the claim to another entity (without changing the property)
wb mc $Q4115189_P19_claim_guid Q13406268 P19
# move the claim to another entity and another property
wb mc $Q4115189_P19_claim_guid Q13406268 P20

# move all Q4115189 P19 claims to P20 (without changing entity)'
wb mc Q4115189#P19 Q4115189 P20
# move all Q4115189 P19 claims to Q13406268 (without changing the property)'
wb mc Q4115189#P19 Q13406268 P19
# move all Q4115189 P19 claims to Q13406268 P20'
wb mc Q4115189#P19 Q13406268 P20
```

#### wb remove-claim
Remove a claim
```sh
wb remove-claim <guid>
# Alias:
wb rc <guid>
```

Examples:
```sh
# /!\ beware of the '$' sign that might need escaping
wd remove-claim "Q71\$BD9A4A9F-E3F9-43D4-BFDB-484984A87FD7"
# or simply
wd remove-claim 'Q71$BD9A4A9F-E3F9-43D4-BFDB-484984A87FD7'
# or several at a time (required to be claims on the same entity)
wd remove-claim 'Q71$BD9A4A9F-E3F9-43D4-BFDB-484984A87FD7' 'Q71$B8EE0BCB-A0D9-4821-A8B4-FB9E9D2B1251' 'Q71$2FCCF7DD-32BD-496C-890D-FEAD8181EEED'
```

### qualifiers
See [Wikidata:Glossary#Qualifier](https://www.wikidata.org/wiki/Wikidata:Glossary#Qualifier)

#### wb add-qualifier

Add a qualifier to a claim

```sh
wb add-qualifier <claim-guid> <property> <value>
# Alias:
wb aq <claim-guid> <property> <value>
```

Examples:

```sh
claim_guid='Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
# entity qualifier
wd add-qualifier $claim_guid P155 'Q13406268'

# string qualifier
wd aq $claim_guid P1545 'A-123'

# time qualifier
wd aq $claim_guid P580 '1802-02-26'

# quantity qualifier
wd aq $claim_guid P2130 123

# quantity qualifier with a unit
wd aq $claim_guid P2130 '{"amount":123,"unit":"Q4916"}'

# monolingualtext qualifier
wd aq $claim_guid P3132 "text=les sanglots long des violons de l'automne&language=fr"
```

##### special qualifier snaktypes
You can add [`novalue` and `somevalue`](https://www.wikidata.org/wiki/Help:Statements/en#Unknown_or_no_values) qualifiers by passing the desired snaktype in a JSON object as values:
```sh
claim_guid='Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
wd aq $claim_guid P1106 '{"snaktype":"novalue"}'
wd aq $claim_guid P1106 '{"snaktype":"somevalue"}'
```

#### wb update-qualifier

Update a qualifier from an existing value to a new value

```sh
wb update-qualifier <claim-guid> <property> <old-value> <new-value>
# Alias:
wb uq <claim-guid> <property> <old-value> <new-value>
```

Examples:

```sh
claim_guid='Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
# entity qualifier
wd update-qualifier $claim_guid P155 'Q13406268' 'Q3576110'

# string qualifier
wd uq $claim_guid P1545 'A-123' 'B-123'

# time qualifier
wd uq $claim_guid P580 '1802-02-26' '1802-02-27'

# quantity qualifier
wd uq $claim_guid P2130 123 124

# quantity qualifier with a unit
wd uq $claim_guid P2130 'amount=123&unit=Q4916' 'amount=124&unit=Q4916'

# monolingualtext qualifier
wd uq $claim_guid P3132 'text=aaah&language=fr' 'text=ach sooo&language=de'
```

#### wb move-qualifier
Move a claim from an entity to another and/or from a property to another
```sh
wb move-qualifier <guid> [hash] <old-property-id> <new-property-id>
# Alias
wb mq <guid> [hash] <old-property-id> <new-property-id>
```

Examples:
```sh
claim_guid='Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
# move all P2310 qualifiers of this claim to P2311
wb mq $claim_guid P2310 P2311

# move only the first P2310 qualifier to P2311
qualifier_hash=$(wb data 'Q549$3EDF7856-5BE5-445A-BC60-FB2CDDCDA44F' | jq -r '.qualifiers.P2310[0]')
wb mq $claim_guid $qualifier_hash P2310 P2311
```

#### wb remove-qualifier

```sh
wb remove-qualifier <claim-guid> <qualifiers-hashes>
# Alias:
wb rq <claim-guid> <qualifiers-hashes>
```

Examples:
```sh
claim_guid='Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
# Remove a qualifier from this claim
wd rq $claim_guid '24aa18192de7051f81d88d1ab514826002d51c14'
# Remove several qualifiers from this claim by passing the qualifier hashes as one argument made of several pipe-separated hashes
wd rq $claim_guid '24aa18192de7051f81d88d1ab514826002d51c14|f6c14e4eebb3d4f7595f0952c1ece0a34d85368b'}
```

### references
See [Wikidata:Glossary#Reference](https://www.wikidata.org/wiki/Wikidata:Glossary#Reference)

#### wb add-reference

Add a reference to an claim
```sh
wb add-reference <claim-guid> <property> <value>
# Alias:
wb ar <claim-guid> <property> <value>
```

Examples:
```sh
# Add a reference URL (P854) to this claim
# /!\ beware of the '$' sign that might need escaping
wd add-reference "Q4115189\$E66DBC80-CCC1-4899-90D4-510C9922A04F" P854 'https://example.org/rise-and-box-of-the-holy-sand-box'
# or simply
wd add-reference 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F' P854 'https://example.org/rise-and-box-of-the-holy-sand-box'
# Reference the claim as imported from (P143) Wikipedia in Uyghur (Q60856)
wd add-reference 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F' P143 Q60856
# or simply
wd ar 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F' P143 Q60856
```

See [*add claim with a reference*](https://github.com/maxlath/wikibase-cli/blob/master/docs/write_operations.md#with-a-reference) for a workflow example to easily get the claim `guid`

For more advanced use cases, such as adding several references to a claim, you should rather use [`edit-entity`](#wb-edit-entity):

```js
// Q4115189.json
{
  "id": "Q4115189",
  "claims": {
    "P31": [
      {
        "id": "Q4115189$cfbe452f-459a-d7b0-f57c-f6d816f33e19",
        "value": "Q1",
        "references": [
          {
            "P248": "Q142667",
            "P813": "2020-03-13"
          },
          {
            "P854": "http://example.org/some-article",
            "P813": "2020-03-13"
          }
        ]
      }
    ]
  }
}
```
```bash
wd ee ./Q4115189.json
```
**NB**: This is not just an addition anymore, it would replace any existing references on the claim `Q4115189$cfbe452f-459a-d7b0-f57c-f6d816f33e19`

#### wb remove-reference

Remove a reference from a claim
```sh
wb remove-reference <claim-guid> <references-hashes>
# Alias:
wb rr <claim-guid> <references-hashes>
```

Examples:
```sh
# Remove a reference from this claim
wd remove-reference 'Q4115189$E51978A1-D13A-4916-800E-74ACD2466970' '72ea3cdd27062da9f0971c1feab6df32d729ecb3'
# Remove several references from this claim by passing the reference hashes as one argument made of several pipe-separated hashes
wd remove-reference 'Q4115189$E51978A1-D13A-4916-800E-74ACD2466970' '72ea3cdd27062da9f0971c1feab6df32d729ecb3|5e9840f6896948b13d6e9c6328169643229aa3db'}
```

### entity
See [Wikidata:Glossary#Entity](https://www.wikidata.org/wiki/Wikidata:Glossary#Entity)

#### wb create-entity

Create a new entity (currently supported types: item, property)

```sh
# Pass data as JSON
wd create-entity '{"labels":{"en":"a label","fr":"un label"},"descriptions":{"en":"some description","fr":"une description"},"claims":{"P1775":["Q3576110","Q12206942"],"P2002":"bulgroz"}}'

# Pass data as a JSON file
wb create-entity ./new_entity_data.json

# Alias:
wb ce <entity-data>
```

Assuming that you have the proper authorization, **creating a property** can as simple as:
```sh
wb create-entity '{ "datatype": "string", "labels": { "en": "some new string property" } }'
```

Other that the `datatype` and the absence of `id`, the `create-entity` command is identical to the [`edit-entity` command](#wb-edit-entity).

See [`wikibase-edit` documentation on `entity.create`](https://github.com/maxlath/wikibase-edit/blob/master/docs/how_to.md#create-entity) for details on the input format.

**Demo**: [Creating a new entity with the same references being used multiple times](https://github.com/maxlath/wikibase-cli/blob/master/docs/examples/new_entity_with_the_same_references_being_used_multiple_times.js)

#### wb edit-entity

Edit an existing item (currently supported types: item, property)

```sh
wb edit-entity <inline-entity-json|file-path>
# Alias:
wb ee <inline-entity-json|file-path>
```

See [`wikibase-edit` documentation on `entity.edit`](https://github.com/maxlath/wikibase-edit/blob/master/docs/how_to.md#edit-entity) for details on the expected input format, especially on how to set complex values, qualifiers and references, or remove existing data.

##### Pass data as inline JSON
Pass data as inline JSON.
```sh
wd edit-entity '{"id":"Q4115189", "labels":{"en":"a label","fr":"un label"},"descriptions":{"en":"some description","fr":"une description"},"claims":{"P1775":["Q3576110","Q12206942"],"P2002":"bulgroz"}}'
```
It works, but writting JSON by hand is very sub-optimal, even painful.

##### Pass data as a JSON file
Taking our JSON data from a file can be much more convenient than the inline option above, as it can be generated from other commands, or manually edited with the help of smart text editors that might help you with the syntax.

```sh
wb edit-entity ./existing_entity_data.json
```

This `./existing_entity_data.json` file could be generated in different ways, but the easiest is to use the [`generate-template` command](https://github.com/maxlath/wikibase-cli/blob/master/docs/read_operations.md#wd-generate-template):
```sh
wd generate-template Q4115189 --format json > Q4115189.json
# Do your modifications, and then
wb edit-entity ./Q4115189.json
```

The JSON syntax remains heavy with all those `"` though, if you are not generating it somehow and simply writting your data file by hand, you might be better of going with a JS file (see below).

##### Pass data as a static JS object file
The JavaScript object notation is very similar to JSON (thus the name of the later), but much lighter, which is very convenient when editing data manually.

```sh
wb edit-entity ./existing_entity_data.js
```

This `./existing_entity_data.js` could be something like:
```js
module.exports = {
  id: 'Q4115189',
  // a comment
  labels: { en: 'a label' },
  claims: {
    P123: 'Q1799264'
  }
}
```

##### Pass data as a dynamic JS function file returning an object
**This is the recommended way** as it gives you a crazy amount of flexibility :D

It's basically the same as the above JS file approach, but instead of returning an object, the JS file exports a function. All additional command line arguments will be passed to that function.

For instance, to add different P1449 and P1106 values to different entities, you could write a JS file like this:
```js
// add_P1449_and_P1106.js
module.exports = (id, someString, quantity) => ({
  id: id,
  claims: {
    P1449: someString,
    P1106: parseInt(quantity)
  }
})
```
that can then be called as follow:
```sh
wb edit-entity ./add_P1449_and_P1106.js Q1 abc 123
wb edit-entity ./add_P1449_and_P1106.js Q2 def 456
wb edit-entity ./add_P1449_and_P1106.js Q3 ghi 789
```

This way, you can generate infinitely flexible templates.

A good way to start writting a template function starting from an existing entity is to use the [`generate-template` command](https://github.com/maxlath/wikibase-cli/blob/master/docs/read_operations.md#wd-generate-template):
```sh
# When generating templates for only one entity, JS is the default format, and comes with helpful labels as comments, to make ids less obscure
wd generate-template Q4115189 > Q4115189.js
# Do your modifications, and then
wd edit-entity ./Q4115189.js
```

Some examples of how such a dynamic template can be useful:

###### transform input
```js
const doSomeComplexTransformation = quantity => parseInt(quantity) * 2

module.exports = (id, quantity) => ({
  id,
  claims: {
    P1106: doSomeComplexTransformation(quantity)
  }
})
```

**Demo**: See how this principle was applied to create many items from a single JS template file: [Create missing HTTP Status Codes items on Wikidata](https://github.com/maxlath/wikidata-scripting/tree/master/http_status_codes)

###### fetch additional data
The exported function can be an async function, so you could fetch data during the transformation process:
```js
const fetchSomeData = require('./fetch_some_data.js')
const doSomeComplexTransformation = async quantity => quantity * 2

module.exports = async (id, someExternalId) => {
  const initialQuantity = await fetchSomeData(someExternalId)
  const finalQuantity = await doSomeComplexTransformation(initialQuantity)
  return {
    id,
    claims: {
      P1106: finalQuantity
    }
  }
}
```

###### inspect generated data
To inspect the data generated dynamically, you can use the `--dry` option
```sh
wb ee ./template.js Q1 abc 123 --dry
```

#### wb merge-entity
Merge an entity into another (See [wd:Help:Merge](https://www.wikidata.org/wiki/Help:Merge))
```sh
# Merge an item (Q1) into another (Q2)
wb merge-entity Q1 Q2
# Alias:
wb me <from-id> <to-id>
```

#### wb delete-entity
Delete an entity (See [mw:Page deletion](https://www.mediawiki.org/wiki/Manual:Page_deletion))
```sh
# Delete an item
wb delete-entity Q1
# Delete a property
wb delete-entity P1
# Alias:
wb de <entity-id>
```

### edit summary
> It's good practice to fill in the Edit Summary field, as it helps everyone to understand what is changed, such as when perusing the history of the page.
[[source](https://meta.wikimedia.org/wiki/Help:Edit_summary)]

For any of the edit commands, you can add a `-s, --summary` parameter to comment your edit:
```
wb add-alias Q4115189 fr "lorem ipsum" --summary 'this HAD to be changed!'
```

### batch mode
**All write operations commands accept a `-b, --batch` option**. In batch mode, arguments are provided on the command [standard input (`stdin`)](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)), with one operation per line. If the edited Wikibase instance is Wikidata, batch edits will automatically be grouped within an [Edit groups](https://www.wikidata.org/wiki/Wikidata:Edit_groups); you are thus encouraged to set a summary (with the [`-s, --summary` option](#edit-summary)) as it will be used as label for the edit group ([example](https://tools.wmflabs.org/editgroups/b/wikibase-cli/b941fa220ab7b/)).

So instead of:
```sh
wb add-claim Q1 P123 123
wb add-claim Q2 P124 'multiple words value'
wb add-claim Q3 P125 '{ "time": "1800", "precision": 7 }'

wb create-entity '{"labels":{"en":"foo"}}'
wb create-entity '{"labels":{"en":"bar"}}'
wb create-entity '{"labels":{"en":"buzz"}}'

wb edit-entity ./template.js Q1 abc 123
wb edit-entity ./template.js Q2 def 456
wb edit-entity ./template.js Q3 ghi 789
```
you can write:
```sh
# NB: simple arguments without spaces (such as in the 1st case hereafter)
# don't need to be wrapped in a JSON array, but it is required for arguments
# that would be harder/error-prone to parse otherwise (2nd and 3rd cases hereafter)
echo '
Q1 P123 123
[ "Q2", "P124", "multiple words value" ]
[ "Q3", "P125", { "time": "1800", "precision": 7 } ]
' | wb add-claim --batch

echo '
{"labels":{"en":"foo"}}
{"labels":{"en":"bar"}}
{"labels":{"en":"buzz"}}
' | wb create-entity --batch

echo '
./template.js Q1 abc 123
./template.js Q2 def 456
./template.js Q3 ghi 789
' | wb edit-entity --batch
```

Or more probably passing those arguments from a file:
```sh
cat ./add_claim_newline_separated_command_args | wb add-claim --batch
cat ./create_entity_newline_separated_command_args | wb create-entity --batch
cat ./edit_entity_newline_separated_command_args | wb edit-entity --batch

# Which can also be written
wb add-claim --batch < ./add_claim_newline_separated_command_args
wb create-entity --batch < ./create_entity_newline_separated_command_args
wb edit-entity --batch < ./edit_entity_newline_separated_command_args

# Or using the short command and option names
wb ac -b < ./add_claim_newline_separated_command_args
wb ce -b < ./create_entity_newline_separated_command_args
wb ee -b < ./edit_entity_newline_separated_command_args
```

#### Batch process logs
The command output (`stdout`) will be made of one Wikibase API response per line, while `stderr` will be used for both progression logs and error messages. For long lists of commands, you could write those outputs to files to keep track of what was done, and, if need be, where the process exited if an error happened. This can be done this way:
```sh
# Redirect stdout and stderr to files
wb ac -b < ./args_list > ./args_list.log 2> ./args_list.err
# In another terminal, start a `tail` process at any time to see the progression. This process can be interrupted without stoppping the batch process
tail -f ./args_list.log ./args_list.err
```

#### Handle batch errors
If one of the batch operation encounters an error, the default behavior is to stop the batch there, the last line logged on `stdout` being the line that triggered the error, the error itself being logged on `stderr`.

In case you would prefer to continue to process the batch rather than exiting, you can set the `--no-exit-on-error` option:
```sh
wb add-claim --batch --no-exit-on-error < ./args_list > ./args_list.log 2> ./args_list.err
```
This can come handy for long batches, where you might encounter errors such as edit conflicts.

### Options
Options common to all edit operations

#### maxlag
Set the [`maxlag`](https://www.mediawiki.org/wiki/Manual:Maxlag_parameter) value (see also [config#maxlag](./config.md#maxlag))

The default value is `5`, meaning that you will tell the server that you accept to wait if the server has a lag of 5 seconds or more.

If you are not in a hurry, you can set an even nicer value, like `2`
```sh
wb add-claim Q4115189 P1106 123 --maxlag 2
```
If you want that command to be done already, you can go for a more aggresive value and be done with it
:warning: should be avoided when you have a long command queue, typically in --batch mode
```sh
wb add-claim Q4115189 P1106 123 --maxlag 100
```

### [Demos](https://github.com/maxlath/wikidata-scripting)
