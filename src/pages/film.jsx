import React, { useEffect, useState } from "react";
import { Page, Navbar, BlockTitle, Block } from "framework7-react";
import { api } from "@/utils/api";

const FilmPage = (props) => {
  const [film, setFilm] = useState({});
  const filmId = props.f7route.params.id;

  const fetchFilm = async () => {
    await api
      .get(`/films/${filmId}`)
      .then(async (resp) => {
        if (resp.status === 401) {
          f7.dialog.alert("Unauthorized. Please login to continue.");
          return;
        } else if (resp.status !== 200) {
          throw new Error("Error status: " + resp.status);
        }
        const film = await resp.json();
        setFilm(film);
      })
      .catch((error) => {
        console.log(error);
        f7.dialog.alert("An error occurred. Please try again later.");
      });
  };

  useEffect(() => {
    fetchFilm();
  }, []);

  return (
    <Page name="film" onPtrRefresh={fetchFilm}>
      <Navbar title={film.name} backLink="Back" />
      <BlockTitle large>Title</BlockTitle>
      <Block>{film.name}</Block>
      <BlockTitle large>Description</BlockTitle>
      <Block>{film.description}</Block>
      <BlockTitle large>Poster</BlockTitle>
      <Block>
        <img src={film.posterURL} alt={film.name} width={300} height={300} />
      </Block>
    </Page>
  );
};

export default FilmPage;
