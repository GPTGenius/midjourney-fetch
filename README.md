# midjourney-fetch
[![npm version](https://img.shields.io/npm/v/midjourney-fetch.svg)](https://www.npmjs.com/package/midjourney-fetch) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/GPTGenius/midjourney-fetch/ci.yml?branch=main) ![node-current (scoped)](https://img.shields.io/node/v/midjourney-fetch) ![GitHub](https://img.shields.io/github/license/GPTGenius/midjourney-fetch)

Fetch api for midjourney on discord

## Usage
```typescript
import { Midjourney } from 'midjourney-fetch'

const midjourney = new Midjourney({
  channelId: 'your channelId',
  serverId: 'your serverId',
  token: 'your token',
})

const images = await midjourney.imagine('your prompt')

console.log(images[0].url)
```

## How to get Ids and Token
- [How to find ids](https://docs.statbot.net/docs/faq/general/how-find-id/)
- [Get discord token](https://www.androidauthority.com/get-discord-token-3149920/)

## License
Based on [MIT License](./LICENSE)
