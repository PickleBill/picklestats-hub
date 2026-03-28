import { createContext, useContext, useState, ReactNode } from "react";

interface TMNTContextType {
  tmntMode: boolean;
  toggleTMNT: () => void;
}

const TMNTContext = createContext<TMNTContextType>({ tmntMode: false, toggleTMNT: () => {} });

export const TMNTProvider = ({ children }: { children: ReactNode }) => {
  const [tmntMode, setTmntMode] = useState(false);
  return (
    <TMNTContext.Provider value={{ tmntMode, toggleTMNT: () => setTmntMode((p) => !p) }}>
      <div className={tmntMode ? "tmnt-mode" : ""}>
        {children}
      </div>
    </TMNTContext.Provider>
  );
};

export const useTMNT = () => useContext(TMNTContext);
