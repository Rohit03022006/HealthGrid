import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaCheckCircle,
  FaNotesMedical,
  FaRegClock,
  FaUserInjured,
  FaUserMd,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const queueItems = [
  {
    id: "T001",
    name: "Rahul Sharma",
    status: "Waiting",
    icon: FaUserInjured,
  },
  {
    id: "T002",
    name: "Priya Verma",
    status: "In Queue",
    icon: FaRegClock,
  },
  {
    id: "T003",
    name: "Amit Singh",
    status: "Consulting",
    icon: FaUserMd,
  },
  {
    id: "T004",
    name: "Sneha Gupta",
    status: "Waiting",
    icon: FaUserInjured,
  },
  {
    id: "T005",
    name: "Vikram Kumar",
    status: "Prescription",
    icon: FaNotesMedical,
  },
  {
    id: "T006",
    name: "Pooja Yadav",
    status: "Waiting",
    icon: FaRegClock,
  },
];

const containerAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpAnimation = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative mx-auto">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={fadeUpAnimation}>
              <Badge className="mb-5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/10">
                <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
                Modern OPD Management
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUpAnimation}
              className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Paper registers se{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                azaadi.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpAnimation}
              className="mb-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
            >
              Manage registrations, live queue, patient history, prescriptions,
              templates and clinic operations from one modern dashboard.
            </motion.p>

            <motion.div
              variants={fadeUpAnimation}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="h-12 rounded-full px-6">
                <Link to="/login">
                  Login to Dashboard
                  <FaArrowRight className="ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-6"
              >
                <a href="#features">View Features</a>
              </Button>
            </motion.div>

          </motion.div>

          {/* Right Animated Queue Card */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[2rem] bg-primary/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-primary p-6 text-primary-foreground shadow-2xl">
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

                <div className="relative mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Live Queue</h3>
                    <p className="text-xs text-primary-foreground/70">
                      Real-time OPD token preview
                    </p>
                  </div>

                  <span className="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-100">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-300" />
                    Live
                  </span>
                </div>

                <div className="relative h-64 overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-primary to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-primary to-transparent" />

                  <motion.div
                    animate={{
                      y: ["0%", "-50%"],
                    }}
                    transition={{
                      duration: 16,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="space-y-3"
                  >
                    {[...queueItems, ...queueItems].map((token, index) => {
                      const Icon = token.icon;

                      return (
                        <motion.div
                          key={`${token.id}-${index}`}
                          whileHover={{
                            x: 6,
                            scale: 1.01,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 22,
                          }}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                              <Icon className="text-sm" />
                            </span>

                            <div className="min-w-0">
                              <p className="font-semibold leading-none">
                                {token.id}
                              </p>
                              <p className="mt-1 truncate text-xs text-primary-foreground/70">
                                {token.name}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-primary-foreground/80">
                            {token.status}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                <div className="relative mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-lg font-bold">24</p>
                    <p className="text-xs text-primary-foreground/70">
                      Today
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-lg font-bold">06</p>
                    <p className="text-xs text-primary-foreground/70">
                      Waiting
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="flex items-center gap-1 text-lg font-bold">
                      <FaCheckCircle className="text-sm text-green-300" />
                      18
                    </p>
                    <p className="text-xs text-primary-foreground/70">
                      Done
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;