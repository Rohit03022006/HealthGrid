import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaBars,
  FaCheckCircle,
  FaDownload,
  FaSignInAlt,
  FaTimes,
} from "react-icons/fa";

import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";

const navLinks = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Workflow",
    href: "#workflow",
  },
];

const Navbar = ({ canInstall, installed, install }) => {
  const [open, setOpen] = useState(false);

  const installDisabled = !canInstall || installed;

  const handleInstall = () => {
    if (installDisabled) return;
    install?.();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/75 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <Link to="/" className="group flex items-center gap-3">
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
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10"
            >
              <img
                src={logo}
                alt="HealthGrid logo"
                className="h-9 w-9 rounded-xl object-contain"
              />
            </motion.span>

            <div>
              <h2 className="font-heading text-xl font-bold leading-none">
                HealthGrid
              </h2>
              <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
                Smart OPD Management
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.nav
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="hidden items-center gap-2 rounded-full border border-primary/10 bg-muted/40 p-1 backdrop-blur md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-background hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </motion.nav>

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="hidden items-center gap-3 md:flex"
        >
          <Button
            variant="outline"
            onClick={handleInstall}
            disabled={installDisabled}
            className="h-10 gap-2 rounded-full"
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

          <Button asChild className="h-10 gap-2 rounded-full px-5">
            <Link to="/login">
              <FaSignInAlt className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </motion.div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="overflow-hidden border-t border-primary/10 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto space-y-4 px-6 py-5">
              <nav className="grid gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-primary/10 bg-muted/40 px-4 py-3 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="grid gap-3">
                <Button
                  variant="outline"
                  onClick={handleInstall}
                  disabled={installDisabled}
                  className="h-11 justify-center gap-2 rounded-2xl"
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

                <Button asChild className="h-11 gap-2 rounded-2xl">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <FaSignInAlt className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;