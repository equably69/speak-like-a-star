'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordedBlobRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      recordedBlobRef.current = audioBlob;
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);

    setTimeout(() => {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }, 15000); // 15 secondi
  };

  const transformToFener = async () => {
    if (!recordedBlobRef.current) return;
    setLoading(true);
    setError(null);
    setVoiceUrl(null);

    try {
      const formData = new FormData();
      formData.append('audio', recordedBlobRef.current);
      formData.append('voice', 'darth-vader-impression');

      const res = await fetch('/api/uberduck', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      console.log('Uberduck response:', data);

      if (data.url) {
        setVoiceUrl(data.url);
      } else {
        setError('Errore nella risposta da Uberduck.');
      }
    } catch (err) {
      setError('Errore durante la richiesta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="bg-gray-900 border border-red-600 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-2">🎙️ Speak Like a Star</h1>
        <p className="text-sm text-gray-300 mb-6">
          Registra un vocale di 15 secondi, trasformalo con la voce di una celebrità e condividilo.
        </p>

        <button
          className={`${
            isRecording ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          } text-white font-bold py-2 px-4 rounded-full w-full mb-4 transition duration-300`}
          onClick={startRecording}
          disabled={isRecording}
        >
          {isRecording ? '🎙️ Registrazione in corso...' : '🎧 Inizia a registrare'}
        </button>

        {audioUrl && (
          <audio controls className="w-full mt-4" src={audioUrl} />
        )}

        {audioUrl && (
          <button
            onClick={transformToFener}
            className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full w-full disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '🛠️ Trasformazione in corso...' : '🖤 Trasforma in Darth Fener'}
          </button>
        )}

        {error && (
          <p className="text-sm text-red-400 mt-4">{error}</p>
        )}

        {voiceUrl && (
          <audio controls className="w-full mt-4" src={voiceUrl} />
        )}

        <p className="text-xs text-gray-500 mt-6">Versione Beta – Voice cloning attivo</p>
      </div>
    </main>
  );
}
