# Integration Guide

This guide provides detailed instructions for integrating the Assistant Widget into your website.

## Basic Integration

### Step 1: Include the Widget Files

After building the widget, you'll have these files in the `dist` folder:
- `assistant-widget.umd.js` - The main widget script
- `assistant-widget.umd.css` - The widget styles (optional, if you want to customize)

### Step 2: Add HTML Container

Add a container div where you want the widget to appear:

```html
<div id="assistant-widget"></div>
```

### Step 3: Include the Script

Include the widget script before the closing `</body>` tag:

```html
<script src="path/to/assistant-widget.umd.js"></script>
```

### Step 4: Initialize the Widget

Initialize the widget with your configuration:

```html
<script>
  AssistantWidget.createWidget('#assistant-widget', {
    apiUrl: 'https://your-api.com/chat',
    title: 'Your Assistant',
    primaryColor: '#your-brand-color'
  });
</script>
```

## Advanced Integration

### Custom Styling

You can override the default styles by including your own CSS after the widget:

```html
<style>
  .assistant-widget .floating-button {
    background-color: #your-color !important;
  }
  
  .assistant-widget .chat-window {
    border-radius: 20px;
  }
</style>
```

### Multiple Widgets

To have multiple widgets on the same page, use different container IDs:

```html
<div id="assistant-widget-1"></div>
<div id="assistant-widget-2"></div>

<script>
  AssistantWidget.createWidget('#assistant-widget-1', {
    apiUrl: 'https://api1.com/chat',
    title: 'Product Assistant'
  });
  
  AssistantWidget.createWidget('#assistant-widget-2', {
    apiUrl: 'https://api2.com/chat',
    title: 'Support Assistant'
  });
</script>
```

### Dynamic Configuration

You can update widget configuration dynamically:

```javascript
// Get the widget instance
const widget = AssistantWidget.createWidget('#assistant-widget', options);

// Update configuration
widget.$props.apiUrl = 'https://new-api.com/chat';
widget.$props.primaryColor = '#new-color';
```

## API Requirements

Your backend API should implement the following endpoint:

### POST /chat

**Request Body:**
```json
{
  "message": "User's message",
  "timestamp": "2024-01-15T10:30:00Z",
  "sessionId": "unique-session-id"
}
```

**Response Body:**
```json
{
  "message": "AI response message",
  "products": [
    {
      "id": "product-id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "image": "https://example.com/image.jpg",
      "url": "https://example.com/product"
    }
  ]
}
```

### CORS Configuration

Make sure your API allows CORS requests from your domain:

```javascript
// Express.js example
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

## Security Considerations

### API Security

1. **Rate Limiting**: Implement rate limiting on your chat API
2. **Input Validation**: Validate and sanitize all user inputs
3. **Authentication**: Consider adding authentication for sensitive operations
4. **HTTPS**: Always use HTTPS for API communication

### Content Security Policy

If you use CSP, add the widget domain to your policy:

```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-inline' https://your-widget-domain.com;">
```

## Performance Optimization

### Lazy Loading

Load the widget only when needed:

```javascript
// Load widget when user scrolls to bottom
window.addEventListener('scroll', function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    if (!document.querySelector('#assistant-widget')) {
      loadWidget();
    }
  }
});

function loadWidget() {
  const script = document.createElement('script');
  script.src = 'path/to/assistant-widget.umd.js';
  script.onload = function() {
    AssistantWidget.createWidget('#assistant-widget', options);
  };
  document.head.appendChild(script);
}
```

### CDN Integration

Host the widget files on a CDN for better performance:

```html
<script src="https://cdn.yourdomain.com/widgets/assistant-widget.umd.js"></script>
```

## Troubleshooting

### Common Issues

1. **Widget not appearing**: Check browser console for JavaScript errors
2. **API not responding**: Verify API URL and CORS configuration
3. **Styling issues**: Check for CSS conflicts with your website
4. **Mobile issues**: Ensure viewport meta tag is present

### Debug Mode

Enable debug mode to see detailed logs:

```javascript
AssistantWidget.createWidget('#assistant-widget', {
  ...options,
  debug: true
});
```

### Browser Compatibility

Test the widget in different browsers:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Examples

### E-commerce Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Store</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <!-- Your website content -->
  <div id="assistant-widget"></div>
  
  <script src="https://cdn.mystore.com/widgets/assistant-widget.umd.js"></script>
  <script>
    AssistantWidget.createWidget('#assistant-widget', {
      apiUrl: 'https://api.mystore.com/chat',
      title: 'Shopping Assistant',
      primaryColor: '#e91e63'
    });
  </script>
</body>
</html>
```

### WordPress Integration

Add to your theme's `footer.php`:

```php
<div id="assistant-widget"></div>
<script src="<?php echo get_template_directory_uri(); ?>/js/assistant-widget.umd.js"></script>
<script>
  AssistantWidget.createWidget('#assistant-widget', {
    apiUrl: '<?php echo home_url('/wp-json/assistant/v1/chat'); ?>',
    title: '<?php echo get_bloginfo('name'); ?> Assistant',
    primaryColor: '<?php echo get_theme_mod('primary_color', '#007bff'); ?>'
  });
</script>
```

## Support

For integration support:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review the [FAQ](https://github.com/your-repo/wiki/FAQ)
- Contact support at support@yourdomain.com
