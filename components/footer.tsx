import { Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  companyName?: string;
  phone?: string;
  email?: string;
  footerText?: string;
}

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Footer({
  companyName = "Heidelberg Custom Sheds",
  phone = "602-880-4087",
  email,
  footerText,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">H</span>
              </div>
              <span className="text-sm font-bold text-foreground sm:text-base">{companyName}</span>
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Quality custom sheds built for Phoenix homes and businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground sm:mb-4">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground sm:mb-4">Contact</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">{phone}</span>
                </a>
              </li>
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{email}</span>
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                Phoenix, AZ
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:mt-8 sm:pt-8">
          {footerText || `© ${currentYear} ${companyName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
