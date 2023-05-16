export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] | undefined;
};

export interface MidjourneyProps {
  channelId: string;
  serverId: string;
  token: string;
  timeout?: number; // default timeout: 2 min
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
}
