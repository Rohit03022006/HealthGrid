import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaUserMd,
} from "react-icons/fa";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RightSide = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.identifier.trim();
    const password = formData.password;

    if (!email || !password.trim()) {
      setError("Email and password required");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-8 lg:min-h-0">
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        initial={{
          opacity: 0,
          y: 28,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.65,
          ease: "easeOut",
        }}
        className="relative w-full max-w-md"
      >
        <Card className="relative overflow-hidden border-primary/10 bg-background/80 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <CardHeader className="relative space-y-5 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.22, 1],
                    opacity: [0.45, 0.12, 0.45],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-3xl bg-primary/20"
                />

                <motion.div
                  whileHover={{
                    rotate: -6,
                    scale: 1.06,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                >
                  <FaUserMd className="text-3xl text-primary" />
                </motion.div>
              </div>
            </div>

            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Welcome Back
              </CardTitle>

              <CardDescription className="mt-2">
                Sign in to continue to HealthGrid
              </CardDescription>
            </div>

            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs text-muted-foreground">
              <FaShieldAlt className="text-primary" />
              Secure staff login
            </div>
          </CardHeader>

          <CardContent className="relative">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="identifier">Employee ID / Email</Label>

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your ID or email"
                    className="h-11 pl-10"
                    value={formData.identifier}
                    disabled={loading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identifier: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="h-11 pl-10 pr-10"
                    value={formData.password}
                    disabled={loading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="h-11 w-full gap-2 rounded-xl"
                size="lg"
                disabled={loading}
              >
                <motion.span
                  animate={
                    loading
                      ? {
                          scale: [1, 1.12, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaLock />
                </motion.span>

                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RightSide;