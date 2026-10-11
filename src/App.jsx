import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import CollegeView from "./pages/CollegeView";
import LoginPage from "./pages/Login";
import MyPage from "./pages/MyPage";
import DesignSystem from "./pages/DesignSystem";
// import CommunityPage from "./pages/Community";
// import PostDetailPage from "./pages/PostDetail";
// import PostWritePage from "./pages/PostWrite";
import RateLimitToast from "./components/common/RateLimitToast";
import Footer from "./components/layout/Footer";
import LabReviewHomePage from "./pages/LabReviewHome";
import LabReviewPage from "./pages/LabReview";
import LabReviewWritePage from "./pages/LabReviewWrite";
import { useAuthRestore } from "./features/auth/hooks/useAuthRestore";
import NotFoundPage from "./pages/NotFound";
import ScrollToTop from "./components/common/ScrollToTop";
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import FetchingIndicator from "./components/common/FetchingIndicator";

// 개인정보 처리방침·이용약관은 마크다운 렌더러를 쓰는 무거운 페이지라서, 열 때만 불러온다.
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const TermsPage = lazy(() => import("./pages/Terms"));

const GA4_ID = "G-3THTECMZRN";
const ANALYTICS_CHOICE = "sebu.analytics-consent.v1";
const ANALYTICS_PATHS = new Set(["/", "/search", "/colleges", "/login", "/mypage", "/design-system", "/privacy", "/terms", "/community/labs"]);

function analyticsPath(pathname) {
  if (ANALYTICS_PATHS.has(pathname)) return pathname;
  if (/^\/community\/labs\/[^/]+\/write\/?$/.test(pathname)) return "/community/labs/:laboratoryId/write";
  if (/^\/community\/labs\/[^/]+\/?$/.test(pathname)) return "/community/labs/:laboratoryId";
  return "/404";
}

function readAnalyticsChoice() {
  try {
    const value = localStorage.getItem(ANALYTICS_CHOICE);
    return value === "granted" || value === "denied" ? value : null;
  } catch { return null; }
}

// Optional analytics only. Never load Google Analytics before explicit consent.
function AnalyticsConsent() {
  const { pathname } = useLocation();
  const [choice, setChoice] = useState(readAnalyticsChoice);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lastPage = useRef(null);
  const production = import.meta.env.PROD && window.location.hostname === "www.sebu.kr";
  const privacySignal = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1";
  const enabled = production && !privacySignal && choice === "granted";

  useEffect(() => {
    window[`ga-disable-${GA4_ID}`] = !enabled;
    if (!enabled) { lastPage.current = null; return; }
    const path = analyticsPath(pathname);
    const pageLocation = window.location.origin + path;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () { window.dataLayer.push(arguments); };
    }
    if (!document.getElementById("sebu-ga4")) {
      window.gtag("consent", "default", {
        analytics_storage: "granted", ad_storage: "denied",
        ad_user_data: "denied", ad_personalization: "denied",
      });
      window.gtag("js", new Date());
      window.gtag("config", GA4_ID, {
        send_page_view: false, allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: pageLocation, page_referrer: "", page_title: "SEBU",
        cookie_expires: 60 * 24 * 60 * 60, cookie_update: false,
      });
      const script = document.createElement("script");
      script.id = "sebu-ga4";
      script.async = true;
      script.referrerPolicy = "no-referrer";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(script);
    }
    // Scrub every event's default location/referrer, including automatic engagement.
    window.gtag("set", { page_location: pageLocation, page_referrer: "", page_title: "SEBU" });
    if (lastPage.current === path) return;
    lastPage.current = path;
    window.gtag("event", "page_view", {
      send_to: GA4_ID, page_location: pageLocation, page_path: path,
      page_referrer: "", page_title: "SEBU",
    });
  }, [enabled, pathname]);

  function choose(value) {
    try { localStorage.setItem(ANALYTICS_CHOICE, value); } catch { /* Session-only choice. */ }
    setChoice(value);
    setSettingsOpen(false);
    if (value === "denied") {
      window[`ga-disable-${GA4_ID}`] = true;
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.trim().split("=")[0];
        if (!/^_ga(?:_|$)/.test(name)) return;
        ["", "; Domain=www.sebu.kr", "; Domain=.sebu.kr"].forEach((domain) => {
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain}`;
        });
      });
      // Remove already-loaded analytics listeners after withdrawal; auth cookies stay intact.
      if (choice === "granted") window.location.reload();
    }
  }

  if (!production) return null;
  const notice = (
    <>
      <p>동의한 방문자의 페이지 이용량과 방문 통계를 Google Analytics 4로 분석합니다. 거부하거나 철회해도 SEBU의 모든 기능을 이용할 수 있습니다.</p>
      <p>Google LLC에 임의의 브라우저 식별자, 페이지 경로, 접속 시각, 기기·브라우저 정보가 전송되며 미국 및 Google의 글로벌 처리 시설에서 처리될 수 있습니다. 네트워크 연결 과정에서 IP 주소가 전달됩니다. SEBU의 학번·이름·이메일·계정번호·검색어·입력값은 분석에 보내지 않으며 URL 쿼리·해시와 유입 주소는 제거합니다.</p>
      <p>통계 쿠키(_ga 및 _ga_*)의 유효기간은 최대 60일이며 방문 때마다 연장하지 않습니다. 선택 기록은 이 브라우저에 보관합니다. 광고 목적 수집과 Google Signals는 사용하지 않습니다. 개별 이벤트 보관기간은 GA4 속성 설정에 따릅니다.</p>
      <p>화면의 ‘사용통계 설정’에서 언제든 거부·철회할 수 있으며, 철회하면 통계 쿠키를 지우고 새로고침해 수집을 중단합니다. 기존 수집정보의 삭제 문의: sebusupport@gmail.com. <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google 개인정보처리방침</a></p>
    </>
  );
  return (
    <>
      {pathname === "/privacy" && <section className="mx-auto max-w-4xl space-y-3 px-6 py-6 text-sm text-gray-700" aria-label="선택 사용통계 안내"><h2 className="text-lg font-semibold">선택 사용통계 안내 (GA4)</h2>{notice}</section>}
      {(choice === null && !privacySignal) || settingsOpen ? (
        <aside className="fixed bottom-4 left-4 right-4 z-50 max-w-xl rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-lg" aria-label="선택 사용통계 설정">
          <h2 className="mb-2 font-semibold text-gray-900">선택 사용통계</h2>
          <p>쿠키를 이용한 방문 통계 분석에 동의하시나요? 거부해도 서비스 이용에 불이익이 없습니다.</p>
          <details className="mt-2"><summary className="cursor-pointer underline">수집 항목·해외 처리·거부 방법 보기</summary><div className="mt-2 max-h-56 space-y-2 overflow-auto">{notice}</div></details>
          {privacySignal && <p className="mt-2">브라우저의 추적 거부 설정을 존중하여 분석을 수집하지 않습니다.</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="rounded border border-gray-300 px-4 py-2" onClick={() => choose("denied")}>거부 / 동의 철회</button>
            <button type="button" disabled={privacySignal} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50" onClick={() => choose("granted")}>사용통계 허용</button>
            {choice !== null && <button type="button" className="rounded border border-gray-300 px-4 py-2" onClick={() => setSettingsOpen(false)}>닫기</button>}
          </div>
        </aside>
      ) : <button type="button" className="fixed bottom-4 left-4 z-40 rounded border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 shadow-sm" onClick={() => setSettingsOpen(true)}>사용통계 설정</button>}
    </>
  );
}

function App() {
  useAuthRestore();

  return (
    <>
      <AnalyticsConsent />
      <ScrollToTop />
      <RateLimitToast />
      <FetchingIndicator />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/colleges" element={<CollegeView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route
          path="/privacy"
          element={
            // 불러오는 동안 화면이 비면 푸터가 맨 위로 올라와 깜빡이므로 빈 화면 높이를 채운다
            <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
              <PrivacyPage />
            </Suspense>
          }
        />
        <Route
          path="/terms"
          element={
            <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
              <TermsPage />
            </Suspense>
          }
        />

        {/* <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/write" element={<PostWritePage />} />
        <Route path="/community/:postId" element={<PostDetailPage />} />
        <Route path="/community/:postId/edit" element={<PostWritePage />} /> */}

        <Route path="/community/labs" element={<LabReviewHomePage />} />
        <Route
          path="/community/labs/:laboratoryId"
          element={<LabReviewPage />}
        />
        <Route
          path="/community/labs/:laboratoryId/write"
          element={<LabReviewWritePage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
