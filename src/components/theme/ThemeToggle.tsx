import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({
  className,
  variant = "outline",
  size = "icon"
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`${className} dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-700`}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6 overflow-hidden">
        <motion.div
          initial={false}
          animate={{
            y: isDark ? 0 : -30,
            opacity: isDark ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="h-4 w-4 text-indigo-400 dark:text-indigo-300" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            y: isDark ? 30 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="h-4 w-4 text-amber-500 dark:text-amber-300" />
        </motion.div>
      </div>
    </Button>
  );
}
