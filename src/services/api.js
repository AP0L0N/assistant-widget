import axios from 'axios'

// Real API service for CraftCMS integration
export const chatService = {
  async sendMessage(message, apiUrl, chatId, hashKey) {
    try {
      console.log('Sending message to:', apiUrl)
      
      const response = await axios.post(apiUrl, {
        message: message,
        chatId: chatId,
        hashKey: hashKey
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false,
        timeout: 60000
      })
      
      console.log('API Response:', response.data)
      
      // Transform the response to match expected format
      return {
        message: response.data.assistantMessage,
        products: response.data.recommendedProducts || []
      }
    } catch (error) {
      console.error('API Error:', error)      
      throw new Error(`Failed to send message: ${error.message}`)
    }
  },

  async getChatHistory(apiUrl, chatId, hashKey) {
    try {
      console.log('Getting chat history from:', apiUrl)
      
      const response = await axios.post(apiUrl, {
        chatId: chatId,
        hashKey: hashKey
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false,
        timeout: 60000
      })
      
      console.log('Chat History Response:', response.data)
      return response.data
    } catch (error) {
      console.error('Chat History API Error:', error)
      return { messages: [], recommendedProducts: [] }
    }
  }
}

// Session management
export const getSessionId = () => {
  let sessionId = localStorage.getItem('assistant-widget-session')
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('assistant-widget-session', sessionId)
  }
  return sessionId
}

// Chat ID management - generates a unique hash for each conversation
export const getChatId = () => {
  let chatId = localStorage.getItem('assistant-widget-chat-id')
  if (!chatId) {
    // Generate a random hash-like string
    chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('assistant-widget-chat-id', chatId)
  }
  return chatId
}

// Hash key management - generates a security key for API calls
export const getHashKey = () => {
  let hashKey = localStorage.getItem('assistant-widget-hash-key')
  if (!hashKey) {
    // Generate a random hash-like string for security
    hashKey = 'key_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12) + '_' + Math.random().toString(36).substr(2, 12)
    localStorage.setItem('assistant-widget-hash-key', hashKey)
  }
  return hashKey
}

// Reset chat session (useful for starting a new conversation)
export const resetChatSession = () => {
  localStorage.removeItem('assistant-widget-chat-id')
  localStorage.removeItem('assistant-widget-hash-key')
  // Keep session ID for analytics/tracking
}
