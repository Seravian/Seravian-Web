import { ChatMessage } from "./chat-message";

export interface Chat {
  id: string;
  title: string;
  isEditing: boolean;
  messages: ChatMessage[];
}
