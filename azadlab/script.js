/* ═══════════════════════════════════════════════════════
   AZAD LAB — script.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════
   1. SURVEILLANCE EYE ANIMATION
   ══════════════════════════════════════════════════════ */

class Eye {
  constructor(x, y, r, tilt) {
    this.x = x; this.y = y; this.r = r;
    this.tilt = tilt || (Math.random() - .5) * .45;
    this.blink = 0;
    this.phase = 'idle';
    this.timer = 80 + Math.random() * 320;
    this.mx = 0; this.my = 0;
  }

  update(mx, my) {
    this.mx = mx; this.my = my;
    this.timer--;

    if (this.phase === 'idle' && this.timer <= 0) {
      this.phase = 'closing'; this.timer = 12;
    } else if (this.phase === 'closing') {
      this.blink = Math.min(1, this.blink + .14);
      if (this.blink >= 1) { this.phase = 'pause'; this.timer = 6; }
    } else if (this.phase === 'pause' && this.timer <= 0) {
      this.phase = 'opening';
    } else if (this.phase === 'opening') {
      this.blink = Math.max(0, this.blink - .1);
      if (this.blink <= 0) {
        this.phase = 'idle';
        this.timer = 120 + Math.random() * 400;
      }
    }
  }

  draw(ctx) {
    const { x, y, r, blink, tilt, mx, my } = this;
    const ew = r * 2.5;
    const eh = r * (1 - blink * .97);
    if (eh < .4) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    /* clip to eye shape */
    ctx.beginPath();
    ctx.ellipse(0, 0, ew, eh, 0, 0, Math.PI * 2);
    ctx.clip();

    /* sclera */
    ctx.fillStyle = '#0b0b0b';
    ctx.fillRect(-ew - 1, -eh - 1, ew * 2 + 2, eh * 2 + 2);

    /* iris offset (mouse tracking — transform into eye-local coords) */
    const cosT = Math.cos(-tilt), sinT = Math.sin(-tilt);
    const ldx = (mx - x) * cosT - (my - y) * sinT;
    const ldy = (mx - x) * sinT + (my - y) * cosT;
    const dist = Math.hypot(ldx, ldy);
    const maxOff = r * .3;
    const off = Math.min(dist / 10, maxOff);
    const ang = Math.atan2(ldy, ldx);
    const ix = Math.cos(ang) * off;
    const iy = Math.sin(ang) * off;

    /* iris gradient */
    const g = ctx.createRadialGradient(ix * .5, iy * .5, 0, ix, iy, r * .88);
    g.addColorStop(0, '#500808');
    g.addColorStop(.45, '#280404');
    g.addColorStop(1, '#0e0101');
    ctx.beginPath();
    ctx.arc(ix, iy, r * .85, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    /* iris ring */
    ctx.beginPath();
    ctx.arc(ix, iy, r * .85, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(110,25,25,.35)';
    ctx.lineWidth = .8;
    ctx.stroke();

    /* pupil */
    ctx.beginPath();
    ctx.arc(ix, iy, r * .38, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    /* specular highlight */
    ctx.beginPath();
    ctx.arc(ix + r * .18, iy - r * .18, r * .07, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,160,80,.13)';
    ctx.fill();

    ctx.restore();

    /* eyelid outline + glow */
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.beginPath();
    ctx.ellipse(0, 0, ew, eh, 0, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(160,20,20,.22)';
    ctx.shadowBlur = 18;
    ctx.strokeStyle = 'rgba(80,25,25,.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
}

(function initEyes() {
  const canvas = document.getElementById('eyeCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let W, H, eyes = [], mx = 0, my = 0, raf;

  function setup() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    buildEyes();
  }

  function buildEyes() {
    eyes = [];
    const area = W * H;
    const count = Math.min(18, Math.max(6, Math.floor(area / 38000)));
    const cols = Math.ceil(Math.sqrt(count * W / H));
    const rows = Math.ceil(count / cols);
    const cw = W / cols, ch = H / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (eyes.length >= count) break;
        const x = (c + .5) * cw + (Math.random() - .5) * cw * .45;
        const y = (r + .5) * ch + (Math.random() - .5) * ch * .45;
        const radius = cw * (.09 + Math.random() * .08);
        eyes.push(new Eye(x, y, radius));
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    eyes.forEach(e => { e.update(mx, my); e.draw(ctx); });
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  window.addEventListener('touchmove', e => {
    mx = e.touches[0].clientX; my = e.touches[0].clientY;
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 200);
  });

  setup();
  loop();
})();


/* ══════════════════════════════════════════════════════
   2. NOTIFICATION
   ══════════════════════════════════════════════════════ */
document.getElementById('notifClose').addEventListener('click', () => {
  document.getElementById('notifOverlay').style.display = 'none';
  scheduleNetworkAlert();
  startStatusFlicker();
});

function scheduleNetworkAlert() {
  setTimeout(() => {
    const key = 'net-alert';
    if (openWins[key]) return;
    const now = new Date();
    const ts = now.toISOString().slice(0,19).replace('T',' ') + ' UTC';
    openWins[key] = new WinBox({
      title: 'ALERT: connectivity.lost',
      html: `<div class="net-alert-content">
        <div class="net-alert-status">⚠ NETWORK CONNECTIVITY LOST</div>
        <div class="net-alert-location">Detected: ${ts}<br>Region: Tehran, IR — AS44244 (IRANCELL)<br>Protocol: BGP withdrawal confirmed</div>
        <div class="net-alert-body">
Your connection to the outside world has been cut.<br><br>
<em>This is what 80 million people experienced<br>
on November 16, 2019.</em><br><br>
No Twitter. No Signal. No news in or out.<br>
International observers: blind.<br><br>
The protests continued for five days<br>
without the world watching.<br><br>
At least 1,500 people were killed.<br><br>
<em>The tools that work offline are the only<br>
tools that work when this happens.</em>
        </div>
        <button class="net-alert-btn" id="netAlertBtn">See the curriculum →</button>
      </div>`,
      width: 440, height: 420,
      x: Math.max(40, window.innerWidth / 2 - 220),
      y: Math.max(40, window.innerHeight / 2 - 210),
      class: ['net-alert'],
      onclose() { delete openWins[key]; },
    });
    document.getElementById('netAlertBtn').addEventListener('click', () => {
      openWins[key]?.close();
      openSessionsFolder();
    });
  }, 6000);
}

function startStatusFlicker() {
  const el = document.getElementById('statusMsg');
  if (!el) return;
  setInterval(() => {
    el.textContent = 'connection: unstable';
    el.classList.add('unstable');
    setTimeout(() => {
      el.textContent = 'still online';
      el.classList.remove('unstable');
    }, 1500);
  }, 28000);
}


/* ══════════════════════════════════════════════════════
   3. TERMINAL TYPEWRITER
   ══════════════════════════════════════════════════════ */
(function initTerminal() {
  const msgs = [
    'still online...',
    'your data. your rules.',
    'sudo apt install freedom',
    'encryption is not a crime',
    'trust no one. verify everything.',
    'there is no cloud.',
    'azad (آزاد) :: free',
    'rm -rf /surveillance',
    'knowledge is infrastructure',
    'uptime: always',
    'connection: severed',
    'ISP offline — gov. order #4821',
    'mesh: searching for peers...',
    'last uptime: 74h ago',
    'fallback: shortwave radio',
  ];
  const el = document.getElementById('termMsg');
  let idx = 0, pos = 0, typing = true;

  function tick() {
    const msg = msgs[idx];
    if (typing) {
      el.textContent = msg.slice(0, pos++);
      if (pos > msg.length) { typing = false; setTimeout(tick, 2400); return; }
      setTimeout(tick, 55 + Math.random() * 45);
    } else {
      el.textContent = msg.slice(0, --pos);
      if (pos <= 0) {
        idx = (idx + 1) % msgs.length; typing = true;
        setTimeout(tick, 420); return;
      }
      setTimeout(tick, 28);
    }
  }
  setTimeout(tick, 1200);
})();


/* ══════════════════════════════════════════════════════
   4. CLOCK
   ══════════════════════════════════════════════════════ */
(function initClock() {
  const el = document.getElementById('clock');
  const update = () => {
    const n = new Date();
    el.textContent = String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
  };
  update(); setInterval(update, 10000);
})();


/* ══════════════════════════════════════════════════════
   5. WINDOW CONTENT
   ══════════════════════════════════════════════════════ */

const FILE_ICON_SVG = `<svg viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2h18l9 9v25H3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M21 2v9h9" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="8" y1="17" x2="24" y2="17" stroke="currentColor" stroke-width="1" opacity=".5"/><line x1="8" y1="22" x2="24" y2="22" stroke="currentColor" stroke-width="1" opacity=".5"/><line x1="8" y1="27" x2="18" y2="27" stroke="currentColor" stroke-width="1" opacity=".5"/></svg>`;

const WINDOWS = {

  readme: {
    title: 'README.txt',
    width: 540, height: 460,
    x: 140, y: 70,
    content: `<pre class="file-text">AZAD LAB :: README.txt
══════════════════════════════════════════════

Azad (آزاد) means "free" in Farsi.

We believe digital freedom isn't theoretical —
it's practical. It's the difference between
owning your data and renting access to it.
Between communicating privately and performing
privacy in public.

This is a hands-on workshop community. We teach
real tools, real setups, real configurations.
Not slides. Not theory. You leave with something
running.

We exist because the conditions that make digital
sovereignty urgent — internet shutdowns, state
surveillance, corporate data harvesting,
infrastructure collapse — are no longer
hypothetical. They're happening now, in
democracies and authoritarian states alike.

This is for everyone: the developer who wants
off Big Tech, the activist who needs operational
security, the parent who doesn't want their
family's photos in someone else's cloud, the
curious person who just wants to understand
how this all works.

You don't need to trust governments or
corporations to keep your digital life safe,
private, and running.

You just need to run it yourself.

──────────────────────────────────────────────
"The tools that protect the most vulnerable
 protect everyone."
──────────────────────────────────────────────
</pre>`,
  },

  about: {
    title: 'ABOUT.txt',
    width: 540, height: 440,
    x: 160, y: 90,
    content: `<pre class="file-text">AZAD LAB :: ABOUT.txt
══════════════════════════════════════════════

Founded by Arash — software engineer,
Stockholm-based, Iranian by background.

──────────────────────────────────────────────

The Iranian context matters, not as identity
branding, but as source material.

Iran has some of the most sophisticated internet
censorship infrastructure on earth. Iranians have
lived through shutdowns, throttling, targeted
surveillance, and the total weaponization of
digital infrastructure against civilians.

Growing up in that environment, the tools in
this curriculum weren't lifestyle choices —
they were necessities. VPNs, encrypted
communications, alternative DNS, offline-first
thinking.

That experience is why this curriculum is built
the way it is: no fluff, no hypotheticals,
just what actually works when stakes are real.

──────────────────────────────────────────────

Based in Stockholm, Azad Lab runs workshops for
anyone who wants to understand and reclaim
their digital life.

Sweden's NATO accession, the Russia-Ukraine war,
and the normalization of mass surveillance have
made this conversation urgent across Europe
in a new way.

The tools work. Come learn them.

──────────────────────────────────────────────
</pre>`,
  },

  manifesto: {
    title: 'MANIFESTO.txt',
    width: 560, height: 500,
    x: 200, y: 60,
    content: `<pre class="file-text">AZAD LAB :: MANIFESTO.txt
══════════════════════════════════════════════

WHAT THEY KNOW ABOUT YOU RIGHT NOW

Your ISP logs every domain you visit.
Your phone maps your movements 24 hours a day.
Your smart TV has a microphone.
Your email provider reads your messages.
Your browser fingerprint is unique.
Your credit card tracks every purchase.
Your metadata reveals more than your content.

This is not paranoia. This is infrastructure.

──────────────────────────────────────────────

WHAT CHANGED

For decades, mass surveillance was theoretical —
something that happened to dissidents, activists,
people "with something to hide."

Then Snowden showed us the architecture.
Then Cambridge Analytica showed us the use.
Then Iran shut off the internet.
Then Russia weaponized platforms.
Then governments started buying the data
that corporations collected on their behalf.

The threat model changed. So should you.

──────────────────────────────────────────────

WHAT WE BELIEVE

Privacy is not about hiding.
It's about control.
It's about having the right to a private thought,
a private conversation, a private life.

Digital sovereignty is not a luxury.
It's the difference between infrastructure
that serves you and infrastructure that reports
you to whoever pays or coerces enough.

We don't ask you to trust us.
We show you how to not need to trust anyone.

──────────────────────────────────────────────

THE ANSWER IS NOT BETTER TERMS OF SERVICE.

The answer is running your own stack.

──────────────────────────────────────────────
</pre>`,
  },

  blackout: {
    title: 'BLACKOUT.log',
    width: 600, height: 540,
    x: 180, y: 55,
    content: `<pre class="file-text">BLACKOUT.log — documented internet shutdowns
══════════════════════════════════════════════
Source: NetBlocks, OONI, Access Now #KeepItOn

[2019-11-16 14:24 UTC] IRAN
  Duration:  5 days (nationwide)
  Trigger:   fuel price protests
  Impact:    ~1,500 killed during blackout
             International community blind
  Method:    BGP withdrawal by state ISPs

[2021-02-01 01:00 UTC] MYANMAR
  Duration:  18+ months (partial/full cycles)
  Trigger:   military coup
  Impact:    genocide documented later via
             smuggled footage, not live feeds
  Method:    directive to all licensed ISPs

[2022-09-21 22:00 UTC] IRAN
  Duration:  weeks (rolling shutdowns)
  Trigger:   Mahsa Amini protests
  Impact:    mobile data cut first, then
             fixed-line throttled to unusable
  Method:    deep packet inspection + kill switch

[2022-02-24 06:00 UTC] UKRAINE
  Duration:  ongoing (targeted attacks)
  Trigger:   Russian invasion
  Impact:    Viasat KA-SAT satellite taken down
             hour one of the invasion
  Method:    cyberattack + physical infra strikes

[2023-04-06 00:00 UTC] SUDAN
  Duration:  25+ days
  Trigger:   RSF–SAF conflict outbreak
  Impact:    hospitals unable to coordinate,
             atrocities unwitnessed
  Method:    physical seizure of exchange points

[2021-06-18 00:00 UTC] ETHIOPIA (Tigray)
  Duration:  ~2 years
  Trigger:   civil war
  Impact:    longest telecom blackout in history
             documented by satellite imagery only
  Method:    state telecom monopoly ordered offline

──────────────────────────────────────────────
TOTAL 2016–2024: 283 documented shutdowns
across 72 countries.
Source: Access Now #KeepItOn coalition
──────────────────────────────────────────────

[PERSONAL NOTE — Arash, 2026]

I was in Iran during the November 2019 shutdown.

I found out from a relative calling from abroad:
"can you see the news?"
I couldn't. Nobody inside could.

You learn quickly what you should have set up
before. The VPN that only works with internet.
The backup that lives in the cloud. The Signal
messages queued, unsent.

──────────────────────────────────────────────

As of writing this, Iran's internet has been
cut off for over 40 days.

Not tied to a specific protest. Not a temporary
measure. Just gone. 40 days and counting.

I have family inside. You probably know someone
who does too.

These tools are not paranoia.
They are what right now requires.

──────────────────────────────────────────────</pre>`,
  },

  join: {
    title: 'JOIN.txt',
    width: 480, height: 360,
    x: 260, y: 110,
    content: `<pre class="file-text">AZAD LAB :: JOIN.txt
══════════════════════════════════════════════

Workshop sessions run monthly in Stockholm.
Remote participation available for all sessions.

No prior technical experience required.
Bring a laptop. Everything else is provided.

──────────────────────────────────────────────

  TELEGRAM   t.me/azadlab
  EMAIL      hello@azadlab.dev

──────────────────────────────────────────────

If you want to bring Azad Lab to your city
or organization — reach out.

The curriculum is open source.
The knowledge belongs to everyone.

──────────────────────────────────────────────
</pre>`,
  },
};

const SESSIONS = [
  {
    file: '01_walled_garden.txt',
    content: `SESSION 01 :: ESCAPE THE WALLED GARDEN
══════════════════════════════════════════════

Why Linux. Why now.

Big Tech built beautiful cages. Everything works
seamlessly — as long as you stay inside. Your
phone, laptop, cloud storage: products designed
to harvest you, not serve you.

WHAT WE COVER:
  · Why Linux matters for digital sovereignty
  · Install Ubuntu 24.04 or Fedora 41
  · The terminal: your new home base
  · Package managers — software without an
    app store that controls what you run
  · Filesystem layout and why it matters

WHAT YOU LEAVE WITH:
  A working Linux install. A terminal you're
  not afraid of. The mental model every other
  session builds on.

TOOLS: Ubuntu · Fedora · bash · apt/dnf`,
  },
  {
    file: '02_own_your_media.txt',
    content: `SESSION 02 :: OWN YOUR PHOTOS & MEDIA
══════════════════════════════════════════════

Your memories don't belong in a corporation's
datacentre. Run your own photo library and
media server — Google Photos and Netflix,
but yours.

WHAT WE COVER:
  · Docker and containers (the concept)
  · Self-host Immich: your private Google Photos
    — face recognition, mobile backup, all local
  · Self-host Jellyfin: personal streaming server
  · Hardware options: old laptop, Pi, VPS
  · Backup strategy: the 3-2-1 rule applied

WHAT YOU LEAVE WITH:
  Running Immich with photos syncing. Jellyfin
  streaming. An understanding of how Docker
  actually works.

TOOLS: Docker · Immich · Jellyfin`,
  },
  {
    file: '03_access_anywhere.txt',
    content: `SESSION 03 :: ACCESS IT ANYWHERE, SAFELY
══════════════════════════════════════════════

You've built something. Now connect to it —
privately, from anywhere, without opening
ports to the entire internet.

WHAT WE COVER:
  · Tailscale: private mesh VPN on WireGuard
  · Hetzner VPS: cheap, reliable, European
  · Caddy reverse proxy: automatic HTTPS,
    clean routing, minimal config
  · DNS basics: pointing names at your infra
  · Putting it together: access Immich and
    Jellyfin from your phone, anywhere

WHAT YOU LEAVE WITH:
  A Tailscale network connecting your devices.
  A VPS with Caddy serving your services
  over HTTPS with valid certs.

TOOLS: Tailscale · WireGuard · Caddy · Hetzner`,
  },
  {
    file: '04_phone_spying.txt',
    content: `SESSION 04 :: YOUR PHONE IS SPYING ON YOU
══════════════════════════════════════════════

Your phone is the most intimate surveillance
device ever invented. It knows where you sleep,
who you love, what you fear. Take it back.

WHAT WE COVER:
  · What stock Android and iOS actually collect
  · GrapheneOS: hardened Android for Pixels
  · CalyxOS: an alternative for other devices
  · F-Droid: open-source app store, no Google
  · Signal, Session, Matrix/Element
  · Local LLMs: llama.cpp + Gemma on-device —
    AI that never leaves your phone

WHAT YOU LEAVE WITH:
  A concrete plan for your device. For Pixel
  owners: a flashed GrapheneOS install.
  For everyone: an audited, hardened phone.

TOOLS: GrapheneOS · F-Droid · Signal · llama.cpp`,
  },
  {
    file: '05_nas_home_auto.txt',
    content: `SESSION 05 :: NAS & HOME AUTOMATION
══════════════════════════════════════════════

Your home should work for you, not report
to Amazon or Google. Build a local-first smart
home and a proper network storage server.

WHAT WE COVER:
  · Raspberry Pi: from bare board to server
  · TrueNAS SCALE: professional NAS software,
    free — RAID, snapshots, SMB, S3 storage
  · Home Assistant: open-source home automation,
    runs entirely offline
  · Lights, climate, sensors, automations
    without cloud dependencies
  · Local voice control (no Alexa, no Google)

WHAT YOU LEAVE WITH:
  Home Assistant running automations. A design
  for your home storage setup.

TOOLS: Raspberry Pi · TrueNAS · Home Assistant`,
  },
  {
    file: '06_digital_resilience.txt',
    content: `SESSION 06 :: DIGITAL RESILIENCE
══════════════════════════════════════════════

When infrastructure fails — power cut, ISP down,
government shutdown, disaster — what still works?
Build systems that survive.

WHAT WE COVER:
  · Offline-first design: build for disconnection
  · Encrypted backups with Borg and Restic
  · Mesh networking: Meshtastic + LoRa radio
    for communication when internet is gone
  · Syncthing: peer-to-peer sync, no servers
  · What Iran, Ukraine, Myanmar taught us about
    infrastructure collapse — and what worked
  · Your personal resilience checklist

WHAT YOU LEAVE WITH:
  A running encrypted backup solution. An
  understanding of offline and mesh tools.
  A concrete personal resilience plan.

TOOLS: Borg · Restic · Syncthing · Meshtastic`,
  },
];


/* ══════════════════════════════════════════════════════
   6. WINBOX WINDOW MANAGEMENT
   ══════════════════════════════════════════════════════ */
const openWins = {};

function openWinBox(key, cfg) {
  if (openWins[key]) { openWins[key].restore(); openWins[key].focus(); return; }

  openWins[key] = new WinBox({
    title: cfg.title,
    html:  cfg.content,
    width: cfg.width,
    height: cfg.height,
    x: cfg.x, y: cfg.y,
    onclose() { delete openWins[key]; },
  });
}

function openSessionWindow(i) {
  const s = SESSIONS[i];
  const key = 'session-' + i;
  if (openWins[key]) { openWins[key].restore(); openWins[key].focus(); return; }
  openWins[key] = new WinBox({
    title: s.file,
    html: `<pre class="file-text">${s.content}</pre>`,
    width: 520, height: 460,
    x: 160 + i * 18, y: 80 + i * 18,
    onclose() { delete openWins[key]; },
  });
}

function openSessionsFolder() {
  const key = 'sessions';
  if (openWins[key]) { openWins[key].restore(); openWins[key].focus(); return; }

  const grid = SESSIONS.map((s, i) =>
    `<button class="sess-icon" data-si="${i}">
      ${FILE_ICON_SVG}
      <span>${s.file}</span>
    </button>`
  ).join('');

  openWins[key] = new WinBox({
    title: 'SESSIONS/',
    html: `<div class="folder-meta">~/SESSIONS — 6 items — click to open</div>
           <div class="session-grid">${grid}</div>`,
    width: 540, height: 340,
    x: 110, y: 60,
    onclose() { delete openWins[key]; },
  });

  /* Attach click handlers after WinBox creates the DOM */
  setTimeout(() => {
    openWins[key].body.querySelectorAll('[data-si]').forEach(btn => {
      btn.addEventListener('click', () => openSessionWindow(+btn.dataset.si));
    });
  }, 50);
}

/* Desktop icon clicks — direct listeners avoid SVG child target issues */
document.querySelectorAll('#iconGrid [data-win]').forEach(icon => {
  icon.addEventListener('click', () => {
    const key = icon.dataset.win;
    if (key === 'sessions') { openSessionsFolder(); return; }
    const cfg = WINDOWS[key];
    if (cfg) openWinBox(key, cfg);
  });
});

/* Keyboard: Escape closes topmost window */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const top = Object.values(openWins).at(-1);
  if (top) top.close();
});
