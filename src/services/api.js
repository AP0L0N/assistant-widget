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
        timeout: 10000 // 10 second timeout
      })
      
      console.log('API Response:', response.data)
      
      // Transform the response to match expected format
      return {
        message: response.data.assistantMessage,
        products: response.data.recommendedProducts || []
      }
    } catch (error) {
      console.error('API Error:', error)
      
      // Fallback to mock response if API fails
      if (error.code === 'ERR_NETWORK' || error.response?.status === 0) {
        console.log('Network error, falling back to mock response')
        return this.generateMockResponse(message)
      }
      
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
        timeout: 10000
      })
      
      console.log('Chat History Response:', response.data)
      return response.data
    } catch (error) {
      console.error('Chat History API Error:', error)
      return { messages: [], recommendedProducts: [] }
    }
  },

  generateMockResponse(message) {
    const lowerMessage = message.toLowerCase()
    console.log('API: Processing message:', message, 'Lowercase:', lowerMessage)
    
    // Product suggestions based on keywords
    if (lowerMessage.includes('shoe') || lowerMessage.includes('sneaker') || lowerMessage.includes('footwear')) {
      console.log('API: Matched shoe keywords, returning shoe products')
      return {
        message: "I've found some amazing shoes for you! Check out the recommended products in the sidebar on the right. Each one has been carefully selected based on quality, style, and value.",
        products: [
          {
            id: 1,
            name: "Nike Air Max 270",
            description: "Comfortable running shoes with excellent cushioning and modern design",
            price: 150.00,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop&crop=center",
            url: "/products/nike-air-max-270",
            category: "Running Shoes",
            brand: "Nike",
            sizes: ["8", "9", "10", "11", "12"],
            colors: ["Black", "White", "Blue"]
          },
          {
            id: 2,
            name: "Adidas Ultraboost 22",
            description: "Premium running shoes with responsive boost technology for maximum comfort",
            price: 180.00,
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=200&fit=crop&crop=center",
            url: "/products/adidas-ultraboost-22",
            category: "Running Shoes",
            brand: "Adidas",
            sizes: ["7", "8", "9", "10", "11"],
            colors: ["White", "Black", "Red"]
          },
          {
            id: 3,
            name: "Converse Chuck Taylor All Star",
            description: "Classic canvas sneakers perfect for casual wear and everyday style",
            price: 65.00,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop&crop=center",
            url: "/products/converse-chuck-taylor",
            category: "Casual Shoes",
            brand: "Converse",
            sizes: ["6", "7", "8", "9", "10", "11", "12"],
            colors: ["Black", "White", "Red", "Blue"]
          },
          {
            id: 4,
            name: "Jordan 1 Retro High",
            description: "Iconic basketball-inspired sneakers with premium leather construction",
            price: 170.00,
            image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=300&h=200&fit=crop&crop=center",
            url: "/products/jordan-1-retro-high",
            category: "Basketball Shoes",
            brand: "Jordan",
            sizes: ["8", "9", "10", "11", "12", "13"],
            colors: ["Black/Red", "White/Black", "Royal Blue"]
          },
          {
            id: 5,
            name: "Vans Old Skool",
            description: "Timeless skateboarding shoes with signature side stripe design",
            price: 60.00,
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=center",
            url: "/products/vans-old-skool",
            category: "Skate Shoes",
            brand: "Vans",
            sizes: ["6", "7", "8", "9", "10", "11", "12"],
            colors: ["Black/White", "Navy", "Red", "Green"]
          }
        ]
      }
    }
    
    if (lowerMessage.includes('shirt') || lowerMessage.includes('t-shirt')) {
      return {
        message: "I've curated some stylish shirts for you! Take a look at the recommendations in the sidebar - they're perfect for any occasion.",
        products: [
          {
            id: 4,
            name: "Classic Cotton T-Shirt",
            description: "100% cotton, comfortable fit",
            price: 25.00,
            image: "https://via.placeholder.com/200x150/6f42c1/ffffff?text=Cotton+T-Shirt"
          },
          {
            id: 5,
            name: "Polo Shirt",
            description: "Premium polo with classic collar",
            price: 45.00,
            image: "https://via.placeholder.com/200x150/fd7e14/ffffff?text=Polo+Shirt"
          }
        ]
      }
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('assistance')) {
      return {
        message: "I'm here to help! I can assist you with:\n\n• **Product recommendations** - Just tell me what you're looking for\n• **Size guidance** - Ask about sizing for any product\n• **Style advice** - Get suggestions for outfits or combinations\n• **General questions** - About our store, policies, or products\n\nWhat would you like to know?",
        products: []
      }
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        message: "I'd be happy to help you find products within your budget! What price range are you looking for, and what type of product interests you?",
        products: []
      }
    }
    
    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
      return {
        message: "For sizing help, I can guide you based on the product type. Could you tell me:\n\n• What product you're interested in?\n• Your usual size in other brands?\n• Any specific fit preferences (loose, fitted, etc.)?",
        products: []
      }
    }
    
    // Default response
    console.log('API: No keyword match, returning default response')
    return {
      message: "Thanks for your message! I'm an AI assistant that can help you find products, answer questions about sizing, and provide style recommendations. What can I help you with today?",
      products: []
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
