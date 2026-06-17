import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

const LoginPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <LeftSide />
        <RightSide />
      </div>
    </main>
  );
};

export default LoginPage;