import React, { useState } from "react";
import { getDevice } from "framework7/lite-bundle";
import {
  f7,
  f7ready,
  App,
  Panel,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  Button,
} from "framework7-react";
import cordovaApp from "../js/cordova-app";

import routes from "../js/routes";
import store from "../js/store";

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
  const isAuthenticated = store.getters.isAuthenticated.value;

  f7ready(() => {
    if (!isAuthenticated) {
      f7.loginScreen.open("#login-screen");
    }
    // Init cordova APIs (see cordova-app.js)
    if (f7.device.cordova) {
      cordovaApp.init(f7);
    }

    // Call F7 APIs here
  });

  return (
    <App {...f7params}>
      {/* Right panel with reveal effect*/}
      <Panel right reveal dark>
        <View>
          <Page>
            <Navbar title="Right Panel" />
            <Block>
              <Button
                fill
                onClick={() => {
                  store
                    .dispatch("logout", null)
                    .then(() => {
                      f7.dialog.alert("Logout successful");
                      f7.loginScreen.open("#login-screen");
                    })
                    .catch((error) => {
                      console.log(error);
                      f7.dialog.alert(
                        "We cannot log you out at this time. Please try again later."
                      );
                    });
                }}
              >
                Logout
              </Button>
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
          <Link
            tabLink="#view-login"
            iconIos="f7:gear"
            iconMd="material:perm_identity"
            text="Account"
          />
        </Toolbar>

        <View id="view-home" main tab tabActive url="/" />

        <View id="view-films" name="films" tab url="/films/" />

        <View id="view-register" name="register" tab url="/register/" />
        <View id="view-login" name="login" tab url="/login/" />
      </Views>
    </App>
  );
};
export default MyApp;
