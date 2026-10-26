/* ============================================================
   刘洋 · 个人简历  ——  交互脚本（原生 JS，无依赖）
   功能：导航变色 / 移动端菜单 / 滚动高亮 / 入场动画 /
        技能条动画 / 表单校验 / 返回顶部
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 导航：滚动变色 + 返回顶部按钮显隐 ---------- */
  var header = document.getElementById('siteHeader');
  var backTop = document.getElementById('backTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 60);
    backTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 2. 移动端导航开关 ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function closeNav() {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // 点击菜单项后关闭移动端菜单（等滚动开始再关，避免跳动）
  mainNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- 3. 点击导航平滑滚动（兼容不支持 scroll-behavior 的环境） ---------- */
  var headerH = 64;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
      // 更新地址栏但不产生额外跳转
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ---------- 4. 滚动高亮当前导航项 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
  // 只处理本页锚点链接（子页面里导航指向 index.html#xxx，不能当选择器用）
  var sections = navLinks
    .filter(function (a) { return (a.getAttribute('href') || '').charAt(0) === '#'; })
    .map(function (a) {
      var el = document.querySelector(a.getAttribute('href'));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);   // 过滤掉找不到对应元素的空项，避免后续访问 null

  function highlightNav() {
    if (!sections.length) return;                // 子页面没有页内锚点，保留 HTML 上的 active
    var pos = (window.scrollY || window.pageYOffset) + headerH + 40;
    var current = sections[0];
    sections.forEach(function (item) {
      if (item.el.offsetTop <= pos) current = item;
    });
    // 页面到底时高亮最后一项
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      current = sections[sections.length - 1];
    }
    if (!current) return;
    navLinks.forEach(function (a) { a.classList.remove('active'); });
    current.link.classList.add('active');
  }
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------- 5. 入场动画 + 技能条动画（IntersectionObserver） ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var skills = document.querySelectorAll('.skill-bar i');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });

    // 技能条单独观察：进入视口时才填充宽度
    var skillIO = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var bar = entry.target;
        var w = bar.getAttribute('data-width') || '0';
        bar.style.width = w + '%';
        observer.unobserve(bar);
      });
    }, { threshold: 0.4 });
    skills.forEach(function (bar) { skillIO.observe(bar); });
  } else {
    // 降级：不支持 IntersectionObserver 时直接显示
    revealEls.forEach(function (el) { el.classList.add('visible'); });
    skills.forEach(function (bar) { bar.style.width = (bar.getAttribute('data-width') || 0) + '%'; });
  }

  /* ---------- 6. 联系表单校验（页面上存在表单时才初始化，避免空引用报错） ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');

  if (form && success) {
    // 各字段校验规则
    var rules = {
      name: function (v) { return v.trim().length >= 2 ? '' : '请输入至少 2 个字的姓名'; },
      phone: function (v) { return /^1[3-9]\d{9}$/.test(v.trim()) ? '' : '请输入正确的 11 位手机号'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : '请输入正确的邮箱地址'; },
      message: function (v) { return v.trim().length >= 2 ? '' : '请填写交流内容'; }
    };

    var validateField = function (input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var msg = rule(input.value);
      var field = input.closest('.form-field');
      var errEl = field.querySelector('.form-error');
      if (errEl) errEl.textContent = msg;
      field.classList.toggle('invalid', Boolean(msg));
      return msg === '';
    };

    // 失焦即时校验，输入时清除错误提示
    Array.prototype.forEach.call(form.querySelectorAll('input'), function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.closest('.form-field').classList.contains('invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();                      // 阻止默认提交，避免页面刷新
      var ok = true;
      var firstInvalid = null;

      Array.prototype.forEach.call(form.querySelectorAll('input'), function (input) {
        var valid = validateField(input);
        if (!valid && !firstInvalid) firstInvalid = input;
        ok = ok && valid;
      });

      if (!ok) {
        success.hidden = true;
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // 静态站点无后端：此处仅演示交互效果，实际接入需替换为接口请求
      success.hidden = false;
      form.reset();
      Array.prototype.forEach.call(form.querySelectorAll('.form-field'), function (f) {
        f.classList.remove('invalid');
        var err = f.querySelector('.form-error');
        if (err) err.textContent = '';
      });
      window.setTimeout(function () { success.hidden = true; }, 6000);
    });
  }

  /* ---------- 7. 页脚年份自动更新 ---------- */
  var copy = document.querySelector('.footer-copy');
  if (copy) {
    copy.innerHTML = '&copy; ' + new Date().getFullYear() + ' 刘洋 · 仅用于个人求职展示';
  }
})();
