import React, { useState } from 'react';
import { getDevice } from 'framework7/lite-bundle';
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
  Button
} from 'framework7-react';
import cordovaApp from '../js/cordova-app';

import routes from '../js/routes';
import store from '../js/store';

const device = getDevice();

const f7params = {
  name: 'CinemaNow', // App name
  theme: 'auto', // Automatic theme detection
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
  // Login screen demo data
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirm, setPasswordConfirm ] = useState('');
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');

  const isAuthenticated = store.getters.isAuthenticated.value;

  const clearRegisterData = () => {
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setFirstName('');
    setLastName('');
  };

  f7ready(() => {
    if (!isAuthenticated) {
      f7.loginScreen.open('#login-screen');
    }
    // Init cordova APIs (see cordova-app.js)
    if (f7.device.cordova) {
      cordovaApp.init(f7);
    }

    // Call F7 APIs here
  });

  return (
    <App { ...f7params }>

      {/* Left panel with cover effect*/ }
      <Panel left cover dark>
        <View>
          <Page>
            <Navbar title="Left Panel"/>
            <Block>Left panel content goes here</Block>
          </Page>
        </View>
      </Panel>


      {/* Right panel with reveal effect*/ }
      <Panel right reveal dark>
        <View>
          <Page>
            <Navbar title="Right Panel"/>
            <Block>
              <Button fill onClick={
                () => {
                  store.dispatch('logout', null).then(
                    () => {
                      clearRegisterData();
                      f7.dialog.alert('Logout successful');
                      f7.loginScreen.open('#login-screen');
                    }
                  ).catch(
                    (error) => {
                      console.log(error);
                      f7.dialog.alert('We cannot log you out at this time. Please try again later.');
                    }
                  );
                }
              }>Logout</Button>
            </Block>
          </Page>
        </View>
      </Panel>


      {/* Views/Tabs container */ }
      <Views tabs className="safe-areas">
        {/* Tabbar for switching views-tabs */ }
        <Toolbar tabbar icons bottom>
          <Link tabLink="#view-home" tabLinkActive iconIos="f7:house_fill" iconMd="material:home"
                text="Home"/>
          <Link tabLink="#view-catalog" iconIos="f7:square_list_fill" iconMd="material:view_list"
                text="Catalog"/>
          <Link tabLink="#view-settings" iconIos="f7:gear" iconMd="material:settings" text="Settings"/>
          <Link tabLink="#view-login" iconIos="f7:gear" iconMd="material:perm_identity" text="Login"/>
        </Toolbar>

        {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */ }
        <View id="view-home" main tab tabActive url="/"/>

        {/* Catalog View */ }
        <View id="view-catalog" name="catalog" tab url="/catalog/"/>

        {/* Settings View */ }
        <View id="view-settings" name="settings" tab url="/settings/"/>

        <View id="view-register" name="register" tab url="/register/"/>
        <View id="view-login" name="login" tab url="/login/"/>
      </Views>

      {/* Popup */ }
      <Popup id="my-popup">
        <View>
          <Page>
            <Navbar title="Popup">
              <NavRight>
                <Link popupClose>Close</Link>
              </NavRight>
            </Navbar>
            <Block>
              <p>Popup content goes here.</p>
            </Block>
          </Page>
        </View>
      </Popup>
    </App>
  );
};
export default MyApp;
