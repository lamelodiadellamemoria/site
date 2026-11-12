/* Pixel da Meta (só PageView) + script de visitas do labofertas.
   Nunca dispara fbq('track', 'Purchase') — a compra entra só pela CAPI do checkout.
   Só inicializa o pixel se PIXEL_ID for um número. O marcador 'PIXEL_ID' não dispara nada. */
(function (global) {
  var id = String(global.PIXEL_ID || '').trim();
  var idOk = /^\d{8,}$/.test(id);

  if (idOk) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', id);
    fbq('track', 'PageView');
  }

  var src = String(global.LAB_SCRIPT_SRC || '').trim();
  if (src && /^https:\/\/painel\.labofertas\.com\/api\/lp\/script\?/.test(src)) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }
})(window);
