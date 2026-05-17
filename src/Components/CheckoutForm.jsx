import { useState } from "react";
import {
  User,
  Mail,
  CreditCard,
  Lock,
  Calendar,
  Globe,
  Phone,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Wallet,
} from "lucide-react";

import "./CheckoutForm.css";
import { initiatePayment } from "../services/paymentApi";

const getCardType = (number) => {
  const num = number.replace(/\D/g, "");
  if (/^4/.test(num)) return "visa";
  if (/^5[1-5]/.test(num) || /^2(2[2-9]|[3-6]\d|7[01])/.test(num))
    return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  if (/^6(0|52[1-9]|5[3-9]|[6-9])/.test(num)) return "rupay";
  if (/^6(?:011|5)/.test(num)) return "discover";
  return null;
};

const CardLogo = ({ type }) => {
  if (type === "visa")
    return (
      <svg
        viewBox="0 0 48 16"
        width="42"
        height="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="16" rx="3" fill="#1A1F71" />
        <text
          x="50%"
          y="12"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="800"
          fontFamily="Arial"
          letterSpacing="1"
        >
          VISA
        </text>
      </svg>
    );
  if (type === "mastercard")
    return (
      <svg
        viewBox="0 0 38 24"
        width="38"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="14" cy="12" r="10" fill="#EB001B" />
        <circle cx="24" cy="12" r="10" fill="#F79E1B" />
        <path
          d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z"
          fill="#FF5F00"
        />
      </svg>
    );
  if (type === "amex")
    return (
      <svg
        viewBox="0 0 48 16"
        width="42"
        height="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="16" rx="3" fill="#2E77BC" />
        <text
          x="50%"
          y="12"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontWeight="700"
          fontFamily="Arial"
          letterSpacing="0.5"
        >
          AMEX
        </text>
      </svg>
    );
  if (type === "rupay")
    return (
      <svg
        viewBox="0 0 48 16"
        width="42"
        height="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="16" rx="3" fill="#1a7a4c" />
        <text
          x="50%"
          y="12"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontWeight="700"
          fontFamily="Arial"
          letterSpacing="0.5"
        >
          RuPay
        </text>
      </svg>
    );
  if (type === "discover")
    return (
      <svg
        viewBox="0 0 48 16"
        width="42"
        height="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="16" rx="3" fill="#E65C00" />
        <text
          x="50%"
          y="12"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          fontWeight="700"
          fontFamily="Arial"
          letterSpacing="0.3"
        >
          DISCOVER
        </text>
      </svg>
    );
  return null;
};

function CheckoutForm() {
  const [formData, setFormData] = useState({
    cardHolder: "",
    email: "",
    cardNumber: "",
    cvv: "",
    expiryMonth: "",
    expiryYear: "",
    amount: "",
    currency: "USD",
    country: "India",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await initiatePayment(formData);

      if (data.redirection_url) {
        window.location.href = data.redirection_url;
      }
    } catch {
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        {/* HEADER */}
        <div className="checkout-header" data-scroll-animate="left">
          <div className="logo-section">
            {/* <div className="logo-box">
              A
            </div> */}
            <div>
              <h1>AXIPAYS</h1>
              <p>Secure Payment Checkout</p>
            </div>
          </div>
          <div className="secure-badge" data-scroll-animate="right">
            <ShieldCheck size={20} />

            <div>
              <h4>100% Secure</h4>

              <span>Your payment is safe with us</span>
            </div>
          </div>
        </div>

        {/* BODY */}

        <div className="checkout-body">
          {/* LEFT */}

          <div className="payment-section" data-scroll-animate="left">
            <div className="section-header">
              <div className="section-icon">
                <Wallet size={22} />
              </div>

              <div>
                <h2>Payment Checkout Page</h2>

                <p>
                  Enter your payment details to complete the transaction
                  securely.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="input-group">
                  <label>Card Holder Name</label>

                  <div className="input-box">
                    <User size={18} />

                    <input
                      type="text"
                      name="cardHolder"
                      placeholder="Your Name"
                      value={formData.cardHolder}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Email Address</label>

                  <div className="input-box">
                    <Mail size={18} />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Card Number</label>

                  <div className="input-box">
                    {getCardType(formData.cardNumber) ? (
                      <CardLogo type={getCardType(formData.cardNumber)} />
                    ) : (
                      <CreditCard size={18} />
                    )}

                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="4111 1111 1111 1111"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      maxLength={19}
                    />

                    {getCardType(formData.cardNumber) && (
                      <span className="card-type">
                        {getCardType(formData.cardNumber).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label>CVV / CVC</label>

                  <div className="input-box">
                    <Lock size={18} />

                    <input
                      type="password"
                      name="cvv"
                      placeholder="•••"
                      value={formData.cvv}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Expiry Month</label>

                  <div className="input-box">
                    <Calendar size={18} />

                    <select
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleChange}
                    >
                      <option>MM</option>
                      <option>01</option>
                      <option>02</option>
                      <option>03</option>
                      <option>04</option>
                      <option>05</option>
                      <option>06</option>
                      <option>07</option>
                      <option>08</option>
                      <option>09</option>
                      <option>10</option>
                      <option>11</option>
                      <option>12</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Expiry Year</label>

                  <div className="input-box">
                    <Calendar size={18} />

                    <select
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleChange}
                    >
                      <option>YYYY</option>
                      <option>2025</option>
                      <option>2026</option>
                      <option>2027</option>
                      <option>2028</option>
                      <option>2029</option>
                      <option>2030</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Payment Amount</label>

                  <div className="input-box">
                    <span className="currency">₹</span>

                    <input
                      type="number"
                      name="amount"
                      placeholder="100"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Currency</label>

                  <div className="input-box">
                    <Globe size={18} />

                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option>USD</option>
                      <option>INR</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Country</label>

                  <div className="input-box">
                    <MapPin size={18} />

                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option>India</option>
                      <option>USA</option>
                      <option>UK</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Phone</label>

                  <div className="input-box">
                    <Phone size={18} />

                    <input
                      type="text"
                      name="phone"
                      placeholder="+91 9999999999"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Address</label>

                <div className="input-box textarea-box">
                  <MapPin size={18} style={{ marginTop: "10px", flexShrink: 0 }} />

                  <textarea
                    name="address"
                    placeholder="Enter billing address"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="pay-btn">
                {loading ? "Processing..." : "Proceed To Payment"}
              </button>
            </form>
          </div>

          {/* RIGHT */}

          <div className="sidebar" data-scroll-animate="right">
            <div className="summary-card">
              <h3>Payment Summary</h3>

              <div className="summary-row">
                <span>Payment Amount</span>

                <strong>₹{formData.amount || 0}</strong>
              </div>

              <div className="summary-row">
                <span>Processing Fee</span>

                <strong>₹0.00</strong>
              </div>

              <div className="summary-total">
                <span>Total Amount</span>

                <h2>₹{formData.amount || 0}</h2>
              </div>
            </div>

            <div className="feature-card">
              <h3>Why Choose AXIPAYS?</h3>

              <div className="feature-item">
                <BadgeCheck size={20} />

                <div>
                  <h4>Bank Level Security</h4>

                  <p>256-bit SSL encryption</p>
                </div>
              </div>

              <div className="feature-item">
                <ShieldCheck size={20} />

                <div>
                  <h4>Secure Transactions</h4>

                  <p>Your transactions are safe</p>
                </div>
              </div>

              <div className="feature-item">
                <Headphones size={20} />
                
                <div>
                  <h4>24/7 Support</h4>

                  <p>We’re here anytime</p>
                </div>
              </div>
            </div>
            {/* ACCEPTED CARDS */}

            <div className="accept-card">
              <h3>We Accept</h3>

              <div className="card-brands">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="gpay"
                />

                <img
                  src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/visa.svg"
                  alt="visa"
                />

                <img
                  src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/mastercard.svg"
                  alt="mastercard"
                />

                <img
                  src="https://egov.eletsonline.com/wp-content/uploads/2015/03/RuPay.svg_.png"
                  alt="rupay"
                  style={{ height: "70px", width: "auto", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;
