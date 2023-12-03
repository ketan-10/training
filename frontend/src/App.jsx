import './App.css';
import { Toaster } from './components/ui/toaster';
import Routes from './routes';
function App() {
  return (
    <>
      <Routes />
      <Toaster />
    </>
  );
}

export default App;
