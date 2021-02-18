import Layout from "../components/Layout";
import { NextPage } from "next";
import axios from "axios";
import Head from "next/head";
import NextLink from "next/link";
import { Heading, Grid, Image, Text, Link } from "@chakra-ui/core";
import { TBooking } from "../interfaces";

interface BookingPageProps {
  bookings: TBooking[];
}

const Bookings: NextPage<BookingPageProps> = (props) => {
  return (
    <Layout
      content={
        <div>
          <Head>
            <title>Your bookings</title>
          </Head>
          <Heading as="h2" color="primary">
            Your upcoming bookings
          </Heading>

          <Grid
            templateColumns="100%"
            gap="40px"
            mt="40px"
            justifyContent="center"
            alignItems="center"
          >
            {props.bookings.map((booking, index) => {
              return (
                <Grid
                  key={index}
                  templateColumns="30% 70%"
                  gap="40px"
                  alignItems="center"
                >
                  <Image
                    src={booking.house.picture}
                    alt="House picture"
                    height="150px"
                    width="180px"
                    borderRadius="10px"
                  />
                  <div>
                    <Text color="secondary">
                      {booking.house.type} in{" "}
                      <Text as="b">{booking.house.town}</Text>
                    </Text>
                    <Heading as="h2" fontSize="21px" color="primary">
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
                    <NextLink href={`/houses/${booking.house.id}`}>
                      <Link
                        fontSize="18px"
                        mt="10px"
                        w="200px"
                        color="secondary"
                        textDecor="underline"
                        _hover={{ color: "primary" }}

                        // borderRadius="20px"
                      >
                        Go to house details
                      </Link>
                    </NextLink>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      }
    />
  );
};

Bookings.getInitialProps = async (ctx) => {
  const response = await axios.get("http://localhost:3000/api/bookings/list", {
    headers: { cookie: ctx.req?.headers.cookie },
  });

  return {
    bookings: response.data,
  };
};

export default Bookings;
