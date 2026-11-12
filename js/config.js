/* Configuração do funil Brain Song IT
   Um único lugar para os valores que ainda vão chegar.
   Não invente ID, link de checkout ou fonte do pixel. */

/* Link de checkout oficial (Hotmart). Os <a data-checkout> recebem a query da página via bsitMontarUrl. */
var CHECKOUT_URL = 'https://pay.hotmart.com/O108456895I';

/* Página da VSL. Os CTAs da ponte usam este caminho e levam a query. */
var VSL_URL = '/video/';

/* Preço de frente, decidido pelo Vini. Formato italiano, um só valor em todos os pontos.
   A página lê este valor via [data-price]. Não há preço anterior nem riscado. */
var PRICE = '24,90 €';

/* Nome do produto, decidido pelo Vini (11/11/2026). A página preenche [data-product-name].
   data-product-name="di"|"su"|"in"|"a"|"da" produz a forma contraída (della, sulla, …). */
var PRODUCT_NAME = 'La Melodia della Memoria';

/* Abertura da VSL. 'levi-montalcini' (escolhida pelo Vini) ou 'famiglia' (alternativa B).
   Trocar esta flag troca o cartaz inicial e o arquivo de legendas, sem reeditar o HTML. */
var VSL_OPENING = 'levi-montalcini';

/* Segundo em que o preço grande aparece na página (frase do preço final no vídeo).
   Na v10h a cartela e a fala «ventiquattro euro e novanta» caem em 765 s (12:45),
   21 s depois do botão (744). As notas antigas ligavam o preço ao CTA + 24 s
   (1009 → 1033; nessa conta seria 768). Validei pelo corte final (conferência
   v10h_preco_765s.png e mapa da trilha 744.2–764.9). Confirmar com o Vini. */
var PRICE_REVEAL_SECONDS = 765;


/* Garantia, decidida pelo Vini: 30 dias. A página lê via [data-guarantee-days]
   (o número) e [data-guarantee-label] (texto italiano, ex. "Garanzia di 30 giorni"). */
var GUARANTEE_DAYS = 30;

/* Plataforma de pagamento. O CHECKOUT_URL aponta para o checkout oficial Hotmart. */
var PAYMENT_PLATFORM = 'Hotmart';

/* E-mail de suporte da oferta: contatto@lamelodiadellamemoria.com.
   O domínio da oferta ainda não foi definido (pedido-construcao.md, estrategia §9.10,
   checkout-ficha.md pendência 7). Fica o marcador óbvio até existir o domínio. */
var SUPPORT_EMAIL = 'contatto@lamelodiadellamemoria.com';

/* Pixel da Meta. ID confirmado com o Vini.
   pixel.js só chama fbq('init') e fbq('track','PageView') se o valor for um número. */
var PIXEL_ID = '3962907623856835';

/* Script de visitas do labofertas (instalacao.script do painel).
   Vazio = não injeta o script. */
var LAB_SCRIPT_SRC = '';

/* Tempo, em segundos, para o botão de compra aparecer na VSL.
   12:24 = 744 s, início do bloco do preço na v10h (frase / cartela do pulsante).
   O atraso conta só o tempo realmente assistido (currentTime avançado pela
   reprodução), gravado em localStorage (BSIT_VSL_WATCH_KEY). Recarregar retoma
   desse ponto e não zera o reveal. Sem relógio de parede e sem ?cta / ?mostra-cta. */
var CTA_DELAY_SECONDS = 744;

/* Chave do progresso assistido da VSL (tempo máximo visto + flags de reveal). */
var BSIT_VSL_WATCH_KEY = 'bsitVslWatch';
var BSIT_VSL_WATCH_VERSION = 'v10i';

/* Cookie legado (bsitRepeatVSL). Não libera mais o botão sozinho: o reveal
   segue o tempo assistido no localStorage. Mantido só por compatibilidade. */
var REPEAT_COOKIE = 'bsitRepeatVSL';
var REPEAT_COOKIE_DAYS = 1;

/* Entrada direta: se a query tiver este parâmetro e este valor, o botão
   aparece na hora (equivalente ao pid=vsla2 do original). Nome e valor
   são configuráveis. O parâmetro segue na query levada ao checkout. */
var SHOW_CTA_PARAM = 'pid';
var SHOW_CTA_VALUE = 'vsla2';

/* Fonte do player: VSL v10i (mesma duração e áudio da v10h, 16:9). Sem autoplay. preload metadata.
   Pode ser caminho relativo à página /video/ ou URL absoluta https://...
   O player aplica este valor no <source> e não define crossorigin, para o
   streaming em host externo (Range) não quebrar por CORS. */
var VSL_VIDEO_SRC = '../media/brainsong_it_vsl_v10h-marca_16x9.mp4';
var VSL_POSTER = '../img/vsl-poster.webp';
var VIDEO_SRC = VSL_VIDEO_SRC;
var VIDEO_POSTER = VSL_POSTER;

/* Nome da versão da VSL no painel (data-lab-vsl). VSL nova, nome novo. */
var VSL_NAME = 'vsl-it-v10i';

/* Chave do localStorage da query (isolada desta oferta; TTL 7 dias). */
var BSIT_STORAGE_KEY = 'bsit_qs';


/* Campos editoriais (copy v8). Vazios = o elemento some da tela.
   Não invente testata, autor, data, foto ou logotipos. */
var SITE_NAME = 'La Melodia della Memoria';
var BRIDGE_MASTHEAD = 'Benessere Ogni Giorno';
var AUTHOR_NAME = 'Il team della Melodia della Memoria';
var UPDATE_DATE = '11 novembre 2026';
var EXPERT_NAME = '';
/* 'bellini' = foto e falas do Dott. Marco Bellini (modo fixo desta publicação).
   'marca' (ou '') = voz da marca, sem nome/foto Bellini.
   O modo não é mais alterado por parâmetro de URL. */
var EXPERT_MODE = 'bellini';
/* Cidade retirada: o médico não vai informar; Copywriter manda linhas novas se precisar.
   Vazio esconde o trecho, sem colchete na tela. */
var EXPERT_CITY = '';
/* Fotos oficiais do Editor em medico/pagina/. Troca o caminho para substituir. */
var EXPERT_PHOTO = '/img/bellini_pagina-quadro_528x660.webp';
var EXPERT_PHOTO_SMALL = '/img/bellini_ponte-firma_128x128.webp';
var EXPERT_PHOTO_SMALL_2X = '/img/bellini_ponte-firma_256x256.webp';
var HERO_IMAGE = '';
var PRODUCT_IMAGE = '';
var PAYMENT_METHODS = '';
var COMPANY_NAME = '';
var VAT_NUMBER = '';
var COMPANY_ADDRESS = '';
var PRIVACY_EMAIL = '';
/* Única flag do slot .faixa-logos / [data-reserved="source-logos"].
   false = escondido. Não ligar sem cessão de uso dos logotipos.
   Se a flag for ligada, os itens continuam só visuais: bsitDeslinkarLogos()
   troca qualquer <a> interno por <span> (sem href, sem click). */
var SHOW_SOURCE_LOGOS = false;
var SHOW_SOCIAL_PROOF = false;

/* Pop-up di uscita (exit-intent). Copia in EXIT_COPY.
   Sem gancho de teste por query string. */
var SHOW_EXIT_INTENT = true;
/* Pop-up de saída PODE reaparecer. Sem limite de 1x por sessão (bsitExitShown).
   Regra anti-spam (escolhida): depois de fechar, espera EXIT_COOLDOWN_SECONDS
   (45 s de relógio) para reabrir, qualquer que seja o gatilho. No fechamento
   o player também arma ignoreAwayAte (~800 ms) para não reabrir em sequência
   pelo mesmo gatilho (mouseout residual, troca de foco, visibilidade).
   Continua NÃO abrindo depois do CTA (744 s / restoUscita() <= 0),
   inclusive com ?saida=1. ?saida=1 ignora só o intervalo de 45 s.
   EXIT_SESSION_KEY fica como legado e não trava mais (ONCE=false). */
var EXIT_ONCE_PER_SESSION = false;
var EXIT_SESSION_KEY = 'bsitExitShown';
var EXIT_COOLDOWN_SECONDS = 45;
var EXIT_LAST_CLOSE_KEY = 'bsitExitLastClose';
/* Link «Preferisci leggere?» do pop-up de saída, para /versione-scritta/. */
var EXIT_TEXT_VERSION_URL = '/versione-scritta/';
var SHOW_EXIT_TEXT_LINK = true;
var EXIT_IMAGE = '../img/vsl-saida.webp';
var EXIT_COPY = {
  attesa: 'ASPETTA!',
  tra: 'Tra soli {TEMPO} ti mostro come funziona, quanto costa e come provarla senza rischi.',
  sottotitolo: 'Una routine di ascolto di 15 minuti al giorno, a casa, con le cuffie, per prenderti cura della tua memoria.',
  paragrafo: 'Se ti capita di cercare un nome che conosci benissimo, sappi che il ricordo c\'è ancora. È nel cassetto: solo che non si apre al momento giusto. Se hai passato i cinquanta, guarda il video fino alla fine.',
  cta: 'Continua a guardare il video',
  testoLink: 'Preferisci leggere? Apri la versione scritta',
  chiudi: 'Chiudi'
};

function bsitGaranziaLabel() {
  var n = Number(GUARANTEE_DAYS);
  if (!isFinite(n) || n <= 0) n = 30;
  return 'Garanzia di ' + n + ' giorni';
}

function bsitNomeProdotto(prep) {
  var nome = typeof PRODUCT_NAME === 'string' ? PRODUCT_NAME : '';
  if (!nome) return '';
  var resto = nome.replace(/^La\s+/, '');
  var map = { di: 'della ', su: 'sulla ', in: 'nella ', a: 'alla ', da: 'dalla ' };
  if (prep && map[prep]) return map[prep] + resto;
  return nome;
}

function bsitApplicarePrezzo() {
  var p = typeof PRICE === 'string' ? PRICE : '';
  if (!p || !document.querySelectorAll) return;
  document.querySelectorAll('[data-price]').forEach(function (el) {
    el.textContent = p;
  });
}

function bsitMarcador(nome) {
  return new RegExp('\\[' + nome + '\\]', 'g');
}

function bsitApplicareNome() {
  if (!document.querySelectorAll) return;
  document.querySelectorAll('[data-product-name]').forEach(function (el) {
    var prep = el.getAttribute('data-product-name');
    el.textContent = bsitNomeProdotto(prep);
  });
  document.querySelectorAll('[data-product-title]').forEach(function (el) {
    var base = el.getAttribute('data-product-title') || el.textContent;
    el.textContent = base.replace(bsitMarcador('NOME'), bsitNomeProdotto());
  });
  if (document.title && bsitMarcador('NOME').test(document.title)) {
    document.title = document.title.replace(bsitMarcador('NOME'), bsitNomeProdotto());
  }
}

function bsitApplicareGaranzia() {
  if (!document.querySelectorAll) return;
  var n = Number(GUARANTEE_DAYS);
  if (!isFinite(n) || n <= 0) n = 30;
  var label = bsitGaranziaLabel();
  document.querySelectorAll('[data-guarantee-days]').forEach(function (el) {
    el.textContent = String(n);
  });
  document.querySelectorAll('[data-guarantee-label]').forEach(function (el) {
    el.textContent = label;
  });
}

function bsitCampoVisibile(v) {
  if (typeof v !== 'string') return '';
  v = v.trim();
  if (!v) return '';
  if (v.indexOf('[') !== -1 || v.indexOf(']') !== -1) return '';
  if (v === 'PIXEL_ID') return '';
  return v;
}


function bsitEmailSuporte() {
  var v = typeof SUPPORT_EMAIL === 'string' ? SUPPORT_EMAIL.trim() : '';
  if (!v) return '';
  return bsitCampoVisibile(v);
}

function bsitEsconder(el) {
  if (!el) return;
  el.setAttribute('hidden', '');
}

function bsitMostrar(el) {
  if (!el) return;
  el.removeAttribute('hidden');
}

function bsitPreencherCampo(sel, valor) {
  if (!document.querySelectorAll) return;
  var vis = bsitCampoVisibile(valor);
  document.querySelectorAll(sel).forEach(function (el) {
    if (vis) {
      el.textContent = vis;
      bsitMostrar(el);
    } else {
      el.textContent = '';
      bsitEsconder(el);
    }
  });
}

function bsitApplicareContatto() {
  if (!document.querySelectorAll) return;
  var email = bsitEmailSuporte();
  var plat = typeof PAYMENT_PLATFORM === 'string' ? PAYMENT_PLATFORM : '';
  document.querySelectorAll('[data-support-email]').forEach(function (el) {
    if (email) {
      el.textContent = email;
      bsitMostrar(el);
    } else {
      el.textContent = '';
      bsitEsconder(el);
    }
  });
  document.querySelectorAll('a[data-support-email-href]').forEach(function (a) {
    if (email) {
      a.setAttribute('href', 'mailto:' + email);
      bsitMostrar(a);
    } else {
      a.removeAttribute('href');
      bsitEsconder(a);
    }
  });
  if (plat) {
    document.querySelectorAll('[data-platform]').forEach(function (el) {
      el.textContent = plat;
    });
  }
}

function bsitDeslinkarLogos() {
  if (!document.querySelectorAll) return;
  var slots = document.querySelectorAll('[data-reserved="source-logos"], .faixa-logos');
  Array.prototype.forEach.call(slots, function (slot) {
    var links = slot.querySelectorAll('a');
    Array.prototype.forEach.call(links, function (a) {
      var span = document.createElement('span');
      if (a.className) span.className = a.className;
      if (a.id) span.id = a.id;
      var title = a.getAttribute('title');
      if (title) span.setAttribute('title', title);
      var aria = a.getAttribute('aria-label');
      if (aria) span.setAttribute('aria-label', aria);
      while (a.firstChild) span.appendChild(a.firstChild);
      if (a.parentNode) a.parentNode.replaceChild(span, a);
    });
  });
}

function bsitApplicareEditoria() {
  if (!document.querySelectorAll) return;
  var map = {
    'site-name': SITE_NAME,
    'bridge-masthead': (typeof BRIDGE_MASTHEAD === 'string' ? BRIDGE_MASTHEAD : ''),
    'author-name': AUTHOR_NAME,
    'update-date': UPDATE_DATE,
    'expert-name': EXPERT_NAME,
    'expert-city': (typeof EXPERT_CITY === 'string' ? EXPERT_CITY : ''),
    'payment-methods': PAYMENT_METHODS,
    'company-name': COMPANY_NAME,
    'vat-number': VAT_NUMBER,
    'company-address': COMPANY_ADDRESS,
    'privacy-email': PRIVACY_EMAIL
  };
  Object.keys(map).forEach(function (key) {
    bsitPreencherCampo('[data-field="' + key + '"]', map[key]);
  });

  /* Imagens e blocos reservados: só aparecem com valor/flag configurado. */
  var imgs = {
    'expert-photo': EXPERT_PHOTO,
    'expert-photo-small': (typeof EXPERT_PHOTO_SMALL === 'string' ? EXPERT_PHOTO_SMALL : ''),
    'hero-image': HERO_IMAGE,
    'product-image': PRODUCT_IMAGE
  };
  Object.keys(imgs).forEach(function (key) {
    var src = bsitCampoVisibile(typeof imgs[key] === 'string' ? imgs[key] : '');
    document.querySelectorAll('[data-field="' + key + '"]').forEach(function (el) {
      if (src) {
        if (el.tagName === 'IMG') {
          el.setAttribute('src', src);
          if (key.indexOf('expert-photo') === 0) {
            el.setAttribute('alt', 'Dott. Marco Bellini, neurologo');
          } else {
            el.removeAttribute('alt');
            el.setAttribute('alt', '');
          }
        }
        bsitMostrar(el);
      } else {
        bsitEsconder(el);
      }
    });
  });

  bsitDeslinkarLogos();

  var flags = {
    'source-logos': SHOW_SOURCE_LOGOS === true,
    'social-proof': SHOW_SOCIAL_PROOF === true,
    'exit-text-link': SHOW_EXIT_TEXT_LINK === true && !!(typeof EXIT_TEXT_VERSION_URL === 'string' && EXIT_TEXT_VERSION_URL.trim())
  };
  Object.keys(flags).forEach(function (key) {
    document.querySelectorAll('[data-reserved="' + key + '"]').forEach(function (el) {
      if (flags[key]) bsitMostrar(el);
      else bsitEsconder(el);
    });
  });

  function campoOk(name) {
    if (name === 'support-email') return !!bsitEmailSuporte();
    if (name === 'source-logos') return SHOW_SOURCE_LOGOS === true;
    if (name === 'social-proof') return SHOW_SOCIAL_PROOF === true;
    if (name === 'exit-text-link') return SHOW_EXIT_TEXT_LINK === true && !!(typeof EXIT_TEXT_VERSION_URL === 'string' && EXIT_TEXT_VERSION_URL.trim());
    return !!bsitCampoVisibile(map[name] || imgs[name] || '');
  }
  document.querySelectorAll('[data-requires]').forEach(function (el) {
    var req = (el.getAttribute('data-requires') || '').split(/\s+/).filter(Boolean);
    var ok = req.length && req.every(campoOk);
    if (ok) bsitMostrar(el);
    else bsitEsconder(el);
  });
  document.querySelectorAll('[data-requires-any]').forEach(function (el) {
    var req = (el.getAttribute('data-requires-any') || '').split(/\s+/).filter(Boolean);
    var ok = req.some(campoOk);
    if (ok) bsitMostrar(el);
    else bsitEsconder(el);
  });

  document.querySelectorAll('.nota-interna').forEach(function (el) {
    bsitEsconder(el);
  });

  /* Título: tira marcadores de testata / link de checkout se o campo não estiver pronto. */
  if (document.title) {
    var site = bsitCampoVisibile(SITE_NAME);
    var title = document.title;
    title = title.replace(new RegExp('\\s*·\\s*' + bsitMarcador('TESTATA').source, 'g'), site ? (' · ' + site) : '');
    title = title.replace(bsitMarcador('TESTATA'), site);
    title = title.replace(bsitMarcador('LINK_CHECKOUT'), '');
    title = title.replace(new RegExp('\\[' + 'NOME_SITO' + '(?::[^\\]]+)?\\]', 'g'), site);
    title = title.replace(/\s*·\s*$/, '').trim();
    if (!title) title = (typeof PRODUCT_NAME === 'string' && PRODUCT_NAME) ? PRODUCT_NAME : 'Pagina';
    document.title = title;
  }
}

/* Preenche preço, garantia, e-mail, plataforma e campos editoriais a partir do config.js. */

function bsitExpertMode() {
  var m = String(typeof EXPERT_MODE === 'string' ? EXPERT_MODE : '').trim().toLowerCase();
  return m === 'bellini' ? 'bellini' : 'marca';
}

function bsitApplicareExpert() {
  if (!document.querySelectorAll) return;
  var mode = bsitExpertMode();
  document.documentElement.setAttribute('data-expert-mode', mode);
  document.querySelectorAll('[data-expert-mode]').forEach(function (el) {
    var want = (el.getAttribute('data-expert-mode') || '').trim().toLowerCase();
    if (want !== mode) {
      bsitEsconder(el);
      return;
    }
    if (el.hasAttribute('data-requires') || el.hasAttribute('data-requires-any')) return;
    bsitMostrar(el);
  });
  var photo = bsitCampoVisibile(typeof EXPERT_PHOTO === 'string' ? EXPERT_PHOTO : '');
  var small = bsitCampoVisibile(typeof EXPERT_PHOTO_SMALL === 'string' ? EXPERT_PHOTO_SMALL : '');
  var small2x = bsitCampoVisibile(typeof EXPERT_PHOTO_SMALL_2X === 'string' ? EXPERT_PHOTO_SMALL_2X : '');
  document.querySelectorAll('[data-field="expert-photo"]').forEach(function (el) {
    if (el.tagName !== 'IMG') return;
    if (mode === 'bellini' && photo) {
      el.setAttribute('src', photo);
      el.setAttribute('alt', 'Dott. Marco Bellini, neurologo');
      bsitMostrar(el);
    } else {
      el.removeAttribute('src');
      el.removeAttribute('srcset');
      el.setAttribute('alt', '');
      bsitEsconder(el);
    }
  });
  document.querySelectorAll('[data-field="expert-photo-small"]').forEach(function (el) {
    if (el.tagName !== 'IMG') return;
    if (mode === 'bellini' && small) {
      el.setAttribute('src', small);
      if (small2x) el.setAttribute('srcset', small + ' 1x, ' + small2x + ' 2x');
      else el.removeAttribute('srcset');
      el.setAttribute('alt', 'Dott. Marco Bellini, neurologo');
      bsitMostrar(el);
    } else {
      el.removeAttribute('src');
      el.removeAttribute('srcset');
      el.setAttribute('alt', '');
      bsitEsconder(el);
    }
  });
}


function bsitApplicareExitCopy() {
  if (!document.querySelectorAll) return;
  var copy = (typeof EXIT_COPY === 'object' && EXIT_COPY) ? EXIT_COPY : {};
  document.querySelectorAll('[data-exit-copy]').forEach(function (el) {
    var key = el.getAttribute('data-exit-copy');
    if (!key || copy[key] == null) return;
    if (key === 'tra') return;
    el.textContent = String(copy[key]);
  });
  var img = document.querySelector('[data-vsl-saida-img]');
  if (img && typeof EXIT_IMAGE === 'string' && EXIT_IMAGE) img.setAttribute('src', EXIT_IMAGE);
  var link = document.querySelector('[data-vsl-saida-testo]');
  var url = (typeof EXIT_TEXT_VERSION_URL === 'string') ? EXIT_TEXT_VERSION_URL.trim() : '';
  if (link) {
    if (url) {
      if (typeof window.bsitMontarUrl === 'function') url = window.bsitMontarUrl(url);
      link.setAttribute('href', url);
    } else {
      link.setAttribute('href', '#');
    }
    if (copy.testoLink) link.textContent = String(copy.testoLink);
  }
  var x = document.querySelector('[data-vsl-saida-chiudi]');
  if (x && copy.chiudi) x.setAttribute('aria-label', String(copy.chiudi));
}

function bsitApplicareCampi() {
  bsitApplicarePrezzo();
  bsitApplicareGaranzia();
  bsitApplicareContatto();
  bsitApplicareNome();
  bsitApplicareEditoria();
  bsitApplicareExpert();
  bsitApplicareExitCopy();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bsitApplicareCampi);
} else {
  bsitApplicareCampi();
}
