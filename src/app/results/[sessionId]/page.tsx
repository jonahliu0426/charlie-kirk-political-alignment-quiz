import Results from '@/components/Results';

interface ResultsPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = await params;
  return <Results sessionId={sessionId} />;
}

export async function generateMetadata({ params }: ResultsPageProps) {
  const { sessionId } = await params;
  return {
    title: `Political Alignment Results - ${sessionId}`,
    description: 'View your political alignment results compared to Charlie Kirk&apos;s positions',
  };
}