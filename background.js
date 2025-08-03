// Background script for BuzzBlast - Your LinkedIn Wingperson
chrome.runtime.onInstalled.addListener(() => {
  console.log('🎉 BuzzBlast extension installed - Ready to spice up LinkedIn!');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open popup when extension icon is clicked
  if (tab.url && tab.url.includes('linkedin.com')) {
    chrome.action.setPopup({ popup: 'popup.html' });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getApiKey') {
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      sendResponse({ apiKey: result.geminiApiKey });
    });
    return true; // Keep message channel open for async response
  }
}); 