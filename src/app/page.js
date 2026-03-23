
"use client"; 


import LoginPage from "./login/page.js";
import { useAuth } from "./services/AuthContext.js";

export default function Home() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <main style={{ padding: '20px' }}>
      <h1>Bienvenue sur votre Tableau de Bord</h1>
      <p>Vous êtes maintenant authentifié !</p>
      
      <button 
        onClick={logout}
        style={{ padding: '10px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Se déconnecter
      </button>
    </main>
  );
}