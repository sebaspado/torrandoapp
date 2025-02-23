import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ClientPortalProps {
  children: React.ReactNode;
  selector: string;
}

export default function ClientPortal({ children, selector }: ClientPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const element = document.querySelector(selector);
  if (!element) return null;

  return createPortal(children, element);
} 