# Tsatsaku Frontend

Next.js frontend application for the Tsatsaku platform with authentication pages.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd e:\test\tsatsaku-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to:
```
http://localhost:3000
```

## Pages Available

### 1. Home Page (`/`)
- Automatically redirects to login page
- Access: http://localhost:3000/

### 2. Login Page (`/login`)
- Clean, modern login form
- Email and password fields
- Remember me checkbox
- Forgot password link
- Link to registration page
- Access: http://localhost:3000/login

### 3. Registration Page (`/register`)
- Multi-field registration form
- Real-time password strength meter
- Form validation
- Responsive design
- Link to login page
- Access: http://localhost:3000/register

### 4. Forgot Password Page (`/forgot-password`)
- Email input for password reset
- Success confirmation state
- Back to login link
- Access: http://localhost:3000/forgot-password

## Features

### ✅ Responsive Design
- Mobile-first approach
- Works on desktop, tablet, and mobile
- Clean, modern UI with TailwindCSS

### ✅ Form Validation
- Client-side validation
- Password strength indicator
- Required field validation
- Email format validation

### ✅ Interactive Elements
- Loading states on form submission
- Smooth transitions and animations
- Hover effects on buttons and links
- Focus states for accessibility

### ✅ Consistent Styling
- Global CSS theme
- Reusable component classes
- Brand colors and typography
- Consistent spacing and shadows

## Design System

### Colors
- Primary Blue: `#2563eb` (brand-600)
- Light Blue: `#3b82f6` (brand-500)
- Dark Blue: `#1d4ed8` (brand-700)
- Slate colors for text and backgrounds

### Typography
- Font: Inter (Google Fonts)
- Font weights: 400, 500, 600, 700

### Components
- `.auth-card` - Authentication card container
- `.form-card` - Form wrapper card
- `.btn-primary` - Primary blue button
- `.btn-brand` - Brand colored button
- `.input-field` - Standard input styling
- `.brand-logo` - Logo component

## File Structure

```
/pages
  ├── _app.jsx          # Main app component with global CSS
  ├── index.jsx         # Home page (redirects to login)
  ├── login.jsx         # Login page
  ├── register.jsx      # Registration page
  └── forgot-password.jsx # Forgot password page

/styles
  └── globals.css       # Global styles and theme

/public
  └── (static assets)

package.json            # Dependencies and scripts
next.config.js         # Next.js configuration
tailwind.config.js     # Tailwind CSS configuration
postcss.config.js      # PostCSS configuration
.env.local             # Environment variables
```

## Testing the Pages

### Manual Testing Checklist

#### Login Page
- [ ] Page loads without errors
- [ ] Logo displays correctly
- [ ] Email validation works
- [ ] Password field is secure (masked)
- [ ] Remember me checkbox works
- [ ] Form submission shows loading state
- [ ] "Forgot password?" link works
- [ ] "Create Account" link works
- [ ] Responsive on mobile/tablet/desktop

#### Registration Page
- [ ] Page loads without errors
- [ ] All form fields work
- [ ] Password strength meter updates in real-time
- [ ] Confirm password validation works
- [ ] Company field is optional
- [ ] Grid layout works on desktop (2 columns for name)
- [ ] Form submission shows loading state
- [ ] "Sign In" link works
- [ ] Responsive design works

#### Forgot Password Page
- [ ] Page loads without errors
- [ ] Email field validation works
- [ ] Form submission shows loading state
- [ ] Success state displays correctly
- [ ] "Back to login" link works

### Browser Testing
Test in these browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Device Testing
- [ ] Mobile (iPhone/Android)
- [ ] Tablet (iPad)
- [ ] Desktop (1920x1080)
- [ ] Large screens (2560x1440)

## Next Steps

1. Connect to backend API endpoints
2. Implement JWT token handling
3. Add error handling and user feedback
4. Create dashboard pages for logged-in users
5. Add role-based routing protection

## Environment Variables

Create `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Tsatsaku
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```