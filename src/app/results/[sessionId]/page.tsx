import Results from '@/components/Results';
import { getDatabase } from '@/lib/database-serverless';

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
  
  try {
    // Get user's results to customize meta tags
    const database = await getDatabase();
    const session = await database.get(
      'SELECT * FROM user_sessions WHERE id = ?',
      [sessionId]
    );
    
    let percentage = 50; // Default fallback
    let alignmentLabel = 'Political Alignment';
    
    if (session?.overlap_percentage) {
      percentage = session.overlap_percentage;
      if (percentage >= 90) alignmentLabel = 'Very High Alignment';
      else if (percentage >= 75) alignmentLabel = 'High Alignment';
      else if (percentage >= 60) alignmentLabel = 'Moderate Alignment';
      else if (percentage >= 40) alignmentLabel = 'Low Alignment';
      else if (percentage >= 25) alignmentLabel = 'Very Low Alignment';
      else alignmentLabel = 'Minimal Alignment';
    }

    const title = `${percentage}% Political Alignment with Charlie Kirk`;
    const description = `I got ${percentage}% alignment (${alignmentLabel}) with Charlie Kirk's political positions! Take the quiz to see how your views compare.`;
    
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
      
    const ogImageUrl = `${baseUrl}/api/og?percentage=${percentage}&sessionId=${sessionId}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: baseUrl, // Main domain for click-through, not specific result page
        siteName: 'Political Alignment Quiz',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${percentage}% Political Alignment Result`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
        creator: '@jonahliu0426',
      },
      other: {
        'og:image:width': '1200',
        'og:image:height': '630',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Fallback metadata
    return {
      title: 'Political Alignment Quiz Results',
      description: 'See how your political views align with Charlie Kirk&apos;s positions',
      openGraph: {
        title: 'Political Alignment Quiz Results',
        description: 'Take the quiz to see how your political views compare with reference positions',
        images: ['/api/og?percentage=50&sessionId=demo'],
      },
    };
  }
}