import { Route, Routes } from 'react-router-dom';

import { CatalogPage } from '../pages/CatalogPage';
import { FilmPage } from '../pages/FilmPage';
import { HomePage } from '../pages/HomePage';
import { SeasonPage } from '../pages/SeasonPage';

export const Body = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/movies" element={<CatalogPage type="movie" />}></Route>
      <Route path="/tv" element={<CatalogPage type="tv" />}></Route>
      <Route path="/search" element={<CatalogPage type="search" />}></Route>
      <Route
        path="/list/:listTitle"
        element={<CatalogPage type="list" />}
      ></Route>

      <Route path="/movie/:id" element={<FilmPage mediaType="movie" />}></Route>
      <Route path="/tv/:id" element={<FilmPage mediaType="tv" />}></Route>
      <Route
        path="/tv/:id/season/:seasonNumber"
        element={<SeasonPage />}
      ></Route>
    </Routes>
  );
};
