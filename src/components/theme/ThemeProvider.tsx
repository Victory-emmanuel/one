import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme?: string;
  systemTheme?: string;
  themes: string[];
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themes: ["light", "dark", "system"],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      attribute="class"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  // Use the next-themes hook directly
  return useNextTheme();
};
