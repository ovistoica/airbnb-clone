import React from "react";
import { NextPage } from "next";
import Layout from "../components/Layout";
import Head from "next/head";
import { Text, Flex, Box, Heading } from "@chakra-ui/core";
import fetch from "isomorphic-unfetch";
interface FaqPageProps {
  questions: { question: string; answer: string }[];
}

const Faq: NextPage<FaqPageProps> = ({ questions }) => {
  return (
    <Layout
      content={
        <>
          <Head>
            <title>AirBnB - FAQ</title>
          </Head>
          <Heading color="primary">
            Here is a list of most asked questions
          </Heading>

          <Flex flexDir="column" flex={1}>
            {questions.map((question, index) => (
              <Box key={`question${index}`} mt="15px">
                <Heading as="h4" fontSize="20px" color="primary">
                  {question.question}
                </Heading>
                <Text as="h4" color="primary" fontSize="18px">
                  {question.answer}
                </Text>
              </Box>
            ))}
          </Flex>
        </>
      }
    />
  );
};

Faq.getInitialProps = async () => {
  const response = await fetch(`http://localhost:3000/api/faq`);
  const { questions } = await response.json();

  return { questions };
};

export default Faq;
