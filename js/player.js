/* Player da VSL v10i. Sem autoplay. preload="metadata". Uma só VSL visível.
   Todos os textos da interface estão em italiano.
   O bloco de oferta e as seções [data-reveal] aparecem quando o tempo
   realmente assistido (currentTime avançado pela reprodução) chega a
   CTA_DELAY_SECONDS (744). O preço grande ([data-price-reveal]) sai em
   PRICE_REVEAL_SECONDS (765). O progresso fica no localStorage
   (BSIT_VSL_WATCH_KEY): recarregar retoma o ponto e não zera o reveal.
   Sem barra de progresso, sem seek (teclado bloqueado; pulos à frente
   voltam ao máximo assistido). Sai da aba/janela: pausa e overlay de
   retorno; retoma no toque. pid=vsla2 (SHOW_CTA_PARAM) mostra na hora,
   como a variante de campanha do original. Sem ?cta e sem ?mostra-cta.
   As legendas .vtt antigas não são ligadas: o MP4 (v10i, mesmo áudio da v10h) já as traz queimadas. */
(function () {
  var VIDEO_SEL = 'video[data-lab-vsl]';
  var SEEK_SLACK = 1.25;

  function qsParam(nome) {
    try { return new URLSearchParams(location.search).get(nome); }
    catch (e) { return null; }
  }

  function delaySegundos() {
    var cfg = Number(window.CTA_DELAY_SECONDS);
    return isFinite(cfg) ? Math.max(0, cfg) : 744;
  }

  function delayPrezzo() {
    var cfg = Number(window.PRICE_REVEAL_SECONDS);
    return isFinite(cfg) ? Math.max(0, cfg) : 765;
  }

  function watchKey() {
    return window.BSIT_VSL_WATCH_KEY || 'bsitVslWatch';
  }

  function watchVersion() {
    return window.BSIT_VSL_WATCH_VERSION || 'v10i';
  }

  function lerWatch() {
    try {
      var raw = localStorage.getItem(watchKey());
      if (!raw) return { t: 0, cta: false, prezzo: false };
      var o = JSON.parse(raw);
      if (!o || o.v !== watchVersion()) return { t: 0, cta: false, prezzo: false };
      var t = Number(o.t);
      return {
        t: isFinite(t) && t > 0 ? t : 0,
        cta: o.cta === true,
        prezzo: o.prezzo === true
      };
    } catch (e) {
      return { t: 0, cta: false, prezzo: false };
    }
  }

  function gravarWatch(estado) {
    try {
      localStorage.setItem(watchKey(), JSON.stringify({
        v: watchVersion(),
        t: Math.max(0, Number(estado.t) || 0),
        cta: !!estado.cta,
        prezzo: !!estado.prezzo
      }));
    } catch (e) {}
  }

  function ingressoDiretto() {
    var nome = window.SHOW_CTA_PARAM || 'pid';
    var valore = window.SHOW_CTA_VALUE || 'vsla2';
    return qsParam(nome) === valore;
  }

  function rivelareOfferta(box) {
    if (box && box.classList.contains('is-hidden')) {
      box.classList.remove('is-hidden');
      box.setAttribute('data-cta-visibile', '1');
    }
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.remove('is-hidden');
    });
    if (typeof window.bsitApplicareCampi === 'function') window.bsitApplicareCampi();
    else if (typeof window.bsitApplicarePrezzo === 'function') window.bsitApplicarePrezzo();
    if (typeof window.bsitAplicarLinks === 'function') window.bsitAplicarLinks();
  }

  function rivelarePrezzo() {
    document.querySelectorAll('[data-price-reveal]').forEach(function (el) {
      el.classList.remove('is-hidden');
    });
    if (typeof window.bsitApplicareCampi === 'function') window.bsitApplicareCampi();
  }

  function avviaApertura(video) {
    var opening = String(window.VSL_OPENING || 'levi-montalcini').toLowerCase();
    if (opening !== 'famiglia') opening = 'levi-montalcini';
    document.querySelectorAll('[data-vsl-opening]').forEach(function (el) {
      var id = (el.getAttribute('data-vsl-opening') || '').toLowerCase();
      if (id === opening) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    });
    /* Não liga faixas .vtt: os tempos são da montagem anterior (~37 min) e o
       MP4 v10i já tem as legendas queimadas no quadro. */
    video.querySelectorAll('track').forEach(function (track) {
      track.removeAttribute('default');
      try { if (track.track) track.track.mode = 'disabled'; } catch (e) {}
      if (track.parentNode) track.parentNode.removeChild(track);
    });
  }

  function init(player) {
    var video = player.querySelector(VIDEO_SEL);
    if (!video) return;
    var offerta = document.getElementById('offerta');
    var loading = player.querySelector('[data-vsl-loading]');
    var playOverlay = player.querySelector('[data-vsl-play]');
    var retorno = player.querySelector('[data-vsl-retorno]');
    var btnMute = player.querySelector('[data-vsl-mute]');
    var volume = player.querySelector('[data-vsl-volume]');
    var volumeDock = player.querySelector('[data-vsl-volume-dock]');
    var frame = player.querySelector('.vsl-frame') || player;
    var btnEsci = player.querySelector('[data-vsl-esci-pieno]');

    var vslSrc = window.VSL_VIDEO_SRC || window.VIDEO_SRC;
    var vslPoster = window.VSL_POSTER || window.VIDEO_POSTER;
    if (vslSrc) {
      var sourceEl = video.querySelector('source');
      if (sourceEl) sourceEl.src = vslSrc;
      else {
        sourceEl = document.createElement('source');
        sourceEl.src = vslSrc;
        sourceEl.type = 'video/mp4';
        video.appendChild(sourceEl);
      }
      /* Não definir crossorigin: um host externo sem CORS quebraria o play.
         video.load() faz o player puxar um src novo (relativo ou URL absoluta). */
      video.removeAttribute('crossorigin');
      try { video.load(); } catch (e) {}
    }
    if (vslPoster) video.poster = vslPoster;
    if (window.VSL_NAME) video.setAttribute('data-lab-vsl', window.VSL_NAME);

    video.preload = 'metadata';
    video.removeAttribute('autoplay');
    video.removeAttribute('controls');
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('disableremoteplayback', '');
    video.disablePictureInPicture = true;
    try { video.disableRemotePlayback = true; } catch (e) {}

    avviaApertura(video);

    var delay = delaySegundos();
    var delayP = delayPrezzo();
    var saved = lerWatch();
    var watchedMax = saved.t;
    var lastTick = saved.t;
    var restoring = false;
    var playRichiesto = false;
    var iniziato = false;
    var awayPaused = false;
    var ignoreClickAte = 0;
    var ignoreAwayAte = 0;
    var saidaAperta = false;
    var saidaTimer = null;
    var saidaLastFocus = null;
    var saidaHistoryArmed = false;
    var saidaLeftTab = false;
    var rivelata = false;
    var prezzoRivelato = false;
    var direto = ingressoDiretto();
    var immerso = false;
    var pseudoPieno = false;
    var historyPushed = false;
    var chiudendoStoria = false;

    function isiPhone() {
      var ua = navigator.userAgent || '';
      return /iPhone|iPod/.test(ua);
    }

    function puoFullscreenElemento() {
      if (isiPhone()) return false;
      return !!(frame && (frame.requestFullscreen || frame.webkitRequestFullscreen));
    }

    function elementoFullscreen() {
      return document.fullscreenElement || document.webkitFullscreenElement || null;
    }

    function isImmerso() {
      return immerso || !!elementoFullscreen() || !!(frame && frame.classList.contains('is-pseudo-full'));
    }

    function attivarePseudo() {
      pseudoPieno = true;
      immerso = true;
      if (frame) {
        frame.classList.add('is-immerso', 'is-pseudo-full');
      }
      document.documentElement.classList.add('vsl-is-pseudo-full');
      document.body.style.overflow = 'hidden';
      if (btnEsci) btnEsci.hidden = false;
      try {
        if (!historyPushed) {
          history.pushState({ vslFull: 1 }, '');
          historyPushed = true;
        }
      } catch (e) {}
    }

    function entrareImmersione() {
      if (rivelata) return;
      if (video.muted) return;
      if (isImmerso()) return;
      ignoreAwayAte = Date.now() + 700;
      immerso = true;
      if (frame) frame.classList.add('is-immerso');
      if (btnEsci) btnEsci.hidden = false;
      if (puoFullscreenElemento()) {
        var req = frame.requestFullscreen || frame.webkitRequestFullscreen;
        try {
          var p = req.call(frame);
          if (p && typeof p.catch === 'function') {
            p.catch(function () { attivarePseudo(); });
          }
        } catch (e) {
          attivarePseudo();
        }
      } else {
        attivarePseudo();
      }
    }

    function uscireImmersione(opts) {
      opts = opts || {};
      var era = isImmerso() || immerso || pseudoPieno;
      immerso = false;
      pseudoPieno = false;
      if (frame) frame.classList.remove('is-immerso', 'is-pseudo-full');
      document.documentElement.classList.remove('vsl-is-pseudo-full');
      document.body.style.overflow = '';
      if (btnEsci) btnEsci.hidden = true;
      var fs = elementoFullscreen();
      if (fs && (fs === frame || (frame && frame.contains(fs)) || fs === player || (player.contains && player.contains(fs)))) {
        try {
          var ex = document.exitFullscreen || document.webkitExitFullscreen;
          if (ex) ex.call(document);
        } catch (e) {}
      }
      if (historyPushed && !opts.fromPopstate) {
        historyPushed = false;
        chiudendoStoria = true;
        try { history.back(); } catch (e) {}
        chiudendoStoria = false;
      } else {
        historyPushed = false;
      }
      return era;
    }

    function persistire() {
      gravarWatch({
        t: watchedMax,
        cta: rivelata,
        prezzo: prezzoRivelato
      });
    }

    function mostrare() {
      if (rivelata) return;
      rivelata = true;
      rivelareOfferta(offerta);
      persistire();
      uscireImmersione();
      chiudereUscita({ riprendere: false });
    }

    function mostrarePrezzo() {
      if (prezzoRivelato) return;
      prezzoRivelato = true;
      rivelarePrezzo();
      persistire();
    }

    function ctaPerTempo() {
      if (direto) return;
      if (!rivelata && (saved.cta || watchedMax >= delay)) mostrare();
      if (!prezzoRivelato && (saved.prezzo || watchedMax >= delayP)) mostrarePrezzo();
    }

    if (direto) {
      mostrare();
      mostrarePrezzo();
    } else {
      ctaPerTempo();
    }

    function setLoading(on) {
      if (!loading) return;
      loading.hidden = !on;
    }

    function mostraRetorno(on) {
      if (!retorno) return;
      retorno.hidden = !on;
    }

    function syncPlay() {
      var paused = video.paused;
      player.classList.toggle('is-playing', !paused);
      player.classList.toggle('is-started', iniziato);
      if (playOverlay) playOverlay.hidden = !paused || awayPaused || saidaAperta;
    }

    function syncMute() {
      var muted = video.muted || video.volume === 0;
      player.classList.toggle('is-muted', muted);
      if (btnMute) {
        btnMute.classList.toggle('is-muted', muted);
        btnMute.setAttribute('aria-label', muted ? 'Attiva il suono' : 'Disattiva il suono');
        btnMute.setAttribute('aria-pressed', muted ? 'true' : 'false');
      }
      if (volume && document.activeElement !== volume) {
        var vis = muted ? 0 : video.volume;
        if (Math.abs(Number(volume.value) - vis) > 0.009) volume.value = String(vis);
      }
    }

    function playWithSound() {
      playRichiesto = true;
      iniziato = true;
      awayPaused = false;
      ignoreClickAte = Date.now() + 500;
      ignoreAwayAte = Date.now() + 700;
      mostraRetorno(false);
      setLoading(true);
      video.muted = false;
      var p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(function () {
          if (video.muted) video.muted = false;
          syncMute();
          syncPlay();
          if (!video.muted) entrareImmersione();
        }).catch(function () {
          video.muted = true;
          video.play().catch(function () {});
          syncMute();
          syncPlay();
        });
      } else if (!video.muted) {
        entrareImmersione();
      }
    }

    function pausaPerUscita() {
      if (!iniziato) return;
      if (Date.now() < ignoreAwayAte) return;
      if (video.paused && awayPaused) return;
      if (!video.paused) {
        video.pause();
      }
      awayPaused = true;
      mostraRetorno(true);
      if (playOverlay) playOverlay.hidden = true;
      syncPlay();
      persistire();
    }

    function riprendiDalRitorno() {
      if (!awayPaused) return;
      playWithSound();
    }

    function applySeekGuard(fromEvent) {
      if (restoring) return;
      var t = video.currentTime;
      if (!isFinite(t)) return;
      if (t > watchedMax + SEEK_SLACK) {
        restoring = true;
        try { video.currentTime = watchedMax; } catch (e) {}
        restoring = false;
        return;
      }
      if (lastTick > 0 && t < lastTick - SEEK_SLACK) {
        restoring = true;
        try { video.currentTime = lastTick; } catch (e) {}
        restoring = false;
        return;
      }
      if (t > watchedMax) watchedMax = t;
      lastTick = t;
      if (!fromEvent || t >= watchedMax) persistire();
      ctaPerTempo();
    }

    function ripristinaPosizione() {
      if (watchedMax <= 0 || !isFinite(video.duration)) return;
      var alvo = Math.min(watchedMax, video.duration);
      if (alvo <= 0) return;
      restoring = true;
      try { video.currentTime = alvo; } catch (e) {}
      lastTick = alvo;
      restoring = false;
    }

    if (playOverlay) {
      playOverlay.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      playOverlay.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playWithSound();
      });
    }

    if (retorno) {
      retorno.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        riprendiDalRitorno();
      });
    }

    if (btnMute) {
      btnMute.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        video.muted = !video.muted;
        if (!video.muted && video.volume === 0) video.volume = 1;
        syncMute();
      });
    }

    if (volume) {
      volume.addEventListener('click', function (e) { e.stopPropagation(); });
      volume.addEventListener('input', function (e) {
        e.stopPropagation();
        var v = Number(volume.value);
        if (!isFinite(v)) return;
        v = Math.max(0, Math.min(1, v));
        video.volume = v;
        video.muted = v === 0;
        syncMute();
      });
    }

    if (volumeDock) {
      volumeDock.addEventListener('click', function (e) { e.stopPropagation(); });
    }

    if (btnEsci) {
      btnEsci.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        uscireImmersione();
      });
    }

    document.addEventListener('fullscreenchange', function () {
      if (!elementoFullscreen()) {
        if (immerso && !pseudoPieno) {
          immerso = false;
          if (frame) frame.classList.remove('is-immerso');
          if (btnEsci) btnEsci.hidden = true;
        }
      }
    });
    document.addEventListener('webkitfullscreenchange', function () {
      if (!elementoFullscreen()) {
        if (immerso && !pseudoPieno) {
          immerso = false;
          if (frame) frame.classList.remove('is-immerso');
          if (btnEsci) btnEsci.hidden = true;
        }
      }
    });

    window.addEventListener('popstate', function () {
      if (chiudendoStoria) return;
      if (isImmerso()) {
        uscireImmersione({ fromPopstate: true });
        saidaHistoryArmed = false;
        armareStoriaUscita();
        return;
      }
      if (saidaAperta) {
        saidaHistoryArmed = false;
        chiudereUscita({ riprendere: false });
        return;
      }
      saidaHistoryArmed = false;
      if (tentareUscita()) armareStoriaUscita();
    });

    video.addEventListener('click', function (e) {
      /* Sem controles nativos: o clique no vídeo pausa ou retoma. */
      if (Date.now() < ignoreClickAte) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (awayPaused) {
        e.preventDefault();
        riprendiDalRitorno();
        return;
      }
      if (!iniziato) return;
      if (video.paused) playWithSound();
      else video.pause();
    });

    video.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    video.addEventListener('waiting', function () { if (playRichiesto) setLoading(true); });
    video.addEventListener('canplay', function () { setLoading(false); });
    video.addEventListener('playing', function () { setLoading(false); iniziato = true; syncPlay(); syncMute(); });
    video.addEventListener('play', function () { iniziato = true; awayPaused = false; mostraRetorno(false); syncPlay(); syncMute(); });
    video.addEventListener('pause', function () {
      syncPlay();
      syncMute();
      persistire();
      if (!awayPaused) uscireImmersione();
    });
    video.addEventListener('volumechange', syncMute);
    video.addEventListener('timeupdate', function () { applySeekGuard(true); });
    video.addEventListener('seeking', function () { applySeekGuard(true); });
    video.addEventListener('seeked', function () { applySeekGuard(true); });
    video.addEventListener('loadedmetadata', function () {
      ripristinaPosizione();
      ctaPerTempo();
    });
    video.addEventListener('ended', function () {
      if (isFinite(video.duration) && video.duration > watchedMax) watchedMax = video.duration;
      lastTick = watchedMax;
      persistire();
      ctaPerTempo();
      syncPlay();
      uscireImmersione();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        saidaLeftTab = true;
        pausaPerUscita();
      } else if (saidaLeftTab) {
        saidaLeftTab = false;
        tentareUscita({ permitirImmerso: true });
      }
    });
    window.addEventListener('blur', function () {
      if (document.hidden || !document.hasFocus()) pausaPerUscita();
    });

    document.addEventListener('keydown', function (e) {
      var alvo = e.target;
      var noVolume = alvo && alvo.closest && alvo.closest('[data-vsl-volume]');
      var seekKey = e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End'
        || e.key === 'j' || e.key === 'l' || e.key === 'J' || e.key === 'L'
        || e.key === ',' || e.key === '.'
        || (e.key.length === 1 && e.key >= '0' && e.key <= '9');
      if (seekKey && !noVolume) {
        e.preventDefault();
        e.stopPropagation();
      }
      if ((e.key === 'Escape' || e.key === 'Esc') && saidaAperta) {
        e.preventDefault();
        e.stopPropagation();
        chiudereUscita({ riprendere: false });
        return;
      }
      if ((e.key === 'Escape' || e.key === 'Esc') && isImmerso()) {
        e.preventDefault();
        uscireImmersione();
      }
    }, true);


    var boxUscita = document.querySelector('[data-vsl-saida]');
    var elTraUscita = document.querySelector('[data-vsl-saida-tra]');
    var btnCtaUscita = document.querySelector('[data-vsl-saida-cta]');
    var btnChiudiUscita = document.querySelector('[data-vsl-saida-chiudi]');
    var backdropUscita = document.querySelector('[data-vsl-saida-backdrop]');

    function copyUscita() {
      return (typeof window.EXIT_COPY === 'object' && window.EXIT_COPY) ? window.EXIT_COPY : {};
    }

    function restoUscita() {
      var rest = delay - watchedMax;
      if (!isFinite(rest)) rest = delay;
      return Math.max(0, rest);
    }

    function formatTempoUscita(sec) {
      var s = Math.max(0, Math.round(sec));
      var m = Math.floor(s / 60);
      var r = s % 60;
      return m + ':' + (r < 10 ? '0' : '') + r;
    }

    function forzaTestUscita() {
      return false;
    }

    function giaMostrataUscita() {
      if (window.EXIT_ONCE_PER_SESSION === false) return false;
      try {
        return sessionStorage.getItem(window.EXIT_SESSION_KEY || 'bsitExitShown') === '1';
      } catch (e) { return false; }
    }

    function segnaUscitaMostrata() {
      if (window.EXIT_ONCE_PER_SESSION === false) return;
      try { sessionStorage.setItem(window.EXIT_SESSION_KEY || 'bsitExitShown', '1'); } catch (e) {}
    }

    function ultimoChiusuraUscita() {
      try {
        var raw = sessionStorage.getItem(window.EXIT_LAST_CLOSE_KEY || 'bsitExitLastClose');
        var n = raw ? Number(raw) : 0;
        return isFinite(n) ? n : 0;
      } catch (e) { return 0; }
    }

    function segnaChiusuraUscita() {
      try {
        sessionStorage.setItem(window.EXIT_LAST_CLOSE_KEY || 'bsitExitLastClose', String(Date.now()));
      } catch (e) {}
    }

    function inCooldownUscita() {
      var sec = Number(window.EXIT_COOLDOWN_SECONDS);
      if (!isFinite(sec) || sec <= 0) return false;
      var last = ultimoChiusuraUscita();
      if (!last) return false;
      return (Date.now() - last) < (sec * 1000);
    }

    function puoMostrareUscita(forza) {
      if (window.SHOW_EXIT_INTENT === false) return false;
      if (saidaAperta) return false;
      if (rivelata) return false;
      if (restoUscita() <= 0) return false;
      if (!forza && inCooldownUscita()) return false;
      if (!forza && giaMostrataUscita()) return false;
      return true;
    }

    function aggiornareContatoreUscita() {
      var rest = restoUscita();
      var tpl = copyUscita().tra || 'Tra soli {TEMPO}';
      if (elTraUscita) {
        elTraUscita.textContent = String(tpl).replace('{TEMPO}', formatTempoUscita(rest));
        elTraUscita.setAttribute('data-tempo', formatTempoUscita(rest));
      }
      if (saidaAperta && rest <= 0) {
        chiudereUscita({ riprendere: false });
        ctaPerTempo();
      }
    }

    function armareStoriaUscita() {
      if (saidaHistoryArmed) return;
      if (!puoMostrareUscita(false) && !saidaAperta) return;
      try {
        history.pushState({ bsitExit: 1 }, '');
        saidaHistoryArmed = true;
      } catch (e) {}
    }

    function trappolaFocusUscita(e) {
      if (!saidaAperta || !boxUscita || e.key !== 'Tab') return;
      var nodes = boxUscita.querySelectorAll('button:not([hidden]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      var list = [];
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].offsetParent !== null || nodes[i] === document.activeElement) list.push(nodes[i]);
      }
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function aprireUscita() {
      if (!puoMostrareUscita(forzaTestUscita())) return false;
      if (!boxUscita) return false;
      if (typeof window.bsitApplicareExitCopy === 'function') window.bsitApplicareExitCopy();
      saidaAperta = true;
      uscireImmersione();
      awayPaused = false;
      mostraRetorno(false);
      if (!video.paused) {
        ignoreAwayAte = Date.now() + 400;
        video.pause();
      }
      mostraRetorno(false);
      if (playOverlay) playOverlay.hidden = true;
      aggiornareContatoreUscita();
      boxUscita.hidden = false;
      document.documentElement.classList.add('vsl-saida-aperta');
      saidaLastFocus = document.activeElement;
      if (saidaTimer) clearInterval(saidaTimer);
      saidaTimer = setInterval(aggiornareContatoreUscita, 1000);
      segnaUscitaMostrata();
      setTimeout(function () {
        if (btnCtaUscita) btnCtaUscita.focus();
      }, 30);
      syncPlay();
      return true;
    }

    function chiudereUscita(opts) {
      opts = opts || {};
      if (!saidaAperta && (!boxUscita || boxUscita.hidden)) {
        if (opts.riprendere) playWithSound();
        return;
      }
      saidaAperta = false;
      segnaChiusuraUscita();
      ignoreAwayAte = Date.now() + 800;
      if (saidaTimer) { clearInterval(saidaTimer); saidaTimer = null; }
      if (boxUscita) boxUscita.hidden = true;
      document.documentElement.classList.remove('vsl-saida-aperta');
      if (!isImmerso()) document.body.style.overflow = '';
      if (saidaLastFocus && typeof saidaLastFocus.focus === 'function') {
        try { saidaLastFocus.focus(); } catch (e) {}
      }
      saidaLastFocus = null;
      syncPlay();
      if (opts.riprendere) playWithSound();
    }

    function tentareUscita(opts) {
      opts = opts || {};
      if (Date.now() < ignoreAwayAte) return false;
      if (isImmerso() && !opts.permitirImmerso) return false;
      if (!puoMostrareUscita(false)) return false;
      return aprireUscita();
    }

    if (btnCtaUscita) {
      btnCtaUscita.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        chiudereUscita({ riprendere: true });
      });
    }
    if (btnChiudiUscita) {
      btnChiudiUscita.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        chiudereUscita({ riprendere: false });
      });
    }
    if (backdropUscita) {
      backdropUscita.addEventListener('click', function (e) {
        e.preventDefault();
        chiudereUscita({ riprendere: false });
      });
    }
    document.addEventListener('keydown', trappolaFocusUscita, true);

    document.addEventListener('mouseout', function (e) {
      if (e.relatedTarget || e.toElement) return;
      if (typeof e.clientY === 'number' && e.clientY > 0) return;
      tentareUscita();
    });

    var scrollYUscita = window.scrollY || 0;
    var scrollTUscita = Date.now();
    window.addEventListener('scroll', function () {
      var touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      if (!touch) { scrollYUscita = window.scrollY || 0; return; }
      var y = window.scrollY || 0;
      var t = Date.now();
      var dy = scrollYUscita - y;
      var dt = Math.max(1, t - scrollTUscita);
      scrollYUscita = y;
      scrollTUscita = t;
      if (dy > 90 && dy / dt > 0.55 && y < 160) tentareUscita();
    }, { passive: true });

    armareStoriaUscita();

    if (video.readyState >= 1) ripristinaPosizione();
    setLoading(false);
    syncPlay();
    syncMute();
    ctaPerTempo();
  }

  document.querySelectorAll('[data-vsl-player]').forEach(init);
})();
