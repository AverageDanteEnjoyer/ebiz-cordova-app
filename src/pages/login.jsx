import {
  BlockFooter,
  Button, f7,
  List,
  ListButton,
  ListInput,
  LoginScreenTitle,
  Page,
} from 'framework7-react';
import React, { useState } from 'react';
import passwordValidator from '@/services/password-validator';
import { api } from '@/utils/api';
import store from '@/js/store';

const LoginPage = (props) => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const clearFormData = () => {
    setEmail('');
    setPassword('');
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
      await api.post('/auth/login', {
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
        clearFormData();
      }).catch((error) => {
        console.log(error);
        f7.dialog.alert('An error occurred. Please try again later.');
      });
    }
  };

  return (
    <Page loginScreen>
      <LoginScreenTitle>Login</LoginScreenTitle>
      <List form>
        <ListInput
          type="text"
          name="email"
          placeholder="Your email"
          value={ email }
          onInput={ (e) => setEmail(e.target.value) }
        ></ListInput>
        <ListInput
          type="password"
          name="password"
          placeholder="Your password"
          value={ password }
          onInput={ (e) => setPassword(e.target.value) }
        ></ListInput>
      </List>
      <List>
        <ListButton title="Sign In" onClick={ () => alertLoginData() }/>
        <BlockFooter>
          If you do not have an account, you can click the button below to create one.
          <Button tonal round href="/register/">
            Create Account
          </Button>
        </BlockFooter>
      </List>
    </Page>
  );
};

export default LoginPage;
