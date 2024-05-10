import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Movie(props) {
  const { movie } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    tinfo: { tinfoItems },
  } = state;

  const addTotinfoHandler = async (item) => {
    const existItem = tinfoItems.find((x) => x._id === movie._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/movies/${item._id}`);
    if (data.TicketsAvailable < quantity) {
      window.alert('Sorry.Tickets UnAvailable');
      return;
    }
    ctxDispatch({
      type: 'tinfo_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/movie/${movie.slug}`}>
        <img src={movie.image} className="card-img-top" alt={movie.name} />
      </Link>
      <Card.Body>
        <Link to={`/movie/${movie.slug}`}>
          <Card.Title>{movie.name}</Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
}
export default Movie;
