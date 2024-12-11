import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Click Tracker',
    version: '1.0.0',
    description: 'Records user clicks on web pages',
    permissions: [
      'storage',
      'activeTab',
      'scripting',
      'webRequest',
      'cookies',
      '*://*/*'
    ],
    host_permissions: [
      '*://*/*'
    ],
    content_security_policy: {
  "extension_pages": "script-src 'self'"
    },
    web_accessible_resources: [
      {
        "resources": ["html2canvas.js"],
        "matches": ["<all_urls>"]
      }
    ]
  }
});
