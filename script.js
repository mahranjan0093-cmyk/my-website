// ========== TYPE EFFECT ==========
const typedEl = document.getElementById('typed');
const phrases = ['Tailwind Designer', 'UI/UX Enthusiast', '3D Parallax', 'Design Expert', 'Problem Solver'];
let pi = 0, ci = 0, del = false;

function typeLoop() {
    const cur = phrases[pi];
    typedEl.textContent = del ? cur.substring(0, ci--) : cur.substring(0, ci++);
    let d = del ? 35 : 75;
    if (!del && ci > cur.length) { d = 2200; del = true; }
    else if (del && ci < 0) { del = false; pi = (pi + 1) % phrases.length; d = 350; }
    setTimeout(typeLoop, d);
}
typeLoop();

// ========== SCROLL PROGRESS ==========
const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (s / h * 100) + '%';
});

// ========== NAV BACKGROUND ==========
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.style.background = 'rgba(6,8,15,.92)';
        nav.style.backdropFilter = 'blur(18px)';
        nav.style.borderBottom = '1px solid rgba(52,211,153,.06)';
    } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.borderBottom = 'none';
    }
});

// ========== ACTIVE NAV ==========
const secs = document.querySelectorAll('section[id]');
const nls = document.querySelectorAll('.nav-a[data-s]');
const obsNav = new IntersectionObserver(e => {
    e.forEach(en => {
        if (en.isIntersecting) {
            nls.forEach(l => l.classList.remove('on'));
            const a = document.querySelector(`.nav-a[data-s="${en.target.id}"]`);
            if (a) a.classList.add('on');
        }
    });
}, { threshold: .3 });
secs.forEach(s => obsNav.observe(s));

// ========== MOBILE MENU ==========
const mobBtn = document.getElementById('mob-btn');
const mobMenu = document.getElementById('mob-menu');

mobBtn.addEventListener('click', () => {
    mobMenu.classList.toggle('active');
    const i = mobBtn.querySelector('i');
    if (mobMenu.classList.contains('active')) {
        i.classList.remove('fa-bars');
        i.classList.add('fa-times');
    } else {
        i.classList.add('fa-bars');
        i.classList.remove('fa-times');
    }
});

function closeMob() {
    mobMenu.classList.remove('active');
    const i = mobBtn.querySelector('i');
    i.classList.add('fa-bars');
    i.classList.remove('fa-times');
}

// ========== REVEAL ON SCROLL ==========
const rvEls = document.querySelectorAll('.rv');
const obsRv = new IntersectionObserver(e => {
    e.forEach(en => {
        if (en.isIntersecting) en.target.classList.add('show');
    });
}, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
rvEls.forEach(el => obsRv.observe(el));

// ========== STAT COUNTER ==========
const statEls = document.querySelectorAll('.stat-val');
const obsSt = new IntersectionObserver(e => {
    e.forEach(en => {
        if (en.isIntersecting) {
            const el = en.target;
            const t = parseInt(el.dataset.t);
            let c = 0;
            const step = Math.ceil(t / 55);
            const iv = setInterval(() => {
                c += step;
                if (c >= t) {
                    c = t;
                    clearInterval(iv);
                }
                el.textContent = c + '+';
            }, 28);
            obsSt.unobserve(el);
        }
    });
}, { threshold: .5 });
statEls.forEach(el => obsSt.observe(el));

// ========== TILT EFFECT ==========
document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y - r.height / 2) / r.height) * -5;
        const ry = ((x - r.width / 2) / r.width) * 5;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ========== TOAST ==========
function toast(m, t) {
    const el = document.getElementById('toast');
    el.textContent = m;
    el.className = 'toast toast-' + t + ' v';
    setTimeout(() => el.classList.remove('v'), 3500);
}

// ========== FORM VALIDATION ==========
document.getElementById('cform').addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;
    
    const flds = [
        { id: 'fname', e: 'fname-e', ck: v => v.trim().length > 0 },
        { id: 'femail', e: 'femail-e', ck: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { id: 'fsubj', e: 'fsubj-e', ck: v => v.trim().length > 0 },
        { id: 'fmsg', e: 'fmsg-e', ck: v => v.trim().length > 0 }
    ];
    
    flds.forEach(f => {
        const inp = document.getElementById(f.id);
        const er = document.getElementById(f.e);
        if (!f.ck(inp.value)) {
            er.classList.add('visible');
            inp.style.borderColor = '#ff5252';
            ok = false;
        } else {
            er.classList.remove('visible');
            inp.style.borderColor = '';
        }
    });
    
    if (ok) {
        toast('Message sent! I will respond soon.', 'ok');
        this.reset();
    } else {
        toast('Please fill all fields correctly.', 'err');
    }
});

// =============================================
// ========== STAR + METEOR CANVAS =============
// =============================================
const cvs = document.getElementById('star-canvas');
const ctx = cvs.getContext('2d');
let W, H;

function resize() {
    W = cvs.width = window.innerWidth;
    H = cvs.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// --- Stars ---
const STAR_COUNT = 250;
const stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * 3000 - 500,
        y: Math.random() * 3000 - 500,
        r: Math.random() * 2 + 0.4,
        baseAlpha: Math.random() * 0.4 + 0.3,
        twinkleSpeed: Math.random() * 1.5 + 0.5,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() < 0.65 ? '#ffffff' : Math.random() < 0.5 ? '#34d399' : '#22d3ee'
    });
}

// --- Meteors ---
const METEOR_COUNT = 4;
const meteors = [];

function createMeteor() {
    const startX = Math.random() * W * 1.2 - W * 0.1;
    const startY = Math.random() * H * 0.4 - 50;
    const angle = Math.PI * 0.55 + Math.random() * 0.35;
    const speed = 0.8 + Math.random() * 1.2;
    const length = 80 + Math.random() * 120;
    return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: length,
        alpha: 0,
        maxAlpha: 0.6 + Math.random() * 0.4,
        life: 0,
        maxLife: 4 + Math.random() * 5,
        phase: 'in',
        width: 1.2 + Math.random() * 1
    };
}

for (let i = 0; i < METEOR_COUNT; i++) {
    const m = createMeteor();
    m.life = Math.random() * m.maxLife;
    m.phase = 'active';
    m.alpha = m.maxAlpha;
    meteors.push(m);
}

// --- Dust particles ---
const DUST_COUNT = 60;
const dusts = [];
for (let i = 0; i < DUST_COUNT; i++) {
    dusts.push({
        x: Math.random() * 3000 - 500,
        y: Math.random() * 3000 - 500,
        r: Math.random() * 0.8 + 0.2,
        vy: -(Math.random() * 0.15 + 0.05),
        vx: (Math.random() - 0.5) * 0.1,
        alpha: Math.random() * 0.25 + 0.05
    });
}

// --- Animation ---
let lastTime = performance.now();

function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const t = now / 1000;

    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const skyGrad = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W * 0.8);
    skyGrad.addColorStop(0, 'rgba(10,30,40,0.15)');
    skyGrad.addColorStop(1, 'rgba(6,8,15,0)');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Nebula glows
    const nebGrad = ctx.createRadialGradient(W * 0.7, H * 0.3, 0, W * 0.7, H * 0.3, 300);
    nebGrad.addColorStop(0, 'rgba(52,211,153,0.018)');
    nebGrad.addColorStop(1, 'rgba(52,211,153,0)');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, W, H);

    const nebGrad2 = ctx.createRadialGradient(W * 0.2, H * 0.7, 0, W * 0.2, H * 0.7, 250);
    nebGrad2.addColorStop(0, 'rgba(34,211,238,0.015)');
    nebGrad2.addColorStop(1, 'rgba(34,211,238,0)');
    ctx.fillStyle = nebGrad2;
    ctx.fillRect(0, 0, W, H);

    // Draw stars
    for (const s of stars) {
        const sx = ((s.x % W) + W) % W;
        const sy = ((s.y % H) + H) % H;
        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.35 + 0.65;
        const alpha = s.baseAlpha * twinkle;
        const r = Math.max(0.2, s.r * (0.85 + twinkle * 0.15));

        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        if (s.r > 1.5) {
            ctx.beginPath();
            ctx.arc(sx, sy, r * 3, 0, Math.PI * 2);
            const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
            glow.addColorStop(0, s.color);
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.globalAlpha = alpha * 0.2;
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1;

    // Draw dust
    for (const d of dusts) {
        d.y += d.vy;
        d.x += d.vx;
        if (d.y < -20) { d.y = H + 20; d.x = Math.random() * W; }
        if (d.x < -20) d.x = W + 20;
        if (d.x > W + 20) d.x = -20;

        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.1, d.r), 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.globalAlpha = d.alpha;
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw meteors
    for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        m.life += dt;

        if (m.phase === 'in') {
            m.alpha += dt * 0.5;
            if (m.alpha >= m.maxAlpha) { m.alpha = m.maxAlpha; m.phase = 'active'; }
        } else if (m.phase === 'active') {
            if (m.life >= m.maxLife * 0.75) m.phase = 'out';
        } else if (m.phase === 'out') {
            m.alpha -= dt * 0.4;
            if (m.alpha <= 0) {
                meteors[i] = createMeteor();
                continue;
            }
        }

        if (m.life > m.maxLife) {
            meteors[i] = createMeteor();
            continue;
        }

        m.x += m.vx;
        m.y += m.vy;

        const tailX = m.x - (m.vx / Math.sqrt(m.vx * m.vx + m.vy * m.vy)) * m.length;
        const tailY = m.y - (m.vy / Math.sqrt(m.vx * m.vx + m.vy * m.vy)) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${m.alpha})`);
        grad.addColorStop(0.15, `rgba(52,211,153,${m.alpha * 0.8})`);
        grad.addColorStop(0.5, `rgba(34,211,238,${m.alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(34,211,238,0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        const headGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 6);
        headGrad.addColorStop(0, `rgba(255,255,255,${m.alpha * 0.9})`);
        headGrad.addColorStop(0.4, `rgba(52,211,153,${m.alpha * 0.4})`);
        headGrad.addColorStop(1, 'rgba(52,211,153,0)');
        ctx.beginPath();
        ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();
    }
}

requestAnimationFrame(animate);