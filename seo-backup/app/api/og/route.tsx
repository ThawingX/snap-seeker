import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * Generate Open Graph image dynamically
 * @param request The incoming request with query parameters
 * @returns An image response for Open Graph
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    
    // Extract title and description from query parameters or use defaults
    const title = searchParams.get("title") || "SnapSeeker";
    const description = searchParams.get("description") || 
      "Product search and competitor analysis tool for product managers, independent developers, and entrepreneurs.";

    // Define image dimensions
    const width = 1200;
    const height = 630;

    // Generate the image response
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#f8fafc",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              padding: "40px",
              width: "90%",
              height: "90%",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "#0f172a",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "32px",
                color: "#64748b",
                textAlign: "center",
                maxWidth: "80%",
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
            <div
              style={{
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#0f172a",
                }}
              >
                seeker.snapsnap.site
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    // Return a simple error image if something goes wrong
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#f8fafc",
            fontSize: "32px",
            color: "#ef4444",
          }}
        >
          Error generating image
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}