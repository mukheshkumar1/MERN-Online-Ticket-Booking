import React from 'react';
import '../index.css'
function TheatreList({ theatre: theatres }) {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>List of Theatres</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px',
        }}
      >
        {theatres.map((theatre, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#f4f4f4',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <img
              src={theatre.imageUrl}
              alt={`${theatre.name} Image`}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '10px 10px 0 0',
              }}
            />
            <h2 style={{ textAlign:'center',fontSize: '1.5em', margin: '10px 0' }}>{theatre.name}</h2>
            <p style={{ margin: '5px 0' }}>Description: {theatre.Description}</p>
            <p style={{ margin: '5px 0' }}>Reviews: {theatre.reviews}</p>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ fontSize: '1.2em', color: '#ffcc00' }}>
                  &#9733;
                </span>
              ))}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
  
const theatresData = [
  {
    name: 'PVR',
    imageUrl: 'https://images.livemint.com/img/2022/12/03/1600x900/PVR-INDIA--0_1670067960789_1670067960789_1670068015878_1670068015878.JPG',
    rating: 4,
    Description: 'PVR Cinemas is a leading cinema chain in India known for its state-of-the-art multiplexes, offering a premium movie-watching experience with advanced technology, luxurious seating, and a diverse range of films.',
    reviews: 150,
  },
  {
    name: 'Cinepolis',
    imageUrl:'https://www.kerala9.com/directory/wp-content/uploads/cache/images/Cinepolis-Centre-Square-Mall-Kochi/Cinepolis-Centre-Square-Mall-Kochi-3334442241.jpg',
    rating: 4,
    Description: 'Cinepolis is a global cinema exhibitor celebrated for its commitment to quality entertainment. With comfortable seating, cutting-edge projection, and a broad film selection, Cinepolis ensures an enjoyable cinematic adventure.',
    reviews: 140,
  },
  {
    name: 'Inox',
    imageUrl: 'https://d18hry5vavz86j.cloudfront.net/TheaterImages/1d95e4f9-4977-49d0-8a82-5b114547b31d.JPG', 
   rating: 4,
   Description: 'INOX Leisure is a prominent multiplex chain delivering world-class cinema experiences. Renowned for its modern amenities and cutting-edge technology, INOX provides a delightful atmosphere for film enthusiasts.',
    reviews: 640,
   
  },
  {
    name: 'AA Screens',
    imageUrl: 'https://m.sakshi.com/sites/default/files/styles/gallerywatermark/public/gallery_images/2023/06/12/Allu-%20Arjun-%20Own-%20Multiplex-%20AAA-%20Cinemas-%20In%20-Ameerpet-%20Inside%20-Photos%20-Goes%20-Viral-12.jpg?itok=m3vxb1wR', // Replace with the actual URL
    rating: 4,
    Description: 'AA Cinemas is recognized for its unique cinematic offerings, providing a blend of mainstream and independent films. With a focus on diverse content, AA Cinemas aims to cater to a wide audience palette. ',
    reviews: 640,
    
  },
  {
    name: 'AMB Cinemas',
    imageUrl: 'https://assets.thehansindia.com/hansindia-bucket/cinemas_1490.jpg', 
    rating: 4,
    Description:'AMB Cinemas is a premium cinema destination offering a luxurious movie-watching experience. With top-notch facilities, gourmet dining options, and a commitment to quality, AMB Cinemas redefines the concept of upscale entertainment.',
    reviews: 1700,
   
  },
  {
    name: 'Qube Cinemas',
    imageUrl: 'https://www.digitalstudiome.com/cloud/2021/08/12/wmQND4Uy-qube-1.jpg', // Replace with the actual URL
    rating: 4.5,
    Description:'Qube Cinemas is a technology-driven cinema chain known for its cutting-edge solutions in film distribution and projection. Embracing innovation, Qube Cinemas contributes significantly to the evolution of the Indian cinema industry.',
    reviews: 505,
    
  },
];


export default function App() {
    return <TheatreList theatre={theatresData} />;
  }