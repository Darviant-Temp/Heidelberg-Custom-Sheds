'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Settings {
  hero_title?: string
  hero_subtitle?: string
  hero_bg_image?: string
  phone?: string
  email?: string
  cta_button_text?: string
  company_name?: string
  footer_text?: string
  instagram_url?: string
  tiktok_url?: string
  facebook_url?: string
  logo_url?: string
}

interface PricingRow {
  id?: number
  size: string
  style: string
  no_foundation: string
  wood_foundation: string
  concrete_foundation: string
  featured?: boolean
  featured_order?: number | null
}

interface Photo {
  id: number
  image_url?: string | null
  video_url?: string | null
  category?: string | null
  file_type?: string | null
  description?: string | null
  featured?: boolean
  featured_order?: number | null
}

interface Review {
  id?: number
  customer_name: string
  location: string
  review_text: string
  stars: number
  service_type?: string | null
  featured?: boolean
  featured_order?: number | null
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PHONE = '6028804087'
const EMAIL = 'heidelbergservices@gmail.com'

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]

const FALLBACK_PRICING: PricingRow[] = [
  { size: '6x8', style: 'Lean-to', no_foundation: '$2,900+', wood_foundation: '$3,000+', concrete_foundation: '$3,400+' },
  { size: '6x8', style: 'Gable', no_foundation: '$3,150+', wood_foundation: '$3,375+', concrete_foundation: '$3,600+' },
  { size: '6x8', style: 'Barn', no_foundation: '$3,800+', wood_foundation: '$3,900+', concrete_foundation: '$4,000+' },
  { size: '8x8', style: 'Lean-to', no_foundation: '$3,100+', wood_foundation: '$3,300+', concrete_foundation: '$3,700+' },
  { size: '8x8', style: 'Gable', no_foundation: '$3,700+', wood_foundation: '$3,900+', concrete_foundation: '$4,300+' },
  { size: '8x8', style: 'Barn', no_foundation: '$4,150+', wood_foundation: '$4,350+', concrete_foundation: '$4,700+' },
  { size: '10x10', style: 'Lean-to', no_foundation: '$4,000+', wood_foundation: '$4,400+', concrete_foundation: '$5,000+' },
  { size: '10x10', style: 'Gable', no_foundation: '$4,400+', wood_foundation: '$4,800+', concrete_foundation: '$5,400+' },
  { size: '10x10', style: 'Barn', no_foundation: '$5,100+', wood_foundation: '$5,500+', concrete_foundation: '$6,100+' },
  { size: '10x12', style: 'Lean-to', no_foundation: '$4,000+', wood_foundation: '$4,500+', concrete_foundation: '$5,150+' },
  { size: '10x12', style: 'Gable', no_foundation: '$4,400+', wood_foundation: '$4,900+', concrete_foundation: '$5,500+' },
  { size: '10x12', style: 'Barn', no_foundation: '$5,200+', wood_foundation: '$5,800+', concrete_foundation: '$6,300+' },
  { size: '10x16', style: 'Lean-to', no_foundation: '$5,200+', wood_foundation: '$5,500+', concrete_foundation: '$6,750+' },
  { size: '10x16', style: 'Gable', no_foundation: '$5,400+', wood_foundation: '$5,700+', concrete_foundation: '$6,950+' },
  { size: '10x16', style: 'Barn', no_foundation: '$5,800+', wood_foundation: '$6,900+', concrete_foundation: '$7,350+' },
  { size: '12x16', style: 'Lean-to', no_foundation: '$5,850+', wood_foundation: '$6,350+', concrete_foundation: '$7,600+' },
  { size: '12x16', style: 'Gable', no_foundation: '$6,100+', wood_foundation: '$6,650+', concrete_foundation: '$7,900+' },
  { size: '12x16', style: 'Barn', no_foundation: '$6,900+', wood_foundation: '$7,700+', concrete_foundation: '$8,650+' },
  { size: '12x20', style: 'Lean-to', no_foundation: '$7,025+', wood_foundation: '$7,500+', concrete_foundation: '$9,250+' },
  { size: '12x20', style: 'Gable', no_foundation: '$7,500+', wood_foundation: '$8,000+', concrete_foundation: '$9,750+' },
  { size: '12x20', style: 'Barn', no_foundation: '$8,500+', wood_foundation: '$10,500+', concrete_foundation: '$10,700+' },
]

const FALLBACK_REVIEWS: Review[] = [
  {
    customer_name: 'Doug D.',
    location: 'Glendale, AZ',
    stars: 5,
    review_text:
      'We called and had about 4 contractors bid the job. Tim came out and knew his stuff. Very happy with quality craftsmanship on 12x20 shed with loft. Will use again!',
    service_type: 'Custom Shed Build',
  },
  {
    customer_name: 'Livia R.',
    location: 'Glendale, AZ',
    stars: 5,
    review_text:
      'Timothy built us a beautiful shed in timely manner. Very communicative and respectful. Honest, detailed and trustworthy!',
    service_type: 'Custom Shed Build',
  },
  {
    customer_name: 'Joanna C.',
    location: 'Phoenix, AZ',
    stars: 5,
    review_text:
      'Love the way our shed looks, great job Tim! Process and time frame was perfect. Looks exactly as planned!',
    service_type: 'Shed Build',
  },
]

const SERVICES = [
  { icon: '🏠', title: 'Storage Sheds', description: 'Durable storage solutions for all your equipment and belongings.' },
  { icon: '💼', title: 'Office/She Sheds', description: 'Beautiful backyard retreats for work or relaxation.' },
  { icon: '🏚️', title: 'Barn Style Sheds', description: 'Classic barn designs with modern construction quality.' },
  { icon: '📐', title: 'Lean-to Sheds', description: 'Space-efficient designs that attach to existing structures.' },
  { icon: '🔧', title: 'Custom Builds', description: 'Unique designs tailored to your specific requirements.' },
  { icon: '🏗️', title: 'Shell Builds', description: 'Structural frames ready for your finishing touches.' },
]

const WHY_CHOOSE = [
  { icon: '🏆', title: 'Quality Craftsmanship', description: 'Every shed is built with premium materials and attention to detail.' },
  { icon: '⏱️', title: 'On-Time Delivery', description: 'We respect your time and complete projects when promised.' },
  { icon: '💯', title: 'Honest & Transparent', description: 'No hidden fees. What we quote is what you pay.' },
  { icon: '📍', title: 'Local Phoenix Company', description: 'Proudly serving the Phoenix metro area with personalized service.' },
]

const GALLERY_CATEGORIES = ['All', 'Storage', 'Office', 'Barn', 'Custom']
const STYLE_ORDER = ['Lean-to', 'Gable', 'Barn']

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useFadeIn(staggerIndex = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.6s ease ${staggerIndex * 0.1}s, transform 0.6s ease ${staggerIndex * 0.1}s`,
    } as React.CSSProperties,
  }
}

function FadeIn({
  children,
  className = '',
  staggerIndex = 0,
}: {
  children: React.ReactNode
  className?: string
  staggerIndex?: number
}) {
  const { ref, style } = useFadeIn(staggerIndex)
  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchSettings(): Promise<Settings> {
  const { data, error } = await supabase.from('settings').select('key, value')
  if (error) throw error
  const settings: Settings = {}
  for (const row of data ?? []) {
    if (row.key && row.value) {
      ;(settings as Record<string, string>)[row.key] = row.value
    }
  }
  return settings
}

function groupPricing(rows: PricingRow[]) {
  const grouped: Record<string, PricingRow[]> = {}
  for (const row of rows) {
    if (!grouped[row.size]) grouped[row.size] = []
    grouped[row.size].push(row)
  }
  const sortedSizes = Object.keys(grouped).sort((a, b) => {
    const parse = (s: string) => {
      const m = s.match(/(\d+)x(\d+)/)
      return m ? parseInt(m[1]) * parseInt(m[2]) : 0
    }
    return parse(a) - parse(b)
  })
  return { grouped, sortedSizes }
}

function formatPrice(val: string | number | null | undefined) {
  if (val === null || val === undefined || val === '') return 'Call for price'
  return String(val)
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'text-amber-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Page() {
  const [settings, setSettings] = useState<Settings>({})
  const [pricing, setPricing] = useState<PricingRow[]>(FALLBACK_PRICING)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [galleryFilter, setGalleryFilter] = useState('All')
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [videoModal, setVideoModal] = useState<string | null>(null)
  
  // Modal states for carousels
  const [showAllPricing, setShowAllPricing] = useState(false)
  const [showAllGallery, setShowAllGallery] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [pricingSearch, setPricingSearch] = useState('')
  const [pricingStyleFilter, setPricingStyleFilter] = useState('All')
  const [gallerySearch, setGallerySearch] = useState('')
  const [reviewSearch, setReviewSearch] = useState('')
  const [pricingPaused, setPricingPaused] = useState(false)
  const [galleryPaused, setGalleryPaused] = useState(false)
  const [reviewsPaused, setReviewsPaused] = useState(false)
  const pricingRef = useRef<HTMLDivElement | null>(null)
  const galleryRef = useRef<HTMLDivElement | null>(null)
  const reviewsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const s = await fetchSettings()
        setSettings(s)
      } catch {
        /* use defaults */
      }
      setHeroLoaded(true)

      try {
        const { data, error } = await supabase
          .from('pricing')
          .select('size, style, no_foundation, wood_foundation, concrete_foundation')
        console.log('Supabase pricing response:', { data, error })
        if (error || !data || data.length === 0) {
          console.log('Using fallback pricing because Supabase returned no rows or an error')
          setPricing(FALLBACK_PRICING)
        } else {
          setPricing(data as PricingRow[])
        }
      } catch (err) {
        console.log('Supabase pricing fetch failed:', err)
        setPricing(FALLBACK_PRICING)
      }

      try {
        const { data, error } = await supabase.from('photos').select('*')
        if (!error && data) setPhotos(data as Photo[])
      } catch {
        /* empty */
      }

      try {
        const { data, error } = await supabase.from('reviews').select('*')
        if (!error && data) setReviews(data as Review[])
      } catch {
        /* empty */
      }
    }
    load()
  }, [])

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const heroTitle = settings.hero_title || "Phoenix's #1 Custom Shed Builder"
  const heroSubtitle = settings.hero_subtitle || 'Not Your Average Shed Company'
  const ctaText = settings.cta_button_text || 'Get a Free Quote'
  const phone = settings.phone || PHONE
  const email = settings.email || EMAIL
  const companyName = settings.company_name || 'Heidelberg Custom Sheds'

  const heroStyle: React.CSSProperties = settings.hero_bg_image
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("${settings.hero_bg_image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay',
      }
    : { background: 'linear-gradient(135deg, #6B0000, #1a0000, #000)' }

  const heroAnim = (delay: number): React.CSSProperties => ({
    opacity: heroLoaded ? 1 : 0,
    transform: heroLoaded ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  })

  const { grouped, sortedSizes } = groupPricing(pricing)
  const displayReviews = reviews.length > 0 ? reviews : FALLBACK_REVIEWS

  const filteredPhotos =
    galleryFilter === 'All'
      ? photos
      : photos.filter((p) => p.category?.toLowerCase() === galleryFilter.toLowerCase())

  const navText = scrolled ? 'text-[#111]' : 'text-white'

  useEffect(() => {
    let frame = 0
    const animate = () => {
      if (pricingRef.current && !pricingPaused) {
        const el = pricingRef.current
        if (el.scrollWidth > el.clientWidth) {
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
            el.scrollLeft = 0
          } else {
            el.scrollLeft += 0.9
          }
        }
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [pricingPaused])

  useEffect(() => {
    let frame = 0
    const animate = () => {
      if (galleryRef.current && !galleryPaused) {
        const el = galleryRef.current
        if (el.scrollWidth > el.clientWidth) {
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
            el.scrollLeft = 0
          } else {
            el.scrollLeft += 0.9
          }
        }
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [galleryPaused])

  useEffect(() => {
    let frame = 0
    const animate = () => {
      if (reviewsRef.current && !reviewsPaused) {
        const el = reviewsRef.current
        if (el.scrollWidth > el.clientWidth) {
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
            el.scrollLeft = 0
          } else {
            el.scrollLeft += 0.9
          }
        }
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [reviewsPaused])

  const filteredPricing = pricing.filter((row) => {
    const search = pricingSearch.toLowerCase().trim()
    const matchesSearch =
      !search ||
      row.size.toLowerCase().includes(search) ||
      row.style.toLowerCase().includes(search)
    const matchesStyle = pricingStyleFilter === 'All' || row.style.toLowerCase() === pricingStyleFilter.toLowerCase()
    return matchesSearch && matchesStyle
  })

  const filteredReviews = displayReviews.filter((review) => {
    const search = reviewSearch.toLowerCase().trim()
    return (
      !search ||
      review.customer_name?.toLowerCase().includes(search) ||
      review.location?.toLowerCase().includes(search) ||
      review.service_type?.toLowerCase().includes(search) ||
      review.review_text?.toLowerCase().includes(search)
    )
  })

  const filteredGalleryPhotos = filteredPhotos.filter((photo) => {
    const search = gallerySearch.toLowerCase().trim()
    return (
      !search ||
      photo.category?.toLowerCase().includes(search) ||
      photo.description?.toLowerCase().includes(search) ||
      photo.alt_text?.toLowerCase().includes(search) ||
      photo.file_type?.toLowerCase().includes(search) ||
      photo.image_url?.toLowerCase().includes(search) ||
      photo.video_url?.toLowerCase().includes(search)
    )
  })

  const { grouped: groupedPricing, sortedSizes: sortedSizeKeys } = groupPricing(filteredPricing)

  const groupedGallery = filteredGalleryPhotos.reduce<Record<string, Photo[]>>((acc, photo) => {
    const key = photo.category || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(photo)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-white text-[#111]">
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 shadow-md backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('#hero') }} className="flex items-center gap-2">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-10 w-10 rounded-lg object-contain" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B1A1A]">
                <span className="text-lg font-bold text-white">H</span>
              </div>
            )}
            <span className={`hidden font-bold sm:block ${navText}`}>{companyName}</span>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                className={`text-sm font-medium transition-colors hover:text-[#8B1A1A] ${navText}`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${phone}`}
              className="rounded-full bg-[#8B1A1A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6B0000]"
            >
              📞 {phone}
            </a>
          </div>

          <button
            type="button"
            className={`md:hidden ${navText}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-200 bg-white shadow-lg md:hidden">
            <div className="flex flex-col px-4 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                  className="py-3 text-sm font-medium text-[#111] hover:text-[#8B1A1A]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`tel:${phone}`}
                className="mt-4 rounded-full bg-[#8B1A1A] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                📞 {phone}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center px-4 py-24" style={heroStyle}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-4xl px-4 text-center text-white">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/15 bg-white/10 p-10 shadow-2xl shadow-black/30 backdrop-blur-xl ring-1 ring-white/10">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={heroAnim(0)}>
              {heroTitle}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 md:text-xl" style={heroAnim(0.15)}>
              {heroSubtitle}
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={heroAnim(0.3)}>
              <a
                href={`tel:${phone}`}
                className="rounded-lg bg-[#8B1A1A] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#6B0000] hover:-translate-y-1 hover:shadow-lg"
              >
                {ctaText}
              </a>
              <a
                href="#gallery"
                onClick={(e) => { e.preventDefault(); scrollTo('#gallery') }}
                className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                View Our Work
              </a>
            </div>
            <div
              className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80 md:gap-6"
              style={heroAnim(0.45)}
            >
              <span>⭐ 5-Star Yelp</span>
              <span className="hidden md:inline text-white/40">|</span>
              <span>📍 Phoenix AZ</span>
              <span className="hidden md:inline text-white/40">|</span>
              <span>💬 Free Quotes</span>
              <span className="hidden md:inline text-white/40">|</span>
              <span>✓ Licensed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">What We Build</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              From storage solutions to custom retreats, we build quality sheds for every need.
            </p>
          </FadeIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} staggerIndex={i}>
                <div className="rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#8B1A1A]/10 text-2xl">
                    {s.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Transparent Pricing</h2>
            <p className="text-gray-600">All builds include 1 door, 1 window, shingles &amp; paint</p>
          </FadeIn>

          <FadeIn className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[#111]" />
              <span className="text-gray-600">No Foundation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-blue-600" />
              <span className="text-gray-600">Wood Foundation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[#8B1A1A]" />
              <span className="text-gray-600">Concrete Foundation</span>
            </div>
          </FadeIn>

          <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white/90 p-5 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={pricingSearch}
                onChange={(e) => setPricingSearch(e.target.value)}
                placeholder="Search pricing by size or style"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111] shadow-sm outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', ...STYLE_ORDER].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setPricingStyleFilter(style)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    pricingStyleFilter === style
                      ? 'bg-[#8B1A1A] text-white shadow-lg'
                      : 'bg-white text-[#111] hover:bg-gray-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div
              className="grid gap-6 justify-items-center md:grid-cols-2 lg:grid-cols-3"
            >
              {sortedSizeKeys.length === 0 ? (
                <div className="col-span-full min-h-[240px] w-full rounded-3xl border border-dashed border-gray-300 bg-white/80 p-8 text-center text-gray-500">
                  No pricing matches your search.
                </div>
              ) : (
                sortedSizeKeys.slice(0, 3).map((size) => (
                  <div key={size} className="w-80">
                    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/95 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                      <div className="bg-[#8B1A1A] px-4 py-3">
                        <h3 className="text-center text-lg font-bold text-white">{size}</h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {STYLE_ORDER.map((style) => {
                          const row = groupedPricing[size]?.find((r) => r.style === style)
                          if (!row) return null
                          return (
                            <div key={style} className="p-4">
                              <div className="mb-3 font-semibold">{style}</div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded bg-[#111]" />
                                    No Foundation
                                  </span>
                                  <span className="font-semibold">{formatPrice(row.no_foundation)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded bg-blue-600" />
                                    Wood Foundation
                                  </span>
                                  <span className="font-semibold text-blue-600">{formatPrice(row.wood_foundation)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded bg-[#8B1A1A]" />
                                    Concrete Foundation
                                  </span>
                                  <span className="font-semibold text-[#8B1A1A]">{formatPrice(row.concrete_foundation)}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <FadeIn className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`tel:${phone}`}
              className="inline-block rounded-lg bg-[#8B1A1A] px-8 py-4 font-semibold text-white transition-all hover:bg-[#6B0000]"
            >
              Call {phone} for custom sizes
            </a>
            <button
              type="button"
              onClick={() => setShowAllPricing(true)}
              className="inline-block rounded-lg border-2 border-[#8B1A1A] px-8 py-4 font-semibold text-[#8B1A1A] transition-all hover:bg-[#8B1A1A]/10"
            >
              View All Pricing →
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Modal */}
      {showAllPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl bg-white">
            <button
              type="button"
              onClick={() => setShowAllPricing(false)}
              className="sticky top-4 right-4 float-right z-10 rounded-lg bg-[#8B1A1A] text-white px-4 py-2"
            >
              ✕ Close
            </button>
            <div className="p-8">
              <h2 className="mb-6 text-3xl font-bold">All Pricing Options</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedSizeKeys.map((size) => (
                  <div key={size} className="overflow-hidden rounded-3xl border border-gray-200 bg-white/95 shadow-xl">
                    <div className="bg-[#8B1A1A] px-4 py-3">
                      <h3 className="text-center text-lg font-bold text-white">{size}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {STYLE_ORDER.map((style) => {
                        const row = groupedPricing[size]?.find((r) => r.style === style)
                        if (!row) return null
                        return (
                          <div key={style} className="p-4">
                            <div className="mb-3 font-semibold">{style}</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded bg-[#111]" />
                                  No Foundation
                                </span>
                                <span className="font-semibold">{formatPrice(row.no_foundation)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded bg-blue-600" />
                                  Wood Foundation
                                </span>
                                <span className="font-semibold text-blue-600">{formatPrice(row.wood_foundation)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded bg-[#8B1A1A]" />
                                  Concrete Foundation
                                </span>
                                <span className="font-semibold text-[#8B1A1A]">{formatPrice(row.concrete_foundation)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GALLERY ── */}
      <section id="gallery" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Work</h2>
            <p className="text-gray-600">Browse our portfolio of custom-built sheds across Phoenix</p>
          </FadeIn>

          <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white/90 p-5 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                placeholder="Search gallery by category or description"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111] shadow-sm outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGalleryFilter(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    galleryFilter === cat
                      ? 'bg-[#8B1A1A] text-white shadow-lg'
                      : 'bg-white text-[#111] hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal Carousel */}
          {filteredGalleryPhotos.length > 0 ? (
            <div className="relative">
              <div
                ref={galleryRef}
                onMouseEnter={() => setGalleryPaused(true)}
                onMouseLeave={() => setGalleryPaused(false)}
                className="overflow-x-auto scroll-smooth hide-scrollbar pb-4 snap-x snap-mandatory"
              >
                <div className="flex gap-4">
                  {filteredGalleryPhotos.slice(0, 4).map((photo) => {
                    const isVideo = photo.file_type === 'video' || photo.video_url
                    const mediaUrl = isVideo ? photo.video_url : photo.image_url
                    if (!mediaUrl) return null
                    return (
                      <div key={photo.id} className="flex-shrink-0 w-72 snap-start">
                        {isVideo ? (
                          <button
                            type="button"
                            onClick={() => setVideoModal(mediaUrl!)}
                            className="group relative block w-full overflow-hidden rounded-lg"
                          >
                            <div className="flex aspect-video items-center justify-center bg-[#111]">
                              <span className="text-5xl text-white/80 transition-transform group-hover:scale-110">▶</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl text-[#8B1A1A]">
                                ▶
                              </span>
                            </div>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setLightboxUrl(mediaUrl!)}
                            className="block w-full overflow-hidden rounded-lg"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={mediaUrl}
                              alt={photo.category || 'Shed photo'}
                              className="w-full aspect-square object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </button>
                        )}
                        {photo.description && (
                          <p className="mt-3 text-sm text-gray-700 line-clamp-2">{photo.description}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* View All Gallery */}
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllGallery(true)}
                  className="inline-block rounded-lg border-2 border-[#8B1A1A] px-8 py-4 font-semibold text-[#8B1A1A] transition-all hover:bg-[#8B1A1A]/10"
                >
                  View All Gallery →
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <FadeIn key={i} staggerIndex={i}>
                  <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
                    <div className="text-center text-gray-400">
                      <div className="mb-2 text-4xl">🏠</div>
                      <p className="text-sm font-medium">Photos Coming Soon</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Modal */}
      {showAllGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto rounded-xl bg-white">
            <button
              type="button"
              onClick={() => setShowAllGallery(false)}
              className="sticky top-4 right-4 float-right z-10 rounded-lg bg-[#8B1A1A] text-white px-4 py-2"
            >
              ✕ Close
            </button>
            <div className="p-8">
              <h2 className="mb-6 text-3xl font-bold">All Gallery Photos & Videos</h2>
              {Object.keys(groupedGallery).length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-500">
                  No gallery items match your search.
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedGallery).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="mb-4 text-xl font-semibold text-[#111]">{category}</h3>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((photo) => {
                          const isVideo = photo.file_type === 'video' || photo.video_url
                          const mediaUrl = isVideo ? photo.video_url : photo.image_url
                          if (!mediaUrl) return null
                          return (
                            <div key={photo.id} className="overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                              {isVideo ? (
                                <button
                                  type="button"
                                  onClick={() => setVideoModal(mediaUrl!)}
                                  className="group relative block w-full overflow-hidden rounded-3xl"
                                >
                                  <div className="flex aspect-video items-center justify-center bg-[#111]">
                                    <span className="text-5xl text-white/80 transition-transform group-hover:scale-110">▶</span>
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl text-[#8B1A1A]">
                                      ▶
                                    </span>
                                  </div>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setLightboxUrl(mediaUrl!)}
                                  className="block w-full overflow-hidden rounded-3xl"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={mediaUrl}
                                    alt={photo.category || 'Shed photo'}
                                    className="w-full transition-transform duration-300 hover:scale-105"
                                  />
                                </button>
                              )}
                              {photo.description && (
                                <p className="mt-3 text-sm text-gray-600">{photo.description}</p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Clients Say</h2>
            <p className="text-gray-600">Read reviews from our satisfied customers across Phoenix</p>
          </FadeIn>

          <div className="mb-6 rounded-3xl bg-white/90 p-5 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Search reviews</h3>
                <p className="text-sm text-gray-500">Search by name, location, service, or text.</p>
              </div>
              <div className="max-w-md flex-1">
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="Search reviews"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111] shadow-sm outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/20"
                />
              </div>
            </div>
          </div>

          <div className="relative mb-8">
            <div
              ref={reviewsRef}
              onMouseEnter={() => setReviewsPaused(true)}
              onMouseLeave={() => setReviewsPaused(false)}
              className="overflow-x-auto scroll-smooth hide-scrollbar pb-4 snap-x snap-mandatory"
            >
              <div className="flex gap-6">
                {filteredReviews.slice(0, 3).map((review, i) => (
                  <div key={review.id ?? i} className="flex-shrink-0 w-96 snap-start">
                    <div className="flex flex-col rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
                      <Stars count={review.stars || 5} />
                      <p className="my-4 flex-1 text-gray-700 line-clamp-3">&ldquo;{review.review_text}&rdquo;</p>
                      <div className="border-t border-gray-100 pt-4">
                        <p className="font-semibold">{review.customer_name}</p>
                        <p className="text-sm text-gray-500">{review.location}</p>
                        {review.service_type && (
                          <span className="mt-2 inline-block rounded-full bg-[#8B1A1A]/10 px-3 py-1 text-xs font-medium text-[#8B1A1A]">
                            {review.service_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowAllReviews(true)}
              className="inline-block rounded-lg border-2 border-[#8B1A1A] px-8 py-4 font-semibold text-[#8B1A1A] transition-all hover:bg-[#8B1A1A]/10"
            >
              View All Reviews →
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Modal */}
      {showAllReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl bg-white">
            <button
              type="button"
              onClick={() => setShowAllReviews(false)}
              className="sticky top-4 right-4 float-right z-10 rounded-lg bg-[#8B1A1A] text-white px-4 py-2"
            >
              ✕ Close
            </button>
            <div className="p-8">
              <h2 className="mb-6 text-3xl font-bold">All Customer Reviews</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {filteredReviews.map((review, i) => (
                  <div key={review.id ?? i} className="flex flex-col rounded-xl bg-gray-50 p-6 shadow-md">
                    <Stars count={review.stars || 5} />
                    <p className="my-4 flex-1 text-gray-700">&ldquo;{review.review_text}&rdquo;</p>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="font-semibold">{review.customer_name}</p>
                      <p className="text-sm text-gray-500">{review.location}</p>
                      {review.service_type && (
                        <span className="mt-2 inline-block rounded-full bg-[#8B1A1A]/10 px-3 py-1 text-xs font-medium text-[#8B1A1A]">
                          {review.service_type}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose Us</h2>
            <p className="text-gray-600">Experience the Heidelberg difference</p>
          </FadeIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map((item, i) => (
              <FadeIn key={item.title} staggerIndex={i}>
                <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B1A1A]/10 text-2xl">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section id="contact" className="bg-[#111] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <FadeIn>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Build Your Dream Shed?</h2>
            <p className="mb-8 text-lg text-white/70">Get in touch today for a free quote. We&apos;re here to help!</p>
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={`tel:${phone}`}
                className="w-full rounded-lg bg-[#8B1A1A] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#6B0000] sm:w-auto"
              >
                📞 Call/Text {phone}
              </a>
              <a
                href="https://wa.me/16028804087"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-green-700 sm:w-auto"
              >
                💬 WhatsApp
              </a>
            </div>
            <a href={`mailto:${email}`} className="text-white/80 transition-colors hover:text-white">
              {email}
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B1A1A]">
                  <span className="text-lg font-bold text-white">H</span>
                </div>
                <span className="font-bold">{companyName}</span>
              </div>
              <p className="text-sm text-gray-600">Quality custom sheds built for Phoenix homes and businesses.</p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                      className="text-sm text-gray-600 hover:text-[#8B1A1A]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href={`tel:${phone}`} className="hover:text-[#8B1A1A]">
                    📞 {phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}`} className="hover:text-[#8B1A1A]">
                    {email}
                  </a>
                </li>
                <li>📍 Phoenix, AZ</li>
              </ul>
              <div className="mt-4 flex gap-3">
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#8B1A1A]" aria-label="Instagram">
                    Instagram
                  </a>
                )}
                {settings.tiktok_url && (
                  <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#8B1A1A]" aria-label="TikTok">
                    TikTok
                  </a>
                )}
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#8B1A1A]" aria-label="Facebook">
                    Facebook
                  </a>
                )}
                {!settings.instagram_url && !settings.tiktok_url && !settings.facebook_url && (
                  <>
                    <span className="text-gray-400">Instagram</span>
                    <span className="text-gray-400">TikTok</span>
                    <span className="text-gray-400">Facebook</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="relative mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            {settings.footer_text || '© 2025 Heidelberg Services LLC'}
            <a href="/admin" className="absolute right-0 bottom-0 text-xs text-gray-400 hover:text-[#8B1A1A]">
              Admin
            </a>
          </div>
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxUrl(null)}
          onKeyDown={(e) => e.key === 'Escape' && setLightboxUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-2xl text-white hover:bg-white/20"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Gallery"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── VIDEO MODAL ── */}
      {videoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setVideoModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setVideoModal(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-2xl text-white hover:bg-white/20"
          >
            ✕
          </button>
          <video
            src={videoModal}
            controls
            autoPlay
            className="max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  )
}
