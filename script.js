/**
 * GRETE - Underground Fashion Brand
 * Interactive functionality
 */

document.addEventListener("DOMContentLoaded", () => {
  initCollections();
  initSubcollections();
  initGalleries();
  initSmoothScroll();
  initHeroParallax();
});

/**
 * Close all open galleries (collections and subcollections)
 */
function closeAllGalleries() {
  document.querySelectorAll(".collection.is-open").forEach((c) => {
    c.classList.remove("is-open");
  });
  document.querySelectorAll(".subcollection.is-open").forEach((s) => {
    s.classList.remove("is-open");
  });
}

/**
 * Collection Accordion
 * Handles expanding/collapsing collection sections
 */
function initCollections() {
  const collections = document.querySelectorAll(".collection");

  collections.forEach((collection) => {
    const header = collection.querySelector(
      ".collection-header:not(.collection-header--main)",
    );

    // Skip if this is a main header (non-clickable)
    if (!header) return;

    header.addEventListener("click", () => {
      const isOpening = !collection.classList.contains("is-open");

      // Close all galleries first
      closeAllGalleries();

      // Open this collection if it was closed
      if (isOpening) {
        collection.classList.add("is-open");

        // Reset gallery position when opening
        const gallery = collection.querySelector(".gallery-track");
        if (gallery) {
          gallery.scrollLeft = 0;
        }
      }
    });
  });

  // Open first subcollection by default (Runway)
  const firstSubcollection = document.querySelector(".subcollection");
  if (firstSubcollection) {
    firstSubcollection.classList.add("is-open");
  }
}

/**
 * Subcollection Accordion
 * Handles expanding/collapsing subcollection sections (Runway, Detail, etc.)
 */
function initSubcollections() {
  const subcollections = document.querySelectorAll(".subcollection");

  subcollections.forEach((subcollection) => {
    const header = subcollection.querySelector(".subcollection-header");

    header.addEventListener("click", () => {
      const isOpening = !subcollection.classList.contains("is-open");

      // Close all galleries first
      closeAllGalleries();

      // Open this subcollection if it was closed
      if (isOpening) {
        subcollection.classList.add("is-open");

        // Reset gallery position when opening
        const gallery = subcollection.querySelector(".gallery-track");
        if (gallery) {
          gallery.scrollLeft = 0;
          updateGalleryCounter(subcollection, 0);
        }
      }
    });
  });
}

/**
 * Gallery Navigation
 * Handles carousel prev/next and counter updates
 */
function initGalleries() {
  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {
    const track = gallery.querySelector(".gallery-track");
    const prevBtn = gallery.querySelector(".gallery-prev");
    const nextBtn = gallery.querySelector(".gallery-next");
    const slides = gallery.querySelectorAll(".gallery-slide");

    if (!track || !slides.length) return;

    // Get slide width including gap
    const getSlideWidth = () => {
      const slide = slides[0];
      const style = getComputedStyle(track);
      const gap = parseInt(style.gap) || 16;
      return slide.offsetWidth + gap;
    };

    // Navigate to previous slide
    prevBtn?.addEventListener("click", () => {
      const slideWidth = getSlideWidth();
      track.scrollBy({ left: -slideWidth, behavior: "smooth" });
    });

    // Navigate to next slide
    nextBtn?.addEventListener("click", () => {
      const slideWidth = getSlideWidth();
      track.scrollBy({ left: slideWidth, behavior: "smooth" });
    });

    // Update counter on scroll
    track.addEventListener("scroll", () => {
      const slideWidth = getSlideWidth();
      const currentIndex = Math.round(track.scrollLeft / slideWidth);
      updateGalleryCounterForGallery(gallery, currentIndex);
    });

    // Initialize counter
    updateGalleryCounterForGallery(gallery, 0);
  });
}

/**
 * Update gallery counter display for a specific gallery
 */
function updateGalleryCounterForGallery(gallery, currentIndex) {
  const counter = gallery.querySelector(".gallery-counter");
  const slides = gallery.querySelectorAll(".gallery-slide");

  if (!counter || !slides.length) return;

  const current = String(currentIndex + 1).padStart(2, "0");
  const total = String(slides.length).padStart(2, "0");
  counter.textContent = `${current} / ${total}`;
}

/**
 * Update gallery counter display (legacy, for subcollection context)
 */
function updateGalleryCounter(container, currentIndex) {
  const counter = container.querySelector(".gallery-counter");
  const slides = container.querySelectorAll(".gallery-slide");

  if (!counter || !slides.length) return;

  const current = String(currentIndex + 1).padStart(2, "0");
  const total = String(slides.length).padStart(2, "0");
  counter.textContent = `${current} / ${total}`;
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/**
 * Keyboard navigation for galleries
 */
document.addEventListener("keydown", (e) => {
  const openSubcollection = document.querySelector(".subcollection.is-open");
  if (!openSubcollection) return;

  const track = openSubcollection.querySelector(".gallery-track");
  if (!track) return;

  const slides = openSubcollection.querySelectorAll(".gallery-slide");
  const slideWidth = slides[0]?.offsetWidth + 16 || 400;

  if (e.key === "ArrowLeft") {
    track.scrollBy({ left: -slideWidth, behavior: "smooth" });
  } else if (e.key === "ArrowRight") {
    track.scrollBy({ left: slideWidth, behavior: "smooth" });
  }
});

/**
 * Hero Parallax
 * Pans the hero background image as user scrolls down
 */
function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const nav = document.querySelector(".nav-vertical");
  const header = document.querySelector(".header");
  if (!hero) return;

  // The scroll distance over which the image pans (one viewport height)
  const panDistance = window.innerHeight;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Only apply effect during the pan phase
    if (scrollY <= panDistance) {
      // Calculate percentage scrolled (0 to 1)
      const scrollPercent = scrollY / panDistance;

      // Pan from 15% to 85% as we scroll
      const bgPosition = 15 + scrollPercent * 70;
      hero.style.backgroundPosition = `center ${bgPosition}%`;

      // Fade out nav as we scroll
      if (nav) {
        nav.style.opacity = 1 - scrollPercent;
      }

      // Hide header during hero
      if (header) {
        header.classList.remove("is-visible");
      }
    } else {
      // Hide nav completely after hero
      if (nav) {
        nav.style.opacity = 0;
      }

      // Show header after hero
      if (header) {
        header.classList.add("is-visible");
      }
    }
  });
}
