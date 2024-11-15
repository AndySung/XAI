export const saveChat = (chat: ChatHistory) => {
  const chats = getChats();
  const existingIndex = chats.findIndex(c => c.id === chat.id);
  
  if (existingIndex >= 0) {
    chats[existingIndex] = chat;
  } else {
    chats.push(chat);
  }
  
  localStorage.setItem('xai-chats', JSON.stringify(chats));
};

export const getChats = (): ChatHistory[] => {
  const chats = localStorage.getItem('xai-chats');
  return chats ? JSON.parse(chats) : [];
};

export const deleteChat = (id: string) => {
  const chats = getChats().filter(chat => chat.id !== id);
  localStorage.setItem('xai-chats', JSON.stringify(chats));
};