import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
   
  },
  {
    timestamps: true,
  }
);

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    year: { type:Number,required:true},
    Genre: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    TicketsAvailable: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
