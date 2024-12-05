import React, {useEffect, useState, useContext} from "react";
import {Page, Navbar, BlockTitle, Block, Button, f7, Popup, Card} from "framework7-react";
import {api} from "@/utils/api";
import {MyContext} from "@/js/context.jsx";

const FilmPage = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFilmRented, setIsFilmRented] = useState(false);
    const [videoHeight, setVideoHeight] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [film, setFilm] = useState({});
    const [returnDate, setReturnDate] = useState("");
    const {user} = useContext(MyContext);
    const {newFilmRented} = useContext(MyContext);

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

    const checkIfFilmIsRented = async () => {
        await api
            .get(`/films/is-film-rented-by-user/${filmId}`)
            .then(async (resp) => {
                const res = await resp.json();
                setIsFilmRented(res);
            })
    }

    const getReturnDate = async () => {
        await api
            .get(`/films/return-date/${filmId}`)
            .then(async (resp) => {
                const res = await resp.text();
                console.log(res);
                setReturnDate(res);
            }
        )
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const rentFilm = async () => {
        setIsLoading(true);
        await api
            .post(`/films/${filmId}/rentals`)
            .then(async (resp) => {
                const {status} = resp;
                const data = await resp.json();
                if (status !== 200) {
                    const {
                        errors: {general},
                    } = data;
                    const [message] = general;

                    f7.dialog.alert(message);
                } else {
                    newFilmRented();
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
        if (user) {
            checkIfFilmIsRented();
            getReturnDate();
        }
        console.log(film.filmURL);
        if (isOpen) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = film.filmURL;
            console.log(film.filmURL);
            const popupHeight = video.videoHeight + (window.innerHeight * 0.5);

            video.onloadedmetadata = () => {
                setVideoHeight(`${popupHeight}px`);
                console.log(encodeURIComponent(film.filmURL));
            };
        }
    }, [isFilmRented, isOpen, newFilmRented]);

    return (
        <Page name="film" onPtrRefresh={fetchFilm}>
            <Navbar title={film.name} backLink="Back"/>
            <BlockTitle large>Title</BlockTitle>
            <Block>{film.name}</Block>
            <BlockTitle large>Description</BlockTitle>
            <Block>{film.description}</Block>
            <BlockTitle large>Poster</BlockTitle>
            <Block>
                {/*<img src={film.posterURL} alt={film.name} width={(screen.width * 0.8)} height={(screen.width * 0.8)} />*/}
                {/*    align img to center*/}
                {/*    <img src={film.poster} alt={film.name} width={(screen.width * 0.8)} height={(screen.width * 0.8)} style={{display: "block", marginLeft: "auto", marginRight: "auto", width: "50%"}}/>*/}
                <img src={film.posterURL} alt={film.name} width="300" height="300"
                     style={{display: "block", marginLeft: "auto", marginRight: "auto"}}/>
            </Block>
            {user && !isFilmRented ? (
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
            ) : isFilmRented ? (
                <Block>
                    <Card>
                        <p>
                            You have rented this film. It will be available until{" "}
                            {formatDate(returnDate)}.
                        </p>
                    </Card>
                    <Button fill round raised onClick={() => setIsOpen(true)}>
                        Watch Film
                    </Button>
                </Block>
            ) : null}

            {/* Popup z wideo */}
            <Popup opened={isOpen} onPopupClosed={() => setIsOpen(false)} style={{ height: videoHeight }}>
                <div className="page">
                    <div className="navbar">
                        <div className="navbar-inner">
                            <div className="title">Watch Video</div>
                            <div className="right">
                                <Button onClick={() => setIsOpen(false)}>Close</Button>
                            </div>
                        </div>
                    </div>
                    <div className="page-content"
                         style={{display: "flex", justifyContent: "center", alignItems: "center", height: "auto"}}>
                        {/* Wideo */}
                        <video controls preload="metadata" style={{width: "100%", height: "auto"}}>
                            {/*<source src={`${film.filmURL}`} type="video/mp4" />*/}
                            <source src={film.filmURL} type="video/mp4" />
                            {/*<source src={encodeURIComponent(film.filmURL)} type="video/mp4"/>*/}
                            {/*<source src={"https://res.cloudinary.com/fitsphere/video/upload/v1730065582/samples/elephants.mp4"} type="video/mp4"/>*/}
                            Video not supported.
                        </video>
                    </div>
                </div>
            </Popup>
        </Page>
    );
};

export default FilmPage;
