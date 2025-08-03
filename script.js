document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const preloader = document.getElementById('preloader');
    const images = document.images;
    const totalImages = images.length;
    let imagesLoaded = 0;

    const hidePreloader = () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.classList.add('loaded');
            scrollToSection(0);
        }, 500);
    };

    const imageLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            hidePreloader();
        }
    };

    for (let i = 0; i < totalImages; i++) {
        const image = images[i];
        if (image.complete) {
            imageLoaded();
        } else {
            image.addEventListener('load', imageLoaded);
            image.addEventListener('error', imageLoaded);
        }
    }

    if (totalImages === 0) {
        hidePreloader();
    }

    const sections = document.querySelectorAll('.section');
    let currentSectionIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;

    const showIcons = (section) => {
        const leftAnimation = section.querySelector('.left-animation');
        const rightAnimation = section.querySelector('.right-animation');
        if (leftAnimation) leftAnimation.classList.add('show-animation');
        if (rightAnimation) rightAnimation.classList.add('show-animation');
    };

    const hideIcons = (section) => {
        const leftAnimation = section.querySelector('.left-animation');
        const rightAnimation = section.querySelector('.right-animation');
        if (leftAnimation) leftAnimation.classList.add('hide-animation');
        if (rightAnimation) rightAnimation.classList.add('hide-animation');
    };

    const resetIcons = (section) => {
        const leftAnimation = section.querySelector('.left-animation');
        const rightAnimation = section.querySelector('.right-animation');
        if (leftAnimation) {
            leftAnimation.classList.remove('show-animation', 'hide-animation');
        }
        if (rightAnimation) {
            rightAnimation.classList.remove('show-animation', 'hide-animation');
        }
    };

    const changeBodyBackground = (index) => {
        const body = document.body;
        const sectionColor = sections[index].getAttribute('data-color');
        if (sectionColor) {
            body.style.backgroundColor = sectionColor;
        }
    };

    const scrollToSection = (index) => {
        if (index >= 0 && index < sections.length && !isScrolling) {
            isScrolling = true;

            if (sections[currentSectionIndex]) {
                hideIcons(sections[currentSectionIndex]);
            }

            setTimeout(() => {
                sections[index].scrollIntoView({behavior: 'smooth'});
                currentSectionIndex = index;
                changeBodyBackground(index);

                resetIcons(sections[currentSectionIndex]);

                setTimeout(() => {
                    showIcons(sections[currentSectionIndex]);
                    isScrolling = false;
                }, 1000);
            }, 500);
        }
    };

    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            scrollToSection(currentSectionIndex + 1);
        } else {
            scrollToSection(currentSectionIndex - 1);
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            scrollToSection(currentSectionIndex + 1);
        } else if (event.key === 'ArrowUp') {
            scrollToSection(currentSectionIndex - 1);
        }
    });

    window.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    });

    window.addEventListener('touchend', (event) => {
        const touchEndY = event.changedTouches[0].clientY;
        const touchDistance = touchEndY - touchStartY;
        const scrollThreshold = 50;

        if (!isScrolling) {
            if (touchDistance < -scrollThreshold) {
                scrollToSection(currentSectionIndex + 1);
            } else if (touchDistance > scrollThreshold) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    });


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});