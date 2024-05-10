import express from 'express';
import data from '../data.js';
import User from '../models/userModel.js';
import Movie from '../models/movieModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Movie.remove({});
  const createdMovies = await Movie.insertMany(data.movies);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdMovies, createdUsers });
});
export default seedRouter;
