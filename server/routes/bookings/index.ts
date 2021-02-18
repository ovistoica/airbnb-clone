import express from "express";
import { Booking, House, User } from "../../../models";
import { TBooking } from "../../../interfaces";
import { Op } from "sequelize";

const bookingRouter = express.Router();

export async function normalizeBookings(bookings: any[]): Promise<TBooking[]> {
  const result = await Promise.all(
    bookings.map(async (booking) => {
      const house = await House.findByPk(booking.houseId);
      return {
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        house: house.dataValues,
      } as TBooking;
    })
  );
  return result;
}

bookingRouter.post("/clean", (_, res) => {
  Booking.destroy({
    where: {
      paid: false,
    },
  });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      status: "success",
      message: "ok",
    })
  );
});

//TODO Get only for current userID
bookingRouter.get("/list", async (req, res) => {
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
  const result: {
    rows: Booking[];
    count: number;
  } = await Booking.findAndCountAll({
    where: {
      paid: true,
      userId: user.id,
      endDate: {
        [Op.gte]: new Date(),
      },
    },
    order: [["startDate", "ASC"]],
  });

  const bookings = result.rows.map((booking) => (booking as any).dataValues);
  const finalBookings = await normalizeBookings(bookings);

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(finalBookings));
});

export default bookingRouter;
