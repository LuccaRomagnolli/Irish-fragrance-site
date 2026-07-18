/**
 * Amoura Fragrances - Premium Theme Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearchModal();
  initMobileNav();
  initProductForm();
  initCartDrawer();
  initScrollReveal();
  initBackToTop();
  initHeaderScroll();
  initQuickAdd();
});

/* ==========================================================================
   1. Search Modal Controls
   ========================================================================== */
function initSearchModal() {
  const searchToggles = document.querySelectorAll('.js-search-toggle');
  const searchClose = document.querySelector('.js-search-close');
  const searchModal = document.querySelector('.search-modal');
  const searchInput = document.querySelector('#Search-In-Modal');

  if (!searchModal) return;

  searchToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('active');
      searchModal.setAttribute('aria-hidden', 'false');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    });
  });

  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchModal.classList.remove('active');
      searchModal.setAttribute('aria-hidden', 'true');
    });
  }

  // Close on background click
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
      searchModal.setAttribute('aria-hidden', 'true');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
      searchModal.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.querySelector('.js-menu-toggle');
  const mobileNav = document.querySelector('#MobileNav');

  if (!menuToggle || !mobileNav) return;

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('active');
    mobileNav.setAttribute('aria-hidden', isExpanded);
    document.body.classList.toggle('overflow-hidden', !isExpanded);
  });

  // Close drawer when clicking outside it or on the backdrop overlay
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('active');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
    }
  });

  // Prevent closing when clicking inside the navigation drawer
  mobileNav.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

/* ==========================================================================
   3. Product Detail Page Interactions
   ========================================================================== */
function initProductForm() {
  const mainProductSection = document.querySelector('.main-product');
  if (!mainProductSection) return;

  const sectionId = mainProductSection.getAttribute('data-section');
  const mainImage = document.querySelector(`#ProductMainImage-${sectionId}`);
  const thumbBtns = document.querySelectorAll('.js-thumb-btn');
  const swatchBtns = document.querySelectorAll('.js-swatch-btn');
  const qtyBtns = document.querySelectorAll('.js-qty-btn');
  const qtyInput = document.querySelector('.js-qty-input');
  const productForm = document.querySelector('.js-product-form');
  const fallbackSelect = document.querySelector(`#Variants-${sectionId}`);
  const variantIdInput = document.querySelector('#variant-id-input');
  const priceDisplay = document.querySelector('#variant-price');
  const comparePriceDisplay = document.querySelector('#compare-price');
  const atcBtn = document.querySelector('.js-add-to-cart-btn');
  const atcText = atcBtn ? atcBtn.querySelector('.js-btn-text') : null;

  // Gallery thumbnail click
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const newUrl = btn.getAttribute('data-image-url');
      if (mainImage && newUrl) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
          mainImage.src = newUrl;
          mainImage.style.opacity = '1';
        }, 200);
      }
    });
  });

  // Add smooth transition to main image
  if (mainImage) {
    mainImage.style.transition = 'opacity 0.3s ease';
  }

  // Variant swatches select logic
  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const optionName = btn.getAttribute('data-option-name');
      const optionVal = btn.getAttribute('data-value');
      
      // Update swatch active classes in the current option group
      const siblingSwatches = btn.parentElement.querySelectorAll('.js-swatch-btn');
      siblingSwatches.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');

      // Determine currently selected options
      const activeSwatches = Array.from(mainProductSection.querySelectorAll('.js-swatch-btn.active'));
      const selectedOptions = activeSwatches.map(s => s.getAttribute('data-value'));

      // Join options standard separator for variants
      const matchingOptionString = selectedOptions.join(' / ');
      
      // Find matching option in the hidden select dropdown
      if (fallbackSelect) {
        let matchedVariant = null;
        Array.from(fallbackSelect.options).forEach(opt => {
          const optTitle = opt.getAttribute('data-options');
          if (optTitle === matchingOptionString) {
            matchedVariant = opt;
          }
        });

        if (matchedVariant) {
          // Update hidden input ID
          variantIdInput.value = matchedVariant.value;

          // Update Price and Availability
          const price = matchedVariant.getAttribute('data-price');
          const comparePrice = matchedVariant.getAttribute('data-compare-price');
          const available = matchedVariant.getAttribute('data-available') === 'true';

          if (priceDisplay) priceDisplay.textContent = price;
          if (comparePriceDisplay) {
            if (comparePrice && comparePrice !== '') {
              comparePriceDisplay.textContent = comparePrice;
              comparePriceDisplay.classList.remove('hidden');
            } else {
              comparePriceDisplay.classList.add('hidden');
            }
          }

          // Update ATC Button
          if (atcBtn && atcText) {
            if (available) {
              atcBtn.removeAttribute('disabled');
              atcText.textContent = window.theme.strings.addToCart;
            } else {
              atcBtn.setAttribute('disabled', 'disabled');
              atcText.textContent = window.theme.strings.soldOut;
            }
          }
        } else {
          // Variant doesn't exist
          if (atcBtn && atcText) {
            atcBtn.setAttribute('disabled', 'disabled');
            atcText.textContent = window.theme.strings.unavailable;
          }
        }
      }
    });
  });

  // Quantity input controls
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      let currentVal = parseInt(qtyInput.value) || 1;

      if (action === 'plus') {
        qtyInput.value = currentVal + 1;
      } else if (action === 'minus' && currentVal > 1) {
        qtyInput.value = currentVal - 1;
      }
    });
  });

  // AJAX Product Add Submission
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (atcBtn) {
        atcBtn.setAttribute('disabled', 'disabled');
        const spinner = atcBtn.querySelector('.btn-spinner');
        if (spinner) spinner.classList.remove('hidden');
        if (atcText) atcText.textContent = window.theme.strings.addingToCart;
      }

      const formData = new FormData(productForm);

      fetch(window.theme.routes.cartAddUrl + '.js', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
      })
      .then(response => response.json())
      .then(item => {
        // Reset ATC button
        if (atcBtn) {
          atcBtn.removeAttribute('disabled');
          const spinner = atcBtn.querySelector('.btn-spinner');
          if (spinner) spinner.classList.add('hidden');
          if (atcText) atcText.textContent = window.theme.strings.addedToCart;
          setTimeout(() => {
            atcText.textContent = window.theme.strings.addToCart;
          }, 2000);
        }
        
        // Open and refresh cart drawer
        openCartDrawer();
        refreshCartDrawer();
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        if (atcBtn && atcText) {
          atcBtn.removeAttribute('disabled');
          atcText.textContent = 'Error - Try Again';
        }
      });
    });
  }
}

/* ==========================================================================
   4. AJAX Cart Drawer Controls
   ========================================================================== */
function initCartDrawer() {
  const cartToggles = document.querySelectorAll('.js-cart-toggle');
  const drawerCloseBtns = document.querySelectorAll('.js-cart-drawer-close');
  const drawerContainer = document.querySelector('#CartDrawer');

  if (!drawerContainer) return;

  cartToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
      refreshCartDrawer();
    });
  });

  drawerCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeCartDrawer();
    });
  });

  // Listen to delegation actions on drawer quantity adjustments
  drawerContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('js-drawer-qty-btn')) {
      const key = target.getAttribute('data-key');
      const action = target.getAttribute('data-action');
      const input = drawerContainer.querySelector(`.js-drawer-qty-input[data-key="${key}"]`);
      if (input) {
        let currentQty = parseInt(input.value) || 0;
        let newQty = action === 'plus' ? currentQty + 1 : currentQty - 1;
        if (newQty < 0) newQty = 0;
        updateCartItem(key, newQty);
      }
    }
  });

  drawerContainer.addEventListener('change', (e) => {
    const target = e.target;
    if (target.classList.contains('js-drawer-qty-input')) {
      const key = target.getAttribute('data-key');
      const newQty = parseInt(target.value) || 0;
      updateCartItem(key, newQty);
    }
  });

  // Close on overlay click
  const overlay = drawerContainer.querySelector('.cart-drawer-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeCartDrawer);
  }
}

function openCartDrawer() {
  const drawerContainer = document.querySelector('#CartDrawer');
  if (drawerContainer) {
    drawerContainer.classList.add('active');
    drawerContainer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
  }
}

function closeCartDrawer() {
  const drawerContainer = document.querySelector('#CartDrawer');
  if (drawerContainer) {
    drawerContainer.classList.remove('active');
    drawerContainer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
  }
}

// Update line item in cart using Shopify AJAX Cart API
function updateCartItem(lineKey, quantity) {
  fetch(window.theme.routes.cartChangeUrl + '.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      id: lineKey,
      quantity: quantity
    })
  })
  .then(res => res.json())
  .then(cart => {
    refreshCartDrawer();
  })
  .catch(err => console.error('Error updating cart item:', err));
}

// Fetch current cart state and re-render Drawer HTML
function refreshCartDrawer() {
  const itemsWrapper = document.querySelector('.js-cart-drawer-items-wrapper');
  const footerElement = document.querySelector('.cart-drawer__footer');
  const cartIconBubble = document.querySelector('#cart-icon-bubble');

  fetch('/cart.js')
  .then(response => response.json())
  .then(cart => {
    // 1. Update Cart Bubble count
    if (cartIconBubble) {
      const bubbleCount = cartIconBubble.querySelector('#cart-count-number');
      const bubbleWrapper = cartIconBubble.querySelector('.cart-count-bubble');
      
      if (bubbleCount) {
        bubbleCount.textContent = cart.item_count;
      }
      
      if (bubbleWrapper) {
        if (cart.item_count > 0) {
          bubbleWrapper.classList.remove('hidden');
        } else {
          bubbleWrapper.classList.add('hidden');
        }
      }
    }

    // 2. Format Money helper
    const formatMoney = (cents) => {
      let format = window.theme.moneyFormat || '€{{amount}}';
      let value = (cents / 100).toFixed(2);
      return format.replace('{{amount}}', value).replace('{{amount_no_decimals}}', Math.round(cents/100));
    };

    // 3. Render Items HTML
    if (cart.item_count > 0) {
      let itemsHtml = `<div class="cart-drawer__items js-cart-drawer-items" role="list">`;
      
      cart.items.forEach(item => {
        const itemImage = item.image ? item.image : '';
        const variantTitle = item.variant_title ? `<span class="cart-drawer-item__variant text-muted text-small">${item.variant_title}</span>` : '';
        const itemPrice = formatMoney(item.line_price);
        
        itemsHtml += `
          <div class="cart-drawer-item" data-key="${item.key}" role="listitem">
            <div class="cart-drawer-item__image-wrapper">
              ${itemImage !== '' ? `<img src="${itemImage}&width=100" alt="${item.product_title}" class="cart-drawer-item__image">` : `<div class="placeholder-svg cart-drawer-item__image"></div>`}
            </div>

            <div class="cart-drawer-item__info">
              <a href="${item.url}" class="cart-drawer-item__name font-heading-style">${item.product_title}</a>
              ${variantTitle}
              
              <div class="cart-drawer-item__qty-price">
                <div class="quantity-input-wrapper quantity-input-wrapper--small">
                  <button type="button" class="quantity-btn minus js-drawer-qty-btn" data-action="minus" data-key="${item.key}">-</button>
                  <input type="number" 
                         class="quantity-input js-drawer-qty-input" 
                         value="${item.quantity}" 
                         min="0" 
                         data-key="${item.key}"
                         aria-label="Quantity">
                  <button type="button" class="quantity-btn plus js-drawer-qty-btn" data-action="plus" data-key="${item.key}">+</button>
                </div>
                <span class="cart-drawer-item__price">${itemPrice}</span>
              </div>
            </div>
          </div>
        `;
      });
      
      itemsHtml += `</div>`;
      
      if (itemsWrapper) itemsWrapper.innerHTML = itemsHtml;
      
      // Update subtotal
      const subtotalVal = document.querySelector('.js-cart-drawer-subtotal');
      if (subtotalVal) {
        subtotalVal.textContent = formatMoney(cart.total_price);
      }
      
      // Show footer
      if (footerElement) footerElement.classList.remove('hidden');
    } else {
      // Empty cart state
      if (itemsWrapper) {
        itemsWrapper.innerHTML = `
          <div class="cart-drawer__empty text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; margin: 0 auto 1rem; color: var(--color-border);"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke-linecap="round" stroke-linejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10a4 4 0 01-8 0" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <p class="text-muted" style="margin-bottom: 1.5rem;">Your scent cart is empty.</p>
            <a href="/collections/all" class="button button--gold button--full-width js-cart-drawer-close">
              Browse Fragrances
            </a>
          </div>
        `;
        
        // Wire up close event on the new dynamic button
        const browseBtn = itemsWrapper.querySelector('.js-cart-drawer-close');
        if (browseBtn) {
          browseBtn.addEventListener('click', closeCartDrawer);
        }
      }
      
      // Hide footer
      if (footerElement) footerElement.classList.add('hidden');
    }
  })
  .catch(error => console.error('Error refreshing cart drawer:', error));
}

/* ==========================================================================
   5. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('#back-to-top');
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   7. Header Scroll Effect (Glassmorphism on scroll)
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('#site-header');
  if (!header) return;

  let lastScrollY = 0;
  let ticking = false;

  const updateHeader = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   8. Quick Add to Cart (from Product Cards)
   ========================================================================== */
function initQuickAdd() {
  document.addEventListener('click', (e) => {
    const quickAddBtn = e.target.closest('.js-quick-add-btn');
    if (!quickAddBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const variantId = quickAddBtn.getAttribute('data-variant-id');
    if (!variantId) return;

    // Show loading state
    const originalContent = quickAddBtn.innerHTML;
    quickAddBtn.innerHTML = '<span class="btn-spinner" style="margin: 0; border-top-color: #fff;"></span>';
    quickAddBtn.disabled = true;

    fetch(window.theme.routes.cartAddUrl + '.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        id: parseInt(variantId),
        quantity: 1
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Add to cart failed');
      return response.json();
    })
    .then(item => {
      // Show success state
      quickAddBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Added!</span>';
      
      setTimeout(() => {
        quickAddBtn.innerHTML = originalContent;
        quickAddBtn.disabled = false;
      }, 1500);

      // Open and refresh cart drawer
      openCartDrawer();
      refreshCartDrawer();
    })
    .catch(error => {
      console.error('Quick add error:', error);
      quickAddBtn.innerHTML = '<span>Error</span>';
      setTimeout(() => {
        quickAddBtn.innerHTML = originalContent;
        quickAddBtn.disabled = false;
      }, 1500);
    });
  });
}
