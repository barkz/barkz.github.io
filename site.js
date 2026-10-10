/* ==========================================================================
   WuBu — shared behaviour, every page
   The orb clock, the particle river that flows out of it around the page's
   headline and down the full page, and the copy-email buttons.
   Each page provides: <canvas id="river">, a .orb#orb with the orb clock
   markup, and a headline #heroName. The home-page desktop mockup lives in
   home.js.
   ========================================================================== */

/* ---------- Orb mini clock ---------- */
(function () {
  var reduceM = matchMedia("(prefers-reduced-motion: reduce)").matches, rt = "";
  if (!document.getElementById("oticks")) return;
  for (var k = 0; k < 60; k++) {
    var an = k * Math.PI / 30, q = k % 15 === 0, r1 = q ? 51 : 53, r2 = 57;
    rt += '<line class="tk' + (q ? ' q' : '') + '" x1="' + (60 + Math.cos(an) * r1).toFixed(2) + '" y1="' + (60 + Math.sin(an) * r1).toFixed(2) + '" x2="' + (60 + Math.cos(an) * r2).toFixed(2) + '" y2="' + (60 + Math.sin(an) * r2).toFixed(2) + '"/>';
  }
  document.getElementById("oticks").innerHTML = rt;
  var prg = document.getElementById("oprg"), last = -1;
  function pad(n) { return String(n).padStart(2, "0"); }
  function setDg(id, v) { var el = document.getElementById(id); if (el.textContent !== v) { el.textContent = v; el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip"); } }
  function loop() {
    var now = new Date(), s = now.getSeconds() + now.getMilliseconds() / 1000;
    prg.setAttribute("stroke-dasharray", (reduceM ? Math.floor(s) : s) / 60 * 100 + " 100");
    if (now.getSeconds() !== last) {
      last = now.getSeconds();
      var h = now.getHours() % 12 || 12;
      setDg("ohh", pad(h)); setDg("omm", pad(now.getMinutes()));
      document.getElementById("oss").textContent = pad(last);
      document.getElementById("oap").textContent = now.getHours() < 12 ? "AM" : "PM";
    }
    if (!reduceM) requestAnimationFrame(loop);
  }
  loop(); if (reduceM) setInterval(loop, 1000);
})();

/* ---------- Particle river ----------
   The river leaves the orb, wraps the page headline, then meanders down the
   left margin to the bottom of the page, so it stays alive wherever you
   scroll. Grains track their distance along the path in px (d), so a longer
   page means a longer river, not a faster one. */
(function () {
  var canvas = document.getElementById("river"), orbEl = document.getElementById("orb"), nameEl = document.getElementById("heroName");
  if (!canvas || !orbEl || !nameEl) return;
  var ctx = canvas.getContext("2d");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = innerWidth <= 640;
  var COUNT = small ? 800 : 1800, MAX_SPARKS = 180, STEP = 6, MAX_TAIL = 6000, TAIL_DENSITY = 1.1;
  var W = 0, H = 0, dpr = 1, t = 0, running = false, booted = false;
  var path = [], total = 1, heroLen = 1, tailW = 55, grains = [], sparks = [], recycle = 0;
  var mouse = { x: -9999, y: -9999 };

  function rand(a, b) { return a + Math.random() * (b - a); }
  function gauss(sd) { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * sd; }
  var perm = new Uint8Array(512); (function () { var p = []; for (var i = 0; i < 256; i++) p[i] = i; for (i = 255; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, k = p[i]; p[i] = p[j]; p[j] = k; } for (i = 0; i < 512; i++) perm[i] = p[i & 255]; })();
  function fade(x) { return x * x * (3 - 2 * x); }
  function hash(x, y, z) { return perm[(perm[(perm[x & 255] + y) & 255] + z) & 255] / 255; }
  function L(a, b, f) { return a + (b - a) * f; }
  function noise(x, y, z) {
    var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
    return L(L(L(hash(xi, yi, zi), hash(xi + 1, yi, zi), xf), L(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), xf), yf),
             L(L(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), xf), L(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), xf), yf), zf);
  }
  function cr(p0, p1, p2, p3, u) {
    var u2 = u * u, u3 = u2 * u;
    return {
      x: .5 * (2 * p1.x + (p2.x - p0.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (3 * p1.x - p0.x - 3 * p2.x + p3.x) * u3),
      y: .5 * (2 * p1.y + (p2.y - p0.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (3 * p1.y - p0.y - 3 * p2.y + p3.y) * u3)
    };
  }
  function layout() {
    var sy = scrollY, o = orbEl.getBoundingClientRect(), n = nameEl.getBoundingClientRect();
    if (!o.width || !n.width) return false;
    var ox = o.left + o.width / 2, oy = o.top + o.height / 2 + sy;
    var Lx = n.left, R = n.right, T = n.top + sy, B = n.bottom + sy, cx = (Lx + R) / 2, cy = (T + B) / 2, M = small ? 34 : 60, top = T - M * 2.2;
    // Below the headline the river settles into the left margin: centred in it, kept clear of the text
    var gx = Math.max(Lx - M * 1.2, Lx * .5, 8), amp = Math.min(M * .35, (Lx - gx) * .25);
    tailW = Math.max(5, Math.min(55, (Lx - gx) * .7));
    var wp = [
      { x: ox, y: oy }, { x: Math.min(R + M * .2, ox - M), y: top }, { x: (R + cx) / 2, y: top - M * .2 }, { x: cx, y: top - M * .3 },
      { x: Lx + M * .2, y: top + M * .4 }, { x: Math.max(Lx - M * 1.4, 4), y: T + M * .3 }, { x: Math.max(Lx - M * 1.8, 2), y: cy },
      { x: Math.max(Lx - M * 1.4, 4), y: B - M * .2 }, { x: Lx - M * .8, y: B + M * 1.5 }, { x: gx, y: B + M * 3.6 }
    ];
    var heroEnd = wp.length - 1, docH = document.documentElement.scrollHeight, endY = Math.max(docH - 30, B + M * 3.6 + 200);
    for (var y = B + M * 3.6 + 420, k = 1; y < endY - 200; y += 420, k++) wp.push({ x: gx + Math.sin(k * 1.7) * amp, y: y });
    wp.push({ x: gx, y: endY });

    // Sample the spline densely, then resample at an even STEP px so distance along the path is uniform
    var dense = [], n1 = wp.length - 1, len = 0, prev = null;
    for (var i = 0; i < n1; i++) {
      for (var s = 0; s < 24; s++) {
        var p = cr(wp[Math.max(0, i - 1)], wp[i], wp[i + 1], wp[Math.min(n1, i + 2)], s / 24);
        if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
        p.len = len; dense.push(p); prev = p;
        if (i === heroEnd && s === 0) heroLen = len;
      }
    }
    var last = wp[n1]; len += Math.hypot(last.x - prev.x, last.y - prev.y); dense.push({ x: last.x, y: last.y, len: len });
    total = len;
    var pts = [], N = Math.ceil(total / STEP), j = 0;
    for (s = 0; s <= N; s++) {
      var d = Math.min(s * STEP, total);
      while (j < dense.length - 2 && dense[j + 1].len < d) j++;
      var a = dense[j], b = dense[j + 1], f = (d - a.len) / ((b.len - a.len) || 1);
      pts.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f,
        // widens through the hero as before, then narrows to fit the margin
        w: d < heroLen ? 18 + 37 * d / heroLen : tailW + (55 - tailW) * Math.max(0, 1 - (d - heroLen) / 300) });
    }
    for (s = 0; s <= N; s++) {
      var a2 = pts[Math.max(0, s - 2)], b2 = pts[Math.min(N, s + 2)], dx = b2.x - a2.x, dy = b2.y - a2.y, l = Math.hypot(dx, dy) || 1;
      pts[s].nx = -dy / l; pts[s].ny = dx / l;
    }
    path = pts; return true;
  }
  function at(d) {
    var f = Math.max(0, Math.min(total, d)) / STEP, last = path.length - 1, i = Math.min(Math.floor(f), last - 1), u = f - i, a = path[i], b = path[i + 1];
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, nx: a.nx, ny: a.ny, w: a.w };
  }
  function nearest(x, y) {
    var best = Infinity, bi = 0;
    for (var i = 0; i < path.length; i += 3) { var p = path[i], d = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y); if (d < best) { best = d; bi = i; } }
    return bi * STEP;
  }

  // Hero grains are born at the orb; tail grains fade in anywhere below the headline
  function Grain(tail) { this.off = rand(0, 1000); this.tail = tail; this.reset(); }
  Grain.prototype.reset = function () {
    this.speed = rand(.00018, .00045) * heroLen; this.life = 0; this.max = rand(6000, 10800);
    this.size = rand(.7, 2.2); this.bright = rand(150, 255); this.lane = gauss(.45); this.warm = 0;
    if (this.tail) { this.d = rand(heroLen, total); this.place(); return; }
    var a = rand(0, Math.PI * 2), r = rand(1, 6), o = path[0], sp = rand(.02, .06);
    this.x = o.x + Math.cos(a) * r; this.y = o.y + Math.sin(a) * r; this.vx = Math.cos(a) * sp; this.vy = Math.sin(a) * sp;
    this.d = rand(-.27, -.03) * heroLen;
  };
  Grain.prototype.place = function () {
    var q = at(this.d);
    this.x = q.x + q.nx * this.lane * q.w; this.y = q.y + q.ny * this.lane * q.w; this.vx = this.vy = 0;
  };
  Grain.prototype.update = function (sy) {
    this.life++; this.d += this.speed;
    if (this.d >= total || this.life > this.max) { this.reset(); return; }
    // More than a screen away: just ride the path, skip the physics
    if (this.y < sy - H || this.y > sy + H * 2) { if (this.d >= 0) this.place(); return; }
    if (this.d >= 0) {
      var q = at(this.d), tx = q.x + q.nx * this.lane * q.w, ty = q.y + q.ny * this.lane * q.w, dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
      if (d > 1) { var st = Math.min(this.d / heroLen * .165 + .008, .04); this.vx += dx / d * st; this.vy += dy / d * st; }
    }
    var ang = noise(this.x * .003 + this.off, this.y * .003, t) * Math.PI * 4;
    this.vx += Math.cos(ang) * .012; this.vy += Math.sin(ang) * .012;
    var mx = this.x - mouse.x, my = this.y - (mouse.y + sy), md = Math.hypot(mx, my);
    if (md < 120 && md > 1) { var f = .25 * (1 - md / 120); this.vx += mx / md * f; this.vy += my / md * f; }
    this.vx *= .97; this.vy *= .97;
    var spd = Math.hypot(this.vx, this.vy); if (spd > 1.1) { this.vx *= 1.1 / spd; this.vy *= 1.1 / spd; }
    this.x += this.vx; this.y += this.vy;
  };
  Grain.prototype.draw = function (sy) {
    var y = this.y - sy; if (y < -50 || y > H + 50) return;
    var a = Math.min(this.life / 100, 1) * Math.min(this.d > total - 200 ? (total - this.d) / 200 : 1, this.life > this.max * .95 ? (this.max - this.life) / (this.max * .05) : 1) * .8;
    if (a <= .01) return;
    var h = this.d / heroLen, dim = h < .7 ? 1 : Math.max(.85, 1 - .55 * (h - .7) / .3), g = this.bright * dim, k = this.warm, r0 = g * .93, g0 = g * .88, b0 = g;
    ctx.fillStyle = "rgba(" + ((r0 + (255 - r0) * k) | 0) + "," + ((g0 + (184 - g0) * k) | 0) + "," + ((b0 + (112 - b0) * k) | 0) + "," + a.toFixed(3) + ")";
    ctx.fillRect(this.x - this.size / 2, y - this.size / 2, this.size, this.size);
  };
  function Spark(x, y) {
    var a = rand(0, Math.PI * 2), s = rand(4, 12), m = Math.random();
    this.x = x; this.y = y; this.vx = Math.cos(a) * s; this.vy = Math.sin(a) * s;
    this.life = 0; this.max = rand(90, 200); this.size = rand(1.5, 3.5); this.g = (126 + 58 * m) | 0; this.b = (80 + 32 * m) | 0; this.done = false; // #FF7E50 to #FFB870
  }
  Spark.prototype.update = function () {
    this.life++;
    if (this.life < 20) { this.vx *= .92; this.vy *= .92; this.vy += .08; }
    else {
      var q = at(nearest(this.x, this.y)), dx = q.x - this.x, dy = q.y - this.y, d = Math.hypot(dx, dy);
      if (d > 2) { this.vx += dx / d * .15; this.vy += dy / d * .15; }
      this.vx *= .95; this.vy *= .95;
      if (d < 8) this.done = true;
    }
    this.x += this.vx; this.y += this.vy;
  };
  Spark.prototype.draw = function (sy) {
    var y = this.y - sy, a = Math.min(this.life / 5, 1) * (this.life > this.max * .6 ? Math.max(0, (this.max - this.life) / (this.max * .4)) : 1);
    if (a <= .01) return;
    ctx.fillStyle = "rgba(255," + this.g + "," + this.b + "," + a.toFixed(3) + ")";
    ctx.beginPath(); ctx.arc(this.x, y, this.size / 2, 0, Math.PI * 2); ctx.fill();
  };

  // Keep the tail as dense as the margin is wide; called whenever the page height changes
  function fillTail() {
    var want = Math.min(MAX_TAIL, Math.round(Math.max(0, total - heroLen) * TAIL_DENSITY * tailW / 55)), have = grains.length - COUNT;
    for (; have < want; have++) { var g = new Grain(true); g.life = (Math.random() * g.max * .5) | 0; grains.push(g); }
    if (have > want) { grains.length = COUNT + want; recycle %= grains.length; }
  }
  function relayout() { if (layout()) fillTail(); }

  function size() { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function render() {
    var sy = scrollY; ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < grains.length; i++) grains[i].draw(sy);
    for (i = 0; i < sparks.length; i++) sparks[i].draw(sy);
  }
  var count = 0;
  function frame() {
    if (!running) return;
    t += .001; count++;
    if (count % 90 === 0) relayout();
    var sy = scrollY;
    for (var i = 0; i < grains.length; i++) grains[i].update(sy);
    for (i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i]; s.update();
      if (s.done) { var g = grains[recycle]; g.reset(); g.x = s.x; g.y = s.y; g.vx = s.vx * .3; g.vy = s.vy * .3; g.d = nearest(s.x, s.y); g.warm = 1; recycle = (recycle + 1) % grains.length; sparks.splice(i, 1); }
      else if (s.life > s.max) sparks.splice(i, 1);
    }
    render();
    requestAnimationFrame(frame);
  }
  function start() { if (!running && booted && !reduce) { running = true; requestAnimationFrame(frame); } }
  function burst(el) {
    if (!booted) return;
    var r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2 + scrollY;
    var n = Math.min(rand(40, 70) | 0, MAX_SPARKS - sparks.length);
    for (var i = 0; i < n; i++) sparks.push(new Spark(x, y));
    start();
  }
  function boot() {
    if (booted || !layout()) return;
    booted = true; size(); layout();
    for (var i = 0; i < COUNT; i++) {
      var g = new Grain(false); g.d = rand(-.27, .9) * heroLen;
      if (g.d >= 0) g.place();
      g.life = (Math.random() * g.max * .5) | 0; grains.push(g);
    }
    fillTail();
    for (var f = 0; f < 180; f++) { t += .001; for (i = 0; i < grains.length; i++) grains[i].update(scrollY); }
    render();
    start();
  }
  // home.js bursts sparks from the role tag
  window.river = { burst: burst };

  addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
  addEventListener("resize", function () { small = innerWidth <= 640; size(); if (booted) { relayout(); if (!running) render(); } });
  // With reduced motion the river is a still image, redrawn as the page scrolls
  addEventListener("scroll", function () { if (booted && !running) render(); }, { passive: true });
  orbEl.addEventListener("click", function () { burst(orbEl); });

  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(function () { setTimeout(boot, reduce ? 0 : 150); });
})();

/* ---------- Copy-email buttons ---------- */
document.querySelectorAll("[data-copy]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var text = btn.dataset.copy, addr = btn.previousElementSibling;
    function done() { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy email"; }, 1800); }
    function fallback() { var r = document.createRange(); r.selectNodeContents(addr); var s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "Press ⌘C"; }
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  });
});
