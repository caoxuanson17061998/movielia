import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import tmdbApi from '../api/tmdbApi';
import { Film } from '../interfaces';
import { tmdbImageSrc } from '../utils';
import { useGlobalContext } from './AppContainer';
import { Image } from './Image';

interface Props {
  keyword: string;
  goToSearchPage: Function;
}

export const SearchResult = (props: Props) => {
  const [items, setItems] = useState<Film[]>([]);

  const globalContext = useGlobalContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      if (!props.keyword) return;

      const res = await tmdbApi.search(props.keyword);
      setItems(res.films);
    };
    fetch();
  }, [props.keyword]);

  return (
    <div
      className="
            absolute
            top-[48px]
            left-0
            right-0
            rounded-md
            bg-header
            shadow-lg
        "
    >
      <div className="max-h-[480px] scrollbar scrollbar-thumb-primary scrollbar-track-header">
        {items.slice(0, 5).map((film, i) => (
          <div
            key={i}
            className="flex items-start p-1.5 hover:bg-primary cursor-pointer my-1.5"
            onClick={() => navigate(`/${film.mediaType}/${film.id}`)}
          >
            {/* image */}
            <Image
              src={tmdbImageSrc(film.posterPath)}
              alt={film.title}
              className="h-[72px] min-w-[102px] w-[102px] rounded-md"
            ></Image>
            {/* title and genres */}
            <div className="px-3 truncate">
              <p className="text-base truncate">{film.title}</p>
              <ul className="flex flex-wrap gap-x-1.5 text-sm opacity-[0.7]">
                {film.genreIds.map((id, idx) => (
                  <li key={idx}>
                    {
                      globalContext.genres[film.mediaType].find(
                        (genre) => genre.id === id
                      )?.name
                    }
                    {''}
                    {idx !== film.genreIds.length - 1 ? ',' : ''}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {items.length > 5 ? (
        <button
          onClick={() => {
            console.log('alo');
            props.goToSearchPage();
          }}
          className="px-3 py-1.5 bg-primary w-full hover:text-body sticky bottom-0 shadow-lg"
        >
          More results
        </button>
      ) : (
        ''
      )}
    </div>
  );
};
