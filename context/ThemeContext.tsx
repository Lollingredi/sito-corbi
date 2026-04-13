"use client";

// Skills applied: composition-patterns (react19-no-forwardref, state-context-interface)
import { createContext, useState, useEffect, use } from "react";

interface ThemeState {
  dark: boolean;
}

interface ThemeActions {
  toggleTheme: () => void;
}

interface ThemeContextValue {
  state: ThemeState;
  actions: ThemeActions;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <ThemeContext
      value={{
        state: { dark },
        actions: { toggleTheme: () => setDark((d) => !d) },
      }}
    >
      {children}
    </ThemeContext>
  );
}

export function useTheme(): { dark: boolean; toggleTheme: () => void } {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return { dark: ctx.state.dark, toggleTheme: ctx.actions.toggleTheme };
}
