# 🔧 Supabase Detector - Chrome Extension
A Chrome extension that automatically detects if a website uses Supabase and provides visual indicators.

[![Dreambase.ai - Supabase detected](https://imagedelivery.net/kgyWhzhmXSpIXGWwA-oX0Q/9acbd1ac-5fd6-4a09-9a2c-818ae085b700/public)](https://dreambase.ai)

Instantly identify websites powered by Supabase with real-time detection and detailed analysis.

## ✨ Features

- 🔍 Comprehensive Detection - Scans for URLs, JavaScript patterns, API calls, and environment variables
- 🎨 Visual Indicators - Icon changes from gray to green with checkmark badge
- 📊 Detailed Popup - Shows exactly what Supabase features were detected and where
- ⚡ Real-time Monitoring - Catches dynamically loaded content and network requests
- 🔄 Auto-Updates - Monitors page changes and updates detection status
- 🚀 Zero Configuration - Works immediately after installation

## 🚀 Quick Install

### Download Release (Recommended)

- Download the latest release
- Extract the ZIP file to a folder
- Open Chrome and go to chrome://extensions/
- Enable "Developer mode" (toggle in top right)
- Click "Load unpacked" and select the extracted folder
- Done! The extension appears in your toolbar


### After installation, visit these sites to verify it's working:

- ✅ dreambase.ai - Icon should turn green with checkmark
- ✅ goodbrands.fyi - Example site using Supabase
- ❌ google.com - Icon should stay gray

## 🔍 What It Detects
The extension uses multiple detection methods to identify Supabase usage:

### 🌐 URL Patterns

- *.supabase.co and *.supabase.com domains
- Supabase API endpoints (/rest/v1/, /auth/v1/, /realtime/v1/)
- Project-specific Supabase URLs

### 💻 JavaScript Analysis

- Global variables: supabaseClient, createClient, supabase
- Import statements: from '@supabase/supabase-js'
- Environment variables: NEXT_PUBLIC_SUPABASE_*, REACT_APP_SUPABASE_*
- Bundled/minified Supabase code patterns

### 🔗 Network Monitoring

- Real-time fetch() and XMLHttpRequest interception
- Performance API analysis for Supabase requests
- Dynamic content loading detection

### 💾 Storage Detection

- localStorage keys containing "supabase" or "sb-"
- sessionStorage for authentication tokens
- Supabase client configuration data

## 📱 How It Works

- Page Load - Extension automatically scans when you visit any website
- Icon Changes - Gray (no Supabase) → Green with ✓ (Supabase detected)
- Click for Details - Click the icon to see what was found and where
- Real-time Updates - Continues monitoring for dynamically loaded content

## 📁 Project Structure
extension/
├── manifest.json       # Extension configuration (Manifest v3)
├── background.js       # Service worker for tab management
├── content.js         # Main detection logic
├── popup.html         # Extension popup interface
├── popup.js          # Popup functionality and display
└── icons/
    ├── icon-default.svg   # Default gray icon
    └── icon-green.svg     # Green detection icon

## 🛠️ Development

### Local Development

- Clone this repository
- Make changes to files in the extension/ folder
- Go to chrome://extensions/
- Click the refresh button on the extension
- Test your changes

### Adding New Detection Patterns
Edit content.js and add patterns to the relevant detection functions:

- checkScriptSources() - For new URL patterns
- checkJavaScriptGlobals() - For new variable names
- isSupabaseURL() - For new domain patterns

### Building a Release

- Update version in manifest.json
- Create ZIP file: zip -r supabase-detector-v[version].zip extension/
- Create new GitHub release with the ZIP file

## 🧩 Browser Compatibility

- ✅ Chrome 88+ (Manifest v3 support)
- ✅ Edge 88+ (Chromium-based)
- ✅ Brave (Chromium-based)
- ⚠️ Firefox - Not compatible (uses Manifest v2)

## 🤝 Contributing
We welcome contributions! Here's how to get started:

### Fork this repository
- Create a feature branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'Add amazing feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request

## Ideas for Contributions

- Add detection for other databases/services
- Improve UI/UX of the popup
- Add keyboard shortcuts
- Create automated tests
- Improve documentation

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Built With

- Chrome Extension API (Manifest v3)
- Vanilla JavaScript - No dependencies for better performance
- SVG Icons - Crisp icons at any size
- Modern Web APIs - Performance API, MutationObserver, Fetch interception

## 📊 Detection Statistics
The extension can identify Supabase usage across various implementation patterns:

- Modern frameworks: Next.js, React, Vue, Nuxt
- Deployment platforms: Vercel, Netlify, Railway
- Authentication patterns: Built-in auth, custom implementations
- Database usage: Direct API calls, ORM integrations

## 🆘 Support

- 🐛 Found a bug? Open an issue
- 💡 Have a feature request? Open an issue
- ❓ Need help? Check the installation guide

## 🌟 Acknowledgments

- Inspired by the need to quickly identify Supabase-powered websites
- Built for developers and teams working with Supabase
- Thanks to the Supabase community for an amazing platform!


⭐ Star this repo if you find it useful! It helps others discover the extension.

Happy Supabase detecting! 🚀
