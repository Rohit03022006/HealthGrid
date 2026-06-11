import { motion } from "framer-motion";

import {
  FaClipboardList,
  FaUserMd,
  FaChartLine,
} from "react-icons/fa";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    icon: FaClipboardList,
    title: "Receptionist",
    description:
      "Register patients and manage token queues effortlessly.",
  },
  {
    icon: FaUserMd,
    title: "Doctor",
    description:
      "View queue and generate digital prescriptions.",
  },
  {
    icon: FaChartLine,
    title: "Analytics",
    description:
      "Track clinic performance with real-time insights.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="container mx-auto px-6 py-24"
    >
      <div className="mb-14 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          Built For Every Workflow
        </h2>

        <p className="text-muted-foreground">
          Everything your clinic needs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              whileHover={{
                y: -8,
              }}
            >
              <Card className="h-full transition-shadow hover:shadow-xl">
                <CardContent className="p-8">
                  <Icon className="mb-4 text-4xl text-primary" />

                  <h3 className="mb-3 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;