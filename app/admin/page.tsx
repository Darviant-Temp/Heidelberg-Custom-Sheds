'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_KEY = 'hcs_admin'
const ADMIN_PASSWORD = 'heidelberg2025'

const SETTING_KEYS = [
  'hero_title',
  'hero_subtitle',
  'hero_bg_image',
  'company_name',
  'phone',
  'email',
  'cta_button_text',
  'footer_text',
  'instagram_url',
  'tiktok_url',
  'logo_url',
] as const

type Tab = 'settings' | 'media' | 'reviews' | 'pricing' | 'featured'

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
  id: number
  customer_name: string
  location: string
  review_text: string
  stars: number
  service_type?: string | null
  featured?: boolean
  featured_order?: number | null
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

const CATEGORIES = ['Storage', 'Office', 'Barn', 'Custom']
const EMPTY_PRICING: PricingRow = {
  size: '',
  style: '',
  no_foundation: '',
  wood_foundation: '',
  concrete_foundation: '',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('settings')

  const [settings, setSettings] = useState<Record<string, string>>({})
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsToast, setSettingsToast] = useState(false)
  const [settingsError, setSettingsError] = useState('')

  const [photos, setPhotos] = useState<Photo[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageCategory, setImageCategory] = useState('Storage')
  const [imageAlt, setImageAlt] = useState('')
  const [imageDescription, setImageDescription] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoCategory, setVideoCategory] = useState('Storage')
  const [videoDescription, setVideoDescription] = useState('')
  const [videoUploading, setVideoUploading] = useState(false)
  const [mediaError, setMediaError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [mediaSearch, setMediaSearch] = useState('')

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    customer_name: '',
    location: '',
    review_text: '',
    stars: 5,
    service_type: '',
  })
  const [reviewSaving, setReviewSaving] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null)

  const [pricing, setPricing] = useState<PricingRow[]>([])
  const [pricingLoading, setPricingLoading] = useState(false)
  const [pricingError, setPricingError] = useState('')
  const [savingRowId, setSavingRowId] = useState<number | 'new' | null>(null)
  const [deletingPricingId, setDeletingPricingId] = useState<number | null>(null)
  const [newRow, setNewRow] = useState<PricingRow>({ ...EMPTY_PRICING })

  const [featuredPhotos, setFeaturedPhotos] = useState<number[]>([])
  const [featuredReviews, setFeaturedReviews] = useState<number[]>([])
  const [featuredPricing, setFeaturedPricing] = useState<(number | undefined)[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(ADMIN_KEY) === 'true') setAuthed(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, 'true')
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('Incorrect password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY)
    setAuthed(false)
    setPassword('')
  }

  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true)
    setSettingsError('')
    try {
      const { data, error } = await supabase.from('settings').select('key, value')
      if (error) throw error
      const map: Record<string, string> = {}
      for (const row of data ?? []) {
        if (row.key) map[row.key] = row.value ?? ''
      }
      setSettings(map)
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setSettingsLoading(false)
    }
  }, [])

  const fetchPhotos = useCallback(async () => {
    setPhotosLoading(true)
    setMediaError('')
    try {
      const { data, error } = await supabase.from('photos').select('*').order('id', { ascending: false })
      if (error) throw error
      setPhotos((data as Photo[]) ?? [])
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setPhotosLoading(false)
    }
  }, [])

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true)
    setReviewError('')
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('id', { ascending: false })
      if (error) throw error
      setReviews((data as Review[]) ?? [])
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setReviewsLoading(false)
    }
  }, [])

  const fetchPricing = useCallback(async () => {
    setPricingLoading(true)
    setPricingError('')
    try {
      const { data, error } = await supabase.from('pricing').select('*').order('size')
      if (error) throw error
      setPricing((data as PricingRow[]) ?? [])
    } catch (err) {
      setPricingError(err instanceof Error ? err.message : 'Failed to load pricing')
    } finally {
      setPricingLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    if (tab === 'settings') fetchSettings()
    if (tab === 'media') fetchPhotos()
    if (tab === 'reviews') fetchReviews()
    if (tab === 'pricing') fetchPricing()
  }, [authed, tab, fetchSettings, fetchPhotos, fetchReviews, fetchPricing])

  const saveSettings = async () => {
    setSettingsSaving(true)
    setSettingsError('')
    try {
      const rows = SETTING_KEYS.map((key) => ({ key, value: settings[key] ?? '' }))
      const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' })
      if (error) throw error
      setSettingsToast(true)
      setTimeout(() => setSettingsToast(false), 3000)
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const addPhoto = async () => {
    if (!imageFile) {
      setMediaError('Please select an image file')
      return
    }
    setImageUploading(true)
    setMediaError('')
    try {
      const filePath = `photos/${Date.now()}_${imageFile.name}`
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) {
        console.error('Upload error:', error)
        setMediaError(error.message)
        return
      }

      const { data: urlData, error: publicUrlError } = supabase.storage.from('media').getPublicUrl(filePath)
      if (publicUrlError) {
        throw publicUrlError
      }

      const { error: insertError } = await supabase.from('photos').insert({
        image_url: urlData?.publicUrl,
        category: imageCategory,
        file_type: 'image',
      })
      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }
      setImageFile(null)
      setImagePreview(null)
      setImageAlt('')
      setImageDescription('')
      await fetchPhotos()
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Failed to add photo')
    } finally {
      setImageUploading(false)
    }
  }

  const addVideo = async () => {
    setVideoUploading(true)
    setMediaError('')
    try {
      let finalUrl = videoUrl
      if (videoFile) {
        const filePath = `videos/${Date.now()}_${videoFile.name}`
        const { data, error } = await supabase.storage
          .from('media')
          .upload(filePath, videoFile, {
            cacheControl: '3600',
            upsert: true,
          })

        if (error) {
          console.error('Upload error:', error)
          setMediaError(error.message)
          return
        }

        const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath)
        finalUrl = urlData.publicUrl
      }
      if (!finalUrl) {
        setMediaError('Please provide a video URL or upload a file')
        return
      }
      const videoInsert: Record<string, unknown> = {
        video_url: finalUrl,
        file_type: 'video',
        category: videoCategory,
      }

      const { error: insertError } = await supabase.from('photos').insert(videoInsert)
      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }
      setVideoFile(null)
      setVideoUrl('')
      setVideoDescription('')
      await fetchPhotos()
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Failed to add video')
    } finally {
      setVideoUploading(false)
    }
  }

  const deletePhoto = async (photo: Photo) => {
    setDeletingId(photo.id)
    setMediaError('')
    try {
      const url = photo.image_url || photo.video_url
      if (url) {
        const match = url.match(/\/media\/(.+)$/)
        if (match) {
          await supabase.storage.from('media').remove([match[1]])
        }
      }
      const { error } = await supabase.from('photos').delete().eq('id', photo.id)
      if (error) throw error
      await fetchPhotos()
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Failed to delete media')
    } finally {
      setDeletingId(null)
    }
  }

  const addReview = async () => {
    if (!reviewForm.customer_name || !reviewForm.review_text) {
      setReviewError('Name and review text are required')
      return
    }
    setReviewSaving(true)
    setReviewError('')
    try {
      const { error } = await supabase.from('reviews').insert(reviewForm)
      if (error) throw error
      setReviewForm({ customer_name: '', location: '', review_text: '', stars: 5, service_type: '' })
      await fetchReviews()
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to add review')
    } finally {
      setReviewSaving(false)
    }
  }

  const deleteReview = async (id: number) => {
    setDeletingReviewId(id)
    setReviewError('')
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id)
      if (error) throw error
      await fetchReviews()
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to delete review')
    } finally {
      setDeletingReviewId(null)
    }
  }

  const savePricingRow = async (row: PricingRow) => {
    if (!row.id) return
    setSavingRowId(row.id)
    setPricingError('')
    try {
      const { error } = await supabase
        .from('pricing')
        .update({
          size: row.size,
          style: row.style,
          no_foundation: row.no_foundation,
          wood_foundation: row.wood_foundation,
          concrete_foundation: row.concrete_foundation,
        })
        .eq('id', row.id)
      if (error) throw error
    } catch (err) {
      setPricingError(err instanceof Error ? err.message : 'Failed to save row')
    } finally {
      setSavingRowId(null)
    }
  }

  const addPricingRow = async () => {
    setSavingRowId('new')
    setPricingError('')
    try {
      const { error } = await supabase.from('pricing').insert(newRow)
      if (error) throw error
      setNewRow({ ...EMPTY_PRICING })
      await fetchPricing()
    } catch (err) {
      setPricingError(err instanceof Error ? err.message : 'Failed to add row')
    } finally {
      setSavingRowId(null)
    }
  }

  const deletePricingRow = async (id: number) => {
    setDeletingPricingId(id)
    setPricingError('')
    try {
      const { error } = await supabase.from('pricing').delete().eq('id', id)
      if (error) throw error
      await fetchPricing()
    } catch (err) {
      setPricingError(err instanceof Error ? err.message : 'Failed to delete row')
    } finally {
      setDeletingPricingId(null)
    }
  }

  const updatePricingField = (id: number, field: keyof PricingRow, value: string) => {
    setPricing((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-xl bg-gray-800 p-8 shadow-xl">
          <h1 className="mb-6 text-center text-2xl font-bold text-white">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-[#8B1A1A] focus:outline-none"
          />
          {loginError && <p className="mb-4 text-sm text-red-400">{loginError}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#8B1A1A] py-3 font-semibold text-white transition-colors hover:bg-[#6B0000]"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'settings', label: 'Settings' },
    { id: 'media', label: 'Media' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'featured', label: 'Featured Items' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-[#8B1A1A]">Heidelberg</span> Admin
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm transition-colors hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-[#8B1A1A] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div className="rounded-xl bg-gray-800 p-6">
            {settingsLoading ? (
              <p className="text-gray-400">Loading settings...</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {SETTING_KEYS.map((key) => {
                    if (key === 'hero_bg_image') {
                      return (
                        <div key={key} className="sm:col-span-2">
                          <label className="mb-1 block text-sm text-gray-400">hero bg image</label>
                          <input
                            type="text"
                            placeholder="Image URL or upload below"
                            value={settings.hero_bg_image ?? ''}
                            onChange={(e) => setSettings((s) => ({ ...s, hero_bg_image: e.target.value }))}
                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-[#8B1A1A] focus:outline-none"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setSettingsError('')
                              const filePath = `hero/${Date.now()}_${file.name}`
                              const { data, error } = await supabase.storage
                                .from('media')
                                .upload(filePath, file, {
                                  cacheControl: '3600',
                                  upsert: true,
                                })

                              if (error) {
                                console.error('Upload error:', error)
                                setSettingsError(error.message)
                                return
                              }

                              const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath)
                              const newSettings = { ...settings, hero_bg_image: urlData.publicUrl }
                              setSettings(newSettings)
                              
                              // Auto-save the settings
                              try {
                                const rows = SETTING_KEYS.map((key) => ({ key, value: newSettings[key] ?? '' }))
                                await supabase.from('settings').upsert(rows, { onConflict: 'key' })
                                setSettingsToast(true)
                                setTimeout(() => setSettingsToast(false), 3000)
                              } catch (err) {
                                console.error('Auto-save failed:', err)
                                setSettingsError('Image uploaded but settings save failed')
                              }
                              
                              e.target.value = ''
                            }}
                            className="mt-2 w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#8B1A1A] file:px-4 file:py-2 file:text-white"
                          />
                          {settings.hero_bg_image && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={settings.hero_bg_image}
                              alt="Hero background preview"
                              className="mt-2 h-32 w-full rounded object-cover"
                            />
                          )}
                        </div>
                      )
                    }
                    if (key === 'logo_url') {
                      return (
                        <div key={key} className="sm:col-span-2">
                          <label className="mb-1 block text-sm text-gray-400">logo</label>
                          <input
                            type="text"
                            placeholder="Logo URL or upload below"
                            value={settings.logo_url ?? ''}
                            onChange={(e) => setSettings((s) => ({ ...s, logo_url: e.target.value }))}
                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-[#8B1A1A] focus:outline-none"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setSettingsError('')
                              const filePath = `logos/${Date.now()}_${file.name}`
                              const { data, error } = await supabase.storage
                                .from('media')
                                .upload(filePath, file, {
                                  cacheControl: '3600',
                                  upsert: true,
                                })

                              if (error) {
                                console.error('Upload error:', error)
                                setSettingsError(error.message)
                                return
                              }

                              const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath)
                              const newSettings = { ...settings, logo_url: urlData.publicUrl }
                              setSettings(newSettings)
                              
                              // Auto-save the settings
                              try {
                                const rows = SETTING_KEYS.map((key) => ({ key, value: newSettings[key] ?? '' }))
                                await supabase.from('settings').upsert(rows, { onConflict: 'key' })
                                setSettingsToast(true)
                                setTimeout(() => setSettingsToast(false), 3000)
                              } catch (err) {
                                console.error('Auto-save failed:', err)
                                setSettingsError('Image uploaded but settings save failed')
                              }
                              
                              e.target.value = ''
                            }}
                            className="mt-2 w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#8B1A1A] file:px-4 file:py-2 file:text-white"
                          />
                          {settings.logo_url && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={settings.logo_url}
                              alt="Logo preview"
                              className="mt-2 h-12 w-12 rounded object-contain"
                            />
                          )}
                        </div>
                      )
                    }
                    return (
                      <div key={key}>
                        <label className="mb-1 block text-sm text-gray-400">{key.replace(/_/g, ' ')}</label>
                        <input
                          type="text"
                          value={settings[key] ?? ''}
                          onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                          className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-[#8B1A1A] focus:outline-none"
                        />
                      </div>
                    )
                  })}
                </div>
                {settingsError && <p className="mt-4 text-sm text-red-400">{settingsError}</p>}
                {settingsToast && (
                  <p className="mt-4 rounded-lg bg-green-600/20 px-4 py-2 text-sm text-green-400">
                    Settings saved successfully!
                  </p>
                )}
                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={settingsSaving}
                  className="mt-6 rounded-lg bg-[#8B1A1A] px-6 py-3 font-semibold transition-colors hover:bg-[#6B0000] disabled:opacity-50"
                >
                  {settingsSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </>
            )}
          </div>
        )}

        {/* MEDIA TAB */}
        {tab === 'media' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gray-800 p-6">
                <h2 className="mb-4 font-semibold text-[#8B1A1A]">Add Photo</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="mb-4 w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#8B1A1A] file:px-4 file:py-2 file:text-white"
                />
                {imagePreview && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imagePreview} alt="Preview" className="mb-4 max-h-40 rounded-lg object-cover" />
                )}
                <select
                  value={imageCategory}
                  onChange={(e) => setImageCategory(e.target.value)}
                  className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Alt text (optional)"
                />
                 {/* Description field - temporarily hidden until DB supports it
                 
                 <textarea
                   value={imageDescription}
                   onChange={(e) => setImageDescription(e.target.value)}
                   placeholder="Description (optional)"
                   rows={3}
                   className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm"
                 />
                
                 */}`n<button
                  type="button"
                  onClick={addPhoto}
                  disabled={imageUploading}
                  className="rounded-lg bg-[#8B1A1A] px-4 py-2 font-semibold disabled:opacity-50"
                >
                  {imageUploading ? 'Uploading...' : 'Add Photo'}
                </button>
              </div>

              <div className="rounded-xl bg-gray-800 p-6">
                <h2 className="mb-4 font-semibold text-[#8B1A1A]">Add Video</h2>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  className="mb-4 w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#8B1A1A] file:px-4 file:py-2 file:text-white"
                />
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Or paste video URL"
                  className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2"
                />
                <select
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addVideo}
                  disabled={videoUploading}
                  className="rounded-lg bg-[#8B1A1A] px-4 py-2 font-semibold disabled:opacity-50"
                >
                  {videoUploading ? 'Uploading...' : 'Add Video'}
                </button>
              </div>
            </div>

            {mediaError && <p className="text-sm text-red-400">{mediaError}</p>}

            <div className="rounded-xl bg-gray-800 p-6">
              <h2 className="mb-4 font-semibold">Existing Media</h2>
              {!photosLoading && photos.length > 0 && (
                <input
                  type="text"
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  placeholder="Search by description, category, or type..."
                  className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400"
                />
              )}
              {photosLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : photos.length === 0 ? (
                <p className="text-gray-400">No media yet.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {photos
                     .filter((photo) => {
                       if (!mediaSearch) return true
                       const searchLower = mediaSearch.toLowerCase()
                       return (
                         photo.category?.toLowerCase().includes(searchLower) ||
                         photo.file_type?.toLowerCase().includes(searchLower) ||
                         photo.description?.toLowerCase().includes(searchLower)
                       )
                     })
                     .map((photo) => (
                    <div key={photo.id} className="overflow-hidden rounded-lg bg-gray-700">
                      {photo.file_type === 'video' || photo.video_url ? (
                        <div className="flex aspect-video items-center justify-center bg-gray-900 text-3xl">▶</div>
                      ) : photo.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={photo.image_url} alt="" className="aspect-square w-full object-cover" />
                      ) : (
                        <div className="flex aspect-square items-center justify-center text-gray-500">?</div>
                      )}
                      <div className="p-3">
                        <p className="text-xs text-gray-400">{photo.category} · {photo.file_type}</p>
                        {photo.description && (
                          <p className="mt-2 text-xs text-gray-300 line-clamp-2">{photo.description}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => deletePhoto(photo)}
                          disabled={deletingId === photo.id}
                          className="mt-2 w-full rounded bg-red-600/80 py-1 text-xs font-medium hover:bg-red-600 disabled:opacity-50"
                        >
                          {deletingId === photo.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === 'reviews' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-gray-800 p-6">
              <h2 className="mb-4 font-semibold text-[#8B1A1A]">Add Review</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Customer name"
                  value={reviewForm.customer_name}
                  onChange={(e) => setReviewForm((f) => ({ ...f, customer_name: e.target.value }))}
                  className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={reviewForm.location}
                  onChange={(e) => setReviewForm((f) => ({ ...f, location: e.target.value }))}
                  className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Service type"
                  value={reviewForm.service_type}
                  onChange={(e) => setReviewForm((f) => ({ ...f, service_type: e.target.value }))}
                  className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Stars:</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="stars"
                        checked={reviewForm.stars === n}
                        onChange={() => setReviewForm((f) => ({ ...f, stars: n }))}
                      />
                      {n}
                    </label>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Review text"
                value={reviewForm.review_text}
                onChange={(e) => setReviewForm((f) => ({ ...f, review_text: e.target.value }))}
                rows={4}
                className="mt-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2"
              />
              {reviewError && <p className="mt-2 text-sm text-red-400">{reviewError}</p>}
              <button
                type="button"
                onClick={addReview}
                disabled={reviewSaving}
                className="mt-4 rounded-lg bg-[#8B1A1A] px-6 py-2 font-semibold disabled:opacity-50"
              >
                {reviewSaving ? 'Adding...' : 'Add Review'}
              </button>
            </div>

            <div className="rounded-xl bg-gray-800 p-6">
              <h2 className="mb-4 font-semibold">Existing Reviews</h2>
              {reviewsLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-400">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-lg bg-gray-700 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{r.customer_name}</p>
                          <p className="text-sm text-gray-400">
                            {r.location} · {r.stars}★ · {r.service_type}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteReview(r.id)}
                          disabled={deletingReviewId === r.id}
                          className="rounded bg-[#8B1A1A] px-3 py-1 text-xs disabled:opacity-50"
                        >
                          {deletingReviewId === r.id ? '...' : 'Delete'}
                        </button>
                      </div>
                      <p className="text-sm text-gray-300">&ldquo;{r.review_text}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {tab === 'pricing' && (
          <div className="rounded-xl bg-gray-800 p-6">
            {pricingError && <p className="mb-4 text-sm text-red-400">{pricingError}</p>}
            {pricingLoading ? (
              <p className="text-gray-400">Loading pricing...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-600 text-gray-400">
                      <th className="px-2 py-3">Size</th>
                      <th className="px-2 py-3">Style</th>
                      <th className="px-2 py-3">No Foundation</th>
                      <th className="px-2 py-3">Wood</th>
                      <th className="px-2 py-3">Concrete</th>
                      <th className="px-2 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricing.map((row) => (
                      <tr key={row.id} className="border-b border-gray-700">
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.size}
                            onChange={(e) => row.id && updatePricingField(row.id, 'size', e.target.value)}
                            className="w-full min-w-[80px] rounded border border-gray-600 bg-gray-700 px-2 py-1"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <select
                            value={row.style}
                            onChange={(e) => row.id && updatePricingField(row.id, 'style', e.target.value)}
                            className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-white"
                          >
                            <option value="">Select Style</option>
                            <option value="Lean-to">Lean-to</option>
                            <option value="Gable">Gable</option>
                            <option value="Barn">Barn</option>
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.no_foundation}
                            onChange={(e) => row.id && updatePricingField(row.id, 'no_foundation', e.target.value)}
                            className="w-full min-w-[80px] rounded border border-gray-600 bg-gray-700 px-2 py-1"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.wood_foundation}
                            onChange={(e) => row.id && updatePricingField(row.id, 'wood_foundation', e.target.value)}
                            className="w-full min-w-[80px] rounded border border-gray-600 bg-gray-700 px-2 py-1"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.concrete_foundation}
                            onChange={(e) => row.id && updatePricingField(row.id, 'concrete_foundation', e.target.value)}
                            className="w-full min-w-[80px] rounded border border-gray-600 bg-gray-700 px-2 py-1"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => savePricingRow(row)}
                              disabled={savingRowId === row.id}
                              className="rounded bg-green-700 px-2 py-1 text-xs disabled:opacity-50"
                            >
                              {savingRowId === row.id ? '...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => row.id && deletePricingRow(row.id)}
                              disabled={deletingPricingId === row.id}
                              className="rounded bg-[#8B1A1A] px-2 py-1 text-xs disabled:opacity-50"
                            >
                              {deletingPricingId === row.id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-600">
                      {(['size', 'style', 'no_foundation', 'wood_foundation', 'concrete_foundation'] as const).map(
                        (field) => (
                          <td key={field} className="px-2 py-2">
                            <input
                              type="text"
                              value={newRow[field]}
                              onChange={(e) => setNewRow((r) => ({ ...r, [field]: e.target.value }))}
                              placeholder={field.replace(/_/g, ' ')}
                              className="w-full min-w-[80px] rounded border border-gray-600 bg-gray-700 px-2 py-1"
                            />
                          </td>
                        )
                      )}
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={addPricingRow}
                          disabled={savingRowId === 'new'}
                          className="rounded bg-[#8B1A1A] px-3 py-1 text-xs font-semibold disabled:opacity-50"
                        >
                          {savingRowId === 'new' ? 'Adding...' : 'Add Row'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* FEATURED ITEMS TAB */}
        {tab === 'featured' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-gray-800 p-6">
              <h2 className="mb-4 font-semibold text-[#8B1A1A]">Manage Featured Items</h2>
              <p className="mb-4 text-sm text-gray-400">
                Select up to 3-4 items from each category to display as featured content on the home page.
              </p>
              
              <div className="space-y-6">
                {/* Featured Media */}
                <div className="rounded-lg bg-gray-700 p-4">
                  <h3 className="mb-3 font-semibold">Featured Media (up to 4)</h3>
                  <div className="space-y-2">
                    {photos.slice(0, 12).map((photo) => (
                      <label key={photo.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={featuredPhotos.includes(photo.id)}
                          onChange={(e) => {
                            if (e.target.checked && featuredPhotos.length < 4) {
                              setFeaturedPhotos([...featuredPhotos, photo.id])
                            } else if (!e.target.checked) {
                              setFeaturedPhotos(featuredPhotos.filter((id) => id !== photo.id))
                            }
                          }}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm">
                          {photo.category} - {photo.file_type}
                          {photo.description && ` (${photo.description.substring(0, 30)}...)`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Featured Reviews */}
                <div className="rounded-lg bg-gray-700 p-4">
                  <h3 className="mb-3 font-semibold">Featured Reviews (up to 3)</h3>
                  <div className="space-y-2">
                    {reviews.slice(0, 12).map((review) => (
                      <label key={review.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={featuredReviews.includes(review.id)}
                          onChange={(e) => {
                            if (e.target.checked && featuredReviews.length < 3) {
                              setFeaturedReviews([...featuredReviews, review.id])
                            } else if (!e.target.checked) {
                              setFeaturedReviews(featuredReviews.filter((id) => id !== review.id))
                            }
                          }}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm">
                          {review.customer_name} - {review.location} ({review.stars}?)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Featured Pricing */}
                <div className="rounded-lg bg-gray-700 p-4">
                  <h3 className="mb-3 font-semibold">Featured Pricing (up to 3)</h3>
                  <div className="space-y-2">
                    {pricing.slice(0, 12).map((row) => (
                      <label key={row.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={featuredPricing.includes(row.id)}
                          onChange={(e) => {
                            if (e.target.checked && featuredPricing.length < 3) {
                              setFeaturedPricing([...featuredPricing, row.id])
                            } else if (!e.target.checked) {
                              setFeaturedPricing(featuredPricing.filter((id) => id !== row.id))
                            }
                          }}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm">
                          {row.size} - {row.style}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  setFeaturedLoading(true)
                  try {
                    // Update only selected photos to featured = true
                    if (featuredPhotos.length > 0) {
                      const { error } = await supabase
                        .from('photos')
                        .update({ featured: true })
                        .in('id', featuredPhotos)
                      if (error) {
                        console.error('Photo update error:', error)
                        if (error.message?.includes('featured')) {
                          throw new Error(
                            'The "featured" column does not exist in the photos table. Please add it to your Supabase database first.'
                          )
                        }
                        throw new Error(`Failed to save featured photos: ${error.message}`)
                      }
                    }

                    // Update only selected reviews to featured = true
                    if (featuredReviews.length > 0) {
                      const { error } = await supabase
                        .from('reviews')
                        .update({ featured: true })
                        .in('id', featuredReviews)
                      if (error) {
                        console.error('Review update error:', error)
                        if (error.message?.includes('featured')) {
                          throw new Error(
                            'The "featured" column does not exist in the reviews table. Please add it to your Supabase database first.'
                          )
                        }
                        throw new Error(`Failed to save featured reviews: ${error.message}`)
                      }
                    }

                    // Update only selected pricing to featured = true
                    if (featuredPricing.length > 0) {
                      const { error } = await supabase
                        .from('pricing')
                        .update({ featured: true })
                        .in('id', featuredPricing)
                      if (error) {
                        console.error('Pricing update error:', error)
                        if (error.message?.includes('featured')) {
                          throw new Error(
                            'The "featured" column does not exist in the pricing table. Please add it to your Supabase database first.'
                          )
                        }
                        throw new Error(`Failed to save featured pricing: ${error.message}`)
                      }
                    }

                    setSettingsToast(true)
                    setTimeout(() => setSettingsToast(false), 3000)
                  } catch (err) {
                    console.error('Failed to save featured items:', err)
                    setSettingsError(err instanceof Error ? err.message : 'Failed to save featured items')
                  } finally {
                    setFeaturedLoading(false)
                  }
                }}
                disabled={featuredLoading}
                className="mt-6 rounded-lg bg-[#8B1A1A] px-6 py-3 font-semibold transition-colors hover:bg-[#6B0000] disabled:opacity-50"
              >
                {featuredLoading ? 'Saving...' : 'Save Featured Items'}
              </button>

              {settingsError && (
                <div className="mt-4 rounded-lg border border-red-400 bg-red-50 p-4 text-sm text-red-800">
                  <p className="font-semibold mb-2">Error:</p>
                  <p className="mb-2">{settingsError}</p>
                  {settingsError.includes('featured') && (
                    <details className="mt-2 cursor-pointer">
                      <summary className="font-semibold text-red-900">How to fix this issue</summary>
                      <div className="mt-2 ml-2 space-y-2 text-xs text-red-700">
                        <p>1. Go to your Supabase dashboard</p>
                        <p>2. Open the SQL Editor</p>
                        <p>3. Run these commands:</p>
                        <pre className="bg-red-100 p-2 rounded overflow-x-auto font-mono">
{`ALTER TABLE photos ADD COLUMN featured boolean DEFAULT false;
ALTER TABLE photos ADD COLUMN featured_order integer DEFAULT null;
ALTER TABLE reviews ADD COLUMN featured boolean DEFAULT false;
ALTER TABLE reviews ADD COLUMN featured_order integer DEFAULT null;
ALTER TABLE pricing ADD COLUMN featured boolean DEFAULT false;
ALTER TABLE pricing ADD COLUMN featured_order integer DEFAULT null;`}
                        </pre>
                        <p>4. Try saving again</p>
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}





