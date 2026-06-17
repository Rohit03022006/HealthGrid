import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaCheckCircle,
  FaDownload,
  FaHeartbeat,
  FaRegClock,
  FaSignInAlt,
} from "react-icons/fa";

import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";

const footerLinks = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Workflow",
    href: "#workflow",
  },
  {
    label: "Login",
    to: "/login",
  },
];

const Footer = ({ canInstall, installed, install }) => {
  const installDisabled = !canInstall || installed;
  const showInstallButton = canInstall || installed;

  const handleInstall = () => {
    if (installDisabled) return;
    install?.();
  };

  return (
    <footer className="relative overflow-hidden border-t border-primary/10 bg-muted/30">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative mx-auto px-6 py-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="overflow-hidden rounded-[2rem] border border-primary/10 bg-background/75 p-6 shadow-sm backdrop-blur-xl sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:items-center">
            <div>
              <Link to="/" className="group inline-flex items-center gap-3">
                <motion.span
                  whileHover={{
                    rotate: -6,
                    scale: 1.06,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10"
                >
                  <img
                    src={logo}
                    alt="HealthGrid logo"
                    className="h-10 w-10 rounded-xl object-contain"
                  />
                </motion.span>

                <div>
                  <h3 className="font-heading text-xl font-bold leading-none">
                    HealthGrid
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Modern OPD Management System
                  </p>
                </div>
              </Link>

              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Manage patient registration, live queue, digital prescriptions
                and clinic workflow from one simple dashboard.
              </p>
            </div>

            <nav className="grid gap-2">
              <p className="mb-1 text-sm font-semibold">Quick Links</p>

              {footerLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>

            <div className="space-y-3">
              <p className="text-sm font-semibold">App Access</p>

              <div className="grid gap-3 sm:flex lg:grid">
                {showInstallButton && (
                  <Button
                    variant="outline"
                    onClick={handleInstall}
                    disabled={installDisabled}
                    className="h-11 gap-2 rounded-full"
                  >
                    {installed ? (
                      <>
                        <FaCheckCircle className="h-4 w-4 text-green-500" />
                        App Installed
                      </>
                    ) : (
                      <>
                        <FaDownload className="h-4 w-4" />
                        Install App
                      </>
                    )}
                  </Button>
                )}

                <Button asChild className="h-11 gap-2 rounded-full">
                  <Link to="/login">
                    <FaSignInAlt className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-primary/10 pt-5">
            <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} HealthGrid. All rights reserved.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2">
                  <FaHeartbeat className="text-primary" />
                  Smart clinic workflow
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />

                <span className="inline-flex items-center gap-2">
                  <FaRegClock className="text-primary" />
                  Faster OPD management
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
