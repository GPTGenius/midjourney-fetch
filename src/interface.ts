export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] | undefined;
};

export interface MidjourneyProps {
  channelId: string;
  serverId: string;
  token: string;
  timeout?: number; // default timeout: 5 min
  interval?: number; // default interval: 15s
}

export interface MessageAttachment {
  content_type: string;
  filename: string;
  height: number;
  width: number;
  size: string;
  url: string;
  id: string;
}

export interface MessageComponent {
  custom_id: string; // starts with MJ::JOB::upsample or MJ::JOB::variation
  label?: 'U1' | 'U2' | 'U3' | 'U4' | 'V1' | 'V2' | 'V3' | 'V4';
  emoji?: { name: string };
  style: number; // 1 - used; 2 - free
  type: number;
}

export interface MessageItem {
  application_id: string;
  attachments: MessageAttachment[];
  author: {
    id: string;
    username: string;
  };
  channel_id: string;
  content: string;
  id: string;
  type: number; // 19 - upscale; 0 - imagine
  components: Array<{
    components: MessageComponent[];
    type: number;
  }>;
}

export type MessageType = 'imagine' | 'upscale';

export type MessageTypeProps =
  | {
      type: Extract<MessageType, 'upscale'>;
      index: number;
    }
  | {
      type?: Extract<MessageType, 'imagine'>;
    };

export interface UpscaleProps {
  messageId: string;
  index: number;
  hash?: string;
  customId?: string;
}
