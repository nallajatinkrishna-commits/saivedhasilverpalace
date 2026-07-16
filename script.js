window.onerror = function (message, url, line, col, error) {
  alert("CRITICAL SCRIPT ERROR:\n" + message + "\nLine: " + line + ", Col: " + col + "\nStack:\n" + (error ? error.stack : 'No stack'));
  return false;
};

/* 
   SaiVedha - Luxury Silver Showroom
   Interactive Features & Animations
*/

document.addEventListener('DOMContentLoaded', () => {
  alert("SaiVedha script loaded successfully!");
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
            <a href="https://wa.me/919440635761?text=${encodeURIComponent(`Hi SaiVedha Silver Palace, I am interested in inquiring about the ${item.title}. Reference Image: ${item.img.startsWith('http') ? item.img : `${window.location.origin}/${item.img}`}`)}" 
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
    const cartSummaryMsg = cartItems.map(item => {
      const imgUrl = item.img.startsWith('http') ? item.img : `${window.location.origin}/${item.img}`;
      return `• ${item.title} (${imgUrl})`;
    }).join('%0A');
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
  const authCarousel = (authCarouselEl && typeof bootstrap !== 'undefined') ? new bootstrap.Carousel(authCarouselEl) : null;
  
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

  // Dynamic Product Catalog Loader
  async function initDynamicCatalog() {
    alert("initDynamicCatalog: entered!");
    const antiqueGrid = document.getElementById('antique-articles-grid');
    const silverGrid = document.getElementById('silver-articles-grid');
    const mensGrid = document.getElementById('mens-articles-grid');
    const womensGrid = document.getElementById('womens-articles-grid');
    
    alert("initDynamicCatalog: grids found -> antique: " + !!antiqueGrid + ", silver: " + !!silverGrid);
    if (!antiqueGrid && !silverGrid && !mensGrid && !womensGrid) return;
    
    let products = [];
    try {
      if (window.location.protocol === 'file:') {
        throw new Error('Running from file:// protocol, using fallback.');
      }
      const res = await fetch('/api/products');
      products = await res.json();
      if (!products || products.length === 0) {
        throw new Error('Empty product catalog from server.');
      }
      alert("initDynamicCatalog: fetched from server successfully! Count: " + products.length);
    } catch (err) {
      alert("initDynamicCatalog: fallback triggered! Error: " + err.message);
      products = [
        {
          id: "ant-1",
          title: "Pure Silver Bottle & Glass Set",
          category: "antique",
          price: "₹1,45,000",
          images: ["assets/images/silver_bottleset.png"],
          description: "An exquisite royal beverage set featuring a heavy, floral-engraved pure silver bottle accompanied by four matching silver stemmed chalice glasses. Ideal for luxury hosting.",
          detail: "This limited heritage beverage set is created from heavy-gauge certified pure silver. Features intricate hand-engraved floral designs. Includes a 1-litre silver bottle and four matching stemmed chalice glasses. Weighs approximately 1.4 kg, hallmarked, and delivered in a velvet lined presentation chest."
        },
        {
          id: "ant-2",
          title: "Pure Silver Lakshmi Deepams (Pair)",
          category: "antique",
          price: "₹24,500",
          images: ["assets/images/silver_deepams.png"],
          description: "A divine pair of oil lamps featuring detailed engravings of Goddess Lakshmi. Handcrafted to bring prosperity and auspicious glow to your pooja mandir.",
          detail: "Certified pure silver lamps, weighing approximately 280g for the pair. Highly detailed repoussé work of Goddess Lakshmi sitting on a lotus base. Ideal for daily prayers, wedding gifts, and festive occasions."
        },
        {
          id: "ant-3",
          title: "Antique Nakshi Pure Silver Electric Bedside Lamp",
          category: "antique",
          price: "Net Wt: 620g",
          images: ["assets/images/silver_electric_lamp.jpg"],
          description: "A stunning combination of vintage aesthetics and modern utility, featuring detailed Nakshi relief panels of peacocks and creepers, pre-wired for soft lighting.",
          detail: "Crafted in 92.5 Sterling Silver, weighing approximately 620g (silver content only). Features hand-crafted Nakshi artwork panels depicting traditional forest scenes. Wired with high-quality LED fittings, standard socket, and toggle switch. Includes certificate of purity."
        },
        {
          id: "ant-4",
          title: "Antique Nakshi Pure Silver Peacock Standing Lamps (Pair)",
          category: "antique",
          price: "Net Wt: 1450g",
          images: ["assets/images/silver_peacock_diya.jpg"],
          description: "A majestic set of two tall standing lamps, topped with highly detailed peacock finials, standing as a testament to royal temple craftsmanship.",
          detail: "Crafted in premium pure silver, standing 12 inches tall, weighing 1.45 kg for the pair. Features highly intricate hand-carved peacock accents, tiered oil wells, and a solid circular base with floral Nakshi designs."
        },
        {
          id: "ant-5",
          title: "Antique Pure Silver Geometric Cutout Ice Bucket & Tongs Set",
          category: "antique",
          price: "Net Wt: 310g",
          images: ["assets/images/silver_ice_bucket.jpg"],
          description: "A modern luxury item featuring intricate geometric cutouts on a heavy pure silver frame, complete with matching silver ice tongs.",
          detail: "Pure silver construction, weighing 310g. Sleek, contemporary geometric patterns, with a removable glass liner for easy cleaning. The matching silver tongs feature a clean modern design. Certified pure silver with BIS hallmark."
        },
        {
          id: "ant-6",
          title: "Pure Silver Ludo Board Set",
          category: "antique",
          price: "₹2,10,000",
          images: ["assets/images/silver_ludo.png"],
          description: "A luxurious handcrafted Ludo board game featuring a heavy solid silver frame with elaborate floral carvings and colorful playing grids.",
          detail: "Weighing approximately 1.95 kg. The frame features traditional Indian repoussé artwork depicting leaves and flowers. The board itself is decorated with premium high-gloss colors over a pure silver structure. Includes silver coins and dice."
        },
        {
          id: "ant-7",
          title: "Antique Silver Tea Set",
          category: "antique",
          price: "₹2,45,000",
          images: ["assets/images/antique_tea_set.jpg"],
          description: "A royal five-piece antique silver tea service set with hand-chased floral scrollwork and elegant ebony handles.",
          detail: "This luxury heritage tea set is crafted from heavy-gauge certified pure silver. Includes a teapot, sugar bowl, milk jug, and a matching serving tray. Features intricate hand-engraved royal floral patterns. Weighs approximately 2.2 kg, hallmarked, and delivered in a velvet lined presentation chest."
        },
        {
          id: "ant-8",
          title: "Antique Silver Urli Bowl",
          category: "antique",
          price: "₹1,85,000",
          images: ["assets/images/antique_urli.png"],
          description: "A traditional footed urli bowl featuring ornate Nakshi carvings, ideal for floating flowers and candles.",
          detail: "A majestic traditional pure silver urli bowl, hand-carved with detailed peacock patterns along the rim and supported by three elegant lion-head feet. Stand out as an exquisite heritage ornament. Weighs approximately 1.5 kg, hallmarked, and polished to a rich antique patina."
        },
        {
          id: "ant-9",
          title: "Antique Silver Lamp",
          category: "antique",
          price: "₹95,000",
          images: ["assets/images/antique_lamp.jpg"],
          description: "A grand traditional standing silver lamp featuring a detailed peacock finial and ornate tiered oil wells.",
          detail: "Standing 1.5 feet tall, this pure silver lamp represents divinity and fine craftsmanship. Handcrafted by master silversmiths with intricate floral carvings on the base and stem, topped with a majestic five-wick oil container. Weighs approximately 980g, hallmarked."
        },
        {
          id: "ant-10",
          title: "Silver Filigree Box",
          category: "antique",
          price: "₹65,000",
          images: ["assets/images/filigree_box.png"],
          description: "A delicate hand-crafted silver box in fine filigree wire work, perfect for storing precious heirlooms.",
          detail: "Crafted from pure sterling silver (92.5) by master filigree artisans from Karimnagar. Every detail is created using microscopic silver wire scrolls soldered onto a solid silver frame. Features a velvet interior and clasp. Weighs approximately 480g."
        },
        {
          id: "sil-1",
          title: "Handcrafted Nakshi Kalash",
          category: "silver",
          price: "₹28,500",
          images: ["assets/images/silver_kalash.png"],
          description: "A heavy-gauge pure silver Kalash pot featuring detailed hand-engraved Nakshi figures of dancers and traditional floral bands.",
          detail: "Crafted by senior master artisans, this traditional pooja Kalash features elaborate repoussé carvings of dancer motifs and floral borders. Hallmarked pure silver. Weight: 480g."
        },
        {
          id: "sil-2",
          title: "Pure Silver Ram Sita Darbar",
          category: "silver",
          price: "₹45,500",
          images: ["assets/images/silver_ramdarbar.png"],
          description: "Elegantly carved pure silver Sri Ram Darbar set featuring Rama, Sita, Lakshmana, and Hanuman under a divine Prabhavali arch.",
          detail: "This spiritual Ram Darbar idol features detailed carvings of Lord Rama, Goddess Sita, Lakshmana, and Lord Hanuman seated under a divine Prabhavali archway. Hallmarked pure silver. Weight: 550g."
        },
        {
          id: "sil-3",
          title: "Royal Nakshi Dessert Set",
          category: "silver",
          price: "₹1,25,000",
          images: ["assets/images/silver_dinnerset.png"],
          description: "A luxurious 13-piece silver serving set featuring 6 intricately carved octagonal dessert bowls, 6 matching spoons, and a hand-engraved serving tray.",
          detail: "This premium serving set includes 6 octagonal dessert bowls, 6 matching spoons, and a large rectangular serving tray. Features heavy floral Nakshi borders and high-polish finish. Hallmarked pure silver. Weight: 1.8 kg."
        },
        {
          id: "sil-4",
          title: "Antique Silver Long Kundulu",
          category: "silver",
          price: "₹68,000",
          images: ["assets/images/silver_kundulu.png"],
          description: "A majestic pair of traditional tall Samai temple lamps featuring detailed floral carvings on the stem and royal peacock crown finials.",
          detail: "Standing 1.5 feet tall, this pair of traditional Samai temple lamps features detailed floral carvings on the pedestal stem and a royal peacock finial. Hallmarked pure silver. Weight: 1.1 kg the pair."
        },
        {
          id: "sil-5",
          title: "Pure Silver Ram Mandir Replica",
          category: "silver",
          price: "₹2,50,000",
          images: ["assets/images/silver_rammandir.png"],
          description: "A detailed architectural model of the historic Ram Mandir temple, handcrafted in certified pure silver on an engraved pedestal with elephant legs.",
          detail: "This magnificent heritage replica is handcrafted from premium certified pure silver. Every dome, pillar, carving, and flag of the historic Ram Mandir temple is meticulously detailed. Seated on a heavy, hand-engraved silver pedestal base with royal elephant support legs. An auspicious masterpiece for prestigious home showrooms and pooja rooms. Weight: 2.1 kg."
        },
        {
          id: "sil-6",
          title: "Pure Silver Gomukhi Abhisheka Set",
          category: "silver",
          price: "₹95,000",
          images: ["assets/images/silver_gomukhi_slide1.jpg", "assets/images/silver_gomukhi_slide2.jpg"],
          description: "A traditional pure silver Abhishekam set featuring a Gomukhi lota (spouted pot) on a pedestal inside a footed Nakshi urli bowl.",
          detail: "This sacred Abhishekam set features a spouted Gomukhi lota pot placed on a central pillar pedestal, seated inside a matching three-footed Urli bowl. Every surface is hand-embossed with intricate floral patterns. Perfect for pouring holy water/milk over deities in daily pooja or festive rituals, where the water flows continuously from the spout. Hallmarked pure silver. Weight: 950g."
        },
        {
          id: "sil-7",
          title: "Pure Silver Nakshi Serving Box",
          category: "silver",
          price: "₹58,000",
          images: ["assets/images/silver_box_slide1.jpg", "assets/images/silver_box_slide2.jpg"],
          description: "A royal serving and dry fruit box handcrafted in pure silver with fine Nakshi carvings, a scalloped rim, and matching lid.",
          detail: "This premium serving set features a rectangular serving box with four inner compartments. Intricate hand-carvings of peacocks and creepers, with a lid that has a peacock-shaped pull knob. Hallmarked pure silver. Weight: 680g."
        },
        {
          id: "men-1",
          title: "Chased Royal Silver Kada",
          category: "mens",
          price: "₹14,500",
          images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop"],
          description: "Thick solid pure silver kada bracelet with hand-engraved line texture. Weighs over 80g.",
          detail: "A classic heavy solid kada for men, crafted in certified pure silver with hand-chased concentric lines and rounded terminals. Comfortable design for regular wear. Hallmarked pure silver."
        },
        {
          id: "men-2",
          title: "Interlocked Silver Chain",
          category: "mens",
          price: "₹18,900",
          images: ["assets/images/plain_silver_chain.png"],
          description: "Classic link-interlocking curb style silver chain with heavy lobster claw clasp.",
          detail: "Traditional heavy curb chain in sterling silver. Smooth flat links with diamond-cut bevels for maximum brilliance and high strength. BIS certified 92.5 hallmark."
        },
        {
          id: "men-3",
          title: "Classic Signet Silver Ring",
          category: "mens",
          price: "₹4,200",
          images: ["assets/images/plain_silver_ring.png"],
          description: "Engraved signet-style silver ring with textured border details. Sleek and manly.",
          detail: "Polished rectangular flat signet face with oxidised scrollwork on the shoulders. Smooth comfort fit inner shank. Certified sterling silver."
        },
        {
          id: "men-4",
          title: "Heavy Curb Silver Bracelet",
          category: "mens",
          price: "₹11,500",
          images: ["assets/images/silver_bracelet.png"],
          description: "Thick solid sterling silver curb-link bracelet, highly polished with secure clasp. Strong design.",
          detail: "A classic link statement bracelet for men. Made from solid sterling silver with custom heavy box-locking mechanism and safety latch. Hallmarked."
        },
        {
          id: "wom-1",
          title: "Royal Ghungroo Ankle Strap",
          category: "womens",
          price: "₹12,500",
          images: ["assets/images/silver_ankle_strap_1.png"],
          description: "Heavy bridal silver ankle straps with sweet chiming ghungroos and traditional clasps. 100% pure silver, no gold coating.",
          detail: "Weighs approximately 180 grams. Made of pure 92.5 hallmarked sterling silver, features custom locking clasp and sturdy silver rings connection. 100% plain silver with no gold coating."
        },
        {
          id: "wom-2",
          title: "Heritage Carved Ankle Strap",
          category: "womens",
          price: "₹7,800",
          images: ["assets/images/silver_ankle_strap_2.png"],
          description: "A sleek, semi-oxidized silver ankle strap with detailed heritage motifs. Combines retro charm with premium design. Plain silver only.",
          detail: "A lighter, contemporary piece weighing 95 grams. Crafted with high quality plain silver and delicate carvings that match both ethnic and fusion wear. Absolutely no gold coating."
        },
        {
          id: "wom-3",
          title: "Traditional Silver Bichiya Pair",
          category: "womens",
          price: "₹2,400",
          images: ["assets/images/plain_silver_ring.png"],
          description: "Adjustable dual-ring toe ring (bichiya) set featuring floral motifs and a bright silver finish. An essential bride ornament.",
          detail: "Premium 99% pure silver toe rings designed for regular wear. Hand-engraved using timeless die patterns, nickel-free and skin friendly."
        },
        {
          id: "wom-4",
          title: "Royal Nakshi Gilt Purse",
          category: "womens",
          price: "₹1,85,000",
          images: ["assets/images/silver_purse_slide1.png", "assets/images/silver_purse_slide2.jpg"],
          description: "An ornate pure silver bridal clutch, hand-gilded in 24K gold with intricate Nakshi carvings and premium settings.",
          detail: "This heirloom-grade bridal bag is crafted from pure silver, heavily gilded in 24K gold. Features elaborate hand-chased Nakshi artwork showing mythological figures, framed with rubies and emeralds, and a matching gold-gilded handle. Weight: 740g."
        },
        {
          id: "wom-5",
          title: "Premium Floral Nakshi Round Silver Purse",
          category: "womens",
          price: "₹1,15,000",
          images: ["assets/images/silver_round_purse.jpg"],
          description: "A luxurious round bridal clutch handcrafted in pure silver with fine floral Nakshi carvings and a sleek gold-tone ring handle.",
          detail: "This modern round bridal purse is handcrafted from premium certified pure silver. It features detailed hand-carved floral Nakshi engravings on both sides, a checkered pattern running down the middle with a central rose motif, and a polished gold-tone circular ring handle. Perfect for weddings and festive occasions. Hallmarked pure silver. Weight: 520g."
        },
        {
          id: "wom-6",
          title: "Antique Nakshi Silver Bridal Clutch with Gemstones",
          category: "womens",
          price: "₹1,45,000",
          images: ["assets/images/silver_gemstone_clutch.jpg"],
          description: "A luxurious oval bridal clutch handcrafted in antique pure silver with leaf Nakshi engravings, top crystal clasp, and red gemstones.",
          detail: "This magnificent oval bridal clutch is handcrafted from premium certified pure silver with an antique oxidized finish. It features detailed leaf and floral Nakshi carvings fanning out across both sides, contrasted against a textured dotted background. Complete with a polished gold-tone arched handle, a top gold-tone clasp set with a brilliant crystal, and two small red drop-shaped gemstones set in silver frames on both sides of the leaf patterns. Perfect for weddings and festive styling. Hallmarked pure silver. Weight: 680g."
        }
      ];
    }
      
      const renderGrid = (gridEl, items) => {
        gridEl.innerHTML = items.map(p => {
          const mainImg = p.images && p.images.length > 0 ? p.images[0] : '';
          
          let carouselHtml = '';
          if (p.images && p.images.length > 1) {
            const carouselId = `carousel-${p.id}`;
            carouselHtml = `
              <div id="${carouselId}" class="carousel slide position-absolute top-0 start-0 w-100 h-100" data-bs-ride="false">
                <div class="carousel-inner h-100">
                  ${p.images.map((img, i) => `
                    <div class="carousel-item ${i === 0 ? 'active' : ''} h-100">
                      <img src="${img}" alt="${p.title}" class="d-block w-100 antique-img">
                    </div>
                  `).join('')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" style="width: 32px; height: 32px; background: rgba(255,255,255,0.85); border-radius: 50%; top: 50%; transform: translateY(-50%); left: 8px; border: none; padding: 0; display: flex; align-items: center; justify-content: center; z-index: 10;">
                  <span class="carousel-control-prev-icon" aria-hidden="true" style="filter: invert(1); width: 14px; height: 14px;"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" style="width: 32px; height: 32px; background: rgba(255,255,255,0.85); border-radius: 50%; top: 50%; transform: translateY(-50%); right: 8px; border: none; padding: 0; display: flex; align-items: center; justify-content: center; z-index: 10;">
                  <span class="carousel-control-next-icon" aria-hidden="true" style="filter: invert(1); width: 14px; height: 14px;"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            `;
          } else {
            carouselHtml = `<img src="${mainImg}" alt="${p.title}" class="antique-img">`;
          }
          
          const isWide = (p.id === 'ant-9' || p.id === 'ant-10' || p.title === "Antique Silver Lamp" || p.title === "Silver Filigree Box");
          const colClass = isWide ? 'col-lg-6 col-md-12' : 'col-lg-4 col-md-6';
          
          if (isWide) {
            return `
              <div class="${colClass}">
                <div class="antique-card">
                  <div class="row g-0 h-100">
                    <div class="col-sm-6 position-relative" style="min-height: 250px;">
                      <div class="antique-img-container h-100 p-0">
                        ${carouselHtml}
                      </div>
                      <span class="heritage-badge">Heritage Collection</span>
                    </div>
                    <div class="col-sm-6">
                      <div class="antique-card-body d-flex flex-column h-100 justify-content-between">
                        <div>
                          <h3 class="antique-title">${p.title}</h3>
                          <p class="antique-description text-muted">${p.description}</p>
                        </div>
                        <div class="antique-price-row mt-3">
                          <span class="antique-price">${p.price}</span>
                          <div class="antique-actions">
                            <button class="btn-action-round btn-add-wishlist" data-product="${p.title}" title="Add to Wishlist"><i class="bi bi-heart"></i></button>
                            <button class="btn-action-round btn-add-cart" data-product="${p.title}" title="Add to Cart"><i class="bi bi-bag"></i></button>
                            <button class="btn-action-text btn-quick-view ms-2" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#quickViewModal"
                                    data-bs-title="${p.title}"
                                    data-bs-price="${p.price}"
                                    data-bs-img="${mainImg}"
                                    data-bs-desc="${p.description}"
                                    data-bs-detail="${p.detail}">
                              Quick View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          } else {
            return `
              <div class="${colClass}">
                <div class="antique-card">
                  <div class="position-relative" style="${p.images.length > 1 ? 'min-height: 250px;' : ''}">
                    <div class="antique-img-container ${p.images.length > 1 ? 'h-100 p-0' : ''}">
                      ${carouselHtml}
                    </div>
                    <span class="heritage-badge">${p.category === 'antique' ? 'Heritage Collection' : 'Daily Elegance'}</span>
                  </div>
                  <div class="antique-card-body">
                    <h3 class="antique-title">${p.title}</h3>
                    <p class="antique-description text-muted">${p.description}</p>
                    <div class="antique-price-row">
                      <span class="antique-price">${p.price}</span>
                      <div class="antique-actions">
                        <button class="btn-action-round btn-add-wishlist" data-product="${p.title}" title="Add to Wishlist"><i class="bi bi-heart"></i></button>
                        <button class="btn-action-round btn-add-cart" data-product="${p.title}" title="Add to Cart"><i class="bi bi-bag"></i></button>
                        <button class="btn-action-text btn-quick-view ms-1" 
                                data-bs-toggle="modal" 
                                data-bs-target="#quickViewModal"
                                data-bs-title="${p.title}"
                                data-bs-price="${p.price}"
                                data-bs-img="${mainImg}"
                                data-bs-desc="${p.description}"
                                data-bs-detail="${p.detail}">
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }
        }).join('');
      };
      
      if (antiqueGrid) {
        renderGrid(antiqueGrid, products.filter(p => p.category === 'antique'));
      }
      if (silverGrid) {
        renderGrid(silverGrid, products.filter(p => p.category === 'silver'));
      }
      if (mensGrid) {
        renderGrid(mensGrid, products.filter(p => p.category === 'mens'));
      }
      if (womensGrid) {
        renderGrid(womensGrid, products.filter(p => p.category === 'womens'));
      }
      
      alert("initDynamicCatalog: rendering complete! Items count: " + products.length);
  }

  initDynamicCatalog();
}
