/**
 * TrustHire Embeddable Widget
 * Usage: <div data-trusthire-url="https://github.com/owner/repo"></div>
 *        <script src="https://trusthire.vercel.app/widget.js" async></script>
 *
 * Options (data attributes on container div):
 *   data-trusthire-url     - URL to scan (required)
 *   data-trusthire-theme   - "light" | "dark" (default: "light")
 */
(function () {
  'use strict';

  const BASE = 'https://trusthire.vercel.app';

  function createWidget(container) {
    const url = container.getAttribute('data-trusthire-url');
    const theme = container.getAttribute('data-trusthire-theme') || 'light';
    if (!url) return;

    const isDark = theme === 'dark';
    const bg = isDark ? '#111827' : '#f9fafb';
    const border = isDark ? '#1f2937' : '#e5e7eb';
    const textPrimary = isDark ? '#f3f4f6' : '#111827';
    const textMuted = isDark ? '#9ca3af' : '#6b7280';

    // Inject skeleton
    container.style.cssText = `display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;border:1px solid ${border};background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;min-width:160px;`;
    container.innerHTML = `<span style="color:${textMuted};font-size:11px;">Scanning…</span>`;

    fetch(`${BASE}/api/widget?url=${encodeURIComponent(url)}&theme=${theme}`)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        const score = data.riskScore || 0;
        const level = data.riskLevel || 'UNKNOWN';
        const color = data.color || '#6b7280';
        const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>`;
        const label = `<span style="color:${textPrimary};font-weight:600;">Risk: ${level}</span>`;
        const scoreEl = `<span style="color:${textMuted};font-size:11px;">(${score}/100)</span>`;
        const poweredBy = `<a href="${BASE}" target="_blank" rel="noopener" style="color:${textMuted};font-size:10px;text-decoration:none;margin-left:4px;" title="Verified by TrustHire">🛡 TrustHire</a>`;
        container.innerHTML = `${dot}${label}${scoreEl}${poweredBy}`;
      })
      .catch(function () {
        container.innerHTML = `<span style="color:${textMuted};font-size:11px;">Unable to scan</span>`;
      });
  }

  function init() {
    document.querySelectorAll('[data-trusthire-url]').forEach(createWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
