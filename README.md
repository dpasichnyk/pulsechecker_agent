# IMP

In-Memory-Pool (IMP) is a proxy pool rotator that requests target websites with given properties through select proxies

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
git clone git@github.com:preisanalytics/imp.git
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

### Central service

The project won't run properly without central providing some form of configuration to IMP.
When you're not planning to run central right along it, you can spin up
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

**NODE_ENV**

When set to `production` it will enable certain things like APM with a loglevel `warn`.

**APM_DEBUG**

Can be set to 1 (in development the endpoint is automatically set to `null`, use **APM_ENDPOINT** to define your own)
to print the metrics to stdout which would be sent to APM.

**APM_ENDPOINT**

Set the APM endpoint to a new URL. Default is `http://apm-server.infra-metrics-apm:8200`

**DEFAULT_CNFIG_FILE**

Points to a relative or absolute config file path (i.e. `./config/config.json`)

**REDIS_URL**

The redis server in url format that IMP uses as backend.

**METRICS_URL_PATH**

Points to a file containing the logstash endpoint url. (defaults to `node/metric_url`)

**METRIC_SENDER_TYPE**

Sets the metric sender type (defaults to `tcp`)

**PORT**

Server port for the http server to use (defaults to `3000`)

**LOG_LEVEL**

Sets the log level for the application. (defaults to `debug` for development and `warn` for production)

**CENTRAL_BASE_URL**

Sets the http endpoint base url for the central service. (defaults to `http://localhost:3001` consisting of
the current hostname the server is run on and the **PORT** setting plus 1, this is where the dummy config
server is run on for development)

## Documentation

Find the Architecture Design Records here: [ADRs](doc/adr)
