import { motion } from "framer-motion";

import {
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaFileMedical,
  FaRegClock,
  FaUserMd,
  FaUsers,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FaClipboardList,
    title: "Receptionist",
    badge: "Front Desk",
    description: "Register patients and manage token queues effortlessly.",
    points: [
      "Quick patient registration",
      "Token generation",
      "Queue management",
    ],
  },
  {
    icon: FaUserMd,
    title: "Doctor",
    badge: "Consultation",
    description: "View queue, check patient history and generate prescriptions.",
    points: [
      "Live patient queue",
      "Patient history",
      "Digital prescriptions",
    ],
  },
  {
    icon: FaChartLine,
    title: "Analytics",
    badge: "Insights",
    description: "Track clinic performance with real-time insights.",
    points: [
      "Daily patient count",
      "Completed visits",
      "Clinic performance",
    ],
  },
];

const workflowStats = [
  {
    icon: FaUsers,
    value: "Fast",
    label: "Registration",
  },
  {
    icon: FaRegClock,
    value: "Live",
    label: "Queue Tracking",
  },
  {
    icon: FaFileMedical,
    value: "PDF",
    label: "Prescription",
  },
];

const containerAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
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

const Features = () => {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          variants={containerAnimation}
          className="mb-14 text-center"
        >
          <motion.div variants={fadeUpAnimation}>
            <Badge className="mb-5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/10">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
              Clinic Workflow
            </Badge>
          </motion.div>

          <motion.h2
            variants={fadeUpAnimation}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Built For Every{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Workflow
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUpAnimation}
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            Everything your clinic needs to manage front desk, doctor workflow,
            prescriptions and daily operations.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={containerAnimation}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={fadeUpAnimation}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 20,
                }}
              >
                <Card className="group relative h-full overflow-hidden border-primary/10 bg-background/70 shadow-sm backdrop-blur transition-all hover:border-primary/30 hover:shadow-xl">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />

                  <CardContent className="relative p-8">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <motion.span
                        whileHover={{
                          rotate: -6,
                          scale: 1.08,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 18,
                        }}
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10"
                      >
                        <Icon className="text-2xl text-primary" />
                      </motion.span>

                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        {feature.badge}
                      </Badge>
                    </div>

                    <h3 className="mb-3 text-xl font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mb-6 leading-7 text-muted-foreground">
                      {feature.description}
                    </p>

                    <div className="space-y-3">
                      {feature.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <FaCheckCircle className="text-xs text-primary" />
                          </span>

                          <span className="text-muted-foreground">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          variants={containerAnimation}
          className="mt-8 grid gap-4 rounded-[2rem] border border-primary/10 bg-primary/5 p-4 backdrop-blur sm:grid-cols-3"
        >
          {workflowStats.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                variants={fadeUpAnimation}
                whileHover={{
                  y: -4,
                }}
                className="rounded-2xl border border-primary/10 bg-background/80 p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="text-primary" />
                  </span>

                  <div>
                    <p className="text-lg font-bold leading-none">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;