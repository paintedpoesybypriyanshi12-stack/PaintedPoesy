# Painted Poesy by Priyanshi

The website for **Painted Poesy by Priyanshi**: contemporary mixed-media paintings by
Priyanshi Pandey, Dallas, Texas. The site centres on the current series, **Navarathna**:
nine paintings inspired by the nine gems of the Indian Navaratna tradition.

Planned address: `paintedpoesybypriyanshi.com` (domain not yet connected).

## What's on the site

| Page | What it shows |
|---|---|
| **Home** | A full-screen, slowly flowing animation made from the Blue Sapphire painting, the headline, and links to the three sections. |
| **About Me** | Priyanshi's story, practice and process, with close-up photographs. |
| **Navarathna** | The series introduction, the tradition behind it, and all nine works with their descriptions. Each painting opens into a larger view. |
| **Contact Us** | A pop-up form, available from every page. |
| **Privacy** | The privacy notice, linked from the footer. |

It is a plain static website: HTML, CSS and JavaScript with no build step, so it can
be hosted anywhere (GitLab Pages, Netlify and so on). It adapts to phones, tablets and
laptops, and follows the visitor's light or dark setting on the inner pages.

## Folder layout

```
index.html                 All pages (Home, About, Navarathna, Privacy) in one file
assets/
  works.js                 ← Site settings and all painting details (edit this one)
  app.js                   Page switching, gallery, pop-ups, contact form
  style.css                Colours, fonts and layout
  flow-sapphire.js         The animated background on the home page
images/
  works/                   The main photograph of each painting
  detail/                  Close-ups used in pop-ups and on the About page
  flow/sapphire-full.jpg   Source image for the home-page animation
```

## Common updates

Almost everything you will want to change lives in **`assets/works.js`**.

**Painting details.** Each painting has an entry with its gem, traditional association,
heading line, description, photo and alt text (the description read aloud to visitors
using screen readers). Shared details are set once near the bottom of the file:

```js
year: 2026,
medium: "Mixed media on canvas",
dimensions: "5 × 4 ft",
availability: "Available",   // set to "Sold" to show "This painting has found a home."
```

Any of these can also be set on an individual painting to override the shared value.

**Adding or replacing a photo.**
1. Export the photo as a JPEG about **2000 px** on its longest side (under 1 MB is ideal;
   full 300 dpi print files are too large for the web).
2. Save it in `images/works/`, for example `images/works/cats-eye.jpg`.
3. In `works.js`, point that painting's `image:` to the new file and update its `alt:` text.

*Still to do:* **Cat's-eye** uses an older phone photo (`images/works/midnight.jpg`)
until its professional photograph is ready. When it is, follow the steps above and set
`gemConfirmed: true` on its entry.

**Contact form.** Messages are delivered by [Web3Forms](https://web3forms.com) (free plan)
to paintedpoesybypriyanshi12@gmail.com. Settings are in `web3forms` at the top of
`works.js`:

- `accessKey`: the Web3Forms access key created for that inbox. It is a public form
  identifier, not a password: it is sent from the visitor's browser, so it is visible in
  the page source, which is how Web3Forms is designed. While it is empty the form says it
  is not connected and sends nothing.
- `subject`, `fromName`: the notification's subject line and sender display name. The
  visitor's address is sent as `email`, which Web3Forms uses as the Reply-To, so pressing
  Reply answers the visitor.
- `hcaptcha`: the free hCaptcha check, loaded through Web3Forms. It must also be switched
  on for the form in the Web3Forms dashboard.

The free plan allows 250 submissions a month; Web3Forms emails a warning at 90% and 100%,
and the dashboard at app.web3forms.com shows usage.

**Tests.** `tests/contact-form.mock.html` checks the contact form against a fake Web3Forms
(validation, loading state, duplicate submits, success and every failure type). It sends
nothing and delivers no email. Run a local server (below) and open
<http://localhost:8000/tests/contact-form.mock.html>; it prints PASS/FAIL for each check.
Only a real submission proves an email arrives.

**Draft markers.** While `draft: true` is set at the top of `works.js`, unconfirmed
details show a small "To confirm" tag and the privacy notice shows its bracketed
placeholders. Set it to `false` before launch.

**Privacy notice.** The bracketed parts in the Privacy section of `index.html` (hosting
provider, form provider, analytics, retention, privacy requests) need filling in to
match the services actually used.

## Seeing changes in a browser

Browsers block the home-page animation when `index.html` is opened directly from the
computer (the rest of the site works). To see everything, run a small local server
from this folder:

```
python3 -m http.server 8000
```

then open <http://localhost:8000>.

After changing `assets/*.js`, `assets/style.css` or the animation image, raise the
`?v=` number on their links in `index.html` (for example `?v=13` to `?v=14`), and the
matching number in `flow-sapphire.js`. That makes visitors' browsers fetch the new
files instead of reusing old saved copies.

## About the home-page animation

`assets/flow-sapphire.js` brings the Blue Sapphire painting to life in the browser using
WebGL. Its marbled paint flows along the direction of its own veins, while the crystal
clusters are held almost still so they stay crisp, and a slow light catches the gold and
the facets. It is a seamless 90-second loop that opens on the same frame on every visit.
It stays still for visitors whose devices ask for reduced motion (they can still press
**Play motion**), and shows a soft blue placeholder while the image loads or if the
device cannot run it.

## Credits

Artwork, photographs and writing © Priyanshi Pandey. All rights reserved. The artwork
and images may not be reproduced without permission.
