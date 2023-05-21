# midjourney-fetch
[![npm version](https://img.shields.io/npm/v/midjourney-fetch.svg)](https://www.npmjs.com/package/midjourney-fetch) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/GPTGenius/midjourney-fetch/ci.yml?branch=main) ![node-current (scoped)](https://img.shields.io/node/v/midjourney-fetch) ![GitHub](https://img.shields.io/github/license/GPTGenius/midjourney-fetch)

Fetch api for midjourney on discord

## Usage
### imagine
```typescript
import { Midjourney } from 'midjourney-fetch'

const midjourney = new Midjourney({
  channelId: 'your channelId',
  serverId: 'your serverId',
  token: 'your token',
})

const data = await midjourney.imagine('your prompt')

// generated image url
console.log(data.attachments[0].url)
```

### upscale
```typescript
import { Midjourney } from 'midjourney-fetch'

const midjourney = new Midjourney({
  channelId: 'your channelId',
  serverId: 'your serverId',
  token: 'your token',
})

const image = await midjourney.imagine('your prompt')

const data = await midjourney.upscale('your prompt', {
  messageId: image.id,
  index: 1,
  // custom_id could be found at image.component, for example: MJ::JOB::upsample::1::0c266431-26c6-47fa-bfee-2e1e11c7a66f
  customId: 'component custom_id'
})

// generated image url
console.log(data.attachments[0].url)
```

## How to get Ids and Token
- [How to find ids](https://docs.statbot.net/docs/faq/general/how-find-id/)
- [Get discord token](https://www.androidauthority.com/get-discord-token-3149920/)

## License
Based on [MIT License](./LICENSE)
