import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CircleHelp,
  LogOut,
  MapPinned,
  Palette,
  ShieldCheck,
  UserRound
} from 'lucide-react';

import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';

import { useApp } from '../../context/AppContext';
import './Profile.css';

export default function Profile() {
  const { theme, language, setTheme, t } = useApp();
  const navigate = useNavigate();

  const [notice, setNotice] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.log('No user logged in');
        return;
      }

      try {
        const userDoc = await getDoc(
          doc(db, 'users', user.uid)
        );

        if (userDoc.exists()) {
          setProfile(userDoc.data());
        } else {
          console.log('User profile not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const action = (message) => setNotice(message);

  async function logout() {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <>
      <div className="page-title">
        <p>{t('pages.account')}</p>
        <h1>{t('pages.profile')}</h1>
      </div>

      <section className="account-card">
        <UserRound />

        <div>
          <h2>
            {profile?.name || t('pages.account')}
          </h2>

          <p>
            {profile?.email ||
              'Your name, contact details and saved locations will appear here after the account integration is connected.'}
          </p>

          {profile?.phone && (
            <p>{profile.phone}</p>
          )}
        </div>
      </section>

      {notice && (
        <p className="settings-notice">
          {notice}
        </p>
      )}

      <section className="settings-grid">

        <article>
          <MapPinned />

          <div>
            <h2>{t('pages.savedLocations')}</h2>
            <p>
              Add and manage home, work, and other service addresses.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              action(
                'Saved locations will be available when your customer account is connected.'
              )
            }
          >
            {t('pages.manage')}
          </button>
        </article>

        <article>
          <Palette />

          <div>
            <h2>{t('pages.appearance')}</h2>

            <p>
              {theme === 'dark' ? 'Dark' : 'Light'} mode ·{' '}
              {language === 'en'
                ? 'English'
                : language === 'hi'
                ? 'हिंदी'
                : 'ਪੰਜਾਬੀ'}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setTheme(
                theme === 'dark' ? 'light' : 'dark'
              )
            }
          >
            {t('pages.toggleTheme')}
          </button>
        </article>

        <article>
          <ShieldCheck />

          <div>
            <h2>{t('pages.privacy')}</h2>
            <p>
              Control account access and data preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              action(
                'Privacy controls will be connected to your account settings.'
              )
            }
          >
            {t('pages.view')}
          </button>
        </article>

        <article>
          <CircleHelp />

          <div>
            <h2>{t('pages.help')}</h2>
            <p>
              Find answers or get support with a booking.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              action(
                'Support options will appear here when the service desk is connected.'
              )
            }
          >
            {t('pages.getHelp')}
          </button>
        </article>

      </section>

      <div className="profile-links">
        <Link to="/customer/bookings">
          {t('pages.bookingHistory')}
        </Link>

        <button onClick={logout}>
          <LogOut size={17} />
          {t('pages.logout')}
        </button>
      </div>
    </>
  );
}