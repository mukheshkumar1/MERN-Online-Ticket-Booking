import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import '../index.css'

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceBookingScreen() {
  const navigate = useNavigate();
  

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { tinfo, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  tinfo.itemsPrice = round2(
    tinfo.tinfoItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  
  tinfo.taxPrice = round2(0.15 * tinfo.itemsPrice);
  tinfo.totalPrice = tinfo.itemsPrice  + tinfo.taxPrice;

  const placeBookingHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/bookings',
        {
          bookingItems: tinfo.tinfoItems,
          bookingInfo: tinfo.bookingInfo,
          paymentMethod: tinfo.paymentMethod,
          itemsPrice: tinfo.itemsPrice,
         
          taxPrice: tinfo.taxPrice,
          totalPrice: tinfo.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'tinfo_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('tinfoItems');
      navigate(`/booking/${data.booking._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!tinfo.paymentMethod) {
      navigate('/payment');
    }
  }, [tinfo, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Booking</title>
      </Helmet>
      <h1 className="my-3">Preview Booking</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Booking Details</Card.Title>
              <Card.Text>
                 {tinfo.bookingInfo.theatre} <br />
                 {tinfo.bookingInfo.time},
                {tinfo.bookingInfo.country}
              </Card.Text>
              <button type="button" onClick={() => navigate('/bookingInfo')}>Edit</button>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {tinfo.paymentMethod}
              </Card.Text>
              <button type="button" onClick={() => navigate('/payment')}>Edit</button>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Movies</Card.Title>
              <ListGroup variant="flush">
                {tinfo.tinfoItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/movie/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>Rs.{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <button type="button" onClick={() => navigate('/tinfo')}>Edit</button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Booked Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Ticket Price</Col>
                    <Col>Rs.{tinfo.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>Rs.{tinfo.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total Price</strong>
                    </Col>
                    <Col>
                      <strong>Rs.{tinfo.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeBookingHandler}
                      disabled={tinfo.tinfoItems.length === 0}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
