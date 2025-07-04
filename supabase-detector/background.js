// Background script for Supabase detection
let supabaseDetected = {};

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    // Reset detection status
    supabaseDetected[tabId] = false;
    
    try {
      // Inject content script if not already injected
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
    } catch (error) {
      console.log('Could not inject script:', error);
    }
    
    // Set initial gray icon
    updateIcon(tabId, false);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'supabaseDetected') {
    const tabId = sender.tab.id;
    supabaseDetected[tabId] = request.detected;
    updateIcon(tabId, request.detected);
    sendResponse({ success: true });
  }
});

// Update icon based on detection
function updateIcon(tabId, detected) {
  const iconPath = detected ? "icons/icon-green.svg" : "icons/icon-default.svg";
  
  chrome.action.setIcon({
    tabId: tabId,
    path: iconPath
  });
  
  // Set badge text
  chrome.action.setBadgeText({
    tabId: tabId,
    text: detected ? '✓' : ''
  });
  
  chrome.action.setBadgeBackgroundColor({
    tabId: tabId,
    color: '#4CAF50'
  });
}

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  delete supabaseDetected[tabId];
});

// Export detection status for popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getDetectionStatus') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      sendResponse({ detected: supabaseDetected[tabId] || false });
    });
    return true; // Keep message channel open for async response
  }
});