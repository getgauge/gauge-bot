# gauge-bot

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

> A GitHub App built with [Probot](https://github.com/probot/probot)

## Setup

Set following environment variables :-

APP_ID=the id of the gaugebot app

WEBHOOK_PROXY_URL=a proxy URL which will redirect the github payload to localhost (use smee.io)

PRIVATE_KEY_PATH=private key (certificate) for the gaugebot app.

CLIENT_ID=the client id for the app.

CLIENT_SECRET=client secret for the app

CONTRIBUTOR_URL= a secret url to list the available contributors

APP_URL=the app url.

```sh
# Install dependencies
npm install

# Run the bot
npm run dev
```

## License

[ISC](LICENSE) © 2018 BugDiver <vinaysh@thoughtworks.com>
