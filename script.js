document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // State variables
    let currentIndex = 0;
    let currentVisibleItems = Array.from(galleryItems); // All items are visible initially

    // 1. Filtering Logic with Animation
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter animations
            galleryItems.forEach(item => {
                // First fade out
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    // Check if item should be visible
                    const isVisible = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                    
                    if (isVisible) {
                        item.classList.remove('hide');
                        // Small delay to allow CSS display:block to apply before fading in
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.classList.add('hide');
                    }
                }, 300); // Wait for fade out transition (0.3s)
            });
            
            // Update current visible items array for lightbox navigation
            setTimeout(() => {
                if (filterValue === 'all') {
                    currentVisibleItems = Array.from(galleryItems);
                } else {
                    currentVisibleItems = Array.from(galleryItems).filter(item => 
                        item.getAttribute('data-category') === filterValue
                    );
                }
            }, 300);
        });
    });

    // 2. Lightbox Logic
    
    // Open Lightbox
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            // Determine current index based on the filtered visible items array
            currentIndex = currentVisibleItems.indexOf(item);
            showLightbox(item);
        });
    });
    
    function showLightbox(item) {
        const img = item.querySelector('img');
        const caption = item.querySelector('.caption').textContent;
        
        // Update lightbox content
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption;
        
        // Ensure image opacity is 1 before showing
        lightboxImg.style.opacity = '1';
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling on background
    }
    
    // Close Lightbox
    function closeLightboxFunc() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        
        // Wait for the fade-out animation before clearing src
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxCaption.textContent = '';
        }, 300);
    }
    
    // Close via close button
    closeBtn.addEventListener('click', closeLightboxFunc);
    
    // Close on clicking outside the image (the background overlay)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightboxFunc();
        }
    });
    
    // Navigate Lightbox Settings
    function showNext() {
        if (currentVisibleItems.length === 0) return;
        currentIndex = (currentIndex + 1) % currentVisibleItems.length;
        updateLightboxContent();
    }
    
    function showPrev() {
        if (currentVisibleItems.length === 0) return;
        currentIndex = (currentIndex - 1 + currentVisibleItems.length) % currentVisibleItems.length;
        updateLightboxContent();
    }
    
    function updateLightboxContent() {
        // Fade out image quickly
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            // Get data for new image
            const item = currentVisibleItems[currentIndex];
            const img = item.querySelector('img');
            const caption = item.querySelector('.caption').textContent;
            
            // Render new content
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption;
            
            // Fade image back in
            lightboxImg.style.opacity = '1';
        }, 200); // Delay matches quick fade out
    }
    
    // Next/Prev Buttons event listeners
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    
    // 3. Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        // Only run logic if lightbox is active
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightboxFunc();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });

});
