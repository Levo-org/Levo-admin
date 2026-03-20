import { useEffect } from 'react';
import AppRouter from './router';
import { useAuthStore } from './stores/authStore';

function App() {
  const { restoreSession, isLoading } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AppRouter />;
}

export default App;
