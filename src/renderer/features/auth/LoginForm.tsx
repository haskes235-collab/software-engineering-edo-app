import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading, clearError } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError;
        await login(email, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style= {{ color: 'red' }}>{error}</p>}

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                required
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти'}
            </button>

            </form>
    );
}