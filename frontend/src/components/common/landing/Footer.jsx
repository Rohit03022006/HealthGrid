import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Footer = ({ canInstall, installed, install }) => {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="HealthGrid logo"
              className="h-10 w-10 rounded-xl object-contain"
            />

            <h3 className="font-heading text-xl font-bold">
              HealthGrid
            </h3>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Modern OPD Management System
          </p>

          <div className="mt-5">
            {canInstall && (
              <Button variant="outline" onClick={install}>
                Install App
              </Button>
            )}

            {installed && (
              <Button variant="outline" disabled>
                App Installed
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;