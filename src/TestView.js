import React from 'react';
import {
  App,
  View,
  Page,
  Navbar,
  Toolbar,
  Link,
  Block,
} from 'framework7-react';

function TestView() {
  return (
    <App theme="auto"> {/* 'auto' selects iOS or Material Design theme based on the platform */}
      <View main>
        <Page>
          <Navbar title="My Framework7 App" />
          <Block>
            <p>Hello, this is Framework7 with React!</p>
          </Block>
          <Toolbar bottom>
            <Link>Home</Link>
            <Link>Settings</Link>
            <Link>About</Link>
          </Toolbar>
        </Page>
      </View>
    </App>
  );
}

export default TestView;
