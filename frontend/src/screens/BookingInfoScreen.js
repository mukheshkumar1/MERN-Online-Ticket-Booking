import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import '../index.css'
export default function BookingInfoScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    tinfo: { bookingInfo },
  } = state;
  const [theatre, setTheatre] = useState(bookingInfo.theatre || '');
  const [time, setTime] = useState(bookingInfo.time || '');
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/bookingInfo');
    }
  }, [userInfo, navigate]);
  const [country, setCountry] = useState(bookingInfo.country || '');
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_BOOKING_INFO',
      payload: {
        theatre,
        time,
        country,
      },
    });
    localStorage.setItem(
      'bookingInfo',
      JSON.stringify({
        theatre,
        time,
        country,
      })
    );
    navigate('/payment');
  };

  useEffect(() => {
    ctxDispatch({ type: 'SET_FULLBOX_OFF' });
  }, [ctxDispatch, fullBox]);

  return (
    <div>
      <Helmet>
        <title>Booking Details</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Booking Details</h1>
        <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="country">
    <Form.Label>Location</Form.Label>
    <Form.Select
       value={country}
        onChange={(e) => setCountry(e.target.value)}
       required
    >
      <option value="" disabled>
      Select City
      </option>
      <option value="Banglore">Banglore</option>
      <option value="Chennai">Chennai</option>
      <option value="Hyderabad">Hyderabad</option>
      <option value="Pune">Pune</option>
      <option value="Delhi">Delhi</option>
      <option value="Mumbai">Mumbai</option>
    </Form.Select>
    
    <Form.Label>Theatre</Form.Label>
    <Form.Select
       value={theatre}
        onChange={(e) => setTheatre(e.target.value)}
       required
    >
      <option value="" disabled>
      Choose Theatre
      </option>
      <option value="Pvr">PVR</option>
      <option value="Cinepolis">Cinepolis</option>
      <option value="INOX">Inox</option>
      <option value="AAScreens">AA screens</option>
      <option value="AMB">AMB Cinemas</option>
      <option value="Qube Cinemas">Qube Cinemas</option>
    </Form.Select>

    <Form.Label>Time</Form.Label>
    <Form.Select
       value={time}
        onChange={(e) => setTime(e.target.value)}
       required
    >
      <option value="" disabled>
      Choose Time
      </option>
      <option value="08:30">08:30</option>
      <option value="11:00">11:00</option>
      <option value="12:45">12:45</option>
      <option value="02:15">02:15</option>
      <option value="05:30">05:30</option>
      <option value="09:00">09:00</option>
    </Form.Select>
    </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
