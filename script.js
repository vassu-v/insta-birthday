// Birthdaygram - Instagram-style Birthday Invitation UI
class Birthdaygram {
    constructor() {
        this.carousels = new Map();
        this.wishesData = {
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
        
        this.init();
    }

    init() {
        this.initializeCarousels();
        this.initializeLikeButtons();
        this.initializeBookmarkButtons();
        this.initializeStories();
        this.initializeNavigation();
        this.initializeWishesModal();
        this.initializeRSVPButtons();
        this.initializeDoubleTapLike();
        this.initializeKeyboardNavigation();
        this.initializeShareButtons();
        
        console.log('Birthdaygram initialized successfully! 🎉');
    }

    initializeCarousels() {
        const carouselElements = document.querySelectorAll('.post-carousel');
        
        carouselElements.forEach((carousel, index) => {
            const carouselId = carousel.dataset.carousel || `carousel-${index}`;
            this.carousels.set(carouselId, new CarouselController(carousel));
        });
    }

    initializeLikeButtons() {
        const likeButtons = document.querySelectorAll('.like-btn');
        
        likeButtons.forEach(button => {
            const isLiked = button.getAttribute('data-liked') === 'true';
            this.updateLikeButtonState(button, isLiked);
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLikeClick(button);
            });
        });
    }

    handleLikeClick(button) {
        const currentlyLiked = button.getAttribute('data-liked') === 'true';
        const newLikedState = !currentlyLiked;
        
        button.setAttribute('data-liked', newLikedState.toString());
        this.updateLikeButtonState(button, newLikedState);
        
        // Update likes count
        const post = button.closest('.post');
        const likesCountElement = post.querySelector('.likes-count');
        const currentCount = parseInt(likesCountElement.getAttribute('data-count'));
        const newCount = newLikedState ? currentCount + 1 : currentCount - 1;
        
        likesCountElement.setAttribute('data-count', newCount.toString());
        likesCountElement.textContent = `${newCount.toLocaleString()} likes`;
        
        if (newLikedState) {
            button.style.animation = 'likeAnimation 0.3s ease';
            setTimeout(() => {
                button.style.animation = '';
            }, 300);
        }
        
        this.hapticFeedback();
    }

    updateLikeButtonState(button, isLiked) {
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

    initializeBookmarkButtons() {
        const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
        
        bookmarkButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                button.classList.toggle('bookmarked');
                this.hapticFeedback();
            });
        });
    }

    initializeStories() {
        const storyItems = document.querySelectorAll('.story-item');
        
        storyItems.forEach(story => {
            story.addEventListener('click', () => {
                const username = story.querySelector('.story-username').textContent;
                const avatar = story.querySelector('.story-avatar');
                
                if (avatar.classList.contains('has-story')) {
                    avatar.style.background = '#DBDBDB';
                    avatar.style.padding = '2px';
                }
                
                console.log(`Viewing story from ${username}`);
                this.hapticFeedback();
            });
        });
    }

    initializeNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const pages = ['Home', 'Search', 'Reels', 'Activity', 'Profile'];
                console.log(`Navigating to ${pages[index]}`);
                this.hapticFeedback();
            });
        });
    }

    initializeWishesModal() {
        const modal = document.getElementById('wishesModal');
        const closeBtn = document.getElementById('closeWishes');
        const wishInput = document.getElementById('wishInput');
        const addWishBtn = document.getElementById('addWishBtn');
        const wishesList = document.getElementById('wishesList');
        const viewCommentsLinks = document.querySelectorAll('.view-comments');

        // Check if modal elements exist before adding listeners
        if (!modal || !closeBtn || !wishInput || !addWishBtn || !wishesList) {
            console.warn('Wishes modal elements not found');
            return;
        }

        viewCommentsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = link.getAttribute('data-post');
                this.openWishesModal(postId);
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeWishesModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeWishesModal();
                }
            });
        }

        if (addWishBtn) {
            addWishBtn.addEventListener('click', () => this.addNewWish());
        }
        
        if (wishInput) {
            wishInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addNewWish();
                }
            });
        }

        if (wishInput && addWishBtn) {
            wishInput.addEventListener('input', () => {
                addWishBtn.disabled = !wishInput.value.trim();
            });
        }
    }

    openWishesModal(postId) {
        const modal = document.getElementById('wishesModal');
        if (!modal) return;
        
        const wishes = this.wishesData[postId] || [];
        
        this.renderWishes(wishes);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const closeBtn = document.getElementById('closeWishes');
        if (closeBtn) closeBtn.focus();
    }

    closeWishesModal() {
        const modal = document.getElementById('wishesModal');
        const wishInput = document.getElementById('wishInput');
        
        if (!modal || !wishInput) return;
        
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        wishInput.value = '';
        
        const addWishBtn = document.getElementById('addWishBtn');
        if (addWishBtn) addWishBtn.disabled = true;
    }

    renderWishes(wishes) {
        const wishesList = document.getElementById('wishesList');
        if (!wishesList) return;
        
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

    addNewWish() {
        const wishInput = document.getElementById('wishInput');
        const wishesList = document.getElementById('wishesList');
        
        if (!wishInput || !wishesList) return;
        
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
        
        const addWishBtn = document.getElementById('addWishBtn');
        if (addWishBtn) addWishBtn.disabled = true;
        
        wishesList.scrollTop = wishesList.scrollHeight;
        this.hapticFeedback();
    }

    initializeRSVPButtons() {
        const rsvpButtons = document.querySelectorAll('.rsvp-btn');
        
        rsvpButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.textContent = 'RSVP Sent! ✓';
                button.style.background = '#00C851';
                button.disabled = true;
                
                console.log('RSVP submitted');
                this.hapticFeedback();
            });
        });
    }

    initializeDoubleTapLike() {
        const postCarousels = document.querySelectorAll('.post-carousel');
        
        postCarousels.forEach(carousel => {
            let lastTap = 0;
            
            carousel.addEventListener('click', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 500 && tapLength > 0) {
                    const post = carousel.closest('.post');
                    const likeButton = post.querySelector('.like-btn');
                    
                    if (likeButton.getAttribute('data-liked') !== 'true') {
                        this.handleLikeClick(likeButton);
                        this.showHeartAnimation(carousel);
                    }
                    
                    e.preventDefault();
                }
                
                lastTap = currentTime;
            });
        });
    }

    showHeartAnimation(element) {
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

    initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'l' || e.key === 'L') {
                const firstPost = document.querySelector('.post');
                if (firstPost) {
                    const likeButton = firstPost.querySelector('.like-btn');
                    if (likeButton) this.handleLikeClick(likeButton);
                }
            }
            
            if (e.key === 'Escape') {
                const modal = document.getElementById('wishesModal');
                if (modal && modal.classList.contains('active')) {
                    this.closeWishesModal();
                }
            }
        });
    }

    initializeShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Birthday Invitation',
                            text: 'You\'re invited to my birthday party!',
                            url: window.location.href
                        });
                    } catch (err) {
                        console.log('Share cancelled');
                    }
                } else {
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        console.log('Link copied to clipboard');
                    } catch (err) {
                        console.log('Failed to copy link');
                    }
                }
                this.hapticFeedback();
            });
        });
    }

    hapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
}

class CarouselController {
    constructor(carousel) {
        this.carousel = carousel;
        this.container = carousel.querySelector('.carousel-container');
        this.slides = carousel.querySelectorAll('.carousel-slide');
        this.indicators = carousel.querySelectorAll('.indicator');
        this.prevBtn = carousel.querySelector('.prev-btn');
        this.nextBtn = carousel.querySelector('.next-btn');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }

    init() {
        this.updateCarousel();
        this.bindEvents();
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.initializeTouchEvents();
        this.initializeMouseEvents();
    }

    updateCarousel() {
        const translateX = -(this.currentSlide * (100 / this.totalSlides));
        this.container.style.transform = `translateX(${translateX}%)`;
        
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    initializeTouchEvents() {
        let startX = 0;
        let isDragging = false;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }

    initializeMouseEvents() {
        let mouseStartX = 0;
        let isMouseDragging = false;
        
        this.carousel.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            this.carousel.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        this.carousel.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });
        
        this.carousel.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            
            const endX = e.clientX;
            const diff = mouseStartX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isMouseDragging = false;
            this.carousel.style.cursor = 'grab';
        });
        
        this.carousel.addEventListener('mouseleave', () => {
            isMouseDragging = false;
            this.carousel.style.cursor = 'grab';
        });
        
        // Set initial cursor
        this.carousel.style.cursor = 'grab';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Birthdaygram();
});