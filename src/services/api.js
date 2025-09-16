import axios from 'axios'

// Mock API service for demonstration
// In production, this would connect to your actual CMS API
export const chatService = {
  async sendMessage(message, apiUrl) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      // Mock response based on message content
      const response = this.generateMockResponse(message)
      return response
    } catch (error) {
      console.error('API Error:', error)
      throw new Error('Failed to send message')
    }
  },

  generateMockResponse(message) {
    const lowerMessage = message.toLowerCase()
    
    // Product suggestions based on keywords
    if (lowerMessage.includes('shoe') || lowerMessage.includes('sneaker') || lowerMessage.includes('footwear')) {
      return {
        message: "I found some amazing shoes for you! Here are my top recommendations:",
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
        message: "Here are some stylish shirts I recommend:",
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
    return {
      message: "Thanks for your message! I'm an AI assistant that can help you find products, answer questions about sizing, and provide style recommendations. What can I help you with today?",
      products: []
    }
  }
}

// Real API service (uncomment and modify for production)
/*
export const chatService = {
  async sendMessage(message, apiUrl) {
    try {
      const response = await axios.post(apiUrl, {
        message: message,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId()
      })
      
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      throw new Error('Failed to send message')
    }
  },
  
  getSessionId() {
    let sessionId = localStorage.getItem('assistant-widget-session')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('assistant-widget-session', sessionId)
    }
    return sessionId
  }
}
*/
