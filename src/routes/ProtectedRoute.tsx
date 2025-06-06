// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useEditor } from '../contexts/EditorContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser, authLoading } = useEditor();

  // 1. Enquanto o Firebase está a verificar a autenticação, mostramos uma tela de carregamento.
  //    Isso evita que um usuário já logado seja redirecionado para /login brevemente.
  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        {/* Você pode criar um componente de Spinner/Loading mais elaborado depois */}
        Carregando...
      </div>
    );
  }

  // 2. Após a verificação, se não houver um usuário, redireciona para a página de login.
  //    O `replace` na navegação evita que o usuário possa usar o botão "voltar" do navegador
  //    para aceder a uma página protegida.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se houver um usuário autenticado, renderiza a página filha solicitada.
  //    O <Outlet /> é um placeholder do react-router-dom onde a rota filha será renderizada.
  return <Outlet />;
};

export default ProtectedRoute;