<template>
  <div class="assistant-widget" :class="{ 'widget-open': isOpen, 'dark-theme': isDarkTheme }">
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
      <!-- Left Sidebar -->
      <div class="left-sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">{{ title }}</h3>
          <button class="close-button" @click="closeChat">✕</button>
        </div>
        <div class="sidebar-tabs">
          <button 
            class="sidebar-tab" 
            :class="{ active: activeTab === 'ai-assistant' }"
            @click="activeTab = 'ai-assistant'"
          >
            <span class="tab-icon">🤖</span>
            <span class="tab-text">AI Assistant</span>
          </button>
          <button 
            class="sidebar-tab" 
            :class="{ active: activeTab === 'faq' }"
            @click="activeTab = 'faq'"
          >
            <span class="tab-icon">❓</span>
            <span class="tab-text">FAQ</span>
          </button>
          <button 
            class="sidebar-tab" 
            @click="openPage('test-shoes.html')"
          >
            <span class="tab-icon">👟</span>
            <span class="tab-text">Browse Shoes</span>
          </button>
          <button 
            class="sidebar-tab" 
            @click="openPage('page1.html')"
          >
            <span class="tab-icon">👕</span>
            <span class="tab-text">Browse Clothing</span>
          </button>
          <button 
            class="sidebar-tab" 
            @click="openPage('page2.html')"
          >
            <span class="tab-icon">👜</span>
            <span class="tab-text">Browse Accessories</span>
          </button>
          <button 
            class="sidebar-tab" 
            @click="openPage('page3.html')"
          >
            <span class="tab-icon">💰</span>
            <span class="tab-text">Best Deals</span>
          </button>
          <button 
            class="sidebar-tab" 
            :class="{ active: activeTab === 'track-order' }"
            @click="activeTab = 'track-order'"
          >
            <span class="tab-icon">📦</span>
            <span class="tab-text">Track Order</span>
          </button>
          <button 
            class="sidebar-tab" 
            :class="{ active: activeTab === 'contact-support' }"
            @click="activeTab = 'contact-support'"
          >
            <span class="tab-icon">🆘</span>
            <span class="tab-text">Contact Support</span>
          </button>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="chat-main" :class="{ 'with-sidebar': activeTab === 'ai-assistant' }">

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- AI Assistant Tab (Chat + Products) -->
          <div v-if="activeTab === 'ai-assistant'" class="ai-assistant-tab">
            <div class="chat-section">
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
                <!-- Clear Chat Button -->
                <div class="chat-actions">
                  <button
                    @click="clearChat"
                    class="clear-chat-button"
                    :disabled="isLoading"
                    title="Start new chat"
                  >
                    <span class="clear-icon">🗑️</span>
                    <span class="clear-text">New Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Tab -->
          <div v-if="activeTab === 'faq'" class="faq-tab">
            <div class="faq-content">
              <h4>Frequently Asked Questions</h4>
              <div class="faq-accordion">
                <div class="faq-item" v-for="(faq, index) in faqItems" :key="index">
                  <button 
                    class="faq-question" 
                    @click="toggleFaq(index)"
                    :class="{ active: openFaqIndex === index }"
                  >
                    <span class="faq-text">{{ faq.question }}</span>
                    <span class="faq-icon">{{ openFaqIndex === index ? '−' : '+' }}</span>
                  </button>
                  <div class="faq-answer" v-if="openFaqIndex === index">
                    <p>{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div v-if="activeTab === 'track-order'" class="quick-action-tab">
            <div class="track-order-form">
              <h4>📦 Track Order</h4>
              <p>Enter your email and tracking number to check your order status.</p>
              
              <form @submit.prevent="submitTrackOrder" class="track-order-form-content">
                <div class="form-group">
                  <label for="trackEmail">Email Address *</label>
                  <input 
                    type="email" 
                    id="trackEmail" 
                    v-model="trackOrderForm.email" 
                    required 
                    class="form-input"
                    placeholder="your.email@example.com"
                  >
                </div>
                
                <div class="form-group">
                  <label for="trackingNumber">Tracking Number *</label>
                  <input 
                    type="text" 
                    id="trackingNumber" 
                    v-model="trackOrderForm.trackingNumber" 
                    required 
                    class="form-input"
                    placeholder="Enter your tracking number"
                  >
                </div>
                
                <button type="submit" class="submit-btn" :disabled="isTrackingOrder">
                  {{ isTrackingOrder ? 'Tracking...' : 'Track Order' }}
                </button>
              </form>
              
              <!-- Order Status Display -->
              <div v-if="orderStatus" class="order-status-display">
                <div class="status-header">
                  <h5>Order Status</h5>
                  <span class="status-badge" :class="orderStatus.status.toLowerCase().replace(' ', '-')">
                    {{ orderStatus.status }}
                  </span>
                </div>
                <div class="status-details">
                  <div class="status-item">
                    <strong>Order Number:</strong> {{ orderStatus.orderNumber }}
                  </div>
                  <div class="status-item">
                    <strong>Tracking Number:</strong> {{ orderStatus.trackingNumber }}
                  </div>
                  <div class="status-item">
                    <strong>Last Updated:</strong> {{ orderStatus.lastUpdated }}
                  </div>
                  <div class="status-item" v-if="orderStatus.estimatedDelivery">
                    <strong>Estimated Delivery:</strong> {{ orderStatus.estimatedDelivery }}
                  </div>
                  <div class="status-item" v-if="orderStatus.location">
                    <strong>Current Location:</strong> {{ orderStatus.location }}
                  </div>
                </div>
                <div class="status-timeline" v-if="orderStatus.timeline && orderStatus.timeline.length">
                  <h6>Order Timeline</h6>
                  <div class="timeline">
                    <div 
                      v-for="(event, index) in orderStatus.timeline" 
                      :key="index"
                      class="timeline-item"
                      :class="{ 'active': index === 0 }"
                    >
                      <div class="timeline-dot"></div>
                      <div class="timeline-content">
                        <div class="timeline-date">{{ event.date }}</div>
                        <div class="timeline-description">{{ event.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'contact-support'" class="quick-action-tab">
            <div class="contact-form">
              <h4>🆘 Contact Support</h4>
              <p>Need help? Fill out the form below and our support team will get back to you.</p>
              
              <form @submit.prevent="submitContactForm" class="contact-form-content">
                <div class="form-group">
                  <label for="name">Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="contactForm.name" 
                    required 
                    class="form-input"
                    placeholder="Your full name"
                  >
                </div>
                
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="contactForm.email" 
                    required 
                    class="form-input"
                    placeholder="your.email@example.com"
                  >
                </div>
                
                <div class="form-group">
                  <label for="subject">Subject *</label>
                  <input 
                    type="text" 
                    id="subject" 
                    v-model="contactForm.subject" 
                    required 
                    class="form-input"
                    placeholder="Brief description of your issue"
                  >
                </div>
                
                <div class="form-group">
                  <label for="message">Message *</label>
                  <textarea 
                    id="message" 
                    v-model="contactForm.message" 
                    required 
                    class="form-textarea"
                    placeholder="Please describe your issue in detail..."
                    rows="4"
                  ></textarea>
                </div>
                
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="contactForm.includeTranscript"
                      class="form-checkbox"
                    >
                    <span class="checkbox-text">Include chat transcript to help with context</span>
                  </label>
                </div>
                
                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Sidebar - Only show in AI Assistant tab -->
      <div v-if="activeTab === 'ai-assistant'" class="product-sidebar">
        <div class="sidebar-header">
          <h4>Recommended Products</h4>
          <span class="product-count">{{ displayedProducts.length }}</span>
        </div>
        <div class="sidebar-content">
          <div v-if="displayedProducts.length" class="products-list">
            <div
              v-for="product in displayedProducts"
              :key="product.id"
              class="product-card-mini"
              @click="handleProductClick(product)"
            >
              <div class="product-image-mini" v-if="product.image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <div class="product-info-mini">
                <h5 class="product-name-mini">{{ product.name }}</h5>
                <p class="product-price-mini" v-if="product.price">${{ product.price }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-products">
            <p>No products to show yet. Start a conversation to see recommendations!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage.vue'
import { chatService, getChatId, getHashKey, resetChatSession } from '../services/api.js'

export default {
  name: 'ChatWidget',
  components: {
    ChatMessage
  },
  props: {
    apiUrl: {
      type: String,
      default: 'https://assistant-cms.ddev.site/actions/custommodule/assistant/new-message'
    },
    chatHistoryUrl: {
      type: String,
      default: 'https://assistant-cms.ddev.site/actions/custommodule/assistant/get-chat-history'
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
      sessionId: this.getSessionId(),
      chatId: getChatId(),
      hashKey: getHashKey(),
      activeTab: 'ai-assistant',
      recentSearches: [],
      displayedProducts: [],
      openFaqIndex: null,
      isSubmitting: false,
      isDarkTheme: false,
      contactForm: {
        name: '',
        email: '',
        subject: '',
        message: '',
        includeTranscript: false
      },
      trackOrderForm: {
        email: '',
        trackingNumber: ''
      },
      isTrackingOrder: false,
      orderStatus: null,
      faqItems: [
        {
          question: "How do I place an order?",
          answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You can also use our AI assistant to help you find specific products."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay for your convenience."
        },
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping may take 7-14 business days depending on the destination."
        },
        {
          question: "Can I return or exchange items?",
          answer: "Yes! We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Contact our support team to initiate a return."
        },
        {
          question: "How do I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email. You can also use our 'Track Order' feature in the sidebar to check your order status."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Check our shipping page for specific details."
        },
        {
          question: "What if I have a problem with my order?",
          answer: "Our customer support team is here to help! Use the 'Contact Support' option in the sidebar, or reach out to us via email or phone. We typically respond within 24 hours."
        },
        {
          question: "Are there any discounts or promotions?",
          answer: "We regularly offer discounts and promotions! Check our 'Best Deals' section in the sidebar, or sign up for our newsletter to stay updated on the latest offers."
        }
      ]
    }
  },
  mounted() {
    this.loadRecentSearches()
    this.detectTheme()
    
    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.detectTheme)
  },
  watch: {
    messages() {
      this.extractProductsFromMessages()
    }
  },
  methods: {
    async toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        // Load chat history when opening
        await this.loadChatHistory()
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

      const messageContent = this.currentMessage.trim()
      const userMessage = {
        id: this.getMessageId(),
        type: 'user',
        content: messageContent,
        timestamp: new Date()
      }

      this.addMessage(userMessage)
      this.currentMessage = ''
      this.isLoading = true

      try {
        const response = await chatService.sendMessage(messageContent, this.apiUrl, this.chatId, this.hashKey)
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
        // Extract products for sidebar display
        this.extractProductsFromMessages()
      }
    },
    addMessage(message) {
      this.messages.push(message)
      this.scrollToBottom()
    },
    getMessageId() {
      return ++this.messageId
    },
    async loadChatHistory() {
      try {
        const history = await chatService.getChatHistory(this.chatHistoryUrl, this.chatId, this.hashKey)
        
        // Always start with the hello message at the top
        const helloMessage = {
          id: this.getMessageId(),
          type: 'ai',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: new Date()
        }
        
        if (history.messages && history.messages.length > 0) {
          // Convert API messages to widget format
          const apiMessages = history.messages.map(msg => ({
            id: this.getMessageId(),
            type: msg.type || 'ai',
            content: msg.content || msg.message,
            products: msg.products || [],
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          }))
          
          // Pin hello message to the top, then add API messages
          this.messages = [helloMessage, ...apiMessages]
        } else {
          // If no history, just show the hello message
          this.messages = [helloMessage]
        }
        
        // Update displayed products from history
        this.extractProductsFromMessages()
      } catch (error) {
        console.error('Error loading chat history:', error)
        // If API fails, show just the hello message
        this.messages = [{
          id: this.getMessageId(),
          type: 'ai',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: new Date()
        }]
      }
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
      
      // Add to recent searches if not already there
      if (!this.recentSearches.includes(product.name)) {
        this.recentSearches.unshift(product.name)
        if (this.recentSearches.length > 5) {
          this.recentSearches = this.recentSearches.slice(0, 5)
        }
        this.saveRecentSearches()
      }
    },
    sendQuickMessage(message) {
      this.currentMessage = message
      this.sendMessage()
      this.activeTab = 'ai-assistant' // Switch to AI assistant tab after sending
    },
    toggleFaq(index) {
      this.openFaqIndex = this.openFaqIndex === index ? null : index
    },
    openPage(pageUrl) {
      // Open the page in the same window
      window.location.href = pageUrl
    },
    async submitContactForm() {
      if (this.isSubmitting) return
      
      this.isSubmitting = true
      
      try {
        // Prepare form data
        const formData = {
          ...this.contactForm,
          timestamp: new Date().toISOString(),
          chatTranscript: this.contactForm.includeTranscript ? this.getChatTranscript() : null
        }
        
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Show success message
        alert('Thank you for contacting us! We\'ll get back to you within 24 hours.')
        
        // Reset form
        this.contactForm = {
          name: '',
          email: '',
          subject: '',
          message: '',
          includeTranscript: false
        }
        
        // Switch to AI assistant tab
        this.activeTab = 'ai-assistant'
        
      } catch (error) {
        console.error('Error submitting contact form:', error)
        alert('Sorry, there was an error submitting your message. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    async submitTrackOrder() {
      if (this.isTrackingOrder) return
      
      this.isTrackingOrder = true
      this.orderStatus = null // Clear previous results
      
      try {
        // Simulate API call to track order (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock order status response - in real implementation, this would come from your API
        const mockOrderStatus = this.generateMockOrderStatus(this.trackOrderForm.trackingNumber)
        this.orderStatus = mockOrderStatus
        
      } catch (error) {
        console.error('Error tracking order:', error)
        alert('Sorry, there was an error tracking your order. Please try again.')
      } finally {
        this.isTrackingOrder = false
      }
    },
    generateMockOrderStatus(trackingNumber) {
      // Generate mock order status based on tracking number
      const statuses = ['Processing', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      const now = new Date()
      const timeline = [
        {
          date: now.toLocaleDateString(),
          description: `Order status updated: ${randomStatus}`
        }
      ]
      
      // Add previous timeline events based on status
      if (randomStatus === 'Shipped' || randomStatus === 'In Transit' || randomStatus === 'Out for Delivery' || randomStatus === 'Delivered') {
        timeline.unshift({
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Order confirmed and processing'
        })
      }
      
      if (randomStatus === 'In Transit' || randomStatus === 'Out for Delivery' || randomStatus === 'Delivered') {
        timeline.unshift({
          date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Order shipped from warehouse'
        })
      }
      
      if (randomStatus === 'Out for Delivery' || randomStatus === 'Delivered') {
        timeline.unshift({
          date: now.toLocaleDateString(),
          description: 'Package out for delivery'
        })
      }
      
      if (randomStatus === 'Delivered') {
        timeline.unshift({
          date: now.toLocaleDateString(),
          description: 'Package delivered successfully'
        })
      }
      
      return {
        orderNumber: `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        trackingNumber: trackingNumber,
        status: randomStatus,
        lastUpdated: now.toLocaleString(),
        estimatedDelivery: randomStatus === 'Delivered' ? 'Delivered' : new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        location: randomStatus === 'In Transit' ? 'Distribution Center - Chicago, IL' : 
                 randomStatus === 'Out for Delivery' ? 'Local Delivery Hub' : null,
        timeline: timeline.reverse() // Show in chronological order
      }
    },
    getChatTranscript() {
      // Generate a simple chat transcript
      return this.messages.map(msg => {
        const timestamp = msg.timestamp.toLocaleString()
        const sender = msg.type === 'user' ? 'You' : 'Assistant'
        return `[${timestamp}] ${sender}: ${msg.content}`
      }).join('\n')
    },
    detectTheme() {
      // Detect if user prefers dark theme
      this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    },
    extractProductsFromMessages() {
      // Extract all products from AI messages and display in sidebar
      const products = []
      this.messages.forEach(message => {
        if (message.type === 'ai' && message.products) {
          message.products.forEach(product => {
            // Transform products to match expected format
            const transformedProduct = {
              id: product.id,
              name: product.title || product.name,
              description: product.description || '',
              price: product.price || 0,
              image: product.imageUrl || product.image,
              url: product.url || '#',
              category: product.category || '',
              brand: product.brand || '',
              sizes: product.sizes || [],
              colors: product.colors || []
            }
            
            // Avoid duplicates
            if (!products.find(p => p.id === transformedProduct.id)) {
              products.push(transformedProduct)
            }
          })
        }
      })
      this.displayedProducts = products.slice(0, 6) // Show max 6 products
    },
    loadRecentSearches() {
      try {
        const saved = localStorage.getItem('assistant-widget-recent-searches')
        if (saved) {
          this.recentSearches = JSON.parse(saved)
        }
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    },
    saveRecentSearches() {
      try {
        localStorage.setItem('assistant-widget-recent-searches', JSON.stringify(this.recentSearches))
      } catch (error) {
        console.error('Error saving recent searches:', error)
      }
    },
    getSessionId() {
      let sessionId = localStorage.getItem('assistant-widget-session')
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('assistant-widget-session', sessionId)
      }
      return sessionId
    },
    clearChat() {
      // Reset chat session (clears chat-id and hash-key from localStorage)
      resetChatSession()
      
      // Generate new chat-id and hash-key
      this.chatId = getChatId()
      this.hashKey = getHashKey()
      
      // Clear messages except the initial hello message
      const helloMessage = {
        id: this.getMessageId(),
        type: 'ai',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date()
      }
      this.messages = [helloMessage]
      
      // Clear displayed products
      this.displayedProducts = []
      
      // Clear current message input
      this.currentMessage = ''
      
      // Focus on input after clearing
      this.$nextTick(() => {
        this.focusInput()
      })
    },
  }
}
</script>
