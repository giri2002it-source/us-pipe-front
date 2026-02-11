'use client';

import React from 'react';
import './navbar.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname() || '/';
  const isActive = (path) => {
    if (path === '/dashboard') return pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/dashboard');
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="navbar-logo">A</div>
          <span className="navbar-brand">Acme</span>
        </div>
        <div className="navbar-links">
          <Link href="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link href="/reports" className={`navbar-link ${isActive('/reports') ? 'active' : ''}`}>
            Reports
          </Link>
          <Link href="/settings" className={`navbar-link ${isActive('/settings') ? 'active' : ''}`}>
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}
