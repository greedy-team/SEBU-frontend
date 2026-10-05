import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sebuMark from "../../../assets/sebu-mark.svg";

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = searchInput.trim();
    navigate(
      keyword ? `/search?keyword=${encodeURIComponent(keyword)}` : "/search",
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 md:px-6 md:pt-8 md:pb-12">
      {/* 일러스트는 제목 블록(영문 소제목 + 제목)과 같은 줄에서 세로 가운데를 맞춘다 */}
      <div className="flex items-center justify-between gap-10">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.14em] text-brand-500 uppercase">
            Sejong University · Undergraduate Research Platform
          </p>

          <h1 className="mt-5 text-[28px] leading-[1.25] font-black tracking-[-0.02em] break-keep text-gray-900 md:text-[40px] md:leading-[1.2]">
            세종대학교 학부연구생
            <br />
            플랫폼, SEBU
          </h1>
        </div>

        <img
          src={sebuMark}
          alt=""
          aria-hidden="true"
          className="hidden w-32 shrink-0 translate-y-8 md:block md:-translate-x-14 lg:w-40 lg:-translate-x-20"
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed break-keep text-gray-500 md:mt-5 md:text-[15px]">
        연구실 탐색부터 교수님 컨택, 합격 후기까지 —
        <br />
        학부연구생을 꿈꾸는 세종대생을 위한 전용 플랫폼입니다.
      </p>

      <form
        role="search"
        onSubmit={handleSearch}
        className="mt-7 flex h-14 max-w-3xl items-center gap-2 rounded-2xl border border-brand-200 bg-gray-100 pr-2 pl-4 transition-shadow focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200"
      >
        <span className="shrink-0 text-gray-400">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="관심 분야, 교수님, 연구실 이름을 검색해보세요"
          aria-label="연구실 검색"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="flex h-10 shrink-0 items-center rounded-xl bg-brand-500 px-5 text-sm font-bold text-white transition-all hover:brightness-95"
        >
          검색
        </button>
      </form>
    </section>
  );
}

export default HeroSection;
