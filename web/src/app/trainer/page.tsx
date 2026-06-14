'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TrainerIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/trainer/dashboard');
  }, [router]);

  return null;
}
