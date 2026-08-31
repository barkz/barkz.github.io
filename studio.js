/* ==========================================================================
   WuBu — "The Studio" shared behaviour
   Ambient light field, nav state, scroll reveals, newsletter form.
   Home-page choreography (the expanding frame, the clock, the timeline)
   lives inline in index.html. Blog rendering lives in blog.js.
   ========================================================================== */

/* Paste the endpoint from Buttondown -> Settings -> Embedding.
   Until it contains a real username the form stays in preview mode and
   tells the visitor to email instead of silently dropping the address. */
var SUBSCRIBE_URL = 'https://buttondown.com/api/emails/embed-subscribe/YOUR-USERNAME';

/* Observe .rev elements inside root and fade them in. Exposed so pages that
   inject markup after load (the blog index) can reveal it too. */
function studioReveal(root) {
    var revs = [].slice.call((root || document).querySelectorAll('.rev'));
    if (!('IntersectionObserver' in window)) {
        revs.forEach(function (el) { el.classList.add('on'); });
        return;
    }
    var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
        });
    }, { threshold: .15 });
    revs.forEach(function (el) { io.observe(el); });
}

(function () {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.add('ready');

    /* ---- ambient drifting light field ---- */
    var cv = document.getElementById('amb');
    if (cv && cv.getContext) {
        var cx = cv.getContext('2d'), W, H;
        var blobs = [
            { x: .22, y: .18, r: .52, c: [123, 63, 191], p: 0, s: .00023 },
            { x: .78, y: .32, r: .44, c: [91, 45, 142], p: 2, s: .00019 },
            { x: .55, y: .82, r: .50, c: [255, 126, 80], p: 4, s: .00015 }
        ];
        var size = function () { W = cv.width = innerWidth; H = cv.height = innerHeight; };
        size();
        addEventListener('resize', size);
        (function loop(t) {
            cx.clearRect(0, 0, W, H);
            blobs.forEach(function (b) {
                var x = (b.x + Math.sin(t * b.s + b.p) * .09) * W,
                    y = (b.y + Math.cos(t * b.s * 1.3 + b.p) * .07) * H,
                    r = b.r * Math.max(W, H);
                var g = cx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, 'rgba(' + b.c[0] + ',' + b.c[1] + ',' + b.c[2] + ',.20)');
                g.addColorStop(1, 'rgba(' + b.c[0] + ',' + b.c[1] + ',' + b.c[2] + ',0)');
                cx.fillStyle = g;
                cx.beginPath();
                cx.arc(x, y, r, 0, 6.3);
                cx.fill();
            });
            if (!reduce) requestAnimationFrame(loop);
        })(0);
    }

    /* ---- nav frosts once you leave the top ---- */
    var nav = document.getElementById('nav');
    if (nav) {
        var queued = false;
        var mark = function () { queued = false; nav.classList.toggle('solid', scrollY > 50); };
        addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(mark); } }, { passive: true });
        mark();
    }

    studioReveal(document);
})();

/* ---- newsletter ----
   Buttondown's embed endpoint does not answer cross-origin reads, so the
   response is opaque: we cannot tell a real subscribe from a rejected
   address. The copy leans on the confirmation email instead of claiming
   success. Swap SUBSCRIBE_URL for a Worker that proxies the Buttondown API
   and this can report true errors. */
function handleSubscribe(event) {
    event.preventDefault();
    var form = event.target;
    var status = document.getElementById('quiet-status');
    var btn = form.querySelector('.quiet-btn');

    if (form.website && form.website.value) return;          /* bot filled the honeypot */

    if (SUBSCRIBE_URL.indexOf('YOUR-USERNAME') !== -1) {
        status.textContent = 'The list is not hooked up yet — email us@wubu.ai and we will add you by hand.';
        return;
    }

    btn.disabled = true;
    status.textContent = 'Sending...';
    fetch(SUBSCRIBE_URL, { method: 'POST', mode: 'no-cors', body: new FormData(form) })
        .then(function () {
            status.textContent = 'Now check your inbox and confirm — that is the whole signup.';
            form.reset();
        })
        .catch(function () {
            status.textContent = 'That did not go through. Email us@wubu.ai and we will add you.';
        })
        .then(function () { btn.disabled = false; });
}
