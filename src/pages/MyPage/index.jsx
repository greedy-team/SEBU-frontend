import Header from "../../components/layout/Header";

function MyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h1 className="text-2xl font-bold text-gray-800">
          마이페이지 초기 설정
        </h1>
        <p className="mt-2 text-gray-500">
          앞으로 프로필 설정 화면이 들어올 자리입니다 🛠️
        </p>
      </div>
    </div>
  );
}

export default MyPage;
