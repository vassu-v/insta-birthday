// Birthdaygram - Instagram-style Birthday Invitation UI

document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    function initializeCarousel(carousel) {
        const container = carousel.querySelector('.carousel-container');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.indicator');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        function updateCarousel() {
            const translateX = -(currentSlide * (100 / totalSlides));
            container.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
        
        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
        });
        
        // Mouse drag support for desktop
        let mouseStartX = 0;
        let isMouseDragging = false;
        
        carousel.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            carousel.style.cursor = 'grabbing';
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });
        
        carousel.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            
            const endX = e.clientX;
            const diff = mouseStartX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isMouseDragging = false;
            carousel.style.cursor = 'grab';
        });
        
        carousel.addEventListener('mouseleave', () => {
            isMouseDragging = false;
            carousel.style.cursor = 'grab';
        });
        
        // Auto-play (optional)
        // setInterval(nextSlide, 5000);
    }
    
    // Initialize all carousels
    const carousels = document.querySelectorAll('.post-carousel');
    carousels.forEach(initializeCarousel);
    
    // Like button functionality
    function initializeLikeButtons() {
        const likeButtons = document.querySelectorAll('.like-btn');
        likeButtons.forEach(button => {
            // Set initial state based on data attribute
            const isLiked = button.getAttribute('data-liked') === 'true';
            updateLikeButtonState(button, isLiked);
            
            button.addEventListener('click', function() {
                const currentlyLiked = this.getAttribute('data-liked') === 'true';
                const newLikedState = !currentlyLiked;
                
                this.setAttribute('data-liked', newLikedState.toString());
                updateLikeButtonState(this, newLikedState);
                
                // Update likes count
                const post = this.closest('.post');
                const likesCountElement = post.querySelector('.likes-count');
                const currentCount = parseInt(likesCountElement.getAttribute('data-count'));
                const newCount = newLikedState ? currentCount + 1 : currentCount - 1;
                
                likesCountElement.setAttribute('data-count', newCount.toString());
                likesCountElement.textContent = newCount.toLocaleString() + ' likes';
                
                if (newLikedState) {
                    // Add animation
                    this.style.animation = 'likeAnimation 0.3s ease';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 300);
                }
                
                // Haptic feedback
                hapticFeedback();
            });
        });
    }
    
    function updateLikeButtonState(button, isLiked) {
        const svg = button.querySelector('svg');
        const path = svg.querySelector('path');
        
        if (isLiked) {
            svg.setAttribute('fill', '#ED4956');
            svg.setAttribute('stroke', 'none');
            path.setAttribute('fill', '#ED4956');
        } else {
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '1.5');
            path.removeAttribute('fill');
        }
    }
    
    // Initialize like buttons
    initializeLikeButtons();
    
    // Bookmark button functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('bookmarked');
            hapticFeedback();
        });
    });
    
    // Story click functionality
    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach(story => {
        story.addEventListener('click', function() {
            const username = this.querySelector('.story-username').textContent;
            
            // Add viewed state
            const avatar = this.querySelector('.story-avatar');
            if (avatar.classList.contains('has-story')) {
                avatar.style.background = '#DBDBDB';
                avatar.style.padding = '2px';
            }
            
            console.log(`Viewing story from ${username}`);
            hapticFeedback();
        });
    });
    
    // Double tap to like functionality
    const postCarousels = document.querySelectorAll('.post-carousel');
    postCarousels.forEach(carousel => {
        let lastTap = 0;
        
        carousel.addEventListener('click', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                const post = this.closest('.post');
                const likeButton = post.querySelector('.like-btn');
                
                if (likeButton.getAttribute('data-liked') !== 'true') {
                    likeButton.click();
                    
                    // Show heart animation
                    showHeartAnimation(this);
                }
                
                e.preventDefault();
            }
            
            lastTap = currentTime;
        });
    });
    
    // Heart animation for double tap
    function showHeartAnimation(element) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'heart-animation';
        
        element.style.position = 'relative';
        element.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 600);
    }
    
    // Navigation functionality
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Simulate navigation
            const pages = ['Home', 'Search', 'Reels', 'Activity', 'Profile'];
            console.log(`Navigating to ${pages[index]}`);
            hapticFeedback();
        });
    });
    
    // Stories horizontal scroll with touch
    const storiesContainer = document.querySelector('.stories-scroll');
    let isScrolling = false;
    let startX;
    let scrollLeft;
    
    storiesContainer.addEventListener('mousedown', (e) => {
        isScrolling = true;
        startX = e.pageX - storiesContainer.offsetLeft;
        scrollLeft = storiesContainer.scrollLeft;
        storiesContainer.style.cursor = 'grabbing';
    });
    
    storiesContainer.addEventListener('mouseleave', () => {
        isScrolling = false;
        storiesContainer.style.cursor = 'grab';
    });
    
    storiesContainer.addEventListener('mouseup', () => {
        isScrolling = false;
        storiesContainer.style.cursor = 'grab';
    });
    
    storiesContainer.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - storiesContainer.offsetLeft;
        const walk = (x - startX) * 2;
        storiesContainer.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events for mobile
    storiesContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - storiesContainer.offsetLeft;
        scrollLeft = storiesContainer.scrollLeft;
    });
    
    storiesContainer.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - storiesContainer.offsetLeft;
        const walk = (x - startX) * 2;
        storiesContainer.scrollLeft = scrollLeft - walk;
    });
    
    // RSVP button functionality
    const rsvpButtons = document.querySelectorAll('.rsvp-btn');
    rsvpButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Simulate RSVP functionality
            this.textContent = 'RSVP Sent! ✓';
            this.style.background = '#00C851';
            this.disabled = true;
            
            // You could integrate with actual RSVP services here
            console.log('RSVP submitted');
            hapticFeedback();
        });
    });
    
    // Wishes functionality
    const wishesModal = document.getElementById('wishesModal');
    const closeWishesBtn = document.getElementById('closeWishes');
    const wishInput = document.getElementById('wishInput');
    const addWishBtn = document.getElementById('addWishBtn');
    const wishesList = document.getElementById('wishesList');
    
    // Sample wishes data
    const wishesData = {
        1: [
            {
                username: 'sarah_jones',
                avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                text: 'Happy birthday! Hope you have an amazing celebration! 🎉',
                time: '2h'
            },
            {
                username: 'mike_photo',
                avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                text: 'Wishing you all the best on your special day! 🎂',
                time: '3h'
            },
            {
                username: 'emma_travel',
                avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                text: 'Can\'t wait to celebrate with you! 🥳',
                time: '4h'
            }
        ],
        2: [
            {
                username: 'alex_fit',
                avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                text: 'Such beautiful memories! Happy birthday! 💕',
                time: '1h'
            },
            {
                username: 'sarah_jones',
                avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                text: 'Love looking back at all these amazing moments! 📸',
                time: '2h'
            }
        ]
    };
    
    function openWishesModal(postId) {
        const wishes = wishesData[postId] || [];
        renderWishes(wishes);
        wishesModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeWishesModal() {
        wishesModal.classList.remove('active');
        document.body.style.overflow = '';
        wishInput.value = '';
    }
    
    function renderWishes(wishes) {
        wishesList.innerHTML = '';
        wishes.forEach(wish => {
            const wishElement = document.createElement('div');
            wishElement.className = 'wish-item';
            wishElement.innerHTML = `
                <img src="${wish.avatar}" alt="${wish.username}" class="wish-avatar">
                <div class="wish-content">
                    <div class="wish-username">${wish.username}</div>
                    <div class="wish-text">${wish.text}</div>
                    <div class="wish-time">${wish.time}</div>
                </div>
            `;
            wishesList.appendChild(wishElement);
        });
    }
    
    function addNewWish() {
        const wishText = wishInput.value.trim();
        if (!wishText) return;
        
        const newWish = {
            username: 'you',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            text: wishText,
            time: 'now'
        };
        
        const wishElement = document.createElement('div');
        wishElement.className = 'wish-item';
        wishElement.innerHTML = `
            <img src="${newWish.avatar}" alt="${newWish.username}" class="wish-avatar">
            <div class="wish-content">
                <div class="wish-username">${newWish.username}</div>
                <div class="wish-text">${newWish.text}</div>
                <div class="wish-time">${newWish.time}</div>
            </div>
        `;
        
        wishesList.appendChild(wishElement);
        wishInput.value = '';
        
        // Scroll to bottom
        wishesList.scrollTop = wishesList.scrollHeight;
        
        hapticFeedback();
    }
    
    // Event listeners for wishes
    const viewCommentsLinks = document.querySelectorAll('.view-comments');
    viewCommentsLinks.forEach(link => {
        link.addEventListener('click', function() {
            const postId = this.getAttribute('data-post');
            openWishesModal(postId);
        });
    });
    
    closeWishesBtn.addEventListener('click', closeWishesModal);
    
    wishesModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeWishesModal();
        }
    });
    
    addWishBtn.addEventListener('click', addNewWish);
    
    wishInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewWish();
        }
    });
    
    wishInput.addEventListener('input', function() {
        addWishBtn.disabled = !this.value.trim();
    });
    
    // Music player functionality
    const musicToggle = document.querySelector('.music-toggle');
    const musicIcon = document.querySelector('.music-icon');
    let isPlaying = false;
    
    musicToggle.addEventListener('click', function() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            this.classList.add('playing');
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
            `;
            musicIcon.style.animation = 'musicPulse 1s ease-in-out infinite';
        } else {
            this.classList.remove('playing');
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"></polygon>
                </svg>
            `;
            musicIcon.style.animation = 'musicPulse 2s ease-in-out infinite';
        }
        
        hapticFeedback();
    });
    
    // Comment button functionality
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const post = this.closest('.post');
            const viewCommentsLink = post.querySelector('.view-comments');
            viewCommentsLink.click();
        });
    });
    
    // Share functionality
    const shareButtons = document.querySelectorAll('.post-actions-left .action-btn:nth-child(3)');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Birthday Invitation',
                    text: 'You\'re invited to my birthday party!',
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                    console.log('Link copied to clipboard');
                });
            }
            hapticFeedback();
        });
    });
    
    // Infinite scroll simulation
    let isLoading = false;
    
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && !isLoading) {
            isLoading = true;
            
            setTimeout(() => {
                console.log('Loading more posts...');
                isLoading = false;
            }, 1000);
        }
    });
    
    // Pull-to-refresh simulation
    let startY = 0;
    let pullDistance = 0;
    const refreshThreshold = 100;
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].pageY;
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (window.scrollY === 0 && startY) {
            pullDistance = e.touches[0].pageY - startY;
            
            if (pullDistance > 0 && pullDistance < refreshThreshold) {
                document.body.style.transform = `translateY(${pullDistance * 0.5}px)`;
            }
        }
    });
    
    document.addEventListener('touchend', () => {
        if (pullDistance > refreshThreshold) {
            console.log('Refreshing feed...');
            
            document.body.style.transform = '';
            document.body.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        } else {
            document.body.style.transform = '';
            document.body.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        }
        
        startY = 0;
        pullDistance = 0;
    });
    
    // Haptic feedback simulation
    function hapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'l' || e.key === 'L') {
            const firstPost = document.querySelector('.post');
            if (firstPost) {
                const likeButton = firstPost.querySelector('.like-btn');
                likeButton.click();
            }
        }
        
        if (e.key === 'ArrowLeft') {
            storiesContainer.scrollBy({ left: -100, behavior: 'smooth' });
        }
        
        if (e.key === 'ArrowRight') {
            storiesContainer.scrollBy({ left: 100, behavior: 'smooth' });
        }
        
        if (e.key === 'ArrowUp') {
            const activeCarousel = document.querySelector('.post-carousel');
            if (activeCarousel) {
                const prevBtn = activeCarousel.querySelector('.prev-btn');
                prevBtn.click();
            }
        }
        
        if (e.key === 'ArrowDown') {
            const activeCarousel = document.querySelector('.post-carousel');
            if (activeCarousel) {
                const nextBtn = activeCarousel.querySelector('.next-btn');
                nextBtn.click();
            }
        }
    });
    
    // Initialize smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    console.log('Birthdaygram UI loaded successfully! 🎉✨');
});