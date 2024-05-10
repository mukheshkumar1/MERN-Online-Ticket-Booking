import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import User from '../models/userModel.js';
import Movie from '../models/movieModel.js';
import { isAuth, isAdmin } from '../utils.js';

const bookingRouter = express.Router();

bookingRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const bookings = await Booking.find().populate('user', 'name');
    res.send(bookings);
  })
);

bookingRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newBooking = new Booking({
      bookingItems: req.body.bookingItems.map((x) => ({ ...x, movie: x._id })),
      bookingInfo: req.body.bookingInfo,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
     
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const booking = await newBooking.save();
    res.status(201).send({ message: 'New Booking Created',booking });
  })
);

bookingRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: null,
          numBookings: { $sum: 1 },
          totalSales: { $sum: 'Rs.totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          bookings: { $sum: 1 },
          sales: { $sum: 'Rs.totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const movieCategories = await Movie.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, bookings, dailyBookings, movieCategories });
  })
);

bookingRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id });
    res.send(bookings);
  })
);

bookingRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      res.send(booking);
    } else {
      res.status(404).send({ message: 'Booking Not Found' });
    }
  })
);

bookingRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.isDelivered = true;
      booking.deliveredAt = Date.now();
      await booking.save();
      res.send({ message: 'Booking Delivered' });
    } else {
      res.status(404).send({ message: 'Booking Not Found' });
    }
  })
);



bookingRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      await booking.remove();
      res.send({ message: 'Booking Deleted' });
    } else {
      res.status(404).send({ message: 'Booking Not Found' });
    }
  })
);

export default bookingRouter;
