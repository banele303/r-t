import React from "react";

export default function FooterMenu() {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4>Shop and Learn</h4>
          <ul>
            <li><a href="#">Mac</a></li>
            <li><a href="#">iPad</a></li>
            <li><a href="#">iPhone</a></li>
            <li><a href="#">Watch</a></li>
            <li><a href="#">AirPods</a></li>
            <li><a href="#">TV & Home</a></li>
            <li><a href="#">AirTag</a></li>
            <li><a href="#">Accessories</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            <li><a href="#">Apple Music</a></li>
            <li><a href="#">Apple TV+</a></li>
            <li><a href="#">Apple Fitness+</a></li>
            <li><a href="#">Apple News+</a></li>
            <li><a href="#">Apple Arcade</a></li>
            <li><a href="#">iCloud</a></li>
            <li><a href="#">Apple One</a></li>
            <li><a href="#">Apple Pay</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Apple Store</h4>
          <ul>
            <li><a href="#">Find a Store</a></li>
            <li><a href="#">Genius Bar</a></li>
            <li><a href="#">Today at Apple</a></li>
            <li><a href="#">Apple Camp</a></li>
            <li><a href="#">Apple Store App</a></li>
            <li><a href="#">Certified Refurbished</a></li>
            <li><a href="#">Apple Trade In</a></li>
            <li><a href="#">Order Status</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>For Business</h4>
          <ul>
            <li><a href="#">Apple and Business</a></li>
            <li><a href="#">Shop for Business</a></li>
          </ul>
          <h4 className="mt-4">For Education</h4>
          <ul>
            <li><a href="#">Apple and Education</a></li>
            <li><a href="#">Shop for K-12</a></li>
            <li><a href="#">Shop for College</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-disclaimer">
          More ways to shop: <a href="#">Find an R & T Shop</a> or <a href="#">other retailer</a> near you.
        </p>
        <div className="footer-legal">
          <span>Copyright © 2026 R & T Shop Inc. All rights reserved.</span>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <span className="divider">|</span>
            <a href="#">Terms of Use</a>
            <span className="divider">|</span>
            <a href="#">Sales Policy</a>
            <span className="divider">|</span>
            <a href="#">Legal</a>
            <span className="divider">|</span>
            <a href="#">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
