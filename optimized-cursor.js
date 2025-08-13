// Optimized cursor movement with requestAnimationFrame and throttling
function initOptimizedCursor() {
  const circleOverlay = document.getElementById('circle-overlay');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  
  if (isTouchDevice || !circleOverlay) return;
  
  // Store cursor position
  let cursorX = 0;
  let cursorY = 0;
  let isMoving = false;
  let isMouseDown = false;
  
  // Throttling variables
  let lastUpdateTime = 0;
  const throttleInterval = 5; // ms between updates (higher = less CPU usage, lower = smoother)
  
  // Use requestAnimationFrame for smoother animation
  function updateCursorPosition() {
    if (isMoving && circleOverlay) {
      const now = performance.now();
      if (now - lastUpdateTime > throttleInterval) {
        circleOverlay.style.left = cursorX + 'px';
        circleOverlay.style.top = cursorY + 'px';
        lastUpdateTime = now;
      }
    }
    requestAnimationFrame(updateCursorPosition);
  }
  
  // Start the animation loop
  requestAnimationFrame(updateCursorPosition);
  
  // Optimized event listeners
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    isMoving = true;
  }, { passive: true }); // Use passive listener for better performance
  
  document.addEventListener('mousedown', () => {
    isMouseDown = true;
    if (circleOverlay) {
      circleOverlay.classList.add('active');
    }
  }, { passive: true });
  
  document.addEventListener('mouseup', () => {
    isMouseDown = false;
    if (circleOverlay) {
      circleOverlay.classList.remove('active');
    }
  }, { passive: true });
}

// Export the function for use in the main script
window.initOptimizedCursor = initOptimizedCursor;