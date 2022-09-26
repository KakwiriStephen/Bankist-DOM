'use strict';



const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


///////////////////////////////////////
// Modal window


const openModal = function(e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// smooth scroll 
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function(e) {
    const s1coords = section1.getBoundingClientRect();

    // window.scrollTo(
    //     s1coords.left + window.pageXOffset,
    //     s1coords.top + window.pageYOffset,)
    ;
    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth'
    // })
    section1.scrollIntoView({ behavior: 'smooth' });
});



//smooth page Navigation using event delegation

// 1.add event listner to common parent element 
// 2.determine what element originated the event 
document.querySelector('.nav__links').addEventListener('click', function(e) {
    e.preventDefault();
    // matching strategy  
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});



// Tabbed components-operations

tabsContainer.addEventListener('click', function(e) {
    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return;


    // active tab
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');


    // activating content area 
    document.querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
});



// menu fade Animation 
const handleHover = function(e, opacity) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');
        siblings.forEach(el => {
            if (el !== link) el.style.opacity = opacity;
        });
        logo.style.opacity = opacity;
    }
}
nav.addEventListener('mouseover', function(e) {
    handleHover(e, 0.5)
});

nav.addEventListener('mouseout', function(e) {
    handleHover(e, 1)
})



// sticky navigation 
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function() {
//     if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
// });

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(
    stickyNav, {
        root: null,
        threshold: 0,
        rootMargin: `-${navHeight}px`,
    }
);
headerObserver.observe(header);


// revealing sections on scroll  
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    console.log(entry);
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.25,
});
allSections.forEach(function(section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});



// lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    // replace src with data-src 
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function() {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);

};
const imgObserver = new IntersectionObserver(loading, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));


// slider component
const slides = document.querySelectorAll('.slide');

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots')
let currentslide = 0;
const maxslide = slides.length;

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';
const createDots = function() {
    slides.forEach(function(_, i) {
        dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
};
createDots();
const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot')
        .forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active ')
}

// slides.forEach((s, i) => (s.style.transform = `translateX(${100*i}%)`));

// next slide 
const goToSlide = function(slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100*(i-slide)}%)`));


}
goToSlide(0);
// next slide
const nextSlide = function() {
    if (currentslide === maxslide - 1) {
        currentslide = 0;
    } else {
        currentslide++;
    }
    goToSlide(currentslide);
    activateDot(currentslide);
};
const prevSlide = function() {
    if (currentslide === 0) {
        currentslide = maxslide - 1;
    } else { currentslide--; }

    goToSlide(currentslide);
    activateDot(currentslide);
}
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// settting keyboard
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDot(currentslide);
    }
});


























































/*
// Adding ELements to HTML using jascript
// Adding a cookie
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = 'We use cookies for improved functionality and analytics.&copyKakwiri. <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);
document.querySelector('.btn--close-cookie').addEventListener('click', function() {
    message.remove();
})

// styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 160 + 'px';

// Editing css property using css
// custom property 
document.documentElement.style.setProperty('--color-primary', 'orangered');


// Attribute
*/