"use client";

import { createContext, useContext, useCallback } from "react";

interface MobileMenuContextType {
  openMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function MobileMenuProvider({
  children,
  onOpenMenu,
}: {
  children: React.ReactNode;
  onOpenMenu: () => void;
}) {
  const openMobileMenu = useCallback(() => {
    onOpenMenu();
  }, [onOpenMenu]);

  return (
    <MobileMenuContext.Provider value={{ openMobileMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    return { openMobileMenu: () => {} };
  }
  return context;
}
