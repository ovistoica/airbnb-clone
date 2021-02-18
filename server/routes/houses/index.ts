import { Router } from "express";
import { House, Review, User, Booking } from "../../../models";
import { Op } from "sequelize";
import { getDatesBetweenDates } from "../../../utils/date";

const houseRouter = Router();

const canBookThoseDates = async (
  houseId: number,
  startDate: Date,
  endDate: Date
) => {
  const results = await Booking.findAll({
    where: {
      houseId: houseId,
      startDate: {
        [Op.lte]: new Date(endDate),
      },
      endDate: {
        [Op.gte]: new Date(startDate),
      },
    },
  });
  return !(results.length > 0);
};

houseRouter.get("/", async (_, res) => {
  const result = await House.findAndCountAll();
  const houses = result.rows.map((house: House[]) => (house as any).dataValues);
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(houses));
});

houseRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const house = await House.findByPk(id);
  if (house) {
    const reviews = await Review.findAndCountAll({
      where: { houseId: house.id },
    });
    house.dataValues.reviews = reviews.rows.map(
      (review: any) => review.dataValues
    );
    house.dataValues.reviewCount = reviews.count;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(house));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ status: "not found", message: "House not found" })
    );
  }
});

houseRouter.post("/reserve", async (req, res) => {
  if (!(req.session && req.session.passport)) {
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

  if (
    !(await canBookThoseDates(
      req.body.houseId,
      req.body.startDate,
      req.body.endDate
    ))
  ) {
    //busy
    res.writeHead(401, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: "Unauthorized",
        message: "House is already booked",
      })
    );

    return;
  }

  const userEmail = req.session?.passport.user;
  User.findOne({ where: { email: userEmail } }).then((user: any) => {
    Booking.create({
      houseId: req.body.houseId,
      userId: user.id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      sessionId: req.body.sessionId,
      paid: false,
    }).then(() => {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ status: "success", message: "ok" }));
    });
  });
});

houseRouter.post("/booked", async (req, res) => {
  const houseId = req.body.houseId;

  const results = await Booking.findAll({
    where: {
      houseId: houseId,
      endDate: {
        [Op.gte]: new Date(),
      },
    },
  });

  let bookedDates: Date[] = [];

  for (const result of results) {
    const dates = getDatesBetweenDates(
      new Date(result.startDate),
      new Date(result.endDate)
    );

    bookedDates = [...bookedDates, ...dates];
  }

  //remove duplicates
  bookedDates = [...new Set(bookedDates.map((date) => date))];

  res.json({
    status: "success",
    message: "ok",
    dates: bookedDates,
  });
});

houseRouter.post("/check", async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const houseId = req.body.houseId;

  let message = "free";
  if (!(await canBookThoseDates(houseId, startDate, endDate))) {
    message = "busy";
  }

  res.json({
    status: "success",
    message: message,
  });
});

export default houseRouter;
