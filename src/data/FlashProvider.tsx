import { createContext, useCallback, useContext, useState } from 'react';

export interface FlashType {
  message: string;
  type: string;
}
export interface FlashContextType {
  flash: (message: string, type: string) => void;
  flashMessage: FlashType;
  visible: boolean;
  hideFlash: () => void;
}
export const FlashContext = createContext<FlashContextType | null>(null);

export default function FlashProvider({ children }: any) {
  const [visible, setVisible] = useState(false);
  const [flashMessage, setFlashMessage] = useState<FlashType>({
    message: '',
    type: '',
  });

  const flash = useCallback((message: string, type: string) => {
    setFlashMessage({ message, type });
    setVisible(true);
  }, []);

  const hideFlash = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <FlashContext.Provider value={{ flash, flashMessage, visible, hideFlash }}>
      {' '}
      {children}{' '}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  return useContext(FlashContext)?.flash;
}
