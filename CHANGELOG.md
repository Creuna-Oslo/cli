# 2.3.2

- Upgrades `@creuna/react-scripts` from `4.0.1` to `4.0.3`

# 2.3.1

- Upgrade all dependencies

# 2.3.0

[https://github.com/Creuna-Oslo/cli/pull/52]()

- Adds `codegen` task to `.vscode/tasks.json` ([issue 51](https://github.com/Creuna-Oslo/cli/issues/51))
- Upgrades `@creuna/create-react-app` from `5.2.0` to `5.2.1`

# 2.2.0

[https://github.com/Creuna-Oslo/cli/pull/49]()

- Upgrades `@creuna/create-react-app` from `5.0.2` to `5.1.0`
- Upgrades other dependencies and dev dependencies to latest version

# 2.1.2

[https://github.com/Creuna-Oslo/cli/pull/48]()

- Upgrades `@creuna/react-scripts` from `4.0.0` to `4.0.1` ([https://github.com/Creuna-Oslo/react-scripts/pull/24]())

# 2.1.1

[https://github.com/Creuna-Oslo/cli/pull/47]()

- Upgrades `@creuna/create-react-app` ([updates browserslist query](https://github.com/Creuna-Oslo/create-react-app/pull/49))

# 2.1.0

[https://github.com/Creuna-Oslo/cli/pull/46]()

- Fixes [issue 28](https://github.com/Creuna-Oslo/cli/issues/28) (Slow startup times)
- Fixes [issue 43](https://github.com/Creuna-Oslo/cli/issues/43) (Add VS Code task for `lib`)
- Fixes [issue 44](https://github.com/Creuna-Oslo/cli/issues/44) (Fail gracefully when `.creunarc.json` is malformed)
- Fixes [issue 45](https://github.com/Creuna-Oslo/cli/issues/45) (Version check causes process to terminate way too late)

# 2.0.0

[https://github.com/Creuna-Oslo/cli/pull/42]()

- Upgrades `@creuna/create-react-app` from `4.1.1` to `5.0.1`
  - The app generated with `creuna new` has had a major overhaul. See [https://github.com/Creuna-Oslo/create-react-app/pull/41]()
- Upgrades `@creuna/react-scripts` from `3.2.3` to `4.0.0`
  - Breaking: This version requires a `staticSitePath` instead of `mockupPath` in `.creunarc.json`
  - Breaking: New comment syntax for metadata in pages generated with `creuna page`

# 1.3.1

[https://github.com/Creuna-Oslo/cli/pull/41/files]()

- Upgrades all dependencies
  - upgrades `@creuna/create-react-app` from `3.0.0` to `4.1.1`
  - upgrades `@creuna/react-scripts` from `3.0.0` to `3.2.3`
- Adds support for setting `dataFileExtension` and `dataFileContent` in `.creunarc.json`, which affects the static data file written by the `creuna page` command.
- Adds changelog
