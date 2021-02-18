import express from "express";
import { User, House, Booking } from "../../../models";
import { Op } from "sequelize";
import { normalizeBookings } from "../bookings";
import random from "randomstring";

const hostRouter = express.Router();

hostRouter.get("/list", async (req, res) => {
  if (!req.session?.passport || !req.session?.passport.user) {
    res.writeHead(403, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: "error",
        message: "Unauthorized",
      })
    );

    return;
  }

  const userEmail = req.session.passport.user;
  const user = await User.findOne({ where: { email: userEmail } });

  const houses = await House.findAll({
    where: {
      host: user.id,
    },
  });
  const houseIds = houses.map((house: any) => house.dataValues.id);

  const bookingsData = await Booking.findAll({
    where: {
      paid: true,
      houseId: {
        [Op.in]: houseIds,
      },
      endDate: {
        [Op.gte]: new Date(),
      },
    },
    order: [["startDate", "ASC"]],
  });

  const bookings = await normalizeBookings(
    bookingsData.map((booking: any) => booking.dataValues)
  );

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      bookings,
      houses,
    })
  );
});

hostRouter.post("/new", async (req, res) => {
  const houseData = req.body.house;

  if (!req.session?.passport) {
    res.writeHead(403, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: "error",
        message: "Unauthorized",
      })
    );

    return;
  }

  const userEmail = req.session.passport.user;
  User.findOne({ where: { email: userEmail } }).then((user: any) => {
    houseData.host = user.id;
    House.create(houseData).then(() => {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ status: "success", message: "ok" }));
    });
  });
});

hostRouter.post("/edit", async (req, res) => {
  const houseData = req.body.house;

  if (!req.session?.passport) {
    res.writeHead(403, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: "error",
        message: "Unauthorized",
      })
    );

    return;
  }

  const userEmail = req.session.passport.user;
  User.findOne({ where: { email: userEmail } }).then((user: any) => {
    House.findByPk(houseData.id).then((house: any) => {
      if (house) {
        if (house.host !== user.id) {
          res.writeHead(403, {
            "Content-Type": "application/json",
          });
          res.end(
            JSON.stringify({
              status: "error",
              message: "Unauthorized",
            })
          );

          return;
        }

        House.update(houseData, {
          where: {
            id: houseData.id,
          },
        })
          .then(() => {
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify({ status: "success", message: "ok" }));
          })
          .catch((err: Error) => {
            res.writeHead(500, {
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify({ status: "error", message: err.name }));
          });
      } else {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            message: `Not found`,
          })
        );
        return;
      }
    });
  });
});

hostRouter.post("/image", (req, res) => {
  if (!req.session?.passport) {
    res.writeHead(403, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: "error",
        message: "Unauthorized",
      })
    );

    return;
  }

  const image = req?.files?.image;

  if (!image || Array.isArray(image)) {
    res.writeHead(401, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: "error",
        message: "Bad Request",
      })
    );
  } else {
    const fileName = random.generate(7) + image.name.replace(/\s/g, "");
    const endIndex = __dirname.indexOf("airbnb") + 6;
    const pathToProj = __dirname.substr(0, endIndex);
    const imgPath = pathToProj + "/public/img/houses/" + fileName;

    image.mv(imgPath, (error) => {
      if (error) {
        console.error(error);
        res.writeHead(500, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ status: "error", message: error }));
        return;
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({ status: "success", path: "/img/houses/" + fileName })
      );
    });
  }
});

export default hostRouter;
