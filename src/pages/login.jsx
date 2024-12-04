import {
  BlockFooter,
  Button,
  f7,
  List,
  ListButton,
  ListInput,
  LoginScreenTitle,
  Page,
} from "framework7-react";
import React, { useState, useContext } from "react";
import passwordValidator from "@/services/password-validator";
import { api } from "@/utils/api";
import { MyContext } from "@/js/context.jsx";

const LoginPage = (props) => {
  const { login } = useContext(MyContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearFormData = () => {
    setEmail("");
    setPassword("");
  };

  const alertLoginData = async () => {
    if (!email || !password) {
      f7.dialog.alert("Username and password are required");
      return;
    }

    const errors = passwordValidator(password);

    if (
      !email.match(
        /[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/
      )
    ) {
      f7.dialog.alert("Invalid email address");
      return;
    }
    if (errors.length > 0) {
      f7.dialog.alert("Password must<br>" + errors.join("<br />"));
    } else {
      await api
        .post("/auth/login", {
          email,
          password,
        })
        .then(async (resp) => {
          if (resp.status === 401) {
            f7.dialog.alert("Invalid email or password");
            return;
          } else if (resp.status !== 200) {
            throw new Error("Error status: " + resp.status);
          }
          const data = await resp.json();
          f7.dialog.alert("Login successful", () => {
            login(data);
            clearFormData();
            f7.tab.show("#view-home");
          });
        })
        .catch((error) => {
          console.log(error);
          f7.dialog.alert("An error occurred. Please try again later.");
        });
    }
  };

  const GITHUB_CLIENT_ID = "Ov23liVbjF9lNNpNL9ve";
  const GITHUB_REDIRECT_URI = "cinemanow://gh-callback";
  const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    GITHUB_REDIRECT_URI
  )}&scope=user`;

  const handleGitHubLogin = async () => {
    const inAppBrowserRef = window.cordova.InAppBrowser.open(
      GITHUB_AUTH_URL,
      '_blank',
      'location=yes'
    );
  
    inAppBrowserRef.addEventListener('loadstart', async (event) => {
      let redirectedUrl = event.url;

      if (redirectedUrl.startsWith('http://cinemanow://')) {
        redirectedUrl = redirectedUrl.replace('http://', '');
      }
    
      if (redirectedUrl.startsWith('cinemanow://gh-callback')) {
        const url = new URL(redirectedUrl);
        const code = url.searchParams.get('code');
    
        inAppBrowserRef.close();

        await api
        .post("/auth/github", {
          code,
        })
        .then(async (resp) => {
          if (resp.status !== 200) {
            f7.dialog.alert("Error occurred while logging in with GitHub");
            return;
          }
          const data = await resp.json();
          f7.dialog.alert("Login successful", () => {
            login(data);
            clearFormData();
            f7.tab.show("#view-home");
          });
        })
        .catch((error) => {
          console.log(error);
          f7.dialog.alert("An error occurred. Please try again later.");
        });
      }
    });
  };

  return (
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
        <ListButton title="Sign In" onClick={() => alertLoginData()} />
        <Button color="black" onClick={handleGitHubLogin} tonal>
          Sign in via GitHub
        </Button>
        <BlockFooter>
          If you do not have an account, you can click the button below to
          create one.
          <Button tonal round href="/register/">
            Create Account
          </Button>
        </BlockFooter>
      </List>
    </Page>
  );
};

export default LoginPage;
