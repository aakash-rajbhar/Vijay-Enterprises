<!-- impeccable:design-schema 1 -->

# Design: Vijay Enterprises

This file replaces the current "paper / blueprint" direction. **Scope: a complete revamp of the website, limited to five routes for now: Home, Services, Products, About, Contact** (plus shared layout, navigation, footer, form, 404 and metadata). Do not build any other route yet. Read it fully before touching any component. Where it conflicts with the existing code, this file wins. Content truth still comes from `PRODUCT.md`.

## 1. Creative North Star

**"Precision machinery, shot in a dark studio."**

The site should feel like a premium industrial product launch, not a drafting table. Think: a CNC head photographed in grayscale, huge confident headlines, a floating glass nav, rounded image windows, and one hot signal colour that behaves like a weld spark. Dark and light sections alternate like a machine housing and its inner chamber.

Three words: **dark, precise, confident.**

**Quality bar: Awwwards-level.** The site should feel like an award-nominated studio build, not a template: considered typography, theatrical but controlled motion, smooth scrolling, tactile micro-interactions and obsessive spacing. Premium means *restraint plus craft*: fewer elements, executed perfectly, with every transition intentional. If a section looks like a stock Tailwind template, redo it.

### Reference map (what to take from each)

| Reference | Take | Leave |
|---|---|---|
| **Ferox** (dark machinery hero) | Full-bleed grayscale macro photography, floating pill nav with blur, headline anchored lower-right over the image, circular outline "next" button, hairline overlay lines crossing the hero, sparse chrome | The cart. Vijay has no e-commerce. Never show a cart |
| **KRVX** (serif + orange) | Warm-gray light surface alternating with pure black sections, one orange-red accent for buttons and small dots, pill-shaped image window with soft border, glassy rounded feature cards with a tiny icon chip, oversized fading headline on dark | The serif display face (see Typography). The robotics tone |
| **Stodio** (agency grid) | Huge tight grotesk headlines, small red square before eyebrow labels, "By the numbers" row with dashed underlines, big statement paragraph where the second half fades to gray, rounded image strip, dark "Services" block, pill buttons in white and red | Client-logo marquee (no client names supplied). Blurred-face photography |
| **q-industrial.com** | Stacked two-line oversized hero title, numbered fullscreen menu (00 Home, 01 ..., 02 ...), numbered benefits 1-5, category cards with image + small label ("Industries"), diagonal-arrow CTAs, "Scroll Down" cue, full-bleed photo before the footer, huge CTA band in footer, back-to-top | Coatings content, cookie banner styling, video modal (no video yet) |

## 2. Explicit Anti-Patterns (do not ship any of these)

The previous build failed on these. Remove them.

- No cream, beige, parchment or off-yellow backgrounds
- No grid-paper, graph-paper or blueprint backgrounds
- No drafting-sheet frames, "SHEET 1 OF 1", "REV C" or title-block UI
- No wide letter-spaced mono text as the main nav or headings
- No condensed poster fonts (Barlow Condensed, Bebas, Oswald and similar)
- No thin technical dimension-line illustrations as the hero
- No navy + brick-red "engineering drawing" palette
- No cart, price, "Add to cart" or checkout UI anywhere
- No fake client logos, fake testimonials, fake phone numbers (see `PRODUCT.md`)
- No generic SaaS gradients (purple/blue glow, mesh blobs)
- No template tells: default card grids with drop shadows, centred icon-above-title feature rows, stock "hero + 3 columns" repetition, emoji icons, default Tailwind blue links
- No motion for its own sake: nothing that delays reading, blocks input, or loops distractingly

## 3. Colour

Cool, neutral, slightly steel. **Nothing warm except the accent.** Define as CSS variables and expose through Tailwind.

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0A0B` | Primary dark section background, primary text on light |
| `graphite` | `#141416` | Raised surfaces on dark (cards, nav pill base) |
| `steel-900` | `#1E1F22` | Borders on dark, hover surfaces |
| `steel-700` | `#3A3C41` | Dividers on dark, disabled |
| `steel-500` | `#74777E` | Secondary text on light, faded statement words |
| `steel-300` | `#B6B8BD` | Secondary text on dark |
| `steel-200` | `#D9DADD` | Borders on light |
| `mist` | `#ECECEA` | Light section background (neutral warm-gray like KRVX, never cream) |
| `white` | `#FFFFFF` | Light section alternate, cards on mist, text on dark |
| `spark` | `#FF4A1C` | **The only accent.** Primary CTA fill, eyebrow squares, number accents, focus ring |
| `spark-deep` | `#D93A12` | Hover/pressed for `spark` |

Rules:

- Accent budget: **spark appears at most 3 to 4 times per viewport.** Primary CTA, eyebrow squares, one highlight. It is a spark, not a theme colour.
- Section rhythm: dark hero (`ink`) → light (`mist`/`white`) → dark → light → dark footer CTA. Never two light or two dark sections in a row for more than one pair.
- Photos are treated **grayscale** by default (`grayscale` + slight contrast) so that placeholder stock reads as one coherent set. Colour in imagery comes only from the spark accent in UI.
- Text contrast: body text on `ink` uses `steel-300` or white, never lower than `steel-300`. Body on light uses `ink` or `steel-500` for secondary only.

### Tailwind wiring (Tailwind v4 `@theme`; if the project is on v3, mirror in `tailwind.config`)

```css
@theme {
  --color-ink: #0A0A0B;
  --color-graphite: #141416;
  --color-steel-900: #1E1F22;
  --color-steel-700: #3A3C41;
  --color-steel-500: #74777E;
  --color-steel-300: #B6B8BD;
  --color-steel-200: #D9DADD;
  --color-mist: #ECECEA;
  --color-spark: #FF4A1C;
  --color-spark-deep: #D93A12;

  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-inter-tight), var(--font-inter), ui-sans-serif, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  --radius-pill: 9999px;
  --radius-card: 28px;
  --radius-window: 40px;
}
```

## 4. Typography

One family does the heavy lifting. Confidence comes from **size and tight tracking**, not from decorative fonts.

| Role | Font | Notes |
|---|---|---|
| Display | **Inter Tight** (`next/font/google`) | Weight 500, tracking `-0.04em`, line-height `0.95` to `1.0` |
| Body / UI | **Inter** | Weight 400/500, line-height 1.5 |
| Spec / label | **JetBrains Mono** | Used sparingly: machine names, capacity figures, section numbers. Never for nav or headings. Tracking normal, not wide |

Scale (use `clamp`, mobile first):

| Token | Size | Use |
|---|---|---|
| `display-xl` | `clamp(3.25rem, 9vw, 9rem)` | Hero headline, footer CTA |
| `display-l` | `clamp(2.5rem, 6vw, 5.5rem)` | Section statement |
| `display-m` | `clamp(1.75rem, 3.2vw, 3rem)` | Card titles, numbers |
| `body-l` | `1.25rem` | Lead paragraphs |
| `body` | `1rem` | Default |
| `label` | `0.8125rem` | Eyebrows, captions (sentence case, not all-caps tracking) |

Patterns to reuse:

- **Fading statement** (Stodio): large paragraph in `ink`, final clause in `steel-500` ("We cut, bend, shear and weld under one roof, so one supplier answers for the part.")
- **Stacked hero title** (Q-Industrial): break the headline into 2 to 3 short lines, left aligned, no centering except in the dark closing CTA.
- **Eyebrow**: 8px `spark` square + `label` text, e.g. "■ Who we are".
- Never set paragraphs wider than `62ch`.

## 5. Layout and Spacing

- Max content width `1360px`, side padding `clamp(20px, 4vw, 56px)`.
- 12-column grid on desktop; hero and statement blocks deliberately asymmetric (text pushed right or low, like Ferox).
- Vertical section padding: `clamp(80px, 12vw, 180px)`. Generous. Let the dark sections breathe.
- Hero is **full viewport height**, edge to edge inside a rounded frame inset 12 to 16px from the viewport (like Stodio and Ferox).
- Rounded image windows: `--radius-window` for big ones, `--radius-card` for cards, pill for chips and buttons.

## 6. Components

### Floating nav (Ferox + Stodio)
- Fixed, inset from top 16px, centred pill, `backdrop-blur-xl`, `bg-white/10` on dark / `bg-white/70` on light, 1px `white/15` border.
- Left: Vijay Enterprises wordmark (simple geometric mark + "Vijay Enterprises" in Inter Tight 500).
- Centre links, exactly these four: Services (`/services`), Products (`/products`), About (`/about`), Contact (`/contact`). Sentence case, 14px. Define them in one `links` array and reuse it in the nav, mobile menu and footer.
- Right: white pill **"Request a quote"** with a small diagonal arrow. This replaces Ferox's cart.
- Mobile: the pill collapses to wordmark + Menu button, opening a **fullscreen numbered menu** (Q-Industrial): `00 Home`, `01 Services`, `02 Products`, `03 About`, `04 Contact`, large display type, email shown at the bottom (no phone).

### Buttons
- Primary: `spark` fill, white text, pill, 48px tall, trailing diagonal arrow in a small `ink/20` circle. Hover: `spark-deep`, arrow nudges 3px up-right.
- Secondary: white fill, `ink` text (on dark) or `ink` outline (on light).
- Circular outline icon button (Ferox "next"): 44px, 1px `white/60` border, chevron.
- Focus: 2px `spark` ring with 2px offset. Always visible.

### Rounded image window (KRVX pill + Ferox)
- Large `--radius-window` container, 1px soft border, inner grayscale photo, subtle inner vignette. One per hero and one mid-page.
- Optional hairline overlay lines (1px `white/10`) crossing the hero for the engineered feel. Keep it to two or three lines, not a grid.

### Image strip (Stodio portrait row)
- Horizontally scrolling or 4-up row of tall rounded cards (`--radius-card`, aspect 3/4) showing the five processes: cut, shear, bend, weld, fabricate. Each has a small caption chip at the bottom. Partially cropped at the viewport edge to hint at scroll.

### By the numbers (Stodio)
Four columns, big `display-m` figure, **dashed underline** in `steel-200`, label below in `body` and a one-line caption in `steel-500`. Use **only confirmed facts**:
- `30+` Years in the metal industry
- `25 mm` Laser cutting thickness
- `12 mm × 3 m` Shearing capacity
- `5` Processes under one roof

### Services list (Stodio dark block + Q-Industrial numbering)
Dark section. Each row: number (`01`) in `spark`, process name in `display-m`, one-line capability on the right in `steel-300`, hairline divider. On hover the row lifts: name shifts 8px right, a rounded image preview fades in at the cursor (desktop only).
- 01 Laser cutting: up to 25 mm, TL Series TL4020
- 02 Shearing: 12 mm thick, 3 m wide, NC "Genius" series
- 03 Bending: CNC Press Brake Hawk 150-31
- 04 Welding
- 05 Fabrication: one-off and production, one roof

### Feature cards (KRVX "Core Systems")
Three glass cards, `--radius-card`, `bg-white/70` on mist (or `graphite` with `white/10` border on dark), small circular icon chip top-left (the first one filled `spark`, others neutral), title in `display-m`, two-line description. Use for "Machines": TL4020 laser, Hawk 150-31 press brake, Genius NC shear.

### Product / category cards (Q-Industrial)
Image on top (grayscale, rounded), small gray category label ("Products"), name below, diagonal arrow top-right. Cover: machine parts, covers and panels, hoppers, ladders, tables, gates, jali designs, metal frames.

### Marquee
Slow horizontal text marquee between hero and next section: `Laser cutting · Shearing · Bending · Welding · Fabrication · Machine parts · Delhi NCR`. Mono label size, `steel-500`. This stands in for Stodio's client logos until real ones exist.

### Closing CTA + footer (Q-Industrial)
- Full-bleed photo band (grayscale) with `display-xl` "Send the drawing. We return the part." centred or left-aligned, a `spark` primary button "Request a quote" and a secondary link to the email.
- Footer on `ink`: sitemap columns, address (Tughlakabad Village, New Delhi 110020), **email only**, back-to-top circle button.

## 7. Imagery

Real facility photos have not been supplied. Until then:

- Use grayscale, high-contrast, dark-studio imagery of: laser cutting sparks, press brake, sheet metal edges, weld arcs, machined parts. Source from licensed stock (Unsplash/Pexels) via local files in `/public/images/placeholder/`, **not hotlinked**.
- Every placeholder image gets a code comment `{/* PLACEHOLDER: replace with real Vijay Enterprises photo */}` and filename prefix `placeholder-`.
- Never caption a stock photo as "our workshop" or "our machine". Captions describe the process, not ownership.
- When real assets arrive, swap in without layout change: all image slots use fixed aspect ratios with `object-cover`.

## 8. Motion and Interaction (the Awwwards layer)

Motion is a core part of the design, not decoration. It should feel **mechanical, weighted and smooth**, like a precision machine moving on rails. No bounce, no elastic, no spring overshoot.

### Stack

- **Smooth scroll:** `lenis` (lerp ~0.1), wired to GSAP's ticker.
- **Animation:** `gsap` with `ScrollTrigger` (and `SplitText` if available; otherwise a small custom line/word splitter). `motion` (Framer Motion) may be used for simple component-level transitions and route transitions.
- **Optional, only if it stays fast:** a single lightweight WebGL or canvas effect in the hero (slow displacement or heat-shimmer over the photo). If it threatens performance on mid-range Android phones, drop it and use the CSS parallax instead.
- No other heavy libraries. No Three.js scenes.

### Tokens

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo feel) for reveals; `cubic-bezier(0.65, 0, 0.35, 1)` for in-out transitions.
- Durations: micro 200 to 300ms, reveals 700 to 1100ms, page transitions 600 to 800ms.
- Stagger: 60 to 90ms between lines or items.

### Signature moments (build all of these)

1. **Preloader (once per session, under 1.8s):** `ink` screen, a thin spark-colour progress line grows left to right with a counter `00 → 100` in `mono`, then the screen splits open (two halves slide apart like shearing steel) to reveal the hero. Skip entirely on repeat visits and for reduced-motion users. Never block content longer than needed.
2. **Hero entrance:** photo starts scaled 1.15 inside its rounded frame and settles to 1; headline lines rise out of overflow-hidden masks, staggered; nav pill drops in last. Slow scroll parallax on the image (max 60px), and the hero headline fades and lifts as you scroll out.
3. **Text reveals:** all `display` headings reveal line by line from masks on enter. The "fading statement" paragraph colours word by word on scroll (scrubbed): words go from `steel-300` to `ink` as the user scrolls through the block.
4. **Image reveals:** rounded image windows reveal with a `clip-path` wipe plus an inner scale from 1.2 to 1. Images stay grayscale; on hover a card shifts to slightly higher contrast and the image drifts 12px.
5. **Pinned process section (Home, process strip):** on desktop, pin the section and move the five process cards horizontally as the user scrolls (cut, shear, bend, weld, fabricate), with a progress line and a large numeral that changes (`01` to `05`) in `spark`. On mobile: native horizontal snap scroll, no pinning.
6. **Stacked cards:** on Services, service rows or machine cards stack and scale back slightly as the next one slides over (sticky stacking). Keep it subtle (scale 0.96, dim to 70%).
7. **Number counters:** the "By the numbers" figures count up once when 60% in view, using tabular figures so the layout never jitters.
8. **Marquee:** the text marquee speeds up slightly with scroll velocity and reverses direction on scroll up.
9. **Magnetic buttons:** primary and nav "Request a quote" pills pull toward the cursor within ~60px (max 10px shift), arrow icon rotates 45deg on hover. Disabled on touch.
10. **Custom cursor (desktop, fine pointer only):** a small 10px dot with a trailing 36px ring (`mix-blend-difference`). Over images or service rows the ring grows and shows a label ("View", "Drag", "Enquire"). Over text and inputs it reverts to the normal cursor. Never replace the cursor inside forms.
11. **Service row hover:** row title slides 8px right, other rows dim to 40%, a floating rounded image preview follows the cursor with slight lag and rotation (desktop only).
12. **Navigation:** nav pill hides on scroll down and returns on scroll up; it switches from glass-on-dark to glass-on-light based on the section underneath. The mobile fullscreen menu opens with a clip-path circle expand from the button, links stagger in from masks, and each link has an underline that draws on hover.
13. **Page transitions:** route change uses a quick `ink` panel wipe (bottom to top) with the page name in `display-m` mid-transition, then the new page's hero entrance plays. Use the View Transitions API or `motion` `AnimatePresence`; keep total under 800ms.
14. **Texture:** a very subtle film-grain overlay (2 to 4% opacity, static PNG or tiny canvas, `pointer-events-none`) over dark sections only. Never over text-heavy light sections.
15. **Scroll cue and progress:** a thin `spark` scroll-progress line along the top edge and a "Scroll" label with a slow-looping line animation in the hero.
16. **Footer finale:** the closing CTA headline sits huge (`display-xl`, full width), with the "Request a quote" button magnetised. On reaching the footer the wordmark "Vijay Enterprises" appears oversized at the bottom, cropped by the viewport edge, like a poster.

### Typographic craft

- Optical alignment: pull large display type left by ~0.04em so edges align visually; use `text-wrap: balance` on headings and `text-wrap: pretty` on body.
- Hanging numerals and `font-variant-numeric: tabular-nums` for figures and specs.
- Mix weight and colour inside one headline only once per page (the fading-statement pattern), not everywhere.
- Generous negative space: when in doubt, add 20% more padding.

### Hard constraints (premium means it also performs)

- **Performance:** Lighthouse performance 90+ on mobile for every route. Animate only `transform`, `opacity` and `clip-path`. Use `will-change` sparingly. Images via `next/image` with proper `sizes`, AVIF/WebP, and blur placeholders. Preload the hero image and fonts.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, disable Lenis smooth scroll, pinning, parallax, marquee velocity, magnetic and cursor effects, the preloader and page transitions; keep simple 200ms fades only.
- **Touch devices:** no custom cursor, no magnetic effect, no hover previews. Replace with tap states.
- **Accessibility is not negotiable:** all content is readable and operable without animation; reveals never leave text invisible if JS fails (use `no-js` safe defaults); focus order unaffected by pinned or stacked sections; the custom cursor never hides the native cursor over interactive form controls.
- **Cleanup:** kill ScrollTrigger instances and Lenis on unmount; refresh ScrollTrigger after fonts and images load to prevent layout jumps.
- **Cumulative layout shift under 0.05.** Reserve space for all images and animated text.

## 9. Site Map and Page Structure

Every page uses the same shell: floating pill nav, a dark hero band, alternating dark/light sections, the closing CTA band and the footer. No page may fall back to the old paper style.

### Routes (Next.js App Router), only these

```ts
const links = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
```

| Route | Page |
|---|---|
| `/` | Home |
| `/services` | Services, including machines and capacity |
| `/products` | Products |
| `/about` | Workshop and founder |
| `/contact` | Request a quote, address, map |
| `not-found.tsx` | 404 page |

**Out of scope for now:** individual service pages, product category pages, a separate capacity page, privacy page, blog, news. Do not create these routes. Anything that would have lived there is handled by a section on the five pages above, using anchors (`#machines`, `#capacity`, `#categories`). Do not render dead links; if the footer would normally link to Privacy, leave it out.

The "Request a quote" pill always links to `/contact`.

### Shared page-header pattern (Services, Products, About, Contact)

- Dark `ink` band, about 70vh on desktop, with a grayscale placeholder image, `ink/60` gradient overlay and the floating nav.
- Small eyebrow (spark square + page name) instead of a breadcrumb.
- `display-l` stacked title (2 lines max), one-line lead in `body-l` and `steel-300`.
- Small outline circular "scroll" button bottom-right.

### 9.1 Home `/`

1. **Hero** (dark): full-bleed grayscale machinery image, headline lower-right "Precision metal work, cut to your drawing." Sub: "Laser cutting, shearing, bending, welding and fabrication under one roof in Tughlakabad, New Delhi." CTAs: Request a quote / See services. "Scroll" cue bottom-left.
2. **Marquee strip**
3. **Who we are** (light): eyebrow, fading statement, "About the workshop" link
4. **Process strip** (light): five rounded image cards linking to `/services`
5. **By the numbers** (light)
6. **Services** (dark): numbered rows with capacity specs; every row links to `/services`
7. **Machines** (light, KRVX cards): TL4020, Hawk 150-31, Genius, linking to `/services#machines`
8. **Products** (light): category cards grid linking to `/products`
9. **Founder** (mist): Vijay Rajbhar, 30+ years, short honest paragraph, clearly marked placeholder portrait slot
10. **Closing CTA + footer**

### 9.2 Services `/services`

This single page carries everything a procurement engineer needs: processes, specs, machines and how ordering works.

1. **Page header**: "Five processes. One roof." with a lead about one accountable supplier.
2. **The chain** (light): horizontal numbered flow Cut, Shear, Bend, Weld, Fabricate as connected rounded chips with hairline connectors, showing how a part moves through the shop without leaving the building.
3. **Service rows** (dark): all seven confirmed services as numbered rows (`01` to `07`): laser sheet cutting, sheet shearing, sheet bending, welding, fabrication, manufacturing machine parts, product design. Each row has a one-line description and a capacity spec on the right in `mono`. Hover image preview on desktop. Rows expand in place (accordion) to show 2 to 3 lines of detail instead of linking to another page.
4. **Capacity table** (light, `id="capacity"`): rounded white card, rows for each process with Machine / Capacity in `mono`. Only confirmed figures:
   - Laser cutting: up to 25 mm, TL Series TL4020
   - Shearing: up to 12 mm thick, 3 m wide, NC "Genius" series
   - Bending: CNC Press Brake Hawk 150-31
   - Other processes: description only, no invented numbers
5. **Machines** (dark, `id="machines"`, KRVX cards): TL4020 laser, Hawk 150-31 press brake, Genius NC shear, each with a placeholder image slot.
6. **How an order works** (light): 4 numbered steps (Send drawing or spec, Get a quote, We make it, Delivery within Delhi NCR). No invented turnaround numbers; say "Ask us for a turnaround estimate with your quote".
7. **What we need from you** (mist): short checklist (drawing or sketch, material and thickness, quantity, delivery location in Delhi NCR) and a note that work is quoted and delivered within Delhi NCR only.
8. Closing CTA + footer.

### 9.3 Products `/products`

1. **Page header**: "Parts and structures, made to order."
2. **Category grid** (light, `id="categories"`): 8 category cards (Q-Industrial style, grayscale image, small "Products" label, name, diagonal arrow): machine parts, covers and panels, hoppers, ladders, tables, gates, jali designs, metal frames. Cards are not links; they open a lightweight in-page panel/modal with a short description, a "Made with" row of process chips and an "Enquire about this" button that goes to `/contact?product=<slug>`. 3 columns desktop, 1 mobile.
3. **Made with** (dark): short strip tying products back to the five processes, linking to `/services`.
4. **Custom work band** (mist): "Not listed? Send the drawing." with the primary CTA. Makes clear one-offs are welcome alongside production runs.
5. Closing CTA + footer.

### 9.4 About `/about`

1. **Page header**: "Thirty years of working with metal."
2. **Founder** (light): Vijay Rajbhar, 30+ years in the metal industry, large placeholder portrait slot, short paragraph. No invented biography details.
3. **The workshop** (dark): Tughlakabad Village location, one roof, what that means for buyers.
4. **Principles** (light): 3 to 4 numbered items (Q-Industrial benefits style) taken from the positioning: all processes under one roof, custom and production runs, fast turnaround, competitive pricing.
5. **Proof slot** (mist): empty module for certifications, client names and testimonials. **Render nothing until real data exists** (component returns null when `proof.ts` is empty).
6. Closing CTA + footer.

### 9.5 Contact `/contact`

1. **Compact dark page header**: "Send the drawing. Get a quote."
2. **Two-column layout** (light):
   - Left: quote form in a rounded white card. Fields: name, company, email, what you need (select of the services and product categories; preselect from the `?product=` query), material and thickness (optional), quantity, message. Large inputs (56px), `steel-200` borders, `spark` focus ring, inline validation, clear success and error states. Submits to `info@vijay-enterprises.com`.
   - Right (`ink` card): address (Tughlakabad Village, New Delhi 110020), email, workshop visit note, embedded map in a rounded window. **No phone number.**
3. File attachment for drawings is optional: only add if the form backend supports it. Otherwise say "Email your drawing to info@vijay-enterprises.com".
4. Footer.

### 9.6 404

Full dark screen, `display-xl` "Off the drawing.", primary button back home, secondary link to `/contact`.

### Global elements

- **SEO and metadata:** unique title and description per route, Open Graph image slot, `LocalBusiness` JSON-LD using only confirmed facts (name, address, email). No phone field.
- **Sitemap and robots:** generate `sitemap.xml` and `robots.txt` listing the five routes only.
- **Loading and focus states:** consistent skeletons and focus rings across pages.
- **Page transitions:** a short fade between routes, nothing heavier.

## 10. Responsiveness and Accessibility

- Mobile first. Display type scales via `clamp`. Hero text sits bottom-left on mobile with a darkening gradient for legibility.
- Nav pill becomes wordmark + menu button; numbered fullscreen menu.
- Image strip becomes a snap carousel; numbers go 2×2.
- WCAG AA contrast on all text, including text over images (use a `ink/60` gradient overlay where needed).
- All interactive elements keyboard reachable, 44px minimum touch target, visible focus ring.
- Alt text describes the process shown, never invents ownership.
- English only. No language toggle.
- Same heading hierarchy on every page: one `h1`, ordered `h2`/`h3`, landmark regions (`header`, `main`, `footer`, `nav`), skip-to-content link.

## 11. Copy Tone

Plain, direct, workshop-honest. Short sentences. Specs over adjectives. Say "Laser cutting up to 25 mm" rather than "state-of-the-art cutting". Delhi NCR only; never imply export or pan-India reach. Everything must be traceable to `PRODUCT.md`.

## 12. Implementation Notes for the Agent

**This is a full rebuild of the five routes above.** Work in the order below and finish each step before moving on. Do not keep any paper, grid, blueprint or drafting-frame styling anywhere in the codebase.

1. **Audit and clean:** list every route, layout and component in the repo. Delete the paper texture, grid backgrounds, drafting-frame wrappers, mono letter-spaced nav styling and any leftover placeholder content (Path Robotics copy, lorem testimonials, `your-factory-link.com`, the 614-816-1991 number).
2. **Foundation:** install `lenis`, `gsap` and `motion`; create a single `SmoothScroll` provider wired to GSAP's ticker; set up `Inter`, `Inter_Tight` and `JetBrains_Mono` via `next/font/google` in `app/layout.tsx` as `--font-inter`, `--font-inter-tight`, `--font-jetbrains`. Put tokens in `globals.css` under `@theme` (section 3). Do not hardcode hex values in components. Check each page against the Awwwards quality bar in section 1: if it reads as a template, rework it before moving on.
3. **Primitives:** `Preloader`, `Cursor`, `MagneticButton`, `SplitReveal`, `ScrollWords`, `Counter`, `PageTransition`, `ScrollProgress`, `Section`, `Eyebrow`, `PillButton`, `GlassCard`, `ImageWindow`, `NumberedRow`, `Marquee`, `PageHeader`, `SpecTable`, `StatRow`, `CategoryCard`, `Accordion`. (No breadcrumbs: there are no nested routes.)
4. **Global shell:** floating nav pill, fullscreen numbered mobile menu, footer, closing CTA band, 404, route transition.
5. **Data files:** `links.ts` (the nav array above), `services.ts`, `products.ts`, `machines.ts`, `site.ts` (name, address, email), `proof.ts` (empty arrays for certifications, clients, testimonials). Pages render from these so real content can be dropped in without touching layout.
6. **Pages in this order:** Home, Services, Products, About, Contact, 404. Delete any other existing routes (`/capacity`, `/privacy`, service or category subpages, etc.) so no dead pages remain.
7. **Motion pass:** implement the 16 signature moments in section 8, one at a time, testing each at 60fps and with reduced motion on.
8. **Polish:** metadata and JSON-LD, sitemap and robots, motion pass, reduced-motion handling, keyboard and contrast check, responsive check at 375, 768, 1280 and 1536 px.
9. **Verify against `PRODUCT.md`:** no unverified claims, no phone number, no e-commerce UI, no implied reach beyond Delhi NCR, no stock photo presented as the business's own.

Each section stays a self-contained component and every image slot uses a fixed aspect ratio with `object-cover`, so real photos replace placeholders without layout changes.
