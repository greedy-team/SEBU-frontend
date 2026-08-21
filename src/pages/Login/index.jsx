import Header from "../../components/layout/Header";
import LoginForm from "../../features/auth/components/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
