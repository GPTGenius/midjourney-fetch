import dayjs from 'dayjs';
import { midjourneyBotConfigs } from './config';
import type { MessageTypeProps, MessageItem, MessageType } from './interface';

export const findMessageByPrompt = (
  messages: MessageItem[],
  prompt: string,
  options: MessageTypeProps
) => {
  // trim and merge spaces
  const filterPrompt = prompt.split(' ').filter(Boolean).join(' ');
  if (options?.type === 'upscale') {
    return messages.find(
      (msg) =>
        msg.timestamp &&
        dayjs(msg.timestamp).isAfter(options.timestamp) &&
        msg.type === 19 &&
        msg.content.includes(filterPrompt) &&
        msg.content.includes(`Image #${options.index}`) &&
        msg.author.id === midjourneyBotConfigs.applicationId
    );
  }
  if (options?.type === 'variation') {
    return messages.find(
      (msg) =>
        msg.timestamp &&
        dayjs(msg.timestamp).isAfter(options.timestamp) &&
        msg.type === 19 &&
        msg.content.includes(filterPrompt) &&
        // 0 means reroll
        (!options?.index || msg.content.includes('Variations')) &&
        msg.author.id === midjourneyBotConfigs.applicationId
    );
  }
  return messages.find(
    (msg) =>
      msg.timestamp &&
      dayjs(msg.timestamp).isAfter(options.timestamp) &&
      msg.content.includes(filterPrompt) &&
      msg.author.id === midjourneyBotConfigs.applicationId
  );
};

export const isInProgress = (message: MessageItem) =>
  message.attachments.length === 0 ||
  (message.attachments[0]?.filename?.startsWith('grid') &&
    message.attachments[0]?.filename?.endsWith('.webp'));

export const getHashFromCustomId = (type: MessageType, id: string) => {
  let regex: RegExp | null = null;
  if (type === 'upscale') {
    regex = /(upsample)::(\d+)::(.+)/;
  } else if (type === 'variation') {
    regex = /(variation|reroll)::(\d+)::(.+)/;
  }
  if (!regex) return { index: null, hash: null };
  const match = id.match(regex);
  const model = match?.[1]; // upsample|variation|reroll
  const index = match?.[2] ? Number(match[2]) : null;
  const hash = match?.[3] || null;
  return { model, index, hash };
};
