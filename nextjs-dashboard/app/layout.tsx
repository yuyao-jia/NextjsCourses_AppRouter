import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    {/* Add the font to the body element to apply it throughout the application.
    Tailwind antialiased class is added to smooth out the font.*/}
      <body className={'${inter.className} antialiased'}>{children}</body>
    </html>
  );
}
