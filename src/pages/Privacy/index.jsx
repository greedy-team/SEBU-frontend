import Header from "../../components/layout/Header";

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900">개인정보 처리방침</h1>
        <p className="mt-2 text-xs text-gray-400">
          SEBU 서비스의 개인정보 처리에 관한 안내입니다.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-relaxed text-gray-500">
          추후 내용 확정 예정
        </div>
      </main>
    </div>
  );
}

export default PrivacyPage;
