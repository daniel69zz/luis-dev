import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { site } from '@/config/site';

const links = [
  { to: '/#sobre-mi', label: 'sobre-mí' },
  { to: '/proyectos', label: 'proyectos' },
  { to: '/#stack', label: 'stack' },
  { to: '/#contacto', label: 'contacto' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/75 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-mono text-sm font-semibold sm:text-base" aria-label="Inicio">
          <span className="text-accent">{site.handle}</span>
          <span className="text-muted">@</span>
          <span className="text-cyan">dev</span>
          <span className="text-muted">:~$</span>
          <span className="animate-blink ml-1 text-accent">▋</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link, index) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 font-mono text-sm transition-colors hover:text-accent ${
                    isActive && !link.to.includes('#') ? 'text-accent' : 'text-muted'
                  }`
                }
              >
                <span className="text-accent/70">{String(index + 1).padStart(2, '0')}.</span> {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-md p-2 text-muted hover:text-accent md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <ul className="border-t border-line bg-bg/95 px-4 py-3 md:hidden">
          {links.map((link, index) => (
            <li key={link.to}>
              <Link to={link.to} className="block py-2.5 font-mono text-sm text-muted hover:text-accent">
                <span className="text-accent/70">{String(index + 1).padStart(2, '0')}.</span> {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
