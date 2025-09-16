import { createApp } from 'vue'
import ChatWidget from './components/ChatWidget.vue'
import './styles/chat.scss'

// Create the widget app
const createWidget = (selector, options = {}) => {
  const app = createApp(ChatWidget, {
    ...options
  })
  
  const container = document.querySelector(selector)
  if (container) {
    app.mount(container)
  } else {
    console.error('Widget container not found:', selector)
  }
  
  return app
}

// Make the widget globally available
window.AssistantWidget = {
  createWidget
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#assistant-widget')
  if (container && !container.hasAttribute('data-initialized')) {
    container.setAttribute('data-initialized', 'true')
    createWidget('#assistant-widget', {
      apiUrl: 'https://api.example.com/chat',
      title: 'Online Assistant',
      primaryColor: '#007bff'
    })
  }
})
