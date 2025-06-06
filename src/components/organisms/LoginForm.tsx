// src/components/organisms/LoginForm.tsx
import React, { useState } from 'react';
import styles from './LoginForm.module.scss';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { Link, useNavigate } from 'react-router-dom'; // <<< IMPORTAR useNavigate

// --- Importações do Firebase ---
import { signInWithEmailAndPassword } from 'firebase/auth'; // <<< IMPORTAR FUNÇÃO DE LOGIN
import { auth } from '../../services/firebase'; // <<< IMPORTAR A INSTÂNCIA 'auth'
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // <<< HOOK PARA NAVEGAÇÃO

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      // --- LÓGICA DE LOGIN REAL COM FIREBASE ---
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Se o login for bem-sucedido:
      console.log("Login bem-sucedido!", userCredential.user);
      navigate('/'); // Redireciona o usuário para a página principal (editor)
      // -----------------------------------------
    } catch (firebaseError: any) {
      // --- TRATAMENTO DE ERROS DO FIREBASE ---
      console.error("Erro no login:", firebaseError.code);
      // Mapear códigos de erro do Firebase para mensagens amigáveis
      let errorMessage = "Ocorreu um erro. Tente novamente.";
      switch (firebaseError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Email ou senha inválidos.";
          break;
        case 'auth/invalid-email':
          errorMessage = "O formato do email é inválido.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Acesso bloqueado temporariamente devido a muitas tentativas. Tente novamente mais tarde.";
          break;
      }
      setError(errorMessage);
      // --------------------------------------
    } finally {
      // Garante que o loading seja desativado mesmo que ocorra um erro
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.inputGroup}>
        <Input
          label="Email"
          id="email"
          type="email"
          icon={<FaEnvelope />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading} // Desabilitar enquanto carrega
        />
      </div>
      <div className={styles.inputGroup}>
        <Input
          label="Senha"
          id="password"
          type="password"
          icon={<FaLock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading} // Desabilitar enquanto carrega
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <Text size="small">{error}</Text>
        </div>
      )}

      <Button type="submit" variant="primary" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>

      <div className={styles.footerText}>
        <Text size="small">
          Ainda não tem uma conta?{' '}
          <Link to="/register" className={styles.link}>
            Crie uma aqui.
          </Link>
        </Text>
      </div>
    </form>
  );
};

export default LoginForm;