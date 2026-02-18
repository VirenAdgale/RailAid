import React, { createContext, useContext, useState, useEffect } from 'react';

const TextSizeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};

export const TextSizeProvider = ({ children }) => {
  const [textSize, setTextSize] = useState(() => {
    // Get initial value from localStorage or default to 1
    const saved = localStorage.getItem('railAid-textSize');
    return saved ? parseFloat(saved) : 1;
  });

  const increaseTextSize = () => {
    setTextSize(prev => {
      // max size is 1.5 (150%)
      const newSize = Math.min(prev + 0.1, 1.5);
      return newSize;
    });
  };

  const decreaseTextSize = () => {
    setTextSize(prev => {
      // min size is 0.8 (80%)
      const newSize = Math.max(prev - 0.1, 0.8); 
      return newSize;
    });
  };

  const resetTextSize = () => {
    setTextSize(1);
  };

  // to save the size into localStorage whenever textSize changes
  useEffect(() => {
    localStorage.setItem('railAid-textSize', textSize.toString());
    
    // Apply the text size to the document root
    document.documentElement.style.setProperty('--text-size-multiplier', textSize);
  }, [textSize]);

  // to pass all the functions and value
  const value = {
    textSize,
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
  };

  return (
    <TextSizeContext.Provider value={value}>
      {children}
    </TextSizeContext.Provider>
  );
};
