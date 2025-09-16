# CORS Configuration Guide for Assistant Widget

This guide provides multiple solutions for handling CORS issues when your widget makes requests from `localhost:5173` to your CraftCMS backend at `https://assistant-cms.ddev.site`.

## Solution 1: DDEV Nginx Configuration (Recommended for Development)

### Step 1: Create Nginx Configuration File

Create the file `.ddev/nginx_full/cors.conf` in your CraftCMS DDEV project:

```nginx
# Add CORS headers for API endpoints
location ~ ^/api/ {
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'http://localhost:5173' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Max-Age' 86400 always;
        add_header 'Content-Type' 'text/plain charset=UTF-8' always;
        add_header 'Content-Length' 0 always;
        return 204;
    }

    # Add CORS headers for actual requests
    add_header 'Access-Control-Allow-Origin' 'http://localhost:5173' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

    # Your existing API handling
    try_files $uri $uri/ /index.php?$query_string;
}
```

### Step 2: Restart DDEV

```bash
ddev restart
```

## Solution 2: CraftCMS Plugin Configuration

### Create a CORS Plugin

Create a custom CraftCMS plugin to handle CORS headers:

```php
<?php
// plugins/cors-headers/src/CorsHeaders.php

namespace corsheaders;

use Craft;
use craft\base\Plugin as BasePlugin;
use craft\web\Response;
use yii\base\Event;
use yii\web\Application;

class CorsHeaders extends BasePlugin
{
    public function init()
    {
        parent::init();

        // Add CORS headers for API requests
        Event::on(
            Application::class,
            Application::EVENT_BEFORE_REQUEST,
            [$this, 'addCorsHeaders']
        );
    }

    public function addCorsHeaders($event)
    {
        $request = Craft::$app->getRequest();
        
        // Only apply to API routes
        if (strpos($request->getPathInfo(), 'api/') === 0) {
            $response = Craft::$app->getResponse();
            
            // Handle preflight requests
            if ($request->getIsOptions()) {
                $response->getHeaders()
                    ->set('Access-Control-Allow-Origin', 'http://localhost:5173')
                    ->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
                    ->set('Access-Control-Allow-Credentials', 'true')
                    ->set('Access-Control-Max-Age', '86400');
                
                $response->setStatusCode(204);
                $response->send();
                exit;
            }
            
            // Add CORS headers for actual requests
            $response->getHeaders()
                ->set('Access-Control-Allow-Origin', 'http://localhost:5173')
                ->set('Access-Control-Allow-Credentials', 'true');
        }
    }
}
```

## Solution 3: Development Proxy (Alternative)

If you prefer not to modify your backend, you can use a development proxy:

### Vite Proxy Configuration

Update your `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://assistant-cms.ddev.site',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'AssistantWidget',
      fileName: (format) => `assistant-widget.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

Then update your widget initialization to use relative URLs:

```javascript
AssistantWidget.createWidget('#assistant-widget', {
  apiUrl: '/api/chat', // Use relative URL
  title: 'Online Assistant',
  primaryColor: '#007bff'
});
```

## Solution 4: Production CORS Configuration

For production deployment, configure CORS to allow your actual domains:

### Nginx Configuration (Production)

```nginx
location ~ ^/api/ {
    # Allow specific domains
    set $cors_origin "";
    if ($http_origin ~* ^https?://(localhost|127\.0\.0\.1|yourdomain\.com|www\.yourdomain\.com)(:[0-9]+)?$) {
        set $cors_origin $http_origin;
    }
    
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' $cors_origin always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Max-Age' 86400 always;
        return 204;
    }
    
    add_header 'Access-Control-Allow-Origin' $cors_origin always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
}
```

## Testing CORS Configuration

### 1. Test with Browser DevTools

Open your widget in the browser and check the Network tab for:
- Preflight OPTIONS request returns 204
- Actual POST request includes CORS headers
- No CORS errors in console

### 2. Test with curl

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://assistant-cms.ddev.site/api/chat

# Test actual request
curl -X POST \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"test123"}' \
  https://assistant-cms.ddev.site/api/chat
```

## Security Considerations

1. **Never use wildcard (*) in production** - Always specify exact domains
2. **Use HTTPS in production** - CORS requires secure contexts for credentials
3. **Validate origins** - Implement proper origin validation
4. **Rate limiting** - Add rate limiting to prevent abuse
5. **Input validation** - Always validate and sanitize API inputs

## Troubleshooting

### Common CORS Errors

1. **"Access to fetch at 'X' from origin 'Y' has been blocked by CORS policy"**
   - Check that your backend is sending proper CORS headers
   - Verify the origin is allowed in your CORS configuration

2. **"Preflight request doesn't pass access control check"**
   - Ensure OPTIONS requests are handled properly
   - Check that all required headers are included in the preflight response

3. **"The request client is not a secure context"**
   - Use HTTPS in production
   - For development, ensure both frontend and backend use the same protocol

### Debug Steps

1. Check browser Network tab for failed requests
2. Verify CORS headers in response
3. Test with curl to isolate browser-specific issues
4. Check server logs for any errors

## Quick Start for Development

For immediate development setup:

1. **Use Solution 1 (DDEV Nginx)** - Easiest for local development
2. **Update your widget API URL** to point to your CraftCMS backend
3. **Test with a simple message** to verify CORS is working
4. **Check browser console** for any remaining errors

Example widget initialization for development:

```javascript
AssistantWidget.createWidget('#assistant-widget', {
  apiUrl: 'https://assistant-cms.ddev.site/api/chat',
  title: 'Development Assistant',
  primaryColor: '#007bff'
});
```
