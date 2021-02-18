import * as React from "react";
import Head from "next/head";
import Header from "./Header";
import Modal from "./BaseModal";
import LoginModal from "./auth/LoginModal";
import RegistrationModal from "./auth/RegistrationModal";
import { useStoreState, useStoreActions, Actions } from "easy-peasy";
import { StoreModel } from "../store";
import CookieConsent from "react-cookie-consent";
import { Text } from "@chakra-ui/core";

interface LayoutProps {
  content: JSX.Element;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const showModal = useStoreState((state) => state.modals.showModal);
  const showLoginModal = useStoreState((state) => state.modals.showLoginModal);
  const showRegistrationModal = useStoreState(
    (state) => state.modals.showRegistrationModal
  );

  const setHideModal = useStoreActions(
    (actions: Actions<StoreModel>) => actions.modals.setHideModal
  );

  const setShowRegistrationModal: Function = useStoreActions(
    (actions: Actions<StoreModel>) => actions.modals.setShowRegistrationModal
  );
  const setShowLoginModal = useStoreActions(
    (actions: Actions<StoreModel>) => actions.modals.setShowLoginModal
  );

  return (
    <div>
      <Head>
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      <Header />
      <main>{props.content}</main>
      <CookieConsent
        location="bottom"
        buttonText="Sure man!!"
        cookieName="myAwesomeCookieName2"
        style={{
          background: "#EDF2F7",
        }}
        buttonStyle={{
          color: "white",
          backgroundColor: "red",
          fontSize: "20px",
          marginRight: "10px",
        }}
        contentStyle={{
          color: "717171",
        }}
        expires={150}
      >
        <Text color="primary" fontWeight="bold" fontSize="20px">
          {" "}
          This website uses cookies to enhance the user experience.{" "}
        </Text>
      </CookieConsent>
      {showModal && (
        <Modal close={setHideModal}>
          {showLoginModal && (
            <LoginModal showSignup={setShowRegistrationModal} />
          )}
          {showRegistrationModal && (
            <RegistrationModal showLogin={setShowLoginModal} />
          )}
        </Modal>
      )}

      <style jsx global>{`
        body {
          margin: 0;
          font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto,
            "Helvetica Neue", sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
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
        }
        input[type="text"],
        input[type="email"] {
          display: block;
          padding: 10px;
          font-size: 20px !important;
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
          margin-bottom: 10px;
        }
      `}</style>

      <style jsx>{`
        main {
          position: relative;
          max-width: 56em;
          background-color: white;
          padding: 2em;
          margin: 0 auto;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Layout;
