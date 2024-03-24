import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [openingText, setOpeningText] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = useCallback((event) => {
    event.preventDefault(); 
    const newMovie = {
      title,
      openingText,
      releaseDate,
    };
    console.log(newMovie);
    setTitle('');
    setOpeningText('');
    setReleaseDate('');
  }, [title, openingText, releaseDate]);

  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <form onSubmit={addMovieHandler}>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-control">
            <label htmlFor="openingText">Opening Text</label>
            <textarea rows="5" id="openingText" value={openingText} onChange={e => setOpeningText(e.target.value)}></textarea>
          </div>
          <div className="form-control">
            <label htmlFor="releaseDate">Release Date</label>
            <input type="date" id="releaseDate" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
          </div>
          <button type="submit">Add Movie</button>
        </form>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
