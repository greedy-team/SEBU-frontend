// Header.jsx
function Header() {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center px-6 bg-white">
      <span className="font-bold text-blue-600 text-xl">SEBU</span>
      <nav className="ml-8 flex gap-6 text-sm text-gray-600">
        <span>탐색</span>
        <span>커뮤니티</span>
      </nav>
      <div className="ml-auto text-sm text-gray-500">로그인</div>
    </header>
  );
}
export default Header;
