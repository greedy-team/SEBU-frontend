import { useState } from "react";
import Header from "../../components/layout/Header";
import CategoryTabs from "../../features/community/components/CategoryTabs";
import PostList from "../../features/community/components/PostList";
import { useCommunityPosts } from "../../features/community/hooks/useCommunityPosts";
import { COMMUNITY_TABS } from "../../constants/postCategory";

function CommunityPage() {
  const [activeTabId, setActiveTabId] = useState("ALL");
  const [sort, setSort] = useState("LATEST");

  const activeTab = COMMUNITY_TABS.find((tab) => tab.id === activeTabId);
  const isLabReview = activeTabId === "LAB_REVIEW";

  const { posts, totalElements, isLoading, error } = useCommunityPosts({
    category: activeTab.category,
    sort,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">커뮤니티 홈</h1>

        <div className="mt-6">
          <CategoryTabs activeTabId={activeTabId} onChange={setActiveTabId} />
        </div>

        <div className="mt-4">
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
              title={activeTab.listTitle}
              posts={posts}
              totalElements={totalElements}
              isLoading={isLoading}
              error={error}
              sort={sort}
              onSortChange={setSort}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
