---
layout: post
title: "Welcome to My Jekyll Code Blog!"
date: 2026-02-15 15:41:00 -0800
categories: blog welcome
tags: [jekyll, blog, coding, welcome]
---

# Hello World! 👋

Welcome to my new Jekyll-powered blog! This is where I'll be sharing code examples, tutorials, and my thoughts on software development.

## What Makes This Blog Special?

- **Modern Jekyll** with interactive features
- **Clean, readable code examples** with syntax highlighting
- **Retro graphics** mixed with modern design
- **Fast loading** and mobile-friendly

## Example Code

Here's a simple Python example to get us started:

```python
def fibonacci(n):
    """Generate Fibonacci sequence up to n terms"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

# Generate first 10 Fibonacci numbers
numbers = fibonacci(10)
print(numbers)  # Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## JavaScript Example

And here's a modern JavaScript snippet:

```javascript
// Modern ES6+ way to handle API calls
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    
    return {
      success: true,
      data: userData
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Usage
fetchUserData(123).then(result => {
  if (result.success) {
    console.log('User data:', result.data);
  } else {
    console.log('Error:', result.error);
  }
});
```

## What's Coming Next?

Stay tuned for more posts about:
- Advanced Jekyll customization
- Modern CSS techniques
- JavaScript frameworks and libraries
- Backend development tips
- DevOps and deployment strategies

Thanks for visiting! 🚀