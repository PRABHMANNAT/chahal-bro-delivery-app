# CHAHAL BROS — Complete UI Generation Prompts for Antigravity IDE

> **How to use**: Copy each prompt below and paste it into Antigravity IDE (or Claude). Each prompt generates one screen/component. Build them in order. After generating, review, tweak, and integrate into your Next.js project.

> **Model**: Use **Claude Opus 4.6** for full-page generation. Use **Claude Sonnet 4.6** for quick component tweaks.

---

## PROMPT 1 — SPLASH SCREEN

```
Build me a production-grade splash screen for "Chahal Bros" — a Blinkit-style quick commerce grocery delivery app.

TECH: Next.js 14 App Router + TypeScript + Tailwind CSS + Framer Motion

DESIGN DIRECTION: Bold, premium Indian grocery brand. Think Blinkit meets Swiggy Instamart but with a strong red + blue identity.

BRAND COLORS:
- Primary Red: #CC2222 (CTAs, brand mark)
- Primary Blue: #2299DD (secondary accents)
- Background: #FFFFFF to #FFFDF5 (warm cream-white)
- Text: #1A1A2E (near-black)

SPLASH SCREEN REQUIREMENTS:
1. Full viewport height, centered content
2. Background: warm cream-white (#FFFDF5) with a very subtle radial sunburst/rays pattern emanating from center (like the Chahal Bros logo background) — use CSS only, no images
3. Logo area: display the Chahal Bros "CB" monogram — for now use a placeholder div styled as a circle with "CB" text in red (C) and blue (B), 120px size
4. Below logo: "CHAHAL BROS" text — "CHAHAL" in red (#CC2222), "BROS" in blue (#2299DD), font: bold, tracking-wider, 28px
5. Below brand name: "Delivery in minutes" tagline in muted gray, 14px

ANIMATIONS (Framer Motion):
- Logo fades in + scales from 0.85 → 1.0 over 1.2s with a spring bounce
- Brand name slides up from 20px below with 0.3s delay
- Tagline fades in with 0.6s delay
- Subtle pulse glow behind logo (CSS box-shadow animation)
- After 3 seconds total, the entire screen fades out and calls router.push('/login')

QUALITY:
- Smooth 60fps animations
- No layout shift or flicker
- Works perfectly on mobile (375px) and desktop (1440px)
- Add a subtle loading bar at the very bottom that fills left-to-right over 3 seconds (thin 2px line, red gradient)

Give me the complete page component as a single file. Use 'use client' directive. Import framer-motion.
```

---

## PROMPT 2 — LOGIN / OTP PAGE

```
Build me a production-grade Login + OTP verification page for "Chahal Bros" grocery delivery app.

TECH: Next.js 14 App Router + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui components

BRAND SYSTEM:
- Red: #CC2222 (primary CTA buttons)
- Blue: #2299DD (links, info elements)
- Background: #F8F9FC (very light cool gray)
- Cards: #FFFFFF with shadow-sm and border border-gray-100
- Text Primary: #1A1A2E
- Text Muted: #6B7280
- Font: Use "Plus Jakarta Sans" from Google Fonts (import via next/font/google or CDN link)

PAGE LAYOUT:
- Mobile-first, max-w-md centered on desktop
- On desktop: split layout — left 55% shows a decorative brand illustration area (red/blue gradient mesh background with floating grocery icons as emoji: 🌾🍚🫘🧈🌶️ scattered with CSS animations), right 45% has the login card
- On mobile: full-screen card with brand header above

LOGIN CARD (State 1 — Phone/Email Entry):
1. Top: Chahal Bros "CB" logo mark (placeholder circle, C in red B in blue) + "CHAHAL BROS" brand text
2. Heading: "Welcome back!" (24px, bold) + "Order groceries delivered to your door" (14px, muted)
3. Toggle tabs: "Phone" | "Email" — pill-style toggle, active = red bg white text, inactive = gray bg
4. Phone mode: "+91" prefix badge (gray bg, rounded-l) + phone input (rounded-r), 10 digits max
5. Email mode: standard email input with mail icon
6. "Send OTP" button: full-width, red (#CC2222), rounded-xl, 48px height, bold white text, hover: darken, active: scale(0.98), disabled state when input empty
7. Bottom: "By continuing, you agree to our Terms & Privacy Policy" in 12px muted text
8. Subtle floating animation on the grocery emojis in background

OTP CARD (State 2 — OTP Verification, animate-in when OTP sent):
1. Back arrow button (top left) to go back to phone entry
2. Heading: "Verify OTP" + "We sent a 6-digit code to +91 98XXXXX90" (masked number)
3. 6 individual square input boxes (48x48px each, border, centered text, 24px font):
   - Auto-focus first box on mount
   - Auto-advance to next box on digit entry
   - Auto-submit when all 6 filled
   - Backspace goes to previous box and clears
   - Paste support (paste full 6-digit code and it fills all boxes)
4. Resend timer: "Resend OTP in 0:45" countdown, when reaches 0 shows "Resend OTP" link in blue
5. "Verify & Continue" button: same red CTA style, shows loading spinner when verifying
6. Error state: boxes shake animation + red border if wrong OTP

TRANSITIONS:
- Login → OTP: card content slides left out, OTP slides in from right (framer-motion AnimatePresence)
- All inputs have focus ring in blue (#2299DD)
- Button has subtle gradient: linear-gradient(135deg, #CC2222, #E03030)
- Success: green checkmark animation before redirect

RESPONSIVE:
- Mobile: single column, card takes full width with 16px padding
- Tablet+: centered card with max-w-md, decorative left panel visible
- Input sizes comfortable for thumb tapping (min 48px touch targets)

ACCESSIBILITY:
- All inputs labeled properly
- Tab navigation works correctly through OTP boxes
- Loading states announced to screen readers

NOTE: Don't implement actual Supabase auth calls — just use placeholder async functions like `sendOTP(phone)` and `verifyOTP(phone, code)` that I'll replace later. Include toast notifications (react-hot-toast) for success/error states.

Give me the complete single-file page component with all states, animations, and responsive design.
```

---

## PROMPT 3 — PROFILE SETUP / ONBOARDING

```
Build me a profile setup / onboarding page for "Chahal Bros" grocery delivery app. This is shown after first-time OTP verification.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui

BRAND: Red #CC2222, Blue #2299DD, BG #F8F9FC, Cards white, Text #1A1A2E, Font: Plus Jakarta Sans

LAYOUT: Mobile-first centered card (max-w-lg on desktop)

FORM DESIGN — Single scrollable card with sections:
1. Header: "Complete your profile" (24px bold) + "Help us deliver to the right place" (muted)
2. Avatar: circular placeholder with camera icon overlay, tap to hypothetically upload (just show UI)
3. Full Name input with User icon
4. Phone Number (pre-filled, read-only with lock icon, gray bg)
5. Email input with Mail icon
6. DELIVERY ADDRESS SECTION:
   - Section header: "Delivery Address" with MapPin icon
   - Address type selector: 3 pill buttons — "🏠 Home" "🏢 Office" "📍 Other" (active = red outline)
   - Full address textarea (3 rows, placeholder: "House no, Building, Street, Area...")
   - Landmark input (optional, placeholder: "Near...")
   - Pincode input (6 digits, auto-fetches city/state display below it)
   - City + State shown as read-only badges below pincode
   - A small embedded map preview box (gray placeholder with MapPin icon centered, 200px height, rounded-xl) — just the UI shell, not actual Google Maps
7. "Save & Start Ordering →" button: full-width red CTA, rounded-xl

DESIGN DETAILS:
- Each input: h-12, rounded-xl, border-gray-200, focus:ring-2 ring-blue-400, icon inside left
- Inputs appear with staggered fade-up animation (framer-motion, 0.05s delay each)
- Form sections separated by thin gray divider lines
- Progress indicator at top: 3 dots showing step 2 of 3 (step 1=OTP, step 2=profile, step 3=done)
- On submit: button shows loading spinner, then green check + "Welcome to Chahal Bros!" toast, then redirect

RESPONSIVE: Full-width on mobile with 16px padding, centered card with shadow on desktop

Give me the complete single-file component.
```

---

## PROMPT 4 — CUSTOMER HOME SCREEN (Most Important Page)

```
Build me a production-grade customer home screen for "Chahal Bros" — a Blinkit/Zepto-style grocery delivery app. THIS IS THE MOST IMPORTANT SCREEN — make it pixel-perfect, premium, and fast.

TECH: Next.js 14 App Router + TypeScript + Tailwind CSS + Framer Motion + Lucide React icons

BRAND:
- Red: #CC2222 (CTAs, badges, brand)
- Blue: #2299DD (links, info)
- BG: #F5F7FA
- Cards: #FFFFFF
- Text: #1A1A2E (primary), #6B7280 (secondary)
- Success Green: #22C55E (in stock, discounts)
- Font: "Plus Jakarta Sans"

FULL PAGE LAYOUT (top to bottom):

1. TOP BAR (sticky, white bg, shadow-sm on scroll):
   - Left: MapPin icon (red) + delivery address text (truncated 1 line, bold area name + ">" arrow) — e.g. "📍 Sarabha Nagar, Ludhiana >"
   - Right: notification bell icon with red dot badge
   - Below address bar: Search input (full width, rounded-2xl, h-12, gray bg #F0F2F5, placeholder: "Search for atta, rice, dal, ghee..." with Search icon)

2. CATEGORY CAROUSEL (horizontal scroll, no scrollbar):
   - Pill-shaped chips: icon/emoji + label
   - Categories: "🌾 Atta & Flour", "🍚 Rice & Grains", "🫘 Dal & Pulses", "🧈 Oils & Ghee", "🌶️ Spices", "🍪 Snacks", "🥤 Beverages", "🧹 Household", "🧴 Personal Care", "🥛 Dairy"
   - Default: first chip active (red bg, white text), rest: white bg, gray border, dark text
   - Clicking a chip "filters" (just UI state, highlight active)
   - Smooth horizontal scroll with momentum, hidden scrollbar
   - Each chip: px-4 py-2, rounded-full, text-sm font-medium, gap-1.5 between icon and text

3. PROMOTIONAL BANNER CAROUSEL:
   - Auto-sliding banners (3 banners, 4-second interval)
   - Each banner: rounded-2xl, 160px height mobile / 200px desktop, full-width
   - Banner 1: Red gradient bg → "Get 20% OFF on first order! Use code CHAHAL20" with grocery illustration (just use a pattern/gradient)
   - Banner 2: Blue gradient bg → "Free delivery on orders above ₹299"
   - Banner 3: Red-to-orange gradient → "Fresh Atta, Rice & Dal — delivered in 30 min"
   - Dot indicators below (active = red, inactive = gray, 8px circles)
   - Swipeable on mobile (touch drag)

4. SECTION: "Shop by Category" — 2-row grid of category cards:
   - Each card: 80px square, white bg, rounded-xl, subtle shadow, emoji icon (40px) centered above label (12px, medium)
   - 5 per row on mobile scroll, grid on desktop
   - Cards: Atta (🌾), Rice (🍚), Dal (🫘), Oil (🧈), Spices (🌶️), Sugar (🍬), Snacks (🍪), Drinks (🥤), Dairy (🥛), Household (🧹)

5. SECTION: "Bestsellers" — Product grid:
   - Heading: "🔥 Bestsellers" with "See all >" link on right
   - Product cards in 2-column grid on mobile, 4-column on desktop
   
   PRODUCT CARD DESIGN (this is critical, make it beautiful):
   - White card, rounded-2xl, border border-gray-100, overflow-hidden
   - Top: product image area (square 1:1 ratio, light gray bg #F5F7FA, centered product placeholder — use a colored rounded rectangle with product initial letter for now)
   - Discount badge: top-left corner, green (#22C55E) pill badge "15% OFF" (if applicable)
   - Below image area (padding 12px):
     - Product name: 14px, font-semibold, text-gray-800, 2-line clamp (line-clamp-2)
     - Weight/quantity: 12px, text-gray-500 (e.g., "5 kg" or "1 L")
     - Price row: "₹240" in 16px bold #1A1A2E + "₹280" in 12px line-through text-gray-400 + spacing
     - ADD button: full-width at card bottom, h-9, rounded-lg, border-2 border-red-500, text-red-500 "ADD", font-bold
     - ON CLICK "ADD": button transforms into quantity stepper: [-] count [+] — red bg white text, smooth width transition
       - Minus button: if count becomes 0, revert to "ADD" button
       - Plus button: increment count
       - Counter centered between buttons
       - Animate the transition between ADD and stepper (scale + fade)

   SAMPLE PRODUCTS (use these for demo data):
   - Aashirvaad Atta 5kg — ₹240, MRP ₹280, 15% off
   - India Gate Basmati Rice 5kg — ₹420, MRP ₹480, 13% off
   - Tata Salt 1kg — ₹28, MRP ₹28, no discount
   - Fortune Sunflower Oil 1L — ₹135, MRP ₹160, 16% off
   - MDH Garam Masala 100g — ₹85, MRP ₹95, 11% off
   - Maggi Noodles Pack of 12 — ₹168, MRP ₹192, 13% off
   - Amul Butter 500g — ₹270, MRP ₹290, 7% off
   - Parle-G Biscuits 800g — ₹80, MRP ₹90, 11% off

6. SECTION: "Daily Essentials" — another product row (horizontal scroll on mobile, grid on desktop)
   Use: Chana Dal 1kg, Moong Dal 1kg, Sugar 5kg, Mustard Oil 1L

7. BOTTOM NAVIGATION BAR (fixed, white bg, top border, shadow-up):
   - 5 tabs with Lucide icons: Home (House), Search (Search), Cart (ShoppingCart), Orders (Package), Profile (User)
   - Active tab: red icon + red label (12px), inactive: gray icon + gray label
   - Cart tab: if items in cart, show red circle badge with count (top-right of icon)
   - Safe area padding for mobile bottom

8. CART FLOATING BAR (appears above bottom nav when cart has items):
   - Full-width sticky bar with mx-4 margin, rounded-2xl, red gradient bg (#CC2222 → #E03030)
   - Left: "X items" + "|" + "₹XXX" in white bold
   - Right: "View Cart →" in white bold
   - Slide-up animation when first item added, slide-down when cart emptied
   - Slight shadow-xl for elevation

MICRO-INTERACTIONS & ANIMATIONS:
- Page loads with staggered fade-up: top bar → categories → banner → products (0.1s delay each)
- Product cards: subtle scale(1.02) on hover (desktop)
- Category chips: smooth scroll with CSS scroll-snap
- Banner: CSS animation slide with ease-in-out
- Cart badge: bounce animation when count changes
- Skeleton loading state: gray shimmer blocks matching each section's shape while "loading"

RESPONSIVE BREAKPOINTS:
- Mobile (<640px): single column, 2-col product grid, full-width sections
- Tablet (640-1024px): 3-col product grid, wider banners
- Desktop (>1024px): max-w-6xl centered, 4-col product grid, top bar becomes wider with more breathing room

IMPORTANT NOTES:
- Use React state for cart (simple useState with items array for now)
- All images are placeholders — use colored rectangles with first letter of product name
- Make it FEEL like a real Blinkit/Zepto app — fast, clean, and delightful
- The "ADD" → quantity stepper animation is the signature interaction, make it butter-smooth
- No actual API calls — all data is hardcoded in-component

Give me the COMPLETE single-file page component with all sections, responsive design, animations, and interactions working. This should be the most polished screen in the entire app.
```

---

## PROMPT 5 — PRODUCT DETAIL PAGE

```
Build me a product detail page for "Chahal Bros" grocery app.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Lucide icons
BRAND: Red #CC2222, Blue #2299DD, BG #F5F7FA, Font: Plus Jakarta Sans

ROUTE: /product/[id] — dynamic route

LAYOUT (mobile-first, single column scrollable):

1. TOP: Back arrow + "Product Details" header + Share icon (right)

2. IMAGE SECTION:
   - Large square image area (full-width, max 400px height), light gray bg
   - Placeholder: large colored circle with product initial
   - Swipe dots below (for multiple images — show 3 dots, first active)
   - Discount badge overlay: top-left, green pill "15% OFF"

3. PRODUCT INFO:
   - Brand name in small blue text (12px, uppercase tracking-wide)
   - Product name: 20px, bold, #1A1A2E
   - Weight/variant selector: horizontal pill buttons — "1 kg" "5 kg" "10 kg" — active = red border + light red bg, inactive = gray border
   - Each variant shows its own price below when selected
   - Price section: "₹240" in 28px bold + "₹280" in 16px line-through gray + green "15% OFF" text badge
   - Stock status: green dot + "In Stock" text (or red dot + "Out of Stock")

4. DELIVERY INFO CARD (gray bg rounded card):
   - "⚡ Express Delivery" + "Get it in 25-30 minutes" 
   - "🆓 Free delivery on orders above ₹299"

5. DESCRIPTION SECTION (expandable):
   - "Product Details" heading
   - Collapsed: 3 lines with "Read more" link
   - Expanded: full description text with "Read less"
   - Info grid: 2x2 cards showing Weight, Brand, Category, Shelf Life

6. SIMILAR PRODUCTS (horizontal scroll):
   - "You may also like" heading
   - Horizontal scroll of small product cards (140px wide), same card style as home page but smaller
   - 4-6 sample products

7. STICKY BOTTOM BAR:
   - Left half: quantity stepper ([-] count [+]) with rounded design
   - Right half: "Add to Cart — ₹240" red CTA button, rounded-xl
   - If already in cart: button says "Update Cart — ₹480" with updated total
   - White bg, top shadow, safe-area padding

ANIMATIONS:
- Image fade-in on load
- Variant pills: smooth color transition on select
- Description expand: smooth height animation
- Bottom bar: slide-up on mount
- Add to cart: button briefly shows checkmark then reverts

Give me the complete single-file component with sample data for "Aashirvaad Atta" as the default product.
```

---

## PROMPT 6 — SEARCH & FILTER PAGE

```
Build a search and browse page for "Chahal Bros" grocery delivery app.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Lucide icons
BRAND: Red #CC2222, Blue #2299DD, BG #F5F7FA, Font: Plus Jakarta Sans

LAYOUT:

1. SEARCH BAR (sticky top):
   - Auto-focused input, rounded-2xl, h-12, with Search icon left and X clear button right
   - Placeholder: "Search for atta, rice, dal..."
   - On type: show debounced results (300ms) from hardcoded product array
   - Recent searches pills below input (if no query typed): "Atta", "Rice", "Ghee", "Sugar"

2. FILTER BAR (below search, horizontal scroll):
   - Filter pills: "Sort ↕️" "Category" "Price" "Brand" "In Stock Only"
   - Tapping "Sort" opens bottom sheet with options: Price Low→High, Price High→Low, Popularity, Newest
   - Tapping "Category" opens bottom sheet with checkbox list of categories
   - Tapping "Price" opens bottom sheet with range slider ₹0 - ₹1000
   - Active filters show count badge on pill + red color
   - "In Stock Only" is a simple toggle pill

3. RESULTS GRID:
   - 2-col mobile, 3-col tablet, 4-col desktop
   - Reuse same product card design from home screen (with ADD/stepper)
   - Result count: "24 products found" text above grid

4. EMPTY STATE (when search has no results):
   - Centered illustration area (large 🔍 emoji or empty box illustration)
   - "No products found" heading
   - "Try searching for something else" subtext
   - "Browse Categories" blue link

5. BOTTOM SHEETS (for filters):
   - Overlay: black/30 backdrop
   - Sheet slides up from bottom, white bg, rounded-t-2xl, drag handle bar at top
   - Sheet content: filter options
   - "Apply" red CTA button at bottom of sheet
   - "Clear" text button to reset

SKELETON LOADING: shimmer blocks while "searching"

Use hardcoded product data array (12-15 products with categories, prices, brands).
Complete single-file component.
```

---

## PROMPT 7 — CART & CHECKOUT PAGE

```
Build cart and checkout pages for "Chahal Bros" grocery delivery app.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Lucide icons
BRAND: Red #CC2222, Blue #2299DD, BG #F5F7FA, Font: Plus Jakarta Sans

TWO VIEWS IN ONE FILE (toggle via state or tabs):

=== CART VIEW ===

1. HEADER: "My Cart" + item count badge

2. DELIVERY ADDRESS BAR (tappable card):
   - MapPin icon + address text (1 line truncated) + "Change" button in blue
   - Small "Delivery in 25-30 min" text with ⚡ icon

3. CART ITEMS LIST:
   - Each item row: product image (60x60 placeholder), product name + weight, quantity stepper ([-] N [+]) on right side, item price below stepper (₹XXX), swipe-left to reveal red "Remove" button (or just an X icon)
   - Divider between items
   - If cart empty: empty cart illustration + "Your cart is empty" + "Start Shopping" red CTA

4. COUPON SECTION:
   - Ticket/tag icon + "Apply Coupon" text + ">" arrow (tappable)
   - On tap: expand to show input field + "Apply" button
   - Applied state: green text "CHAHAL20 applied — ₹48 saved!" with X to remove
   - Sample coupon: "CHAHAL20" gives 20% off max ₹100

5. BILL DETAILS CARD (white bg, rounded-xl, divide-y):
   - Items Total: ₹XXX
   - Delivery Fee: "₹25" or "FREE" (green, if above ₹299)
   - GST (5%): ₹XX
   - Coupon Discount: -₹XX (green, only if applied)
   - Thick divider
   - Grand Total: ₹XXX (bold, 18px)

6. STICKY BOTTOM BAR:
   - Grand total on left (bold)
   - "Proceed to Checkout →" red CTA on right
   - Or full-width button with total inside it

=== CHECKOUT VIEW (slides in from right) ===

1. HEADER: back arrow + "Checkout"

2. DELIVERY ADDRESS CARD:
   - Full address displayed with MapPin icon
   - "🏠 Home" badge
   - "Change" link

3. PAYMENT METHOD SELECTION:
   - Radio-style cards (one selectable at a time):
   - Card 1: "💳 Pay Online (UPI, Cards, Netbanking)" — Razorpay badge — recommended tag
   - Card 2: "💵 Cash on Delivery" — note: "Pay ₹XXX to delivery partner"
   - Selected card: red border + light red bg, unselected: gray border

4. ORDER SUMMARY (collapsible):
   - "X items" + total + "See details ▼"
   - Expanded: item list with names, quantities, prices

5. BOTTOM: "Place Order — ₹XXX" full-width red CTA
   - On click: loading state → success animation (green check) → redirect to order tracking

SAMPLE CART DATA:
- Aashirvaad Atta 5kg × 1 = ₹240
- India Gate Rice 5kg × 1 = ₹420
- Fortune Oil 1L × 2 = ₹270
- Tata Salt 1kg × 1 = ₹28

Complete single-file component with both views, all interactions, and smooth transitions.
```

---

## PROMPT 8 — ORDER TRACKING PAGE (Real-time)

```
Build an order tracking page for "Chahal Bros" grocery delivery app.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Lucide icons
BRAND: Red #CC2222, Blue #2299DD, BG #F5F7FA, Font: Plus Jakarta Sans

ROUTE: /orders/[id]

LAYOUT:

1. HEADER: back arrow + "Order #CB2024001" + help icon

2. LIVE STATUS CARD (white, rounded-2xl, prominent):
   - Current status in large text: "Out for Delivery" (or whatever stage)
   - Animated illustration placeholder: a pulsing blue circle with delivery truck emoji 🚚
   - ETA: "Arriving in ~12 minutes" (bold, 20px)

3. ORDER TIMELINE (vertical stepper):
   - Each step: colored dot (left) + connector line + label + timestamp (right)
   - Steps:
     a. ✅ Order Placed — 2:30 PM (green dot, completed)
     b. ✅ Order Confirmed — 2:31 PM (green dot, completed)
     c. ✅ Being Packed — 2:35 PM (green dot, completed)
     d. ✅ Assigned to Delivery Partner — 2:40 PM (green dot, completed)
     e. 🔵 Out for Delivery — 2:45 PM (blue pulsing dot, CURRENT — this step has animated pulse ring)
     f. ⬜ Delivered — (gray dot, pending)
   - Connector line: green for completed sections, dashed gray for upcoming
   - Current step: blue dot with expanding pulse ring animation (like a radar ping)

4. DELIVERY PARTNER CARD (appears after "Assigned" status):
   - Round avatar placeholder + partner name "Ravi Kumar"
   - "Your Delivery Partner" label
   - Two action buttons: 📞 "Call" (blue outline) + 📍 "Track on Map" (red outline)
   - Rating: ⭐ 4.8 badge

5. ORDER DETAILS (expandable card):
   - "Order Details ▼" — tap to expand
   - Items list with quantities and prices
   - Bill summary (same format as cart page)
   - Payment method badge: "💳 Paid via UPI" or "💵 Cash on Delivery"

6. CANCEL ORDER (only if status < out_for_delivery):
   - "Cancel Order" red text link at bottom
   - Tap: confirmation modal — "Are you sure?" with "Yes, Cancel" red button and "Keep Order" outline button

LIVE UPDATE SIMULATION:
- Use a useEffect with setTimeout to simulate status progression:
  - Start at "Order Placed"
  - After 3s → "Confirmed"
  - After 3s → "Being Packed"
  - After 4s → "Assigned"
  - After 3s → "Out for Delivery"
  - After 5s → "Delivered" with confetti animation 🎉
- Each transition: green dot animation + timestamp appears + next step activates

ANIMATIONS:
- Timeline steps fade in progressively
- Current step: continuous pulse animation
- Status text: typewriter or fade-swap effect on change
- Delivered: confetti burst (use simple CSS confetti animation) + "Order Delivered!" celebration screen

Complete single-file component with live status simulation.
```

---

## PROMPT 9 — ORDER HISTORY PAGE

```
Build an order history page for "Chahal Bros" grocery delivery app.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Lucide icons
BRAND: Red #CC2222, Blue #2299DD, BG #F5F7FA, Font: Plus Jakarta Sans

LAYOUT:

1. HEADER: "My Orders" title

2. FILTER TABS (horizontal): "All" "Active" "Delivered" "Cancelled" — underline style, active = red underline + red text

3. ORDER CARDS (list):
   Each card (white, rounded-xl, padding, mb-3):
   - Top row: "Order #CB2024001" (bold) + date "Mar 15, 2026" (right, muted)
   - Status badge: pill badge — "Delivered" green bg, "Out for Delivery" blue bg, "Cancelled" red bg
   - Items preview: "Aashirvaad Atta 5kg, India Gate Rice... +2 more" (1 line, truncated)
   - Bottom row: "₹958" total (bold) + "Reorder" red outline button (right)
   - Tap anywhere on card → navigate to order detail

   SAMPLE ORDERS: 5-6 orders with different statuses and dates

4. EMPTY STATE (when filter shows no results):
   - Package emoji illustration
   - "No orders yet" heading
   - "Start shopping to see your orders here" subtext
   - "Browse Products" red CTA

REORDER BUTTON: On click, shows toast "Items added to cart!" with green check.

Complete single-file component.
```

---

## PROMPT 10 — ADMIN DASHBOARD

```
Build a complete admin dashboard for "Chahal Bros" grocery delivery app.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Lucide icons + Recharts (for charts)
BRAND: Sidebar dark #1A1A2E, Active accent #CC2222, Content BG #F5F7FA, Cards white, Font: Plus Jakarta Sans

LAYOUT — Desktop-first (admin is primarily used on desktop):

1. SIDEBAR (fixed left, 260px width, dark bg #1A1A2E):
   - Top: "CB" logo mark (red C, blue B, small) + "CHAHAL BROS" text + "Admin" badge
   - Nav items with Lucide icons:
     - 📊 Dashboard (active: red left border + light red bg + red icon)
     - 📦 Products
     - 📂 Categories
     - 🛒 Orders
     - 🚚 Delivery Partners
     - 🎯 Promotions
     - 📈 Analytics
     - ⚙️ Settings
   - Active item: left-4 red border, bg-white/10, text-white
   - Inactive: text-gray-400, hover:text-white hover:bg-white/5
   - Bottom: admin name + avatar + logout button
   - Mobile: hamburger menu, sidebar as overlay from left

2. TOP BAR (sticky):
   - Left: page title "Dashboard"
   - Right: search icon + notification bell (red badge) + admin avatar
   - White bg, bottom border

3. DASHBOARD CONTENT:

   a. STATS CARDS (4 cards in a row):
      - Today's Orders: 47 (+12% from yesterday) — Package icon, blue accent
      - Today's Revenue: ₹24,580 (+8%) — IndianRupee icon, green accent
      - Active Delivery Partners: 5/8 online — Truck icon, orange accent
      - Pending Orders: 12 — Clock icon, red accent
      - Each card: white bg, rounded-xl, left colored border (4px), icon in colored circle, main number big + bold, comparison text small green/red

   b. REVENUE CHART (Recharts line chart):
      - Title: "Revenue — Last 30 Days"
      - Line chart with area fill gradient (red to transparent)
      - X-axis: dates, Y-axis: revenue in ₹
      - Tooltip on hover showing date + exact amount
      - Sample data: generate 30 days of random revenue ₹15k-₹30k

   c. RECENT ORDERS TABLE:
      - Title: "Recent Orders" + "View All →" link
      - Table columns: Order ID, Customer, Items, Total, Status, Time
      - 8-10 sample rows with alternating light row shading
      - Status badges: colored pills (Placed=yellow, Confirmed=blue, Out=purple, Delivered=green, Cancelled=red)
      - Responsive: becomes card list on mobile

   d. TOP SELLING PRODUCTS (horizontal bar chart or simple ranked list):
      - Top 5 products with bar showing sales count
      - Product name + units sold

4. ORDERS PAGE (when "Orders" nav clicked — can be a separate state/tab):
   - Filter bar: status dropdown, date range picker, search by customer name
   - Full orders table with all columns
   - Click order → slide-in detail panel from right showing full order info

5. PRODUCTS PAGE (when "Products" nav clicked):
   - "Add Product" red CTA button top-right
   - Products table: image thumbnail, name, category, price, stock, status, actions (edit/delete)
   - Search + category filter
   - Product form modal/page: name input, description textarea, category dropdown, image upload dropzone (drag & drop area with dashed border), variant rows (size + MRP + price, add row button), stock quantity, in-stock toggle, save button

MAKE IT FEEL: Clean, data-rich, professional — like a modern SaaS admin panel. Think Linear/Notion meets Shopify admin.

Use sample/hardcoded data throughout. Show at least the Dashboard view fully and indicate navigation state changes for other pages.

Complete single-file component (use state to toggle between pages, or render everything scrollable with clear sections).
```

---

## PROMPT 11 — DELIVERY PARTNER INTERFACE

```
Build the delivery partner interface for "Chahal Bros" grocery delivery app.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Lucide icons
BRAND: Red #CC2222, Blue #2299DD, Green #22C55E, BG #F5F7FA, Font: Plus Jakarta Sans

This is a MOBILE-FIRST interface (delivery partners use phones). Max-width 480px centered on desktop.

LAYOUT:

1. TOP BAR:
   - Left: "Chahal Bros" text (small) + "Delivery" badge
   - Right: Online/Offline toggle switch — green when online, gray when offline
   - When toggling offline: "You're offline. You won't receive new orders." overlay message

2. STATS CARDS (3 cards in a row):
   - Today's Deliveries: 8 (with Package icon)
   - Earnings: ₹640 (with IndianRupee icon)
   - Avg Rating: 4.8 ⭐ (with Star icon)
   - Cards: white, rounded-xl, compact

3. AVAILABLE ORDERS FEED (main content when no active delivery):
   - Section title: "🔔 Available Orders" + count badge
   - Animated new-order indicator: pulsing ring when new order appears
   
   ORDER CARDS (stacked list):
   Each card: white bg, rounded-xl, left border accent (amber #F59E0B)
   - Top: "Order #CB2024015" + "2 min ago" timestamp
   - Customer area: "📍 Sarabha Nagar" (bold area name)
   - Items: "5 items" + "₹958" order value
   - Distance: "📏 2.3 km away"
   - BIG CTA BUTTON: "PICK THIS ORDER" — full-width, green (#22C55E) bg, white bold text, h-12, rounded-xl
   - On click: button shows brief loading, then CARD ANIMATES OUT (scale down + fade) and view switches to Active Delivery

   Show 3-4 sample available orders

4. ACTIVE DELIVERY VIEW (replaces feed when an order is picked):
   - Status bar at top: "🟢 Active Delivery" with order ID
   
   CUSTOMER INFO CARD:
   - Customer name: "Priya Sharma" (large, bold)
   - Phone: "📞 +91 98765-43210" (tap to call — just href tel:)
   - Address: "📍 House 123, Sarabha Nagar, Near Gurudwara, Ludhiana" (tap to open maps — just href to Google Maps)
   - Map placeholder: gray box 150px with MapPin icon
   
   ORDER ITEMS CARD:
   - Expandable list of items: "Aashirvaad Atta 5kg × 1", "India Gate Rice × 1", etc.
   - Total: "₹958"
   - Payment badge: "💵 Cash on Delivery — Collect ₹958" (prominent amber badge) OR "💳 Paid Online" (green badge)
   
   STATUS PROGRESSION BUTTONS (vertical stack, big thumb-friendly):
   - Current action button is prominent, previous are green checkmarks
   
   State 1 (just picked): 
   → Big button: "📦 PICKED UP FROM STORE" (blue bg, white text, full-width, h-14)
   
   State 2 (picked up):
   → ✅ Picked Up (green, small, done)
   → Big button: "🚚 OUT FOR DELIVERY" (blue bg)
   
   State 3 (out for delivery):
   → ✅ Picked Up
   → ✅ Out for Delivery
   → Big button: "✅ MARK AS DELIVERED" (green bg, h-14, bold)
   
   On "MARK AS DELIVERED" click:
   - Confirmation modal: "Confirm delivery to Priya Sharma?" with "Yes, Delivered ✅" green button and "Cancel" outline button
   - On confirm: success animation (checkmark + confetti), then redirect back to available orders feed
   - Toast: "Delivery completed! +₹80 earned"

5. DELIVERY HISTORY (accessible via bottom nav):
   - List of past deliveries: date, time, customer area, order value, "₹80 earned" tag
   - Earnings summary at top: "This Week: ₹3,200" / "This Month: ₹12,400"

6. BOTTOM NAVIGATION:
   - 4 tabs: Home (House), Active (Navigation icon), History (Clock), Profile (User)
   - Active tab: red icon + label

CRITICAL INTERACTION — ORDER CLAIMING SIMULATION:
- When "PICK THIS ORDER" is clicked on any order card:
  - The clicked card gets green border + "Claimed by you!" badge
  - OTHER order cards show "Assigned to Ravi K." gray overlay text and their Pick buttons become disabled/grayed
  - After 1s, the claimed order expands into Active Delivery view
  - This simulates the real-time behavior where when one partner picks, others see it update

ANIMATIONS:
- Available orders: stagger fade-in on load
- New order: slide-in from top with attention-grabbing pulse
- Pick button: satisfying press animation (scale 0.95)
- Status progression: each completed step gets checkmark with confetti micro-burst
- Card removal: scale + fade out when other partner claims

Make all buttons LARGE and thumb-friendly (min h-12, preferably h-14 for primary actions). Delivery partners use this while standing/walking.

Complete single-file component with all views and state transitions.
```

---

## PROMPT 12 — CUSTOMER PROFILE PAGE

```
Build a customer profile/settings page for "Chahal Bros" grocery delivery app.

TECH: Next.js 14 + TypeScript + Tailwind CSS + Lucide icons
BRAND: Red #CC2222, Blue #2299DD, BG #F5F7FA, Font: Plus Jakarta Sans

LAYOUT (mobile-first):

1. PROFILE HEADER:
   - Large avatar circle (80px, gray placeholder with user initial)
   - Name: "Adhiraj Singh" (20px bold)
   - Phone: "+91 98765-43210" (muted)
   - "Edit Profile" blue link

2. SAVED ADDRESSES SECTION:
   - Title: "Saved Addresses" + "+ Add New" link
   - Address cards: 🏠 Home — "House 123, Sarabha Nagar..." with Edit and Delete icons
   - 🏢 Office address card
   - Default badge on one card

3. MENU ITEMS (list with chevron right):
   - 📦 My Orders → (navigate to orders)
   - 💰 Wallet & Coupons → (with balance badge "₹120")
   - 🌐 Language: English → (with current language shown)
   - 🌙 Dark Mode → (toggle switch)
   - 🔔 Notifications → (toggle switch)
   - 📞 Help & Support →
   - ℹ️ About Chahal Bros →
   - ⭐ Rate Us →
   - 🚪 Logout (red text)

4. APP INFO at bottom: "Version 1.0.0" + "Made with ❤️ in Ludhiana"

Clean, simple settings page. Complete single-file component.
```

---

## HOW TO INTEGRATE ALL SCREENS

After generating all screens individually, use this prompt to wire them together:

```
I have generated all individual screen components for my "Chahal Bros" Next.js 14 delivery app. Help me wire them together:

1. Create the Next.js App Router folder structure with route groups:
   - (public): /login, /onboarding (no auth required)
   - (customer): /home, /product/[id], /search, /cart, /checkout, /orders, /orders/[id], /profile
   - (admin): /admin, /admin/products, /admin/orders, /admin/delivery-partners, /admin/analytics, /admin/settings
   - (delivery): /delivery, /delivery/active, /delivery/history, /delivery/profile

2. Create layout.tsx files for each route group:
   - (customer)/layout.tsx: bottom navigation bar
   - (admin)/layout.tsx: sidebar navigation
   - (delivery)/layout.tsx: delivery bottom navigation
   - Root layout.tsx: Plus Jakarta Sans font, Tailwind, global styles, Toaster provider

3. Create a simple auth context/provider that:
   - Stores current user role (customer/admin/delivery)
   - Redirects to correct dashboard based on role
   - Provides currentUser object to all pages

4. Create the global Zustand cart store with: items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount

5. Create a shared types.ts file with TypeScript interfaces for: Product, CartItem, Order, User, Address, Category

Give me the folder structure + all layout/config files + store + types. Don't regenerate the page components — just show how to import and route them.
```

---

> **TIP**: After each prompt, review the generated code in Antigravity IDE's preview. Tweak colors, spacing, and text directly. Then move to the next prompt. Build screen by screen — don't try to generate the entire app in one shot.
