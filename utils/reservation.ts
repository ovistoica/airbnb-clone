import axios from "axios";

export const getBookedDates = async (houseId: string) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/houses/booked",
      { houseId }
    );
    if (response.data.status === "error") {
      alert(response.data.message);
      return;
    }
    return response.data.dates;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const canReserve = async (
  houseId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/houses/check",
      { houseId, startDate, endDate }
    );
    if (response.data.status === "error") {
      alert(response.data.message);
      return;
    }

    if (response.data.message === "busy") return false;
    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};
