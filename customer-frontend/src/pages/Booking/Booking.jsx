import { getCurrentLocation } from '../../utils/location';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Send,
} from 'lucide-react';
import {
  customerGateway,
} from '../../services/integrations';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import './Booking.css';

export default function Booking() {
  const { workerId } = useParams();
  const nav = useNavigate();

  const [worker, setWorker] = useState(null);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [workerError, setWorkerError] = useState('');
  const [customerLocation, setCustomerLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const handleGetCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError('');

      const location = await getCurrentLocation();

      setCustomerLocation(location);
    } catch (error) {
      console.error('Location error:', error);

      setLocationError(
        'Unable to get your location. Please allow location access.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const [data, setData] = useState({
    service: '',
    date: '',
    time: '',
    location: '',
    address: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadWorker() {
      setLoadingWorker(true);
      setWorkerError('');

      try {
        const result = await customerGateway.getWorker(workerId);

        if (mounted) {
          setWorker(result);
        }
      } catch (err) {
        if (mounted) {
          setWorkerError(
            err.message || 'Unable to load worker details.'
          );
        }
      } finally {
        if (mounted) {
          setLoadingWorker(false);
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

  function update(event) {
    const { name, value } = event.target;

    setData((current) => ({
      ...current,
      [name]: value,
    }));

    setError('');
  }

  async function submit(event) {
    event.preventDefault();

    if (submitting) return;

    if (Object.values(data).some((value) => !value.trim())) {
      setError('Please complete all booking details.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await customerGateway.createBooking({
        workerId,
        service: data.service,
        date: data.date,
        time: data.time,
        location: data.location,
        address: data.address,
        description: data.description,
      });

      nav('/customer/bookings');
    } catch (err) {
      setError(
        err.message || 'Unable to send booking request.'
      );
      setSubmitting(false);
    }
  }

  if (loadingWorker) {
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

  if (workerError) {
    return (
      <>
        <Link className="back-link" to="/customer/search">
          <ArrowLeft size={17} />
          Back to results
        </Link>

        <ErrorState
          title="Unable to load worker"
          description={workerError}
        />
      </>
    );
  }

  const services = Array.isArray(worker?.services)
    ? worker.services
    : worker?.services
      ? [worker.services]
      : [];

  return (
    <div className="booking-page">
      <Link className="back-link" to={`/customer/worker/${workerId}`}>
        <ArrowLeft size={17} />
        Back to worker
      </Link>

      <div className="page-title">
        <p>Request a service</p>
        <h1>Book a worker</h1>
        <span>
          Tell us what you need and choose a suitable time.
        </span>
      </div>

      <div className="booking-layout">
        <aside className="booking-worker-card">
          <div className="booking-worker-avatar">
            {worker?.photoUrl ? (
              <img
                src={worker.photoUrl}
                alt={`${worker.name || 'Worker'} profile`}
              />
            ) : (
              <span>
                {(worker?.name || 'W').charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <p className="booking-worker-label">
              You're booking
            </p>

            <h2>{worker?.name || 'Worker'}</h2>

            {services.length > 0 && (
              <p className="booking-worker-services">
                {services.join(' · ')}
              </p>
            )}
          </div>
        </aside>

        <form className="booking-form" onSubmit={submit}>
          <div className="form-section">
            <div className="form-section-heading">
              <div>
                <h2>Service details</h2>
                <p>Tell the worker what service you need.</p>
              </div>
            </div>

            <label>
              Service
              <span className="required">*</span>

              <select
                name="service"
                value={data.service}
                onChange={update}
                required
              >
                <option value="">Select a service</option>

                {services.length > 0 ? (
                  services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))
                ) : (
                  <>
                    <option>Electrician</option>
                    <option>Plumber</option>
                    <option>Cleaner</option>
                    <option>Mechanic</option>
                  </>
                )}
              </select>
            </label>

            <label>
              Describe your request
              <span className="required">*</span>

              <textarea
                name="description"
                rows="5"
                value={data.description}
                onChange={update}
                placeholder="Tell the worker what you need help with..."
                required
              />

              <small>
                Include useful details such as the problem,
                approximate size, or anything the worker should know.
              </small>
            </label>
          </div>

          <div className="form-section">
            <div className="form-section-heading">
              <div>
                <h2>When do you need it?</h2>
                <p>Choose your preferred date and time.</p>
              </div>
            </div>

            <div className="two-col">
              <label>
                <span className="label-with-icon">
                  <CalendarDays size={16} />
                  Date
                </span>
                <span className="required">*</span>

                <input
                  name="date"
                  type="date"
                  value={data.date}
                  onChange={update}
                  required
                />
              </label>

              <label>
                <span className="label-with-icon">
                  <Clock3 size={16} />
                  Time
                </span>
                <span className="required">*</span>

                <input
                  name="time"
                  type="time"
                  value={data.time}
                  onChange={update}
                  required
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-heading">
              <div>
                <h2>Service location</h2>
                <p>Where should the worker provide the service?</p>
              </div>
            </div>

            <label>
              <span className="label-with-icon">
                <MapPin size={16} />
                Location
              </span>
              <span className="required">*</span>

              <select
                name="location"
                value={data.location}
                onChange={(event) => {
                  update(event);

                  if (event.target.value === 'current') {
                    handleGetCurrentLocation();
                  }
                }}
              >
                <option value="current">
                  Use my current location
                </option>
                <option value="manual">
                  Enter address manually
                </option>
              </select>
            </label>

            <label>
              Address
              <span className="required">*</span>

              <input
                name="address"
                value={data.address}
                onChange={update}
                placeholder="House / street / landmark"
                required
              />

              <small>
                Your address will be shared with the worker for this
                booking.
              </small>
            </label>
          </div>

          {error && (
            <div className="booking-error" role="alert">
              {error}
            </div>
          )}

          <div className="booking-submit">
            <button
              type="submit"
              className="primary"
              disabled={submitting}
            >
              <Send size={18} />

              {submitting
                ? 'Sending request...'
                : 'Send booking request'}
            </button>

            <p>
              You can review your booking from My Bookings after
              submitting the request.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}