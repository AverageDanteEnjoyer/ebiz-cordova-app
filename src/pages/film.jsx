import React, { useEffect, useState, useContext } from "react";
import { Page, Navbar, BlockTitle, Block, Button, f7 } from "framework7-react";
import { api } from "@/utils/api";
import { MyContext } from "@/js/context.jsx";

const FilmPage = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [film, setFilm] = useState({});
  const { user } = useContext(MyContext);

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

  const rentFilm = async () => {
    setIsLoading(true);
    await api
      .post(`/films/${filmId}/rentals`)
      .then(async (resp) => {
        const { status } = resp;
        const data = await resp.json();
        if (status !== 200) {
          const {
            errors: { general },
          } = data;
          const [message] = general;

          f7.dialog.alert(message);
        } else {
          f7.dialog.alert("Film has been rented");
        }
        setIsLoading(false);
      })
      .catch(() => {
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
      {user && (
        <Block>
          <Button
            iconMaterial="shopping_cart"
            onClick={rentFilm}
            fill
            round
            raised
            isLoading={isLoading}
          >
            Rent
          </Button>
        </Block>
      )}
    </Page>
  );
};

export default FilmPage;
