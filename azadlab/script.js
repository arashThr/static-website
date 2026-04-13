/* ════════════════════════════════════════════════════════════
   AZAD LAB — script.js
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ── Session data ───────────────────────────────────────────── */
const sessions = [
  {
    filename: '01_walled_garden.txt',
    title:    'SESSION 01 :: ESCAPE THE WALLED GARDEN',
    content:
`SESSION 01 :: ESCAPE THE WALLED GARDEN
══════════════════════════════════════════════

Why Linux. Why now.

Big Tech built beautiful cages. Everything
works seamlessly — as long as you stay inside.
Your phone, your laptop, your cloud storage:
they are products designed to harvest you,
not serve you. This session is about walking out.

WHAT WE COVER:
  · Why Linux matters for digital sovereignty
  · Install Ubuntu 24.04 or Fedora 41
    on real hardware (live USB walkthrough)
  · The terminal: your new home base
  · Package managers — installing software
    without an app store that controls you
  · Filesystem layout and why it matters
  · Basic shell navigation and file operations

WHAT YOU LEAVE WITH:
  A working Linux installation. A terminal
  you're not afraid of. The mental model that
  every other session builds on.

PRE-REQUISITES:
  None. Just a laptop and willingness.

──────────────────────────────────────────────
TOOLS: Ubuntu 24.04 · Fedora 41 · bash
       apt / dnf · ls / cd / cat / grep
──────────────────────────────────────────────`,
  },
  {
    filename: '02_own_your_media.txt',
    title:    'SESSION 02 :: OWN YOUR PHOTOS & MEDIA',
    content:
`SESSION 02 :: OWN YOUR PHOTOS & MEDIA
══════════════════════════════════════════════

Your memories don't belong in a corporation's
datacentre. This session teaches you to run
your own photo library and media server —
Google Photos and Netflix, but yours.

WHAT WE COVER:
  · Introduction to Docker and containers
    (the concept, not just the commands)
  · Self-host Immich: your private Google Photos
    — face recognition, albums, mobile backup,
    all running on your own hardware
  · Self-host Jellyfin: your personal streaming
    server for movies, TV, music
  · Choosing hardware: old laptop, Raspberry Pi,
    or a cheap VPS — what fits your setup
  · Backup strategy: the 3-2-1 rule applied

WHAT YOU LEAVE WITH:
  A running Immich instance with your photos
  already syncing. Jellyfin set up and streaming.
  An understanding of how Docker actually works.

PRE-REQUISITES:
  Session 01, or existing Linux comfort.

──────────────────────────────────────────────
TOOLS: Docker · Docker Compose
       Immich · Jellyfin
──────────────────────────────────────────────`,
  },
  {
    filename: '03_access_anywhere.txt',
    title:    'SESSION 03 :: ACCESS IT ANYWHERE, SAFELY',
    content:
`SESSION 03 :: ACCESS IT ANYWHERE, SAFELY
══════════════════════════════════════════════

You've built something. Now connect to it —
privately, from anywhere, without opening
ports to the whole internet.

WHAT WE COVER:
  · Tailscale: a private mesh VPN built on
    WireGuard. Connect all your devices in
    minutes. No exposed ports, no public IPs.
  · Hetzner VPS setup: cheap, reliable,
    European hosting for your services
  · Caddy reverse proxy: automatic HTTPS,
    clean routing, minimal configuration
  · DNS and domain basics: pointing names
    at your infrastructure
  · Putting it together: access your Immich
    and Jellyfin securely from your phone,
    anywhere in the world

WHAT YOU LEAVE WITH:
  A Tailscale network connecting your devices.
  A VPS with Caddy serving your services over
  HTTPS with valid certificates.

PRE-REQUISITES:
  Session 02 (having services to expose helps).

──────────────────────────────────────────────
TOOLS: Tailscale · WireGuard · Hetzner VPS
       Caddy · Let's Encrypt · DNS basics
──────────────────────────────────────────────`,
  },
  {
    filename: '04_phone_spying.txt',
    title:    'SESSION 04 :: YOUR PHONE IS SPYING ON YOU',
    content:
`SESSION 04 :: YOUR PHONE IS SPYING ON YOU
══════════════════════════════════════════════

Your phone is the most intimate surveillance
device ever invented. It knows where you sleep,
who you love, what you fear. This session is
about taking it back.

WHAT WE COVER:
  · What stock Android and iOS actually collect
    (and who gets it)
  · GrapheneOS: hardened Android for Pixels,
    installation walkthrough
  · CalyxOS: an alternative for broader devices
  · F-Droid: an app store of open-source apps
    (no Google Play required)
  · Communication: Signal, Session, Matrix/Element
  · Running local LLMs on-device:
    llama.cpp and Gemma — AI that never leaves
    your phone, no cloud required
  · Location hygiene, permissions audit, and
    what to do when you can't change the OS

WHAT YOU LEAVE WITH:
  A concrete plan for your device. For those
  with a compatible Pixel: a flashed GrapheneOS
  install. For everyone: a permissions audit
  and a list of app replacements.

PRE-REQUISITES:
  None specific — though any session helps.

──────────────────────────────────────────────
TOOLS: GrapheneOS · CalyxOS · F-Droid
       Signal · Element · llama.cpp · Gemma
──────────────────────────────────────────────`,
  },
  {
    filename: '05_nas_home_auto.txt',
    title:    'SESSION 05 :: YOUR OWN NAS & HOME AUTOMATION',
    content:
`SESSION 05 :: YOUR OWN NAS & HOME AUTOMATION
══════════════════════════════════════════════

Your home should work for you, not report
to Amazon or Google. Build a local-first smart
home and a proper network storage server.

WHAT WE COVER:
  · Raspberry Pi setup: from bare board to
    running server in an afternoon
  · TrueNAS SCALE: professional NAS software,
    free, on your own hardware — RAID, snapshots,
    SMB shares, S3-compatible storage
  · Home Assistant: open-source home automation
    that runs entirely offline
  · Integrations: lights, climate, sensors,
    automations — without cloud dependencies
  · Local voice control (no Alexa, no Google)
  · Connecting everything over your Tailscale
    network from Session 03

WHAT YOU LEAVE WITH:
  A Home Assistant instance running automations.
  Understanding of TrueNAS and how to design
  a home storage setup.

PRE-REQUISITES:
  Sessions 01-03 are helpful but not required.

──────────────────────────────────────────────
TOOLS: Raspberry Pi · TrueNAS SCALE
       Home Assistant · Zigbee / Z-Wave
──────────────────────────────────────────────`,
  },
  {
    filename: '06_digital_resilience.txt',
    title:    'SESSION 06 :: DIGITAL RESILIENCE',
    content:
`SESSION 06 :: DIGITAL RESILIENCE
══════════════════════════════════════════════

When infrastructure fails — power cut, ISP down,
government shutdown, natural disaster — what
still works? This session is about building
systems that survive.

WHAT WE COVER:
  · Offline-first thinking: design for
    disconnection, not connectivity
  · Encrypted backups with Borg and Restic:
    automated, versioned, tested
  · Mesh networking basics: Meshtastic,
    LoRa radio, offline communication
    when the internet is gone
  · Syncthing: peer-to-peer file sync,
    no servers required
  · What Iran, Ukraine, and Myanmar taught us
    about infrastructure collapse and what
    ordinary people did to stay connected
  · Your personal resilience plan:
    what to set up this week

WHAT YOU LEAVE WITH:
  A running encrypted backup solution.
  An understanding of offline and mesh tools.
  A concrete personal resilience checklist.

PRE-REQUISITES:
  All previous sessions recommended.
  But everyone is welcome.

──────────────────────────────────────────────
TOOLS: Borg · Restic · Syncthing
       Meshtastic · LoRa · Offline maps
──────────────────────────────────────────────`,
  },
];

/* ── Window management ──────────────────────────────────────── */
let zCounter = 100;
let openOffset = 0;
let activeDrag = null;

const basePositions = {
  'readme':   { top: 72,  left: 140 },
  'about':    { top: 88,  left: 200 },
  'sessions': { top: 58,  left: 110 },
  'join':     { top: 96,  left: 260 },
};

function bringToFront(win) {
  zCounter++;
  win.style.zIndex = zCounter;
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  win.classList.add('active');
}

function openWindow(id, defaultPos) {
  const win = document.getElementById('win-' + id);
  if (!win) return;

  if (win.style.display === 'flex') {
    bringToFront(win);
    return;
  }

  win.style.display = 'flex';
  bringToFront(win);

  if (!win.dataset.positioned) {
    const pos = defaultPos || basePositions[id] || {
      top:  80 + (openOffset % 5) * 28,
      left: 140 + (openOffset % 5) * 28,
    };
    openOffset++;
    win.style.top  = pos.top  + 'px';
    win.style.left = pos.left + 'px';
    win.dataset.positioned = '1';
  }
}

function closeWindow(id) {
  const win = document.getElementById('win-' + id);
  if (!win) return;
  win.style.display = 'none';
}

/* ── Drag ───────────────────────────────────────────────────── */
document.addEventListener('mousemove', (e) => {
  if (!activeDrag) return;
  const { win, startX, startY, winStartX, winStartY } = activeDrag;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  const vw = window.innerWidth;
  const vhVal = window.innerHeight;
  const newLeft = Math.max(-win.offsetWidth + 80, Math.min(vw - 80, winStartX + dx));
  const newTop  = Math.max(0, Math.min(vhVal - 36, winStartY + dy));
  win.style.left = newLeft + 'px';
  win.style.top  = newTop  + 'px';
});

document.addEventListener('mouseup', () => {
  activeDrag = null;
  document.body.style.cursor = '';
});

function initDrag(titlebar) {
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.wc-btn')) return;
    const win = titlebar.closest('.window');
    bringToFront(win);
    const rect = win.getBoundingClientRect();
    activeDrag = {
      win,
      startX: e.clientX,
      startY: e.clientY,
      winStartX: rect.left,
      winStartY: rect.top,
    };
    document.body.style.cursor = 'move';
    e.preventDefault();
  });

  /* Touch drag support */
  titlebar.addEventListener('touchstart', (e) => {
    if (e.target.closest('.wc-btn')) return;
    if (window.innerWidth < 768) return; /* no drag on mobile */
    const touch = e.touches[0];
    const win = titlebar.closest('.window');
    bringToFront(win);
    const rect = win.getBoundingClientRect();
    activeDrag = {
      win,
      startX: touch.clientX,
      startY: touch.clientY,
      winStartX: rect.left,
      winStartY: rect.top,
    };
    e.preventDefault();
  }, { passive: false });
}

document.addEventListener('touchmove', (e) => {
  if (!activeDrag) return;
  const touch = e.touches[0];
  const { win, startX, startY, winStartX, winStartY } = activeDrag;
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  win.style.left = Math.max(0, winStartX + dx) + 'px';
  win.style.top  = Math.max(0, winStartY + dy) + 'px';
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', () => { activeDrag = null; });

/* ── Click on desktop icons ─────────────────────────────────── */
document.querySelectorAll('.icon[data-target]').forEach((icon) => {
  function activate() {
    const target = icon.dataset.target;
    icon.classList.add('selected');
    setTimeout(() => icon.classList.remove('selected'), 300);
    openWindow(target);
  }
  icon.addEventListener('click', activate);
  icon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
  });
});

/* ── Window close buttons ───────────────────────────────────── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.wc-close');
  if (!btn) return;
  const id = btn.dataset.close;
  if (id) closeWindow(id);
});

/* ── Bring window to front on click ────────────────────────── */
document.addEventListener('mousedown', (e) => {
  const win = e.target.closest('.window');
  if (win) bringToFront(win);
}, true);

/* ── Init titlebars for drag ────────────────────────────────── */
document.querySelectorAll('.window-titlebar').forEach(initDrag);

/* ── Sessions folder ────────────────────────────────────────── */
function buildSessionsFolder() {
  const grid = document.getElementById('sessionIconsGrid');
  if (!grid) return;

  sessions.forEach((s, i) => {
    const icon = document.createElement('div');
    icon.className = 'session-icon';
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('data-session', i);
    icon.innerHTML = `
      <svg class="icon-svg" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2 L22 2 L30 10 L30 38 L4 38 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M22 2 L22 10 L30 10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <line x1="9" y1="18" x2="25" y2="18" stroke="currentColor" stroke-width="1" stroke-opacity="0.5"/>
        <line x1="9" y1="23" x2="25" y2="23" stroke="currentColor" stroke-width="1" stroke-opacity="0.5"/>
        <line x1="9" y1="28" x2="20" y2="28" stroke="currentColor" stroke-width="1" stroke-opacity="0.5"/>
      </svg>
      <span class="icon-label">${s.filename}</span>
    `;

    function activate() {
      openSessionWindow(i);
    }
    icon.addEventListener('click', activate);
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });

    grid.appendChild(icon);
  });
}

function openSessionWindow(index) {
  const s = sessions[index];
  const winId = 'win-s' + index;

  if (!document.getElementById(winId)) {
    const win = document.createElement('div');
    win.className = 'window';
    win.id = winId;
    win.innerHTML = `
      <div class="window-titlebar" data-winid="${winId}">
        <div class="wc-wrap">
          <button class="wc-btn wc-close" data-close="${winId}" aria-label="Close">×</button>
        </div>
        <span class="win-title-text">${s.filename}</span>
        <div class="wc-spacer"></div>
      </div>
      <div class="window-body">
        <pre class="file-text">${escHtml(s.content)}</pre>
      </div>
    `;
    document.getElementById('sessionWindows').appendChild(win);
    initDrag(win.querySelector('.window-titlebar'));
  }

  const row = Math.floor(index / 3);
  const col = index % 3;
  openWindow(winId, {
    top:  90  + row * 30 + col * 12,
    left: 180 + col * 32 + row * 16,
  });
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

buildSessionsFolder();

/* ── Terminal typewriter ─────────────────────────────────────── */
const termMessages = [
  'still online...',
  'your data. your rules.',
  'sudo apt install freedom',
  'encryption is not a crime',
  'trust no one. verify everything.',
  'there is no cloud.',
  'azad (آزاد) :: free',
  'rm -rf /surveillance',
  'uptime: always',
  'knowledge is infrastructure',
];

let tMsgIdx  = 0;
let tCharIdx = 0;
let tTyping  = true;
const tEl = document.getElementById('termMsg');

function typeTerminal() {
  const msg = termMessages[tMsgIdx];

  if (tTyping) {
    if (tCharIdx <= msg.length) {
      tEl.textContent = msg.slice(0, tCharIdx);
      tCharIdx++;
      setTimeout(typeTerminal, 55 + Math.random() * 45);
    } else {
      setTimeout(() => { tTyping = false; typeTerminal(); }, 2600);
    }
  } else {
    if (tCharIdx > 0) {
      tCharIdx--;
      tEl.textContent = msg.slice(0, tCharIdx);
      setTimeout(typeTerminal, 28);
    } else {
      tMsgIdx = (tMsgIdx + 1) % termMessages.length;
      tTyping = true;
      setTimeout(typeTerminal, 500);
    }
  }
}

setTimeout(typeTerminal, 800);

/* ── Clock ──────────────────────────────────────────────────── */
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const el = document.getElementById('clock');
  if (el) el.textContent = h + ':' + m;
}

updateClock();
setInterval(updateClock, 10000);

/* ── Keyboard shortcut: Escape closes topmost window ─────────── */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const wins = [...document.querySelectorAll('.window')]
    .filter(w => w.style.display === 'flex')
    .sort((a, b) => parseInt(b.style.zIndex || 0) - parseInt(a.style.zIndex || 0));
  if (wins[0]) closeWindow(wins[0].id);
});
