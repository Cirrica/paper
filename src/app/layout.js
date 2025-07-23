import './globals.css';

export const metadata = {
  title: 'Paper App',
  description: 'Cirrica Paper Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
