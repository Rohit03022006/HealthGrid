import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaClipboardList,
  FaFilePrescription,
} from "react-icons/fa";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const steps = [
  {
    icon: FaUserPlus,
    title: "Register Patient",
    description:
      "Receptionist registers the patient and generates a token.",
  },
  {
    icon: FaClipboardList,
    title: "Manage Queue",
    description:
      "Doctor sees the live queue and calls the next patient.",
  },
  {
    icon: FaFilePrescription,
    title: "Digital Prescription",
    description:
      "Doctor writes prescriptions digitally and stores records.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="workflow"
      className="bg-muted/30 py-24"
    >
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            How It Works
          </h2>

          <p className="text-muted-foreground">
            A simple workflow from registration to consultation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.2,
                }}
              >
                <Card className="h-full">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="text-2xl text-primary" />
                      </div>
                    </div>

                    <h3 className="mb-3 text-xl font-semibold">
                      {step.title}
                    </h3>

                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;