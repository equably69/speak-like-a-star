'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
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
          <audio controls className="w-full mt-4" src={audioUrl}>
            Il tuo browser non supporta l'elemento audio.
          </audio>
        )}

        <p className="text-xs text-gray-500 mt-6">Versione Beta – Registrazione attiva</p>
      </div>
    </main>
  );
}
