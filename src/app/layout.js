import './globals.css';
import GlowCursor from '@/components/GlowCursor';

export const metadata = {
  title: 'Nikhil Rai | Software Engineer & Competitive Programmer',
  description: 'Portfolio of Nikhil Rai, a B.Tech Computer Science student specializing in building scalable backend systems, event-driven architectures, and modern web products. LeetCode 2000+ rating.',
  keywords: [
    'Nikhil Rai',
    'Software Developer',
    'Competitive Programmer',
    'LeetCode 2000',
    'Software Engineer Portfolio',
    'Next.js Portfolio',
    'Node.js',
    'PostgreSQL',
    'Convex'
  ],
  authors: [{ name: 'Nikhil Rai', url: 'https://github.com/Nikhil2005Rai' }],
  creator: 'Nikhil Rai',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
