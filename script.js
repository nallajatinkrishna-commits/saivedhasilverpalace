/* 
   SaiVedha - Luxury Silver Showroom
   Interactive Features & Animations
*/

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initTestimonialsSlider();
  initLightbox();
  initCartAndWishlist();
  initContactForm();
  initSearchToggle();
  initQuickView();
  replacePricesWithWeights();
  initLiveSilverRate();
  initCustomerAuth();
});

/* --- Navbar Scroll Behavior --- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-luxury');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --- Testimonials Auto & Manual Slider --- */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.btn-slider-prev');
  const nextBtn = document.querySelector('.btn-slider-next');
  if (!track || !prevBtn || !nextBtn) return;
  
  let index = 0;
  let autoSlideTimer;
  
  function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width > 991) return 3;
    if (width > 575) return 2;
    return 1;
  }
  
  function slide() {
    const cards = document.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    const visibleCards = getVisibleCardsCount();
    const maxIndex = totalCards - visibleCards;
    
    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;
    
    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // 1.5rem gap in pixels
    const offset = index * (cardWidth + gap);
    
    track.style.transform = `translateX(-${offset}px)`;
  }
  
  function next() {
    index++;
    slide();
  }
  
  function prev() {
    index--;
    slide();
  }
  
  nextBtn.addEventListener('click', () => {
    next();
    resetAutoSlide();
  });
  
  prevBtn.addEventListener('click', () => {
    prev();
    resetAutoSlide();
  });
  
  window.addEventListener('resize', slide);
  
  function startAutoSlide() {
    autoSlideTimer = setInterval(next, 5000);
  }
  
  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }
  
  startAutoSlide();
}

/* --- Interactive Lightbox --- */
function initLightbox() {
  const lightbox = document.getElementById('luxuryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (!lightbox || !lightboxImg || !lightboxCaption || !closeBtn) return;
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title').textContent;
      const category = item.querySelector('.gallery-item-category').textContent;
      
      lightboxImg.src = img.src;
      lightboxCaption.textContent = `${title} - ${category}`;
      lightbox.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
  });
  
  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

/* --- Cart and Wishlist Systems --- */
function initCartAndWishlist() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  
  let cartCount = cartItems.length;
  let wishlistCount = wishlistItems.length;
  
  const cartBadge = document.getElementById('cartBadgeCount');
  const wishlistBadge = document.getElementById('wishlistBadgeCount');
  
  // Set initial badge values
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    if (cartCount > 0) cartBadge.classList.remove('d-none');
    else cartBadge.classList.add('d-none');
  }
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlistCount;
    if (wishlistCount > 0) wishlistBadge.classList.remove('d-none');
    else wishlistBadge.classList.add('d-none');
  }
  
  const toast = document.getElementById('luxuryToast');
  const toastMessage = document.getElementById('toastMessage');
  
  function showToast(message, isWishlist = false) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    
    if (isWishlist) {
      toast.classList.add('wishlist-toast');
      toast.querySelector('i').className = 'bi bi-heart-fill text-danger';
    } else {
      toast.classList.remove('wishlist-toast');
      toast.querySelector('i').className = 'bi bi-check-circle-fill text-success';
    }
    
    toast.style.display = 'flex';
    
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }
  
  // Attach event listeners to all cart action buttons
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.btn-add-cart')) {
      const btn = e.target.closest('.btn-add-cart');
      const title = btn.getAttribute('data-product') || 'Antique Article';
      
      // Attempt to extract image path
      let imgSrc = 'assets/images/logo.jpg';
      const card = btn.closest('.antique-card') || btn.closest('.product-card');
      if (card) {
        const img = card.querySelector('.antique-img') || card.querySelector('img');
        if (img) imgSrc = img.getAttribute('src');
      } else {
        const modalImg = document.querySelector('.modal-product-img');
        if (modalImg && modalImg.getAttribute('src')) imgSrc = modalImg.getAttribute('src');
      }
      
      // Attempt to extract price
      let itemPrice = '';
      if (card) {
        const priceEl = card.querySelector('.antique-price');
        if (priceEl) itemPrice = priceEl.textContent.trim();
      } else {
        const modalPrice = document.querySelector('.modal-product-price');
        if (modalPrice && modalPrice.textContent !== 'Price') itemPrice = modalPrice.textContent.trim();
      }
      
      // Avoid duplicates
      if (!cartItems.some(item => item.title === title)) {
        cartItems.push({ title, img: imgSrc, price: itemPrice });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        cartCount = cartItems.length;
        if (cartBadge) {
          cartBadge.textContent = cartCount;
          cartBadge.classList.remove('d-none');
        }
      }
      showToast(`"${title}" added to your premium cart!`);
    }
    
    if (e.target.closest('.btn-add-wishlist')) {
      const btn = e.target.closest('.btn-add-wishlist');
      const title = btn.getAttribute('data-product') || 'Antique Article';
      
      // Attempt to extract image path
      let imgSrc = 'assets/images/logo.jpg';
      const card = btn.closest('.antique-card') || btn.closest('.product-card');
      if (card) {
        const img = card.querySelector('.antique-img') || card.querySelector('img');
        if (img) imgSrc = img.getAttribute('src');
      } else {
        const modalImg = document.querySelector('.modal-product-img');
        if (modalImg && modalImg.getAttribute('src')) imgSrc = modalImg.getAttribute('src');
      }
      
      // Attempt to extract price
      let itemPrice = '';
      if (card) {
        const priceEl = card.querySelector('.antique-price');
        if (priceEl) itemPrice = priceEl.textContent.trim();
      } else {
        const modalPrice = document.querySelector('.modal-product-price');
        if (modalPrice && modalPrice.textContent !== 'Price') itemPrice = modalPrice.textContent.trim();
      }
      
      // Avoid duplicates
      if (!wishlistItems.some(item => item.title === title)) {
        wishlistItems.push({ title, img: imgSrc, price: itemPrice });
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        wishlistCount = wishlistItems.length;
        if (wishlistBadge) {
          wishlistBadge.textContent = wishlistCount;
          wishlistBadge.classList.remove('d-none');
        }
      }
      showToast(`"${title}" added to your wishlist!`, true);
    }
  });
  
  // Modal render handlers
  const wishlistModal = document.getElementById('wishlistModal');
  const wishlistModalBody = document.getElementById('wishlistModalBody');
  if (wishlistModal && wishlistModalBody) {
    wishlistModal.addEventListener('show.bs.modal', () => {
      renderWishlist();
    });
  }
  
  function renderWishlist() {
    if (wishlistItems.length === 0) {
      wishlistModalBody.innerHTML = `
        <div class="text-center py-4">
          <i class="bi bi-heart text-muted mb-3" style="font-size: 2.5rem; display: block;"></i>
          <p class="text-muted mb-0">Your wishlist is currently empty.</p>
        </div>
      `;
      return;
    }
    
    let html = '<div class="d-flex flex-column gap-3">';
    wishlistItems.forEach((item, index) => {
      html += `
        <div class="d-flex align-items-center gap-3 p-2 border-bottom">
          <img src="${item.img}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--accent-color);">
          <div class="flex-grow-1">
            <h6 class="mb-0 text-dark" style="font-family: var(--font-headings); font-weight: 600; font-size: 0.9rem;">${item.title}</h6>
            <small class="text-muted">Certified Pure Silver</small>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-danger btn-remove-wishlist" data-index="${index}" title="Remove">
              <i class="bi bi-trash"></i>
            </button>
            <a href="https://wa.me/919440635761?text=Hi%20SaiVedha%20Silver%20Palace%2C%20I%20am%20interested%20in%20inquiring%20about%20the%20${encodeURIComponent(item.title)}." 
               target="_blank" class="btn btn-sm btn-success d-flex align-items-center gap-1" style="font-size: 0.75rem; padding: 4px 8px;">
              <i class="bi bi-whatsapp"></i> Inquire
            </a>
          </div>
        </div>
      `;
    });
    html += '</div>';
    wishlistModalBody.innerHTML = html;
    
    // Add remove listeners
    wishlistModalBody.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'));
        wishlistItems.splice(idx, 1);
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        wishlistCount = wishlistItems.length;
        if (wishlistBadge) {
          wishlistBadge.textContent = wishlistCount;
          if (wishlistCount === 0) {
            wishlistBadge.classList.add('d-none');
          }
        }
        renderWishlist();
      });
    });
  }
  
  const cartModal = document.getElementById('cartModal');
  const cartModalBody = document.getElementById('cartModalBody');
  if (cartModal && cartModalBody) {
    cartModal.addEventListener('show.bs.modal', () => {
      renderCart();
    });
  }
  
  function renderCart() {
    if (cartItems.length === 0) {
      cartModalBody.innerHTML = `
        <div class="text-center py-4">
          <i class="bi bi-bag text-muted mb-3" style="font-size: 2.5rem; display: block;"></i>
          <p class="text-muted mb-0">Your cart is currently empty.</p>
        </div>
      `;
      return;
    }
    
    let html = '<div class="d-flex flex-column gap-3">';
    cartItems.forEach((item, index) => {
      html += `
        <div class="d-flex align-items-center gap-3 p-2 border-bottom">
          <img src="${item.img}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--accent-color);">
          <div class="flex-grow-1">
            <h6 class="mb-0 text-dark" style="font-family: var(--font-headings); font-weight: 600; font-size: 0.9rem;">${item.title}</h6>
            <small class="text-muted">Certified Pure Silver</small>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-danger btn-remove-cart" data-index="${index}" title="Remove">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
    });
    
    // Add cart inquiry actions
    const cartSummaryMsg = cartItems.map(item => `• ${item.title}`).join('%0A');
    html += `
      <div class="pt-3 border-top mt-2">
        <a href="https://wa.me/919440635761?text=Hi%20SaiVedha%20Silver%20Palace%2C%20I%20would%20like%20to%20inquire%20about%20the%20following%20articles%20in%20my%20list%3A%0A${cartSummaryMsg}" 
           target="_blank" class="btn btn-premium btn-premium-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2">
          <i class="bi bi-whatsapp"></i> Inquire Entire Cart
        </a>
      </div>
    `;
    
    html += '</div>';
    cartModalBody.innerHTML = html;
    
    // Add remove listeners
    cartModalBody.querySelectorAll('.btn-remove-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'));
        cartItems.splice(idx, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        cartCount = cartItems.length;
        if (cartBadge) {
          cartBadge.textContent = cartCount;
          if (cartCount === 0) {
            cartBadge.classList.add('d-none');
          }
        }
        renderCart();
      });
    });
  }
}

/* --- Quick View Details Modal System --- */
function initQuickView() {
  const quickViewModal = document.getElementById('quickViewModal');
  if (!quickViewModal) return;
  
  quickViewModal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    
    // Extract info from data-bs-* attributes
    const title = button.getAttribute('data-bs-title');
    const desc = button.getAttribute('data-bs-desc');
    const price = button.getAttribute('data-bs-price');
    const imgUrl = button.getAttribute('data-bs-img');
    const detail = button.getAttribute('data-bs-detail') || 'An exclusive masterpiece showcasing heritage Indian silversmithing with high grade silver certification.';
    
    // Update the modal's content.
    const modalTitles = quickViewModal.querySelectorAll('.modal-title-custom');
    const modalImg = quickViewModal.querySelector('.modal-product-img');
    const modalPrice = quickViewModal.querySelector('.modal-product-price');
    const modalShortDesc = quickViewModal.querySelector('.modal-product-desc');
    const modalDetail = quickViewModal.querySelector('.modal-product-detail');
    const modalCartBtn = quickViewModal.querySelector('.modal-add-cart-btn');
    
    modalTitles.forEach(el => {
      el.textContent = title;
    });
    modalImg.src = imgUrl;
    modalImg.alt = title;
    modalPrice.textContent = price;
    modalShortDesc.textContent = desc;
    modalDetail.textContent = detail;
    modalCartBtn.setAttribute('data-product', title);
  });
}

/* --- Search Icon Overlay Animation & Instant Filtering --- */
function initSearchToggle() {
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBarDropdown');
  const searchInput = document.getElementById('searchInput');
  const searchSubmitBtn = document.getElementById('searchSubmitBtn');
  const searchResultsList = document.getElementById('searchResultsList');
  
  if (!searchBtn || !searchBar || !searchInput || !searchResultsList) return;
  
  searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = searchBar.style.display === 'none' || searchBar.style.display === '';
    if (isHidden) {
      searchBar.style.display = 'block';
      searchBar.classList.add('active');
      searchInput.focus();
    } else {
      searchBar.style.display = 'none';
      searchBar.classList.remove('active');
      searchResultsList.style.display = 'none';
    }
  });
  
  document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target) && e.target !== searchBtn) {
      searchBar.style.display = 'none';
      searchBar.classList.remove('active');
      searchResultsList.style.display = 'none';
    }
  });
  
  // Real-time catalog search filtering and dropdown suggestions
  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Find all product cards in standard grids
    const cards = document.querySelectorAll('.antique-card');
    
    if (query === '') {
      searchResultsList.style.display = 'none';
      searchResultsList.innerHTML = '';
      
      // Restore all grid columns
      cards.forEach(card => {
        const col = card.parentElement;
        if (col) col.classList.remove('d-none');
      });
      return;
    }
    
    let matchesHtml = '';
    let matchCount = 0;
    
    cards.forEach((card, idx) => {
      const col = card.parentElement;
      
      const titleEl = card.querySelector('.antique-title, h3');
      const descEl = card.querySelector('.antique-description, p');
      const imgEl = card.querySelector('.antique-img') || card.querySelector('img');
      
      const titleText = titleEl ? titleEl.textContent.trim() : '';
      const descText = descEl ? descEl.textContent.trim() : '';
      const imgSrc = imgEl ? imgEl.getAttribute('src') : 'assets/images/logo.jpg';
      
      const matches = titleText.toLowerCase().includes(query) || descText.toLowerCase().includes(query);
      
      // Toggle card visibility on parent column
      if (col) {
        if (matches) {
          col.classList.remove('d-none');
        } else {
          col.classList.add('d-none');
        }
      }
      
      // Build dropdown suggestions
      if (matches) {
        matchCount++;
        card.setAttribute('data-search-index', idx);
        matchesHtml += `
          <div class="search-result-item d-flex align-items-center gap-2 p-2" data-target-idx="${idx}" style="cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.08); transition: background 0.2s;">
            <img src="${imgSrc}" style="width: 35px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid var(--accent-color);">
            <div style="flex-grow: 1; min-width: 0;">
              <div style="font-size: 0.8rem; color: #fff; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${titleText}</div>
              <small style="font-size: 0.65rem; color: var(--accent-color);">Certified Silver</small>
            </div>
          </div>
        `;
      }
    });
    
    if (matchCount > 0) {
      searchResultsList.innerHTML = matchesHtml;
      searchResultsList.style.display = 'block';
      
      // Bind click triggers to dropdown list items
      searchResultsList.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const targetIdx = item.getAttribute('data-target-idx');
          const targetCard = document.querySelector(`.antique-card[data-search-index="${targetIdx}"]`);
          if (targetCard) {
            const qvBtn = targetCard.querySelector('.btn-quick-view');
            if (qvBtn) qvBtn.click();
          }
          searchBar.style.display = 'none';
          searchBar.classList.remove('active');
          searchResultsList.style.display = 'none';
        });
      });
    } else {
      searchResultsList.innerHTML = `<div class="text-muted p-2 text-center" style="font-size: 0.75rem;">No silver articles found</div>`;
      searchResultsList.style.display = 'block';
    }
  }
  
  searchInput.addEventListener('input', performSearch);
  
  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      performSearch();
    });
  }
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
      searchBar.style.display = 'none';
      searchBar.classList.remove('active');
      searchResultsList.style.display = 'none';
    }
  });
}

/* --- Luxury Contact Form Submission & Feedback --- */
function initContactForm() {
  const contactForm = document.getElementById('showroomContactForm');
  const toast = document.getElementById('luxuryToast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const subjectSelect = document.getElementById('contactSubject');
    
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      alert('Please fill in all requested fields to contact the showroom.');
      return;
    }
    
    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectSelect ? subjectSelect.value : 'General Showroom Inquiry',
      message: messageInput.value.trim()
    };
    
    fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        contactForm.reset();
        
        // Show premium Success Toast
        if (toast && toastMessage) {
          toastMessage.textContent = 'Thank you! A Royal Representative will contact you shortly.';
          toast.classList.remove('wishlist-toast');
          toast.querySelector('i').className = 'bi bi-envelope-check-fill text-success';
          toast.style.display = 'flex';
          
          setTimeout(() => {
            toast.style.display = 'none';
          }, 4000);
        }
      } else {
        alert('Failed to register inquiry on showroom servers. Please try again.');
      }
    })
    .catch(err => {
      console.error('Error submitting showroom inquiry:', err);
      // Fallback local reset
      contactForm.reset();
    });
  });
}

/* --- Dynamic Price Replacement with Net Weights --- */
function replacePricesWithWeights() {
  const cards = document.querySelectorAll('.antique-card, .product-card');
  
  cards.forEach(card => {
    const qvBtn = card.querySelector('.btn-quick-view');
    const priceEl = card.querySelector('.antique-price');
    if (!qvBtn || !priceEl) return;
    
    const detailText = qvBtn.getAttribute('data-bs-detail') || '';
    const descText = qvBtn.getAttribute('data-bs-desc') || '';
    
    // Check if the price attribute already has weight formatted (e.g. Net Wt: 620g)
    const currentPriceAttr = qvBtn.getAttribute('data-bs-price') || '';
    if (currentPriceAttr.toLowerCase().includes('net wt')) {
      priceEl.textContent = currentPriceAttr;
      return;
    }
    
    // Regular expressions to match weight parameters (e.g. 1.2 kg, 750 grams, 310g, etc.)
    const weightRegexes = [
      /(?:weight\s*of\s*silver|weight|weighs|weighing|approx\s*weight)\s*(?:of\s*silver\s*)?(?:is|are|approximately|approx|around)?\s*(\d+(?:\.\d+)?\s*(?:kg|grams|g|gms|kilograms))/i,
      /(\d+(?:\.\d+)?\s*(?:kg|grams|g|gms|kilograms))\s*(?:weight|in\s*weight)/i
    ];
    
    let matchedWeight = '';
    
    // Try to find a match in detailText
    for (const regex of weightRegexes) {
      const match = detailText.match(regex);
      if (match && match[1]) {
        matchedWeight = match[1].trim();
        break;
      }
    }
    
    // If not found in detail, check description
    if (!matchedWeight) {
      for (const regex of weightRegexes) {
        const match = descText.match(regex);
        if (match && match[1]) {
          matchedWeight = match[1].trim();
          break;
        }
      }
    }
    
    if (matchedWeight) {
      const cleanWeight = matchedWeight.replace(/\s+/g, ' ');
      const label = `Net Wt: ${cleanWeight}`;
      
      // Update DOM and data attributes
      priceEl.textContent = label;
      qvBtn.setAttribute('data-bs-price', label);
      
      const wishlistBtn = card.querySelector('.btn-add-wishlist');
      const cartBtn = card.querySelector('.btn-add-cart');
      if (wishlistBtn) wishlistBtn.setAttribute('data-price', label);
      if (cartBtn) cartBtn.setAttribute('data-price', label);
    } else {
      // Default placeholder if no weight is found
      priceEl.textContent = 'Net Wt: Inquire';
      qvBtn.setAttribute('data-bs-price', 'Net Wt: Inquire');
    }
  });
}

/* --- Live Silver Rate Ticker Logic --- */
async function initLiveSilverRate() {
  const rateEl = document.getElementById('liveSilverRate');
  const trendEl = document.getElementById('liveSilverTrend');
  if (!rateEl || !trendEl) return;
  
  async function fetchAccurateRate() {
    try {
      const res = await fetch('/api/rate');
      const data = await res.json();
      
      rateEl.classList.add('flash-update');
      setTimeout(() => rateEl.classList.remove('flash-update'), 500);
      
      const rateVal = data.mode === 'manual' ? data.customRate : data.rate;
      rateEl.textContent = `₹${rateVal.toFixed(2)} / g`;
      
      if (data.mode === 'manual') {
        trendEl.className = 'text-success ms-1';
        trendEl.innerHTML = `<i class="bi bi-shield-fill-check"></i> Locked`;
      } else {
        const percentage = ((rateVal - 234.50) / 234.50 * 100).toFixed(2);
        if (percentage >= 0) {
          trendEl.className = 'text-success ms-1';
          trendEl.innerHTML = `<i class="bi bi-arrow-up-right"></i> +${percentage}%`;
        } else {
          trendEl.className = 'text-danger ms-1';
          trendEl.innerHTML = `<i class="bi bi-arrow-down-left"></i> ${percentage}%`;
        }
      }
    } catch (error) {
      console.warn('Could not fetch live rate dynamically:', error);
      rateEl.textContent = `₹235.00 / g`;
    }
  }
  
  // Initial fetch on page load
  await fetchAccurateRate();
  
  // Refresh rate every 30 seconds to keep it live and accurate
  setInterval(fetchAccurateRate, 30000);
}

/* --- Customer Authentication & Modal View Toggles --- */
function initCustomerAuth() {
  const loginModal = document.getElementById('loginModal');
  if (!loginModal) return;
  
  const loginForm = document.getElementById('customerLoginForm');
  const registerForm = document.getElementById('customerRegisterForm');
  const switchToSignUp = document.getElementById('switchToSignUp');
  const switchToSignIn = document.getElementById('switchToSignIn');
  
  const loginBtn = document.getElementById('loginBtn');
  
  // Initialize Bootstrap Carousel instance
  const authCarouselEl = document.getElementById('authCarousel');
  const authCarousel = authCarouselEl ? new bootstrap.Carousel(authCarouselEl) : null;
  
  // Toggle between login and register forms
  if (switchToSignUp && switchToSignIn && authCarousel) {
    switchToSignUp.addEventListener('click', (e) => {
      e.preventDefault();
      authCarousel.to(1); // Go to Slide 2 (Sign Up)
      document.getElementById('loginModalLabel').textContent = 'Create Royal Showroom Profile';
    });
    
    switchToSignIn.addEventListener('click', (e) => {
      e.preventDefault();
      authCarousel.to(0); // Go to Slide 1 (Sign In)
      document.getElementById('loginModalLabel').textContent = 'Access Royal Showroom';
    });
  }
  
  // Check customer session state
  const customerSession = JSON.parse(localStorage.getItem('customerSession'));
  if (customerSession) {
    if (loginBtn) {
      loginBtn.title = `Showroom Profile: ${customerSession.name}`;
      loginBtn.innerHTML = `<i class="bi bi-person-check-fill text-warning"></i>`;
      // Ensure it triggers modal opening
      loginBtn.setAttribute('data-bs-toggle', 'modal');
      loginBtn.setAttribute('data-bs-target', '#loginModal');
    }
    
    // Set Profile details in Slide 3
    const pName = document.getElementById('modalProfileName');
    const pEmail = document.getElementById('modalProfileEmail');
    const pPhone = document.getElementById('modalProfilePhone');
    if (pName) pName.textContent = customerSession.name;
    if (pEmail) pEmail.textContent = customerSession.email;
    if (pPhone) pPhone.textContent = customerSession.phone || '94406 35761';
    
    // Auto-slide to Slide 3 when opening modal
    if (loginModal) {
      loginModal.addEventListener('show.bs.modal', () => {
        if (authCarousel) {
          authCarousel.to(2); // Go to Slide 3 (Profile)
          document.getElementById('loginModalLabel').textContent = 'My Showroom Profile';
        }
      });
    }
  } else {
    // If not logged in, auto-slide to Sign In
    if (loginModal) {
      loginModal.addEventListener('show.bs.modal', () => {
        if (authCarousel) {
          authCarousel.to(0); // Go to Slide 1 (Sign In)
          document.getElementById('loginModalLabel').textContent = 'Access Royal Showroom';
        }
      });
    }
  }
  
  // Modal Logout Action
  const modalLogoutBtn = document.getElementById('modalLogoutBtn');
  if (modalLogoutBtn) {
    modalLogoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to sign out of your showroom profile?')) {
        localStorage.removeItem('customerSession');
        window.location.reload();
      }
    });
  }
  
  // Submit Registration Form
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const password = document.getElementById('regPassword').value;
      
      try {
        const res = await fetch('/api/customer/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password })
        });
        const data = await res.json();
        
        if (data.success) {
          alert('Registration successful! You can now log in.');
          registerForm.reset();
          if (authCarousel) {
            authCarousel.to(0); // Go to Slide 1 (Sign In)
            document.getElementById('loginModalLabel').textContent = 'Access Royal Showroom';
          }
        } else {
          alert(data.error || 'Failed to create profile.');
        }
      } catch (err) {
        alert('Server connection failed. Please try again.');
      }
    });
  }
  
  // Submit Login Form
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      
      try {
        const res = await fetch('/api/customer/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          localStorage.setItem('customerSession', JSON.stringify({
            name: data.customer.name,
            email: data.customer.email,
            phone: data.customer.phone || '',
            joined: data.customer.joined || '',
            token: data.token
          }));
          
          alert(`Welcome back to SaiVedha Showroom, ${data.customer.name}!`);
          window.location.reload();
        } else {
          alert(data.error || 'Invalid email or password.');
        }
      } catch (err) {
        alert('Server connection failed. Please try again.');
      }
    });
  }
}
