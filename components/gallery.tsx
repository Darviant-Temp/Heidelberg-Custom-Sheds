"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Home } from "lucide-react";
import type { Photo } from "@/lib/airtable";
import Image from "next/image";

interface GalleryProps {
  photos: Photo[];
}

const categories = ["All", "Storage", "Office", "Barn", "Custom"];

export function Gallery({ photos }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos =
    activeCategory === "All"
      ? photos
      : photos.filter((photo) => photo.Category?.toLowerCase() === activeCategory.toLowerCase());

  const photosWithImages = filteredPhotos.filter(
    (photo) => photo.Attachments && photo.Attachments.length > 0
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    if (direction === "prev") {
      setLightboxIndex(lightboxIndex === 0 ? photosWithImages.length - 1 : lightboxIndex - 1);
    } else {
      setLightboxIndex(lightboxIndex === photosWithImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  // Placeholder grid for when no photos are available
  const placeholderGrid = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className="aspect-square rounded-lg border border-dashed border-border bg-card flex items-center justify-center"
    >
      <div className="flex flex-col items-center text-center text-muted-foreground">
        <Home className="mb-3 h-10 w-10 text-primary/40" />
        <p className="text-sm font-medium">Photos Coming Soon</p>
      </div>
    </div>
  ));

  return (
    <section id="gallery" className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl md:text-4xl">Our Work</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Browse our portfolio of custom-built sheds across Phoenix
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        {photosWithImages.length > 0 ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {photosWithImages.map((photo, index) => (
              <div
                key={photo.id}
                className="mb-4 cursor-pointer overflow-hidden rounded-lg break-inside-avoid"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={photo.Attachments[0].url}
                  alt={photo.Category || "Shed photo"}
                  width={photo.Attachments[0].width || 600}
                  height={photo.Attachments[0].height || 400}
                  className="w-full transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderGrid}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && photosWithImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox("prev");
            }}
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <Image
            src={photosWithImages[lightboxIndex].Attachments[0].url}
            alt={photosWithImages[lightboxIndex].Category || "Shed photo"}
            width={1200}
            height={800}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox("next");
            }}
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {lightboxIndex + 1} / {photosWithImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
