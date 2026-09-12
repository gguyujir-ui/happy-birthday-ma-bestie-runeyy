// =========================================================
// Kado Virtual — script.js
// =========================================================

// ---------------------------------------------------------
// KONFIGURASI EMAILJS — supaya permintaan di halaman Wish
// terkirim otomatis ke emailmu. Cara dapetin nilai-nilai ini
// ada di README.md bagian "Setup kirim Wish ke email".
// ---------------------------------------------------------
const EMAILJS_PUBLIC_KEY  = 'PASTE_PUBLIC_KEY_DI_SINI';
const EMAILJS_SERVICE_ID  = 'PASTE_SERVICE_ID_DI_SINI';
const EMAILJS_TEMPLATE_ID = 'PASTE_TEMPLATE_ID_DI_SINI';

const emailjsReady =
  typeof emailjs !== 'undefined' &&
  ![EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID].some(v => v.startsWith('PASTE_'));

if (emailjsReady){
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page navigation ---------- */
  const pages = Array.from(document.querySelectorAll('.page'));

  function goTo(name){
    pages.forEach(p => {
      p.hidden = p.dataset.page !== name;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + name);
  }

  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => goTo(el.dataset.goto));
  });

  /* First time opening the surprise menu deserves a little sky show */
  const openMenuBtn = document.getElementById('openMenuBtn');
  if (openMenuBtn){
    openMenuBtn.addEventListener('click', () => {
      setTimeout(() => fireworksShow(3), 200);
    });
  }

  /* ---------- Envelope open ---------- */
  const envelopeBtn = document.getElementById('envelopeBtn');
  if (envelopeBtn){
    envelopeBtn.addEventListener('click', () => {
      envelopeBtn.classList.add('is-open');
      fireworksShow(2);
      setTimeout(() => goTo('letter'), 650);
    });
  }

  /* ---------- Music player (Moment page) ---------- */
  const playBtn = document.getElementById('playBtn');
  const bgAudio = document.getElementById('bgAudio');
  const vinyl = document.getElementById('vinyl');

  if (playBtn && bgAudio){
    playBtn.addEventListener('click', () => {
      if (bgAudio.paused){
        bgAudio.play().catch(() => { /* no source added yet — that's fine */ });
        playBtn.textContent = '❚❚';
        vinyl.classList.add('spin');
      } else {
        bgAudio.pause();
        playBtn.textContent = '▶';
        vinyl.classList.remove('spin');
      }
    });
  }

  /* ---------- Wish page: blow the candles + send wish by email ---------- */
  const cake = document.getElementById('cake');
  const blowBtn = document.getElementById('blowBtn');
  const wishInput = document.getElementById('wishInput');
  const wishStatus = document.getElementById('wishStatus');
  const wishReveal = document.getElementById('wishReveal');

  if (blowBtn){
    blowBtn.addEventListener('click', () => {
      if (cake.classList.contains('is-blown')) return;
      cake.classList.add('is-blown');
      blowBtn.classList.add('is-hidden');
      setTimeout(() => { wishReveal.hidden = false; }, 300);
      burstConfetti();
      fireworksShow(3);

      const wishText = (wishInput && wishInput.value.trim()) || '';

      if (!wishText){
        return; // tidak ada yang ditulis, tidak perlu kirim apa-apa
      }

      if (!emailjsReady){
        // Belum di-setup — lihat README.md bagian "Setup kirim Wish ke email".
        console.warn('EmailJS belum dikonfigurasi. Wish belum terkirim ke email.');
        return;
      }

      wishStatus.hidden = false;
      wishStatus.textContent = 'Mengirim permintaanmu...';

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        message: wishText,
        sent_at: new Date().toLocaleString('id-ID')
      }).then(() => {
        wishStatus.textContent = 'Permintaanmu berhasil terkirim 🤍';
      }).catch(() => {
        wishStatus.textContent = 'Permintaanmu tersimpan, tapi gagal terkirim ke email.';
      });
    });
  }

  /* ---------- Ramalan page: birthday personality quiz (no right/wrong) ---------- */
  // Ganti pertanyaan/pilihan sesuka hati. Yang penting: urutan pilihan
  // (A/B/C/D) tetap konsisten mewakili tipe yang sama di semua soal
  // (lihat array `personalityTypes` di bawah, urutannya harus sama).
  const personalityTypes = [
    {
      key: 'sosial',
      title: 'Si Kupu-Kupu Sosial 🦋',
      note: 'Tahun ini kamu bakal dikelilingi tawa dan orang-orang baik. Energimu itu magnet buat circle-circle seru — teruslah jadi cahaya di setiap ruangan yang kamu masuki ✨'
    },
    {
      key: 'petualang',
      title: 'Si Petualang 🌍',
      note: 'Tahun ini penuh cerita baru buat kamu! Beranilah coba hal-hal yang belum pernah kamu lakuin, karena versi terbaik kamu ada di luar zona nyaman 🚀'
    },
    {
      key: 'tenang',
      title: 'Si Pemimpi Tenang 🌙',
      note: 'Tahun ini saatnya kamu lebih baik-baik sama diri sendiri. Semoga hari-harimu dipenuhi ketenangan, dan semua yang kamu impikan diam-diam pelan-pelan jadi nyata 🤍'
    },
    {
      key: 'sayang',
      title: 'Si Penyayang Sejati 💞',
      note: 'Tahun ini bakal makin hangat karena orang-orang di sekitarmu makin sayang kamu. Kamu itu rumah buat banyak orang — semoga kamu juga selalu dapet kehangatan yang sama balik 🏡'
    }
  ];

  const quizQuestions = [
    {
      q: 'Kado ulang tahun yang paling bikin kamu senang?',
      options: ['Ngumpul rame-rame sama teman', 'Trip dadakan ke tempat baru', 'Me-time & tidur nyenyak', 'Waktu berkualitas sama orang tersayang']
    },
    {
      q: 'Kalau libur panjang, maunya ngapain?',
      options: ['Nongkrong bareng rame-rame', 'Explore kota/tempat baru', 'Rebahan, nonton, no distraction', 'Video call / kumpul sama orang terdekat']
    },
    {
      q: 'Vibe kamu belakangan ini gimana?',
      options: ['Ramai & penuh energi', 'Pengen coba hal baru terus', 'Butuh ketenangan', 'Kangen orang-orang terdekat']
    },
    {
      q: 'Playlist ulang tahunmu isinya lagu…',
      options: ['Yang bikin joget rame-rame', 'Yang energik buat road trip', 'Yang mellow & healing', 'Yang penuh kenangan sama orang spesial']
    },
    {
      q: 'Harapan terbesarmu tahun ini?',
      options: ['Ketemu lebih banyak circle asik', 'Wujudin mimpi/petualangan baru', 'Lebih damai sama diri sendiri', 'Makin dekat sama orang-orang tersayang']
    }
  ];

  const quizCard = document.getElementById('quizCard');
  const quizProgress = document.getElementById('quizProgress');
  const quizResult = document.getElementById('quizResult');
  const quizScoreText = document.getElementById('quizScoreText');
  const quizScoreNote = document.getElementById('quizScoreNote');
  const quizRestart = document.getElementById('quizRestart');

  let quizIndex = 0;
  let typeTally = [0, 0, 0, 0]; // sejajar urutan dengan personalityTypes

  function renderQuestion(){
    if (!quizCard) return;
    quizResult.hidden = true;
    quizCard.hidden = false;
    quizProgress.parentElement.hidden = false;

    const item = quizQuestions[quizIndex];
    quizProgress.textContent = `Soal ${quizIndex + 1}/${quizQuestions.length}`;

    quizCard.innerHTML = '';
    const qEl = document.createElement('p');
    qEl.className = 'quiz-question';
    qEl.textContent = item.q;
    quizCard.appendChild(qEl);

    const optsWrap = document.createElement('div');
    optsWrap.className = 'quiz-options';

    item.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        Array.from(optsWrap.children).forEach(b => b.disabled = true);
        btn.classList.add('is-selected');
        typeTally[i]++;

        setTimeout(() => {
          quizIndex++;
          if (quizIndex < quizQuestions.length){
            renderQuestion();
          } else {
            showResult();
          }
        }, 500);
      });
      optsWrap.appendChild(btn);
    });

    quizCard.appendChild(optsWrap);
  }

  function showResult(){
    quizCard.hidden = true;
    quizProgress.parentElement.hidden = true;
    quizResult.hidden = false;

    const topScore = Math.max(...typeTally);
    const topIndexes = typeTally
      .map((v, i) => (v === topScore ? i : -1))
      .filter(i => i !== -1);
    const winnerIndex = topIndexes[Math.floor(Math.random() * topIndexes.length)]; // tie? pilih acak
    const result = personalityTypes[winnerIndex];

    quizScoreText.textContent = result.title;
    quizScoreNote.textContent = result.note;

    burstConfetti();
    fireworksShow(2);
  }

  if (quizRestart){
    quizRestart.addEventListener('click', () => {
      quizIndex = 0;
      typeTally = [0, 0, 0, 0];
      renderQuestion();
    });
  }

  if (quizCard){
    renderQuestion();
  }

  /* ---------- Floating background decorations ---------- */
  const floaters = document.getElementById('floaters');
  const floatSymbols = ['💖','✨','🌸','💫','🩷'];
  if (floaters){
    for (let i = 0; i < 14; i++){
      const s = document.createElement('span');
      s.textContent = floatSymbols[i % floatSymbols.length];
      s.style.left = Math.random() * 100 + '%';
      s.style.fontSize = (12 + Math.random() * 16) + 'px';
      s.style.animationDuration = (10 + Math.random() * 12) + 's';
      s.style.animationDelay = (Math.random() * 12) + 's';
      floaters.appendChild(s);
    }
  }

  /* ---------- Confetti + Fireworks (shared canvas) ---------- */
  const canvas = document.getElementById('confetti');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let confettiParticles = [];
  let rockets = [];
  let sparks = [];
  let rafId = null;

  function resizeCanvas(){
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function ensureLoop(){
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function burstConfetti(){
    if (!ctx) return;
    const colors = ['#ff2e93', '#eab654', '#fff8f0', '#c81d4f', '#7fdcff'];
    const cx = window.innerWidth / 2;

    for (let i = 0; i < 90; i++){
      confettiParticles.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: window.innerHeight * 0.55,
        vx: (Math.random() - 0.5) * 9,
        vy: -Math.random() * 11 - 3,
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 0,
        maxLife: 90 + Math.random() * 30
      });
    }
    ensureLoop();
  }

  // A firework = a rocket that climbs then bursts into a ring of sparks.
  const fireworkPalettes = [
    ['#ff6ec7', '#ffd1e8', '#eab654'],
    ['#7fdcff', '#ffffff', '#eab654'],
    ['#ff2e93', '#fff2c2', '#c81d4f'],
    ['#eab654', '#fff8f0', '#ff9ecb']
  ];

  function spawnRocket(targetX, targetY){
    const palette = fireworkPalettes[Math.floor(Math.random() * fireworkPalettes.length)];
    rockets.push({
      x: targetX + (Math.random() - 0.5) * 20,
      y: window.innerHeight + 10,
      targetY,
      vy: -(9 + Math.random() * 2.5),
      trail: [],
      palette
    });
    ensureLoop();
  }

  function explode(x, y, palette){
    const count = 46;
    for (let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = 2 + Math.random() * 3.2;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 1.6 + Math.random() * 1.8,
        life: 0,
        maxLife: 50 + Math.random() * 30
      });
    }
  }

  function fireworksShow(count){
    for (let i = 0; i < count; i++){
      setTimeout(() => {
        const x = window.innerWidth * (0.25 + Math.random() * 0.5);
        const y = window.innerHeight * (0.18 + Math.random() * 0.22);
        spawnRocket(x, y);
      }, i * 420 + Math.random() * 220);
    }
  }

  function tick(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* confetti (falling paper pieces) */
    confettiParticles.forEach(p => {
      p.vy += 0.25;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.life < p.maxLife);

    /* rockets climbing to their burst point */
    rockets.forEach(r => {
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 6) r.trail.shift();
      r.y += r.vy;

      ctx.save();
      ctx.globalAlpha = .9;
      ctx.strokeStyle = r.palette[0];
      ctx.lineWidth = 2;
      ctx.beginPath();
      r.trail.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(r.x, r.y);
      ctx.stroke();
      ctx.restore();

      if (r.y <= r.targetY){
        explode(r.x, r.y, r.palette);
        r.done = true;
      }
    });
    rockets = rockets.filter(r => !r.done);

    /* sparks (the firework burst itself) */
    sparks.forEach(s => {
      s.vy += 0.045; // gentle gravity
      s.vx *= 0.985;
      s.vy *= 0.985;
      s.x += s.vx;
      s.y += s.vy;
      s.life++;

      const alpha = Math.max(0, 1 - s.life / s.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    sparks = sparks.filter(s => s.life < s.maxLife);

    if (confettiParticles.length || rockets.length || sparks.length){
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /* ---------- Tap / click sparkle, anywhere on the page ---------- */
  const tapSymbols = ['✨', '💖', '⭐', '💫'];
  let lastTap = 0;
  document.addEventListener('pointerdown', (e) => {
    const now = Date.now();
    if (now - lastTap < 90) return; // avoid double-firing on quick multi-touch
    lastTap = now;

    const s = document.createElement('span');
    s.className = 'tap-spark';
    s.textContent = tapSymbols[Math.floor(Math.random() * tapSymbols.length)];
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  });

  /* ---------- Restore page from URL hash on load ---------- */
  const startHash = window.location.hash.replace('#', '');
  const validPages = pages.map(p => p.dataset.page);
  if (startHash && validPages.includes(startHash)){
    goTo(startHash);
  }
});
