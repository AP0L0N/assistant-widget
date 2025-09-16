<template>
  <div class="message" :class="messageClasses">
    <div class="message-content">
      <div class="message-text" v-html="formattedContent"></div>
      
      <!-- Product Suggestions -->
      <div v-if="message.products && message.products.length" class="product-suggestions">
        <h4 class="suggestions-title">Recommended Products:</h4>
        <div class="products-grid">
          <div
            v-for="product in message.products"
            :key="product.id"
            class="product-card"
            @click="handleProductClick(product)"
          >
            <div class="product-image" v-if="product.image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-info">
              <h5 class="product-name">{{ product.name }}</h5>
              <p class="product-brand" v-if="product.brand">{{ product.brand }}</p>
              <p class="product-description" v-if="product.description">
                {{ product.description }}
              </p>
              <div class="product-details" v-if="product.category">
                <span class="product-category">{{ product.category }}</span>
                <div class="product-options" v-if="product.sizes || product.colors">
                  <div v-if="product.sizes" class="product-sizes">
                    <strong>Sizes:</strong> {{ product.sizes.join(', ') }}
                  </div>
                  <div v-if="product.colors" class="product-colors">
                    <strong>Colors:</strong> {{ product.colors.join(', ') }}
                  </div>
                </div>
              </div>
              <div class="product-price" v-if="product.price">
                ${{ product.price }}
              </div>
              <div class="product-actions">
                <a 
                  :href="product.url || '#'"
                  class="product-button"
                  :style="{ backgroundColor: primaryColor }"
                  @click="handleProductClick(product)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Product
                </a>
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
