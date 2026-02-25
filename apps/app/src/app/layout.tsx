import './index.css';
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" 
      data-color-mode="light" 
      data-theme="dark:dark light:light spacing:spacing typography:typography shape:shape-rounder"
    >
      <body>
        {children}
      </body>
    </html>
  );
}
