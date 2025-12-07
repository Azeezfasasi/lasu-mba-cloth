import '../globals.css'
import MainHeader from '@/components/home-component/MainHeader'
import Footer from '@/components/home-component/Footer'
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: 'Lasu Post Graduate Students\' Association',
  description: 'Empowering Postgraduate Students at Lagos State University',
  icons: {
    icon: '/morad.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="site-main-header sticky top-0 z-50">
            <MainHeader />
          </div>
          <main>{children}</main>
          <div className="site-main-header">
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
