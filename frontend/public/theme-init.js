// Applies the saved theme before first paint so the page never flashes the wrong one.
try {
  var t = localStorage.getItem('unison-theme')
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t)
} catch (e) {}
