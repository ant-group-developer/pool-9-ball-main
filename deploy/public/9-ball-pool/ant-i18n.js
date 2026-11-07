/*
 * ANT Play localisation for 9 Ball Pool (Vietnamese / English).
 * - Language comes from ?lang=vi|en (default vi). The browser language is never used.
 * - The parent page can switch live: postMessage({type:'ant-play:locale', locale:'vi'|'en'}).
 * - PlayCanvas text elements are mapped English -> Vietnamese and drawn with a bundled
 *   canvas font (Paytone One) because the original Cubano MSDF atlas has ASCII glyphs only.
 * - Textures with baked English words are redrawn on a canvas with Vietnamese text and
 *   swapped in place (texture.setSource); switching back restores the original image.
 */
(function () {
  'use strict';

  var LANGS = { vi: true, en: true };
  function pick(v) { v = String(v || '').toLowerCase(); return LANGS[v] ? v : null; }
  var lang = pick(new URLSearchParams(location.search).get('lang')) || 'vi';
  document.documentElement.lang = lang;

  var HEAVY = '"Paytone One", "Arial Black", Arial, sans-serif';
  var LIGHT = '"Josefin Sans", "Segoe UI", Arial, sans-serif';
  var VI_RANGE = 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB';
  var LATIN_RANGE = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
  function face(family, weight, file, range) {
    return "@font-face{font-family:'" + family + "';font-style:normal;font-weight:" + weight +
      ";font-display:block;src:url(fonts/" + file + ") format('woff2');unicode-range:" + range + '}';
  }
  var style = document.createElement('style');
  style.textContent = [
    face('Paytone One', 400, 'paytone-one-vietnamese.woff2', VI_RANGE),
    face('Paytone One', 400, 'paytone-one-latin.woff2', LATIN_RANGE),
    face('Josefin Sans', 300, 'josefin-sans-300-vietnamese.woff2', VI_RANGE),
    face('Josefin Sans', 300, 'josefin-sans-300-latin.woff2', LATIN_RANGE)
  ].join('\n');
  document.head.appendChild(style);
  var SAMPLE = 'ẮẰẲẴẶĂÂẤẦẨẪẬĐÊẾỀỂỄỆÔỐỒỔỖỘƠỚỜỞỠỢƯỨỪỬỮỰÀÁẢÃẠÈÉẺẼẸÌÍỈĨỊÒÓỎÕỌÙÚỦŨỤỲÝỶỸỴ ABC 0123';
  var fontsReady = Promise.all([
    document.fonts.load('48px "Paytone One"', SAMPLE),
    document.fonts.load('300 48px "Josefin Sans"', SAMPLE)
  ]).catch(function () {});

  // ---------------------------------------------------------------- text elements
  var VI_TEXT = {
    'foul': 'Lỗi',
    'foul: no ball hit': 'Lỗi: không chạm bi nào',
    'foul: wrong ball touched first': 'Lỗi: chạm sai bi trước',
    "foul: can't pocket ball9 on the first shot": 'Lỗi: không được đưa bi 9 vào lỗ ở cú đầu',
    'foul: cue ball pocketed': 'Lỗi: bi cái rơi vào lỗ',
    'the clock is ticking..': 'Sắp hết giờ...',
    'the clock is ticking...': 'Sắp hết giờ...',
    'pause': 'Tạm dừng',
    'no, thanks': 'Không, cảm ơn',
    'pocketed 8-ball before other balls': 'Đưa bi 8 vào lỗ trước các bi khác',
    'pocketed 8-ball & cue ball in the same shot': 'Đưa bi 8 và bi cái vào lỗ cùng một cú',
    'pocketed coloured ball & 8-ball in same shot': 'Đưa bi màu và bi 8 vào lỗ cùng một cú',
    'wrong pocket for 8-ball': 'Sai lỗ cho bi 8',
    'opponent win the match!': 'Đối thủ thắng trận!',
    'welcome! before we find you an opponent, we will teach you the controls, just follow the instructions.': 'Chào mừng! Trước khi tìm đối thủ, hãy học cách điều khiển. Chỉ cần làm theo hướng dẫn.',
    'drag your finger to move the cue...': 'Kéo ngón tay để di chuyển gậy...',
    'move your mouse to move the cue': 'Di chuột để di chuyển gậy',
    'now aim at the yellow ball': 'Giờ hãy nhắm vào bi vàng',
    'drag and release power bar to shoot': 'Kéo rồi thả thanh lực để đánh',
    'to apply power to the cue': 'để dồn lực cho gậy',
    'press button, drag mouse and release': 'Nhấn chuột, kéo rồi thả',
    'now you are ready to play the game': 'Giờ bạn đã sẵn sàng chơi',
    'make sure to check the rules first!': 'Hãy xem luật chơi trước nhé!',
    'you are breaking. good luck!': 'Bạn phá bi. Chúc may mắn!',
    'opponent is breaking': 'Đối thủ phá bi',
    'foul: you hit black ball too early': 'Lỗi: chạm bi đen quá sớm',
    "foul: you hit opponent's ball": 'Lỗi: chạm bi của đối thủ',
    'your turn': 'Lượt của bạn',
    "opponent's foul: hit black ball to early": 'Đối thủ phạm lỗi: chạm bi đen quá sớm',
    "opponent's foul: hit your ball": 'Đối thủ phạm lỗi: chạm bi của bạn',
    'pot 6 more balls to win': 'Đưa thêm 6 bi vào lỗ để thắng',
    "opponent's turn": 'Lượt của đối thủ',
    'foul: pocketed cue ball': 'Lỗi: bi cái rơi vào lỗ',
    'opponent foul: pocketed cue ball': 'Đối thủ phạm lỗi: bi cái rơi vào lỗ',
    'foul: no ball touched rail': 'Lỗi: không bi nào chạm băng',
    'opponent foul: no ball touched rail': 'Đối thủ phạm lỗi: không bi nào chạm băng',
    "opponent's foul: no ball hit": 'Đối thủ phạm lỗi: không chạm bi nào',
    'foul: time up': 'Lỗi: hết giờ',
    "opponent's foul: time up": 'Đối thủ phạm lỗi: hết giờ',
    'pocket all your balls before the rival and at last pocket the 8-ball to win. you will be assigned stripes or solids when the first ball is pocketed. you will commit a foul if you directly touch or pocket the rival’s ball. pocketing the cue ball (white ball) is a foul. you will lose if you pocket the 8-ball (black ball) before pocketing all your other balls':
      'Đưa hết bi của bạn vào lỗ trước đối thủ, cuối cùng đưa bi 8 vào lỗ để thắng.\n\nBạn được chia bi sọc hoặc bi trơn khi bi đầu tiên vào lỗ.\n\nChạm hoặc đưa bi của đối thủ vào lỗ là phạm lỗi.\n\nĐưa bi cái (bi trắng) vào lỗ là phạm lỗi.\n\nBạn thua nếu đưa bi 8 (bi đen) vào lỗ trước khi hết bi của mình.'
  };
  function key(s) { return s.replace(/\s+/g, ' ').trim().replace(/[.\s]+$/, function (m) { return m.indexOf('..') >= 0 ? m.trim() : ''; }).toLowerCase(); }
  var DICT = {};
  Object.keys(VI_TEXT).forEach(function (k) { DICT[key(k)] = VI_TEXT[k].toLocaleUpperCase('vi'); });

  var app = null;
  var viFont = null;
  function translate(s) {
    if (lang !== 'vi' || !viFont || typeof s !== 'string' || !s) return s;
    var t = DICT[key(s)];
    return t === undefined ? s : t;
  }

  // A translated element keeps the Vietnamese canvas font even when its original font
  // asset is bound later (disabled entities only get their font when first enabled).
  function syncFont(el, translated) {
    var t = el._text;
    if (!t || !app) return;
    t._antWantVi = !!(translated && viFont);
    if (t._antWantVi) {
      if (t.font && t.font !== viFont) t.font = viFont;
    } else if (t.font === viFont) {
      var a = el.fontAsset && app.assets.get(el.fontAsset);
      t.font = (a && a.resource) || t._antOrigFont || null;
    }
  }

  if (window.pc && pc.TextElement) {
    var fd = Object.getOwnPropertyDescriptor(pc.TextElement.prototype, 'font');
    if (fd && fd.set) {
      Object.defineProperty(pc.TextElement.prototype, 'font', {
        configurable: true,
        enumerable: fd.enumerable,
        get: fd.get,
        set: function (v) {
          if (v && v !== viFont) this._antOrigFont = v;
          fd.set.call(this, v && this._antWantVi && viFont && lang === 'vi' ? viFont : v);
        }
      });
    }
  }

  if (window.pc && pc.ElementComponent) {
    var proto = pc.ElementComponent.prototype;
    var d = Object.getOwnPropertyDescriptor(proto, 'text');
    if (d && d.set) {
      Object.defineProperty(proto, 'text', {
        configurable: true,
        enumerable: d.enumerable,
        get: d.get,
        set: function (v) {
          if (typeof v !== 'string') { d.set.call(this, v); return; }
          this._antSrc = v;
          var t = translate(v);
          d.set.call(this, t);
          syncFont(this, t !== v);
        }
      });
    }
  }

  function eachText(fn) {
    if (!app) return;
    (function walk(e) {
      var el = e.element;
      if (el && el.type === 'text') fn(el);
      for (var i = 0; i < e.children.length; i++) walk(e.children[i]);
    })(app.root);
  }
  function applyTexts() {
    eachText(function (el) { el.text = el._antSrc != null ? el._antSrc : el.text; });
  }

  // ---------------------------------------------------------------- canvas drawing helpers
  function canvasOf(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function copyOf(img) { var c = canvasOf(img.width, img.height); c.getContext('2d').drawImage(img, 0, 0); return c; }
  function stretch(ctx, img, sx, r) { ctx.clearRect(r[0], r[1], r[2], r[3]); ctx.drawImage(img, sx, r[1], 1, r[3], r[0], r[1], r[2], r[3]); }
  function fillSample(ctx, x, y, r) {
    var p = ctx.getImageData(x, y, 1, 1).data;
    ctx.fillStyle = 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + (p[3] / 255) + ')';
    ctx.fillRect(r[0], r[1], r[2], r[3]);
  }
  function wrapLines(ctx, text, maxW) {
    var out = [];
    text.split('\n').forEach(function (para) {
      var words = para.split(' '), line = '';
      words.forEach(function (w) {
        var t = line ? line + ' ' + w : w;
        if (line && ctx.measureText(t).width > maxW) { out.push(line); line = w; } else line = t;
      });
      out.push(line);
    });
    return out;
  }
  function layout(ctx, text, maxW, maxH, o) {
    var fam = o.font || HEAVY, weight = o.weight || '400';
    for (var size = Math.floor(o.size || maxH); size > 5; size--) {
      ctx.font = weight + ' ' + size + 'px ' + fam;
      var pad = (o.stroke ? 2 * (o.sw || 0.1) * size : 0) + (o.shadowY ? o.shadowY * size : 0);
      var lines = o.wrap ? wrapLines(ctx, text, maxW - pad) : text.split('\n');
      var lh = size * (o.lh || 1.12), w = 0, asc = 0, desc = 0;
      for (var i = 0; i < lines.length; i++) {
        var m = ctx.measureText(lines[i]);
        w = Math.max(w, m.width);
        if (i === 0) asc = m.actualBoundingBoxAscent;
        if (i === lines.length - 1) desc = m.actualBoundingBoxDescent;
      }
      var h = asc + desc + lh * (lines.length - 1) + pad;
      if (w + pad <= maxW && h <= maxH) return { size: size, lines: lines, lh: lh, asc: asc, desc: desc, h: h, pad: pad };
    }
    return null;
  }
  // Draws text fitted inside rect [x, y, w, h].
  function drawText(ctx, text, r, o) {
    o = o || {};
    if (o.upper !== false) text = text.toLocaleUpperCase('vi');
    var L = layout(ctx, text, r[2], r[3], o);
    if (!L) return;
    var align = o.align || 'center';
    var x = align === 'left' ? r[0] + L.pad / 2 : align === 'right' ? r[0] + r[2] - L.pad / 2 : r[0] + r[2] / 2;
    var y0 = r[1] + (o.valign === 'top' ? 0 : (r[3] - L.h) / 2) + (o.stroke ? (o.sw || 0.1) * L.size : 0) + L.asc;
    ctx.save();
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round';
    L.lines.forEach(function (line, i) {
      var y = y0 + i * L.lh;
      if (o.shadowY) {
        ctx.fillStyle = ctx.strokeStyle = o.shadowColor || 'rgba(0,0,0,.45)';
        ctx.lineWidth = o.stroke ? 2 * (o.sw || 0.1) * L.size : 0;
        if (o.stroke) ctx.strokeText(line, x, y + o.shadowY * L.size);
        ctx.fillText(line, x, y + o.shadowY * L.size);
      }
      if (o.stroke) {
        ctx.strokeStyle = o.stroke;
        ctx.lineWidth = 2 * (o.sw || 0.1) * L.size;
        ctx.strokeText(line, x, y);
      }
      if (Array.isArray(o.fill)) {
        var g = ctx.createLinearGradient(0, y - L.asc, 0, y + L.size * 0.12);
        o.fill.forEach(function (c, k) { g.addColorStop(k / (o.fill.length - 1), c); });
        ctx.fillStyle = g;
      } else ctx.fillStyle = o.fill || '#fff';
      if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = L.size * 0.25; }
      ctx.fillText(line, x, y);
      ctx.shadowBlur = 0;
      if (o.highlight && align === 'left') {
        var re = /x[23]/gi, m;
        ctx.fillStyle = o.highlight;
        while ((m = re.exec(line))) ctx.fillText(m[0], x + ctx.measureText(line.slice(0, m.index)).width, y);
      }
    });
    ctx.restore();
  }

  var S = {
    btn: { fill: '#ffffff', stroke: '#47107a', sw: 0.09, shadowY: 0.07, shadowColor: 'rgba(40,0,70,.55)' },
    navy: { fill: '#ffffff', stroke: '#141a4a', sw: 0.09, shadowY: 0.06, shadowColor: 'rgba(0,0,40,.55)' },
    shop: { fill: ['#ffffff', '#c3e8ff'], stroke: '#3b1b8f', sw: 0.11 },
    title: { fill: ['#fff27a', '#ffb000', '#ff7a2f'], stroke: '#8a2bd9', sw: 0.13 },
    gold: { fill: ['#fff7a8', '#ffe000', '#e09a00'], stroke: '#000000', sw: 0.07 },
    white: { fill: ['#ffffff', '#cfe5e5'], stroke: '#000000', sw: 0.06 },
    body: { fill: '#ffffff', align: 'left', wrap: true, lh: 1.16 },
    score: { fill: '#ffee30', stroke: '#000000', sw: 0.14 },
    ready: { fill: ['#ffffff', '#cbd4dc', '#8d9ba7'], stroke: '#15232f', sw: 0.1 },
    go: { fill: ['#fffbd0', '#ffe600', '#ffb000'], stroke: '#3d2a00', sw: 0.1 },
    perfect: { fill: ['#fffbd0', '#ffe600', '#ffb000'], stroke: '#000000', sw: 0.08 },
    great: { fill: ['#ffffff', '#d7dde6', '#8f9cad'], stroke: '#000000', sw: 0.08 },
    incredible: { fill: ['#7ffcff', '#2fe0ff', '#53ff5a'], stroke: '#000000', sw: 0.08 }
  };
  function st(base, extra) { var o = {}, k; for (k in base) o[k] = base[k]; for (k in extra || {}) o[k] = extra[k]; return o; }

  function pillButton(sx, erase, text, rect, style) {
    return function (img) {
      var c = copyOf(img), x = c.getContext('2d');
      stretch(x, img, sx, erase);
      drawText(x, text, rect, style || S.btn);
      return c;
    };
  }
  function tutorial(mobile) {
    return function (img) {
      var c = copyOf(img), x = c.getContext('2d');
      stretch(x, img, 100, [150, 18, 724, 88]);
      drawText(x, 'Cách chơi', [160, 24, 704, 76], S.gold);
      stretch(x, img, 40, [100, 132, 340, 96]);
      drawText(x, mobile ? 'Di ngón tay để ngắm' : 'Di chuột để ngắm', [106, 140, 330, 86], st(S.body, { size: 30, valign: 'top' }));
      stretch(x, img, 40, [572, 128, 432, 124]);
      drawText(x, mobile ? 'Vuốt xuống để chỉnh lực đánh' : 'Nhấn, kéo rồi thả để chỉnh lực đánh', [606, 140, 396, 108], st(S.body, { size: 30, valign: 'top' }));
      stretch(x, img, 40, [98, 636, 900, 348]);
      var bullets = [
        'Luôn nhắm bi có số nhỏ nhất. Đưa bi 9 vào lỗ bằng cú đánh hợp lệ là thắng',
        'Đánh bi chạm băng để nhân điểm x2 hoặc x3',
        'Thêm điểm khi dọn hết bàn mà không phạm lỗi',
        'Điểm cực cao khi dọn hết bàn chỉ bằng cú đánh băng và không phạm lỗi'
      ];
      [652, 737, 823, 908].forEach(function (y, i) {
        drawText(x, bullets[i], [108, y, 860, 78], st(S.body, { size: 28, highlight: '#ff3df2' }));
      });
      return c;
    };
  }
  function wordBand(text, style) {
    return function (img) {
      var c = copyOf(img), x = c.getContext('2d');
      x.clearRect(0, 0, c.width, 122);
      drawText(x, text, [6, 0, c.width - 12, 118], style);
      return c;
    };
  }

  var BUILD = {
    'taptoplay-eng.png': function (img) {
      var c = canvasOf(img.width, img.height), x = c.getContext('2d');
      drawText(x, 'Nhấn để chơi', [8, 4, img.width - 16, img.height - 8], { font: LIGHT, weight: '300', fill: '#ffffff', glow: 'rgba(255,255,255,.55)' });
      return c;
    },
    'boton-shop.png': pillButton(135, [140, 16, 316, 96], 'Gậy & bàn', [150, 30, 296, 68], S.shop),
    'cue_tables_titulo.png': function (img) {
      var c = canvasOf(img.width, img.height), x = c.getContext('2d');
      drawText(x, 'Gậy & bàn', [4, 1, img.width - 8, img.height - 2], S.title);
      return c;
    },
    'cue_tables_btn-equipar.png': pillButton(48, [52, 8, 154, 46], 'Trang bị', [44, 12, 168, 40]),
    'cue_tables_btn-equiped.png': pillButton(30, [34, 8, 190, 46], 'Đã trang bị', [34, 12, 188, 40], S.navy),
    'back.png': pillButton(88, [90, 22, 142, 76], 'Quay lại', [92, 32, 140, 60]),
    'btn-howtoplay.png': pillButton(42, [46, 24, 290, 70], 'Cách chơi', [50, 30, 280, 56]),
    'resume.png': pillButton(42, [46, 24, 290, 70], 'Tiếp tục', [50, 30, 280, 56]),
    'endgame.png': pillButton(42, [46, 24, 290, 70], 'Kết thúc', [50, 30, 280, 56]),
    'boton-playagain.png': pillButton(60, [64, 24, 384, 82], 'Chơi lại', [70, 30, 372, 66]),
    'nothanks.png': function (img) {
      var c = canvasOf(img.width, img.height), x = c.getContext('2d');
      drawText(x, 'Không, cảm ơn', [2, 2, img.width - 4, img.height - 4], { fill: '#000000', stroke: 'rgba(170,190,210,.95)', sw: 0.08 });
      return c;
    },
    'tutorial-ajustapower.png': function (img) {
      var c = canvasOf(img.width, img.height), x = c.getContext('2d');
      drawText(x, 'Chỉnh\nlực', [4, 2, img.width - 8, img.height - 4], { fill: '#ffffff', stroke: '#2b3a4a', sw: 0.1, lh: 1.05 });
      return c;
    },
    'barrasuperior-2.png': function (img) {
      var c = copyOf(img), x = c.getContext('2d');
      stretch(x, img, 112, [116, 8, 150, 64]);
      drawText(x, 'Điểm:', [116, 12, 140, 56], st(S.score, { align: 'right' }));
      return c;
    },
    'boton-arriba.png': function (img) {
      var c = copyOf(img), x = c.getContext('2d');
      fillSample(x, 256, 236, [158, 102, 196, 128]);
      drawText(x, 'Thêm\ngiờ', [166, 106, 180, 120], { fill: '#ffffff', lh: 1.02 });
      return c;
    },
    'poolmenus.png': function (img) {
      var c = copyOf(img), x = c.getContext('2d');
      stretch(x, img, 120, [140, 36, 744, 108]);
      drawText(x, 'Tổng điểm', [150, 40, 724, 100], S.gold);
      stretch(x, img, 200, [225, 488, 360, 92]);
      drawText(x, 'Thưởng', [225, 496, 350, 76], st(S.white, { align: 'right' }));
      stretch(x, img, 134, [138, 626, 326, 98]);
      drawText(x, 'Thưởng x2', [146, 640, 300, 70], S.btn);
      stretch(x, img, 562, [566, 626, 372, 98]);
      drawText(x, 'Không, cảm ơn', [572, 640, 358, 70], S.navy);
      stretch(x, img, 60, [64, 770, 380, 96]);
      drawText(x, 'Chơi lại', [70, 784, 366, 66], S.btn);
      return c;
    },
    'panel-totalscore.png': function (img) {
      var c = copyOf(img), x = c.getContext('2d');
      stretch(x, img, 120, [140, 36, 744, 108]);
      drawText(x, 'Tổng điểm', [150, 40, 724, 100], S.gold);
      return c;
    },
    'tutorial-PC.png': tutorial(false),
    'tutorial-mobile.png': tutorial(true),
    'perfect-100.png': wordBand('Hoàn hảo!', S.perfect),
    'great-40.png': wordBand('Tuyệt vời!', S.great),
    'incredible-200.png': wordBand('Xuất sắc!', S.incredible)
  };
  BUILD['barrasuperior-2_portraitP2.png'] = BUILD['barrasuperior-2.png'];

  // "READY? GO!" is a 43-frame animation. Each frame is measured (grey "READY?" pixels and
  // yellow "GO!" pixels separately) and the Vietnamese words are drawn with the same
  // position, scale, squash and opacity, relative to one reference frame per word.
  var readyGo = null;
  function measure(img) {
    var w = img.width, h = img.height, x = copyOf(img).getContext('2d'), d = x.getImageData(0, 0, w, h).data;
    var R = [w, h, -1, -1, 0], G = [w, h, -1, -1, 0];
    for (var y = 0; y < h; y++) for (var i = 0; i < w; i++) {
      var p = (y * w + i) * 4, r = d[p], g = d[p + 1], b = d[p + 2], a = d[p + 3];
      if (a < 12) continue;
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b), T = null;
      if (r > 150 && g > 100 && b < 0.6 * r) T = G; else if (y < 118 && mx - mn < 30 && b >= r - 8 && mx > 100) T = R;
      if (!T) continue;
      if (i < T[0]) T[0] = i; if (y < T[1]) T[1] = y; if (i > T[2]) T[2] = i; if (y > T[3]) T[3] = y; if (a > T[4]) T[4] = a;
    }
    function box(B) { return B[2] < 0 ? null : { x: B[0], y: B[1], w: B[2] - B[0] + 1, h: B[3] - B[1] + 1, a: B[4] / 255 }; }
    return { ready: box(R), go: box(G) };
  }
  function wordCanvas(text, style, refBox) {
    // Draw the word fitted into the reference box (padded), remember where it landed.
    var padX = refBox.w * 0.04, padY = refBox.h * 0.12;
    var W = Math.ceil(refBox.w + 2 * padX), H = Math.ceil(refBox.h + 2 * padY);
    var c = canvasOf(W, H);
    drawText(c.getContext('2d'), text, [0, 0, W, H], style);
    return { c: c, ox: refBox.x - padX, oy: refBox.y - padY, ref: refBox };
  }
  function buildReadyGo(frames) {
    var refR = null, refG = null;
    frames.forEach(function (f) {
      f.m = measure(f.img);
      if (f.m.ready && f.m.ready.a > 0.99 && (!refR || f.m.ready.w * f.m.ready.h > refR.w * refR.h)) refR = f.m.ready;
      if (f.m.go && f.m.go.a > 0.99 && (!refG || f.m.go.w * f.m.go.h > refG.w * refG.h)) refG = f.m.go;
    });
    var wr = refR && wordCanvas('Sẵn sàng?', S.ready, refR);
    var wg = refG && wordCanvas('Bắt\nđầu!', st(S.go, { lh: 1.0 }), refG);
    function place(ctx, wc, box) {
      if (!wc || !box) return;
      var sx = box.w / wc.ref.w, sy = box.h / wc.ref.h;
      ctx.globalAlpha = Math.min(1, box.a);
      ctx.drawImage(wc.c, box.x + (wc.ox - wc.ref.x) * sx, box.y + (wc.oy - wc.ref.y) * sy, wc.c.width * sx, wc.c.height * sy);
      ctx.globalAlpha = 1;
    }
    var out = {};
    frames.forEach(function (f) {
      var c = canvasOf(f.img.width, f.img.height), x = c.getContext('2d');
      place(x, wr, f.m.ready);
      place(x, wg, f.m.go);
      out[f.name] = c;
    });
    return out;
  }

  // ---------------------------------------------------------------- texture swapping
  var texState = {};
  function textureOf(asset) {
    if (!asset || !asset.resource) return null;
    return asset.type === 'textureatlas' ? asset.resource.texture : asset.resource;
  }
  function sourceOf(tex) { return tex && (tex.getSource ? tex.getSource() : tex._levels && tex._levels[0]); }
  function isReadyGo(name) { return /^rdygo\d+\.png$/.test(name); }

  function applyAsset(asset) {
    if (!asset || (asset.type !== 'texture' && asset.type !== 'textureatlas')) return;
    var name = asset.name;
    if (!BUILD[name] && !isReadyGo(name)) return;
    var tex = textureOf(asset);
    if (!tex) return;
    var s = texState[asset.id];
    if (!s || s.tex !== tex) {
      var src = sourceOf(tex);
      if (!src) return;
      s = texState[asset.id] = { tex: tex, orig: src, vi: null, name: name };
    }
    if (lang === 'vi') {
      if (!s.vi) {
        if (isReadyGo(name)) {
          if (!readyGo) {
            var frames = app.assets.filter(function (a) { return a.type === 'texture' && isReadyGo(a.name) && textureOf(a); })
              .map(function (a) { return { name: a.name, img: sourceOf(textureOf(a)) }; });
            readyGo = buildReadyGo(frames);
          }
          s.vi = readyGo[name];
        } else {
          try { s.vi = BUILD[name](s.orig); } catch (e) { console.warn('[ant-i18n]', name, e); }
        }
      }
      if (s.vi && sourceOf(tex) !== s.vi) tex.setSource(s.vi);
    } else if (sourceOf(tex) !== s.orig) {
      tex.setSource(s.orig);
    }
  }
  function applyTextures() {
    if (!app) return;
    app.assets.list().forEach(function (a) { if (a.loaded) applyAsset(a); });
  }

  // ---------------------------------------------------------------- startup and switching
  function buildFont() {
    if (viFont || !app || !pc.CanvasFont) return;
    var chars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~’…';
    Object.keys(DICT).forEach(function (k) { chars += DICT[k]; });
    viFont = new pc.CanvasFont(app, { fontName: '"Paytone One"', fontSize: 64, width: 2048, height: 2048, padding: 6 });
    viFont.createTextures(chars);
  }
  var started = false;
  function applyAll() {
    if (!started) return;
    applyTexts();
    applyTextures();
  }
  function setLang(next) {
    next = pick(next);
    if (!next || next === lang) return;
    lang = next;
    document.documentElement.lang = lang;
    applyAll();
  }
  window.addEventListener('message', function (e) {
    var data = e.data;
    if (!data || typeof data !== 'object' || data.type !== 'ant-play:locale') return;
    if (e.source !== window.parent && e.source !== window) return;
    setLang(data.locale);
  });
  window.antI18n = { get lang() { return lang; }, setLang: setLang, build: BUILD, buildReadyGo: buildReadyGo, drawText: drawText };

  function findApp() {
    var a = window.pc && pc.Application && pc.Application.getApplication && pc.Application.getApplication();
    if (!a) { setTimeout(findApp, 30); return; }
    app = a;
    app.assets.on('load', function (asset) { if (started) applyAsset(asset); });
    app.once('start', function () {
      fontsReady.then(function () {
        buildFont();
        started = true;
        applyAll();
      });
    });
  }
  if (window.pc) findApp();
})();
