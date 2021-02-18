import { Router } from "express";
import { User } from "../../../models";
import passport from "passport";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end(); // Method not allowed
    return;
  }

  const { email, password, passwordConfirmation } = req.body;

  if (password !== passwordConfirmation) {
    res
      .status(401)
      .end(
        JSON.stringify({ status: "error", message: "Passwords do not match" })
      );
    return;
  }

  try {
    const user = await User.create({ email, password });

    // Login user using passport
    req.login(user, (err) => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ stats: "error", message: err }));
      }

      return res.end(
        JSON.stringify({ status: "success", message: "Logged in" })
      );
    });
  } catch (err) {
    console.error("ERROR", err);
    res.statusCode = 500;
    let message = "An error occurred";
    if (err.name === "SequelizeUniqueConstraintError") {
      message = "User already exists";
    }
    res.end(JSON.stringify({ status: "error", message }));
  }
});

authRouter.post("/logout", async (req, res) => {
  req.logout();
  req.session?.destroy((err) => {
    if (err) {
      console.log("There was an error destroying session", err);
    }
    console.log("Session succesfully destroyed");
  });
  return res.end(JSON.stringify({ status: "success", message: "Logged out" }));
});

authRouter.post("/login", async (req, res, next) => {
  if (req.method !== "POST") {
    res.status(405).end(); // Method not allowed
    return;
  }
  passport.authenticate("local", async (err, user: User, _) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ status: "error", message: err }));
      return;
    }
    if (!user) {
      res.statusCode = 404;
      res.end(
        JSON.stringify({
          status: "not found",
          message: "User not found. Please check credentials",
        })
      );
      return;
    }

    req.login(user, (err) => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ status: "error", message: err }));
        return;
      }
      return res.end(
        JSON.stringify({ status: "success", message: "Logged in" })
      );
    });
  })(req, res, next);
});

export default authRouter;
