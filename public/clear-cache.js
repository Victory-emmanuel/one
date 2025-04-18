// This script helps clear the browser cache
(function() {
  // Check if we need to clear the cache
  const clearCache = localStorage.getItem('clearCache');
  const cacheVersion = '1.0.0'; // Update this version when you want to force a cache clear
  
  if (clearCache !== cacheVersion) {
    console.log('Clearing browser cache...');
    
    // Clear localStorage
    localStorage.clear();
    
    // Set the cache version
    localStorage.setItem('clearCache', cacheVersion);
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear service worker caches
    if ('caches' in window) {
      caches.keys().then(function(names) {
        names.forEach(function(name) {
          caches.delete(name);
        });
      });
    }
    
    // Reload the page
    window.location.reload(true);
  }
})();
