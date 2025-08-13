// Performance optimizations for the page
document.addEventListener('DOMContentLoaded', () => {
  // Detect device capabilities
  const isMobile = window.innerWidth <= 768;
  const isLowEndDevice = navigator.hardwareConcurrency <= 4;
  
  // Apply performance optimizations based on device capabilities
  if (isMobile || isLowEndDevice) {
    console.log("Applying performance optimizations for low-end device");
    
    // Reduce animation complexity
    document.documentElement.style.setProperty('--animation-multiplier', '0.5');
    
    // Disable some heavy effects
    const heavyElements = document.querySelectorAll('.glitch-overlay');
    heavyElements.forEach(el => {
      el.style.display = 'none';
    });
    
    // Reduce video quality if possible
    const backgroundVideo = document.getElementById('background');
    if (backgroundVideo) {
      backgroundVideo.setAttribute('playbackRate', '0.8');
      // Lower resolution by scaling
      backgroundVideo.style.transform = 'scale(0.8)';
    }
  }
  
  // Optimize scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    // Clear the timeout if it has already been set
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Set a timeout to run after scrolling ends
    scrollTimeout = setTimeout(() => {
      // Perform heavy operations only after scrolling has stopped
      console.log("Scroll ended, performing deferred operations");
    }, 200);
  }, { passive: true });
  
  // Optimize resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    // Clear the timeout if it has already been set
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    
    // Set a timeout to run after resizing ends
    resizeTimeout = setTimeout(() => {
      // Perform heavy operations only after resizing has stopped
      console.log("Resize ended, performing deferred operations");
    }, 200);
  }, { passive: true });
});