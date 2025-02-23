import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from './signin.module.scss';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Attempting sign in with:', { email });

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('Sign in result:', result);

      if (result?.ok) {
        router.push('/tasks');
      } else {
        console.error('Login failed:', result?.error);
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Sign In</h1>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              defaultValue="test@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
              defaultValue="password123"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
} 