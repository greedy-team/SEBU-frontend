/**
 * 사용자 행동 분석 도구(Microsoft Clarity, Hotjar) 초기화.
 *
 * 개발 환경(dev 서버)에서는 절대 로드하지 않는다 — 테스트 클릭이 실제 데이터에
 * 섞이는 걸 막기 위해서다. 해당 서비스의 ID가 .env에 없으면 그 도구는 그냥 건너뛴다.
 */
export function initAnalytics() {
  if (!import.meta.env.PROD) return;

  const clarityId = import.meta.env.VITE_CLARITY_ID;
  if (clarityId) initClarity(clarityId);

  const hotjarId = import.meta.env.VITE_HOTJAR_ID;
  if (hotjarId) initHotjar(hotjarId);
}

function initClarity(id) {
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
}

function initHotjar(id) {
  (function (h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: id, hjsv: 6 };
    a = o.getElementsByTagName("head")[0];
    r = o.createElement("script");
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
}
