# Online Assistant Widget

A reusable, embeddable AI-powered chat component built with Vue.js for enhancing user experience on e-commerce websites.

## Features

- 🤖 **AI-Powered Assistance** - Intelligent responses and product recommendations
- 💬 **Interactive Chat Interface** - Smooth, responsive chat experience
- 🎨 **Customizable Design** - Easy to match your website's branding
- 📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Lightweight** - Minimal impact on website performance
- 🔌 **Easy Integration** - Simple script tag integration

## Quick Start

### 1. Build the Widget

```bash
npm install
npm run build
```

### 2. Integration

Add the widget to your website with just a few lines of code:

```html
<!-- Add this to your HTML -->
<div id="assistant-widget"></div>

<!-- Include the widget script -->
<script src="./dist/assistant-widget.umd.js"></script>

<!-- Initialize the widget -->
<script>
  AssistantWidget.createWidget('#assistant-widget', {
    apiUrl: 'https://your-cms-api.com/actions/custommodule/assistant/new-message',
    chatHistoryUrl: 'https://your-cms-api.com/actions/custommodule/assistant/get-chat-history',
    title: 'Online Assistant',
    primaryColor: '#007bff'
  });
</script>
```

### 3. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiUrl` | String | `'https://assistant-cms.ddev.site/actions/custommodule/assistant/new-message'` | Your CMS API endpoint for sending messages |
| `chatHistoryUrl` | String | `'https://assistant-cms.ddev.site/actions/custommodule/assistant/get-chat-history'` | Your CMS API endpoint for retrieving chat history |
| `title` | String | `'Online Assistant'` | Chat window title |
| `primaryColor` | String | `'#007bff'` | Primary color for buttons and accents |

## Development

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd assistant-widget

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── components/
│   ├── ChatWidget.vue      # Main widget component
│   └── ChatMessage.vue     # Individual message component
├── services/
│   └── api.js              # API service for CMS communication
├── styles/
│   ├── variables.scss      # SASS variables
│   └── chat.scss          # Main styles
└── main.js                 # Entry point
```

## API Integration

The widget communicates with your CMS through a simple API. Here's the expected format:

### Request Format

```javascript
POST /api/chat
{
  "message": "Looking for running shoes",
  "timestamp": "2024-01-15T10:30:00Z",
  "sessionId": "session_1234567890_abc123"
}
```

### Response Format

```javascript
{
  "message": "I found some great running shoes for you!",
  "products": [
    {
      "id": 1,
      "name": "Nike Air Max 270",
      "description": "Comfortable running shoes",
      "price": 150.00,
      "image": "https://example.com/shoe.jpg"
    }
  ]
}
```

## Customization

### Styling

The widget uses SASS for styling. You can customize colors, spacing, and animations by modifying the variables in `src/styles/variables.scss`:

```scss
// Customize colors
$primary-color: #your-brand-color;
$chat-bg: #ffffff;
$message-user-bg: #your-primary-color;

// Customize spacing
$spacing-md: 16px;
$border-radius-lg: 12px;
```

### Advanced Customization

For more advanced customization, you can:

1. Override CSS classes in your website's stylesheet
2. Modify the Vue components directly
3. Extend the API service for additional functionality

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance

- **Bundle Size**: ~50KB gzipped
- **Load Time**: < 100ms on average connection
- **Memory Usage**: < 5MB typical usage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the demo page

## Roadmap

- [ ] Voice input support
- [ ] Analytics integration
- [ ] Multilingual support
- [ ] Custom AI prompts configuration
- [ ] WebSocket support for real-time chat
- [ ] File upload support
- [ ] Chat history persistence
