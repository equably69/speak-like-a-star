export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="bg-gray-900 border border-red-600 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-2">🎙️ Speak Like a Star</h1>
        <p className="text-sm text-gray-300 mb-6">Registra un vocale di 15 secondi, trasformalo con la voce di una celebrità e condividilo.</p>

        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full mb-4 transition duration-300">
          🎧 Inizia a registrare
        </button>

        <audio controls className="w-full mt-4 hidden" id="audioPlayer">
          <source id="audioSource" type="audio/webm" />
          Il tuo browser non supporta l'elemento audio.
        </audio>

        <p className="text-xs text-gray-500 mt-6">Versione Beta – UI provvisoria</p>
      </div>
    </main>
  );
}
