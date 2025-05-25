import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio');
    const voice = formData.get('voice') || 'darth-vader-impression';

    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

    const response = await fetch('https://api.uberduck.ai/speak-synchronous', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token e20366b22280f8ed1aa8a684ac3a1be0914e77b9081968a1631820e447e369db2b295a0a5b70bf267d867dad3540f613'
      },
      body: JSON.stringify({
        voice: voice,
        pace: 1.0,
        audio: audioBase64
      })
    });

    const result = await response.json();
    console.log('Risposta Uberduck:', result);

    if (result.path) {
      return NextResponse.json({ url: `https://storage.googleapis.com/uberduck-audio/${result.path}` });
    } else {
      return NextResponse.json({ error: result.error || 'Errore sconosciuto da Uberduck' }, { status: 500 });
    }
  } catch (err) {
    console.error('Errore server:', err);
    return NextResponse.json({ error: 'Errore server: ' + err.message }, { status: 500 });
  }
}
