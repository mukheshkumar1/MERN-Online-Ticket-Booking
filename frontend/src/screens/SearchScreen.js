import React, { useEffect, useReducer, useState } from 'react';
import { Link,useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Movie from '../components/movie';
import Rating from '../components/Rating';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import '../index.css'
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        movies: action.payload.movies,
        page: action.payload.page,
        pages: action.payload.pages,
        countMovies: action.payload.countMovies,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
const prices = [
  {
    name: 'Rs.100 to Rs.250',
    value: '100-250',
  },
  {
    name: 'Rs.250 to Rs.500',
    value: '250-500',
  },
  {
    name: 'Rs.500 and Above',
    value: '500-1000',
  },
];

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];




export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); 
  const Genre = sp.get('Genre') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const booking = sp.get('booking') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, movies, pages, countMovies }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/movies/search?page=${page}&query=${query}&Genre=${Genre}&price=${price}&rating=${rating}&booking=${booking}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        console.error(err); // Log the error for debugging
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [Genre, error, booking, page, price, query, rating]);

  const [ Genres, setGenres] = useState([]);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await axios.get(`/api/movies/categories`);
        setGenres(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchGenres();
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterGenre = filter.Genre || Genre;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortBooking = filter.booking || booking;
    return `${
      skipPathname ? '' : '/search?'
    }Genre=${filterGenre}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&booking=${sortBooking}&page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>Search Movies</title>
      </Helmet>
      <Row>
        <Col md={3}>
        <h3>Sort By</h3>
          <div>
            <h4>Genre</h4>
            <ul>
              <li>
                <Link
                  className={'all' === Genre ? 'text-bold' : ''}
                  to={getFilterUrl({ Genre: 'all' })}
                >
                  Any
                </Link>
              </li>
              {Genres.map((c) => (
                <li key={c}>
                  <Link
                    className={c === Genre ? 'text-bold' : ''}
                    to={getFilterUrl({ Genre: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Price</h4>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-bold' : ''}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Rating caption={' & up'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
          
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countMovies === 0 ? 'No' : countMovies} Results
                    {query !== 'all' && ' : ' + query}
                    {Genre !== 'all' && ' : ' + Genre}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    Genre !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
        
              </Row>
              {movies && movies.length === 0 && (
  <MessageBox>No Movie Found</MessageBox>
)}

              <Row>
                {movies.map((movie) => (
                  <Col sm={6} lg={4} className="mb-3" key={movie._id}>
                    <Movie movie={movie}></Movie>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: '/search',
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}