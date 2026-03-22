---
layout: post
title: "CSS Grid vs Flexbox: When to Use What"
date: 2026-02-14 10:00:00 -0800
categories: tutorial css
tags: [css, grid, flexbox, layout, frontend]
---

# CSS Grid vs Flexbox: A Practical Guide

Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes. Let's explore when to use each one with practical examples.

## Quick Summary

- **Flexbox** = One-dimensional layout (row or column)
- **CSS Grid** = Two-dimensional layout (rows and columns)

## Flexbox Example: Navigation Bar

Perfect for horizontal navigation layouts:

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #1a1a1a;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  color: #00ff88;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #88ffcc;
}
```

```html
<nav class="navbar">
  <div class="logo">🚀 Barkz</div>
  <ul class="nav-links">
    <li><a href="/">Home</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/projects">Projects</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

## CSS Grid Example: Card Layout

Perfect for complex two-dimensional layouts:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.card p {
  line-height: 1.6;
  opacity: 0.9;
}
```

```html
<div class="card-grid">
  <div class="card">
    <h3>🎨 Frontend</h3>
    <p>Modern HTML, CSS, and JavaScript techniques for building beautiful user interfaces.</p>
  </div>
  <div class="card">
    <h3>⚡ Backend</h3>
    <p>Server-side development with Node.js, Python, and database management.</p>
  </div>
  <div class="card">
    <h3>🚀 DevOps</h3>
    <p>Deployment, CI/CD, containerization, and cloud infrastructure automation.</p>
  </div>
</div>
```

## When to Choose What?

### Use Flexbox when:
- Creating navigation bars
- Centering content
- Distributing space between items
- One-dimensional layouts

### Use CSS Grid when:
- Creating complex layouts
- You need both rows and columns
- Building responsive card grids
- Two-dimensional positioning

## Pro Tip: Combine Both!

You can use Grid for the overall layout and Flexbox for components within grid items:

```css
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header {
  grid-area: header;
  display: flex; /* Flexbox inside Grid! */
  justify-content: space-between;
  align-items: center;
}
```

Happy coding! 🎉