document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Add custom scrollbar for OS other than Android, iPhone, iPad, iPod, Macintosh, Mac OS X
  // Requires class 'scrollable' to be added to the element.
  const userAgent = navigator.userAgent.toLowerCase();
  console.log('User Agent:', userAgent);
  if (!/android|iphone|ipad|ipod|macintosh|mac os x/.test(userAgent)) {
    document.querySelectorAll('.scrollable').forEach(element => {
      element.classList.add('custom-scrollbar');
    });
  }

  // Process all account addresses
  document.querySelectorAll('.account-address').forEach(function(element) {
    const fullAddress = element.getAttribute('data-value');
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
});
