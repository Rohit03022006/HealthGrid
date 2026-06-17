import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaClipboardList,
  FaFilePrescription,
  FaUserPlus,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    step: "01",
    icon: FaUserPlus,
    title: "Register Patient",
    tag: "Reception",
    description: "Receptionist registers the patient and generates a token.",
    points: ["Patient details", "Token number", "Queue entry"],
  },
  {
    step: "02",
    icon: FaClipboardList,
    title: "Manage Queue",
    tag: "Live Queue",
    description: "Doctor sees the live queue and calls the next patient.",
    points: ["Waiting list", "Call patient", "Status update"],
  },
  {
    step: "03",
    icon: FaFilePrescription,
    title: "Digital Prescription",
    tag: "Prescription",
    description: "Doctor writes prescriptions digitally and stores records.",
    points: ["Medicines", "Advice", "PDF/Print"],
  },
];

const containerAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const fadeUpAnimation = {
  hidden: {
    opacity: 0,
    y: 30,
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

const HowItWorks = () => {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden bg-muted/30 px-6 py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          variants={containerAnimation}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUpAnimation}>
            <Badge className="mb-5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/10">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
              Simple Workflow
            </Badge>
          </motion.div>

          <motion.h2
            variants={fadeUpAnimation}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            How It{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Works
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUpAnimation}
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            A smooth clinic workflow from registration to consultation and
            digital prescription.
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[16%] right-[16%] top-20 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={containerAnimation}
            className="relative grid gap-8 md:grid-cols-3"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
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
                  className="relative"
                >
                  {index < steps.length - 1 && (
                    <div className="absolute -right-5 top-20 z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-background shadow-sm md:flex">
                      <FaArrowRight className="text-sm text-primary" />
                    </div>
                  )}

                  <Card className="group relative h-full overflow-hidden border-primary/10 bg-background/80 shadow-sm backdrop-blur transition-all hover:border-primary/30 hover:shadow-xl">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />

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
                          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                        >
                          <Icon className="text-2xl text-primary" />
                        </motion.span>

                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {step.step}
                        </span>
                      </div>

                      <Badge variant="secondary" className="mb-4 rounded-full">
                        {step.tag}
                      </Badge>

                      <h3 className="mb-3 text-xl font-semibold">
                        {step.title}
                      </h3>

                      <p className="mb-6 leading-7 text-muted-foreground">
                        {step.description}
                      </p>

                      <div className="space-y-3">
                        {step.points.map((point) => (
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
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;