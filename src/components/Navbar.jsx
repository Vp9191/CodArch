import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'glass' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">CA</div>
          <div className="navbar-logo-text">
            Cod<span>Arch</span>
          </div>
        </Link>

        <div className="navbar-cta-desktop">
          <Link to="/auth" className="btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>

        <button
          className="navbar-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className="navbar-mobile-menu"
        style={{
          maxHeight: menuOpen ? '80px' : '0',
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div className="navbar-mobile-menu-inner">
          <Link
            to="/auth"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
