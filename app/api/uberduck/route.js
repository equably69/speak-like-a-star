import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio');
    const voice = formData.get('voice') || 'darth-vader';

    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

    const response = await fetch('https://api.uberduck.ai/speak-synchronous', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'f5989382780e6e549cca5780436568ede9f518fb7c3a158dfdcfb5543279dc714ca1ece6fdba29ff739ee76057dc2e8c'

      },
      body: JSON.stringify({
        voice: voice,
        pace: 1.0,
        audio: audioBase64
      })
    });

    const result = await response.json();
    console.log('RISPOSTA RAW DA UBERDUCK:', result);

    if (result.path) {
      return NextResponse.json({ url: `https://storage.googleapis.com/uberduck-audio/${result.path}` });
    } else {
      return NextResponse.json({ error: JSON.stringify(result) }, { status: 500 });
    }
  } catch (err) {
    console.error('Errore server:', err);
    return NextResponse.json({ error: 'Errore server: ' + err.message }, { status: 500 });
  }
}
