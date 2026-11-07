import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomScrollbar from "@/components/CustomScrollbar";
import { MockAuthProvider } from "@/lib/mockAuth";
import PageTransition from "@/components/PageTransition";
import DemoNotice from "@/DemoNotice.jsx";
import MobileRedirect from "@/components/MobileRedirect";

export const metadata = {
  title: "Trainity",
  description: "Access free, structured coding courses taught by industry experts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <MobileRedirect>
          <DemoNotice />
          <MockAuthProvider>
            <LenisProvider><PageTransition>{children}</PageTransition></LenisProvider>
          </MockAuthProvider>
          <CustomScrollbar />
        </MobileRedirect>
      </body>
    </html>
  );
}
