/* UtilRice — 한국어 / 영어 전환
 *
 * 동작 방식
 *  - 페이지의 한국어 원문은 별도로 저장하지 않는다. 최초 로드 시 [data-i18n] 요소의
 *    innerHTML 을 그대로 캡처해 'ko' 원본으로 보관하므로, HTML 을 수정하면 한국어는
 *    자동으로 따라온다. 영어 문구만 아래 EN 사전에 정의한다.
 *  - 선택한 언어는 localStorage 에 저장되어 다음 방문 시에도 유지된다.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'utilrice.lang';

  /* 영어 문구 사전 (키는 HTML 의 data-i18n / data-i18n-aria 값과 일치) */
  var EN = {
    /* 접근성 / 내비게이션 */
    'skip': 'Skip to content',
    'logo.aria': 'UtilRice home',
    'nav.aria': 'Main menu',
    'nav.brand': 'Brand',
    'nav.brand.mission': 'Mission &amp; Vision',
    'nav.brand.story': 'Brand Story',
    'nav.brand.team': 'Our Team',
    'nav.products': 'Products',
    'nav.products.where': 'Where to Buy',
    'nav.news': 'Newsroom',
    'nav.news.latest': 'Latest News',
    'nav.news.press': 'Press Coverage',
    'nav.news.awards': 'Awards &amp; Recognition',
    'nav.impact': 'Impact',
    'nav.impact.rice': 'Rice Consumption Impact',
    'nav.impact.giving': 'Community Giving',
    'nav.impact.partnership': 'Partnerships',
    'nav.buy': 'Buy Now',
    'nav.store': 'Go to Store',

    /* 히어로 */
    'hero.aria': 'About UtilRice',
    'hero.title': 'Our Rice, Rediscovered',
    'hero.img.aria': 'The sun rising over golden rice fields',

    /* Overview */
    'overview.lead':
      'UtilRice is a social venture from Enactus Yonsei that finds new uses for ' +
      'Korean rice with nowhere to go, building a sustainable cycle of rice consumption.',
    'overview.desc':
      'Korea produces more rice than it consumes — 400,000 tons are disposed of at ' +
      'low prices every year, creating an annual social cost of KRW 700 billion. ' +
      'Noting the outstanding absorbency of Korean rice, UtilRice developed ' +
      'UR Coffee Mate, a coffee grinder cleaner made from 100% rice. By rediscovering ' +
      'rice, we build a cycle that connects consumers and farmers.',

    /* Overview — 팩트 목록 */
    'facts.affil.dt': 'Affiliation',
    'facts.affil.dd': 'Enactus Yonsei, Yonsei University',
    'facts.product.dt': 'Flagship Product',
    'facts.product.dd': 'UR Coffee Mate<small>100% rice coffee grinder cleaner · 450g</small>',
    'facts.revenue.dt': 'Cumulative Revenue',
    'facts.revenue.dd': 'KRW 56,150,950<small>As of 2026.06.25</small>',
    'facts.customers.dt': 'Cumulative Customers',
    'facts.customers.dd': 'About 2,350 · 200+ reviews',
    'facts.rating.dt': 'Average Rating',
    'facts.rating.dd': '4.9 / 5<small>Coupang 4.92 · Last 6 months 4.93</small>',
    'facts.rice.dt': 'Rice Used to Date',
    'facts.rice.dd': '1.8 tons<small>As of 2026.06.25</small>',

    /* Our Business */
    'biz.coffee.p':
      'Pour, grind, and cleaning is done — a food-safe grinder cleaner made from ' +
      '100% rice. The porous starch network of rice absorbs the coffee oils and fines ' +
      'caught between the burrs. No disassembly needed: pour it into the grinder and ' +
      'run it empty for 10 seconds. From a café owner’s daily routine to a home ' +
      'barista’s equipment care.',
    'biz.coffee.m1': '100% Korean rice',
    'biz.coffee.m2': 'Food-grade ingredients',
    'biz.coffee.m3': 'B2B supply',
    'biz.hand.p':
      'UR Hand Mate, a hand conditioner that carries the moisturizing power of rice ' +
      'to your fingertips, arrives in August 2026. At the same time, we are preparing ' +
      'to launch on the global marketplace Shopee, extending the usefulness of Korean ' +
      'rice to the world.',
    'biz.hand.m1': 'Launching 2026.08',
    'biz.hand.m2': 'Shopee launch in preparation',

    /* Latest News */
    'news.1.date': '2026.06 <em>Results</em>',
    'news.1.title': 'Cumulative revenue passes KRW 56.15 million; 1.8 tons of rice used to date',
    'news.2.date': '2026.04 <em>Results</em>',
    'news.2.title': 'Monthly revenue hits a record KRW 7.95 million — 8× growth over January 2025',
    'news.3.date': '2025.08 <em>Press</em>',
    'news.3.title': 'Featured on SBS Morning Wide — &ldquo;Rice, Dressed in New Value&rdquo;',
    'news.4.date': '<em>Partnership</em>',
    'news.4.title': 'Partnership signed with Nonghyup; B2B supply contract with Cafe Manwolkyung',
    'news.5.date': '2024 <em>Award</em>',
    'news.5.title': 'Winner of the Hyundai Marine &amp; Fire Seed Program · 3rd place at Enactus Korea NC',
    'news.6.date': '<em>Social</em>',
    'news.6.title': '297% funded on Wadiz · 100 kg of rice donated to Sangnok Orphanage',

    /* 구매 섹션 */
    'cta.h2': 'Get Yours Today',
    'cta.p': 'UR Coffee Mate is available on Naver Smart Store and Coupang.',
    'cta.naver': 'Naver Smart Store',
    'cta.coupang': 'Coupang',

    /* 푸터 */
    'footer.info':
      'A student startup team from Enactus Yonsei, Yonsei University<br>' +
      'Contact hello@utilrice.example'
  };

  /* 언어별 페이지 제목 및 UI 라벨 */
  var META = {
    ko: {
      title: 'UtilRice — 우리 쌀, 가장 쓸모 있는 재발견',
      langLabel: 'ENG',            // 버튼에 표시 = 전환될 언어
      langAria: '영어로 전환',
      menuOpen: '메뉴 열기',
      menuClose: '메뉴 닫기'
    },
    en: {
      title: 'UtilRice — Our Rice, Rediscovered',
      langLabel: 'KOR',
      langAria: 'Switch to Korean',
      menuOpen: 'Open menu',
      menuClose: 'Close menu'
    }
  };

  var textEls = [].slice.call(document.querySelectorAll('[data-i18n]'));
  var ariaEls = [].slice.call(document.querySelectorAll('[data-i18n-aria]'));
  var langBtn = document.getElementById('pfLang');
  var burger = document.getElementById('pfBurger');

  /* 한국어 원문을 DOM 에서 캡처해 보관 */
  var KO_TEXT = textEls.map(function (el) { return el.innerHTML; });
  var KO_ARIA = ariaEls.map(function (el) { return el.getAttribute('aria-label'); });

  var current = null;

  function apply(lang) {
    var en = lang === 'en';

    textEls.forEach(function (el, i) {
      var key = el.getAttribute('data-i18n');
      var value = en ? EN[key] : KO_TEXT[i];
      if (value == null) return;   // 번역 누락 시 원문 유지
      el.innerHTML = value;
    });

    ariaEls.forEach(function (el, i) {
      var key = el.getAttribute('data-i18n-aria');
      var value = en ? EN[key] : KO_ARIA[i];
      if (value == null) return;
      el.setAttribute('aria-label', value);
    });

    var meta = META[en ? 'en' : 'ko'];
    document.documentElement.setAttribute('lang', en ? 'en' : 'ko');
    document.title = meta.title;

    if (langBtn) {
      langBtn.textContent = meta.langLabel;
      langBtn.setAttribute('aria-label', meta.langAria);
    }
    if (burger) {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-label', open ? meta.menuClose : meta.menuOpen);
    }

    current = en ? 'en' : 'ko';
    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) { /* 저장 실패는 무시 */ }
  }

  /* 현재 언어에 맞는 버거 메뉴 라벨을 index.html 쪽 스크립트가 참조할 수 있게 노출 */
  window.__utilriceI18n = {
    get lang() { return current; },
    burgerLabel: function (open) {
      var meta = META[current === 'en' ? 'en' : 'ko'];
      return open ? meta.menuClose : meta.menuOpen;
    },
    set: apply
  };

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      apply(current === 'en' ? 'ko' : 'en');
    });
  }

  /* 초기 언어: 저장된 선택 → 없으면 한국어 */
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* 무시 */ }
  apply(saved === 'en' ? 'en' : 'ko');
})();
