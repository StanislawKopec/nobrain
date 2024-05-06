import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../models/Message';

interface ChatState {
  messages: Message[];
  chatId: string | null;
  participants: Participant[];
  newMessage: string;
}

interface Participant {
  id: string;
  name: string;
}

const initialState: ChatState = {
  messages: [],
  chatId: null,
  participants: [],
  newMessage: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setChatId(state, action: PayloadAction<string>) {
      state.chatId = action.payload;
    },
    addParticipant(state, action: PayloadAction<Participant>) {
      state.participants.push(action.payload);
    },
    updateNewMessage(state, action: PayloadAction<string>) {
      state.newMessage = action.payload;
    },
    clearChatState(state) {
      state.messages = [];
      state.chatId = null;
      state.participants = [];
      state.newMessage = '';
    },
  },
});

export const {
  addMessage,
  setChatId,
  addParticipant,
  updateNewMessage,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;