'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  navItems: NavItem[];
  logo: string;
};

export default function Navbar({ navItems, logo }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    // th-navbar: outer navbar wrapper
    <nav className="th-navbar w-full border-b bg-white">
      {/* th-navbar-inner: width-constrained container */}
      <div className="th-navbar-inner mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        
        {/* th-navbar-logo: logo/brand area */}
        <Link href="/" className="th-navbar-logo block">
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              className="th-navbar-logo-image h-8 w-auto object-contain"
            />
          ) : (
            <span className="text-xl font-semibold">Logo</span>
          )}
        </Link>

        {/* th-navbar-desktop: desktop nav container */}
        <div className="th-navbar-desktop hidden gap-6 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`th-navbar-link text-sm font-medium hover:text-blue-600 ${
                  active ? "th-navbar-link-active" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* th-navbar-toggle: mobile toggle button */}
        <button
          className="th-navbar-toggle md:hidden"
          onClick={() => setOpen(!open)}
        >
          {/* th-navbar-hamburger: hamburger icon wrapper */}
          <div className="th-navbar-hamburger space-y-1">
            <span className="th-navbar-hamburger-line block h-0.5 w-6 bg-black" />
            <span className="th-navbar-hamburger-line block h-0.5 w-6 bg-black" />
            <span className="th-navbar-hamburger-line block h-0.5 w-6 bg-black" />
          </div>
        </button>
      </div>

      {/* th-navbar-mobile: mobile menu wrapper */}
      {open && (
        <div className="th-navbar-mobile px-4 pb-4 md:hidden">
          {/* th-navbar-mobile-list: mobile link list */}
          <div className="th-navbar-mobile-list flex flex-col gap-3">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`th-navbar-link th-navbar-mobile-link text-sm font-medium hover:text-blue-600 ${
                    active ? "th-navbar-link-active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}