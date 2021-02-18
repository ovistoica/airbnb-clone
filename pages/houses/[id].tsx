"use strict";
import Head from "next/head";
import Layout from "../../components/Layout";
import DateRangePicker from "../../components/DateRangePicker";

import { useState, MouseEvent } from "react";
import { calcNumberOfNightsBetweenDates } from "../../utils/date";
import { useStoreActions, Actions, useStoreState } from "easy-peasy";
import { NextPage, NextPageContext } from "next";
import { StoreModel } from "../../store";
import { THouse } from "../../interfaces/index";
import {
  Image,
  Text,
  Button,
  Heading,
  BoxProps,
  Flex,
  Box,
} from "@chakra-ui/core";
import fetch from "isomorphic-unfetch";
import axios from "axios";
import { canReserve, getBookedDates } from "../../utils/reservation";
declare const Stripe: Function;
interface HouseScreenProps {
  house: THouse;
  bookedDates: string[];
}

const HousePage: NextPage<HouseScreenProps> = (props) => {
  const [dateChosen, setDateChosen] = useState(false);
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(
    0
  );
  const [startDate, setStartDate] = useState<Date | string>();
  const [endDate, setEndDate] = useState<Date | string>();
  const setShowLoginModal = useStoreActions(
    (actions: Actions<StoreModel>) => actions.modals.setShowLoginModal
  );
  const user = useStoreState((state: StoreModel) => state.user.user);

  const textProps: BoxProps = {
    fontSize: "22px",
    color: "gray.600",
    my: "3px",
  };

  const handleReserve = async (event: MouseEvent) => {
    if (!user) {
      setShowLoginModal();
    } else {
      try {
        const start = new Date(startDate!);
        const end = new Date(endDate!);
        if (!(await canReserve(props.house.id, start, end))) {
          alert("Unavailable! Please choose another period");
          return;
        }
        /** Get the stripe sessionId for the booking to confirm payment later */
        const sessionResponse = await axios.post("/api/stripe/session", {
          amount: props.house.price * numberOfNightsBetweenDates,
        });
        if (sessionResponse.data.status === "error") {
          alert(sessionResponse.data.message);
          return;
        }

        const sessionId = sessionResponse.data.sessionId;
        const stripePublicKey: string = sessionResponse.data.stripePublicKey;

        const response = await axios.post("/api/houses/reserve", {
          houseId: props.house.id,
          startDate,
          endDate,
          sessionId,
        });
        if (response.data.status === "error") {
          alert(response.data.message);
        }
        console.log(response.data);
        const stripe = Stripe(stripePublicKey);
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });
        if (error) {
          alert(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
    event.preventDefault();
  };

  return (
    <Layout
      content={
        <div className="container">
          <Head>
            <title>{props.house.title}</title>
          </Head>
          <article>
            <Image src={props.house.picture} width="100%" alt="House picture" />
            <Text {...textProps}>
              {props.house.type} - {props.house.town}
            </Text>
            <Text {...textProps}>{props.house.title}</Text>
            <Text {...textProps}>{props.house.description}</Text>
            {props.house.reviewCount && (
              <Flex flexDir="column">
                <Heading
                  as="h3"
                  color="gray.600"
                  fontSize={"25px"}
                  mt="10px"
                  fontWeight="bold"
                >
                  {props.house.reviewCount} Reviews
                </Heading>
                <Box w="100%" h="1px" bg="gray.100" mt="5px" />

                {(props.house.reviews || []).map((review, index) => {
                  return (
                    <Flex key={index} flexDir="column" mt="15px">
                      <Text {...textProps} as="i" my="0px">
                        {new Date(review.createdAt).toDateString()}
                      </Text>
                      <Text {...textProps} my="0px" fontWeight="regular">
                        {review.comment}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            )}
          </article>
          <aside>
            <Heading color="gray.600" as="h3" fontSize="24px" my="10px">
              Add dates for prices
            </Heading>
            <DateRangePicker
              datesChanged={(startDate, endDate) => {
                setNumberOfNightsBetweenDates(
                  calcNumberOfNightsBetweenDates(startDate, endDate)
                );
                setDateChosen(true);
                setStartDate(startDate);
                setEndDate(endDate);
              }}
              bookedDates={props.bookedDates}
            />
            {dateChosen && (
              <div>
                <Heading color="gray.600" as="h3" fontSize="20px" mt="10px">
                  Price per night
                </Heading>{" "}
                <Text {...textProps}>${props.house.price}</Text>
                <Heading color="gray.600" as="h3" fontSize="20px" mt="10px">
                  Total price per booking
                </Heading>
                <Text {...textProps}>
                  ${(numberOfNightsBetweenDates * props.house.price).toFixed(2)}
                </Text>
              </div>
            )}
            <Button
              className="reserve"
              onClick={handleReserve}
              variantColor="red"
              mt="10px"
              _focus={undefined}
              isDisabled={!startDate && !endDate}
            >
              {user ? "Reserve" : "Log in to Reserve"}
            </Button>
          </aside>

          <style jsx>{`
            .container {
              display: grid;
              grid-template-columns: 60% 40%;
              grid-gap: 20px;
            }

            aside {
              border: 1px solid #ccc;
              padding: 20px;
            }
            button {
              background-color: rgb(255, 90, 95);
              color: white;
              font-size: 13px;
              width: 100%;
              border: none;
              height: 40px;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 10px;
            }
          `}</style>
        </div>
      }
    />
  );
};

HousePage.getInitialProps = async ({ query }: NextPageContext) => {
  const { id } = query;
  const res = await fetch(`http://localhost:3000/api/houses/${id}`);
  const house: THouse = await res.json();
  let bookedDates: string[] = [];
  if (typeof id === "string") {
    bookedDates = await getBookedDates(id);
  }
  return {
    house,
    bookedDates,
  };
};

export default HousePage;
