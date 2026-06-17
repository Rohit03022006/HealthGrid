import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaFileMedical,
  FaNotesMedical,
  FaSignal,
  FaWifi,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import logo from "@/assets/logo.png";


const features = [
  {
    label: "Real-time Queue Management",
    icon: FaSignal,
  },
  {
    label: "Digital Prescriptions",
    icon: FaFileMedical,
  },
  {
    label: "Offline Ready",
    icon: FaWifi,
  },
  {
    label: "Analytics Dashboard",
    icon: FaNotesMedical,
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

const fadeLeftAnimation = {
  hidden: {
    opacity: 0,
    x: -24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const LeftSide = () => {

  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-primary text-primary-foreground lg:flex">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%)]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerAnimation}
        className="relative z-20 flex w-full flex-col justify-between p-12"
      >
        {/* Branding */}
        <div>
          <motion.div
            variants={fadeLeftAnimation}
            className="mb-6 flex items-center gap-4"
          >
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
            >
              <Link
                to="/"
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur transition"
              >
                <img
                  src={logo}
                  alt="HealthGrid logo"
                  className="h-full w-full rounded-3xl object-contain"
                />
              </Link>
            </motion.div>

            <div>
              <Link to="/" className="inline-block">
                <h1 className="font-heading text-4xl font-bold tracking-tight transition-opacity hover:opacity-80">
                  HealthGrid
                </h1>
              </Link>

              <p className="mt-1 text-sm text-primary-foreground/80">
                Modern OPD Management
              </p>
            </div>
          </motion.div>

          <motion.div variants={containerAnimation} className="mt-12 space-y-4">
            {features.map(({ label, icon: Icon }) => (
              <motion.div
                key={label}
                variants={fadeLeftAnimation}
                whileHover={{
                  x: 8,
                  scale: 1.01,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <Icon className="text-base" />
                </span>

                <span className="font-medium">{label}</span>

                <FaCheckCircle className="ml-auto text-sm text-green-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Quote */}
        <motion.div variants={fadeLeftAnimation}>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="max-w-md text-lg font-medium leading-relaxed text-primary-foreground/90">
              “Paper registers ko replace karo. Aaj se.”
            </p>

            <p className="mt-2 text-sm text-primary-foreground/60">
              Built for faster, cleaner clinic operations.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LeftSide;
