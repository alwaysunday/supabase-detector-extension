// Content script for detecting Supabase usage
(function() {
  'use strict';
  
  let detected = false;
  let detectionDetails = [];
  
  // Detection heuristics
  function detectSupabase() {
    // 1. Check for Supabase URLs in scripts, links, and network requests
    checkScriptSources();
    checkLinkHrefs();
    checkNetworkRequests();
    
    // 2. Check for Supabase-related JavaScript globals
    checkJavaScriptGlobals();
    
    // 3. Check for Supabase-related text content
    checkTextContent();
    
    // 4. Check localStorage/sessionStorage for Supabase data
    checkStorage();
    
    // 5. Check for bundled/minified Supabase code
    checkBundledCode();
    
    // 6. Check network requests via fetch/XMLHttpRequest monitoring
    interceptNetworkRequests();
    
    // Send result to background script
    chrome.runtime.sendMessage({
      action: 'supabaseDetected',
      detected: detected,
      details: detectionDetails
    });
  }
  
  // Check script sources for Supabase URLs
  function checkScriptSources() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.src;
      if (isSupabaseURL(src)) {
        detected = true;
        detectionDetails.push(`Script source: ${src}`);
      }
    });
  }
  
  // Check link hrefs for Supabase URLs
  function checkLinkHrefs() {
    const links = document.querySelectorAll('link[href]');
    links.forEach(link => {
      const href = link.href;
      if (isSupabaseURL(href)) {
        detected = true;
        detectionDetails.push(`Link href: ${href}`);
      }
    });
  }
  
  // Check network requests using Performance API
  function checkNetworkRequests() {
    try {
      const entries = performance.getEntries();
      entries.forEach(entry => {
        if (entry.name && isSupabaseURL(entry.name)) {
          detected = true;
          detectionDetails.push(`Network request: ${entry.name}`);
        }
      });
    } catch (e) {
      console.log('Could not check network requests:', e);
    }
  }
  
  // Check for Supabase-related JavaScript globals
  function checkJavaScriptGlobals() {
    const globalChecks = [
      'supabaseClient',
      'createClient',
      'supabase',
      'Supabase',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      '_supabase',
      'supabaseAuth'
    ];
    
    globalChecks.forEach(globalName => {
      if (window[globalName] !== undefined) {
        detected = true;
        detectionDetails.push(`Global variable: ${globalName}`);
      }
    });
    
    // Check for common Supabase import patterns in script content
    const scripts = document.querySelectorAll('script:not([src])');
    scripts.forEach(script => {
      const content = script.textContent || script.innerHTML;
      if (content) {
        const supabasePatterns = [
          /createClient\s*\(/,
          /from\s+['"]@supabase/,
          /import.*supabase/i,
          /supabaseUrl/i,
          /supabaseKey/i,
          /\.supabase\.co/,
          /\.supabase\.com/,
          /\/rest\/v1\//,
          /\/auth\/v1\//,
          /\/realtime\/v1\//,
          // New patterns for modern bundlers
          /"supabase-js"/,
          /supabase.*client/i,
          /NEXT_PUBLIC_SUPABASE/,
          /REACT_APP_SUPABASE/,
          /VITE_SUPABASE/,
          /process\.env.*SUPABASE/i
        ];
        
        supabasePatterns.forEach(pattern => {
          if (pattern.test(content)) {
            detected = true;
            detectionDetails.push(`Script content pattern: ${pattern.source}`);
          }
        });
      }
    });
  }
  
  // Check text content for Supabase references
  function checkTextContent() {
    const textContent = document.body.textContent || document.body.innerText || '';
    const patterns = [
      /supabase\.co/i,
      /supabase\.com/i,
      /powered by supabase/i
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(textContent)) {
        detected = true;
        detectionDetails.push(`Text content: ${pattern.source}`);
      }
    });
  }
  
  // Check localStorage and sessionStorage for Supabase data
  function checkStorage() {
    try {
      // Check localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          detected = true;
          detectionDetails.push(`localStorage key: ${key}`);
        }
      }
      
      // Check sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          detected = true;
          detectionDetails.push(`sessionStorage key: ${key}`);
        }
      }
    } catch (e) {
      console.log('Could not check storage:', e);
    }
  }
  
  // Helper function to check if URL is Supabase-related
  function isSupabaseURL(url) {
    if (!url) return false;
    
    const supabasePatterns = [
      /\.supabase\.co/,
      /\.supabase\.com/,
      /supabase\.io/,
      /\/rest\/v1\//,
      /\/auth\/v1\//,
      /\/realtime\/v1\//,
      /\/storage\/v1\//,
      /\/functions\/v1\//,
      // Additional patterns for edge cases
      /supabase.*\.co/,
      /[a-zA-Z0-9-]+\.supabase\.co/,
      // Check for project-specific URLs
      /[a-zA-Z0-9]{20,}\.supabase\.co/
    ];
    
    return supabasePatterns.some(pattern => pattern.test(url));
  }
  
  // Run detection when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectSupabase);
  } else {
    detectSupabase();
  }
  
  // Also run detection after short delays to catch dynamically loaded content
  setTimeout(detectSupabase, 1000);
  setTimeout(detectSupabase, 3000);
  setTimeout(detectSupabase, 5000);
  
  // Listen for dynamic content changes
  const observer = new MutationObserver(() => {
    // Debounce the detection to avoid too many calls
    clearTimeout(window.supabaseDetectionTimeout);
    window.supabaseDetectionTimeout = setTimeout(detectSupabase, 500);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'href']
  });
  
  // Store detection details for popup access
  window.supabaseDetectionDetails = detectionDetails;
  
  // Check for bundled/minified Supabase code
  function checkBundledCode() {
    // Check all script elements for minified Supabase patterns
    const allScripts = document.querySelectorAll('script');
    allScripts.forEach(script => {
      const content = script.textContent || script.innerHTML;
      if (content && content.length > 1000) { // Only check substantial scripts
        // Look for Supabase-related strings in bundled code
        const bundlePatterns = [
          /supabase-js/i,
          /createClient.*from.*supabase/i,
          /\.supabase\.co/,
          /\.supabase\.com/,
          /postgrest/i,
          /gotrue/i,
          /realtime.*supabase/i,
          // Common bundled variable names
          /[a-zA-Z_$][a-zA-Z0-9_$]*\.from\(['"][^'"]*supabase/,
          /[a-zA-Z_$][a-zA-Z0-9_$]*\.createClient/
        ];
        
        bundlePatterns.forEach(pattern => {
          if (pattern.test(content)) {
            detected = true;
            detectionDetails.push(`Bundled code pattern: ${pattern.source}`);
          }
        });
      }
    });
  }
  
  // Intercept network requests to catch Supabase API calls
  function interceptNetworkRequests() {
    // Override fetch to catch Supabase requests
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && isSupabaseURL(url)) {
          detected = true;
          detectionDetails.push(`Fetch request: ${url}`);
        }
        return originalFetch.apply(this, args);
      };
    }
    
    // Override XMLHttpRequest to catch Supabase requests
    if (window.XMLHttpRequest) {
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && isSupabaseURL(url)) {
          detected = true;
          detectionDetails.push(`XMLHttpRequest: ${url}`);
        }
        return originalOpen.apply(this, arguments);
      };
    }
  }
})();