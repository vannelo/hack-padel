import LoginForm from "@/components/Forms/LoginForm/LoginForm";
import HackPadelLogo from "@/components/Layout/HPLogo/HPLogo";

const Login = () => {
  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-black p-8 text-white">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-center">
          <HackPadelLogo width={120} height={150} />
        </div>
        <LoginForm />
      </div>
    </main>
  );
};

export default Login;
