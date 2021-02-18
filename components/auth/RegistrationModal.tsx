import * as React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormControl,
  Input,
  Button,
  Flex,
  InputProps,
  Heading,
  Link,
  Text,
} from "@chakra-ui/core";
import axios from "axios";
import { useStoreActions, Actions } from "easy-peasy";
import { StoreModel } from "../../store";

type FormData = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

const validationSchema = yup.object().shape({
  email: yup.string().required("No email provided.").email(),
  password: yup
    .string()
    .required("No password provided.")
    .min(2, "Password should be 2 chars minimum."),
  passwordConfirmation: yup
    .string()
    .required("Password does not match")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
interface RegistrationModalProps {
  showLogin: Function;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ showLogin }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { handleSubmit, errors, register } = useForm<FormData>({
    validationSchema,
  });
  const setUser = useStoreActions(
    (actions: Actions<StoreModel>) => actions.user.setUser
  );
  const setHideModal = useStoreActions(
    (actions: Actions<StoreModel>) => actions.modals.setHideModal
  );

  const onSubmit = handleSubmit(
    async ({ email, password, passwordConfirmation }: FormData) => {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/auth/register", {
          email,
          password,
          passwordConfirmation,
        });

        if (response.data.status === "error") {
          alert(JSON.stringify(response.data.message));
          return;
        }
        console.log(response);
        setIsLoading(false);
        setUser(email);
        setHideModal();
      } catch (err) {
        alert(JSON.stringify(err));
        console.log(err);
        setIsLoading(false);
      }
      event?.preventDefault();
    }
  );

  const formInputStyle: InputProps<HTMLInputElement> = {
    bg: "white",
    color: "gray.700",
    fontSize: "18px",
    focusBorderColor: "gray.300",
    borderColor: "gray.100",
    height: "50px",
  };

  const formStyle: React.CSSProperties = {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
  };

  return (
    <>
      <Heading py="5px" color="gray.600" as="h2">
        Sign Up
      </Heading>
      <form onSubmit={onSubmit} style={formStyle}>
        <FormControl isInvalid={!!errors.email}>
          <Input
            name="email"
            placeholder="Email"
            ref={register}
            {...formInputStyle}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password} my="10px">
          <Input
            name="password"
            type="password"
            placeholder="Password"
            ref={register}
            {...formInputStyle}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.passwordConfirmation} my="10px">
          <Input
            name="passwordConfirmation"
            type="password"
            placeholder="Password Confirmation"
            ref={register}
            {...formInputStyle}
          />
          <FormErrorMessage>
            {errors.passwordConfirmation && errors.passwordConfirmation.message}
          </FormErrorMessage>
        </FormControl>
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
        >
          <Button
            mt={4}
            isLoading={isLoading}
            type="submit"
            variantColor="red"
            px="50px"
          >
            Register
          </Button>
          <Text py="10px" fontSize="16px" color="gray.600">
            Already have an account?{" "}
            <Link
              href="#"
              onClick={() => showLogin()}
              fontWeight="bold"
              textDecor="underline"
            >
              Log in
            </Link>
          </Text>
        </Flex>
      </form>
    </>
  );
};

export default RegistrationModal;
