import axios from "axios";
import Head from "next/head";
import NextLink from "next/link";

import Layout from "../../components/Layout";
import { THouse, TBooking } from "../../interfaces";
import { NextPage } from "next";
import { Heading, Grid, Image, Flex, Text, Link } from "@chakra-ui/core";

interface HostPageProps {
  houses: THouse[];
  bookings: TBooking[];
}

const Host: NextPage<HostPageProps> = ({ houses, bookings }) => {
  return (
    <Layout
      content={
        <Flex flex="1" justify="center" align="center" flexDir="column">
          <Head>
            <title>Your houses</title>
          </Head>

          <Grid templateColumns="60% 40%" gridGap="70px">
            {/** All the houses of the host */}
            <Grid templateColumns="100%" gap="40px" mt="40px">
              <Heading as="h2" color="primary">
                Your houses
              </Heading>

              {houses.map((house, index) => {
                return (
                  <Grid
                    templateColumns="35% 65%"
                    gridGap="40px"
                    key={index}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image
                      src={house.picture}
                      alt="House picture"
                      height="150px"
                      width="180px"
                      borderRadius="10px"
                    />
                    <Flex flexDir="column">
                      <Text color="secondary">
                        {house.type} in <Text as="b">{house.town}</Text>
                      </Text>
                      <Heading as="h2" fontSize="18px" color="primary">
                        {house.title}
                      </Heading>

                      <NextLink href={`/houses/${house.id}`}>
                        <Link
                          fontSize="18px"
                          mt="10px"
                          w="200px"
                          color="secondary"
                          textDecor="underline"
                          _hover={{ color: "primary" }}
                        >
                          View house page
                        </Link>
                      </NextLink>

                      <NextLink href={`/host/${house.id}`}>
                        <Link
                          fontSize="18px"
                          mt="10px"
                          w="200px"
                          color="secondary"
                          textDecor="underline"
                          _hover={{ color: "primary" }}

                          // borderRadius="20px"
                        >
                          Edit house details
                        </Link>
                      </NextLink>
                    </Flex>
                  </Grid>
                );
              })}
            </Grid>
            <Grid templateColumns="100%" gap="40px" mt="40px">
              <Heading as="h2" color="primary">
                Bookings
              </Heading>

              {bookings.map((booking, index) => {
                return (
                  <Grid key={index} templateColumns="100%" gap="40px">
                    <div>
                      <Heading as="h2" fontSize="18px" color="primary">
                        {booking.house.title}
                      </Heading>
                      <Text fontSize="18px" mt="8px" color="secondary">
                        Booked from{" "}
                        <Text as="em" fontWeight="semibold" color="primary">
                          {new Date(booking.startDate).toDateString()}
                        </Text>{" "}
                        to{" "}
                        <Text as="em" fontWeight="semibold" color="primary">
                          {new Date(booking.endDate).toDateString()}
                        </Text>
                      </Text>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Flex>
      }
    />
  );
};

Host.getInitialProps = async (ctx) => {
  const response = await axios({
    method: "get",
    url: "http://localhost:3000/api/host/list",
    headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
  });

  return {
    houses: response.data.houses,
    bookings: response.data.bookings,
  };
};

export default Host;
