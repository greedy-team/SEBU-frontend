import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <p className="text-6xl font-black text-brand-500 mb-4">404</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          존재하지 않는 페이지예요
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          주소가 잘못됐거나 삭제된 페이지예요.
        </p>
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-95"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
