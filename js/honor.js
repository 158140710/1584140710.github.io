/* ============================================================
   证书荣誉 · 子页面脚本（原生 JS，无依赖）
   ------------------------------------------------------------
   【怎么换成你自己的证书照片】
   1. 把照片文件放进 img/certs/ 目录；
   2. 在下面 CERTS 数组里找到对应条目，把 img 改成你的文件名
      （例如 img: 'img/certs/my-cert.jpg'），title / meta / level 按需改；
   3. 若 img 留空或文件不存在，卡片会自动显示「照片待补充」占位样式，
      不会出现破图图标。
   ------------------------------------------------------------
   【手动编辑 honor.html 的注意点】
   脚本靠这两个 id 找渲染容器：gridPersonal（个人证书）、gridStudent（学生证书）。
   删掉某个区块没问题（对应分组会自动跳过），但保留的区块必须保留其 id，
   否则该分组的证书不会显示。大图查看器依赖 #lightbox / .lb-stage /
   #lbTitle / #lbMeta / #lbCount 这些元素，删改时请一并保留。
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 数据 ---------- */
  var CERTS = [
    /* ===== 个人证书 ===== */
    {
      type: 'personal',
      title: 'Python 师资证书',
      meta: '工业与信息化部教育与考试中心 颁发',
      level: '师资认证',
      img: 'img/certs/python-teacher.jpg'
    },
    {
      type: 'personal',
      title: '全国青少年科技教育成果展示大赛 · 指导教师证书',
      meta: '指导学生参赛并获指导教师认定',
      level: '国家级 · 指导教师',
      img: 'img/certs/science-teacher.jpg'
    },
    {
      type: 'personal',
      title: '全国青少年劳动技能与智能设计大赛 · 指导教师证书',
      meta: '智能设计赛项 指导教师',
      level: '国家级 · 指导教师',
      img: 'img/certs/labor-teacher.jpg'
    },
    {
      type: 'personal',
      title: '机动车驾驶证 C1',
      meta: '准驾车型 C1，可自驾带队外出参赛',
      level: '个人技能',
      img: 'img/certs/driving-c1.jpg'
    },

    /* ===== 学生获奖证书 ===== */
    {
      type: 'student',
      title: '学生获奖证书 · 省级机器人竞赛三等奖',
      meta: '四川省青少年机器人竞赛 / 学生姓名已隐去',
      level: '国赛 · 三等奖',
      img: 'img/certs/student-robot-1.jpg'
    },
    {
      type: 'student',
      title: '学生获奖证书 · 省级机器人竞赛金牌',
      meta: '全国青少年劳动技能与智能设计大赛 / 学生姓名已隐去',
      level: '省级 · 金牌',
      img: 'img/certs/student-robot-2.jpg'
    },
    {
      type: 'student',
      title: '学生获奖证书 · 省级机器人竞赛金牌',
      meta: '全国青少年劳动技能与智能设计大赛 / 学生姓名已隐去',
      level: '省级 · 金牌',
      img: 'img/certs/student-labor.jpg'
    },
    {
      type: 'student',
      title: '学生获奖证书 · 省级机器人竞赛金牌',
      meta: '全国青少年劳动技能与智能设计大赛 / 学生姓名已隐去',
      level: '省级 · 金牌',
      img: 'img/certs/student-science.jpg'
    },
    {
      type: 'student',
      title: '学生获奖证书 · 省级机器人竞赛金牌',
      meta: '成都市青少年科技创新大赛 / 学生姓名已隐去',
      level: '省级 · 金牌',
      img: 'img/certs/student-city.jpg'
    },
    {
      type: 'student',
      title: '学生获奖证书 · 区级编程挑战赛一等奖',
      meta: '天府新区中小学生编程挑战赛 / 学生姓名已隐去',
      level: '区级 · 一等奖',
      img: 'img/certs/student-code.jpg'
    }
  ];

  var TYPE_LABEL = { personal: '个人', student: '学生' };

  /* ---------- 工具：占位卡内容 ---------- */
  var PH_ICON =
    '<svg class="ph-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="13" y="7" width="38" height="44" rx="3"/>' +
    '<path d="M21 19h22M21 26h22M21 33h13"/>' +
    '<circle cx="43" cy="45" r="8"/>' +
    '<path d="M40 52l3 7 3-7"/></svg>';

  function placeholderHTML(item) {
    var file = item.img ? item.img.replace(/^.*\//, '') : '';
    return (
      '<div class="ph-inner">' + PH_ICON +
      '<p>证书照片待补充</p>' +
      (file ? '<span class="ph-file">' + file + '</span>' : '') +
      '</div>'
    );
  }

  /* ---------- 渲染证书卡片 ---------- */
  function createCard(item, index, group) {
    var card = document.createElement('article');
    card.className = 'cert-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', '查看大图：' + item.title);
    card.style.animationDelay = (index % 12) * 45 + 'ms';

    var photo = document.createElement('div');
    photo.className = 'cert-photo';

    var tag = document.createElement('span');
    tag.className = 'cert-tag' + (item.type === 'student' ? ' cert-tag--student' : '');
    tag.textContent = TYPE_LABEL[item.type] || '证书';
    photo.appendChild(tag);

    if (item.img) {
      var img = document.createElement('img');
      img.src = item.img;
      img.alt = item.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 800;
      img.height = 600;
      // 文件不存在 / 路径写错时退回占位样式，避免出现破图
      img.addEventListener('error', function () {
        photo.classList.add('cert-photo--blank');
        photo.insertAdjacentHTML('beforeend', placeholderHTML(item));
        img.remove();
      });
      photo.appendChild(img);
    } else {
      photo.classList.add('cert-photo--blank');
      photo.insertAdjacentHTML('beforeend', placeholderHTML(item));
    }

    var zoom = document.createElement('span');
    zoom.className = 'cert-zoom';
    zoom.textContent = '查看大图';
    photo.appendChild(zoom);

    var body = document.createElement('div');
    body.className = 'cert-body';
    var h3 = document.createElement('h3');
    h3.textContent = item.title;
    var meta = document.createElement('p');
    meta.className = 'cert-meta';
    meta.textContent = item.meta || '';
    body.appendChild(h3);
    body.appendChild(meta);
    if (item.level) {
      var lv = document.createElement('span');
      lv.className = 'cert-level';
      lv.textContent = item.level;
      body.appendChild(lv);
    }

    card.appendChild(photo);
    card.appendChild(body);

    // 打开大图（鼠标 / 键盘均可）
    card.addEventListener('click', function () { openLightbox(group, index); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(group, index);
      }
    });

    return card;
  }

  var personal = CERTS.filter(function (c) { return c.type === 'personal'; });
  var student = CERTS.filter(function (c) { return c.type === 'student'; });

  var gridPersonal = document.getElementById('gridPersonal');
  var gridStudent = document.getElementById('gridStudent');

  /* 按页面上实际存在的容器渲染。
     注意：手动编辑 honor.html 时若删掉了某个区块（如学生证书区），
     这里只会跳过对应分组，脚本继续运行，卡片墙和大图查看器不受影响。 */
  function renderGroup(items, grid) {
    if (!grid) return;
    items.forEach(function (item, i) {
      grid.appendChild(createCard(item, i, items));
    });
  }
  renderGroup(personal, gridPersonal);
  renderGroup(student, gridStudent);

  /* ---------- 数量统计 ---------- */
  var countPersonal = document.getElementById('countPersonal');
  var countStudent = document.getElementById('countStudent');
  if (countPersonal) countPersonal.textContent = personal.length;
  if (countStudent) countStudent.textContent = student.length;

  /* ---------- Banner 数字滚动 ---------- */
  var counters = document.querySelectorAll('.js-count');
  Array.prototype.forEach.call(counters, function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (el.closest('.hero-facts') && counters.length > 1) {
      // 前两个数字与真实数据保持一致，避免改数据后 Banner 数字忘记同步
      if (el === counters[0]) target = personal.length;
      if (el === counters[1]) target = student.length;
    }
    var start = null;
    var dur = 900;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) window.requestAnimationFrame(step);
    }
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  });

  /* ---------- 大图查看器 ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbTitle = document.getElementById('lbTitle');
  var lbMeta = document.getElementById('lbMeta');
  var lbCount = document.getElementById('lbCount');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var stage = lightbox ? lightbox.querySelector('.lb-stage') : null;

  /* 查看器依赖的元素全部存在才启用，缺一个也不让页面其他功能报错 */
  var lightboxReady = Boolean(lightbox && stage && lbTitle && lbMeta && lbCount);

  var currentList = [];
  var currentIndex = 0;
  var lastFocused = null;
  var open = false;

  function renderLightbox() {
    if (!lightboxReady) return;
    var item = currentList[currentIndex];
    if (!item) return;

    lbTitle.textContent = item.title;
    lbMeta.textContent = item.meta || '';
    lbCount.textContent = (currentIndex + 1) + ' / ' + currentList.length;

    // 每次先把 stage 还原成 <img>
    stage.innerHTML = '';
    var img = document.createElement('img');
    img.alt = item.title;
    img.src = item.img || '';
    img.addEventListener('error', function () {
      stage.innerHTML = placeholderHTML(item);
    });
    stage.appendChild(img);

    // 只有一张时隐藏左右按钮
    var single = currentList.length <= 1;
    if (lbPrev) lbPrev.hidden = single;
    if (lbNext) lbNext.hidden = single;
  }

  function openLightbox(list, index) {
    if (!lightboxReady || !list || !list.length) return;
    currentList = list;
    currentIndex = index;
    lastFocused = document.activeElement;
    renderLightbox();
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    open = true;
    var closeBtn = lightbox.querySelector('.lb-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!open || !lightbox) return;
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    open = false;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function move(step) {
    if (!lightboxReady || !currentList.length) return;
    currentIndex = (currentIndex + step + currentList.length) % currentList.length;
    renderLightbox();
  }

  if (lightboxReady) {
    lightbox.addEventListener('click', function (e) {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-close')) closeLightbox();
    });
    if (lbPrev) lbPrev.addEventListener('click', function () { move(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { move(1); });

    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { closeLightbox(); return; }
      if (e.key === 'ArrowLeft') { move(-1); return; }
      if (e.key === 'ArrowRight') { move(1); return; }

      // 简单的焦点循环，避免 Tab 跑到弹层外面
      if (e.key === 'Tab') {
        var focusables = [lightbox.querySelector('.lb-close')]
          .concat([lbPrev && !lbPrev.hidden ? lbPrev : null,
                   lbNext && !lbNext.hidden ? lbNext : null])
          .filter(Boolean);
        var idx = focusables.indexOf(document.activeElement);
        if (idx === -1) return;
        e.preventDefault();
        var next = (idx + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
        focusables[next].focus();
      }
    });

    // 触屏左右滑动切换
    var touchX = null;
    lightbox.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) move(dx > 0 ? -1 : 1);
      touchX = null;
    }, { passive: true });
  }
})();
