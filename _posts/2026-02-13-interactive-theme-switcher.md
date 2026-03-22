---
layout: post
title: "Interactive JavaScript: Building a Theme Switcher"
date: 2026-02-13 14:30:00 -0800
categories: tutorial javascript
tags: [javascript, interactive, css, dom, themes]
---

# Building an Interactive Theme Switcher 🎨

Let's create a cool theme switcher that demonstrates modern JavaScript DOM manipulation and CSS custom properties.

## The HTML Structure

First, let's set up our basic HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Theme Switcher Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <h1>🚀 Theme Switcher Demo</h1>
        <div class="theme-controls">
            <button class="theme-btn" data-theme="dark">🌙 Dark</button>
            <button class="theme-btn" data-theme="light">☀️ Light</button>
            <button class="theme-btn" data-theme="retro">🕹️ Retro</button>
            <button class="theme-btn" data-theme="neon">⚡ Neon</button>
        </div>
    </header>
    
    <main class="content">
        <section class="demo-section">
            <h2>Interactive Content</h2>
            <p>This theme switcher demonstrates how CSS custom properties and JavaScript work together.</p>
            
            <div class="code-display">
                <h3>Sample Code Block</h3>
                <pre><code class="javascript">
const greet = (name) => {
  return `Hello, ${name}! 👋`;
};

console.log(greet('Developer'));
                </code></pre>
            </div>
        </section>
    </main>
    
    <script src="theme-switcher.js"></script>
</body>
</html>
```

## CSS with Custom Properties

Here's the CSS that makes our theme switching possible:

```css
:root {
  /* Default (Dark) Theme */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --accent: #00ff88;
  --accent-secondary: #00ffff;
  --border: rgba(0, 255, 136, 0.3);
  --shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

/* Light Theme */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent: #007bff;
  --accent-secondary: #28a745;
  --border: rgba(0, 123, 255, 0.3);
  --shadow: 0 0 20px rgba(0, 123, 255, 0.2);
}

/* Retro Theme */
[data-theme="retro"] {
  --bg-primary: #2d1b2e;
  --bg-secondary: #3d2b3e;
  --text-primary: #f7f3e9;
  --text-secondary: #d4af37;
  --accent: #ff6b35;
  --accent-secondary: #f7931e;
  --border: rgba(255, 107, 53, 0.4);
  --shadow: 0 0 20px rgba(255, 107, 53, 0.3);
}

/* Neon Theme */
[data-theme="neon"] {
  --bg-primary: #000814;
  --bg-secondary: #001d3d;
  --text-primary: #ffd60a;
  --text-secondary: #ffc300;
  --accent: #ff006e;
  --accent-secondary: #8338ec;
  --border: rgba(255, 0, 110, 0.5);
  --shadow: 0 0 30px rgba(255, 0, 110, 0.4);
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.header {
  background: var(--bg-secondary);
  padding: 2rem;
  border-bottom: 3px solid var(--accent);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.theme-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.theme-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--accent);
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-weight: 500;
}

.theme-btn:hover {
  background: var(--accent);
  color: var(--bg-primary);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.theme-btn.active {
  background: var(--accent);
  color: var(--bg-primary);
  box-shadow: var(--shadow);
}

.content {
  padding: 3rem 2rem;
}

.demo-section h2 {
  color: var(--accent);
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.code-display {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
}

pre {
  background: var(--bg-primary) !important;
  border: 1px solid var(--border);
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
}

code {
  color: var(--accent-secondary);
}
```

## The JavaScript Magic

And here's the interactive JavaScript that brings it all together:

```javascript
class ThemeSwitcher {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.buttons = document.querySelectorAll('.theme-btn');
    this.init();
  }

  init() {
    // Apply saved theme
    this.applyTheme(this.currentTheme);
    
    // Add event listeners
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const theme = e.target.dataset.theme;
        this.switchTheme(theme);
      });
    });

    // Update active button
    this.updateActiveButton();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            this.switchTheme('dark');
            break;
          case '2':
            e.preventDefault();
            this.switchTheme('light');
            break;
          case '3':
            e.preventDefault();
            this.switchTheme('retro');
            break;
          case '4':
            e.preventDefault();
            this.switchTheme('neon');
            break;
        }
      }
    });
  }

  switchTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.updateActiveButton();
    localStorage.setItem('theme', theme);
    
    // Add a fun transition effect
    document.body.style.transform = 'scale(0.95)';
    setTimeout(() => {
      document.body.style.transform = 'scale(1)';
    }, 150);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  updateActiveButton() {
    this.buttons.forEach(button => {
      button.classList.remove('active');
      if (button.dataset.theme === this.currentTheme) {
        button.classList.add('active');
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitcher();
  
  // Add some fun console messages
  console.log('🎨 Theme Switcher loaded!');
  console.log('💡 Try keyboard shortcuts: Ctrl/Cmd + 1-4');
});
```

## Key Features Explained

### 1. **CSS Custom Properties**
- We use CSS variables for easy theme switching
- All themes are defined in the root scope
- Smooth transitions between themes

### 2. **Local Storage Persistence**
- User's theme choice is saved and restored
- Consistent experience across page reloads

### 3. **Keyboard Shortcuts**
- Ctrl/Cmd + 1-4 for quick theme switching
- Accessible and power-user friendly

### 4. **Smooth Animations**
- Transition effects when switching themes
- Hover effects on buttons
- Scale animation for visual feedback

## Try It Out!

This theme switcher demonstrates:
- Modern ES6 class syntax
- DOM manipulation best practices
- CSS custom properties
- Local storage usage
- Keyboard event handling
- Smooth animations and transitions

Perfect for modern web applications! 🚀