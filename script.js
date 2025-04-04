document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle?.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Network selector functionality
  const blockchainSelector = document.querySelector('.blockchain-selector');
  if (blockchainSelector) {
    blockchainSelector.addEventListener('click', () => {
      document.body.classList.toggle('network-selection');

      // Optional: Add ESC key listener to close network selection
      if (document.body.classList.contains('network-selection')) {
        document.addEventListener('keydown', handleEscKey);
        // When network selection is active, make main content not focusable
        disableMainContentFocus(true);
      } else {
        document.removeEventListener('keydown', handleEscKey);
        // When network selection is closed, restore focus
        disableMainContentFocus(false);
      }
    });

    // Close network selection when clicking outside
    document.addEventListener('click', (event) => {
      if (document.body.classList.contains('network-selection') &&
          !event.target.closest('.blockchain-selector') &&
          !event.target.closest('.network-selection-panel')) {
        document.body.classList.remove('network-selection');
        document.removeEventListener('keydown', handleEscKey);
        // Restore focus when clicking outside
        disableMainContentFocus(false);
      }
    });

    // Close button in network selection panel
    const networkSelectionClose = document.querySelector('.network-selection-close');
    if (networkSelectionClose) {
      networkSelectionClose.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event from bubbling to parent elements
        document.body.classList.remove('network-selection');
        document.removeEventListener('keydown', handleEscKey);
        disableMainContentFocus(false);
      });
    }

    // Handle ESC key to close network selection
    function handleEscKey(event) {
      if (event.key === 'Escape' || event.keyCode === 27) {
        document.body.classList.remove('network-selection');
        document.removeEventListener('keydown', handleEscKey);
        disableMainContentFocus(false);
      }
    }
  }

  // Function to make all elements within <main> not focusable
  function disableMainContentFocus(disable) {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    // List of all potentially focusable elements
    const focusableElements = mainElement.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      if (disable) {
        // Store original tabindex if it exists
        if (element.hasAttribute('tabindex')) {
          element.setAttribute('data-original-tabindex', element.getAttribute('tabindex'));
        }
        element.setAttribute('tabindex', '-1');
      } else {
        // Restore original tabindex or remove it
        if (element.hasAttribute('data-original-tabindex')) {
          element.setAttribute('tabindex', element.getAttribute('data-original-tabindex'));
          element.removeAttribute('data-original-tabindex');
        } else {
          element.removeAttribute('tabindex');
        }
      }
    });
  }

  // Initially disable focus on main content for better UX
  disableMainContentFocus(true);

  // Scrollbar handling and detection
  const isNonMobileDevice = !/android|iphone|ipad|ipod|macintosh|mac os x/.test(navigator.userAgent.toLowerCase());
  const scrollableElements = document.querySelectorAll('.scrollable');
  let resizeTimeout;
  let rafId;

  // Process all scrollable elements
  function initScrollables() {
    scrollableElements.forEach(element => {
      // Add custom scrollbar for non-mobile devices
      if (isNonMobileDevice) {
        element.classList.add('custom-scrollbar');
      }

      // Initial scrollbar check
      checkScrollbarForElement(element);
    });
  }

  // Check for scrollbars in a specific element
  function checkScrollbarForElement(element) {
    const hasScrollbar = element.scrollHeight > element.clientHeight;

    if (hasScrollbar) {
      element.classList.add('has-scrollbar');

      // Add to parent pagewidth if present
      const pagewidthParent = element.closest('.pagewidth');
      if (pagewidthParent) {
        pagewidthParent.classList.add('has-scroll');
      }
    } else {
      element.classList.remove('has-scrollbar');

      // Check if parent still needs has-scroll class
      const pagewidthParent = element.closest('.pagewidth');
      if (pagewidthParent) {
        const hasOtherScrollables = Array.from(
          pagewidthParent.querySelectorAll('.scrollable.has-scrollbar')
        ).length > 0;

        if (!hasOtherScrollables) {
          pagewidthParent.classList.remove('has-scroll');
        }
      }
    }
  }

  // Check all scrollable elements
  function checkAllScrollbars() {
    cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      scrollableElements.forEach(checkScrollbarForElement);
    });
  }

  // Process all account addresses
  function processAddresses() {
    document.querySelectorAll('.account-address').forEach(element => {
      let fullAddress = element.getAttribute('data-value');

      // If data-value attribute doesn't exist, use the text content instead
      if (!fullAddress) {
        fullAddress = element.textContent.trim();
      }

      // Skip processing if we still don't have an address
      if (!fullAddress) {
        return;
      }

      const maxLength = 32; // Total visible characters

      if (fullAddress.length <= maxLength) {
        element.setAttribute('data-truncated', fullAddress);
      } else {
        // Calculate how many characters to show at beginning and end
        const frontChars = Math.ceil(maxLength / 2) - 1;
        const endChars = Math.floor(maxLength / 2) - 2;

        const truncated =
          fullAddress.substring(0, frontChars) +
          '...' +
          fullAddress.substring(fullAddress.length - endChars);

        element.setAttribute('data-truncated', truncated);
      }
    });
  }

  // Initialize scrollables and address processing
  initScrollables();
  processAddresses();

  // Throttled window resize handler
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(() => {
      checkAllScrollbars();
    }, 33); // ~30fps (1000ms/30)
  });

  // Additional check when all resources are loaded
  window.addEventListener('load', checkAllScrollbars);
});
