// Anonymous visit counting with PostHog EU (founder 2026-11-13): which page, which ad link (?ct=), how long and how
// far down, and whether a store badge is clicked. No cookies, nothing stored on the device (cookieless_mode
// "always" + memory persistence; the PostHog project has "cookieless server hash mode" on and IP anonymisation),
// no session replay, no autocapture of texts or fields. Described in privacy.html › „Diese Webseiten“.
(function () {
  var KEY = 'phc_tJFMLG4rGjVW4jXwmhbWBq83wb8egxsBv3bQT86H7bD2';
  var p = new URLSearchParams(location.search);
  var ct = (p.get('ct') || p.get('utm_campaign') || '').replace(/[^\w.-]/g, '').slice(0, 40) || '(none)';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://eu-assets.i.posthog.com/static/array.js';
  s.onload = function () {
    if (!window.posthog || !window.posthog.init) return;
    window.posthog.init(KEY, {
      api_host: 'https://eu.i.posthog.com',
      ui_host: 'https://eu.posthog.com',
      cookieless_mode: 'always',
      persistence: 'memory',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      disable_surveys: true,
      capture_heatmaps: false,
      capture_dead_clicks: false,
      capture_exceptions: false,
      mask_personal_data_properties: true
    });
    window.posthog.register({ ct: ct, site_lang: document.documentElement.lang || '' });
  };
  document.head.appendChild(s);
  // Store badge clicks leave the page at once, so they go out immediately via sendBeacon.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href*="apps.apple.com"],a[href*="play.google.com"]');
    if (!a || !window.posthog || !window.posthog.capture) return;
    window.posthog.capture('store_click', { store: /apple\.com/.test(a.href) ? 'app_store' : 'google_play', ct: ct,
      page: location.pathname }, { send_instantly: true, transport: 'sendBeacon' });
  }, true);
})();
