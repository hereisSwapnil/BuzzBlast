// Popup script for BuzzBlast - Your LinkedIn Wingperson
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('settingsForm');
  const apiKeyInput = document.getElementById('apiKey');
  const commentLengthSelect = document.getElementById('commentLength');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');

  // Load saved API key
  loadSettings();

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await saveSettings();
  });

  // API key input change
  apiKeyInput.addEventListener('input', function() {
    updateStatusIndicator();
  });

  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['geminiApiKey', 'commentLength']);
      if (result.geminiApiKey) {
        apiKeyInput.value = result.geminiApiKey;
        updateStatusIndicator();
      }
      if (result.commentLength) {
        commentLengthSelect.value = result.commentLength;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showStatus('Error loading settings', 'error');
    }
  }

  async function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    const commentLength = commentLengthSelect.value;
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    // Validate API key format (basic check)
    if (!isValidApiKeyFormat(apiKey)) {
      showStatus('Invalid API key format', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      // Test the API key
      const isValid = await testApiKey(apiKey);
      
      if (isValid) {
        // Save to storage
        await chrome.storage.sync.set({ 
          geminiApiKey: apiKey,
          commentLength: commentLength
        });
        updateStatusIndicator();
        showStatus('Settings saved!', 'success');
      } else {
        showStatus('Invalid API key. Please check and try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showStatus('Error saving settings. Please try again.', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = '💥 Save';
    }
  }

  function isValidApiKeyFormat(apiKey) {
    // Basic validation for Gemini API key format
    // Gemini API keys are typically alphanumeric and around 40 characters
    return /^[A-Za-z0-9_-]{20,}$/.test(apiKey);
  }

  async function testApiKey(apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Test connection'
            }]
          }]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('API test error:', error);
      return false;
    }
  }

  function updateStatusIndicator() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      statusIndicator.className = 'status-indicator';
      statusText.textContent = 'No API key set yet';
      return;
    }

    if (isValidApiKeyFormat(apiKey)) {
      statusIndicator.className = 'status-indicator valid';
      statusText.textContent = 'API key looks good';
    } else {
      statusIndicator.className = 'status-indicator';
      statusText.textContent = 'Invalid format';
    }
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';

    // Hide after 3 seconds
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }
}); 