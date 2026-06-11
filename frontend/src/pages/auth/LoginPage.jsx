import Footer from "@/components/common/landing/Footer";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <LeftSide />
        <RightSide />
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;