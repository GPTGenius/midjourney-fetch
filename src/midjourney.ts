import { configs } from './config';
import type {
  MessageAttachment,
  MessageItem,
  MidjourneyProps,
} from './interface';
import { findMessageByPrompt, isInProgress } from './utils';

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

  async interactions(prompt: string) {
    const payload = {
      type: 2,
      application_id: '936929561302675456',
      guild_id: this.serverId,
      channel_id: this.channelId,
      session_id: 'ab318945494d4aa96c97ce6fce934b97',
      data: {
        version: '1077969938624553050',
        id: '938956540159881230',
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
          id: '938956540159881230',
          application_id: '936929561302675456',
          version: '1077969938624553050',
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
    };

    const res = await fetch(`https://discord.com/api/v9/interactions`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token,
      },
    });
    if (res.status >= 400) {
      let message = '';
      try {
        const data = await res.json();
        if (this.debugger) {
          this.log('Interactions failed', JSON.stringify(data));
        }
        message = data?.message;
      } catch (e) {
        // catch JSON error
      }
      throw new Error(message || `Interactions failed with ${res.status}`);
    }
  }

  async getMessage(prompt: string) {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${this.channelId}/messages?limit=50`,
      {
        headers: {
          Authorization: this.token,
        },
      }
    );
    const data: MessageItem[] = await res.json();
    const message = findMessageByPrompt(data, prompt);
    this.log(JSON.stringify(message), '\n');
    return message;
  }

  /**
   * Same with /imagine command
   */
  async imagine(prompt: string) {
    await this.interactions(prompt);
    const times = this.timeout / this.interval;
    let count = 0;
    let image: MessageAttachment | null = null;
    while (count < times) {
      try {
        count += 1;
        await new Promise((res) => setTimeout(res, this.interval));
        this.log(count);
        const message = await this.getMessage(prompt);
        if (message && !isInProgress(message)) {
          [image] = message.attachments;
          break;
        }
      } catch {
        continue;
      }
    }
    return image ? [image] : [];
  }
}
