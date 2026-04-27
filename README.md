# Auravale Academy SEO Package — Setup Guide

This folder contains everything you need to make your site visible to Google and shareable on social media. Follow the steps below in order.

---

## What's in this package

1. `sitemap.xml` — list of all your pages for search engines
2. `robots.txt` — tells search engines what they can crawl
3. `head-snippets/` — drop-in code for each page's `<head>` section
4. `og-image-spec.txt` — what to make for the social preview image
5. `submission-checklist.txt` — step-by-step list of where to register your site

---

## Step 1: Add the two new files to your repo root

Place these in the same folder as `index.html`:

- `sitemap.xml`
- `robots.txt`

After deploying, verify they work by visiting:
- https://auravaleacademy.com/sitemap.xml
- https://auravaleacademy.com/robots.txt

Both should display as plain text in your browser.

---

## Step 2: Make a social preview image

You need one image: `og-image.jpg`

Specs:
- Dimensions: 1200 x 630 pixels (exactly)
- Format: JPG (smaller file size than PNG)
- Under 300 KB if possible
- Should show your brand: aurora visual, "Auravale Academy" wordmark, and the tagline "Lighting up the darkest corners"

Save it to your repo as `/og-image.jpg` (root level, same as index.html).

This is what shows up when someone shares your link on WhatsApp, Facebook, LinkedIn, X, etc. Right now they see nothing. With this, they see a beautiful preview card and click rates jump significantly.

You also need a favicon (the little icon in the browser tab):
- `favicon.ico` (16x16 and 32x32 sizes combined)
- `apple-touch-icon.png` (180x180 for iPhone home screen bookmarks)

Use a free tool like realfavicongenerator.net to generate all sizes from your logo.

---

## Step 3: Update each page's <head>

Open the files in `head-snippets/` and follow the instructions inside each one. Each file shows you exactly what to add or replace.

The five files:
- `index-head.html` (homepage, biggest changes needed)
- `about-head.html`
- `products-head.html`
- `programs-head.html`
- `schools-head.html`

---

## Step 4: Submit your site to search engines

See `submission-checklist.txt` for the click-by-click steps.

Short version:
1. Google Search Console (the big one)
2. Bing Webmaster Tools (small but free)

Both ask you to verify ownership of your domain, then you submit your sitemap URL. After that, search engines start indexing you within a few days.

---

## Step 5: Patience

SEO is slow. Even with everything set up perfectly, it takes 2 to 8 weeks before you start showing up in search results, and 3 to 6 months before you rank well for anything competitive. The work you're doing now compounds over time. Stick with it.

---

## What this package does NOT include (and why)

- **Analytics** (Google Analytics, Plausible, etc.) — separate setup, recommend Plausible for privacy and simplicity, ask me when you're ready
- **A blog** — biggest single thing for long-term SEO, but it's a content project, not a tag project
- **Indonesian language versions** — your `lang` toggle in the nav suggests this is planned. When you build it, each language gets its own URL and `hreflang` tags. Ask me when you get there.
