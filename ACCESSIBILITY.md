# Accessibility Guide

This document outlines the accessibility features implemented in the customer web app to ensure WCAG 2.1 Level AA compliance.

## Keyboard Navigation

### Focus Management
- All interactive elements are keyboard accessible
- Visible focus indicators on all focusable elements
- Logical tab order throughout the application
- Focus trap in modals to prevent focus from escaping
- Skip to content link for keyboard users

### Keyboard Shortcuts
- `Tab` - Navigate forward through interactive elements
- `Shift + Tab` - Navigate backward through interactive elements
- `Enter` or `Space` - Activate buttons and links
- `Escape` - Close modals and dropdowns
- Arrow keys - Navigate through lists and carousels

## Screen Reader Support

### ARIA Labels and Roles
- All interactive elements have descriptive ARIA labels
- Proper ARIA roles for custom components
- ARIA live regions for dynamic content updates
- ARIA invalid for form validation errors
- ARIA expanded/collapsed for expandable sections

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3, etc.)
- Semantic landmarks (header, nav, main, footer)
- Lists for grouped content
- Buttons for actions, links for navigation
- Form labels properly associated with inputs

### Screen Reader Announcements
- Toast notifications use `role="alert"` and `aria-live="polite"`
- Loading states announced to screen readers
- Error messages announced immediately
- Success confirmations announced after actions

## Visual Accessibility

### Color Contrast
- Text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have sufficient contrast
- Focus indicators have 3:1 contrast ratio
- Error states use both color and icons

### Text Sizing
- Base font size: 16px (1rem)
- Responsive text sizing for different screen sizes
- Text can be resized up to 200% without loss of functionality
- Line height: 1.5 for body text

### Visual Indicators
- Focus visible on all interactive elements
- Hover states for interactive elements
- Active states for buttons and links
- Loading indicators for async operations
- Error states with icons and text

## Touch Accessibility

### Touch Targets
- Minimum touch target size: 44x44px (iOS) / 48x48px (Android)
- Adequate spacing between touch targets
- Touch-friendly controls on mobile devices
- `touch-action: manipulation` to prevent double-tap zoom

### Mobile Optimizations
- Bottom navigation for easy thumb access
- Larger tap targets on mobile
- Swipe gestures for carousels
- Pull-to-refresh for lists

## Form Accessibility

### Input Fields
- All inputs have associated labels
- Required fields marked with asterisk and aria-required
- Error messages linked to inputs via aria-describedby
- Helper text for complex inputs
- Autocomplete attributes for common fields

### Validation
- Inline validation with clear error messages
- Error summary at top of form
- Focus moved to first error on submit
- Success confirmation after form submission

### OTP Input
- Each digit input has descriptive aria-label
- Paste support for OTP codes
- Auto-focus next input on digit entry
- Backspace navigation between inputs

## Component Accessibility

### Buttons
- Descriptive text or aria-label
- Disabled state with reduced opacity
- Loading state with spinner and disabled interaction
- Focus visible indicator

### Modals
- Focus trap to keep focus within modal
- Escape key to close
- Focus returned to trigger element on close
- Backdrop click to close
- Proper ARIA attributes (role="dialog", aria-modal="true")

### Navigation
- Current page indicated with aria-current="page"
- Descriptive link text
- Skip navigation link for keyboard users
- Mobile bottom navigation for easy access

### Product Cards
- Keyboard accessible with Enter/Space activation
- Descriptive aria-labels for actions
- Rating information accessible to screen readers
- Image alt text describes product

### Cart
- Item count announced to screen readers
- Add/remove actions have descriptive labels
- Quantity controls keyboard accessible
- Empty state with clear messaging

## Testing Recommendations

### Manual Testing
1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Test modal focus trap
   - Verify skip to content link works

2. **Screen Reader Testing**
   - Test with NVDA (Windows) or VoiceOver (Mac/iOS)
   - Verify all content is announced
   - Check form labels and error messages
   - Test dynamic content updates

3. **Visual Testing**
   - Check color contrast with browser tools
   - Test with 200% zoom
   - Verify focus indicators are visible
   - Test with high contrast mode

4. **Touch Testing**
   - Test on mobile devices
   - Verify touch targets are large enough
   - Test swipe gestures
   - Verify no accidental activations

### Automated Testing
- Use axe DevTools browser extension
- Run Lighthouse accessibility audit
- Use WAVE browser extension
- Integrate accessibility tests in CI/CD

## Known Limitations

While we strive for full accessibility, please note:
- We cannot guarantee WCAG compliance without manual testing with assistive technologies
- Some third-party components (Razorpay) may have their own accessibility considerations
- Images require proper alt text from backend data
- Color contrast may vary based on user-uploaded images

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
