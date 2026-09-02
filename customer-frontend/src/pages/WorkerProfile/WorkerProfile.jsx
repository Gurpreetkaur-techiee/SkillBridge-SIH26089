import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Star,
} from 'lucide-react';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import { customerGateway } from '../../services/integrations';
import './WorkerProfile.css';

export default function WorkerProfile() {
  const { workerId } = useParams();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadWorker() {
      setLoading(true);
      setError('');

      try {
        const result = await customerGateway.getWorker(workerId);

        if (mounted) {
          setWorker(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load worker details.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (workerId) {
      loadWorker();
    }

    return () => {
      mounted = false;
    };
  }, [workerId]);

  if (loading) {
    return (
      <>
        <Link className="back-link" to="/customer/search">
          <ArrowLeft size={17} />
          Back to results
        </Link>

        <LoadingState />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Link className="back-link" to="/customer/search">
          <ArrowLeft size={17} />
          Back to results
        </Link>

        <ErrorState
          title="Unable to load worker"
          description={error}
        />
      </>
    );
  }

  if (!worker) {
    return (
      <>
        <Link className="back-link" to="/customer/search">
          <ArrowLeft size={17} />
          Back to results
        </Link>

        <EmptyState
          title="Worker not found"
          description="This worker is no longer available in the marketplace."
        />
      </>
    );
  }

  const services = Array.isArray(worker.services)
    ? worker.services
    : worker.services
      ? [worker.services]
      : [];

  const rating = worker.rating ?? 0;
  const reviewCount = worker.reviewCount ?? 0;
  const experience = worker.experience || 'Experience information unavailable';
  const location = worker.location || worker.address || 'Location unavailable';
  const distance = worker.distance || 'Distance unavailable';
  const description =
    worker.description ||
    worker.bio ||
    'No description has been provided by this worker yet.';
  const available = worker.available ?? worker.isAvailable ?? false;

  return (
    <div className="worker-profile-page">
      <Link className="back-link" to="/customer/search">
        <ArrowLeft size={17} />
        Back to results
      </Link>

      <section className="worker-profile-header">
        <div className="worker-profile-avatar">
          {worker.photoUrl ? (
            <img
              src={worker.photoUrl}
              alt={`${worker.name || 'Worker'} profile`}
            />
          ) : (
            <span>
              {(worker.name || 'W').charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="worker-profile-main">
          <div className="worker-profile-name-row">
            <div>
              <p className="profile-eyebrow">Service professional</p>

              <h1>{worker.name || 'Worker'}</h1>

              {services.length > 0 && (
                <p className="worker-services">
                  {services.join(' · ')}
                </p>
              )}
            </div>

            <span
              className={`availability-badge ${
                available ? 'available' : 'unavailable'
              }`}
            >
              <CheckCircle2 size={15} />
              {available ? 'Available' : 'Currently unavailable'}
            </span>
          </div>

          <div className="worker-profile-meta">
            <span>
              <Star size={17} fill="currentColor" />
              {rating || 'New'}
              {reviewCount > 0 && ` (${reviewCount} reviews)`}
            </span>

            <span>
              <MapPin size={17} />
              {distance}
            </span>

            <span>
              <BriefcaseBusiness size={17} />
              {experience}
            </span>
          </div>
        </div>
      </section>

      <div className="worker-profile-grid">
        <main className="worker-profile-content">
          <section className="profile-card">
            <h2>About this worker</h2>
            <p>{description}</p>
          </section>

          <section className="profile-card">
            <h2>Worker details</h2>

            <div className="detail-list">
              <div className="detail-item">
                <MapPin size={19} />
                <div>
                  <span>Location</span>
                  <strong>{location}</strong>
                </div>
              </div>

              <div className="detail-item">
                <BriefcaseBusiness size={19} />
                <div>
                  <span>Experience</span>
                  <strong>{experience}</strong>
                </div>
              </div>

              <div className="detail-item">
                <Clock3 size={19} />
                <div>
                  <span>Availability</span>
                  <strong>
                    {available ? 'Available for bookings' : 'Currently unavailable'}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="profile-card">
            <div className="section-heading">
              <div>
                <h2>Services</h2>
                <p>Services offered by this worker</p>
              </div>
            </div>

            {services.length > 0 ? (
              <div className="service-list">
                {services.map((service) => (
                  <span key={service} className="service-tag">
                    {service}
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted-text">
                Service information is not available yet.
              </p>
            )}
          </section>
        </main>

        <aside className="booking-card">
          <div>
            <p className="booking-eyebrow">Ready to book?</p>
            <h2>Book this worker</h2>
            <p>
              Choose a suitable date and time, then provide the details
              needed for your service.
            </p>
          </div>

          {worker.price && (
            <div className="worker-price">
              <span>Starting from</span>
              <strong>{worker.price}</strong>
            </div>
          )}

          <Link
            className={`book-now-button ${
              !available ? 'disabled' : ''
            }`}
            to={available ? `/customer/book/${worker.id}` : '#'}
            onClick={(event) => {
              if (!available) {
                event.preventDefault();
              }
            }}
          >
            <CalendarDays size={18} />
            {available ? 'Book Now' : 'Currently Unavailable'}
          </Link>

          <p className="booking-note">
            You can review the booking details before confirming.
          </p>
        </aside>
      </div>
    </div>
  );
}