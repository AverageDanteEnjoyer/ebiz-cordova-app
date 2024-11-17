import React, {useState} from 'react';
import {getDevice} from 'framework7/lite-bundle';
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
    LoginScreen,
    LoginScreenTitle,
    List,
    ListInput,
    ListButton,
    BlockFooter
} from 'framework7-react';
import cordovaApp from '../js/cordova-app';

import routes from '../js/routes';
import store from '../js/store';

import passwordValidator from '../services/password-validator';
import {api} from "@/utils/api";

const MyApp = () => {
    // Login screen demo data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const device = getDevice();

    const isAuthenticated = store.getters.isAuthenticated.value;

    // Framework7 Parameters
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
    const alertLoginData = async () => {
        if (!email || !password) {
            f7.dialog.alert('Username and password are required');
            return;
        }

        const errors = passwordValidator(password);

        if (!email.match(/[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/)) {
            f7.dialog.alert('Invalid email address');
            return;
        }
        if (errors.length > 0) {
            f7.dialog.alert('Password must<br>' + errors.join('<br />'));
        } else {
            await api.post("/auth/login", {
                email,
                password
            }).then(async (resp) => {
                if (resp.status === 401) {
                    f7.dialog.alert('Invalid email or password');
                    throw new Error('Unauthorized: ' + resp.status);
                }
                const data = await resp.json();
                await store.dispatch('login', data);
                f7.dialog.alert('Login successful');
                f7.loginScreen.close();
            }).catch((error) => {
                console.log(error);
                if (error.message === 'Unauthorized') {
                    return;
                }
                f7.dialog.alert('An error occurred. Please try again later: ' + error.message);
            });
        }
    }
    f7ready(() => {
        if (!isAuthenticated) {
            f7.loginScreen.open('#my-login-screen');
        }
        // Init cordova APIs (see cordova-app.js)
        if (f7.device.cordova) {
            cordovaApp.init(f7);
        }

        // Call F7 APIs here
    });

    return (
        <App {...f7params}>

            {/* Left panel with cover effect*/}
            <Panel left cover dark>
                <View>
                    <Page>
                        <Navbar title="Left Panel"/>
                        <Block>Left panel content goes here</Block>
                    </Page>
                </View>
            </Panel>


            {/* Right panel with reveal effect*/}
            <Panel right reveal dark>
                <View>
                    <Page>
                        <Navbar title="Right Panel"/>
                        <Block>Right panel content goes here</Block>
                    </Page>
                </View>
            </Panel>


            {/* Views/Tabs container */}
            <Views tabs className="safe-areas">
                {/* Tabbar for switching views-tabs */}
                <Toolbar tabbar icons bottom>
                    <Link tabLink="#view-home" tabLinkActive iconIos="f7:house_fill" iconMd="material:home"
                          text="Home"/>
                    <Link tabLink="#view-catalog" iconIos="f7:square_list_fill" iconMd="material:view_list"
                          text="Catalog"/>
                    <Link tabLink="#view-settings" iconIos="f7:gear" iconMd="material:settings" text="Settings"/>
                </Toolbar>

                {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */}
                <View id="view-home" main tab tabActive url="/"/>

                {/* Catalog View */}
                <View id="view-catalog" name="catalog" tab url="/catalog/"/>

                {/* Settings View */}
                <View id="view-settings" name="settings" tab url="/settings/"/>

            </Views>

            {/* Popup */}
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

            {/* Login Screen */}
            <LoginScreen id="my-login-screen">
                <View>
                    <Page loginScreen>
                        <LoginScreenTitle>Login</LoginScreenTitle>
                        <List form>
                            <ListInput
                                type="text"
                                name="email"
                                placeholder="Your email"
                                value={email}
                                onInput={(e) => setEmail(e.target.value)}
                            ></ListInput>
                            <ListInput
                                type="password"
                                name="password"
                                placeholder="Your password"
                                value={password}
                                onInput={(e) => setPassword(e.target.value)}
                            ></ListInput>
                        </List>
                        <List>
                            <ListButton title="Sign In" onClick={() => alertLoginData()}/>
                            <BlockFooter>
                                Some text about login information.<br/>Click "Sign In" to close Login Screen
                            </BlockFooter>
                        </List>
                    </Page>
                </View>
            </LoginScreen>

        </App>
    )
}
export default MyApp;
