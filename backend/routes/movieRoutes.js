import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Movie from '../models/movieModel.js';

const movieRouter = express.Router();

movieRouter.get('/', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

movieRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newMovie = new Movie({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: 'string',
      year:0,
      price: 0,
      Genre: 'sample Genre',
      TicketsAvailable: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const movie = await newMovie.save();
    res.send({ message: 'Movie Created', movie });
  })
);

movieRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    if (movie) {
     movie.name = req.body.name;
      movie.slug = req.body.slug;
      movie.year = req.body.year;
      movie.price = req.body.price;
      movie.image = req.body.image;
      movie.Genre = req.body.Genre;
      movie.TicketsAvailable = req.body.TicketsAvailable;
      movie.description = req.body.description;
      await movie.save();
      res.send({ message: 'Movie Updated' });
    } else {
      res.status(404).send({ message: 'Movie Not Found' });
    }
  })
);

movieRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      await movie.remove();
      res.send({ message: 'Movie Deleted' });
    } else {
      res.status(404).send({ message: 'Movie Not Found' });
    }
  })
);

movieRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    if (movie) {
      if (movie.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.reduce((a, c) => c.rating + a, 0) /
        movie.reviews.length;
      const updatedMovie = await movie.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedMovie.reviews[updatedMovie.reviews.length - 1],
        numReviews: movie.numReviews,
        rating: movie.rating,
      });
    } else {
      res.status(404).send({ message: 'Movie Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

movieRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const movies = await Movie.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countMovies = await Movie.countDocuments();
    res.send({
      movies,
      countMovies,
      page,
      pages: Math.ceil(countMovies / pageSize),
    });
  })
);

movieRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const Genre = query.Genre || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const booking = query.booking || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const GenreFilter = Genre && Genre !== 'all' ? { Genre } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortBooking =
      booking === 'featured'
        ? { featured: -1 }
        : booking === 'lowest'
        ? { price: 1 }
        : booking === 'highest'
        ? { price: -1 }
        : booking === 'toprated'
        ? { rating: -1 }
        : booking === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const movies = await Movie.find({
      ...queryFilter,
      ...GenreFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortBooking)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countMovies = await Movie.countDocuments({
      ...queryFilter,
      ...GenreFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      movies,
      countMovies,
      page,
      pages: Math.ceil(countMovies / pageSize),
    });
  })
);

movieRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const Genres = await Movie.find().distinct('Genre');
    res.send(Genres);
  })
);

movieRouter.get('/slug/:slug', async (req, res) => {
  const movie = await Movie.findOne({ slug: req.params.slug });
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send({ message: 'Movie Not Found' });
  }
});
movieRouter.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send({ message: 'Movie Not Found' });
  }
});

export default movieRouter;
