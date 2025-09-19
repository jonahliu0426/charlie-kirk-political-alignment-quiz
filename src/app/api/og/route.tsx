import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const percentage = searchParams.get('percentage') || '0';

    // Determine alignment level and color
    const percentageNum = parseInt(percentage);
    let alignmentLevel = '';
    let alignmentColor = '';
    let backgroundColor = '';

    if (percentageNum >= 90) {
      alignmentLevel = 'Very High Alignment';
      alignmentColor = '#059669'; // Green-600
      backgroundColor = '#ecfdf5'; // Green-50
    } else if (percentageNum >= 75) {
      alignmentLevel = 'High Alignment';
      alignmentColor = '#10b981'; // Green-500
      backgroundColor = '#f0fdf4'; // Green-50
    } else if (percentageNum >= 60) {
      alignmentLevel = 'Moderate Alignment';
      alignmentColor = '#3b82f6'; // Blue-500
      backgroundColor = '#eff6ff'; // Blue-50
    } else if (percentageNum >= 40) {
      alignmentLevel = 'Low Alignment';
      alignmentColor = '#f59e0b'; // Amber-500
      backgroundColor = '#fffbeb'; // Amber-50
    } else if (percentageNum >= 25) {
      alignmentLevel = 'Very Low Alignment';
      alignmentColor = '#ef4444'; // Red-500
      backgroundColor = '#fef2f2'; // Red-50
    } else {
      alignmentLevel = 'Minimal Alignment';
      alignmentColor = '#dc2626'; // Red-600
      backgroundColor = '#fef2f2'; // Red-50
    }

    return new ImageResponse(
      (
        <div
          style={{
            background: backgroundColor,
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            }}
          />
          
          {/* Header */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Political Alignment Quiz
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: '24px',
              color: '#6b7280',
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            Compared to Charlie Kirk&apos;s positions
          </div>
          
          {/* Main Result Circle */}
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: `8px solid ${alignmentColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              backgroundColor: 'white',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: alignmentColor,
              }}
            >
              {percentage}%
            </div>
          </div>
          
          {/* Alignment Level */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: alignmentColor,
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {alignmentLevel}
          </div>
          
          {/* Call to Action */}
          <div
            style={{
              fontSize: '20px',
              color: '#4b5563',
              textAlign: 'center',
              backgroundColor: 'white',
              padding: '15px 30px',
              borderRadius: '25px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            Take the quiz yourself!
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}