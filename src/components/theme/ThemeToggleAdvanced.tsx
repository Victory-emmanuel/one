import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleAdvancedProps {
  className?: string;
}

export function ThemeToggleAdvanced({ className }: ThemeToggleAdvancedProps) {
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
    <div
      className={`relative h-8 w-16 rounded-full cursor-pointer shadow-md dark:shadow-gray-800 ${className}`}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-indigo-900 dark:to-purple-900 border border-gray-200 dark:border-gray-700"
        animate={{
          background: isDark
            ? "linear-gradient(to right, rgb(49, 46, 129), rgb(76, 29, 149))"
            : "linear-gradient(to right, rgb(96, 165, 250), rgb(129, 140, 248))"
        }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute top-1 h-6 w-6 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center"
        animate={{
          left: isDark ? "calc(100% - 1.75rem)" : "0.25rem",
          rotate: isDark ? 360 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-indigo-900 dark:text-indigo-300" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500 dark:text-amber-300" />
        )}
      </motion.div>
    </div>
  );
}
