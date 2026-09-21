// ============================================================
// 海梦园 · 个人主页 —— js/main.js
// ------------------------------------------------------------
// 交互框架（原生 JavaScript，无任何依赖）
//   1) 移动端导航菜单开合 + 点击链接/Esc 自动收起
//   2) 滚动时导航高亮（scrollspy）+ 顶栏阴影
//   3) 技能条按 data-level 生长动画（进入视口触发）
//   4) 板块滚动淡入动画（IntersectionObserver，逐项错峰）
//   5) 回到顶部按钮显隐 + 平滑滚动
//   6) 卡片指针跟随的柔和光晕（仅鼠标设备）
// 说明：所有效果在「减少动效偏好」下自动降级为直接显示。
// ============================================================

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initScrollSpy();
    initSkillBars();
    initRevealOnScroll();
    initBackToTop();
    initCardGlow();
    initSmoothAnchors();
  });

  // ---------- 1. 移动端菜单 ----------
  function initNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    function closeMenu() {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }

    function openMenu() {
      menu.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('open')) closeMenu();
      else openMenu();
    });

    // 点击菜单内链接后自动收起
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // Esc 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // 视口变宽时重置状态
    window.addEventListener('resize', function () {
      if (window.innerWidth > 880) closeMenu();
    });
  }

  // ---------- 2. 滚动高亮（scrollspy）----------
  function initScrollSpy() {
    var header = document.getElementById('site-header');
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    if (!links.length) return;

    var sections = links
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    var ticking = false;

    function update() {
      var headerH = header ? header.offsetHeight : 68;
      var probe = window.scrollY + headerH + 24;
      var current = sections[0];

      sections.forEach(function (sec) {
        if (sec.offsetTop <= probe) current = sec;
      });

      // 滚动到页面底部时，高亮最后一项
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = sections[sections.length - 1];
      }

      links.forEach(function (link) {
        var isActive = current && link.getAttribute('href') === '#' + current.id;
        link.classList.toggle('active', !!isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });

      if (header) header.classList.toggle('scrolled', window.scrollY > 12);

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  // ---------- 3. 技能条生长动画 ----------
  function initSkillBars() {
    var fills = Array.prototype.slice.call(document.querySelectorAll('.skill-fill[data-level]'));
    if (!fills.length) return;

    // 初始收敛到 0，进入视口后生长到 data-level
    fills.forEach(function (fill) {
      if (!reduceMotion) fill.style.width = '0%';
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      fills.forEach(function (fill) { fill.style.width = ''; });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var fill = entry.target;
        var cat = fill.closest('.skill-category');
        var peers = cat
          ? Array.prototype.slice.call(cat.querySelectorAll('.skill-fill[data-level]'))
          : [fill];
        var order = Math.max(0, peers.indexOf(fill));

        window.setTimeout(function () {
          fill.style.width = fill.getAttribute('data-level') + '%';
          fill.classList.add('is-grown');
        }, 110 * order);

        observer.unobserve(fill);
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -8% 0px' });

    fills.forEach(function (fill) { observer.observe(fill); });
  }

  // ---------- 4. 滚动淡入 ----------
  function initRevealOnScroll() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var selector = [
      '.section-header',
      '.skills-grid > .skill-category',
      '.timeline > .timeline-item',
      '.gallery-grid > .gallery-item',
      '.contact-grid > .contact-card',
      '.about-grid > *'
    ].join(',');

    var targets = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('reveal-init'); });

    var observer = new IntersectionObserver(function (entries) {
      // 同批次按 DOM 顺序错峰出现
      var shown = entries.filter(function (e) { return e.isIntersecting; });
      shown.sort(function (a, b) {
        return (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
      });
      shown.forEach(function (entry, i) {
        window.setTimeout(function () {
          entry.target.classList.add('reveal-in');
        }, 90 * i);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // ---------- 5. 回到顶部 ----------
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    var ticking = false;

    function update() {
      btn.classList.toggle('visible', window.scrollY > 420);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  // ---------- 6. 卡片指针光晕（仅鼠标设备）----------
  function initCardGlow() {
    if (!hasHover || reduceMotion) return;

    var cards = document.querySelectorAll(
      '.skill-category, .timeline-card, .contact-card, .about-card'
    );

    Array.prototype.forEach.call(cards, function (card) {
      card.classList.add('glow-card');
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
      card.addEventListener('pointerleave', function () {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  // ---------- 7. 锚点平滑滚动（带固定导航偏移）----------
  function initSmoothAnchors() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute('href');
      if (!id || id === '#') return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      var header = document.getElementById('site-header');
      var offset = (header ? header.offsetHeight : 68) + 16;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: top,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });

      if (history.replaceState) history.replaceState(null, '', id);
    });
  }
})();
