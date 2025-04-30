import { NextResponse } from 'next/server';
import { findContactByEmail, logHubSpotEmail } from '@/lib/hubspot';

export async function POST(request) {
  const { email, emailType = 'TEST', aiSummary } = await request.json();

  try {
    // 1. Find contact (using new helper)
    const contact = await findContactByEmail(email);
    if (!contact) throw new Error(`Contact ${email} not found`);
    console.log("contact:",contact)

    // 2. Log email (your existing function)
    await logHubSpotEmail(contact, emailType, aiSummary);

    return NextResponse.json({ 
      success: true,
      contactId: contact.contactId 
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}