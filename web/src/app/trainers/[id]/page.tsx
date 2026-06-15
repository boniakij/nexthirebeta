import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Spinner } from '@/components/ui';
import TrainerProfileContent from './trainer-content';

interface TrainerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TrainerProfilePage({ params }: TrainerPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <TrainerProfileContent trainerId={id} />
        </Suspense>
      </div>
    </div>
  );
}
