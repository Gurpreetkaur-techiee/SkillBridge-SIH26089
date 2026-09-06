import React, { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'skillbridge_theme';

const goToCustomer = () => {
  window.location.href = '/customer/';
};

const goToWorker = () => {
  window.location.href = '/worker/';
};

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === 'dark') {
      return true;
    }

    if (savedTheme === 'light') {
      return false;
    }

    return false;
  });

  // Apply and persist the shared SkillBridge theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);

    localStorage.setItem(
      THEME_STORAGE_KEY,
      isDark ? 'dark' : 'light'
    );
  }, [isDark]);

  // Listen for theme changes made by Customer or Worker
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key !== THEME_STORAGE_KEY ||
        (event.newValue !== 'dark' && event.newValue !== 'light')
      ) {
        return;
      }

      setIsDark(event.newValue === 'dark');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <main className="page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <section className="container">
        <header className="brand">
          <div className="brand-icon">S</div>

          <span>SkillBridge</span>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setIsDark((previous) => !previous)}
            aria-label={
              isDark
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            title={
              isDark
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
          >
            {isDark ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>
        </header>

        <div className="hero">
          <div className="eyebrow">LOCAL SERVICES, SIMPLIFIED</div>

          <h1>
            Connect skills
            <br />
            with <span>real needs.</span>
          </h1>

          <p className="subtitle">
            SkillBridge connects people who need reliable services with
            skilled professionals ready to help.
          </p>

          <div className="selection-heading">
            <h2>How would you like to use SkillBridge?</h2>
            <p>Choose your role to continue.</p>
          </div>

          <div className="role-grid">
            <button
              type="button"
              className="role-card customer-card"
              onClick={goToCustomer}
            >
              <div className="role-icon customer-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div className="role-content">
                <span className="role-label">CUSTOMER</span>

                <h3>I need a service</h3>

                <p>
                  Find trusted professionals, compare services, and book
                  help for your needs.
                </p>
              </div>

              <span className="arrow">→</span>
            </button>

            <button
              type="button"
              className="role-card worker-card"
              onClick={goToWorker}
            >
              <div className="role-icon worker-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.7 7.7L6.4 20.6a2.1 2.1 0 0 1-3-3l6.7-7a6 6 0 0 1 7.7-7.7l3.1-3.4Z" />
                </svg>
              </div>

              <div className="role-content">
                <span className="role-label">WORKER</span>

                <h3>I offer a service</h3>

                <p>
                  Showcase your skills, receive service requests, and manage
                  your bookings.
                </p>
              </div>

              <span className="arrow">→</span>
            </button>
          </div>
        </div>

        <footer>
          <span>© {new Date().getFullYear()} SkillBridge</span>
          <span>Trusted local services</span>
        </footer>
      </section>
    </main>
  );
}