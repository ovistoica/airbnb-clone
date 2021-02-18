import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  Flex,
  Checkbox,
  Button,
  InputProps,
  CheckboxProps,
  Select,
  Image,
} from "@chakra-ui/core";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { THouse } from "../interfaces";
import Axios from "axios";
import { useRouter } from "next/router";

const TYPE_ARRAY: string[] = [
  "Entire apartment",
  "Private room",
  "Hostel beds",
  "Entire loft",
  "Entire house",
];
export interface HouseFormData {
  town: string;
  title: string;
  description: string;
  guests: number;
  bedrooms: number;
  type: string;
  beds: number;
  baths: number;
  wifi: boolean;
  picture: string;
  price: number;
  kitchen: boolean;
  heating: boolean;
  freeParking: boolean;
}

const validationSchema = yup.object().shape({
  town: yup.string().required("Please provide a town"),
  title: yup
    .string()
    .required("Give a title to your house")
    .min(5, "At least 5 chars"),
  description: yup
    .string()
    .required("Please enter a small description of the place"),
  guests: yup.number().required("Please enter maximum number of guests"),
  bedrooms: yup
    .number()
    .required("Please enter the number of bedrooms available"),
  type: yup
    .string()
    .required("Please choose type of offering")
    .oneOf(TYPE_ARRAY, "Please select a valid type of offering"),
  beds: yup.number().required("Please enter the number of beds"),
  baths: yup.number().required("Please enter number of baths"),
  wifi: yup.bool().required("Please specify if the you offer wifi"),
  picture: yup.string(),
  price: yup
    .number()
    .required("Please enter the price per night in $")
    .moreThan(0, "Please enter a valid amount"),

  kitchen: yup
    .bool()
    .required("Please specify if the guests have access to the Kitchen"),
  heating: yup.bool().required("Please specify if place has heating"),
  freeParking: yup
    .bool()
    .required("Please specify if the guests have free parking"),
});

const formInputStyle: InputProps<HTMLInputElement> = {
  bg: "white",
  color: "primary",
  fontSize: "18px",
  focusBorderColor: "gray.200",
  height: "50px",
};

const checkboxStyle: CheckboxProps = {
  bg: "white",
  color: "primary",
  fontSize: "18px",
  height: "30px",
  mt: "5px",
};

const formStyle: React.CSSProperties = {
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  outline: "none",
};

interface HouseFormProps {
  house?: THouse;
  edit?: boolean;
}

export const HouseForm: React.FC<HouseFormProps> = ({
  house,
  edit = false,
}) => {
  const router = useRouter();
  const [picture, setPicture] = useState(house?.picture || "");

  const { register, handleSubmit, errors, setValue } = useForm<HouseFormData>({
    validationSchema,
    defaultValues: house,
  });
  const onSubmit = handleSubmit(async (data: HouseFormData) => {
    const entirePlace =
      data.type === "Entire apartment" ||
      data.type === "Entire loft" ||
      data.type === "Entire house";

    try {
      const response = await Axios.post(`/api/host/${edit ? "edit" : "new"}`, {
        house: {
          ...data,
          id: house ? house.id : undefined,
          entirePlace,
          picture,
        },
      });
      if (response.data.status === "error") {
        alert(response.data.message);
        return;
      }

      router.push("/host");
    } catch (error) {
      alert(error.response.data.message);
      return;
    }
  });

  return (
    <form onSubmit={onSubmit} style={formStyle}>
      <FormControl isInvalid={!!errors.title} my="5px">
        <FormLabel htmlFor="title">Offer title</FormLabel>
        <Input name="title" placeholder="House Title" ref={register} />
        <FormErrorMessage>
          {errors.title && errors.title.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.town} my="5px">
        <FormLabel htmlFor="title">Town</FormLabel>
        <Input name="town" placeholder="Town" ref={register} />
        <FormErrorMessage>
          {errors.town && errors.town.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.price} my="5px">
        <FormLabel htmlFor="price">Price</FormLabel>
        <Input
          name="price"
          placeholder="Price per night"
          ref={register}
          type="number"
        />
        <FormErrorMessage>
          {errors.price && errors.price.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.picture} my="5px">
        <FormLabel htmlFor="price">Picture</FormLabel>
        <Input
          name="picture"
          type="file"
          id="fileUpload"
          accept="image/*"
          placeholder="House picture URL"
          onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
            event.persist();
            const files = event.target.files;
            if (!files) {
              return;
            }
            const formData = new FormData();
            formData.append("image", files[0]);

            const response = await Axios.post("/api/host/image", formData);
            setPicture(response.data.path);
          }}
          value={undefined}
          {...formInputStyle}
          border="none"
        />
        <Image src={picture} />
        <FormErrorMessage>
          {errors.picture && errors.picture.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description} my="5px">
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input
          name="description"
          placeholder="House description"
          ref={register}
          {...formInputStyle}
          h="100px"
          as="textarea"
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>
      <Grid
        templateColumns="60% 40%"
        gridGap="10px"
        mt="15px"
        justifyContent="center"
      >
        <Flex flexDir="column">
          <FormControl isInvalid={!!errors.type} my="5px">
            <FormLabel htmlFor="type">Type of offering</FormLabel>
            <Select
              placeholder="What type of place is it"
              mt="10px"
              size="lg"
              bg="white"
              color="primary"
              fontSize="18px"
              focusBorderColor="gray.200"
              height="50px"
              ref={register}
              name="type"
            >
              {TYPE_ARRAY.map((type) => {
                return (
                  <option value={type} key={`option${type}`}>
                    {type}
                  </option>
                );
              })}
            </Select>
            <FormErrorMessage>
              {errors.type && errors.type.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.guests} my="5px">
            <FormLabel htmlFor="guests">Guests</FormLabel>

            <Input
              name="guests"
              placeholder="Number of guests"
              ref={register}
              {...formInputStyle}
              type="number"
            />
            <FormErrorMessage>
              {errors.guests && errors.guests.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.bedrooms} my="5px">
            <FormLabel htmlFor="bedrooms">Bedrooms</FormLabel>

            <Input
              name="bedrooms"
              placeholder="Number of bedrooms"
              ref={register}
              {...formInputStyle}
              type="number"
            />
            <FormErrorMessage>
              {errors.bedrooms && errors.bedrooms.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.beds} my="5px">
            <FormLabel htmlFor="beds">Beds</FormLabel>

            <Input
              name="beds"
              placeholder="Number of beds"
              ref={register}
              {...formInputStyle}
              type="number"
            />
            <FormErrorMessage>
              {errors.beds && errors.beds.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.baths} my="5px">
            <FormLabel htmlFor="baths">Baths</FormLabel>
            <Input
              name="baths"
              inputMode="numeric"
              placeholder="Number of baths"
              ref={register}
              {...formInputStyle}
            />
            <FormErrorMessage>
              {errors.baths && errors.baths.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>
        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          mt="35px"
          ml="50px"
        >
          <FormControl isInvalid={!!errors.wifi}>
            <Checkbox
              variantColor="red"
              size="lg"
              color="primary"
              name="wifi"
              ref={register}
              {...checkboxStyle}
            >
              It has Wifi
            </Checkbox>
            <FormErrorMessage>
              {errors.wifi && errors.wifi.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.kitchen}>
            <Checkbox
              variantColor="red"
              size="lg"
              color="primary"
              name="kitchen"
              ref={register}
              {...checkboxStyle}
            >
              It has a kitchen
            </Checkbox>
            <FormErrorMessage>
              {errors.kitchen && errors.kitchen.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.heating}>
            <Checkbox
              variantColor="red"
              size="lg"
              color="primary"
              name="heating"
              ref={register}
              {...checkboxStyle}
            >
              It has a heating
            </Checkbox>
            <FormErrorMessage>
              {errors.heating && errors.heating.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.freeParking}>
            <Checkbox
              variantColor="red"
              size="lg"
              color="primary"
              name="freeParking"
              ref={register}
              {...checkboxStyle}
            >
              It has a free parking
            </Checkbox>
            <FormErrorMessage>
              {errors.freeParking && errors.freeParking.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>
      </Grid>
      <Button variantColor="red" onClick={onSubmit} mt="15px">
        {edit ? "Edit House" : "Add House"}
      </Button>
    </form>
  );
};
