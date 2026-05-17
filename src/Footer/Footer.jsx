import React from "react";
import "./Footer.css";
import { Lock, ShieldCheck, CheckCircle, Mail, Phone, ChevronRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          
          <div className="footer-brand" data-scroll-animate="left">
            <h2>AxiPays</h2>
            <p>
            Your data, Our responsibility. We ensure the security and privacy of your information. 
            </p>
          </div>

          <div className="footer-links" data-scroll-animate>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/"><ChevronRight size={14} /> Home</a></li>
              <li><a href="/"><ChevronRight size={14} /> Payments</a></li>
              <li><a href="/"><ChevronRight size={14} /> Pricing</a></li>
              <li><a href="/"><ChevronRight size={14} /> Support</a></li>
            </ul>
          </div>

          <div className="footer-security" data-scroll-animate>
            <h3>Security</h3>
            <ul>
              <li><Lock size={16} /> <span>256-bit SSL Encryption</span></li>
              <li><ShieldCheck size={16} /> <span>PCI DSS Protected</span></li>
              <li><CheckCircle size={16} /> <span>Trusted Transactions</span></li>
            </ul>
          </div>

          <div className="footer-support" data-scroll-animate="right">
            <h3>Need Help?</h3>
            <ul>
              <li><Mail size={16} /> <span>support@axipays.com</span></li>
              <li><Phone size={16} /> <span>+91 6395145388</span></li>
              <li><CheckCircle size={16} /> <span>Available 24/7</span></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom" data-scroll-animate>
          <div className="footer-bottom-content">
            <p>© {new Date().getFullYear()} AxiPays. All rights reserved.</p>
            <div className="footer-legal-links">
              <a href="/">Terms</a>
              <a href="/">Privacy</a>
              <a href="/">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;