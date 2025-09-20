<template>
  <div class="message" :class="messageClasses">
    <div class="message-content">
      <div class="message-text" v-html="formattedContent"></div>
      
      <!-- Product cards inline -->
      <div v-if="message.products && message.products.length" class="product-cards">
        <div class="products-header">
          <h4>Recommended Products</h4>
          <span class="product-count">{{ message.products.length }}</span>
        </div>
        <div class="products-grid">
          <div
            v-for="product in message.products"
            :key="product.id"
            class="product-card"
            @click="handleProductClick(product)"
          >
            <div class="product-image" v-if="product.imageUrl || product.image">
              <img :src="product.imageUrl || product.image" :alt="product.title || product.name" />
            </div>
            <div class="product-info">
              <h5 class="product-name">{{ product.title || product.name }}</h5>
              <p class="product-description" v-if="product.description">{{ product.description }}</p>
              <p class="product-price" v-if="product.price">${{ product.price }}</p>
              <div class="product-meta">
                <span class="product-brand" v-if="product.brand">{{ product.brand }}</span>
                <span class="product-category" v-if="product.category">{{ product.category }}</span>
              </div>
            </div>
          </div>
        </div>
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
