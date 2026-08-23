import {
  useEffect,
  useState,
} from 'react';

export function usePageVisibility():
boolean {
  const [
    isVisible,
    setIsVisible,
  ] = useState(
    document.visibilityState ===
      'visible',
  );

  useEffect(() => {
    function handleVisibilityChange() {
      setIsVisible(
        document.visibilityState ===
          'visible',
      );
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, []);

  return isVisible;
}