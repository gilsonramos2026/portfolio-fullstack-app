import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motionVariants";
import { ContactHeader } from "../../components/public/contact/ContactHeader";
import { ContactForm } from "../../components/public/ContactForm";

export function ContactPage() {
  return (
    <motion.div
      className="content-container max-w-xl py-12 sm:py-20"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <ContactHeader />
      
      <div className="card mt-10 p-6 sm:p-8">
        <ContactForm />
      </div>
    </motion.div>
  );
}