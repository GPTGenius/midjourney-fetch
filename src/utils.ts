import { midjourneyBotConfigs } from './config';
import type { MessageTypeProps, MessageItem } from './interface';

export const findMessageByPrompt = (
  messages: MessageItem[],
  prompt: string,
  options?: MessageTypeProps
) => {
  // trim and merge spaces
  const filterPrompt = prompt.split(' ').filter(Boolean).join(' ');
  if (options?.type === 'upscale') {
    return messages.find(
      (msg) =>
        msg.type === 19 &&
        msg.content.includes(filterPrompt) &&
        msg.content.includes(`Image #${options.index}`) &&
        msg.author.id === midjourneyBotConfigs.applicationId
    );
  }
  return messages.find(
    (msg) =>
      msg.content.includes(filterPrompt) &&
      msg.author.id === midjourneyBotConfigs.applicationId
  );
};

export const isInProgress = (message: MessageItem) =>
  message.attachments.length === 0 ||
  (message.attachments[0]?.filename?.startsWith('grid') &&
    message.attachments[0]?.filename?.endsWith('.webp'));
