import { createContext, useContext, useState } from "react";
const UIContext = createContext(null);
export function UIProvider({ children }) {
  const [finderOpen, setFinderOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  return <UIContext.Provider value={{ finderOpen, setFinderOpen, chatOpen, setChatOpen }}>{children}</UIContext.Provider>;
}
export const useUI = () => useContext(UIContext);
