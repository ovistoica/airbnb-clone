import * as React from "react";
import NextLink from "next/link";
import { THouse } from "../interfaces";
import { Link, Image, Text, BoxProps } from "@chakra-ui/core";

const House: React.FC<THouse> = (props) => {
  const textProps: BoxProps = {
    fontSize: "18px",
    color: "#333",
    my: "3px",
  };
  return (
    <NextLink href="/houses/[id]" as={"/houses/" + props.id} passHref>
      <Link _focus={undefined}>
        <Image src={props.picture} width="100%" alt="House picture" />
        <Text {...textProps}>
          {props.type} - {props.town}
        </Text>
        <Text {...textProps}>{props.title}</Text>
        <Text {...textProps}>
          {props.rating} {props.reviewCount}
        </Text>
      </Link>
    </NextLink>
  );
};

export default House;
