import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    const keyword = searchInput.trim();
    navigate(
      keyword ? `/search?keyword=${encodeURIComponent(keyword)}` : "/search",
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-[11px] font-bold tracking-[0.14em] text-brand-500 uppercase">
        Sejong University · Undergraduate Research Platform
      </p>

      <h1 className="mt-5 text-[40px] leading-[1.2] font-black tracking-[-0.02em] text-gray-900">
        세종대학교 학부연구생
        <br />
        플랫폼, SEBU
      </h1>

      <p className="mt-5 text-[15px] leading-relaxed text-gray-500">
        연구실 탐색부터 교수님 컨택, 합격 후기까지 —
        <br />
        학부연구생을 꿈꾸는 세종대생을 위한 전용 플랫폼입니다.
      </p>

      <div
        className="mt-9 flex h-14 max-w-lg items-center gap-2 rounded-full border border-gray-200 bg-white py-2 pr-2 pl-6 transition-shadow focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200"
        style={{ boxShadow: "var(--shadow-cta)" }}
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="관심 분야, 역량, 연구실 이름을 검색해보세요"
          aria-label="연구실 검색"
          className="flex-1 text-sm outline-none placeholder:text-gray-400"
        />
        <button
          onClick={handleSearch}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-brand-500 px-5 text-sm font-bold text-white transition-all hover:brightness-95"
        >
          검색
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
