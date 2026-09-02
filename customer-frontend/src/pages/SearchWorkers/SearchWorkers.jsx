import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Star, MapPin } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';

import EmptyState from '../../components/EmptyState/EmptyState';
import { useApp } from '../../context/AppContext';
import { db } from '../../firebase';

import './SearchWorkers.css';

const filterCopy = {
  en: {
    hint: 'Search by service or worker name',
    close: 'Close filters',
    service: 'Service',
    all: 'All services',
    availability: 'Availability',
    anyAvailability: 'Any availability',
    today: 'Available today',
    week: 'Available this week',
    rating: 'Minimum rating',
    anyRating: 'Any rating',
    above4: '4★ and above',
    above3: '3★ and above',
    distance: 'Distance',
    anyDistance: 'Any distance',
    within3: 'Within 3 km',
    within10: 'Within 10 km',
    within20: 'Within 20 km',
    sort: 'Sort by',
    recommended: 'Recommended',
    highest: 'Highest rated',
    nearest: 'Nearest first',
  },

  hi: {
    hint: 'सेवा या कामगार के नाम से खोजें',
    close: 'फ़िल्टर बंद करें',
    service: 'सेवा',
    all: 'सभी सेवाएँ',
    availability: 'उपलब्धता',
    anyAvailability: 'कोई भी उपलब्धता',
    today: 'आज उपलब्ध',
    week: 'इस सप्ताह उपलब्ध',
    rating: 'न्यूनतम रेटिंग',
    anyRating: 'कोई भी रेटिंग',
    above4: '4★ और अधिक',
    above3: '3★ और अधिक',
    distance: 'दूरी',
    anyDistance: 'कोई भी दूरी',
    within3: '3 किमी के भीतर',
    within10: '10 किमी के भीतर',
    within20: '20 किमी के भीतर',
    sort: 'क्रमबद्ध करें',
    recommended: 'सुझाए गए',
    highest: 'सबसे अधिक रेटेड',
    nearest: 'पहले निकटतम',
  },

  pa: {
    hint: 'ਸੇਵਾ ਜਾਂ ਕਾਮੇ ਦੇ ਨਾਮ ਨਾਲ ਖੋਜੋ',
    close: 'ਫਿਲਟਰ ਬੰਦ ਕਰੋ',
    service: 'ਸੇਵਾ',
    all: 'ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ',
    availability: 'ਉਪਲਬਧਤਾ',
    anyAvailability: 'ਕੋਈ ਵੀ ਉਪਲਬਧਤਾ',
    today: 'ਅੱਜ ਉਪਲਬਧ',
    week: 'ਇਸ ਹਫ਼ਤੇ ਉਪਲਬਧ',
    rating: 'ਘੱਟੋ-ਘੱਟ ਰੇਟਿੰਗ',
    anyRating: 'ਕੋਈ ਵੀ ਰੇਟਿੰਗ',
    above4: '4★ ਅਤੇ ਵੱਧ',
    above3: '3★ ਅਤੇ ਵੱਧ',
    distance: 'ਦੂਰੀ',
    anyDistance: 'ਕੋਈ ਵੀ ਦੂਰੀ',
    within3: '3 ਕਿ.ਮੀ. ਦੇ ਅੰਦਰ',
    within10: '10 ਕਿ.ਮੀ. ਦੇ ਅੰਦਰ',
    within20: '20 ਕਿ.ਮੀ. ਦੇ ਅੰਦਰ',
    sort: 'ਕ੍ਰਮਬੱਧ ਕਰੋ',
    recommended: 'ਸਿਫਾਰਸ਼ੀ',
    highest: 'ਸਭ ਤੋਂ ਵੱਧ ਰੇਟ ਕੀਤੇ',
    nearest: 'ਸਭ ਤੋਂ ਨੇੜੇ ਪਹਿਲਾਂ',
  },
};

const serviceOptions = [
  'Electrician',
  'Plumber',
  'Home Cleaner',
  'Carpenter',
  'Painter',
];

export default function SearchWorkers() {
  const { t, language } = useApp();
  const text = filterCopy[language];

  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const [query, setQuery] = useState(
    searchParams.get('q') || ''
  );

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    service: initialService,
    availability: '',
    rating: '',
    distance: '',
    sort: '',
  });

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const snapshot = await getDocs(
          collection(db, 'workers')
        );

        const workerData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWorkers(workerData);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkers();
  }, []);

  function updateFilter(event) {
    const { name, value } = event.target;

    setFilters({
      ...filters,
      [name]: value,
    });
  }

  let filteredWorkers = workers.filter((worker) => {
    const searchText = query.toLowerCase();

    const matchesSearch =
      worker.name?.toLowerCase().includes(searchText) ||
      worker.profession?.toLowerCase().includes(searchText);

    const matchesService =
      !filters.service ||
      worker.profession === filters.service;

    const matchesAvailability =
      !filters.availability ||
      worker.available === true;

    const matchesRating =
      !filters.rating ||
      Number(worker.rating) >= Number(filters.rating);

    return (
      matchesSearch &&
      matchesService &&
      matchesAvailability &&
      matchesRating
    );
  });

  if (filters.sort === 'rating') {
    filteredWorkers = [...filteredWorkers].sort(
      (a, b) => Number(b.rating) - Number(a.rating)
    );
  }

  return (
    <>
      <div className="page-title">
        <p>{t('search.eyebrow')}</p>
        <h1>{t('search.title')}</h1>
      </div>

      <div className="filter-bar">
        <label className="search-input">
          <Search size={19} />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
          />
        </label>

        <div className="search-actions">
          <p>
            {query ? `“${query}”` : text.hint}
          </p>

          <button
            type="button"
            className="filter-button"
            onClick={() =>
              setShowFilters(!showFilters)
            }
            aria-expanded={showFilters}
          >
            {showFilters ? (
              <X size={17} />
            ) : (
              <SlidersHorizontal size={17} />
            )}

            {showFilters
              ? text.close
              : t('search.filters')}
          </button>
        </div>

        {showFilters && (
          <div className="filter-options">

            <label>
              {text.service}

              <select
                name="service"
                value={filters.service}
                onChange={updateFilter}
              >
                <option value="">
                  {text.all}
                </option>

                {serviceOptions.map((service) => (
                  <option
                    key={service}
                    value={service}
                  >
                    {service}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {text.availability}

              <select
                name="availability"
                value={filters.availability}
                onChange={updateFilter}
              >
                <option value="">
                  {text.anyAvailability}
                </option>

                <option value="today">
                  {text.today}
                </option>

                <option value="week">
                  {text.week}
                </option>
              </select>
            </label>

            <label>
              {text.rating}

              <select
                name="rating"
                value={filters.rating}
                onChange={updateFilter}
              >
                <option value="">
                  {text.anyRating}
                </option>

                <option value="4">
                  {text.above4}
                </option>

                <option value="3">
                  {text.above3}
                </option>
              </select>
            </label>

            <label>
              {text.sort}

              <select
                name="sort"
                value={filters.sort}
                onChange={updateFilter}
              >
                <option value="">
                  {text.recommended}
                </option>

                <option value="rating">
                  {text.highest}
                </option>
              </select>
            </label>

          </div>
        )}
      </div>

      {filters.service && (
        <p className="active-filter">
          {t('search.showing')}{' '}
          <strong>{filters.service}</strong>
        </p>
      )}

      <div className="map-placeholder">
        <strong>{t('search.map')}</strong>
        <span>{t('search.mapDescription')}</span>
      </div>

      {loading && (
        <p>Loading workers...</p>
      )}

      {!loading && filteredWorkers.length === 0 && (
        <EmptyState
          title={t('search.empty')}
          description={t('search.emptyDescription')}
        />
      )}

      {!loading && filteredWorkers.length > 0 && (
        <div className="workers-list">

          {filteredWorkers.map((worker) => (
            <div
              className="worker-card"
              key={worker.id}
            >

              <div className="worker-info">

                <h2>{worker.name}</h2>

                <p className="worker-profession">
                  {worker.profession}
                </p>

                <p>
                  <MapPin size={16} />
                  {worker.location}
                </p>

                <p>
                  Experience: {worker.experience} years
                </p>

              </div>

              <div className="worker-rating">

                <p>
                  <Star size={17} />
                  {worker.rating}
                  {' '}({worker.reviews} reviews)
                </p>

                <p>
                  {worker.available
                    ? '🟢 Available'
                    : '🔴 Currently unavailable'}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}
    </>
  );
}