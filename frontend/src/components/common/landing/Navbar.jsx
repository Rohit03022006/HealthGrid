import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = ({ canInstall, installed, install }) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="HealthGrid logo"
            className="h-10 w-10 rounded-xl object-contain"
          />

          <h2 className="font-heading text-xl font-bold">
            HealthGrid
          </h2>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Features
          </a>

          <a
            href="#workflow"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Workflow
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={install}
            disabled={!canInstall || installed}
          >
            {installed ? "App Installed" : "Install App"}
          </Button>

          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;