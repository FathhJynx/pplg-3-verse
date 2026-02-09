import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 border-t border-primary/20 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 diagonal-stripes opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Glitch title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <GlitchText
              text="XII PPLG 3"
              as="h2"
              className="text-4xl md:text-6xl font-bold text-primary"
            />
          </motion.div>

          {/* School info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-2 mb-8"
          >
            <p className="text-lg font-display font-semibold text-foreground">
              SMKN 4 TASIKMALAYA
            </p>
            <p className="text-sm font-body text-muted-foreground">
              Jl. Tamansari No. 1, Tamansari, Kec. Tamansari
            </p>
            <p className="text-sm font-body text-muted-foreground">
              Kota Tasikmalaya, Jawa Barat 46196
            </p>
          </motion.div>

          {/* Divider */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />

          {/* Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <p className="text-xs font-body text-muted-foreground tracking-wider uppercase">
              Pengembangan Perangkat Lunak dan Gim
            </p>
            <p className="text-xs font-body text-muted-foreground">
              Angkatan 2023 • Cohort XII
            </p>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-primary/10 w-full flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-body text-muted-foreground">
                SYSTEM ONLINE
              </span>
            </div>

            <p className="text-xs font-body text-muted-foreground">
              © 2023-2024 XII PPLG 3. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-xs font-display text-primary tracking-wider">
                v1.0.0
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l border-b border-primary/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r border-b border-primary/30" />
    </footer>
  );
};

export default Footer;
