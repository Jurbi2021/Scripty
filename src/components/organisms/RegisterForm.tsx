// src/components/organisms/RegisterForm.tsx
import React, { useState } from 'react';
// Reutilizaremos os estilos do LoginForm para manter a consistência
import styles from './LoginForm.module.scss'; 
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

// --- Importações do Firebase ---
import { createUserWithEmailAndPassword } from 'firebase/auth'; // <<< IMPORTAR FUNÇÃO DE REGISTO
import { auth } from '../../services/firebase'; // <<< IMPORTAR A INSTÂNCIA 'auth'

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      // --- LÓGICA DE REGISTO REAL COM FIREBASE ---
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Se o registo for bem-sucedido, o Firebase já faz o login automático do novo usuário.
      console.log("Registo e login bem-sucedidos!", userCredential.user);
      navigate('/'); // Redireciona o usuário para a página principal (editor)
      // -----------------------------------------
    } catch (firebaseError: any) {
      // --- TRATAMENTO DE ERROS DO FIREBASE ---
      console.error("Erro no registo:", firebaseError.code);
      let errorMessage = "Ocorreu um erro ao criar a conta. Tente novamente.";
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Este email já está a ser utilizado por outra conta.";
          break;
        case 'auth/invalid-email':
          errorMessage = "O formato do email é inválido.";
          break;
        case 'auth/weak-password':
          errorMessage = "A senha é muito fraca. Ela deve ter pelo menos 6 caracteres.";
          break;
      }
      setError(errorMessage);
      // --------------------------------------
    } finally {
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      <div className={styles.inputGroup}>
        <Input
          label="Confirmar Senha"
          id="confirmPassword"
          type="password"
          icon={<FaLock />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <Text size="small">{error}</Text>
        </div>
      )}

      <Button type="submit" variant="primary" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'A criar conta...' : 'Criar Conta'}
      </Button>

      <div className={styles.footerText}>
        <Text size="small">
          Já tem uma conta?{' '}
          <Link to="/login" className={styles.link}>
            Faça login.
          </Link>
        </Text>
      </div>
    </form>
  );
};

export default RegisterForm;