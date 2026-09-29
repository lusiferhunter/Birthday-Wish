/* ====== EASY SETTINGS ====== */
const PHOTO_COUNT = 32;          // how many photos (img1.jpg ... img40.jpg) in the "images" folder
const PHOTO_PATH  = "images/img"; // images/img1.jpg, images/img2.jpg ...
const AGE = 20;                  // number written on every balloon
// Optional captions under each photo, in order. Leave empty for "Memory 1, Memory 2..."
const CAPTIONS = [
  // "Our first date", "Her beautiful smile",
];
const SONG_FILE = "music.mp3";    // your song file name (same folder as index.html)
const SONG_NAME   = "Our song";  // shown in the music player
/* =========================== */

const $ = (id) => document.getElementById(id);

/* ---- 1. Balloons on black, then the curtain lifts ---- */
const balloonBox = $("balloons");
for (let i = 0; i < 22; i++) {
  const b = document.createElement("div");
  b.className = "balloon";
  const s = 0.7 + Math.random() * 0.7;
  b.style.left = Math.random() * 94 + "vw";
  b.innerHTML = `<span class="n">${AGE}</span><span class="thread"><span class="letter"></span></span>`;
  b.querySelector(".n").style.fontSize = 24 * s + "px";
  b.style.width = 60 * s + "px";
  b.style.height = 78 * s + "px";
  b.style.animationDuration = 5 + Math.random() * 3 + "s";
  b.style.animationDelay = Math.random() * 2.5 + "s";
  balloonBox.appendChild(b);
}
setTimeout(() => $("curtain").classList.add("lift"), 6500);
setTimeout(() => {
  $("curtain").remove();
  document.body.classList.remove("locked");
}, 9000);

/* ---- 2. Wavy title ---- */
const lines = ["Happy Birthday", "My Love", "Rejina"];
const title = $("title");
let n = 0;
lines.forEach((line, li) => {
  line.split(" ").forEach((word) => {
    const w = document.createElement("span");
    w.className = "w" + (li === 2 ? " name" : "");
    [...word].forEach((c) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      s.style.animationDelay = n++ * 0.12 + "s";
      w.appendChild(s);
    });
    title.appendChild(w);
    title.appendChild(document.createTextNode(" "));
  });
  if (li < lines.length - 1) title.appendChild(Object.assign(document.createElement("span"), { className: "br" }));
});

/* ---- 3. Falling sakura petals ---- */
const petals = $("petals");
for (let i = 0; i < 22; i++) {
  const p = document.createElement("div");
  p.className = "petal";
  p.style.left = Math.random() * 100 + "vw";
  p.style.animationDuration = 9 + Math.random() * 8 + "s";
  p.style.animationDelay = -Math.random() * 15 + "s";
  p.style.scale = 0.6 + Math.random() * 0.9;
  petals.appendChild(p);
}

/* ---- 4. Thank-you button, click animation, open gallery ---- */
/* Shared press animation (squish + ripple + hearts) */
function pressFx(btn, e) {
  btn.classList.remove("pressed");
  void btn.offsetWidth; // restart animation
  btn.classList.add("pressed");

  const r = btn.getBoundingClientRect();
  const rip = btn.querySelector(".ripple");
  const size = Math.max(r.width, r.height);
  Object.assign(rip.style, { width: size + "px", height: size + "px",
    left: e.clientX - r.left - size / 2 + "px", top: e.clientY - r.top - size / 2 + "px" });
  rip.style.animation = "none"; void rip.offsetWidth; rip.style.animation = "";

  for (let i = 0; i < 14; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = ["❤", "💗", "🌸"][i % 3];
    h.style.left = r.left + r.width / 2 + "px";
    h.style.top = r.top + r.height / 2 + "px";
    const a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 90;
    h.style.setProperty("--dx", Math.cos(a) * d + "px");
    h.style.setProperty("--dy", Math.sin(a) * d - 40 + "px");
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1200);
  }
}

$("thanks").addEventListener("click", (e) => {
  playMusic();               // must run directly inside the click so the browser allows sound
  pressFx($("thanks"), e);
  setTimeout(openGallery, 800);
});

/* ---- 4b. AND button: 5 arrows + apology envelope ---- */
[[0, 165], [45, 118], [90, 96], [135, 118], [180, 165]].forEach(([a, d]) => {
  const s = document.createElement("span");
  s.className = "arrow";
  s.style.setProperty("--a", a + "deg");
  s.style.setProperty("--d", d + "px");
  s.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h15M12 5l7 7-7 7"/></svg>';
  $("andWrap").appendChild(s);
});

const F = window.Flowers;
const bouquet = () => `<svg viewBox="0 0 120 170">
  <path d="M60 150 C60 120 30 95 30 72 M60 150 C60 110 60 80 60 48 M60 150 C60 120 90 95 90 72" stroke="#3b6a3f" stroke-width="3" fill="none"/>
  ${F.leaf(58, 116, 34, 200)}${F.leaf(62, 116, 34, -20)}${F.leaf(60, 100, 28, 230)}${F.leaf(60, 100, 28, -50)}
  <path d="M26 88 L94 88 L64 160 L56 160Z" fill="#fbeee9" stroke="#e8b4b8"/>
  ${F.rose(60, 46, 28, "red")}${F.rose(31, 70, 22, "pink")}${F.rose(89, 70, 22, "pink")}
  ${F.daisy(44, 24, 9, 10)}${F.daisy(78, 26, 9, 30)}${F.daisy(60, 84, 8, 0)}
  <path d="M60 116 l-15 -9 v18z M60 116 l15 -9 v18z" fill="#ff7aa8"/><circle cx="60" cy="116" r="4" fill="#d81b4a"/></svg>`;

const stage = $("apology"), fly = $("fly"), env = $("env"), letter = $("bigLetter");
let flyTimer, seq = [];

function spawnFly() {
  const el = document.createElement("div");
  const big = Math.random() < 0.5, dur = 9 + Math.random() * 6;
  el.className = "fly-item";
  el.style.width = (big ? 80 + Math.random() * 50 : 40 + Math.random() * 40) + "px";
  el.style.left = Math.random() * 92 + "vw";
  el.style.animationDuration = dur + "s";
  el.style.setProperty("--r0", Math.random() * 40 - 20 + "deg");
  el.style.setProperty("--sx", Math.random() * 160 - 80 + "px");
  el.innerHTML = big ? bouquet() : `<svg viewBox="0 0 100 100">${F.rose(50, 50, 46, Math.random() < 0.5 ? "red" : "pink")}</svg>`;
  fly.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}

function openApology() {
  stage.classList.remove("hidden");
  document.documentElement.style.overflow = "hidden";
  env.className = "env";
  letter.classList.remove("show");
  letter.scrollTop = 0;
  if (!stage.querySelector(".petal")) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDuration = 8 + Math.random() * 7 + "s";
      p.style.animationDelay = -Math.random() * 12 + "s";
      p.style.scale = 0.7 + Math.random();
      stage.appendChild(p);
    }
  }
  for (let i = 0; i < 6; i++) setTimeout(spawnFly, i * 250);
  flyTimer = setInterval(spawnFly, 700);
  seq = [
    setTimeout(() => env.classList.add("open"), 1300),      // flap opens, letter peeks out
    setTimeout(() => { env.classList.add("done"); letter.classList.add("show"); }, 2700), // letter comes up
  ];
}
function closeApology() {
  clearInterval(flyTimer); seq.forEach(clearTimeout);
  stage.classList.add("hidden"); fly.innerHTML = "";
  document.documentElement.style.overflow = "";
}
$("andBtn").addEventListener("click", (e) => { pressFx($("andBtn"), e); setTimeout(openApology, 800); });
$("closeLetter").addEventListener("click", closeApology);

function openGallery() {
  const grid = $("grid");
  if (!grid.children.length) {
    for (let i = 1; i <= PHOTO_COUNT; i++) {
      const card = document.createElement("figure");
      card.className = "card";
      card.style.setProperty("--tilt", ((i * 37) % 7 - 3) * 0.6 + "deg");
      const file = `${PHOTO_PATH}${i}.jpg`;
      card.innerHTML = `<div class="frame"><div class="ph"><b>♥</b><span>img${i}.jpg</span></div>
        <img src="${file}" alt="Memory ${i}" loading="lazy"></div><figcaption>${CAPTIONS[i - 1] || "Memory " + i}</figcaption>`;
      card.querySelector("img").onerror = (e) => e.target.remove(); // keeps the pink placeholder until you add the photo
      grid.appendChild(card);
    }
  }
  $("gallery").classList.remove("hidden");
  $("finale").classList.remove("hidden");
  $("player").classList.remove("hidden");
  $("gallery").scrollIntoView({ behavior: "smooth" });
  playMusic();
}

/* Lightbox */
const box = $("lightbox");
$("grid").addEventListener("click", (e) => {
  if (e.target.tagName !== "IMG") return;
  box.querySelector("img").src = e.target.src;
  box.classList.remove("hidden");
});
box.addEventListener("click", () => box.classList.add("hidden"));
document.addEventListener("keydown", (e) => e.key === "Escape" && box.classList.add("hidden"));

/* ---- 5. Music player ---- */
const audio = $("audio"), playBtn = $("play"), seek = $("seek");
$("song").textContent = SONG_NAME;
audio.src = SONG_FILE;
audio.load();

function playMusic() {
  audio.play().catch(() => {
    // Browser blocked it: try again on the next tap/click anywhere
    const retry = () => { audio.play().catch(() => {}); };
    document.addEventListener("pointerdown", retry, { once: true });
  });
}
audio.addEventListener("error", () => ($("song").textContent = `Can't find ${SONG_FILE}`));
playBtn.addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
audio.addEventListener("play", () => (playBtn.textContent = "❚❚"));
audio.addEventListener("pause", () => (playBtn.textContent = "▶"));
audio.addEventListener("timeupdate", () => {
  if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
});
seek.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
});
$("vol").addEventListener("input", (e) => (audio.volume = e.target.value));
audio.volume = 0.7;
