import express, { Request, Response } from "express";
import next from "next";
import session from "express-session";
import morgan from "morgan";
import { sequelize, User, House, Review, Booking, Question } from "../models";
import passport from "passport";
import { AuthStrategy } from "./AuthStrategy";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import apiRouter from "./routes";

dotenv.config();
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const port = parseInt(process.env.PORT!, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

/**
 * Store the user session in the Postgres DB
 */
const sessionStore = new SequelizeStore({
  db: sequelize,
});
/* Ran first time to create session tabel 
sessionStore.sync();
*/

/** Keep the tables in sync with any future changes */
User.sync({ alter: true });
House.sync({ alter: true });
Review.sync({ alter: true });
Booking.sync({ alter: true });
Question.sync({ alter: true });

passport.use(AuthStrategy);
// passport.serializeUser = serializeUser as any;
// passport.deserializeUser = deserializeUser as any;
passport.serializeUser(function (user: User, done) {
  done(null, user.email);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

nextApp.prepare().then(() => {
  const server = express();

  server.use(morgan("dev"));
  server.use(
    bodyParser.json({
      verify: (req, _, buf) => {
        (req as any).rawBody = buf;
      },
    })
  );
  server.use(function (req, _, next) {
    if (req.method === "POST") {
      console.log("Request Body:", req.body, "URL", req.path);
    }
    next();
  });

  server.use(
    session({
      secret: "parola_secreta_ovidiu",
      resave: false,
      saveUninitialized: true,
      name: "airbnb",
      cookie: {
        secure: false, //CRITICAL on localhost
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days age of the token
      },
      store: sessionStore,
    }),
    passport.initialize(),
    passport.session(),
    fileUpload()
  );

  server.use("/api", apiRouter);

  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
});
