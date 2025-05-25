import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const audioBlob = formData.get('audio');
  const voice = formData.get('voice') || 'darth-vader-impression';

  const audioBuffer = await audioBlob.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString('base64');

  const response = await fetch('https://api.uberduck.ai/speak-synchronous', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Token INSERISCI_LA_TUA_API_KEY_QUI'
    },
    body: JSON.stringify({
      voice,
      pace: 1.0,
      audio: base64Audio
    })
  });

  const result = await response.json();

  if (result.path) {
    return NextResponse.json({ url: `https://storage.googleapis.com/uberduck-audio/${result.path}` });
  } else {
    return NextResponse.json({ error: 'Errore nella generazione audio' }, { status: 500 });
  }
}

