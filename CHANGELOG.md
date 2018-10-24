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
