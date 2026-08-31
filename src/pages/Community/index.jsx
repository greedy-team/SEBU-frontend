import { useState } from "react";
import Header from "../../components/layout/Header";
import CommunitySearchBar from "../../features/community/components/CommunitySearchBar";
import CategoryTabs from "../../features/community/components/CategoryTabs";
import PostList from "../../features/community/components/PostList";
import WritePromptCard from "../../features/community/components/WritePromptCard";
import PopularPostsCard from "../../features/community/components/PopularPostsCard";
import { useCommunityPosts } from "../../features/community/hooks/useCommunityPosts";
import { usePopularPosts } from "../../features/community/hooks/usePopularPosts";
import { COMMUNITY_TABS } from "../../constants/postCategory";

function CommunityPage() {
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [activeTabId, setActiveTabId] = useState("ALL");
  const [sort, setSort] = useState("LATEST");

  const activeTab = COMMUNITY_TABS.find((tab) => tab.id === activeTabId);
  const isLabReview = activeTabId === "LAB_REVIEW";

  const { posts, totalElements, isLoading, error } = useCommunityPosts({
    category: activeTab.category,
    keyword,
    sort,
  });
  const { posts: popularPosts, isLoading: isPopularLoading } =
    usePopularPosts();

  const handleSearch = () => setKeyword(searchInput.trim());

  const handleClearSearch = () => {
    setSearchInput("");
    setKeyword("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">커뮤니티 홈</h1>

        <div className="mt-6">
          <CommunitySearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearch}
            onClear={handleClearSearch}
          />
        </div>

        <div className="mt-5">
          <CategoryTabs activeTabId={activeTabId} onChange={setActiveTabId} />
        </div>

        {/* 좁은 화면에서는 사이드바가 목록 아래로 내려갑니다 */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          <div>
            {isLabReview ? (
              <div className="rounded-card border border-gray-200 bg-white px-5 py-16 text-center">
                <p className="text-sm font-bold text-gray-900">
                  랩실 평가는 준비 중이에요
                </p>
                <p className="mt-1.5 text-sm text-gray-400">
                  연구실별 후기를 곧 여기서 볼 수 있어요.
                </p>
              </div>
            ) : (
              <PostList
                title={keyword ? "검색 결과" : activeTab.listTitle}
                posts={posts}
                totalElements={totalElements}
                isLoading={isLoading}
                error={error}
                sort={sort}
                onSortChange={setSort}
                emptyMessage={
                  keyword
                    ? `'${keyword}' 검색 결과가 없어요.`
                    : "아직 글이 없어요."
                }
              />
            )}
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
            <WritePromptCard />
            <PopularPostsCard
              posts={popularPosts}
              isLoading={isPopularLoading}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
