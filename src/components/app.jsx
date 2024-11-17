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
    BlockFooter, Button
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
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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

    const clearRegisterData = () => {
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        setFirstName('');
        setLastName('');
    }

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
                    return;
                } else if (resp.status !== 200) {
                    throw new Error('Error status: ' + resp.status);
                }
                const data = await resp.json();
                await store.dispatch('login', data);
                clearRegisterData();
                f7.loginScreen.close();
            }).catch((error) => {
                console.log(error);
                f7.dialog.alert('An error occurred. Please try again later.');
            });
        }
    }
    const alertRegisterData = async () => {
        if (!email || !password || !passwordConfirm || !firstName || !lastName) {
            f7.dialog.alert('All fields are required');
            return;
        }

        const errors = passwordValidator(password);

        if (password !== passwordConfirm) {
            f7.dialog.alert('Passwords do not match');
            return;
        }
        if (!email.match(/[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/)) {
            f7.dialog.alert('Invalid email address');
            return;
        }
        if (errors.length > 0) {
            f7.dialog.alert('Password must<br>' + errors.join('<br />'));
        } else {
            await api.post("/auth/register", {
                email,
                password,
                firstName,
                lastName
            }).then(async (resp) => {
                if (resp.status === 400) {
                    f7.dialog.alert('Email already exists');
                    return;
                } else if (resp.status !== 200) {
                    throw new Error('Error status: ' + resp.status);
                }
                clearRegisterData();
                f7.dialog.alert('Registration successful. Redirecting to login screen.');
                f7.loginScreen.close();
                f7.loginScreen.open('#login-screen');
            }).catch((error) => {
                console.log(error);
                f7.dialog.alert('An error occurred. Please try again later.');
            });
        }
    }
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
            <LoginScreen id="login-screen">
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
                                If you do not have an account, you can click the button below to create one.
                                <Button onClick={() => {
                                    f7.loginScreen.close('#login-screen');
                                    f7.loginScreen.open('#register-screen');
                                }}>
                                    Create Account
                                </Button>
                            </BlockFooter>
                        </List>
                    </Page>
                </View>
            </LoginScreen>

            {/* Register Screen */}
            <LoginScreen id="register-screen">
                <View>
                    <Page loginScreen>
                        <LoginScreenTitle>Registration</LoginScreenTitle>
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
                            <ListInput
                                type="password"
                                name="passwordConfirm"
                                placeholder="Confirm password"
                                value={passwordConfirm}
                                onInput={(e) => setPasswordConfirm(e.target.value)}
                            ></ListInput>
                            <ListInput
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={firstName}
                                onInput={(e) => setFirstName(e.target.value)}
                            ></ListInput>
                            <ListInput
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={lastName}
                                onInput={(e) => setLastName(e.target.value)}
                            ></ListInput>
                        </List>
                        <List>
                            <ListButton title="Sign Up" onClick={() => alertRegisterData()}/>
                            <BlockFooter>
                                If you have an account, you can click the button below to login.
                                <Button onClick={() => {
                                    f7.loginScreen.close('#register-screen');
                                    f7.loginScreen.open('#login-screen');
                                }}>
                                    Login
                                </Button>
                            </BlockFooter>
                        </List>
                    </Page>
                </View>
            </LoginScreen>
        </App>
    )
}
export default MyApp;
