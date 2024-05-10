import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import '../index.css'
import Movie from "../components/movie";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";


const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, movies: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, movies }, dispatch] = useReducer(reducer, {
    movies: [],
    loading: true,
    error: "",
  });
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState([
    "images/offer.jpg", 
    "images/offer1.jpg",
    "images/offer2.jpg",
    "images/offer3.png",
  ]);
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

 const prevImage = () => {
   setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
 };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000); 

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/movies");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Book My Show</title>
      </Helmet>
      <div className="image-slider">
        <div className="slider-dots">
          {images.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentImage === index ? "active" : ""}`}
              onClick={() => setCurrentImage(index)}
            ></div>
          ))}
        </div>
        <img src={images[currentImage]} alt={`Banner ${currentImage + 1}`} />
      </div>
      <h2>Latest Movies</h2>
      <div className="movies">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {movies.map((movie) => (
              <Col key={movie.slug} sm={6} md={4} lg={3} className="mb-3" style={{ border: '1px solid #ccc', padding: '10px' }}>
                <Movie movie={movie}></Movie>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;