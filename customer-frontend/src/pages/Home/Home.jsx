import {
 useState 
} from 'react';

import {
 Link, useNavigate 
} from 'react-router-dom';

import {
 ArrowRight, MapPin, Search 
} from 'lucide-react';

import electricianImage from '../../assets/services/electrician.png';

import plumberImage from '../../assets/services/plumber.png';

import cleanerImage from '../../assets/services/cleaner.png';

import mechanicImage from '../../assets/services/mechanic.png';

import {
 useApp 
} from '../../context/AppContext';

import EmptyState from '../../components/EmptyState/EmptyState';

import './Home.css';


const services = [
  {
 name: 'Electrician', image: electricianImage 
},
  {
 name: 'Plumber', image: plumberImage 
},
  {
 name: 'Cleaner', image: cleanerImage 
},
  {
 name: 'Mechanic', image: mechanicImage 
},
];


export default function Home() {

  const {
 t 
} = useApp();

  const navigate = useNavigate();

  const [query, setQuery] = useState('');


  function handleSearch(event) {

    event.preventDefault();

    const searchPath = query.trim()
      ? `/customer/search?q=${
encodeURIComponent(query.trim())
}`
      : '/customer/search';


    navigate(searchPath);

  
}

  return (
    <>
      <section className="hero">
        <p>{
t('home.greeting')
}</p>
        <h1>{
t('home.question')
}</h1>
        <form className="search-launch" onSubmit={
handleSearch
}>
          <Search size={
19
} />
          <input
            value={
query
}
            onChange={
(event) => setQuery(event.target.value)
}
            placeholder={
t('search.placeholder')
}
            aria-label={
t('search.placeholder')
}
          />
        </form>
      </section>

      <section>
        <div className="section-head">
          <h2>{
t('home.popular')
}</h2>
        </div>
        <div className="service-grid">
          {
services.map(({
 name, image 
}) => (
            <Link
              key={
name
}
              to={
`/customer/search?service=${
name
}`
}
              className="service-tile"
            >
              <img className="service-illustration" src={
image
} alt="" />
              <div className="service-footer">
                <span className="service-label">
                  {
t(`services.${
name.toLowerCase()
}`)
}
                </span>
                <ArrowRight size={
19
} />
              </div>
            </Link>
          ))
}
        </div>
      </section>

      <section className="location-banner">
        <MapPin />
        <div>
          <strong>{
t('location.title')
}</strong>
          <p>{
t('location.description')
}</p>
        </div>
        <button type="button">{
t('location.use')
}</button>
      </section>

      <section>
        <div className="section-head">
          <h2>{
t('home.nearby')
}</h2>
          <Link to="/customer/search">{
t('common.browse')
}</Link>
        </div>
        <EmptyState
          title={
t('home.noWorkers')
}
          description={
t('home.noWorkersDescription')
}
        />
      </section>
    </>
  );


}
