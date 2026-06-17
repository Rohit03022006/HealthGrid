import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaFileMedical,
  FaHospitalUser,
  FaNotesMedical,
  FaSignal,
  FaStethoscope,
  FaWifi,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import logo from "@/assets/logo.png";

const tokens = [
  { id: "T001", name: "Rohit Kumar", status: "Waiting", icon: FaClock },
  { id: "T002", name: "Priya Shah", status: "In Queue", icon: FaHospitalUser },
  { id: "T003", name: "Amit Patel", status: "Waiting", icon: FaClock },
  { id: "T004", name: "Neha Singh", status: "Ready", icon: FaStethoscope },
  { id: "T005", name: "Karan Mehta", status: "Waiting", icon: FaClock },
  { id: "T006", name: "Anjali Rao", status: "In Queue", icon: FaHospitalUser },
  { id: "T007", name: "Dev Sharma", status: "Waiting", icon: FaClock },
];

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

const LeftSide = () => {
  const queueItems = [...tokens, ...tokens];

  return (
    <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex">
      <div className="relative z-20 flex w-full flex-col justify-between p-12">
        {/* Branding */}
        <div>
          <div className="mb-6 flex items-center gap-4">
            <Link
              to="/"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition hover:scale-105"
            >
              <img
                src={logo}
                alt="HealthGrid logo"
                className="h-full w-full object-contain rounded-3xl"
              />
            </Link>

            <div>
              <Link to="/" className="inline-block">
                <h1 className="font-heading text-4xl font-bold transition-opacity hover:opacity-80">
                  HealthGrid
                </h1>
              </Link>

              <p className="mt-1 text-sm text-primary-foreground/80">
                Modern OPD Management
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            {features.map(({ label, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.12 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <Icon className="text-base" />
                </span>

                <span>{label}</span>

                <FaCheckCircle className="ml-auto text-sm text-green-300" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Queue Preview */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Live Queue</h3>
              <p className="text-xs text-primary-foreground/70">
                Real-time OPD token preview
              </p>
            </div>

            <span className="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-300" />
              Live
            </span>
          </div>

          <div className="relative h-56 overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-primary/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-primary/70 to-transparent" />

            <motion.div
              animate={{
                y: ["0%", "-50%"],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "linear",
              }}
              className="space-y-3"
            >
              {queueItems.map((token, index) => {
                const Icon = token.icon;

                return (
                  <div
                    key={`${token.id}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                        <Icon className="text-sm" />
                      </span>

                      <div className="min-w-0">
                        <p className="font-semibold leading-none">{token.id}</p>
                        <p className="mt-1 truncate text-xs text-primary-foreground/70">
                          {token.name}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-primary-foreground/80">
                      {token.status}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        <div>
          <p className="max-w-md text-lg font-medium leading-relaxed text-primary-foreground/90">
            "Paper registers ko replace kara. Aaj se."
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
