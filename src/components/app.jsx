import React, {useEffect, useState, useContext} from "react";
import {getDevice} from "framework7/lite-bundle";
import {App, Block, Button, f7, f7ready, Link, Navbar, Page, Panel, Toolbar, View, Views,} from "framework7-react";
import cordovaApp from "../js/cordova-app";

import routes from "../js/routes";
import store from "../js/store";
import {MyContextProvider, MyContext} from "@/js/context.jsx";

const device = getDevice();

const f7params = {
    name: "CinemaNow", // App name
    theme: "auto", // Automatic theme detection
    // App store
    store: store,
    // App routes
    routes: routes,
    // Input settings
    input: {
        scrollIntoViewOnFocus: device.cordova,
        scrollIntoViewCentered: device.cordova,
    },
    // Cordova Statusbar settings
    statusbar: {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    },
};

const MyApp = () => {
    const {user, logout} = useContext(MyContext);

    f7ready(() => {
        if (f7.device.cordova) {
            cordovaApp.init(f7);
        }
    });

    return (
        <App {...f7params}>
            {/* Right panel with reveal effect*/}
            <Panel right reveal dark>
                <View>
                    <Page>
                        <Navbar title="Menu"/>
                        <Block>
                            {
                                user ? (
                                    <Button
                                        fill
                                        onClick={() => {
                                            f7.dialog.alert("Logout successful", () => {
                                                logout();
                                                f7.panel.close();
                                            });
                                        }}
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <Button
                                        fill
                                        panelClose
                                        onClick={() => {
                                            f7.tab.show("#view-login");
                                        }
                                        }
                                    >
                                        Login
                                    </Button>
                                )
                            }
                        </Block>
                    </Page>
                </View>
            </Panel>

            <Views tabs className="safe-areas">
                <Toolbar tabbar icons bottom>
                    <Link
                        tabLink="#view-home"
                        tabLinkActive
                        iconIos="f7:house_fill"
                        iconMd="material:home"
                        text="Home"
                    />
                    <Link
                        tabLink="#view-films"
                        iconIos="f7:square_list_fill"
                        iconMd="material:live_tv"
                        text="Films"
                    />
                    {
                        user ? (
                            <>
                                <Link
                                    tabLink="#view-rented"
                                    iconIos="f7:film"
                                    iconMd="material:movie"
                                    text="Rented Films"
                                />
                                <Link
                                    tabLink="#view-profile"
                                    iconIos="f7:gear"
                                    iconMd="material:perm_identity"
                                    text="Profile"
                                />
                            </>
                        ) : (
                            <>
                                <Link
                                    tabLink="#view-login"
                                    iconIos="f7:gear"
                                    iconMd="material:perm_identity"
                                    text="Login"
                                />
                                <Link
                                    tabLink="#view-register"
                                    iconIos="f7:gear"
                                    iconMd="material:perm_identity"
                                    text="Register"
                                />
                            </>
                        )
                    }
                </Toolbar>

                <View id="view-home" main tab tabActive url="/"/>
                <View id="view-films" name="films" tab url="/films/"/>
                <View id="view-register" name="register" tab url="/register/"/>
                <View id="view-login" name="login" tab url="/login/"/>
                <View id="view-profile" name="profile" tab url="/profile/"/>
                <View id="view-rented" name="rented" tab url="/rented/"/>
            </Views>
        </App>
    );
};

const AppWrapper = () => (
    <MyContextProvider>
        <MyApp />
    </MyContextProvider>
);

export default AppWrapper;
