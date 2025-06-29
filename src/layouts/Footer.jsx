// Payment icons
import visa from "../assets/payment/visa.png";
import paypal from "../assets/payment/paypal.png";
import amex from "../assets/payment/amex.png";
import mastercard from "../assets/payment/mastercard.png";

// Social icons
import facebook from "../assets/social/facebook.png";
import instagram from "../assets/social/instagram.png";
import youtube from "../assets/social/youtube.png";
import x from "../assets/social/x.png";
import { Mail, Phone, MapPin } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-[#1F2A37] text-white px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Section 1 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">TechTrack</h2>
          <p className="text-base leading-relaxed mb-6">
            Empowering the next generation of tech professionals through
            comprehensive training and direct connections with top companies.
          </p>
          <div>
            <p className="font-semibold text-base mb-2">Payment:</p>
            <div className="flex items-center space-x-4">
              <img src={visa} alt="Visa" className="h-8" />
              <img src={paypal} alt="PayPal" className="h-8" />
              <img src={amex} alt="Amex" className="h-8" />
              <img src={mastercard} alt="MasterCard" className="h-8" />
          </div>

          </div>
        </div>

        {/* Section 2 - Learning */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Learning</h3>
          <ul className="space-y-2 text-base">
            <li>All Tracks</li>
            <li>Frontend Development</li>
            <li>Backend Development</li>
            <li>UI/UX Design</li>
            <li>DevOps & Cloud</li>
            <li>Mobile Development</li>
            <li>Data Science</li>
          </ul>
        </div>

        {/* Section 3 - Company */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-base">
            <li>About Us</li>
            <li>Our Mission</li>
            <li>Careers</li>
            <li>Partner Companies</li>
            <li>Success Stories</li>
            <li>Press</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Section 4 - Support */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-base mb-6">
            <li>Help Center</li>
            <li>FAQ</li>
            <li>Contact Support</li>
            <li>Community</li>
            <li>Student Resources</li>
          </ul>
          <div className="space-y-3 text-base">
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5" /> support@techtrack.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-5 h-5" /> 1-800-TECH-TRACK
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> San Francisco, CA
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2025 TechPrep. All rights reserved.</p>
        <div className="flex space-x-4">
          <img src={facebook} alt="Facebook" className="h-6" />
          <img src={instagram} alt="Instagram" className="h-6" />
          <img src={youtube} alt="YouTube" className="h-6" />
          <img src={x} alt="X" className="h-6" />
        </div>

      </div>
    </footer>
  );
}
