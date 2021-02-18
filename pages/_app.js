import App from "next/app";
import { StoreProvider } from "easy-peasy";
import store from "../store";
import theme from "../theme";
import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";

function MyApp({ Component, pageProps, user }) {
  if (user) {
    store.getActions().user.setUser(user);
  }

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <ColorModeProvider>
        <StoreProvider store={store}>
          <Component {...pageProps} />
        </StoreProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  let user = null;

  if (
    appContext.ctx.req &&
    appContext.ctx.req.session &&
    appContext.ctx.req.session.passport &&
    appContext.ctx.req.session.passport.user
  ) {
    user = appContext.ctx.req.session.passport.user;
  }
  return { ...appProps, user };
};

export default MyApp;
