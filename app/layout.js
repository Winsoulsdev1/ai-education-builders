import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "AI Education Builders Program",
  description: "Become one of the first 100 AI Education Builders — join a community of young Africans learning to build AI solutions that will transform education across the continent.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
    }
