import { motion } from "framer-motion";

export default function AnimatedButton({ children, ...props }) {
    return (
        <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}
