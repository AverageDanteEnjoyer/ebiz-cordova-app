import React from "react";
import {
  Page,
  Navbar,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Block,
  BlockTitle,
  List,
  ListItem,
  Button,
  Icon,
} from "framework7-react";

const HomePage = () => (
  <Page name="home">
    <Navbar large sliding={false}>
      <NavTitle sliding>CinemaNow</NavTitle>
      <NavRight>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="right" />
      </NavRight>
      <NavTitleLarge>CinemaNow</NavTitleLarge>
    </Navbar>

    <Block>
      <p style={{ textAlign: "justify" }}>
        Step into the world of unforgettable stories and stunning visuals with
        CinemaNow, the ultimate platform for film enthusiasts. Whether you're
        craving timeless classics, indie gems, or the latest blockbusters,
        CinemaNow brings the magic of the silver screen to your fingertips.
      </p>
    </Block>
    <BlockTitle>Why Choose CinemaNow?</BlockTitle>
    <List dividersIos dividers strong outline inset>
      <ListItem title="Extensive Library">
        <Icon slot="media" material="star"></Icon>
      </ListItem>
      <ListItem title="Instant Access">
        <Icon slot="media" material="rocket_launch"></Icon>
      </ListItem>
      <ListItem title="HD Streaming">
        <Icon slot="media" material="videocam"></Icon>
      </ListItem>
      <ListItem title="Flexible Rentals">
        <Icon slot="media" material="credit_card"></Icon>
      </ListItem>
      <ListItem title="Anytime, Anywhere">
        <Icon slot="media" material="public"></Icon>
      </ListItem>
    </List>

    <Block>
      <p style={{ textAlign: "justify" }}>
        Rediscover the joy of movie nights with CinemaNow—where every film is a
        fresh adventure waiting to unfold.
      </p>
    </Block>

    <Block>
      <Button iconMaterial="videocam" href="/films/" fill round raised>
        Explore now
      </Button>
    </Block>
  </Page>
);
export default HomePage;
