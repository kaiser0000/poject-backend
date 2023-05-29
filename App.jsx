import React, { useState } from 'react';
import axios from 'axios';
import ModalVideo from 'react-modal-video';
import { Container, Row, Col, Form, FormGroup, Input, Button, Card, CardImg, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import './App.css';
import 'react-modal-video/scss/modal-video.scss';

const API_KEY = '9da577f2';
const YOUR_API_KEY = 'AIzaSyATs2X7lax726iwYWLBkhpDbo2stpsdSOI';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [videoId, setVideoId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://www.omdbapi.com/?t=${searchTerm}&apikey=${API_KEY}&plot=full`);
      if (response.data.Response === 'False') {
        throw new Error(response.data.Error);
      }
      const fullMovie = {
        title: response.data.Title,
        year: response.data.Year,
        rated: response.data.Rated,
        released: response.data.Released,
        runtime: response.data.Runtime,
        genre: response.data.Genre,
        director: response.data.Director,
        writer: response.data.Writer,
        actors: response.data.Actors,
        plot: response.data.Plot,
        language: response.data.Language,
        country: response.data.Country,
        awards: response.data.Awards,
        poster: response.data.Poster,
        ratings: response.data.Ratings,
        metascore: response.data.Metascore,
        imdbRating: response.data.imdbRating,
        imdbVotes: response.data.imdbVotes,
        imdbID: response.data.imdbID,
        type: response.data.Type,
        dvd: response.data.DVD,
        boxOffice: response.data.BoxOffice,
        production: response.data.Production,
        website: response.data.Website,
        response: response.data.Response,
      };
      setMovies([fullMovie]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openModal = async (movie) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movie.title}+trailer&key=${YOUR_API_KEY}`
      );
      setVideoId(response.data.items[0].id.videoId);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <header>
        <Container>
          <h1>The Movie Database</h1>
        </Container>
      </header>
      <Container className="mt-4">
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input type="text" placeholder="Enter a movie title" value={searchTerm} onChange={handleChange} />
              </FormGroup>
              <Button color="primary" type="submit">
                Search
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="mt-4">
          {movies.map((movie) => (
            <Col md="12" key={movie.imdbID}>
              <Card>
                <CardBody className="CardBody">
                  <CardTitle className="CardTitle">
                    {movie.title} ({movie.year})
                  </CardTitle>
                  <CardSubtitle>
                    <h2>
                      {movie.rated} | {movie.runtime} | {movie.genre}
                    </h2>
                  </CardSubtitle>
                  <hr />
                  <div className="d-flex head">
                    <CardImg src={movie.poster} alt={movie.title} style={{ maxWidth: '300px', marginRight: '25px' }} />
                    <div>
                      <p>
                        <strong>Director:</strong> {movie.director}
                      </p>
                      <p>
                        <strong>Writer:</strong> {movie.writer}
                      </p>
                      <p>
                        <strong>Actors:</strong> {movie.actors}
                      </p>
                      <p>
                        <strong>Plot:</strong> {movie.plot}
                      </p>
                      <p>
                        <strong>Language:</strong> {movie.language}
                      </p>
                      <p>
                        <strong>Country:</strong> {movie.country}
                      </p>
                      <p>
                        <strong>Awards:</strong> {movie.awards}
                      </p>
                      {movie.ratings.map((rating) => (
                        <p className="rating" key={rating.Source}>
                          <strong>{rating.Source}:</strong> <span>{rating.Value}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <Button color="primary" className="mt-2" onClick={() => openModal(movie)}>
                    Watch trailer
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <ModalVideo channel="youtube" isOpen={isOpen} videoId={videoId} onClose={() => setIsOpen(false)} />
    </div>
  );
}

export default App;
