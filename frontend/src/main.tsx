import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/i18n';
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';

// Global Fetch Interceptor to attach JWT token to all legacy requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const token = localStorage.getItem('token');

  if (token) {
    config = config || {};
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) {
      config = config || {};
      config.headers = {
        ...config.headers,
        'X-Timezone': timezone
      };
    }
  } catch (e) {
    // Ignore timezone error
  }

  // Add XSRF-TOKEN to POST/PUT/DELETE/PATCH requests if available in cookies
  const method = config?.method?.toUpperCase() || 'GET';
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    if (match) {
      config = config || {};
      config.headers = {
        ...config.headers,
        'X-XSRF-TOKEN': decodeURIComponent(match[2])
      };
    }
  }

  return originalFetch(resource, config);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </ThemeProvider>
  </StrictMode>,
);
