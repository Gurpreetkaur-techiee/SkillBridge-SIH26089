import { useState } from 'react';
import {
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import { Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase';

import './Login.css';

export default function Login() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem('SkillBridge-remember-me') === 'true'
  );
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Enter your email and password.');
    }

    try {
      setLoading(true);

      // Firebase Authentication Login
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save Remember Me preference
      localStorage.setItem(
        'SkillBridge-remember-me',
        rememberMe
      );

      // Redirect to Customer Dashboard
      nav('/customer');

    } catch (err) {
      console.error(err);

      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Login failed. Please try again.');
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>

        <Link className="auth-brand" to="/customer">
          Skill<span>Build</span>
        </Link>

        <h1>Welcome back</h1>

        <p className="intro">
          Sign in to book reliable local help.
        </p>

        {params.get('registered') && (
          <p className="success-message">
            Registration successful. You can now log in.
          </p>
        )}

        {error && (
          <p className="error-state">
            {error}
          </p>
        )}

        <label>
          Email address

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label>
          Password

          <span className="password-field">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label="Show password"
            >
              {show ? <EyeOff /> : <Eye />}
            </button>
          </span>
        </label>

        <div className="form-row">

          <label className="check">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
            />
            Remember me
          </label>

          <Link to="/forgot-password">
            Forgot password?
          </Link>

        </div>

        <button
          className="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="auth-footer">
          Don’t have an account?{' '}
          <Link to="/signup">
            Create account
          </Link>
        </p>

      </form>
    </div>
  );
}