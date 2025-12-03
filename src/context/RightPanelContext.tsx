/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2025 INAF - Istituto Nazionale di Astrofisica
 * See LICENSE file for full license text.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RightPanelContextType {
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
  isOpen: boolean;
  close: () => void;
}

const RightPanelContext = createContext<RightPanelContextType | undefined>(undefined);

export const RightPanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ReactNode | null>(null);

  const close = () => {
    setContent(null);
  };

  return (
    <RightPanelContext.Provider value={{ content, setContent, isOpen: content !== null, close }}>
      {children}
    </RightPanelContext.Provider>
  );
};

export const useRightPanel = () => {
  const context = useContext(RightPanelContext);
  if (!context) {
    throw new Error('useRightPanel must be used within RightPanelProvider');
  }
  return context;
};

