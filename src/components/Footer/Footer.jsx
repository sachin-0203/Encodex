import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import HandleNavigate from "../Navigate/HandleNavigate";

function Footer() {
  return (
    <footer className="bg-background border-t px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

        {/* Column 1: Encodex Intro */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-primary mb-2">
            <HandleNavigate to="/">Encodex</HandleNavigate>
          </h2>
          <p className="text-sm text-gray-500">
            Encodex is your trusted solution for secure image encryption and seamless data protection.
            Upgrade to Encodex Plus for enhanced features and control.
          </p>
        </div>

        {/* Column 2: Page Links */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-secondary mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-secondary transition" >
              <HandleNavigate to="/about">About</HandleNavigate>
            </li>
            <li className="hover:text-secondary transition">
              <HandleNavigate to="/contact">Contact</HandleNavigate>
            </li>
            <li className="hover:text-secondary transition" >
              <HandleNavigate to="/faq">FAQ</HandleNavigate>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal Links */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-secondary mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-secondary transition" >
              <HandleNavigate to="/privacy-policy">Privacy Policy</HandleNavigate>
            </li>
            <li className="hover:text-secondary transition" >
              <HandleNavigate to="/terms-and-conditions">Terms & Condition</HandleNavigate>
            </li>
            <li className="hover:text-secondary transition" >
              <HandleNavigate to="/refund-and-cancellation">Refund / Cancellation</HandleNavigate>
            </li>
            <li className="hover:text-secondary transition" >
              <HashLink smooth to="/plus#plans">Plans</HashLink>
            </li>
            
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Encodex. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
