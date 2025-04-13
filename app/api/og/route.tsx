import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get title from query params or use default
    const title = searchParams.get('title') || 'SnapSeeker - 竞品分析和创意验证工具';
    const description = searchParams.get('description') || '快速验证您的产品创意，查找同类产品，分析市场机会';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px 40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: '20px' }}
            >
              <path d="M9.5 14.5L4.5 19.5M15 10a3 3 0 11-6 0 3 3 0 016 0z" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3L12 7M21 12L17 12M19.7782 4.2218L16.9497 7.0503M4.2218 4.2218L7.0503 7.0503M12 17L12 21" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #0D9488, #0891B2)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              SnapSeeker
            </span>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: '20px',
                maxWidth: '800px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 28,
                color: '#9CA3AF',
                textAlign: 'center',
                maxWidth: '700px',
              }}
            >
              {description}
            </p>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              color: 'white',
              fontSize: 24,
            }}
          >
            seeker.snapsnap.site
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
} 