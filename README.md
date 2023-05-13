# midjourney-fetch
[![npm version](https://img.shields.io/npm/v/midjouryney-fetch.svg)](https://www.npmjs.com/package/midjouryney-fetch) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/GPTGenius/midjouryney-fetch/ci.yml?branch=main) ![node-current (scoped)](https://img.shields.io/node/v/midjouryney-fetch) ![GitHub](https://img.shields.io/github/license/GPTGenius/midjouryney-fetch)

Fetch api for midjournery on discord

## Usage
```typescript
import { Midjourney } from 'midjourney-fetch'

const midjouryney = new Midjouryney({
  channelId: 'your channelId',
  serverId: 'your serverId',
  discordToken: 'your discordToken',
})

const images = await midjouryney.imagine('your prompt')

console.log(images[0].url)
```

## How to get Ids and Token
- [How to find ids](https://docs.statbot.net/docs/faq/general/how-find-id/)
- [Get discord token](https://www.androidauthority.com/get-discord-token-3149920/)

## License
Based on [MIT License](./LICENSE)
