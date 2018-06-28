# ![Creuna CLI](source/creuna.png?raw=true "Creuna CLI")

[![npm version](https://img.shields.io/npm/v/@creuna/cli.svg?style=flat)](https://www.npmjs.com/package/@creuna/cli)
[![Travis status](https://img.shields.io/travis/Creuna-Oslo/cli.svg?style=flat)](https://travis-ci.org/Creuna-Oslo/cli)

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

```
creuna
```

### Notes

All commands except `creuna new` require a `.creunarc.json` in your project root. If you run `creuna new` you'll get this for free. 😎

#### .creunarc.json

```json
{
  "componentsPath": "relative/path/to/components",
  "mockupPath": "relative/path/to/mockup"
}
```
