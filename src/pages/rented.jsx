import React, {useState, useEffect, useContext} from "react";
import {Page, Navbar, List, ListItem, BlockTitle, f7} from "framework7-react";
import {api} from "@/utils/api";
import {MyContext} from "@/js/context";

const RentedPage = () => {
    const {user} = useContext(MyContext);
    const [films, setFilms] = useState([]);
    const {isNewFilmRented, resetNewFilmRented} = useContext(MyContext);


    const fetchFilms = async () => {
        await api
            .get("/films/rented")
            .then(async (resp) => {
                if (resp.status === 401) {
                    f7.dialog.alert("Unauthorized request from rented films");
                    return;
                } else if (resp.status !== 200) {
                    throw new Error("Error status: " + resp.status);
                }
                const {content} = await resp.json();
                setFilms(content);
            })
            .catch((error) => {
                console.log(error);
                f7.dialog.alert("An error occurred. Please try again later.");
            });
    };

    useEffect(() => {
        if (user) {
            fetchFilms();
            if (isNewFilmRented) {
                resetNewFilmRented();
            }
        }
    }, [user, isNewFilmRented]);

    return (
        <Page name="films">
            <Navbar title="Rented Films"/>
            <List strong dividersIos outlineIos insetMd>
                {films.length === 0 ? (
                    <ListItem title="No rented films"/>
                ) : (
                    films.map(({id, name}) => (
                        <ListItem key={id} title={name} link={`/films/${id}`}/>
                    ))
                )}
            </List>
        </Page>
    );
};

export default RentedPage;
