import Header from "../components/Header";
import AppProvider from "../context/AppContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Header />
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
