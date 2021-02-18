import { Strategy } from "passport-local";
import { User } from "../models";

export const AuthStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    if (!email || !password) {
      done("Email and password required");
      return;
    }
    const user: User = await User.findOne({ where: { email } });

    if (!user) {
      done("User not found");
    }

    const valid = await user.isPasswordValid(password);

    if (!valid) {
      done("Email and password do not match");
      return;
    }

    done(undefined, user);
  }
);

export function serializeUser(
  user: User,
  done: (error: any, id?: string) => void
): void {
  done(null, user.email);
}

export const deserializeUser = (
  email: string,
  done: (error: any, user?: User) => void
) => {
  User.findOne({ where: { email: email } }).then((user: User) => {
    done(null, user);
  });
};
