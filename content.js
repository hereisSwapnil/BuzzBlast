// LinkedIn Comment Helper - Content Script
class LinkedInCommentHelper {
  constructor() {
    this.apiKey = null;
    this.commentLength = 'short'; // Default to short
    this.isProcessing = false;
    this.emotionButtons = {
      '👍': { name: 'Chill Vibes', mood: 'cool and casual, like your favorite hoodie' },
      '👏': { name: 'Mega Props', mood: 'applause loud enough to echo across LinkedIn' },
      '💡': { name: 'Brainy Takes', mood: 'sharper than your resume bullet points' },
      '🤔': { name: 'Curious Cat', mood: 'genuinely intrigued (not fake deep)' },
      '❤️': { name: 'Heartfelt', mood: 'warm, real, and maybe a little adorable' },
      '✅': { name: 'Agree-to-Slay', mood: 'confident agreement with extra flair' },
      '🎯': { name: 'Laser Focus', mood: 'surgical precision and leadership energy' },
      '🚀': { name: 'Blast Off', mood: 'big ideas. big energy. big everything.' }
    };
    this.selectedMood = null;
    this.init();
  }

  async init() {
    // Get API key and comment length from storage
    const result = await chrome.storage.sync.get(['geminiApiKey', 'commentLength']);
    this.apiKey = result.geminiApiKey;
    this.commentLength = result.commentLength || 'medium';
    
    // Start observing for comment areas
    this.observeCommentAreas();
    
    // Listen for storage changes (API key and comment length updates)
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.geminiApiKey) {
        this.apiKey = changes.geminiApiKey.newValue;
      }
      if (changes.commentLength) {
        this.commentLength = changes.commentLength.newValue;
      }
    });
  }

  observeCommentAreas() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.findAndInjectButtons(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also check existing elements
    this.findAndInjectButtons(document.body);
  }

  findAndInjectButtons(element) {
    // Look for LinkedIn comment input areas
    const commentInputs = element.querySelectorAll ? 
      element.querySelectorAll('div[contenteditable="true"][data-placeholder*="comment"], div[contenteditable="true"][data-placeholder*="Comment"], div[contenteditable="true"][aria-label*="comment"], div[contenteditable="true"][aria-label*="Comment"]') :
      [];

    commentInputs.forEach((input) => {
      if (!input.hasAttribute('data-ai-button-injected')) {
        this.injectAIButton(input);
      }
    });
  }

  injectAIButton(commentInput) {
    // Mark as injected to prevent duplicates
    commentInput.setAttribute('data-ai-button-injected', 'true');

    // Create emotion buttons container
    const emotionContainer = document.createElement('div');
    emotionContainer.className = 'linkedin-emotion-container';
    
    // Create emotion buttons
    Object.entries(this.emotionButtons).forEach(([emoji, config]) => {
      const emotionButton = document.createElement('button');
      emotionButton.className = 'linkedin-emotion-button';
      emotionButton.innerHTML = emoji;
      emotionButton.title = `${config.name} - ${config.mood}`;
      emotionButton.setAttribute('aria-label', `${config.name} mood`);
      
      emotionButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleEmotionClick(commentInput, emoji, config);
      });
      
      emotionContainer.appendChild(emotionButton);
    });

    // Create AI button with BuzzBlast magic effects
    const aiButton = document.createElement('button');
    aiButton.className = 'linkedin-ai-button';
    aiButton.innerHTML = `
      <div class="sparkle"></div>
      <div class="sparkle"></div>
      <div class="sparkle"></div>
      <div class="sparkle"></div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    `;
    aiButton.title = 'Blast that comment! 💥';
    aiButton.setAttribute('aria-label', 'Generate sassy AI comment');

    // Add click handler
    aiButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleAIClick(commentInput);
    });

    // Find the best place to insert the buttons
    const parent = commentInput.parentElement;
    if (parent) {
      // Look for existing button container or create one
      let buttonContainer = parent.querySelector('.linkedin-ai-button-container');
      if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'linkedin-ai-button-container';
        parent.appendChild(buttonContainer);
      }
      
      // Add emotion container first, then AI button
      buttonContainer.appendChild(emotionContainer);
      buttonContainer.appendChild(aiButton);
    }
  }

  handleEmotionClick(commentInput, emoji, config) {
    // Check if the same mood is already selected
    if (this.selectedMood === config.mood) {
      // Deselect the mood
      this.selectedMood = null;
      this.updateEmotionButtonStates(commentInput, null);
    } else {
      // Select the new mood
      this.selectedMood = config.mood;
      this.updateEmotionButtonStates(commentInput, emoji);
    }
    
    // Focus the comment input
    commentInput.focus();
  }

  updateEmotionButtonStates(commentInput, selectedEmoji) {
    const emotionButtons = commentInput.parentElement?.querySelectorAll('.linkedin-emotion-button');
    if (emotionButtons) {
      emotionButtons.forEach(button => {
        if (selectedEmoji && button.innerHTML === selectedEmoji) {
          button.classList.add('selected');
        } else {
          button.classList.remove('selected');
        }
      });
    }
  }

  async handleAIClick(commentInput) {
    if (this.isProcessing) return;
    
    if (!this.apiKey) {
      this.showNotification('Oops! You need to set your API key first. Check the extension settings! 🔑', 'error');
      return;
    }

    this.isProcessing = true;
    this.updateButtonState(commentInput, true);

    try {
      // First expand any "see more" content
      this.expandSeeMoreButtons(commentInput);
      
      // Small delay to let content expand
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const postContent = this.extractPostContent(commentInput);
      const userInput = commentInput.textContent.trim() || 'Generate a comment based on the post content';
      
      // If no post content found, provide a fallback
      if (!postContent || postContent.trim() === '') {
        return;
      }
      
      const mood = this.selectedMood || 'general';
      const aiComment = await this.generateAIComment(userInput, postContent, mood, this.commentLength);
      
      if (aiComment) {
        commentInput.textContent = aiComment;
        commentInput.focus();
      }
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      this.isProcessing = false;
      this.updateButtonState(commentInput, false);
    }
  }

  extractPostContent(commentInput) {
    // Try to find the post content by traversing up the DOM
    let element = commentInput;
    let postContent = '';
    
    // First, find the post container by traversing up
    let postContainer = null;
    for (let i = 0; i < 15; i++) {
      element = element.parentElement;
      if (!element) break;
      
      // Look for post container selectors
      const postContainerSelectors = [
        '[data-test-id="post-text"]',
        '.feed-shared-update-v2__description',
        '.feed-shared-text',
        '.feed-shared-update-v2__content',
        '.artdeco-card',
        '[data-test-id="post-content"]'
      ];
      
      for (const selector of postContainerSelectors) {
        if (element.matches(selector) || element.querySelector(selector)) {
          postContainer = element;
          break;
        }
      }
      
      if (postContainer) break;
    }
    
    if (!postContainer) {
      // Fallback: try to find the closest post container
      element = commentInput;
      for (let i = 0; i < 10; i++) {
        element = element.parentElement;
        if (!element) break;
        
        // Check if this element looks like a post container
        if (element.classList.contains('feed-shared-update-v2') || 
            element.classList.contains('artdeco-card') ||
            element.getAttribute('data-test-id')?.includes('post')) {
          postContainer = element;
          break;
        }
      }
    }
    
    if (postContainer) {
      // Now look for the actual post text within the container
      const postTextSelectors = [
        '[data-test-id="post-text"]',
        '.feed-shared-text__text',
        '.feed-shared-inline-show-more-text',
        '.break-words',
        '.feed-shared-text__text--rich',
        '.feed-shared-text__text--rich-text',
        '.feed-shared-text__text--rich-text-wrapper'
      ];
      
      for (const selector of postTextSelectors) {
        const postTextElement = postContainer.querySelector(selector);
        if (postTextElement) {
          const text = this.cleanPostText(postTextElement.textContent);
          if (text && text.length > 10) {
            postContent = text;
            break;
          }
        }
      }
      
      // If no specific post text found, try to extract from the container itself
      if (!postContent) {
        const containerText = this.cleanPostText(postContainer.textContent);
        if (containerText && containerText.length > 20) {
          // Filter out comment-related text
          const lines = containerText.split('\n').filter(line => {
            const trimmed = line.trim();
            return trimmed.length > 0 && 
                   !trimmed.toLowerCase().includes('comment') &&
                   !trimmed.toLowerCase().includes('like') &&
                   !trimmed.toLowerCase().includes('reply') &&
                   !trimmed.toLowerCase().includes('share') &&
                   !trimmed.toLowerCase().includes('add a comment') &&
                   !trimmed.match(/^[0-9]+[a-z]*$/); // Filter out numbers like "1d", "2w", etc.
          });
          
          if (lines.length > 0) {
            postContent = lines.join(' ').substring(0, 1000);
          }
        }
      }
    }
    
    // Final fallback: look for any meaningful text in the feed
    if (!postContent) {
      const feedElements = document.querySelectorAll('.feed-shared-update-v2, .artdeco-card');
      for (const el of feedElements) {
        // Skip if this element contains the comment input
        if (el.contains(commentInput)) continue;
        
        const text = this.cleanPostText(el.textContent);
        if (text && text.length > 20 && text.length < 2000) {
          // Filter out comment-related content
          if (!text.toLowerCase().includes('add a comment') && 
              !text.toLowerCase().includes('comment') &&
              !text.toLowerCase().includes('like') &&
              !text.toLowerCase().includes('reply')) {
            postContent = text;
            break;
          }
        }
      }
    }

    console.log("This is the post content: ", postContent);
    
    return postContent;
  }

  expandSeeMoreButtons(element) {
    // Find and click "see more" buttons to expand truncated content
    const seeMoreSelectors = [
      '.feed-shared-inline-show-more-text__see-more-less-toggle',
      '.see-more',
      '[aria-label*="see more"]',
      '.feed-shared-inline-show-more-text__dynamic-more-text',
      '.feed-shared-inline-show-more-text button',
      'button[role="button"]'
    ];
    
    // Start from the comment input and traverse up to find the post container
    let currentElement = element;
    for (let i = 0; i < 10; i++) {
      if (!currentElement) break;
      
      // Look for see more buttons in this element and its children
      for (const selector of seeMoreSelectors) {
        try {
          const buttons = currentElement.querySelectorAll(selector);
          buttons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
            
            // Check if this is a "see more" button
            if ((buttonText.includes('more') || buttonText.includes('…')) || 
                ariaLabel.includes('see more') ||
                button.classList.contains('see-more')) {
              try {
                button.click();
                console.log('Clicked see more button:', buttonText);
              } catch (e) {
                console.log('Could not click see more button:', e);
              }
            }
          });
        } catch (e) {
          console.log('Error with selector:', selector, e);
        }
      }
      
      currentElement = currentElement.parentElement;
    }
  }

  cleanPostText(text) {
    if (!text) return '';
    
    // Remove common UI elements and clean up the text
    return text
      .replace(/👍👏💡🤔❤️✅🎯🚀/g, '') // Remove emotion buttons
      .replace(/Add a comment…/g, '') // Remove comment placeholder
      .replace(/…more/g, '') // Remove "more" text
      .replace(/see more/g, '') // Remove "see more" text
      .replace(/see less/g, '') // Remove "see less" text
      .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  async generateAIComment(userInput, postContent, mood, commentLength) {
    const prompt = this.buildPrompt(userInput, postContent, mood, commentLength);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated from API');
    }

    return generatedText.trim();
  }

  buildPrompt(userInput, postContent, mood, commentLength) {
    const hasUserInput = userInput && userInput.trim().toLowerCase() !== 'generate a comment based on the post content';
  
    const userInputSection = hasUserInput 
      ? `
  Include this user instruction or point in the comment: "${userInput}"
  `
      : '';
  
    const lengthInstructions = {
      short: 'Write a concise comment (1-2 lines, 50-100 characters). Make one sharp point or ask one good question.',
      medium: 'Write a balanced comment (2-4 lines, around 100-200 characters). Provide thoughtful insight or ask a meaningful question.',
      long: 'Write a detailed comment (5+ lines, 200+ characters). Share a deeper perspective, include specific examples, or raise multiple points.'
    };
  
    const lengthInstruction = lengthInstructions[commentLength] || lengthInstructions.medium;
  
    const prompt = `
  You are BuzzBlast, an expert at writing engaging and insightful LinkedIn comments that stand out. Your comments are sassy, sharp, professional, and full of personality — without sounding robotic or dull.
  
  Your job is to write a single comment for a LinkedIn post based on:
  - The post content
  - The desired mood or tone
  - The preferred length
  ${hasUserInput ? '- The user-provided instruction\n' : ''}
  
  Always follow these instructions:
  
  1. Analyze the post and identify the key theme or message.
  2. Match the mood exactly. If the mood is "Supportive", sound warm and uplifting. If "Analytical", focus on insights and logic. Always match the emotional tone.
  3. Respect the length guidance: ${lengthInstruction}
  4. Do **not** use formatting like bold, bullets, emojis, or hashtags.
  5. Avoid empty praise or generic phrases like "Great post" or "Thanks for sharing".
  6. No more than one comment. Do not explain or summarize.
  7. Sound like a real, thoughtful human — with flair.
  
  Examples (without formatting):
  
  SHORT:
  Post: Just launched my new open-source project, 'DataWeave'! 
  Mood: Supportive
  Comment: This is fantastic. Can't wait to try DataWeave in my next project. Congrats!
  
  MEDIUM:
  Post: 30% increase in remote tech jobs in Q2 2025.
  Mood: Analytical
  Comment: That’s a big shift. Curious if this trend is helping with long-term employee retention.
  
  LONG:
  Post: After 200 applications, I finally landed a PM job.
  Mood: Inspirational
  User Input: Mention that perseverance is key
  Comment: Your journey is proof that perseverance really pays off. 200 applications and 15 rejections is no small feat. So many people give up before they get this far. Big congrats on pushing through — it’s genuinely inspiring.
  
  Now write one comment that matches all the following:
  
  Post Content:
  "${postContent}"
  
  Mood:
  "${mood}"
  
  Length Preference:
  ${lengthInstruction}
  ${userInputSection}
  Comment:`;
  
    return prompt.trim();
  }

  updateButtonState(commentInput, isLoading) {
    const button = commentInput.parentElement?.querySelector('.linkedin-ai-button');
    if (button) {
      if (isLoading) {
        button.innerHTML = `
          <div class="sparkle"></div>
          <div class="sparkle"></div>
          <div class="sparkle"></div>
          <div class="sparkle"></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spinning">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        `;
        button.classList.add('loading');
        button.disabled = true;
      } else {
        button.innerHTML = `
          <div class="sparkle"></div>
          <div class="sparkle"></div>
          <div class="sparkle"></div>
          <div class="sparkle"></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        `;
        button.classList.remove('loading');
        button.disabled = false;
      }
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `linkedin-ai-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '10000',
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      backgroundColor: type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

// Initialize the helper when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LinkedInCommentHelper();
  });
} else {
  new LinkedInCommentHelper();
} 