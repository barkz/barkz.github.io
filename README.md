# barkz.github.io
Personal Input/Output

## About This Blog

This is a personal blog built with simple HTML and CSS, featuring:

- Clean, responsive design
- Left-hand sidebar with widgets
- Three widgets: About, Useful Links, and Tags
- Full-width header and footer
- Markdown template for creating blog posts

## Structure

```
barkz.github.io/
├── index.html              # Main blog page
├── styles.css              # Stylesheet for the blog
├── blog-post-template.md   # Template for creating new posts
├── posts/                  # Directory for blog post markdown files
│   └── 2026-02-06-welcome-to-my-blog.md
└── README.md               # This file
```

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
All styles are in `styles.css`. Customize colors, fonts, and layout to match your preferences.

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
- Static site generator integration (Jekyll/Hugo)
- Search functionality
- Archive page
- RSS feed
- Comments section
- Dark mode toggle
