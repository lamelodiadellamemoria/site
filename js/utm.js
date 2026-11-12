/* Repasse de UTM + fbclid da página para a VSL e o checkout.
   Mesma lógica corrigida da Lucro na Mão (10/11/2026):
   - script síncrono no <head>, chamado logo após o primeiro CTA no HTML
     (quem toca rápido, no 4G ou no Instagram, já encontra o <a> com a query);
   - descarta só o valor (ou a chave) cru de placeholder do Meta ({{campaign.id}});
   - mantém os demais parâmetros;
   - localStorage com validade de 7 dias, só com a query já limpa
     (ida à privacy, recarga, volta sem query).
   Botões são <a>, nunca <button> com location.href. */
(function (global) {
  var MACRO = /\{\{[^}]+\}\}/;
  var TTL = 7 * 24 * 60 * 60 * 1000;

  function chave() {
    return global.BSIT_STORAGE_KEY || 'bsit_qs';
  }

  function limpar(qs) {
    if (!qs) return '';
    var p, out, s;
    try { p = new URLSearchParams(String(qs).replace(/^\?/, '')); }
    catch (e) { return ''; }
    out = new URLSearchParams();
    p.forEach(function (valor, nome) {
      if (MACRO.test(nome) || MACRO.test(valor)) return;
      out.append(nome, valor);
    });
    s = out.toString();
    return s ? ('?' + s) : '';
  }

  function queryAtual() {
    var qs = '';
    try {
      var bruto = location.search || '';
      var chegada = limpar(bruto);
      if (chegada) {
        qs = chegada;
        localStorage.setItem(chave(), JSON.stringify({ qs: qs, em: Date.now() }));
      } else if (!bruto) {
        var salvo = JSON.parse(localStorage.getItem(chave()) || 'null');
        if (salvo && salvo.qs && (Date.now() - salvo.em) < TTL) qs = limpar(salvo.qs);
        else if (salvo) localStorage.removeItem(chave());
      }
    } catch (e) {}
    return qs;
  }

  function montar(base) {
    if (!base) return base;
    var qs = queryAtual();
    if (!qs) return base;
    qs = qs.replace(/^\?/, '');
    var hash = '';
    var hashAt = base.indexOf('#');
    if (hashAt >= 0) {
      hash = base.slice(hashAt);
      base = base.slice(0, hashAt);
    }
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + qs + hash;
  }

  function aplicar() {
    var checkout = global.CHECKOUT_URL || 'https://pay.hotmart.com/O108456895I';
    var vsl = global.VSL_URL || '/video/';
    var hrefCheckout = montar(checkout);
    var hrefVsl = montar(vsl);
    document.querySelectorAll('a[data-checkout]').forEach(function (a) {
      a.href = hrefCheckout;
    });
    document.querySelectorAll('a[data-vsl]').forEach(function (a) {
      a.href = hrefVsl;
    });
    return { checkout: hrefCheckout, vsl: hrefVsl };
  }

  global.bsitQueryLimpa = queryAtual;
  global.bsitMontarUrl = montar;
  global.bsitAplicarLinks = aplicar;
})(window);
