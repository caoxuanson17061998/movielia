import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import tmdbApi from '../api/tmdbApi';
import { Card } from '../components/Card';
import { Section } from '../components/Section';
import { Slider } from '../components/slider/Slider';
import { TrailerModal } from '../components/TrailerModal';
import { TrendingHero } from '../components/TrendingHero';
import { Film } from '../interfaces';
import { mergeFilms, tmdbImageSrc } from '../utils';

export const Home = () => {
  const navigate = useNavigate();

  const [trendings, setTrendings] = useState<Film[]>([]);
  const [inTheaters, setInTheaters] = useState<Film[]>([]);
  const [populars, setPopulars] = useState<Film[]>([]);
  const [topRatedTv, setTopRatedTv] = useState<Film[]>([]);
  const [topRatedMovie, setTopRatedMovie] = useState<Film[]>([]);

  const [trailerSrc, setTrailerSrc] = useState('');
  const [title, setTitle] = useState('');

  const playTrailer = async (film: Film) => {
    const trailers = await tmdbApi.getTrailers(film.mediaType, film.id);

    setTrailerSrc(
      `https://www.youtube.com/embed/${trailers[0]?.key}?autoplay=0`
    );
  };

  const goToDetailPage = (film: Film) => {
    navigate(`/${film.mediaType}/${film.id}`);
  };

  const fetchTopRatedMovie = async () => {
    setTopRatedMovie(await (await tmdbApi.getTopRated('movie')).films);
  };

  const fetchTopRatedTv = async () => {
    setTopRatedTv(await (await tmdbApi.getTopRated('tv')).films);
  };

  const fetchPopulars = async () => {
    const movies = await tmdbApi.getPopulars('movie');
    const tvs = await tmdbApi.getPopulars('tv');

    setPopulars(mergeFilms(movies, tvs, 20));
  };

  const fetchInTheaters = async () => {
    setInTheaters(await tmdbApi.getInTheaters());
  };

  const fetchTrending = async () => {
    const movies = await tmdbApi.getTrendings('movie');
    const tvs = await tmdbApi.getTrendings('tv');

    setTrendings(mergeFilms(movies, tvs));
  };

  useEffect(() => {
    fetchTrending();
    fetchInTheaters();
    fetchPopulars();
    fetchTopRatedTv();
    fetchTopRatedMovie();
  }, []);

  return (
    <>
      <TrailerModal
        onHide={() => setTrailerSrc('')}
        src={trailerSrc}
      ></TrailerModal>
      {/* trendings */}
      <Section className="py-0" hidden={trendings.length === 0}>
        <Slider
          className="slick-hero"
          autoplay={true}
          slidesToShow={1}
          slidesToScroll={1}
        >
          {(onSwipe) =>
            trendings.map((film, i) => (
              <TrendingHero
                onPlayTrailer={() => playTrailer(film)}
                onClick={() =>
                  !onSwipe ? navigate(`/${film.mediaType}/${film.id}`) : ''
                }
                film={film}
                key={i}
              ></TrendingHero>
            ))
          }
        </Slider>
      </Section>
      {/* in theaters */}
      <Section title="In Theaters" hidden={inTheaters.length === 0}>
        <Slider isMovieCard={true}>
          {(_) =>
            inTheaters.map((film, i) => (
              <Card
                onClick={() => goToDetailPage(film)}
                title={film.title}
                imageSrc={tmdbImageSrc(film.posterPath)}
                key={i}
              ></Card>
            ))
          }
        </Slider>
      </Section>
      {/* populars */}
      <Section title="What's Popular" hidden={populars.length === 0}>
        <Slider isMovieCard={true}>
          {(_) =>
            populars.map((film, i) => (
              <Card
                onClick={() => goToDetailPage(film)}
                title={film.title}
                imageSrc={tmdbImageSrc(film.posterPath)}
                key={i}
              ></Card>
            ))
          }
        </Slider>
      </Section>
      {/* top rated tv */}
      <Section
        title="Top Rated TV"
        hidden={topRatedTv.length === 0}
        onTitleClick={() => navigate(`/list/top-rated-tv`)}
      >
        <Slider isMovieCard={true}>
          {(_) =>
            topRatedTv.map((film, i) => (
              <Card
                onClick={() => goToDetailPage(film)}
                title={film.title}
                imageSrc={tmdbImageSrc(film.posterPath)}
                key={i}
              ></Card>
            ))
          }
        </Slider>
      </Section>
      {/* to rated movies*/}
      <Section
        hidden={topRatedMovie.length === 0}
        title="Top Rated Movies"
        onTitleClick={() => navigate(`/list/top-rated-movies`)}
      >
        <Slider isMovieCard={true}>
          {(_) =>
            topRatedMovie.map((film, i) => (
              <Card
                onClick={() => goToDetailPage(film)}
                title={film.title}
                imageSrc={tmdbImageSrc(film.posterPath)}
                key={i}
              ></Card>
            ))
          }
        </Slider>
      </Section>
    </>
  );
};
