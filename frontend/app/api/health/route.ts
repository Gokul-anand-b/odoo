import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    system: 'WedPilot AI',
    activeFeature: 'Core Feature 2: Smart Vendor Intelligence & Quote Comparison',
    agency: 'The Royal Knot (Jaipur & Udaipur)',
    timestamp: new Date().toISOString(),
  });
}
