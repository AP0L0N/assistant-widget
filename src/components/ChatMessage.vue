<template>
  <div class="message" :class="messageClasses">
    <div class="message-content">
      <div class="message-text" v-html="formattedContent"></div>
      
      <!-- Product notification (just text, no cards) -->
      <div v-if="message.products && message.products.length" class="product-notification">
        <p class="notification-text">
          📦 {{ message.products.length }} recommended product{{ message.products.length > 1 ? 's' : '' }} shown in sidebar →
        </p>
      </div>
    </div>
    
    <div class="message-time">
      {{ formatTime(message.timestamp) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    },
    primaryColor: {
      type: String,
      default: '#007bff'
    }
  },
  computed: {
    messageClasses() {
      return {
        'message-user': this.message.type === 'user',
        'message-ai': this.message.type === 'ai',
        'message-loading': this.message.type === 'loading'
      }
    },
    formattedContent() {
      if (!this.message.content) return ''
      
      // Simple formatting for links and basic markdown
      return this.message.content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    }
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return ''
      
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },
    handleProductClick(product) {
      this.$emit('product-click', product)
    }
  }
}
</script>
