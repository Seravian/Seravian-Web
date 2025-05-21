import { ChatMessage } from "./chat-message";

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  isEditing: boolean;
  messages: ChatMessage[];
}
