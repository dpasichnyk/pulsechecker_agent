# Agent

## Installation and Setup

### asdf

Install asdf from their [github](https://github.com/asdf-vm/asdf.git) page

### nodejs

Install nodejs for your user and update dependencies using asdf

```bash
asdf plugin-add nodejs
bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring
asdf install nodejs 11.8.0
asdf global nodejs 11.8.0
npm install -g npm
npm install -g yarn
```

## Project

Grab the github repo and clone it into your local project folder

```bash
git clone git@github.com:dpasechnik/pulsechecker_agent.git
```

## Testing

To run all tests:
```bash
yarn run test
```

To check test coverage:
```bash
yarn run test --coverage
```

## Running the project

```bash
$ yarn run configsrv
```

It will attempt to connect and serve the `config.bak.json` from root folder to `localhost:3000`.

### Use Docker

Build the container and run it, usual stuff...

### Manually

```bash
$ yarn install
$ yarn run dev # Dev mode - auto-reload and compile OR
$ yarn run build && yarn run start # Production mode
```

## Runtime

### Environment

## Documentation

Find the Architecture Design Records here: [ADRs](doc/adr)
