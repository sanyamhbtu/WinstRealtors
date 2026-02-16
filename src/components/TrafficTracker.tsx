'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logVisit } from '@/actions/tracking';

export default function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Debounce or just log immediately. For simplicity: immediate.
    logVisit(pathname);
  }, [pathname]);

  return null;
}
