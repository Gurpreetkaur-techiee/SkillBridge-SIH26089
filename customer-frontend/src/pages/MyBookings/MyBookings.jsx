import {
 useState 
} from 'react';

import EmptyState from '../../components/EmptyState/EmptyState';

import {
 useApp 
} from '../../context/AppContext';

import './MyBookings.css';


const bookingStatuses = [
  'all',
  'requested',
  'accepted',
  'onTheWay',
  'inProgress',
  'completed',
  'cancelled',
];


const statusLabels = {

  en: {

    all: 'All',
    requested: 'Requested',
    accepted: 'Accepted',
    onTheWay: 'On the way',
    inProgress: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  
},
  hi: {

    all: 'सभी',
    requested: 'अनुरोधित',
    accepted: 'स्वीकृत',
    onTheWay: 'रास्ते में',
    inProgress: 'काम जारी है',
    completed: 'पूर्ण',
    cancelled: 'रद्द किया गया',
  
},
  pa: {

    all: 'ਸਾਰੇ',
    requested: 'ਬੇਨਤੀ ਕੀਤੀ',
    accepted: 'ਸਵੀਕਾਰਿਆ',
    onTheWay: 'ਰਸਤੇ ਵਿੱਚ',
    inProgress: 'ਕੰਮ ਜਾਰੀ ਹੈ',
    completed: 'ਪੂਰਾ ਹੋਇਆ',
    cancelled: 'ਰੱਦ ਕੀਤਾ ਗਿਆ',
  
},

};


export default function MyBookings() {

  const {
 t, language 
} = useApp();

  const [activeStatus, setActiveStatus] = useState('all');

  const labels = statusLabels[language];


  return (
    <>
      <div className="page-title">
        <p>{
t('pages.appointments')
}</p>
        <h1>{
t('pages.bookings')
}</h1>
      </div>

      <div className="status-tabs" aria-label="Booking status filters">
        {
bookingStatuses.map((status) => (
          <button
            key={
status
}
            type="button"
            onClick={
() => setActiveStatus(status)
}
            className={
activeStatus === status ? 'active' : ''
}
          >
            {
labels[status]
}
          </button>
        ))
}
      </div>

      <EmptyState
        title={
t('pages.noBookings')
}
        description={
t('pages.noBookingsText')
}
      />
    </>
  );


}
