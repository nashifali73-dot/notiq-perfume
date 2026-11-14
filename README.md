# NOTIQ — Extrait de Parfum storefront

Front-end for the NOTIQ perfume website: plain HTML, CSS and JavaScript, no build step.

## Pages
- Home: hero, collections, signature banner, new & popular, bundles, shop by gender, reels, note profiles, reviews
- Shop: `#/shop?f=all|new|oud|fresh|sets|soon` with price sorting
- Product: `#/product/scarlet-oud`, `citruz-breez`, `notiq-duo`, `gift-box`, `body-mist`
- Our story: `#/about`
- Cart drawer (saved in the browser), search, mobile menu, WhatsApp checkout

## Run locally
Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Edit before launch
Everything is at the top of `assets/app.js`:
- `CONFIG.whatsapp`: WhatsApp number with country code, no `+`
- `CONFIG.checkoutUrl`: optional checkout link (empty = WhatsApp order)
- `PRODUCTS`: names, prices, MRP, copy, notes and images. Duo and Gift Box prices are demo values.
- Text in `[brackets]` is placeholder copy (notes, reviews, delivery days, legal details).

## Deploy
Static site: works on GitHub Pages (Settings → Pages → Deploy from branch `main`, root), Netlify or Vercel.
