import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mock CRM Sync
    console.log('Syncing lead to CRM:', body.lead);
    console.log('Assessment Data:', { answers: body.answers, score: body.score });
    
    // Mock Auto-Responder Email
    console.log(`Triggering auto-responder email to: ${body.lead.email}`);
    console.log('Email Contents:');
    console.log('- 1-page PDF Snapshot of results attached.');
    console.log('- Link to book a discovery call included.');
    console.log('- Summary of the 88-control "Full Assessment" value proposition included.');

    return NextResponse.json({ success: true, message: 'Assessment processed successfully.' });
  } catch (error) {
    console.error('Error processing POPIA assessment:', error);
    return NextResponse.json({ success: false, error: 'Failed to process assessment.' }, { status: 500 });
  }
}
