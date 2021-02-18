import Head from "next/head";

import Layout from "../../components/Layout";
import { NextPage } from "next";

import React from "react";

import { HouseForm } from "../../components/HouseForm";

const NewHouse: NextPage = () => {
  return (
    <Layout
      content={
        <div>
          <Head>
            <title>Add a new house</title>
          </Head>
          <HouseForm />
        </div>
      }
    />
  );
};

export default NewHouse;
