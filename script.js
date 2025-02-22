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
  if (!/android|iphone|ipad|ipod|macintosh|mac os x/.test(userAgent)) {
    document.querySelectorAll('.scrollable').forEach(element => {
      element.classList.add('custom-scrollbar');
    });
  }
});