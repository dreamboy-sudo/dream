import { DreamMode } from "@/lib/types";
import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from "react";

interface DreamModeContextType {
  mode: DreamMode;
  setMode: Dispatch<SetStateAction<DreamMode>>;
}

const DreamModeContext = createContext<DreamModeContextType | undefined>(undefined);

export function DreamModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DreamMode>("dreamgirl");

  return (
    <DreamModeContext.Provider value={{ mode, setMode }}>
      {children}
    </DreamModeContext.Provider>
  );
}

export function useDreamMode() {
  const context = useContext(DreamModeContext);
  if (context === undefined) {
    throw new Error("useDreamMode must be used within a DreamModeProvider");
  }
  return context;
} 