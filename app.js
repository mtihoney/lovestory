(function () {
  'use strict';
  var S = window.SITE || {};
  var $ = function (id) { return document.getElementById(id); };

  // ---------------------------------------------------------------- SHA-256
  // Uses the browser's built-in crypto when available; otherwise a small fallback
  // (some browsers disable crypto.subtle on plain http:// pages).
  function sha256Fallback(str) {
    var utf8 = unescape(encodeURIComponent(str));
    var K = [], H = [], i, j;
    var isComposite = {};
    for (var c = 2, n = 0; n < 64; c++) {
      if (!isComposite[c]) {
        for (i = 0; i < 313; i += c) isComposite[i] = c;
        K[n] = (Math.pow(c, 1 / 3) * 4294967296) | 0;
        if (n < 8) H[n] = (Math.pow(c, 1 / 2) * 4294967296) | 0;
        n++;
      }
    }
    var bitLen = utf8.length * 8;
    var words = [];
    for (i = 0, n = (((bitLen + 64) >> 9) << 4) + 16; i < n; i++) words[i] = 0;
    for (i = 0; i < utf8.length; i++) words[i >> 2] |= utf8.charCodeAt(i) << (24 - (i % 4) * 8);
    words[bitLen >> 5] |= 0x80 << (24 - (bitLen % 32));
    words[(((bitLen + 64) >> 9) << 4) + 15] = bitLen;
    function rotr(x, k) { return (x >>> k) | (x << (32 - k)); }
    for (j = 0; j < words.length; j += 16) {
      var w = words.slice(j, j + 16), h = H.slice(0);
      for (i = 16; i < 64; i++) {
        var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = h[0], b = h[1], cc = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (i = 0; i < 64; i++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (hh + S1 + ch + K[i] + w[i]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & cc) ^ (b & cc);
        var t2 = (S0 + maj) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (h[0] + a) | 0; H[1] = (h[1] + b) | 0; H[2] = (h[2] + cc) | 0; H[3] = (h[3] + d) | 0;
      H[4] = (h[4] + e) | 0; H[5] = (h[5] + f) | 0; H[6] = (h[6] + g) | 0; H[7] = (h[7] + hh) | 0;
    }
    return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }

  function sha256(str) {
    var subtle = window.crypto && window.crypto.subtle;
    if (subtle && window.TextEncoder) {
      return subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      }).catch(function () { return sha256Fallback(str); });
    }
    return Promise.resolve(sha256Fallback(str));
  }

  // ------------------------------------------------------------ helpers
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function fill(str) {
    return String(str || '').replace(/\{name\}/g, S.herName || 'My Love').replace(/\{me\}/g, S.myName || '');
  }
  function remember(v) { try { sessionStorage.setItem('unlocked', v ? '1' : ''); } catch (e) { /* private mode */ } }
  function wasUnlocked() { try { return sessionStorage.getItem('unlocked') === '1'; } catch (e) { return false; } }

  // ------------------------------------------------------------ lock screen
  document.title = S.pageTitle || 'For You';
  $('lockTitle').textContent = 'For ' + (S.herName || 'You');
  $('lockHint').textContent = S.passcodeHint || '';

  $('lockForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var typed = $('code').value.trim();
    if (!typed) return;
    sha256(typed).then(function (hash) {
      if (hash === S.passcodeHash) {
        remember(true);
        unlock();
      } else {
        $('lockMsg').textContent = 'That is not it. Try again, my love.';
        var card = $('lockForm');
        card.classList.remove('shake');
        void card.offsetWidth;
        card.classList.add('shake');
        $('code').value = '';
        $('code').focus();
      }
    });
  });

  var built = false;
  function unlock() {
    $('lock').hidden = true;
    $('site').hidden = false;
    document.body.classList.remove('locked');
    $('lockMsg').textContent = '';
    $('code').value = '';
    if (!built) { build(); built = true; }
    showTab('home');
  }

  $('lockBtn').addEventListener('click', function () {
    stopAllAudio();
    remember(false);
    $('site').hidden = true;
    $('lock').hidden = false;
    document.body.classList.add('locked');
    $('code').focus();
  });

  // ------------------------------------------------------------ tabs
  function showTab(name) {
    ['home', 'music', 'gallery', 'notes'].forEach(function (t) { $('tab-' + t).hidden = (t !== name); });
    Array.prototype.forEach.call($('nav').querySelectorAll('button'), function (b) {
      var on = b.getAttribute('data-tab') === name;
      b.classList.toggle('active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
  }
  $('nav').addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (t) showTab(t.getAttribute('data-tab'));
  });

  // ------------------------------------------------------------ build content
  var audios = [];
  function stopAllAudio() { audios.forEach(function (a) { a.pause(); }); }

  function build() {
    buildLetter();
    buildSongs();
    buildGallery();
    buildNotes();
  }

  function buildLetter() {
    var L = S.letter || {};
    var box = $('letter');
    box.textContent = '';
    box.appendChild(el('p', 'greeting', fill(L.greeting)));
    (L.paragraphs || []).forEach(function (p) { box.appendChild(el('p', null, fill(p))); });
    box.appendChild(el('p', 'closing', fill(L.closing)));
    box.appendChild(el('p', 'sig', fill(L.signature)));
  }

  function fmt(sec) {
    if (!isFinite(sec)) return '0:00';
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return m + ':' + ('0' + s).slice(-2);
  }

  function buildSongs() {
    var wrap = $('songs');
    wrap.textContent = '';
    (S.songs || []).forEach(function (song) {
      var card = el('div', 'song');
      var btn = el('button', 'play', '▶');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Play ' + song.title);
      var info = el('div');
      info.appendChild(el('p', 'title', song.title));
      info.appendChild(el('p', 'artist', song.artist || ''));
      var bar = el('div', 'bar');
      var prog = el('i');
      bar.appendChild(prog);
      var time = el('p', 'artist', '0:00');
      time.style.margin = '6px 0 0';
      info.appendChild(bar);
      info.appendChild(time);
      var err = el('p', 'err');
      err.hidden = true;
      info.appendChild(err);
      card.appendChild(btn);
      card.appendChild(info);
      wrap.appendChild(card);

      var audio = new Audio();
      audio.preload = 'none';
      audio.src = song.file;
      audios.push(audio);

      btn.addEventListener('click', function () {
        if (audio.paused) {
          audios.forEach(function (a) { if (a !== audio) a.pause(); });
          err.hidden = true;
          var p = audio.play();
          if (p && p.catch) p.catch(function () { err.textContent = 'This song file could not be played. Check the file name in config.js.'; err.hidden = false; });
        } else {
          audio.pause();
        }
      });
      audio.addEventListener('play', function () { btn.textContent = '❚❚'; card.classList.add('playing'); });
      audio.addEventListener('pause', function () { btn.textContent = '▶'; card.classList.remove('playing'); });
      audio.addEventListener('ended', function () { btn.textContent = '▶'; card.classList.remove('playing'); prog.style.width = '0'; });
      audio.addEventListener('timeupdate', function () {
        if (audio.duration) prog.style.width = (audio.currentTime / audio.duration * 100) + '%';
        time.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
      });
      audio.addEventListener('error', function () { err.textContent = 'Song file not found yet. Add it to media/music/ and match the name in config.js.'; err.hidden = false; });
      bar.addEventListener('click', function (e) {
        if (!audio.duration) return;
        var r = bar.getBoundingClientRect();
        audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
      });
    });
  }

  function buildGallery() {
    var photos = $('sub-photos');
    photos.textContent = '';
    if (!(S.photos || []).length) photos.appendChild(el('div', 'empty', 'Add photos to media/photos/ and list them in config.js.'));
    (S.photos || []).forEach(function (p) {
      var fig = el('figure');
      var img = el('img');
      img.src = p.src;
      img.alt = p.caption || 'A memory of us';
      img.loading = 'lazy';
      fig.appendChild(img);
      if (p.caption) fig.appendChild(el('figcaption', null, p.caption));
      fig.addEventListener('click', function () { openLightbox(p); });
      photos.appendChild(fig);
    });

    function videos(box, list, emptyMsg) {
      box.textContent = '';
      if (!(list || []).length) box.appendChild(el('div', 'empty', emptyMsg));
      (list || []).forEach(function (v) {
        var fig = el('figure');
        var vid = el('video');
        vid.controls = true;
        vid.preload = 'metadata';
        vid.playsInline = true;
        vid.src = v.src;
        if (v.poster) vid.poster = v.poster;
        vid.addEventListener('play', stopAllAudio);
        fig.appendChild(vid);
        if (v.caption) fig.appendChild(el('figcaption', null, v.caption));
        box.appendChild(fig);
      });
    }
    videos($('sub-her'), S.videosHer, 'Add her videos to media/videos-her/ and list them in config.js.');
    videos($('sub-me'), S.videosMe, 'Add your videos to media/videos-me/ and list them in config.js.');

    $('subtabs').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var which = b.getAttribute('data-sub');
      Array.prototype.forEach.call($('subtabs').querySelectorAll('button'), function (x) {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-selected', x === b ? 'true' : 'false');
      });
      ['photos', 'her', 'me'].forEach(function (k) {
        $('sub-' + k).hidden = (k !== which);
        if (k !== which) Array.prototype.forEach.call($('sub-' + k).querySelectorAll('video'), function (v) { v.pause(); });
      });
    });
  }

  function openLightbox(p) {
    $('lbImg').src = p.src;
    $('lbImg').alt = p.caption || '';
    $('lbCap').textContent = p.caption || '';
    $('lightbox').hidden = false;
  }
  function closeLightbox() { $('lightbox').hidden = true; $('lbImg').src = ''; }
  $('lbClose').addEventListener('click', closeLightbox);
  $('lightbox').addEventListener('click', function (e) { if (e.target === $('lightbox')) closeLightbox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });

  // Notes: each tap shows a different note (never the same one twice in a row)
  var lastNote = -1;
  function buildNotes() {
    var notes = S.notes || [];
    $('noteBtn').addEventListener('click', function () {
      if (!notes.length) return;
      var i;
      do { i = Math.floor(Math.random() * notes.length); } while (notes.length > 1 && i === lastNote);
      lastNote = i;
      var card = $('noteCard');
      card.textContent = notes[i];
      card.classList.remove('pop');
      void card.offsetWidth;
      card.classList.add('pop');
      $('noteBtn').textContent = 'Another note';
    });
  }

  // Stay unlocked across a refresh in the same tab (closes when the tab closes)
  if (wasUnlocked()) unlock();
  window.__site = { sha256: sha256, sha256Fallback: sha256Fallback }; // for tests
})();
