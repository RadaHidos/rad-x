import { useEffect, useMemo, useState } from 'react';
import logo from '../assets/logo.png';

/**
 * Desktop layout idea:
 * - 5-column grid:
 *   [left links (2 cols)] [logo (1 col)] [right links (2 cols)]
 * - Left links animate RTL (from right to left)
 * - Right links animate LTR (from left to right)
 */

/** Left side items (desktop) */
const leftItems = [
  { name: 'ABOUT', href: '#about' },
  { name: 'PROJECTS', href: '#projects' },
];

/** Right side items (desktop) */
const rightItems = [
  { name: 'SKILLS', href: '#skills' },
  { name: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  /**
   * isScrolled:
   * - true when user scrolls down a bit
   * - used to make the navbar background appear (glass blur) and reduce padding
   */
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * isMenuOpen:
   * - controls the mobile fullscreen menu (open/close)
   * - default false so it doesn't cover the page on load
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * navItems:
   * - used only for mobile menu list (single vertical list)
   * - memoized so the array isn't re-created on every render
   */
  const navItems = useMemo(() => [...leftItems, ...rightItems], []);

  /**
   * Scroll listener:
   * - updates isScrolled based on window.scrollY
   * - cleans up the event listener when component unmounts
   */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll(); // run once so state matches current scroll on refresh
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Disable background scrolling when mobile menu is open:
   * - prevents the page from scrolling behind the overlay
   * - restores scrolling when menu closes or component unmounts
   */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    /**
     * Header is fixed at the top and always visible
     * - z-50 keeps it above most content
     * - on scroll: background + blur + smaller vertical padding
     */
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-background/70 backdrop-blur-md' : 'py-6'
      }`}
    >
      {/* =========================
          DESKTOP NAV (md and up)
          ========================= */}
      <div className="mx-auto w-[70%]">
        {/* Hidden on mobile, 5-column grid on desktop */}
        <div className="hidden md:grid grid-cols-5 items-center">
          {/* LEFT SIDE LINKS (animate from RIGHT to LEFT) */}
          <nav className="col-span-2 flex justify-evenly">
            {leftItems.map((item, i) => {
              /**
               * We want: PROJECTS first, then ABOUT (wave from center outward)
               * But leftItems is [ABOUT, PROJECTS], so we reverse the delay:
               * - ABOUT gets delay-2
               * - PROJECTS gets delay-1
               */
              const delayIndex = leftItems.length - 1 - i;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  /**
                   * navlink: typography styling
                   * nav-underline: gradient underline on hover
                   * animate-nav-rtl: wipe-in from right to left
                   * delay-X: stagger timing for wave effect
                   */
                  className={`navlink nav-underline animate-nav-rtl delay-${
                    delayIndex + 1
                  }`}
                >
                  {/* This span scales on hover (so hover doesn't conflict with animation transforms) */}
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
            {/* logo-mark class creates the burgundy badge styling; animate-logo-in handles intro animation */}
            <img
              src={logo}
              alt="Rad-x logo"
              className="h-8 md:h-10 lg:h-12 w-auto object-contain logo-mark animate-logo-in"
            />
          </a>

          {/* RIGHT SIDE LINKS (animate from LEFT to RIGHT) */}
          <nav className="col-span-2 flex justify-evenly">
            {rightItems.map((item, i) => (
              <a
                key={item.name}
                href={item.href}
                /**
                 * animate-nav-ltr: wipe-in from left to right
                 * delay-1 then delay-2 makes: SKILLS first, CONTACT second
                 */
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

      {/* =========================
          MOBILE NAV (below md)
          ========================= */}

      {/* MOBILE TOP BAR: stays visible even when menu overlay is open */}
      <div
        /**
         * relative + high z-index ensures:
         * - this top bar stays ABOVE the overlay menu
         */
        className="md:hidden mx-auto w-[85%] flex items-center justify-between relative z-[60]"
      >
        {/* Mobile logo: tapping it closes the menu and scrolls to top */}
        <a href="#hero" aria-label="Home" onClick={() => setIsMenuOpen(false)}>
          <img
            src={logo}
            alt="Rad-x logo"
            className="h-10 w-auto object-contain logo-mark animate-logo-in"
          />
        </a>

        {/* Menu button toggles the overlay */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          className="rounded-full border border-border px-4 py-2 text-foreground text-l"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY:
          - starts BELOW the top bar (so logo + button remain visible)
          - fades in/out and blocks clicks when closed
      */}
      <div
        className={`fixed left-0 right-0 top-[92px] bottom-0 bg-background/95 backdrop-blur-md z-[50]
        flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Vertical stack of links */}
        <div className="flex flex-col space-y-8 text-xl">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              /**
               * Close menu after clicking a link
               * (nice UX on mobile)
               */
              onClick={() => setIsMenuOpen(false)}
              className="navlink nav-underline"
            >
              <span className="navlink-inner">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
