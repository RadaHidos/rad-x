import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const leftItems = [
  { name: 'ABOUT', href: '#about' },
  { name: 'WORK', href: '#projects' },
];

const rightItems = [
  { name: 'SHOP', href: '#shop' },
  { name: 'CONTACTS', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-background/70 backdrop-blur-md' : 'py-6'
      }`}
    >
      {/* Desktop */}

      {/* {left side} */}
      <div className="mx-auto w-[70%]">
        <div className="hidden md:grid grid-cols-5 items-center">
          <nav className="col-span-2 flex justify-evenly">
            {leftItems.map((item, i) => {
              const delayIndex = leftItems.length - 1 - i; // WORK first
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`navlink nav-underline animate-nav-rtl delay-${
                    delayIndex + 1
                  }`}
                >
                  <span className="navlink-inner">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* CENTER LOGO */}
          <a
            href="#hero"
            className="col-span-1 flex justify-center items-center"
            aria-label="Home"
          >
            <img
              src={logo}
              alt="Rad-x logo"
              className="h-8 md:h-10 lg:h-12 w-auto object-contain
                logo-mark animate-logo-in"
            />
          </a>

          {/* {right side} */}

          <nav className="col-span-2 flex justify-evenly">
            {rightItems.map((item, i) => (
              <a
                key={item.name}
                href={item.href}
                className={`navlink nav-underline animate-nav-ltr delay-${
                  i + 1
                }`}
              >
                <span className="navlink-inner">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between">
        <a href="#hero" className="inline-flex items-center" aria-label="Home">
          <img
            src={logo}
            alt="Rad-x logo"
            className="h-8 md:h-10 lg:h-12 w-auto object-contain
               transition-transform duration-300
               hover:scale-105 logo-mark animate-logo-in"
          />
        </a>
      </div>
    </header>
  );
}
