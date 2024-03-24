import React, { useState, useRef } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const retryTimeout = useRef(null);

  async function fetchMoviesHandler() {
    if (!retrying) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/film/');
      if (!response.ok) {
        throw new Error('Something went wrong ....Retrying');
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
      clearTimeout(retryTimeout.current);
      setRetrying(false);
    } catch (error) {
      setError(error.message);
      retryTimeout.current = setTimeout(fetchMoviesHandler, 5000);
      setRetrying(true);
    }
    setIsLoading(false);
  }

  function cancelRetryHandler() {
    clearTimeout(retryTimeout.current);
    setIsLoading(false);
    setRetrying(false);
    setError('Retry canceled by user.');
  }

  let content = <p>Something went wrong ....Retrying</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error && !retrying) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading.....</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {retrying && <button onClick={cancelRetryHandler}>Cancel Retry</button>}
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
