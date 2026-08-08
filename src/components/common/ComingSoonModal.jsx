function ComingSoonModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl px-10 py-8 flex flex-col items-center gap-3 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-3xl">🚧</span>
        <h2 className="font-bold text-lg">구현 중입니다</h2>
        <p className="text-sm text-gray-500">
          연구실 상세 페이지는 준비 중이에요.
        </p>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default ComingSoonModal;
