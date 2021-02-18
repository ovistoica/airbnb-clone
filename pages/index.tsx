import Layout from "../components/Layout";
import { Heading, Grid } from "@chakra-ui/core";
import { NextPage } from "next";
import HouseEl from "../components/House";
import { THouse } from "../interfaces";
import fetch from "isomorphic-unfetch";
import Head from "next/head";

interface HomePageProps {
  houses: THouse[];
}

const Index: NextPage<HomePageProps> = ({ houses }) => {
  const content = (
    <div>
      <Head>
        <title>AirBnB Clone</title>
      </Head>
      <Heading color="gray.600" as="h2">
        Places to stay
      </Heading>

      <Grid
        mt="40px"
        gridTemplateColumns={["100%", "50% 50%", "50% 50%", "50% 50%"]}
        gridGap="40px"
      >
        {houses.map((house, index) => {
          return <HouseEl key={`homepageHouse$${index}`} {...house} />;
        })}
      </Grid>
    </div>
  );

  return <Layout content={content} />;
};

Index.getInitialProps = async () => {
  const res = await fetch(`http://localhost:3000/api/houses`);
  const houses: THouse[] = await res.json();
  return {
    houses,
  };
};

export default Index;
