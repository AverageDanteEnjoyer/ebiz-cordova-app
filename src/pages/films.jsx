import React, {useState, useEffect, useContext} from "react";
import {Page, Navbar, List, ListItem, BlockTitle, f7} from "framework7-react";
import { api } from "@/utils/api";
import {MyContext} from "@/js/context";

const FilmsPage = () => {
  const [films, setFilms] = useState([]);
  const {user} = useContext(MyContext);
  const {isNewFilmRented} = useContext(MyContext);

  const fetchFilms = async () => {
    await api
      .get("/films")
      .then(async (resp) => {
        if (resp.status === 401) {
          f7.dialog.alert("Unauthorized request");
          return;
        } else if (resp.status !== 200) {
          throw new Error("Error status: " + resp.status);
        }
        const { content } = await resp.json();
        setFilms(content);
      })
      .catch((error) => {
        console.log(error);
        f7.dialog.alert("An error occurred. Please try again later.");
      });
  };

  const fetchAvailableFilms = async () => {
    await api
      .get("/films/available")
      .then(async (resp) => {
        if (resp.status === 401) {
          f7.dialog.alert("Unauthorized request");
          return;
        } else if (resp.status !== 200) {
          throw new Error("Error status: " + resp.status);
        }
        const { content } = await resp.json();
        setFilms(content);
      })
      .catch((error) => {
        console.log(error);
        f7.dialog.alert("An error occurred. Please try again later.");
      });
  }

  useEffect(() => {
    console.log("Fetching films...");
    if (user) {
        f7.dialog.alert("Fetching available films");
        fetchAvailableFilms();
    } else {
        f7.dialog.alert("Fetching all films");
        fetchFilms();
    }
  }, [user, isNewFilmRented]);

  return (
    <Page name="films" onPtrRefresh={user ? fetchAvailableFilms : fetchFilms}>
      <Navbar title="Films" />
      <BlockTitle>Films available to rent</BlockTitle>
      <List strong dividersIos outlineIos insetMd>
          {films.length === 0 ? (
              <ListItem title="No films available" />
          ) : (
              films.map(({ id, name }) => (
                  <ListItem key={id} title={name} link={`/films/${id}`} />
              ))
          )}
      </List>
    </Page>
  );
};

export default FilmsPage;
