import React, { useState, useEffect } from "react";
import { Page, Navbar, List, ListItem, BlockTitle } from "framework7-react";
import { api } from "@/utils/api";

const FilmsPage = () => {
  const [films, setFilms] = useState([]);

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

  useEffect(() => {
    console.log("Fetching films...");
    fetchFilms();
  }, []);

  return (
    <Page name="films" onPtrRefresh={fetchFilms}>
      <Navbar title="Films" />
      <BlockTitle>Films</BlockTitle>
      <List strong dividersIos outlineIos insetMd>
        {films.map(({ id, name }) => (
          <ListItem key={id} title={name} link={`/films/${id}`} />
        ))}
      </List>
    </Page>
  );
};

export default FilmsPage;
