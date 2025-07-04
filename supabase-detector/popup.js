// Popup script for Supabase detector
document.addEventListener('DOMContentLoaded', function() {
  const contentDiv = document.getElementById('content');
  
  // Get detection status from background script
  chrome.runtime.sendMessage({ action: 'getDetectionStatus' }, function(response) {
    if (chrome.runtime.lastError) {
      showError('Error getting detection status');
      return;
    }
    
    const detected = response && response.detected;
    showDetectionResult(detected);
    
    // Also try to get details from content script
    getDetectionDetails();
  });
  
  function showDetectionResult(detected) {
    let html = '';
    
    if (detected) {
      html = `
        <div class="status detected">
          ✅ Supabase Detected!
        </div>
        <div id="details-container"></div>
        <button class="refresh-btn" onclick="refreshDetection()">Refresh Detection</button>
      `;
    } else {
      html = `
        <div class="status not-detected">
          ❌ No Supabase Activity Found
        </div>
        <p style="font-size: 12px; color: #6c757d; margin-top: 8px;">
          This website doesn't appear to be using Supabase.
        </p>
        <button class="refresh-btn" onclick="refreshDetection()">Refresh Detection</button>
      `;
    }
    
    contentDiv.innerHTML = html;
  }
  
  function getDetectionDetails() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getDetails' }, function(response) {
        if (chrome.runtime.lastError) {
          // Content script might not be ready, that's okay
          return;
        }
        
        if (response && response.details && response.details.length > 0) {
          showDetails(response.details);
        }
      });
    });
  }
  
  function showDetails(details) {
    const detailsContainer = document.getElementById('details-container');
    if (!detailsContainer) return;
    
    let html = `
      <div class="details">
        <div class="details-title">Detection Details</div>
    `;
    
    details.forEach(detail => {
      html += `<div class="detail-item">${escapeHtml(detail)}</div>`;
    });
    
    html += '</div>';
    detailsContainer.innerHTML = html;
  }
  
  function showError(message) {
    contentDiv.innerHTML = `
      <div class="status not-detected">
        ⚠️ ${message}
      </div>
      <button class="refresh-btn" onclick="refreshDetection()">Try Again</button>
    `;
  }
  
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
  
  // Make refresh function global
  window.refreshDetection = function() {
    contentDiv.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        Refreshing detection...
      </div>
    `;
    
    // Reload content script and re-run detection
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    });
  };
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'detectionComplete') {
    const contentDiv = document.getElementById('content');
    if (contentDiv) {
      showDetectionResult(request.detected);
      if (request.details && request.details.length > 0) {
        showDetails(request.details);
      }
    }
  }
});