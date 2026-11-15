/* NOTIQ storefront — vanilla JS, no build step.
   Edit the CONFIG and PRODUCTS blocks to change prices, copy and images. */
(function () {
  'use strict';

  /* ---------------- CONFIG ---------------- */
  var CONFIG = {
    currency: '₹',
    freeShippingAt: 0,              // 0 = free shipping on every order
    whatsapp: '91XXXXXXXXXX',       // your WhatsApp number, country code first, no +
    checkoutUrl: ''                 // e.g. your Shopify checkout link; empty = WhatsApp order
  };

  /* ---------------- PRODUCTS ----------------
     price: selling price (number). mrp: set a number to show a strike-through + SAVE %, or null.
     DEMO prices are marked — replace before launch. */
  var IMG = 'images/';
  var PRODUCTS = [
    {
      id: 'scarlet-oud', name: 'Scarlet Oud', size: '75 ml', type: 'Extrait de Parfum', who: 'Unisex',
      price: 1699, mrp: null, tag: 'Bestseller', group: ['oud', 'new'],
      lead: 'Dark oud wrapped in velvet rose. Bold by nature, bottled at 30%.',
      images: ['scarlet-studio.jpg', 'scarlet-marble.jpg', 'scarlet-dark.jpg', 'scarlet-hand.jpg', 'scarlet-vanity.jpg'],
      hover: 'scarlet-oud-smoke.jpg',
      notes: [['Oud', 'note-oud.jpg'], ['Rose', 'note-rose.jpg'], ['Woody', 'note-woody.jpg']],
      pyramid: [['Top', '[Top notes]', 'note-citrus.jpg'], ['Heart', 'Rose · [heart notes]', 'note-rose.jpg'], ['Base', 'Oud · [base notes]', 'note-oud.jpg']],
      smells: 'Velvet rose petals melting into dark, smoky oud. Warm, rich and made to be noticed.',
      smellsImg: 'scarlet-oud-smoke.jpg', bigName: 'ROSE<br>MEETS OUD',
      occasions: '[Evening · Party · Wedding · Date night]'
    },
    {
      id: 'citruz-breez', name: 'Citruz Breez', size: '75 ml', type: 'Extrait de Parfum', who: 'For him',
      price: 1699, mrp: null, tag: 'New', group: ['fresh', 'new'],
      lead: 'A bright burst of citrus over a clean, fresh trail. Made for the bright hours.',
      images: ['citruz-studio.jpg', 'citruz-sunlit.jpg', 'model-him.jpg', 'duo-studio.jpg'],
      hover: 'citruz-sunlit.jpg',
      notes: [['Citrus', 'note-citrus.jpg'], ['Fresh', 'note-fresh.jpg'], ['Woody', 'note-woody.jpg']],
      pyramid: [['Top', 'Citrus · [top notes]', 'note-citrus.jpg'], ['Heart', '[Heart notes]', 'note-fresh.jpg'], ['Base', '[Base notes]', 'note-woody.jpg']],
      smells: 'Sun on fresh-cut lemons and bergamot, cooled by a clean aquatic breeze.',
      smellsImg: 'citruz-sunlit.jpg', bigName: 'SUN<br>MEETS CITRUS',
      occasions: '[Day · Office · Gym · Vacation]'
    },
    {
      id: 'notiq-duo', name: 'The Notiq Duo', size: '2 × 75 ml', type: 'Extrait de Parfum set', who: 'Unisex',
      price: 2999 /* DEMO — set your Duo price */, mrp: 3398, tag: 'Save more', group: ['sets'],
      lead: 'Citruz Breez for the bright hours, Scarlet Oud for after dark. Both, boxed together.',
      images: ['duo-studio.jpg', 'duo-stone.jpg', 'hero-duo.jpg'],
      hover: 'duo-stone.jpg',
      notes: [['Oud', 'note-oud.jpg'], ['Rose', 'note-rose.jpg'], ['Citrus', 'note-citrus.jpg'], ['Fresh', 'note-fresh.jpg']],
      pyramid: [['Day', 'Citruz Breez', 'note-citrus.jpg'], ['Night', 'Scarlet Oud', 'note-oud.jpg'], ['Both', 'Extrait · 30% oil', 'note-rose.jpg']],
      smells: 'Two moods, one signature: bright citrus by day, velvet oud by night.',
      smellsImg: 'duo-stone.jpg', bigName: 'DAY<br>MEETS NIGHT',
      occasions: '[Gifting · Everyday · Travel]'
    },
    {
      id: 'gift-box', name: 'The Gift Box', size: '2 × 75 ml', type: 'Gift set', who: 'Unisex',
      price: 3299 /* DEMO — set your Gift Box price */, mrp: null, tag: 'Gift ready', group: ['sets'],
      lead: 'Both fragrances in the signature black box with a red ribbon. Ready to give.',
      images: ['gift-box.jpg', 'duo-studio.jpg', 'duo-stone.jpg'],
      hover: 'duo-stone.jpg',
      notes: [['Oud', 'note-oud.jpg'], ['Citrus', 'note-citrus.jpg']],
      pyramid: [['Inside', 'Scarlet Oud 75 ml', 'note-oud.jpg'], ['Inside', 'Citruz Breez 75 ml', 'note-citrus.jpg'], ['Plus', 'Signature box & ribbon', 'note-rose.jpg']],
      smells: 'The easiest gift to get right: one dark, one bright, both unforgettable.',
      smellsImg: 'gift-box.jpg', bigName: 'READY<br>TO GIVE',
      occasions: '[Birthdays · Weddings · Eid · Diwali]'
    },
    {
      id: 'body-mist', name: 'Notiq Body Mist', size: '[size]', type: 'Body mist', who: 'Unisex',
      price: null, mrp: null, tag: 'Coming soon', group: ['soon'], soon: true,
      lead: 'A lighter, everyday Notiq. Launching soon.',
      images: ['body-mist.jpg'], hover: 'body-mist.jpg', notes: [], pyramid: [], smells: '', smellsImg: 'body-mist.jpg', bigName: 'COMING<br>SOON', occasions: ''
    }
  ];
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  /* ---------------- helpers ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return CONFIG.currency + Number(n).toLocaleString('en-IN'); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  var arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  var plus = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var bell = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20h4"/></svg>';
  var heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/></svg>';
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  /* ---------------- toast ---------------- */
  var toastT;
  function toast(html) {
    var t = $('#toast'); t.innerHTML = html; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 2800);
  }

  /* ---------------- cart ---------------- */
  var cart = store('notiq_cart') || [];
  var wish = store('notiq_wish') || [];
  function saveCart() { store('notiq_cart', cart); renderCart(); }
  function addToCart(id, qty) {
    var p = byId[id]; if (!p || p.soon) return;
    var line = cart.find(function (l) { return l.id === id; });
    if (line) line.qty = Math.min(10, line.qty + (qty || 1)); else cart.push({ id: id, qty: qty || 1 });
    saveCart();
    toast('Added ' + esc(p.name) + ' · <a href="#" data-open-cart>View bag</a>');
  }
  function setQty(id, q) {
    cart = cart.map(function (l) { return l.id === id ? { id: id, qty: q } : l; }).filter(function (l) { return l.qty > 0; });
    saveCart();
  }
  function cartTotal() { return cart.reduce(function (s, l) { return s + byId[l.id].price * l.qty; }, 0); }
  function cartCount() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function renderCart() {
    var n = cartCount();
    var b = $('#cartCount'); b.textContent = n; if (n) b.removeAttribute('data-zero'); else b.setAttribute('data-zero', '');
    $('#cartCountLabel').textContent = n ? '(' + n + ')' : '';
    var meter = $('#shipMeter');
    if (CONFIG.freeShippingAt > 0) {
      var left = Math.max(0, CONFIG.freeShippingAt - cartTotal()); var pct = Math.min(100, cartTotal() / CONFIG.freeShippingAt * 100);
      meter.innerHTML = (left ? 'You are ' + money(left) + ' away from free shipping' : 'You have unlocked free shipping') + '<div class="bar"><i style="width:' + pct + '%"></i></div>';
    } else meter.textContent = 'Free shipping on every order';
    if (!cart.length) {
      $('#cartItems').innerHTML = '<div class="cart__empty"><p>Your bag is empty.</p><a class="btn btn--dark" href="#/shop" data-close-cart>Shop fragrances <span class="dot">' + arrow + '</span></a></div>';
      $('#cartFoot').innerHTML = ''; return;
    }
    $('#cartItems').innerHTML = cart.map(function (l) {
      var p = byId[l.id];
      return '<div class="citem"><a href="#/product/' + p.id + '" data-close-cart><img src="' + IMG + p.images[0] + '" alt="' + esc(p.name) + '"></a>' +
        '<div class="citem__info"><a class="citem__name" href="#/product/' + p.id + '" data-close-cart>' + esc(p.name) + '</a><span class="citem__meta">' + esc(p.type) + ' · ' + esc(p.size) + '</span>' +
        '<div class="citem__row"><div class="qty" role="group" aria-label="Quantity for ' + esc(p.name) + '"><button data-q="' + p.id + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="' + p.id + '" data-d="1" aria-label="Increase">+</button></div>' +
        '<strong>' + money(p.price * l.qty) + '</strong></div><button class="citem__rm" data-rm="' + p.id + '">Remove</button></div></div>';
    }).join('');
    $('#cartFoot').innerHTML = '<div class="cart__sum"><span>Subtotal</span><span>' + money(cartTotal()) + '</span></div>' +
      '<p class="cart__fine">Taxes included. Shipping free. Discount codes at checkout.</p>' +
      (CONFIG.checkoutUrl ? '<a class="btn btn--dark btn--block" href="' + CONFIG.checkoutUrl + '">Checkout · ' + money(cartTotal()) + ' <span class="dot">' + arrow + '</span></a>'
        : '<a class="btn btn--dark btn--block" target="_blank" rel="noopener" href="' + waLink() + '">Checkout · ' + money(cartTotal()) + ' <span class="dot">' + arrow + '</span></a>') +
      '<a class="btn btn--ghost btn--block" target="_blank" rel="noopener" href="' + waLink() + '">Order on WhatsApp</a>';
  }
  function waLink() {
    var lines = cart.map(function (l) { var p = byId[l.id]; return '• ' + p.name + ' (' + p.size + ') × ' + l.qty + ' = ' + money(p.price * l.qty); });
    var msg = 'Hi NOTIQ! I would like to order:\n' + lines.join('\n') + '\nTotal: ' + money(cartTotal());
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  /* ---------------- drawers ---------------- */
  var lastFocus;
  function openLayer(el) {
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var f = el.querySelector('input, button, a'); if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeLayer(el) {
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    if (!$('.drawer.is-open, .search.is-open')) document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function closeAll() { $$('.drawer.is-open, .search.is-open').forEach(closeLayer); }

  /* ---------------- card ---------------- */
  function card(p) {
    var price = p.soon ? 'Notify me' : money(p.price) + (p.mrp ? ' <s>' + money(p.mrp) + '</s>' : '');
    var wished = wish.indexOf(p.id) > -1;
    return '<article class="card rv">' +
      '<a href="#/product/' + p.id + '" aria-label="' + esc(p.name) + '"><img src="' + IMG + p.images[0] + '" alt="' + esc(p.name) + ' ' + esc(p.size) + '" loading="lazy">' +
      (p.hover ? '<img class="img2" src="' + IMG + p.hover + '" alt="" loading="lazy">' : '') + '</a>' +
      '<span class="card__tag"><b></b>' + esc(p.tag).toUpperCase() + '</span>' +
      '<button class="card__wish" data-wish="' + p.id + '" aria-pressed="' + wished + '" aria-label="Save ' + esc(p.name) + ' to wishlist">' + heart + '</button>' +
      '<div class="card__bar"><div class="card__info"><h3 class="card__name">' + esc(p.name) + '</h3><span class="card__price">' + price + '</span></div>' +
      (p.soon ? '<button class="card__add card__add--soon" data-notify="' + p.id + '" aria-label="Notify me when ' + esc(p.name) + ' launches">' + bell + '</button>'
              : '<button class="card__add" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to bag">' + plus + '</button>') +
      '</div></article>';
  }

  /* ---------------- pages ---------------- */
  var COLS = [
    { label: 'The Oud Edit', kicker: 'Dark · Smoky', img: 'scarlet-oud-smoke.jpg', f: 'oud' },
    { label: 'The Fresh Edit', kicker: 'Bright · Citrus', img: 'citruz-sunlit.jpg', f: 'fresh' },
    { label: 'Gift Sets', kicker: 'Boxed · Ready', img: 'gift-box.jpg', f: 'sets' },
    { label: 'Coming Soon', kicker: 'Body mist', img: 'body-mist.jpg', f: 'soon' }
  ];

  function pageHome() {
    return '' +
    '<section class="hero"><div class="hero__box">' +
      '<img src="' + IMG + 'hero-duo.jpg" alt="Scarlet Oud and Citruz Breez on travertine stands in warm window light" fetchpriority="high">' +
      '<div class="hero__in">' +
        '<div class="hero__content">' +
          '<span class="eyebrow">Extrait de Parfum · Collection N°01</span>' +
          '<h1 class="hero__title">Limited<br><em>Edition</em> Extrait</h1>' +
          '<p class="hero__copy">Scarlet Oud and Citruz Breez. Hand-blended at 30% oil, slow-matured, chilled and filtered.</p>' +
          '<div class="hero__ctas"><a class="btn btn--dark" href="#/shop">Shop collection <span class="dot">' + arrow + '</span></a><a class="hero__link" href="#/about">Our process</a></div>' +
        '</div>' +
        '<div class="hero__meta"><a href="#/product/scarlet-oud"><b>N°01</b><span>Scarlet Oud</span><small>Oud · Rose</small></a><a href="#/product/citruz-breez"><b>N°02</b><span>Citruz Breez</span><small>Citrus · Fresh</small></a></div>' +
      '</div>' +
    '</div></section>' +

    '<section class="sec rv" aria-labelledby="h-cols"><div class="sec__head"><div class="sec__title"><span class="eyebrow">01 — Collections</span><h2 class="h-sec" id="h-cols">Crafted for the <em>modern senses</em></h2></div>' +
      '<p class="sec__note">Four edits, one signature. Dark and smoky, bright and fresh, made to gift, and what is next.</p></div>' +
      '<div class="cols" id="cols">' + COLS.map(function (c, i) {
        return '<a class="col' + (i === 0 ? ' is-on' : '') + '" data-col="' + i + '" href="#/shop?f=' + c.f + '"><img src="' + IMG + c.img + '" alt="' + c.label + '" loading="lazy"><span class="col__label"><small>' + c.kicker + '</small><span>' + c.label + '</span></span></a>';
      }).join('') + '</div>' +
      '<div class="col-tabs">' + COLS.map(function (c, i) {
        return '<button class="col-tab' + (i === 0 ? ' is-on' : '') + '" data-coltab="' + i + '"><span>' + c.label + '</span><span class="dot">' + arrow + '</span></button>';
      }).join('') + '</div></section>' +

    '<section class="sec rv"><div class="feature"><div class="feature__txt">' +
      '<span class="eyebrow">The signature · N°01</span><h2 class="feature__big">SCARLET<br>OUD</h2>' +
      '<svg class="swoosh" viewBox="0 0 360 60" aria-hidden="true"><path d="M4 44C70 30 150 16 220 22c40 4 70 14 132 2"/></svg>' +
      '<p class="feature__sub">Your scent. Your rhythm. Your every night.</p>' +
      '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:8px"><a class="btn btn--dark" href="#/product/scarlet-oud">Shop now — ' + money(byId['scarlet-oud'].price) + ' <span class="dot">' + arrow + '</span></a><span style="font-size:13px;color:#555">75 ml · Extrait de Parfum</span></div>' +
    '</div><div class="feature__img"><img src="' + IMG + 'scarlet-dark.jpg" alt="Scarlet Oud on dark marble with smoke" loading="lazy"></div></div></section>' +

    '<section class="sec" aria-labelledby="h-new"><div class="sec__head rv"><div class="sec__title"><span class="eyebrow">02 — The bestsellers</span><h2 class="h-sec" id="h-new">New and <em>popular</em></h2></div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap" role="tablist">' +
        [['all', 'All'], ['oud', 'Oud'], ['fresh', 'Fresh'], ['sets', 'Sets'], ['soon', 'Coming soon']].map(function (f, i) {
          return '<button class="pill' + (i === 0 ? ' is-on' : '') + '" role="tab" aria-selected="' + (i === 0) + '" data-hfilter="' + f[0] + '">' + f[1] + '</button>';
        }).join('') + '<a class="pill pill--outline" href="#/shop">View all ↗</a></div></div>' +
      '<div class="grid" id="homeGrid">' + PRODUCTS.map(card).join('') + '</div></section>' +

    '<section class="sec rv" aria-labelledby="h-rit"><div class="sec__head"><div class="sec__title"><span class="eyebrow">03 — Sets &amp; bundles</span><h2 class="h-sec" id="h-rit">Build your <em>ritual</em></h2></div><p class="sec__note">Day and night, boxed together. Pick your pair and save on the set.</p></div>' +
      '<div class="tiles">' +
        '<a class="tile" href="#/product/citruz-breez"><img src="' + IMG + 'citruz-studio.jpg" alt="Citruz Breez" loading="lazy"><span class="tile__cap"><strong>Citruz Breez</strong><span>For the bright hours</span></span></a>' +
        '<a class="tile" href="#/product/notiq-duo"><img src="' + IMG + 'duo-stone.jpg" alt="The Notiq Duo" loading="lazy"><span class="tile__cap"><strong>The Notiq Duo</strong><span>2 × 75 ml · ' + money(byId['notiq-duo'].price) + '</span></span><span class="btn btn--red">Build bundle <span class="dot">' + arrow + '</span></span></a>' +
        '<a class="tile" href="#/product/gift-box"><img src="' + IMG + 'gift-box.jpg" alt="The Gift Box" loading="lazy"><span class="tile__cap"><strong>The Gift Box</strong><span>Ready to give · ' + money(byId['gift-box'].price) + '</span></span></a>' +
      '</div></section>' +

    '<section class="sec rv" aria-labelledby="h-gen"><div class="sec__head"><div class="sec__title"><span class="eyebrow">04 — For everyone</span><h2 class="h-sec" id="h-gen">Shop by <em>gender</em></h2></div></div><div class="tiles">' +
      [['For Him', 'model-him.jpg', 'citruz-breez'], ['For Her', 'model-her.jpg', 'scarlet-oud'], ['Unisex', 'duo-studio.jpg', 'notiq-duo']].map(function (g) {
        return '<a class="tile tile--short" href="#/product/' + g[2] + '"><img src="' + IMG + g[1] + '" alt="Fragrances ' + g[0].toLowerCase() + '" loading="lazy"><span class="tile__pill">' + g[0] + '<span class="dot">' + arrow + '</span></span></a>';
      }).join('') + '</div></section>' +

    '<section class="sec rv" aria-labelledby="h-reel"><div class="sec__head"><div class="sec__title"><span class="eyebrow">05 — On Instagram</span><h2 class="h-sec" id="h-reel">See what the <em>hype</em> is about</h2></div><span class="sec__note">@notiq [handle]</span></div><div class="reels">' +
      ['scarlet-hand.jpg', 'scarlet-vanity.jpg', 'scarlet-dark.jpg', 'citruz-sunlit.jpg', 'model-her.jpg'].map(function (r) {
        return '<div class="reel"><img src="' + IMG + r + '" alt="Reel cover" loading="lazy"><button aria-label="Play reel" data-reel><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg></button></div>';
      }).join('') + '</div></section>' +

    '<section class="sec rv" aria-labelledby="h-notes"><div class="sec__head"><div class="sec__title"><span class="eyebrow">06 — Find your scent</span><h2 class="h-sec" id="h-notes">Shop by <em>note</em></h2></div></div><div class="notes">' +
      [['Oud', 'oud', 'oud'], ['Rose', 'rose', 'oud'], ['Citrus', 'citrus', 'fresh'], ['Fresh', 'fresh', 'fresh'], ['Woody', 'woody', 'oud']].map(function (n) {
        return '<a class="note" href="#/shop?f=' + n[2] + '"><img src="' + IMG + 'note-' + n[1] + '.jpg" alt="' + n[0] + ' note" loading="lazy"><span>' + n[0] + ' <span class="dot">' + arrow + '</span></span></a>';
      }).join('') + '</div></section>' +

    '<section class="sec rv" aria-labelledby="h-rev"><div class="sec__head"><div class="sec__title"><span class="eyebrow">07 — Reviews</span><h2 class="h-sec" id="h-rev">Loved by [X]+ <em>customers</em></h2></div><span class="sec__note">[x.x] ★ average · [N] verified reviews</span></div><div class="reviews">' +
      [['scarlet-oud'], ['citruz-breez'], ['notiq-duo']].map(function (r) {
        var p = byId[r[0]];
        return '<article class="review"><img src="' + IMG + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy"><div><span class="kicker">' + esc(p.name) + '</span><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><h3>[Review headline]</h3><p>[Real customer review text goes here.]</p><p style="margin-top:auto;font-weight:600;font-size:12px">[Name] · Verified purchase</p></div></article>';
      }).join('') + '</div></section>';
  }

  function pageShop(q) {
    var f = q.f || 'all', sort = q.sort || 'featured';
    var titles = { all: 'All fragrances', oud: 'The Oud Edit', fresh: 'The Fresh Edit', sets: 'Gift sets', soon: 'Coming soon', new: 'New arrivals' };
    var banners = { all: 'hero-duo.jpg', oud: 'scarlet-oud-smoke.jpg', fresh: 'citruz-sunlit.jpg', sets: 'gift-box.jpg', soon: 'body-mist.jpg', new: 'duo-stone.jpg' };
    var list = PRODUCTS.filter(function (p) { return f === 'all' || p.group.indexOf(f) > -1; });
    if (sort === 'low') list = list.slice().sort(function (a, b) { return (a.price || 9e9) - (b.price || 9e9); });
    if (sort === 'high') list = list.slice().sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
    return '<div class="page-head"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><span>Shop</span></nav>' +
      '<span class="eyebrow" style="margin-top:18px">Shop · ' + list.length + ' fragrance' + (list.length === 1 ? '' : 's') + '</span><h1 class="page-title">' + (titles[f] || 'Shop').replace(/(\S+)$/, '<em>$1</em>') + '</h1>' +
      '<div class="shop-banner rv"><img src="' + IMG + (banners[f] || banners.all) + '" alt=""><span>' + (titles[f] || '') + '</span></div>' +
      '<div class="shop-bar"><div class="shop-bar__filters" role="tablist">' +
        [['all', 'All'], ['new', 'New'], ['oud', 'Oud'], ['fresh', 'Fresh'], ['sets', 'Sets'], ['soon', 'Coming soon']].map(function (x) {
          return '<a class="pill' + (x[0] === f ? ' is-on' : '') + '" role="tab" aria-selected="' + (x[0] === f) + '" style="display:inline-flex;align-items:center" href="#/shop?f=' + x[0] + (sort !== 'featured' ? '&sort=' + sort : '') + '">' + x[1] + '</a>';
        }).join('') + '</div>' +
        '<div style="display:flex;gap:12px;align-items:center"><span class="shop-count">' + list.length + ' product' + (list.length === 1 ? '' : 's') + '</span>' +
        '<label class="sr" for="sortSel">Sort by</label><select class="select" id="sortSel" data-f="' + f + '">' +
          [['featured', 'Featured'], ['low', 'Price: low to high'], ['high', 'Price: high to low']].map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === sort ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') +
        '</select></div></div>' +
      '<div class="grid">' + (list.length ? list.map(card).join('') : '<p class="muted">Nothing here yet.</p>') + '</div></div>';
  }

  /* UGC videos under Add to bag. Put .mp4 files in /videos and list them per product in UGC below
     (src: 'videos/your-file.mp4'). Until a src is set, the tile shows the poster image only. */
  var UGC = {
    'scarlet-oud': [{ poster: 'scarlet-hand.jpg', src: '' }, { poster: 'model-her.jpg', src: '' }, { poster: 'scarlet-vanity.jpg', src: '' }],
    'citruz-breez': [{ poster: 'model-him.jpg', src: '' }, { poster: 'citruz-sunlit.jpg', src: '' }, { poster: 'citruz-studio.jpg', src: '' }],
    'notiq-duo': [{ poster: 'duo-stone.jpg', src: '' }, { poster: 'model-her.jpg', src: '' }, { poster: 'model-him.jpg', src: '' }],
    'gift-box': [{ poster: 'gift-box.jpg', src: '' }, { poster: 'duo-stone.jpg', src: '' }, { poster: 'duo-studio.jpg', src: '' }]
  };
  function ugcBlock(p) {
    var list = UGC[p.id]; if (!list || !list.length) return '';
    return '<div class="ugc"><div class="ugc__head"><span class="label">See it in real life</span><span class="ugc__sub">Customer videos</span></div><div class="ugc__row">' +
      list.map(function (v, i) {
        return '<div class="reel ugc__item"><video playsinline muted loop preload="none" poster="' + IMG + v.poster + '"' + (v.src ? ' src="' + v.src + '"' : '') + ' aria-label="Customer video ' + (i + 1) + ' for ' + esc(p.name) + '"></video>' +
          '<button data-ugc aria-label="Play customer video ' + (i + 1) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg></button></div>';
      }).join('') + '</div></div>';
  }

  function pageProduct(id) {
    var p = byId[id]; if (!p) return pageNotFound();
    var acc = [
      ['Description', p.lead + (p.soon ? '' : ' Blended at 30% fragrance oil and matured for weeks before bottling.')],
      ['Fragrance notes', p.pyramid.map(function (x) { return x[0] + ': ' + x[1]; }).join('\n') || 'Coming soon'],
      ['Feelings & occasions', p.occasions || 'Coming soon'],
      ['Behind the perfume', 'Every batch is hand-measured at 30% oil, slow-matured, chilled and filtered before filling, so the scent stays rich, clear and long lasting.'],
      ['Shipping & returns', 'Free shipping on all orders. [Dispatch time]. [Return / replacement policy].'],
      ['Legal information', 'Net quantity: ' + p.size + '\nType: ' + p.type + '\nMRP: ' + (p.mrp ? money(p.mrp) : (p.price ? money(p.price) : '—')) + ' (incl. of all taxes)\nManufactured / marketed by: [Company name and address]\nCountry of origin: India']
    ];
    var save = p.mrp && p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
    var related = PRODUCTS.filter(function (x) { return x.id !== p.id; }).slice(0, 4);
    var upsell = p.id === 'notiq-duo' ? byId['gift-box'] : byId['notiq-duo'];
    return '<div class="page-head" style="padding-top:20px"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/shop">Shop</a><span>/</span><span style="color:#111">' + esc(p.name) + '</span></nav></div>' +
    '<section class="pdp" data-pid="' + p.id + '">' +
      '<div class="gal"><div class="gal__thumbs">' + p.images.map(function (im, i) {
          return '<button data-shot="' + i + '" aria-current="' + (i === 0) + '" aria-label="Show image ' + (i + 1) + '"><img src="' + IMG + im + '" alt=""></button>';
        }).join('') + '</div>' +
        '<div class="gal__main"><img id="galImg" src="' + IMG + p.images[0] + '" alt="' + esc(p.name) + '">' +
          '<span class="card__tag"><b></b>' + esc(p.tag).toUpperCase() + '</span>' +
          '<button class="card__wish" data-wish="' + p.id + '" aria-pressed="' + (wish.indexOf(p.id) > -1) + '" aria-label="Save to wishlist">' + heart + '</button>' +
          (p.images.length > 1 ? '<button class="gal__nav gal__nav--prev" data-step="-1" aria-label="Previous image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><button class="gal__nav gal__nav--next" data-step="1" aria-label="Next image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' : '') +
          '<div class="gal__dots">' + p.images.map(function (x, i) { return '<i class="' + (i === 0 ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '</div></div>' +
      '<div class="buy">' +
        '<div style="display:flex;flex-direction:column;gap:12px"><span class="eyebrow eyebrow--red">' + esc(p.type) + ' · ' + esc(p.size) + ' · ' + esc(p.who) + '</span>' +
          '<h1 class="buy__title">' + esc(p.name).replace(/(\S+)$/, '<em>$1</em>') + '</h1><p class="buy__lead">' + esc(p.lead) + '</p>' +
          '<a href="#reviews" data-scroll="reviews" style="font-size:13.5px;color:#333"><span class="stars" aria-hidden="true">★★★★★</span> [x.x] · [N] reviews</a></div>' +
        (p.soon ? '<div class="buy__price"><strong>Launching soon</strong></div>' :
          '<div class="buy__price"><strong>' + money(p.price) + '</strong>' + (p.mrp ? '<s>' + money(p.mrp) + '</s><span class="save">SAVE ' + save + '%</span>' : '') + '<span style="flex-basis:100%;font-size:12.5px;color:#6b6b6b">Inclusive of all taxes · Free shipping</span></div>') +
        (p.notes.length ? '<div style="display:flex;flex-direction:column;gap:12px"><span class="label">Key notes</span><div class="knotes">' + p.notes.map(function (n) { return '<div><img src="' + IMG + n[1] + '" alt="">' + n[0] + '</div>'; }).join('') + '</div></div>' : '') +
        (p.soon ? '<form class="pin" id="notifyForm"><label for="notifyEmail" class="sr">Email</label><input id="notifyEmail" type="email" placeholder="Your email" required><button>Notify me</button></form><p class="pin__msg" id="notifyMsg" aria-live="polite"></p>' :
          '<div class="buy__row"><div class="qty qty--lg" role="group" aria-label="Quantity"><button data-pq="-1" aria-label="Decrease quantity">−</button><span id="pq" aria-live="polite">1</span><button data-pq="1" aria-label="Increase quantity">+</button></div>' +
          '<button class="btn btn--dark" id="pdpAdd">Add to bag<span class="px"> · <span id="pqTotal">' + money(p.price) + '</span></span> <span class="dot">' + arrow + '</span></button></div>' +
          '<button class="btn btn--ghost btn--block" id="buyNow">Buy it now</button>' +
          ugcBlock(p) +
          '<a class="upsell" href="#/product/' + upsell.id + '"><img src="' + IMG + upsell.images[0] + '" alt=""><span><span class="kicker" style="font-size:10.5px">Pair &amp; save</span><strong style="font-size:15px">' + esc(upsell.name) + '</strong><span style="font-size:12.5px;color:#555">' + esc(upsell.size) + ' · ' + money(upsell.price) + '</span></span><span class="card__add" data-add="' + upsell.id + '" role="button" tabindex="0" aria-label="Add ' + esc(upsell.name) + ' to bag">' + plus + '</span></a>' +
          '<form id="pinForm" style="display:flex;flex-direction:column;gap:10px"><label class="label" for="pin">Check delivery</label><div class="pin"><input id="pin" inputmode="numeric" maxlength="6" placeholder="Enter 6-digit pincode"><button>Check</button></div><p class="pin__msg" id="pinMsg" aria-live="polite"></p></form>' +
          '<div class="perks"><span>Free<br>shipping</span><span>30% oil<br>Extrait</span><span>[COD<br>available]</span></div>') +
        '<div class="acc">' + acc.map(function (a, i) {
          return '<div class="acc__item' + (i === 0 ? ' is-open' : '') + '"><button class="acc__btn" aria-expanded="' + (i === 0) + '">' + a[0] + '<span class="acc__sign" aria-hidden="true">+</span></button><div class="acc__body"><div><p>' + esc(a[1]) + '</p></div></div></div>';
        }).join('') + '</div>' +
      '</div></section>' +

    (p.pyramid.length ? '<section class="sec rv"><div class="story">' +
      '<div class="story__dark"><img src="' + IMG + p.smellsImg + '" alt="" loading="lazy"><div><span class="kicker" style="color:#ffb3be">Smells like</span><p>' + esc(p.smells) + '</p></div></div>' +
      '<div class="story__light"><div style="display:flex;flex-direction:column;gap:10px"><span class="kicker">The note pyramid</span><h2>' + p.bigName + '</h2><svg class="swoosh" viewBox="0 0 360 60" aria-hidden="true" style="width:260px"><path d="M4 44C70 30 150 16 220 22c40 4 70 14 132 2"/></svg></div>' +
        '<div style="display:flex;flex-direction:column;gap:10px">' + p.pyramid.map(function (x) { return '<div class="layer"><img src="' + IMG + x[2] + '" alt=""><span><small>' + x[0].toUpperCase() + '</small><strong>' + esc(x[1]) + '</strong></span></div>'; }).join('') + '</div></div>' +
    '</div></section>' : '') +

    '<section class="sec rv" id="reviews"><div class="sec__head"><div class="sec__title"><span class="eyebrow">Reviews</span><h2 class="h-sec">Customer <em>reviews</em></h2></div><a class="btn btn--dark" href="#/about" style="height:46px">Write a review <span class="dot">' + arrow + '</span></a></div>' +
      '<div class="reviews">' + [1, 2, 3].map(function () { return '<article class="review" style="background:#fff;border:1px solid #ededed"><div><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><h3>[Review title]</h3><p>[Review text from a real customer.]</p><p style="font-weight:600;font-size:12px">[Customer name] · <span style="color:#2e7d32">✓ Verified</span></p></div></article>'; }).join('') + '</div></section>' +

    '<section class="sec"><div class="sec__head rv"><div class="sec__title"><span class="eyebrow">More from Notiq</span><h2 class="h-sec">You may also <em>like</em></h2></div><a class="pill pill--outline" href="#/shop">View all ↗</a></div><div class="grid">' + related.map(card).join('') + '</div></section>' +

    (p.soon ? '' : '<div class="sticky-buy" id="stickyBuy"><img src="' + IMG + p.images[0] + '" alt=""><span><strong>' + esc(p.name) + '</strong>' + money(p.price) + ' · ' + esc(p.size) + '</span><button class="btn btn--dark" data-add="' + p.id + '">Add to bag <span class="dot">' + arrow + '</span></button></div>');
  }

  function pageAbout() {
    return '<div class="page-head"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><span>Our story</span></nav>' +
      '<div class="about-hero rv" style="margin-top:20px"><img src="' + IMG + 'duo-stone.jpg" alt="Notiq bottles on stone in sunlight"><div><span class="kicker" style="color:#fff">Our story</span><h1>Made <em>slow.</em><br>Worn <em>loud.</em></h1></div></div></div>' +
      '<section class="sec rv"><div class="sec__head"><div class="sec__title"><span class="eyebrow">The process</span><h2 class="h-sec">How every bottle is <em>made</em></h2></div><p class="sec__note">No shortcuts between the oil and your skin.</p></div><div class="steps">' +
        [['01', 'Measured', 'Every batch is blended at 30% fragrance oil, Extrait de Parfum strength.'],
         ['02', 'Matured', 'The blend rests for weeks so the notes settle and deepen.'],
         ['03', 'Chilled & filtered', 'Cold-rested and filtered for a clear, stable, crystal finish.'],
         ['04', 'Bottled', 'Filled by hand into our signature sculpted bottle.']].map(function (s) {
          return '<div class="step"><b>' + s[0] + '</b><h3>' + s[1] + '</h3><p>' + s[2] + '</p></div>';
        }).join('') + '</div></section>' +
      '<section class="sec rv"><div class="feature"><div class="feature__txt"><span class="kicker">Need help?</span><h2 class="feature__big" style="font-size:clamp(40px,5vw,64px)">TALK TO<br>US</h2><p class="feature__sub">Orders · Tracking · Returns · Gifting</p>' +
        '<a class="btn btn--dark" href="https://wa.me/' + CONFIG.whatsapp + '" target="_blank" rel="noopener" style="align-self:flex-start">Chat on WhatsApp <span class="dot">' + arrow + '</span></a></div>' +
        '<div class="feature__img"><img src="' + IMG + 'scarlet-hand.jpg" alt="Hand holding Scarlet Oud" loading="lazy"></div></div></section>';
  }

  function pageNotFound() {
    return '<div class="page-head" style="padding-bottom:60px"><h1 class="page-title">Page not found</h1><p style="margin:20px 0">That page has wandered off.</p><a class="btn btn--dark" href="#/">Back home <span class="dot">' + arrow + '</span></a></div>';
  }

  /* ---------------- router ---------------- */
  function parse() {
    var h = location.hash.replace(/^#/, '') || '/';
    var parts = h.split('?'); var path = parts[0]; var q = {};
    (parts[1] || '').split('&').forEach(function (kv) { if (kv) { var a = kv.split('='); q[decodeURIComponent(a[0])] = decodeURIComponent(a[1] || ''); } });
    return { path: path, q: q };
  }
  function route() {
    var r = parse(), html, seg = r.path.split('/').filter(Boolean);
    if (!seg.length) html = pageHome();
    else if (seg[0] === 'shop') html = pageShop(r.q);
    else if (seg[0] === 'product') html = pageProduct(seg[1]);
    else if (seg[0] === 'about') html = pageAbout();
    else html = pageNotFound();
    var main = $('#main'); main.innerHTML = html;
    document.body.classList.toggle('has-sticky', !!$('#stickyBuy'));
    closeAll(); window.scrollTo(0, 0); main.focus({ preventScroll: true });
    $$('.nav a').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === location.hash); });
    var p = seg[0] === 'product' && byId[seg[1]];
    document.title = p ? p.name + ' — NOTIQ' : (seg[0] === 'shop' ? 'Shop — NOTIQ' : seg[0] === 'about' ? 'Our story — NOTIQ' : 'NOTIQ — Extrait de Parfum');
    afterRender();
  }

  /* ---------------- per-page behaviour ---------------- */
  var io;
  function afterRender() {
    if (io) io.disconnect();
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
      $$('.rv').forEach(function (el) { io.observe(el); });
    } else $$('.rv').forEach(function (el) { el.classList.add('in'); });

    var pdp = $('.pdp');
    if (pdp) {
      var p = byId[pdp.getAttribute('data-pid')], shot = 0, qty = 1;
      var show = function (i) {
        shot = (i + p.images.length) % p.images.length;
        var img = $('#galImg'); img.style.opacity = 0;
        setTimeout(function () { img.src = IMG + p.images[shot]; img.style.opacity = 1; }, 160);
        $$('.gal__thumbs button').forEach(function (b, k) { b.setAttribute('aria-current', k === shot); });
        $$('.gal__dots i').forEach(function (d, k) { d.classList.toggle('on', k === shot); });
      };
      pdp.addEventListener('click', function (e) {
        var t = e.target.closest('[data-shot],[data-step],[data-pq],#pdpAdd,#buyNow,.acc__btn');
        if (!t) return;
        if (t.hasAttribute('data-shot')) show(+t.getAttribute('data-shot'));
        else if (t.hasAttribute('data-step')) show(shot + +t.getAttribute('data-step'));
        else if (t.hasAttribute('data-pq')) { qty = Math.max(1, Math.min(10, qty + +t.getAttribute('data-pq'))); $('#pq').textContent = qty; $('#pqTotal').textContent = money(p.price * qty); }
        else if (t.id === 'pdpAdd') addToCart(p.id, qty);
        else if (t.id === 'buyNow') { addToCart(p.id, qty); openLayer($('#cart')); }
        else if (t.classList.contains('acc__btn')) { var it = t.parentNode; var open = !it.classList.contains('is-open'); it.classList.toggle('is-open', open); t.setAttribute('aria-expanded', open); }
      });
      var main = $('.gal__main'), sx = null;
      main.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      main.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(shot + (dx < 0 ? 1 : -1)); sx = null; });
      var pin = $('#pinForm');
      if (pin) pin.addEventListener('submit', function (e) {
        e.preventDefault(); var v = $('#pin').value.trim();
        $('#pinMsg').textContent = /^\d{6}$/.test(v) ? 'Delivers to ' + v + ' in [3–5] days · Free shipping' : 'Please enter a valid 6-digit pincode.';
      });
      var nf = $('#notifyForm');
      if (nf) nf.addEventListener('submit', function (e) { e.preventDefault(); $('#notifyMsg').textContent = /\S+@\S+\.\S+/.test($('#notifyEmail').value) ? 'Done — we will email you at launch.' : 'Please enter a valid email.'; });
      var sb = $('#stickyBuy'), buyBtn = $('#pdpAdd');
      if (sb && buyBtn && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { sb.classList.toggle('is-on', !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }).observe(buyBtn);
      }
    }
    var sortSel = $('#sortSel');
    if (sortSel) sortSel.addEventListener('change', function () { location.hash = '#/shop?f=' + sortSel.getAttribute('data-f') + '&sort=' + sortSel.value; });
  }

  /* ---------------- global events ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-notify],[data-wish],[data-q],[data-rm],[data-open-cart],[data-close-cart],[data-close],[data-hfilter],[data-coltab],[data-reel],[data-ugc],[data-scroll]');
    if (!t) return;
    if (t.hasAttribute('data-add')) { e.preventDefault(); addToCart(t.getAttribute('data-add'), 1); if (t.classList.contains('card__add')) { var ic = t.innerHTML; t.classList.add('is-added'); t.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'; setTimeout(function () { t.classList.remove('is-added'); t.innerHTML = ic; }, 1400); } }
    else if (t.hasAttribute('data-notify')) { e.preventDefault(); location.hash = '#/product/' + t.getAttribute('data-notify'); }
    else if (t.hasAttribute('data-wish')) {
      e.preventDefault(); var id = t.getAttribute('data-wish'); var i = wish.indexOf(id);
      if (i > -1) wish.splice(i, 1); else wish.push(id);
      store('notiq_wish', wish); t.setAttribute('aria-pressed', i < 0);
      toast(i < 0 ? 'Saved to wishlist' : 'Removed from wishlist');
    }
    else if (t.hasAttribute('data-q')) { var l = cart.find(function (x) { return x.id === t.getAttribute('data-q'); }); setQty(l.id, Math.min(10, l.qty + +t.getAttribute('data-d'))); }
    else if (t.hasAttribute('data-rm')) setQty(t.getAttribute('data-rm'), 0);
    else if (t.hasAttribute('data-open-cart')) { e.preventDefault(); openLayer($('#cart')); }
    else if (t.hasAttribute('data-close-cart')) closeLayer($('#cart'));
    else if (t.hasAttribute('data-close')) closeLayer(t.closest('.drawer, .search'));
    else if (t.hasAttribute('data-hfilter')) {
      var f = t.getAttribute('data-hfilter');
      $$('[data-hfilter]').forEach(function (b) { var on = b === t; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
      $('#homeGrid').innerHTML = PRODUCTS.filter(function (p) { return f === 'all' || p.group.indexOf(f) > -1; }).map(card).join('');
      $$('#homeGrid .rv').forEach(function (el) { el.classList.add('in'); });
    }
    else if (t.hasAttribute('data-coltab')) setCol(+t.getAttribute('data-coltab'));
    else if (t.hasAttribute('data-reel')) toast('Connect your Instagram reels here');
    else if (t.hasAttribute('data-ugc')) {
      var box = t.parentNode, vid = box.querySelector('video');
      if (!vid.getAttribute('src')) { toast('Video coming soon'); return; }
      $$('.ugc__item.is-playing video').forEach(function (o) { if (o !== vid) { o.pause(); o.parentNode.classList.remove('is-playing'); } });
      if (vid.paused) { vid.muted = false; vid.play(); box.classList.add('is-playing'); } else { vid.pause(); box.classList.remove('is-playing'); }
    }
    else if (t.hasAttribute('data-scroll')) { e.preventDefault(); var el = document.getElementById(t.getAttribute('data-scroll')); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
  });
  function setCol(i) {
    $$('.col').forEach(function (c, k) { c.classList.toggle('is-on', k === i); });
    $$('.col-tab').forEach(function (c, k) { c.classList.toggle('is-on', k === i); });
  }
  document.addEventListener('mouseover', function (e) { var c = e.target.closest('.col'); if (c && !c.classList.contains('is-on')) setCol(+c.getAttribute('data-col')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); if (e.key === 'Enter' && e.target.matches('span[data-add]')) addToCart(e.target.getAttribute('data-add'), 1); });

  $('#cartOpen').addEventListener('click', function () { openLayer($('#cart')); });
  $('#menuOpen').addEventListener('click', function () { openLayer($('#mobileMenu')); });
  $('#mobileMenu').addEventListener('click', function (e) { if (e.target.closest('.mnav a, .mnav__foot a')) closeLayer($('#mobileMenu')); });
  ['#searchOpen', '#searchOpen2'].forEach(function (s) { $(s).addEventListener('click', function () { openLayer($('#search')); doSearch(''); }); });

  /* ---------------- search ---------------- */
  function doSearch(v) {
    v = v.trim().toLowerCase();
    var hits = PRODUCTS.filter(function (p) {
      var hay = [p.name, p.type, p.who, p.lead, p.group.join(' '), p.notes.map(function (n) { return n[0]; }).join(' ')].join(' ').toLowerCase();
      return !v || hay.indexOf(v) > -1;
    });
    $('#searchChips').innerHTML = ['Oud', 'Rose', 'Citrus', 'Gift', 'Duo'].map(function (c) { return '<button class="pill" data-chip="' + c + '">' + c + '</button>'; }).join('');
    $('#searchResults').innerHTML = hits.length ? hits.map(card).join('') : '<p class="search__empty">No match for "' + esc(v) + '". Try oud, rose or citrus.</p>';
    $$('#searchResults .rv').forEach(function (el) { el.classList.add('in'); });
  }
  $('#searchInput').addEventListener('input', function (e) { doSearch(e.target.value); });
  $('#searchChips').addEventListener('click', function (e) { var c = e.target.closest('[data-chip]'); if (c) { $('#searchInput').value = c.getAttribute('data-chip'); doSearch(c.getAttribute('data-chip')); } });
  $('#searchResults').addEventListener('click', function (e) { if (e.target.closest('a')) closeLayer($('#search')); });

  /* ---------------- newsletter ---------------- */
  $('#subForm').addEventListener('submit', function (e) {
    e.preventDefault(); var v = $('#subEmail').value;
    $('#subMsg').textContent = /\S+@\S+\.\S+/.test(v) ? 'You are on the list. Welcome to NOTIQ.' : 'Please enter a valid email.';
  });

  window.addEventListener('hashchange', function () {
    if (/^#(reviews)$/.test(location.hash)) return;
    route();
  });
  renderCart();
  route();
})();
