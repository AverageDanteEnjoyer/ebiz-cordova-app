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
import React, { useState } from "react";
import passwordValidator from "@/services/password-validator";
import { api } from "@/utils/api";

const RegisterPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const clearFormData = () => {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setFirstName("");
    setLastName("");
  };

  const alertRegisterData = async () => {
    if (!email || !password || !passwordConfirm || !firstName || !lastName) {
      f7.dialog.alert("All fields are required");
      return;
    }

    const errors = passwordValidator(password);

    if (password !== passwordConfirm) {
      f7.dialog.alert("Passwords do not match");
      return;
    }
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
        .post("/auth/register", {
          email,
          password,
          firstName,
          lastName,
        })
        .then(async (resp) => {
          if (resp.status === 400) {
            f7.dialog.alert("Email already exists");
            return;
          } else if (resp.status !== 200) {
            throw new Error("Error status: " + resp.status);
          }
          f7.dialog.alert(
            "Registration successful. Redirecting to login screen.",
            () => {
              clearFormData();
              f7.tab.show("#view-login");
            }
          );
        })
        .catch((error) => {
          console.log(error);
          f7.dialog.alert("An error occurred. Please try again later.");
        });
    }
  };

  return (
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
        <ListButton title="Sign Up" onClick={alertRegisterData} />
        <BlockFooter>
          If you have an account, you can click the button below to login.
          <Button tonal round href="/login/">
            Login
          </Button>
        </BlockFooter>
      </List>
    </Page>
  );
};

export default RegisterPage;
