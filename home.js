/* ==========================================================================
   WuBu — home page only
   The live Clocktastic desktop mockup and its opacity slider, plus the
   spark burst on the role tag. Loads after site.js.
   ========================================================================== */
(function () {
  var reduceM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var zones = [["SF","America/Los_Angeles"],["NYC","America/New_York"],["LON","Europe/London"],["TYO","Asia/Tokyo"]];
  var zEl = document.getElementById("zones");
  zEl.innerHTML = zones.map(function (z) { return '<div><span><i class="dn"></i>' + z[0] + '</span><b data-tz="' + z[1] + '">--:--</b></div>'; }).join("");
  var rt = "";
  for (var k = 0; k < 60; k++) {
    var an = k * Math.PI / 30, q = k % 15 === 0, r1 = q ? 51 : 53, r2 = 57;
    rt += '<line class="tk' + (q ? ' q' : '') + '" x1="' + (60 + Math.cos(an) * r1).toFixed(2) + '" y1="' + (60 + Math.sin(an) * r1).toFixed(2) + '" x2="' + (60 + Math.cos(an) * r2).toFixed(2) + '" y2="' + (60 + Math.sin(an) * r2).toFixed(2) + '"/>';
  }
  document.getElementById("rticks").innerHTML = rt;
  var prg = document.getElementById("prg"), FOCUS = 25 * 60 * 1000, focusEnd = Date.now() + FOCUS, lastSec = -1;
  function pad(n) { return String(n).padStart(2, "0"); }
  function fmt(d, o) { return new Intl.DateTimeFormat("en-CA", o).format(d); }
  function setDg(id, v) { var el = document.getElementById(id); if (el.textContent !== v) { el.textContent = v; el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip"); } }
  function perSecond(now) {
    var h = "", m = "", ap = "";
    new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(now).forEach(function (p) {
      if (p.type === "hour") h = p.value; if (p.type === "minute") m = p.value; if (p.type === "dayPeriod") ap = p.value.toUpperCase();
    });
    setDg("hh", h); setDg("mm", m); setDg("ss", pad(now.getSeconds()));
    document.getElementById("ap").textContent = ap;
    document.getElementById("d").textContent = [fmt(now, { weekday: "long" }), fmt(now, { month: "long", day: "numeric" }), now.getFullYear()].join(" · ").toUpperCase();
    document.getElementById("menuTime").textContent = fmt(now, { weekday: "short" }) + " " + h + ":" + m + " " + ap;
    var off = -now.getTimezoneOffset(), sign = off >= 0 ? "+" : "−", ao = Math.abs(off);
    document.getElementById("tzo").textContent = "UTC" + sign + pad(Math.floor(ao / 60)) + ":" + pad(ao % 60);
    var pct = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 864;
    document.getElementById("dayBar").style.width = pct.toFixed(2) + "%";
    document.getElementById("dayPct").textContent = pct.toFixed(1).padStart(4, "0") + "%";
    zEl.querySelectorAll("b").forEach(function (b) {
      var parts = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: b.dataset.tz }).formatToParts(now), zh = 0, zm = "";
      parts.forEach(function (p) { if (p.type === "hour") zh = +p.value % 24; if (p.type === "minute") zm = p.value; });
      b.textContent = pad(zh) + ":" + zm;
      b.previousElementSibling.firstChild.className = "dn" + (zh >= 6 && zh < 18 ? " day" : "");
    });
    var left = focusEnd - now.getTime();
    if (left <= 0) { focusEnd = now.getTime() + FOCUS; left = FOCUS; }
    var ls = Math.ceil(left / 1000);
    document.getElementById("focus").textContent = "Focus " + pad(Math.floor(ls / 60)) + ":" + pad(ls % 60);
    document.getElementById("focusBar").style.width = (left / FOCUS * 100).toFixed(1) + "%";
  }
  function loop() {
    var now = new Date(), s = now.getSeconds() + now.getMilliseconds() / 1000;
    prg.setAttribute("stroke-dasharray", (reduceM ? Math.floor(s) : s) / 60 * 100 + " 100");
    if (now.getSeconds() !== lastSec) { lastSec = now.getSeconds(); perSecond(now); }
    if (!reduceM) requestAnimationFrame(loop);
  }
  loop(); if (reduceM) setInterval(loop, 1000);

  var op = document.getElementById("op"), opv = document.getElementById("opv"), clock = document.getElementById("clock");
  function setOp() { clock.style.setProperty("--glass", op.value / 100); opv.textContent = op.value + "%"; }
  op.addEventListener("input", setOp); setOp();

  // Drag the clock around the mock desktop, kept below the menu bar. The position is stored as
  // percentages of the desk so it scales with the page; arrow keys nudge it when it has focus.
  var desk = clock.parentElement, MENU = 26, drag = null;
  function place(x, y) {
    var dw = desk.clientWidth, dh = desk.clientHeight;
    x = Math.max(0, Math.min(x, dw - clock.offsetWidth));
    y = Math.max(MENU, Math.min(y, dh - clock.offsetHeight));
    clock.style.left = (x / dw * 100) + "%"; clock.style.top = (y / dh * 100) + "%"; clock.style.right = "auto";
  }
  clock.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    drag = { id: e.pointerId, dx: e.clientX - clock.offsetLeft, dy: e.clientY - clock.offsetTop };
    clock.setPointerCapture(e.pointerId); clock.classList.add("dragging"); e.preventDefault();
  });
  clock.addEventListener("pointermove", function (e) {
    if (drag && e.pointerId === drag.id) place(e.clientX - drag.dx, e.clientY - drag.dy);
  });
  function drop(e) { if (drag && e.pointerId === drag.id) { drag = null; clock.classList.remove("dragging"); } }
  clock.addEventListener("pointerup", drop); clock.addEventListener("pointercancel", drop);
  clock.addEventListener("keydown", function (e) {
    var step = e.shiftKey ? 40 : 10, k = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (k) { e.preventDefault(); place(clock.offsetLeft + k[0], clock.offsetTop + k[1]); }
  });
  addEventListener("resize", function () { if (clock.style.right === "auto") place(clock.offsetLeft, clock.offsetTop); });

  document.getElementById("roleTag").addEventListener("mouseenter", function (e) { window.river && window.river.burst(e.currentTarget); });
})();
