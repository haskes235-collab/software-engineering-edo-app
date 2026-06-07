// src/renderer/features/auth/RegisterForm.tsx
import { useState } from 'react';
import { useAuth } from './AuthContext';   // ← теперь должен работать

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    if (password.length < 6) {
      alert('Пароль должен быть минимум 6 символов');
      return;
    }

    await register(name.trim(), email.trim(), password);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', padding: '20px' }}>
      <h2>Регистрация</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Повторите пароль"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ width: '100%', padding: '12px', fontSize: '16px' }}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
}