let hasUserInteracted = false;

// New Audio Context and Analyser
let audioContext;
let analyser;
let dataArray;
let bufferLength;

function initMedia() {
  console.log("initMedia called");
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background');
  if (!backgroundMusic || !backgroundVideo) {
    console.error("Media elements not found");
    return;
  }
  backgroundMusic.volume = 0.3;
  backgroundVideo.muted = true;

  // Set the new video source from Google Drive
  const newVideoUrl = "https://drive.usercontent.google.com/download?id=19VydvrYYGSqHWx1FVae3-f-ROobdyP-1";
  backgroundVideo.src = newVideoUrl;
  
  // Add error handling for initial video load
  backgroundVideo.addEventListener('error', (e) => {
    console.error("Initial video loading error:", e);
    console.error("Video error details:", backgroundVideo.error);
    
    // Fallback to local video if Google Drive URL fails
    if (backgroundVideo.src === newVideoUrl) {
      console.log("Falling back to local video");
      backgroundVideo.src = 'assets/background.mp4';
      const sourceElement = backgroundVideo.querySelector('source');
      if (sourceElement) {
        sourceElement.type = 'video/mp4';
      }
    }
  });

  backgroundVideo.play().catch(err => {
    console.error("Failed to play background video:", err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Prevent right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Prevent right-click on touch devices
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Initialize media elements
  initMedia();
  
  // Get all DOM elements
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  const backgroundMusic = document.getElementById('background-music');
  const hackerMusic = document.getElementById('hacker-music');
  const rainMusic = document.getElementById('rain-music');
  const animeMusic = document.getElementById('anime-music');
  const carMusic = document.getElementById('car-music');

  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsButton = document.getElementById('results-theme');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const backgroundVideo = document.getElementById('background');
  const hackerOverlay = document.getElementById('hacker-overlay');
  const snowOverlay = document.getElementById('snow-overlay');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');
  const resultsHint = document.getElementById('results-hint');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');

  // Cursor elements
  const cursor = document.querySelector('.custom-cursor');
  const circleOverlay = document.getElementById('circle-overlay');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // Performance optimization: Reduce animations on mobile
  const isMobile = window.innerWidth <= 768;
  const animationMultiplier = isMobile ? 0.5 : 1;

  // Touch device handling
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    
    // Simplified touch handling for mobile
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (cursor) {
        cursor.style.left = touch.clientX + 'px';
        cursor.style.top = touch.clientY + 'px';
        cursor.style.display = 'block';
      }
    });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (cursor) {
        cursor.style.left = touch.clientX + 'px';
        cursor.style.top = touch.clientY + 'px';
        cursor.style.display = 'block';
      }
    });

    document.addEventListener('touchend', () => {
      if (cursor) {
        cursor.style.display = 'none'; 
      }
    });
  } else {
    // Desktop mouse handling
    document.addEventListener('mousemove', (e) => {
      if (circleOverlay) {
        circleOverlay.style.left = e.clientX + 'px';
        circleOverlay.style.top = e.clientY + 'px';
      }
    });

    document.addEventListener('mousedown', () => {
      if (circleOverlay) {
        circleOverlay.classList.add('active');
      }
    });

    document.addEventListener('mouseup', () => {
      if (circleOverlay) {
        circleOverlay.classList.remove('active');
      }
    });
  }

  // Start screen typing animation
  const startMessage = "Click to enter";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    if (startText) {
      startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    }
    setTimeout(typeWriterStart, 100);
  }

  // Cursor blink effect
  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    if (startText) {
      startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    }
  }, 500);

  // Visitor counter initialization
  function initializeVisitorCounter() {
    let totalVisitors = localStorage.getItem('totalVisitorCount');
    if (!totalVisitors) {
      totalVisitors = 0;
      localStorage.setItem('totalVisitorCount', totalVisitors);
    } else {
      totalVisitors = parseInt(totalVisitors);
    }

    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      totalVisitors++;
      localStorage.setItem('totalVisitorCount', totalVisitors);
      localStorage.setItem('hasVisited', 'true');
    }

    if (visitorCount) {
      visitorCount.textContent = totalVisitors.toLocaleString();
    }
  }

  initializeVisitorCounter();

  // New function to update elements based on audio volume
  function updateVisuals() {
    if (analyser && profileBlock && skillsBlock && profileName && profileBio) {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const averageVolume = sum / bufferLength;
      
      const scaleFactor = 1 + (averageVolume / 255) * 0.03; // Scale up to 3%
      const glitchFactor = (averageVolume / 255) * 0.8; // Opacity up to 80%

      gsap.to([profileBlock, skillsBlock], {
        scale: scaleFactor,
        duration: 0.1,
        ease: 'power1.out'
      });

      gsap.to([profileName, profileBio], {
        scale: 1 + (averageVolume / 255) * 0.05,
        duration: 0.1,
        ease: 'power1.out'
      });

      if (glitchOverlay) {
        glitchOverlay.style.opacity = glitchFactor;
      }
    }
    requestAnimationFrame(updateVisuals);
  }

  // Start screen click handler
  function handleStartScreenClick() {
    if (startScreen) {
      startScreen.classList.add('hidden');
    }
    
    if (backgroundMusic) {
      backgroundMusic.muted = false;
      backgroundMusic.play().catch(err => {
        console.error("Failed to play music after start screen click:", err);
      });
      
      // Initialize Web Audio API after user interaction
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(backgroundMusic);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Start the visual update loop
        updateVisuals();
      }
    }
    
    if (profileBlock) {
      profileBlock.classList.remove('hidden');
      gsap.fromTo(profileBlock,
        { opacity: 0, y: -50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1 * animationMultiplier, 
          ease: 'power2.out', 
          onComplete: () => {
            if (profileBlock) {
              profileBlock.classList.add('profile-appear');
            }
            if (profileContainer) {
              profileContainer.classList.add('orbit');
            }
          }
        }
      );
    }
    
    // Initialize cursor trail only on desktop
    if (!isTouchDevice) {
      try {
        new cursorTrailEffect({
          length: 8,
          size: 4,
          speed: 0.2
        });
        console.log("Cursor trail initialized");
      } catch (err) {
        console.error("Failed to initialize cursor trail effect:", err);
      }
    }
    
    typeWriterName();
    typeWriterBio();
  }

  // Start screen event listeners
  if (startScreen) {
    startScreen.addEventListener('click', handleStartScreenClick);
    startScreen.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleStartScreenClick();
    });
  }

  // Name typing animation
  const name = "ジャギン";
  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = false;
  let nameCursorVisible = true;

  function typeWriterName() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++;
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(typeWriterName, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    
    if (profileName) {
      profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
      if (Math.random() < 0.1) {
        profileName.classList.add('glitch');
        setTimeout(() => profileName.classList.remove('glitch'), 200);
      }
    }
    
    setTimeout(typeWriterName, isNameDeleting ? 150 : 300);
  }

  // Name cursor blink
  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    if (profileName) {
      profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
    }
  }, 500);

  // Bio typing animation
  const bioMessages = [
    "why",
    "\"Hello, World!\""
  ];
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    
    if (profileBio) {
      profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
      if (Math.random() < 0.1) {
        profileBio.classList.add('glitch');
        setTimeout(() => profileBio.classList.remove('glitch'), 200);
      }
    }
    
    setTimeout(typeWriterBio, isBioDeleting ? 75 : 150);
  }

  // Bio cursor blink
  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    if (profileBio) {
      profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    }
  }, 500);

  // Audio management
  let currentAudio = backgroundMusic;
  let isMuted = false;

  // Volume icon click handler
  function toggleMute() {
    isMuted = !isMuted;
    if (currentAudio) {
      currentAudio.muted = isMuted;
    }
    
    if (volumeIcon) {
      volumeIcon.innerHTML = isMuted
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
    }
  }

  if (volumeIcon) {
    volumeIcon.addEventListener('click', toggleMute);
    volumeIcon.addEventListener('touchstart', (e) => {
      e.preventDefault();
      toggleMute();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      if (currentAudio) {
        currentAudio.volume = volumeSlider.value;
      }
      isMuted = false;
      if (currentAudio) {
        currentAudio.muted = false;
      }
      if (volumeIcon) {
        volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
      }
    });
  }

  // Theme switching function
  function switchTheme(videoSrc, audio, themeClass, overlay = null, overlayOverProfile = false) {
    let primaryColor;
    switch (themeClass) {
      case 'home-theme':
        primaryColor = '#00CED1';
        break;
      case 'hacker-theme':
        primaryColor = '#22C55E';
        break;
      case 'rain-theme':
        primaryColor = '#1E3A8A';
        break;
      case 'anime-theme':
        primaryColor = '#DC2626';
        break;
      case 'car-theme':
        primaryColor = '#EAB308';
        break;
      default:
        primaryColor = '#00CED1';
    }
    document.documentElement.style.setProperty('--primary-color', primaryColor);

    // Video transition
    gsap.to(backgroundVideo, {
      opacity: 0,
      duration: 0.5 * animationMultiplier,
      ease: 'power2.in',
      onComplete: () => {
        // Update video source
        backgroundVideo.src = videoSrc;
        
        // Update source element type for Limewire URL
        const sourceElement = backgroundVideo.querySelector('source');
        if (sourceElement && videoSrc.includes('limewire.com')) {
          sourceElement.type = 'video/webm';
        }

        // Audio management
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = audio;
        if (currentAudio && volumeSlider) {
          currentAudio.volume = volumeSlider.value;
        }
        if (currentAudio) {
          currentAudio.muted = isMuted;
          currentAudio.play().catch(err => console.error("Failed to play theme music:", err));
          
          // Re-connect analyser to the new audio source
          if (audioContext) {
            const source = audioContext.createMediaElementSource(currentAudio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
          }
        }

        // Theme class management
        document.body.classList.remove('home-theme', 'hacker-theme', 'rain-theme', 'anime-theme', 'car-theme');
        document.body.classList.add(themeClass);

        // Overlay management
        if (hackerOverlay) {
          hackerOverlay.classList.add('hidden');
        }
        if (snowOverlay) {
          snowOverlay.classList.add('hidden');
        }
        
        if (profileBlock) {
          profileBlock.style.zIndex = overlayOverProfile ? 10 : 20;
        }
        if (skillsBlock) {
          skillsBlock.style.zIndex = overlayOverProfile ? 10 : 20;
        }
        
        if (overlay) {
          overlay.classList.remove('hidden');
        }

        // Results button management
        if (themeClass === 'hacker-theme') {
          if (resultsButtonContainer) {
            resultsButtonContainer.classList.remove('hidden');
          }
        } else {
          if (resultsButtonContainer) {
            resultsButtonContainer.classList.add('hidden');
          }
          if (skillsBlock) {
            skillsBlock.classList.add('hidden');
          }
          if (resultsHint) {
            resultsHint.classList.add('hidden');
          }
          if (profileBlock) {
            profileBlock.classList.remove('hidden');
            gsap.to(profileBlock, { 
              x: 0, 
              opacity: 1, 
              duration: 0.5 * animationMultiplier, 
              ease: 'power2.out' 
            });
          }
        }

        // Error handling for video loading
        backgroundVideo.addEventListener('error', (e) => {
          console.error('Video loading error:', e);
          console.error('Video error details:', backgroundVideo.error);
        });
        
        backgroundVideo.addEventListener('loadeddata', () => {
          console.log('Video loaded successfully');
        });
        
        // Fade in video
        gsap.to(backgroundVideo, {
          opacity: 1,
          duration: 0.5 * animationMultiplier,
          ease: 'power2.out',
          onComplete: () => {
            if (profileContainer) {
              profileContainer.classList.remove('orbit');
              void profileContainer.offsetWidth;
              profileContainer.classList.add('orbit');
            }
          }
        });
      }
    });
  }



  // Enhanced parallax effect with mobile optimization
  function handleTilt(e, element) {
    // Reduce parallax effect on mobile for better performance
    if (isMobile) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    // Calculate distance from center (0 to 1)
    const maxDistance = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2);
    const distance = Math.sqrt(mouseX ** 2 + mouseY ** 2);
    const distanceRatio = Math.min(distance / maxDistance, 1);

    // Calculate corner proximity (higher when near corners)
    const cornerProximity = Math.max(
      Math.abs(mouseX / (rect.width / 2)),
      Math.abs(mouseY / (rect.height / 2))
    );

    // Enhanced parallax effect - reduced intensity
    const maxTilt = 15;
    const maxLift = 25;
    const maxScale = 1.04;
    const maxShadow = 20;

    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;
    
    // Enhanced lift effect based on corner proximity
    const liftZ = cornerProximity * maxLift;
    
    // Enhanced scale effect based on distance from center
    const scale = 1 + (distanceRatio * (maxScale - 1));

    // Add dynamic shadow based on tilt
    const shadowX = (mouseX / rect.width) * maxShadow;
    const shadowY = (mouseY / rect.height) * maxShadow;
    const shadowBlur = 20 + (distanceRatio * 10);

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      z: liftZ,
      scale: scale,
      duration: 0.2 * animationMultiplier,
      ease: 'power2.out',
      transformPerspective: 800,
      boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.3)`
    });
  }

  // Parallax event listeners (only on desktop)
  if (!isMobile) {
    if (profileBlock) {
      profileBlock.addEventListener('mousemove', (e) => handleTilt(e, profileBlock));
      profileBlock.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleTilt(e, profileBlock);
      });
    }

    if (skillsBlock) {
      skillsBlock.addEventListener('mousemove', (e) => handleTilt(e, skillsBlock));
      skillsBlock.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleTilt(e, skillsBlock);
      });
    }
  }

  // Reset animations
  function resetElement(element) {
    gsap.to(element, {
      rotationX: 0,
      rotationY: 0,
      z: 0,
      scale: 1,
      boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.3)',
      duration: 0.5 * animationMultiplier,
      ease: 'power2.out'
    });
  }

  if (profileBlock) {
    profileBlock.addEventListener('mouseleave', () => resetElement(profileBlock));
    profileBlock.addEventListener('touchend', () => resetElement(profileBlock));
  }

  if (skillsBlock) {
    skillsBlock.addEventListener('mouseleave', () => resetElement(skillsBlock));
    skillsBlock.addEventListener('touchend', () => resetElement(skillsBlock));
  }

  // Profile picture interactions
  if (profilePicture) {
    profilePicture.addEventListener('mouseenter', () => {
      if (glitchOverlay) {
        glitchOverlay.style.opacity = '1';
        setTimeout(() => {
          glitchOverlay.style.opacity = '0';
        }, 500);
      }
    });

    profilePicture.addEventListener('click', () => {
      if (profileContainer) {
        profileContainer.classList.remove('fast-orbit');
        profileContainer.classList.remove('orbit');
        void profileContainer.offsetWidth;
        profileContainer.classList.add('fast-orbit');
        setTimeout(() => {
          profileContainer.classList.remove('fast-orbit');
          void profileContainer.offsetWidth;
          profileContainer.classList.add('orbit');
        }, 500);
      }
    });

    profilePicture.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (profileContainer) {
        profileContainer.classList.remove('fast-orbit');
        profileContainer.classList.remove('orbit');
        void profileContainer.offsetWidth;
        profileContainer.classList.add('fast-orbit');
        setTimeout(() => {
          profileContainer.classList.remove('fast-orbit');
          void profileContainer.offsetWidth;
          profileContainer.classList.add('orbit');
        }, 500);
      }
    });
  }

  // Results button functionality
  let isShowingSkills = false;
  
  function toggleSkillsView() {
    if (!isShowingSkills) {
      if (profileBlock) {
        gsap.to(profileBlock, {
          x: -100,
          opacity: 0,
          duration: 0.5 * animationMultiplier,
          ease: 'power2.in',
          onComplete: () => {
            if (profileBlock) {
              profileBlock.classList.add('hidden');
            }
            if (skillsBlock) {
              skillsBlock.classList.remove('hidden');
              gsap.fromTo(skillsBlock,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5 * animationMultiplier, ease: 'power2.out' }
              );
            }
            if (pythonBar) {
              gsap.to(pythonBar, { width: '87%', duration: 2 * animationMultiplier, ease: 'power2.out' });
            }
            if (cppBar) {
              gsap.to(cppBar, { width: '75%', duration: 2 * animationMultiplier, ease: 'power2.out' });
            }
            if (csharpBar) {
              gsap.to(csharpBar, { width: '80%', duration: 2 * animationMultiplier, ease: 'power2.out' });
            }
          }
        });
      }
      if (resultsHint) {
        resultsHint.classList.remove('hidden');
      }
      isShowingSkills = true;
    } else {
      if (skillsBlock) {
        gsap.to(skillsBlock, {
          x: 100,
          opacity: 0,
          duration: 0.5 * animationMultiplier,
          ease: 'power2.in',
          onComplete: () => {
            if (skillsBlock) {
              skillsBlock.classList.add('hidden');
            }
            if (profileBlock) {
              profileBlock.classList.remove('hidden');
              gsap.fromTo(profileBlock,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5 * animationMultiplier, ease: 'power2.out' }
              );
            }
          }
        });
      }
      if (resultsHint) {
        resultsHint.classList.add('hidden');
      }
      isShowingSkills = false;
    }
  }

  if (resultsButton) {
    resultsButton.addEventListener('click', toggleSkillsView);
    resultsButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      toggleSkillsView();
    });
  }

  // Start the typing animation
  typeWriterStart();
<<<<<<< HEAD
});
=======
});
>>>>>>> b119fd74ea3f2f124417170b0b4a21d1ab1e5f01
