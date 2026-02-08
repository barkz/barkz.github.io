# barkz.github.io
Personal Input/Output

## About This Blog

This is a **retro-minimalist interactive blog** built with vanilla HTML, CSS, and JavaScript, featuring:

- 🖥️ Retro 1980s computer terminal aesthetic
- ⌨️ Monospace typography and neon green accents
- ✨ Minimalist design that "comes alive" with interactions
- 📺 Optional CRT scanline effect
- 🎮 Hidden easter eggs and interactive features
- 📱 Fully responsive design

## Interactive Features

### Click Interactions
- **Widgets**: Click any widget (About, Links, Tags) to expand/collapse
- **Double-click Header**: Toggle all widgets at once

### Keyboard Shortcuts
- **'S' Key**: Toggle CRT scanline effect on/off
- **Konami Code** (↑↑↓↓←→←→BA): Activate secret "Matrix Mode"

### Hover Effects
- Links glow with animated underlines
- Tags fill with animated backgrounds
- Blog posts show enhanced borders
- Widgets highlight with neon glow

### On-Load Animations
- Typewriter effect for site title
- Blinking cursor animation
- Blog posts fade in on scroll
- Smooth staggered animations

## Structure

```
barkz.github.io/
├── index.html              # Main blog page with retro markup
├── styles.css              # Retro-minimalist stylesheet with animations
├── interactive.js          # JavaScript for interactive features
├── blog-post-template.md   # Template for creating new posts
├── posts/                  # Directory for blog post markdown files
│   └── 2026-02-06-welcome-to-my-blog.md
└── README.md               # This file
```

## Design Philosophy

**Minimalist by Default**: The page loads with a clean, retro aesthetic. Widgets are collapsed, reducing visual clutter.

**Alive on Interaction**: When users engage (click, hover, type), the blog comes alive with:
- Smooth animations
- Glowing effects
- Dynamic content reveals
- Easter egg surprises

**Retro Aesthetic**: Inspired by 1980s computer terminals with:
- Monospace fonts (Courier New)
- Neon green (#00ff41) and amber (#ffb000) colors
- Black terminal header/footer
- ASCII-style decorative elements
- Optional CRT scanlines

## Features

### Layout
- **Header**: Full-width header with site title and subtitle
- **Sidebar**: Left-aligned navigation with three widgets
- **Main Content**: Right-aligned blog posts area
- **Footer**: Full-width footer with copyright information

### Widgets
1. **About Widget**: Personal introduction and bio
2. **Useful Links Widget**: External links (GitHub, Twitter, LinkedIn, etc.)
3. **Tags Widget**: Tag cloud for content categorization

### Blog Posts
- Responsive card-based design
- Post metadata (date and tags)
- Clean typography
- Easy to read content area

## How to Add a New Blog Post

### Option 1: Manual HTML (Quick)
1. Open `index.html`
2. Copy an existing `<article class="blog-post">` block
3. Update the title, date, tags, and content
4. Save and push to GitHub

### Option 2: Using Markdown (Recommended)
1. Use `blog-post-template.md` as a starting point
2. Create a new file in the `posts/` directory: `YYYY-MM-DD-post-title.md`
3. Write your content in markdown
4. Convert to HTML manually or set up a static site generator (Jekyll, Hugo, etc.)
5. Add the HTML to `index.html`

## Customization

### Update About Widget
Edit the `.about-widget` section in `index.html` with your personal information.

### Update Links
Modify the `.links-widget` section in `index.html` with your actual social media and website links.

### Update Tags
Add or remove tags in the `.tags-widget` section as you write more posts.

### Styling
All styles are in `styles.css`. The retro color scheme uses CSS custom properties:
- `--retro-bg`: Terminal black (#0a0a0a)
- `--retro-accent`: Neon green (#00ff41)
- `--retro-secondary`: Amber/gold (#ffb000)
- `--retro-paper`: Cream background (#f4f1e8)

### Interactive Features
Edit `interactive.js` to modify:
- Widget toggle behavior
- Animation timings
- Easter egg codes
- Notification messages

## Technologies

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, animations, flexbox
- **Vanilla JavaScript**: No dependencies, ~230 lines
- **Features**: IntersectionObserver, event listeners, CSS animations

## Deployment

This site is designed for GitHub Pages:

1. Push your changes to the `main` branch
2. Enable GitHub Pages in repository settings
3. Your site will be available at `https://barkz.github.io`

## Browser Support

The blog uses modern CSS (Flexbox) and should work in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Feel free to use this template for your own blog. No attribution required.

## Future Enhancements

Consider adding:
- More retro sound effects
- Additional keyboard shortcuts
- Theme switcher (retro vs modern)
- More easter eggs
- Particle effects
- Retro loading animations
- Static site generator integration (Jekyll/Hugo)
- Search functionality
- Archive page
- RSS feed
- Comments section
