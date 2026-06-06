# Mobile Responsiveness Verification Checklist

## Home Page Elements to Test

### Hero Section
- [ ] Main title is readable on small screens (text size adjusts: text-2xl → sm:text-3xl → md:text-4xl)
- [ ] Subtitle is properly sized and wrapped
- [ ] CTA buttons stack vertically on mobile, horizontally on larger screens
- [ ] Call button shows "Get a Free Quote" and is full-width on mobile
- [ ] Stats bar items have proper spacing and icons are visible
- [ ] Scroll indicator is visible at bottom

### Navigation
- [ ] Hamburger menu appears on mobile (<md screens)
- [ ] Mobile menu is easily tappable (buttons are 48px+ tall)
- [ ] Company name is visible on mobile
- [ ] Navigation links are clearly readable

### Services Section
- [ ] Section title scales properly: text-2xl → sm:text-3xl → md:text-4xl
- [ ] Service cards display 1 per row on mobile, 2 on sm, 3 on lg
- [ ] Card padding is reduced on mobile (px-4 py-3 → sm:px-6 sm:py-6)
- [ ] Icons are visible and properly sized
- [ ] Text content is readable on all screen sizes

### Pricing Section
- [ ] Section heading is responsive
- [ ] Pricing legend has proper text wrapping and sizing
- [ ] Pricing cards are 1 column on mobile, 2 on sm, 3 on lg
- [ ] Text inside cards is readable (text-xs sm:text-sm)
- [ ] Price values are clearly visible
- [ ] "Call for custom sizes" button is properly sized

### Gallery Section
- [ ] Section heading is responsive
- [ ] Filter buttons are tappable (not too small on mobile)
- [ ] Filter buttons wrap properly with gap-2 spacing
- [ ] Photo grid displays properly (columns-1 → sm:columns-2 → lg:columns-3)
- [ ] Images maintain aspect ratio
- [ ] Lightbox modal is usable on mobile (navigation buttons are visible)

### Reviews Section
- [ ] Section heading is responsive
- [ ] Review cards stack 1 per row on mobile, 2 on sm, 3 on lg
- [ ] Card padding is properly reduced on mobile
- [ ] Star rating is visible and properly sized
- [ ] Review text is readable
- [ ] Customer name and location are clearly visible

### Contact Section
- [ ] Section heading is responsive
- [ ] CTA buttons fill width on mobile, are auto-width on sm+
- [ ] Phone number button shows "Call/Text {number}"
- [ ] WhatsApp button is visible and accessible
- [ ] Email address is properly wrapped and clickable
- [ ] Social media icons are properly sized and tappable

### Footer
- [ ] Footer displays 1 column on mobile, 2 on sm, 3 on lg
- [ ] Text sizes are reduced on mobile (text-xs → sm:text-sm)
- [ ] Company logo is visible
- [ ] Navigation links are readable
- [ ] Contact information (phone, email, address) is accessible
- [ ] Copyright year is visible

## Admin Panel Elements (if applicable)

- [ ] Login form is properly sized on mobile
- [ ] Form inputs are tappable (min 48px tall on mobile)
- [ ] Tab navigation is accessible on mobile
- [ ] Settings form fields are properly laid out
- [ ] Button sizes are appropriate for mobile

## Touch/Tap Testing

All clickable elements should be:
- [ ] Minimum 44x44 pixels for touch targets (48x48 recommended)
- [ ] Properly spaced from other interactive elements
- [ ] Clearly visible with good contrast

## Performance Checklist

- [ ] Build completes without errors: `npm run build`
- [ ] No TypeScript errors reported
- [ ] No console warnings or errors on home page
- [ ] Page loads quickly on mobile (aim for < 3s on 4G)

## Screen Size Testing

Test these breakpoints:
- [ ] 320px (Small phones)
- [ ] 375px (iPhone SE/6/7/8)
- [ ] 390px (iPhone 12/13/14)
- [ ] 640px (sm breakpoint)
- [ ] 768px (iPad/md breakpoint)
- [ ] 1024px (lg breakpoint)
- [ ] 1920px+ (Desktop)

## Database Setup

After fixing responsive design, complete this:
- [ ] Read DATABASE_SETUP.md
- [ ] Open Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Copy and run the provided SQL commands
- [ ] Verify the admin "Featured Items" tab works correctly
- [ ] Test marking items as featured

## Sign-Off

All items checked? Great! Your site is now:
✅ Mobile responsive
✅ Touch-friendly
✅ Error-handling improved
✅ Ready for mobile users
