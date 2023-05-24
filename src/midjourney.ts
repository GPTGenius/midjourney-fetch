import { DiscordSnowflake } from '@sapphire/snowflake';
import { configs, defaultSessionId, midjourneyBotConfigs } from './config';
import type {
  MessageItem,
  MessageType,
  MessageTypeProps,
  MidjourneyProps,
  UpscaleProps,
} from './interface';
import {
  findMessageByPrompt,
  getHashFromCustomId,
  isInProgress,
} from './utils';

export class Midjourney {
  protected readonly channelId: string;

  protected readonly serverId: string;

  protected readonly token: string;

  timeout: number;

  interval: number;

  debugger: boolean;

  constructor(props: MidjourneyProps) {
    const {
      channelId,
      serverId,
      token,
      timeout = configs.timeout,
      interval = configs.interval,
    } = props;
    this.channelId = channelId;
    this.serverId = serverId;
    this.token = token;

    this.timeout = timeout;
    this.interval = interval;

    this.debugger = false;
  }

  protected log(...args: any) {
    if (this.debugger) {
      console.log(...args);
    }
  }

  async interactions(payload: any) {
    return fetch(`https://discord.com/api/v9/interactions`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token,
      },
    });
  }

  async createImage(prompt: string) {
    const payload = {
      type: 2,
      application_id: midjourneyBotConfigs.applicationId,
      guild_id: this.serverId,
      channel_id: this.channelId,
      session_id: defaultSessionId,
      data: {
        version: midjourneyBotConfigs.version,
        id: midjourneyBotConfigs.id,
        name: 'imagine',
        type: 1,
        options: [
          {
            type: 3,
            name: 'prompt',
            value: prompt,
          },
        ],
        application_command: {
          id: midjourneyBotConfigs.id,
          application_id: midjourneyBotConfigs.applicationId,
          version: midjourneyBotConfigs.version,
          default_permission: true,
          default_member_permissions: null,
          type: 1,
          nsfw: false,
          name: 'imagine',
          description: 'Create images with Midjourney',
          dm_permission: true,
          contexts: null,
          options: [
            {
              type: 3,
              name: 'prompt',
              description: 'The prompt to imagine',
              required: true,
            },
          ],
        },
        attachments: [],
      },
      nonce: DiscordSnowflake.generate().toString(),
    };

    const res = await this.interactions(payload);
    if (res.status >= 400) {
      let message = '';
      try {
        const data = await res.json();
        if (this.debugger) {
          this.log('Create image failed', JSON.stringify(data));
        }
        message = data?.message;
      } catch (e) {
        // catch JSON error
      }
      throw new Error(message || `Create image failed with ${res.status}`);
    }
  }

  async createUpscaleOrVariation(
    type: Exclude<MessageType, 'imagine'>,
    { messageId, customId }: UpscaleProps
  ) {
    const payload = {
      type: 3,
      nonce: DiscordSnowflake.generate().toString(),
      guild_id: this.serverId,
      channel_id: this.channelId,
      message_flags: 0,
      message_id: messageId,
      application_id: midjourneyBotConfigs.applicationId,
      session_id: defaultSessionId,
      data: {
        component_type: 2,
        custom_id: customId,
      },
    };
    const res = await this.interactions(payload);
    if (res.status >= 400) {
      let message = '';
      try {
        const data = await res.json();
        if (this.debugger) {
          this.log(`Create ${type} failed`, JSON.stringify(data));
        }
        message = data?.message;
      } catch (e) {
        // catch JSON error
      }
      throw new Error(message || `Create ${type} failed with ${res.status}`);
    }
  }

  async getMessage(prompt: string, options: MessageTypeProps) {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${this.channelId}/messages?limit=50`,
      {
        headers: {
          Authorization: this.token,
        },
      }
    );
    const data: MessageItem[] = await res.json();
    const message = findMessageByPrompt(data, prompt, options);
    this.log(JSON.stringify(message), '\n');
    return message;
  }

  /**
   * Same with /imagine command
   */
  async imagine(prompt: string) {
    const timestamp = new Date().toISOString();

    await this.createImage(prompt);

    const times = this.timeout / this.interval;
    let count = 0;
    let result: MessageItem | undefined;
    while (count < times) {
      try {
        count += 1;
        await new Promise((res) => setTimeout(res, this.interval));
        this.log(count, 'imagine');
        const message = await this.getMessage(prompt, { timestamp });
        if (message && !isInProgress(message)) {
          result = message;
          break;
        }
      } catch {
        continue;
      }
    }
    return result;
  }

  async upscale({ prompt, ...params }: UpscaleProps & { prompt: string }) {
    const { index } = getHashFromCustomId('upscale', params.customId);
    const times = this.timeout / this.interval;
    let count = 0;
    let result: MessageItem | undefined;

    if (!index) {
      throw new Error('Create upscale failed with 400, unknown customId');
    }

    const timestamp = new Date().toISOString();

    await this.createUpscaleOrVariation('upscale', params);

    while (count < times) {
      try {
        count += 1;
        await new Promise((res) => setTimeout(res, this.interval));
        this.log(count, 'upscale');
        const message = await this.getMessage(prompt, {
          type: 'upscale',
          index,
          timestamp,
        });
        if (message && !isInProgress(message)) {
          result = message;
          break;
        }
      } catch {
        continue;
      }
    }
    return result;
  }

  async variation({ prompt, ...params }: UpscaleProps & { prompt: string }) {
    const { index } = getHashFromCustomId('variation', params.customId);
    const times = this.timeout / this.interval;
    let count = 0;
    let result: MessageItem | undefined;

    if (!index) {
      throw new Error('Create variation failed with 400, unknown customId');
    }

    const timestamp = new Date().toISOString();

    await this.createUpscaleOrVariation('variation', params);

    while (count < times) {
      try {
        count += 1;
        await new Promise((res) => setTimeout(res, this.interval));
        this.log(count, 'variation');
        const message = await this.getMessage(prompt, {
          type: 'variation',
          index,
          timestamp,
        });
        if (message && !isInProgress(message)) {
          result = message;
          break;
        }
      } catch {
        continue;
      }
    }
    return result;
  }
}
