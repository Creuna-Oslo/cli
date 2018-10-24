# ![Creuna CLI](source/creuna.png?raw=true "Creuna CLI")

[![npm version](https://img.shields.io/npm/v/@creuna/cli.svg?style=flat)](https://www.npmjs.com/package/@creuna/cli)
[![Travis status](https://travis-ci.org/Creuna-Oslo/cli.svg?branch=master)](https://travis-ci.org/Creuna-Oslo/cli)

`@creuna/cli` provides a unified interface for:

- [create-react-app](https://github.com/Creuna-Oslo/create-react-app)
- [react-scripts](https://github.com/Creuna-Oslo/react-scripts)
- [react-components](https://github.com/Creuna-Oslo/react-components)

### Install

```
yarn global add @creuna/cli
```

or

```
npm install -g @creuna/cli
```

### Usage

Print help:

```
creuna
```

Run commands:

```
creuna <command>
```

### Commands

#### new \<relative-path>

Creates a new React app in the **current working directory**. If a `path` is provided, files will be written to this path, **relative** to the current working directory

#### lib

Select and download components from the React component library.

#### component \<name>

Create empty React component in your components folder.

#### page \<name> \<human-readable-name>

Create empty static site page component in your static site pages folder (Useful if you're working with an app created with the `new` command)

### rename <old-name> <new-name>

Rename React component. Supports absolute path or path relative to `componentsPath`.

### stateful <component-name>

Convert React component to stateful. Supports absolute path or path relative to `componentsPath`

### stateless <component-name>

Convert React component to stateless if able to. Supports absolute path or path relative to `componentsPath`

### Notes

All commands except `creuna new` support a `.creunarc.json` in your project root. Having this file ensures that components are always added to the correct folder, regardless of your current directory (within the project of course). The boilerplate app created by `creuna new` includes this file.

#### .creunarc.json

```json
{
  "componentsPath": "relative/path/to/components",
  "staticSitePath": "relative/path/to/static/site/pages"
}
```
