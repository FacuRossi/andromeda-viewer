import { createSelector } from 'reselect'

import {
  saveLocalChatMessages,
  saveIMChatInfos,
  saveIMChatMessages
} from '../actions/chatMessageActions'

import { getLocalChat, getIMChats, getShouldSaveChat } from '../selectors/chat'

export const saveLocalChat = createSelector(
  [
    getLocalChat,
    getShouldSaveChat
  ],
  (localChat, shouldSaveChat) => {
    if (!shouldSaveChat) return null

    const messagesToSave = []

    for (let i = localChat.size - 1; i >= 0; i -= 1) {
      const msg = localChat.get(i)

      if (msg.get('didSave')) {
        break
      } else {
        messagesToSave.push(msg)
      }
    }

    if (messagesToSave.length === 0) return null

    return saveLocalChatMessages()
  }
)

export const saveIMChatInfo = createSelector(
  [
    getIMChats,
    getShouldSaveChat
  ],
  (ims, shouldSaveChat) => {
    if (!shouldSaveChat || ims.every(chat => chat.get('didSaveChatInfo'))) return null

    return saveIMChatInfos()
  }
)

export const saveIMChat = createSelector(
  [
    getIMChats,
    getShouldSaveChat
  ],
  (ims, shouldSaveChat) => {
    if (!shouldSaveChat || !ims.some(chat => chat.get('hasUnsavedMSG'))) return null

    return saveIMChatMessages()
  }
)
