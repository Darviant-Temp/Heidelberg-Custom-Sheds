"use client";

import { Phone, ChevronDown, Star, MapPin, FileCheck, Shield } from "lucide-react";

interface HeroProps {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBgImage?: string;
  ctaButtonText?: string;
  phone?: string;
}

export function Hero({
  heroTitle = "Custom Built Sheds in Phoenix",
  heroSubtitle = "Quality craftsmanship for your backyard storage needs",
  heroBgImage,
  ctaButtonText = "Get a Free Quote",
  phone = "602-880-4087",
}: HeroProps) {
  const scrollToGallery = () => {
    const element = document.querySelector("#gallery");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20"
      style={{
        backgroundImage: heroBgImage
          ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBgImage})`
          : "linear-gradient(135deg, #8B1A1A 0%, #5a1111 50%, #111111 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-white">{"Phoenix's #1 Shed Builder"}</span>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          {heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-white/90 md:text-xl">
          {heroSubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <a
            href={`tel:${phone}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            <Phone className="h-5 w-5" />
            {ctaButtonText}
          </a>
          <button
            onClick={scrollToGallery}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            View Our Work
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80 sm:mt-12 sm:gap-4 sm:text-sm md:gap-8">
          <div className="flex items-center gap-2">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-4 sm:w-4" />
            <span>5-Star Yelp Rated</span>
          </div>
          <span className="hidden text-white/40 md:inline">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Phoenix, AZ Local</span>
          </div>
          <span className="hidden text-white/40 md:inline">|</span>
          <div className="flex items-center gap-2">
            <FileCheck className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Free Quotes</span>
          </div>
          <span className="hidden text-white/40 md:inline">|</span>
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Licensed & Insured</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white/50" />
      </div>
    </section>
  );
}
