<objective>
Pin the CozyStack release version in the enigma-cozy stack and configure Renovatebot to automatically track and update this version.

This enables:
1. Reproducible deployments by tracking the exact CozyStack version
2. Automated dependency updates via Renovatebot
3. Clear visibility into which version is deployed
4. Flexible structure that can track multiple dependencies in the future
</objective>

<context>
Stack location: `stacks/enigma-cozy/package.json`
Renovate config: `renovate.json` (root of repository)
Latest CozyStack release: v0.38.3 (from https://github.com/cozystack/cozystack/releases)
GitHub repository: cozystack/cozystack
</context>

<requirements>
**Part 1: Update package.json with dependency tracking structure**

Add a `dependencies` object to nx.metadata in `stacks/enigma-cozy/package.json` where keys are dependency names and values contain version and datasource:

```json
{
  "nx": {
    "metadata": {
      "dependencies": {
        "cozystack/cozystack": {
          "version": "v0.38.3",
          "datasource": "github-releases"
        }
      }
    }
  }
}
```

This structure:
- Uses dependency name as the key for easy access (e.g., `.dependencies["cozystack/cozystack"].version`)
- Stores version and datasource as values
- Supports multiple dependencies by adding more keys
- Makes the package.json self-documenting about what it tracks

**Part 2: Configure Renovatebot JSONata manager**

Add a customManagers entry to `renovate.json` that:
- Uses the JSONata manager (`customType: "jsonata"`)
- Matches `stacks/*/package.json` files
- Uses a JSONata query with `$each()` to iterate over the dependencies object

JSONata query pattern using $each to iterate over object keys:
```
$each(nx.metadata.dependencies, function($v, $k) { { "depName": $k, "currentValue": $v.version, "datasource": $v.datasource } })
```

This query iterates over each key-value pair in the dependencies object, using the key as depName and extracting version/datasource from the value.
</requirements>

<implementation>
For the package.json structure:

```json
{
  "name": "enigma-cozy",
  "nx": {
    "metadata": {
      "dependencies": {
        "cozystack/cozystack": {
          "version": "v0.38.3",
          "datasource": "github-releases"
        }
      }
    }
  }
}
```

For the Renovate JSONata manager configuration:

```json
{
  "customManagers": [
    {
      "customType": "jsonata",
      "fileFormat": "json",
      "managerFilePatterns": ["stacks/*/package.json"],
      "matchStrings": [
        "$each(nx.metadata.dependencies, function($v, $k) { { \"depName\": $k, \"currentValue\": $v.version, \"datasource\": $v.datasource } })"
      ]
    }
  ]
}
```

Key points:
- `fileFormat` must be "json" for package.json files
- `managerFilePatterns` uses glob pattern to match all stack package.json files
- The JSONata `$each()` function iterates over the dependencies object
- `$k` is the key (dependency name), `$v` is the value object (version + datasource)
- Adding more dependencies is as simple as adding another key to the object
- Access specific versions easily: `.dependencies["cozystack/cozystack"].version`
</implementation>

<output>
Modify files:
- `./stacks/enigma-cozy/package.json` - Add nx.metadata.dependencies object with cozystack entry
- `./renovate.json` - Add customManagers array with JSONata configuration
</output>

<verification>
1. Verify package.json has valid JSON syntax: `cat stacks/enigma-cozy/package.json | jq .`
2. Verify renovate.json has valid JSON syntax: `cat renovate.json | jq .`
3. Verify the cozystack version can be extracted: `cat stacks/enigma-cozy/package.json | jq -r '.nx.metadata.dependencies["cozystack/cozystack"].version'`
4. Expected output: `v0.38.3`
</verification>

<success_criteria>
- package.json contains nx.metadata.dependencies object with "cozystack/cozystack" key
- Each dependency value has version and datasource fields
- renovate.json contains a customManagers entry with JSONata configuration using $each()
- Both files have valid JSON syntax
- Version is extractable via simple jq key access
</success_criteria>
