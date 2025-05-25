import './globals.css';

export const metadata = {
  title: 'Speak Like a Star',
  description: 'App vocale con voci di celebrità',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
