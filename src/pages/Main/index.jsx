import Header from "../../components/layout/Header";
import HeroSection from "../../features/main/components/HeroSection";
import CollegeSection from "../../features/main/components/CollegeSection";
import LatestPostsSection from "../../features/main/components/LatestPostsSection";
import { useColleges } from "../../features/main/hooks/useColleges";
import { useLatestPosts } from "../../features/main/hooks/useLatestPosts";

function MainPage() {
  // 두 영역을 따로 부릅니다. 한쪽이 실패해도 다른 쪽은 그대로 보여야 해서요. (명세 6절)
  const { colleges, status: collegeStatus } = useColleges();
  const { posts, status: postStatus } = useLatestPosts();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />

      <div className="bg-gray-50">
        <CollegeSection colleges={colleges} status={collegeStatus} />
      </div>

      <LatestPostsSection posts={posts} status={postStatus} />
    </div>
  );
}

export default MainPage;
