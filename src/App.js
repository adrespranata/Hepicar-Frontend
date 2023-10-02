import ServiceList from "./components/ServiceList";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <ServiceList />
      </main>
    </ThemeProvider>
  );
}

export default App;
