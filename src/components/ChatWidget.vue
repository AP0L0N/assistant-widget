<template>
  <div class="assistant-widget" :class="{ 'widget-open': isOpen }">
    <!-- Floating Button -->
    <button 
      class="floating-button"
      @click="toggleChat"
      :class="{ 'button-open': isOpen }"
      :style="{ backgroundColor: primaryColor }"
    >
      <span class="button-icon" v-if="!isOpen">💬</span>
      <span class="button-icon" v-else>✕</span>
    </button>

    <!-- Chat Window -->
    <div class="chat-window" v-if="isOpen">
      <!-- Header -->
      <div class="chat-header" :style="{ backgroundColor: primaryColor }">
        <h3 class="chat-title">{{ title }}</h3>
        <button class="close-button" @click="closeChat">✕</button>
      </div>

      <!-- Messages Container -->
      <div class="chat-body" ref="chatBody">
        <div class="messages-container">
          <ChatMessage
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :primary-color="primaryColor"
            @product-click="handleProductClick"
          />
          <div v-if="isLoading" class="loading-message">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-footer">
        <div class="input-container">
          <input
            v-model="currentMessage"
            @keyup.enter="sendMessage"
            @keyup.esc="closeChat"
            placeholder="Type your message..."
            class="message-input"
            :disabled="isLoading"
            ref="messageInput"
          />
          <button
            @click="sendMessage"
            :disabled="!currentMessage.trim() || isLoading"
            class="send-button"
            :style="{ backgroundColor: primaryColor }"
          >
            <span class="send-icon">➤</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage.vue'
import { chatService } from '../services/api.js'

export default {
  name: 'ChatWidget',
  components: {
    ChatMessage
  },
  props: {
    apiUrl: {
      type: String,
      default: 'https://api.example.com/chat'
    },
    title: {
      type: String,
      default: 'Online Assistant'
    },
    primaryColor: {
      type: String,
      default: '#007bff'
    }
  },
  data() {
    return {
      isOpen: false,
      currentMessage: '',
      messages: [],
      isLoading: false,
      messageId: 0,
      sessionId: this.getSessionId()
    }
  },
  mounted() {
    this.loadChatState()
    this.saveChatState()
    
    // Add welcome message if no messages exist
    if (this.messages.length === 0) {
      this.addMessage({
        id: this.getMessageId(),
        type: 'ai',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date()
      })
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$nextTick(() => {
          this.focusInput()
          this.scrollToBottom()
        })
      }
    },
    closeChat() {
      this.isOpen = false
    },
    focusInput() {
      if (this.$refs.messageInput) {
        this.$refs.messageInput.focus()
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatBody) {
          this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight
        }
      })
    },
    async sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) return

      const userMessage = {
        id: this.getMessageId(),
        type: 'user',
        content: this.currentMessage.trim(),
        timestamp: new Date()
      }

      this.addMessage(userMessage)
      this.currentMessage = ''
      this.isLoading = true

      try {
        const response = await chatService.sendMessage(this.currentMessage, this.apiUrl)
        this.addMessage({
          id: this.getMessageId(),
          type: 'ai',
          content: response.message,
          products: response.products || [],
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Error sending message:', error)
        this.addMessage({
          id: this.getMessageId(),
          type: 'ai',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        })
      } finally {
        this.isLoading = false
        this.scrollToBottom()
      }
    },
    addMessage(message) {
      this.messages.push(message)
      this.scrollToBottom()
      this.saveChatState()
    },
    getMessageId() {
      return ++this.messageId
    },
    handleProductClick(product) {
      // Handle product click - could open product page, add to cart, etc.
      console.log('Product clicked:', product)
      this.addMessage({
        id: this.getMessageId(),
        type: 'user',
        content: `I'm interested in ${product.name}`,
        timestamp: new Date()
      })
      
      // Save state after product interaction
      this.saveChatState()
    },
    getSessionId() {
      let sessionId = localStorage.getItem('assistant-widget-session')
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('assistant-widget-session', sessionId)
      }
      return sessionId
    },
    saveChatState() {
      const chatState = {
        messages: this.messages,
        messageId: this.messageId,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('assistant-widget-state', JSON.stringify(chatState))
    },
    loadChatState() {
      try {
        const savedState = localStorage.getItem('assistant-widget-state')
        if (savedState) {
          const chatState = JSON.parse(savedState)
          
          // Check if session is still valid (within 24 hours)
          const stateTime = new Date(chatState.timestamp)
          const now = new Date()
          const hoursDiff = (now - stateTime) / (1000 * 60 * 60)
          
          if (hoursDiff < 24 && chatState.sessionId === this.sessionId) {
            this.messages = chatState.messages || []
            this.messageId = chatState.messageId || 0
            
            // Restore message timestamps
            this.messages.forEach(message => {
              if (message.timestamp) {
                message.timestamp = new Date(message.timestamp)
              }
            })
          }
        }
      } catch (error) {
        console.warn('Failed to load chat state:', error)
        // Reset to default state if loading fails
        this.messages = []
        this.messageId = 0
      }
    }
  }
}
</script>
