import axios from "axios";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import { THouse } from "../../interfaces";
import Head from "next/head";
import { HouseForm } from "../../components/HouseForm";

interface EditHouseProps {
  house: THouse;
}

const EditHouse: NextPage<EditHouseProps> = ({ house }) => {
  return (
    <Layout
      content={
        <>
          <Head>
            <title>Edit house</title>
          </Head>
          <HouseForm edit={true} house={house} />
        </>
      }
    />
  );
};

EditHouse.getInitialProps = async ({ query }) => {
  const { id } = query;
  const response = await axios.get<THouse>(
    `http://localhost:3000/api/houses/${id}`
  );

  return {
    house: response.data,
  };
};

export default EditHouse;
