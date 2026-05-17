# AxiPays -Checkout & Dashboard 💳📈

Hello! 👋 I am excited to share **AxiPays**—A real-world web application project as a fresher developer! 

This project combines a **secure credit card checkout form** and an **interactive analytics dashboard**. I spent a lot of time getting the animations, data masking, and APIs to work smoothly together. 

Here is everything about how this project is built, the code structure, the transaction flow, and what I learned along the way!

---

## 🛠️ Built With & Dependencies
To run this project, these are the core dependencies I installed:
*   **React (v19.2.0)** - For building the dynamic user interface.
*   **Vite (v7.2.4)** - The developer build tool (it is super fast compared to CRA!).
*   **Recharts (v3.8.1)** - For displaying beautiful Status Breakdowns, Currency Distributions, and Volume Trends.
*   **Lucide React (v1.16.0)** - For the neat icons across the form and dashboard.
*   **CryptoJS (v4.2.0)** - Used to calculate secure HMAC-SHA256 request headers to prevent payment tampering.
*   **Pure CSS** - Builted from scratch to master standard layouts, custom responsive breakpoints, and smooth entrance scroll transitions.

---

## 💻 How to Run it Locally

### Prerequisites
Make sure you have **Node.js** installed on your system. You can verify this by opening your terminal and running:
```bash
node -v
```

### Setup Steps
1. **Navigate into the directory:**
   ```bash
   cd my_axi
   ```
2. **Install all dependencies:**
   This command reads our `package.json` and pulls down all libraries (like Recharts, Lucide React, and CryptoJS) into the `node_modules` folder:
   ```bash
   npm install
   ```
3. **Run the local development server:**
   ```bash
   npm run dev
   ```
4. Open the local address shown in your terminal (usually `http://localhost:5173`) in your browser to check out the app! 🚀

---

## 📂 Code Structure
I organized the code into distinct folders so it's clean and easy to navigate:

```text
my_axi/
├── public/                  # Static assets
├── src/
│   ├── Components/
│   │   ├── CheckoutForm.jsx # The main payment form logic (with Luhn & type-detection)
│   │   └── CheckoutForm.css # Styles for the checkout UI, inputs, and responsive layout
│   ├── Dashboard/
│   │   ├── Dashboard.jsx    # Fetching transaction metrics, search, filtering, and charts
│   │   └── dashboard.css    # Clean layouts for dashboard cards and tables
│   ├── Footer/
│   │   └── Footer.jsx       # Standard app footer
│   ├── hooks/
│   │   └── useScrollAnimation.js # Custom hook managing our viewport scroll trigger
│   ├── services/
│   │   └── paymentApi.js    # Fetch and POST service layer connecting to Render backend
│   ├── utils/
│   │   └── generateHash.js  # HMAC-SHA256 signature generator
│   ├── App.jsx              # Main parent component importing Checkout and Dashboard
│   ├── index.css            # Base typography, variables, global reset, and keyframe animations
│   └── main.jsx             # React entry point
└── package.json             # Installed packages and build scripts
```

---

## 🔄 The Payment & Data Flow (Step-by-Step)
To make sure I understood the lifecycle of a payment transaction, I built the app following this exact flow:


graph TD
    A[Customer enters payment details] --> B[Card Type detected & Luhn verified]
    B --> C[generateHash reverses inputs & generates HMAC-SHA256 signature]
    C --> D[initiatePayment triggers POST API request with Hash Header]
    D --> E[Render API verifies hash & returns checkout redirect_url]
    E --> F[Customer is redirected to secure page]
    F --> G[Dashboard fetches transaction data in real time]
    G --> H[Metrics computed & charts rendered lazy loading]
```

1. **Card Input & Live Type Detection:**
   As the user types their card number in [CheckoutForm.jsx](file:///c:/Users/wasim/Downloads/AxiPays/AxiPays/my_axi/src/Components/CheckoutForm.jsx), a regular expression checks the prefix and dynamically swaps the payment icon (Visa, MasterCard, RuPay, Amex, or Discover) right in the input box!
2. **Signature Hashing:**
   Before submission, the form sends the email and card number to our [generateHash.js](file:///c:/Users/wasim/Downloads/AxiPays/AxiPays/my_axi/src/utils/generateHash.js) utility. 
   * It takes the first 6 and last 4 digits of the card.
   * Reverses both the card digits and the email address.
   * Compiles them into a combined uppercase string: `(REVERSED_EMAIL + "AXIPAYS" + REVERSED_CARD)`.
   * Encrypts this message using HMAC-SHA256 with the secret key `"AXI2026"` using **CryptoJS**.
3. **Submitting to Payment API:**
   The [initiatePayment](file:///c:/Users/wasim/Downloads/AxiPays/AxiPays/my_axi/src/services/paymentApi.js) function is invoked, sending the payload to our Render backend API along with the generated signature attached as a custom `"Hash"` header.
4. **3D-Secure Redirection:**
   The backend verifies the request integrity. If correct, it sends back a checkout redirection URL (`data.redirect_url` or `data.redirection_url`) and the browser redirects the user to the sandbox bank verification screen.
5. **Dashboard Updates:**
   The [Dashboard.jsx](file:///c:/Users/wasim/Downloads/AxiPays/AxiPays/my_axi/src/Dashboard/Dashboard.jsx) component runs a `fetch` query to pull transaction history from the Render backend. The transaction tables automatically calculate total volume metrics, and mask sensitive numbers for customer privacy.

---

## 💡 Key Decisions & Technical Assumptions

*   **Hand-Written Pure CSS:** I decided to write all CSS by hand using custom HSL color palettes and CSS grid instead of installing Tailwind CSS. It forced me to learn the details of responsive layout structures and keep the code clean of messy utility class strings.
*   **Lazy Loading Charts:** Recharts can sometimes block the main thread and feel heavy on page load. To fix this, I wrapped the charts inside a custom `<LazyChartBox>` component that uses the browser's native `IntersectionObserver`. The charts only compile and play their mounting animations when they scroll into the viewport!
*   **Card Masking Logic:** Security is a major concern in fintech. I assumed that the dashboard should never leak actual card credentials. The `maskCard` function slices card strings down to only display the first 6 (identifies the bank branch) and last 4 digits (identifies individual card) with asterisks in the middle (`411111******1111`). CVV/CVC is completely hidden as `***`.
*   **Scroll Animations Hook:** I built [useScrollAnimation.js](file:///c:/Users/wasim/Downloads/AxiPays/AxiPays/my_axi/src/hooks/useScrollAnimation.js) as a reusable utility. It automatically targets any HTML element with the `data-scroll-animate` attribute and applies a `.scroll-animate` trigger class. Once the element fades in, it immediately disconnects the observer so we don't waste system memory listening to static elements.

---

## 🧠 My Struggles, Learnings, & ChatGPT Assist Disclosure!

As a fresher, this was an amazing, challenging journey! Here are the things I really struggled with and how I solved them:

1. **Struggling with HMAC Hashing:**
   I had never worked with security hashing before! When the backend kept returning unauthorized errors, I got really confused. 
   * **ChatGPT Assist:** I used ChatGPT to help me understand how `CryptoJS.HmacSHA256` works. It explained that I needed to convert the hashed object into a Hex string and then format it in uppercase. This saved me a lot of debugging hours!
2. **Intersection Observers inside React:**
   Writing standard React state logic with browser APIs like `IntersectionObserver` was very confusing. My first attempt resulted in infinite trigger loops which crashed the browser.
   * **ChatGPT Assist:** I asked ChatGPT for standard patterns of `IntersectionObserver` within React `useEffect` hooks. It taught me how to properly clean up and disconnect the observer `return () => observer.disconnect()` when the component unmounts to prevent massive memory leaks.
3. **Designing SVGs:**
   I wanted the card input logos (Visa, Mastercard) to render as crisp vector graphics inside the input fields. I was struggling to write the precise `<svg>` coordinate geometries by myself, so I used ChatGPT to generate neat, lightweight inline SVG path shapes.

---

## 🔮 Future Enhancement Backlog
*   [ ] **Dark Mode Toggle:** A dashboard is always cooler in dark mode! I want to set up CSS variables so users can toggle light/dark modes easily.
*   [ ] **CSV Transaction Downloader:** Add an exporter button to download the paginated list of success/failed payments.
*   [ ] **Animated Error Toasts:** Swap out the standard `alert("Payment Failed")` for beautiful, temporary sliding notification toasts.
If you have any feedback or ideas to share, please let me know! 😊🚀
