# gauge-bot

> A GitHub App built with [Probot](https://github.com/probot/probot)

## Setup

Set follwing environment variables :-

APP_ID=the id of the gaugebot app

WEBHOOK_PROXY_URL=a proxy URL which will redirect the github payload to localhost ( use smee.io)

PRIVATE_KEY_PATH=private key (crtificate) for the gaugebot app.

CLIENT_ID=the client id for the app.

CLIENT_SECRET=cleint secret for the app

CONTRIBUTOR_URL= a secret url to list the availabe contributors

APP_URL=the app url.

```sh
# Install dependencies
npm install

# Run the bot
npm run dev
```

## License

[ISC](LICENSE) © 2018 BugDiver <vinaysh@thoughtworks.com>
