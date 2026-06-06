import { Phone, MessageCircle, Mail } from "lucide-react";

interface ContactCTAProps {
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export function ContactCTA({
  phone = "602-880-4087",
  email = "heidelbergservices@gmail.com",
  instagram,
  facebook,
  tiktok,
}: ContactCTAProps) {
  const cleanPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/1${cleanPhone}`;

  return (
    <section id="contact" className="bg-foreground py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-2 text-2xl font-bold text-background sm:mb-4 sm:text-3xl md:text-4xl">
          Ready to Build Your Dream Shed?
        </h2>
        <p className="mb-6 text-sm text-background/70 sm:mb-8 sm:text-lg">
          Get in touch today for a free quote. We&apos;re here to help!
        </p>

        {/* CTA Buttons */}
        <div className="mb-8 flex w-full flex-col items-center gap-3 sm:justify-center sm:gap-4">
          <a
            href={`tel:${phone}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            <Phone className="h-5 w-5" />
            Call/Text {phone}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-base font-semibold text-white transition-all hover:bg-green-700 hover:scale-105 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
        </div>

        {/* Email */}
        {email && (
          <a
            href={`mailto:${email}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-background/80 transition-colors hover:text-background sm:mb-8"
          >
            <Mail className="h-5 w-5 flex-shrink-0" />
            <span className="break-all">{email}</span>
          </a>
        )}

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4">
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-background/10 p-3 text-background transition-colors hover:bg-background/20"
              aria-label="Instagram"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          )}
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-background/10 p-3 text-background transition-colors hover:bg-background/20"
              aria-label="Facebook"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          )}
          {tiktok && (
            <a
              href={tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-background/10 p-3 text-background transition-colors hover:bg-background/20"
              aria-label="TikTok"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
