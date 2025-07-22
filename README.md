# Kat & Ben Wedding Website

A beautiful, modern wedding website with smooth scroll animations and responsive design.

## Features

- ✨ **Smooth Scroll Animations** - Elements fade in and slide as you scroll
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🎨 **Modern Design** - Clean, elegant styling with beautiful gradients
- 🎯 **Smooth Navigation** - Fixed navbar with smooth scrolling to sections
- 🌟 **Interactive Elements** - Hover effects and animations throughout
- 📸 **Interactive Timeline** - Scrollytelling timeline with photos and quotes

## How to Use

1. **Open the website**: Simply open `index.html` in your web browser
2. **Customize content**: Edit the HTML file to change text, dates, and details
3. **Modify styling**: Update `styles.css` to change colors, fonts, and layout
4. **Add functionality**: Enhance `script.js` for additional features

## File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # JavaScript for interactions
└── README.md       # This file
```

## Customization Guide

### Changing Content

Edit `index.html` to update:
- Names and wedding details
- Venue information
- Date and time
- Timeline photos and quotes (via CSV files)

### Changing Colors

In `styles.css`, look for these color variables:
- Hero gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Text colors: `#2c3e50`, `#555`, `#666`
- Background colors: `#f8f9fa`, `white`

### Adding Timeline Content

The timeline photos and quotes are loaded from CSV files:
- `Timelines/Wedding Planning - Photo Timeline.csv` - Contains photo titles and dates
- `Timelines/Notes for Wedding Website.csv` - Contains quotes and dates

Add photos to the `Photos/` directory with matching filenames from the CSV.

### Modifying Animations

The scroll animations are controlled by CSS classes:
- `.fade-in` - Elements fade in from bottom
- `.slide-in-left` - Elements slide in from left
- `.slide-in-right` - Elements slide in from right

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Performance

The website is optimized for:
- Fast loading times
- Smooth animations (60fps)
- Mobile performance
- SEO-friendly structure

## Deployment

To deploy your website:

1. **GitHub Pages**: Push to GitHub and enable Pages
2. **Netlify**: Drag and drop the folder to Netlify
3. **Vercel**: Connect your GitHub repository
4. **Traditional hosting**: Upload files to any web server

## Tips for Best Results

1. **Images**: Use optimized images (WebP format recommended)
2. **Fonts**: The website uses Google Fonts (Playfair Display & Inter)
3. **Testing**: Test on different devices and browsers
4. **Content**: Keep text concise and engaging
5. **Updates**: Regularly update with new information

## Support

If you need help customizing the website:
1. Check the CSS comments for guidance
2. Test changes in browser developer tools
3. Keep backups of your original files

---

Made with ❤️ for your special day! 