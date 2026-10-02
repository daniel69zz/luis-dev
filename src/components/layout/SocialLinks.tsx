import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons';
import { site } from '@/config/site';

export function SocialLinks({ className = '' }: { className?: string }) {
  const items = [
    { href: site.socials.github, label: 'GitHub', Icon: GithubIcon },
    { href: site.socials.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
    { href: `mailto:${site.email}`, label: 'Email', Icon: Mail },
  ];

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noreferrer"
            aria-label={label}
            className="grid size-10 place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
