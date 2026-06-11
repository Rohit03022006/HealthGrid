import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const queue = ["T001", "T002", "T003", "T004", "T005", "T006"];

const Hero = () => {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-5">Modern OPD Management</Badge>

          <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl">
            Paper registers se azaadi.
          </h1>

          <p className="mb-8 max-w-xl text-lg text-muted-foreground">
            Manage registrations, queue, prescriptions and clinic operations
            from one modern dashboard.
          </p>

          <div className="flex gap-4">
            <Link to="/login">
              <Button size="lg">
                Login to Dashboard
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">Live Queue</h3>

                <Badge variant="secondary">Active</Badge>
              </div>

              <div className="h-72 overflow-hidden">
                <motion.div
                  animate={{
                    y: [0, -180],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="space-y-3"
                >
                  {[...queue, ...queue].map((token, index) => (
                    <div
                      key={`${token}-${index}`}
                      className="flex items-center justify-between rounded-xl border p-3"
                    >
                      <span className="font-medium">{token}</span>

                      <Badge variant="outline">Waiting</Badge>
                    </div>
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
