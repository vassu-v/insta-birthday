# Birthdaygram

An Instagram-style birthday invitation UI with swipeable carousels and interactive features.

## Features

- **Instagram-inspired Design**: Clean, modern interface matching Instagram's visual language
- **Swipeable Carousels**: Touch and mouse drag support for smooth navigation
- **Two Featured Posts**:
  - Birthday Details: 5-slide invitation with date, theme, location, and RSVP
  - Memories: 4-slide photo carousel showcasing birthday memories
- **Interactive Elements**: Like, comment, share, and bookmark functionality
- **Wishes Modal**: Custom comment system for birthday wishes
- **Responsive Design**: Optimized for mobile devices (430px max-width)
- **Accessibility**: ARIA labels, keyboard navigation, and focus management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:3000`

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - CSS styles with Instagram-inspired design
- `script.js` - JavaScript functionality and carousel controls
- `package.json` - Project configuration and dependencies

## Customization

The birthday invitation content can be easily customized by editing the carousel slides in `index.html`. Each slide contains structured content for different aspects of the invitation:

- **Intro Card**: Welcome message and birthday person's name
- **Date Card**: Event date and time
- **Theme Card**: Party theme and dress code
- **Location Card**: Venue information
- **RSVP Card**: Contact information and RSVP button

## Browser Support

- Modern browsers with ES6+ support
- Touch events for mobile devices
- Web Share API for native sharing (where supported)
- Vibration API for haptic feedback (where supported)

## License

MIT License