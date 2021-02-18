"use strict";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { DateUtils } from "react-day-picker";
import { useState } from "react";
import { calcNumberOfNightsBetweenDates } from "../utils/date";

const parseDate = (str: string, format: string, locale: any) => {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
};

const formatDate = (date: Date | number, format: string, locale: any) =>
  dateFnsFormat(date, format, { locale });

const format = "dd MMM yyyy";

interface DateRangePickerProps {
  datesChanged: (startDate: Date | string, endDate: Date | string) => void;
  bookedDates: string[];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  datesChanged,
  bookedDates,
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const ignoredDates = bookedDates.map((date) => new Date(date));

  const onStartDateChange = (day: Date) => {
    setStartDate(day);
    if (calcNumberOfNightsBetweenDates(day, endDate) < 1) {
      const newEndDate = new Date(day);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate);
      datesChanged(day, newEndDate);
    }
  };

  return (
    <div className="date-range-picker-container">
      <div>
        <label>From:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          onDayChange={onStartDateChange}
          value={startDate}
          dayPickerProps={{
            modifiers: {
              disabled: [
                ...ignoredDates,
                {
                  before: new Date(),
                },
              ],
            },
          }}
        />
      </div>
      <div>
        <label>To:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          value={endDate}
          dayPickerProps={{
            modifiers: {
              disabled: [
                startDate,
                ...ignoredDates,
                {
                  before: startDate,
                },
              ],
            },
          }}
          onDayChange={(day: Date) => {
            setEndDate(day);
            datesChanged(startDate, day);
          }}
        />
      </div>
      <style jsx>{`
        .date-range-picker-container div {
          display: grid;
          border: 1px solid #ddd;
          grid-template-columns: 30% 70%;
          padding: 10px;
        }
        label {
          padding: 10px;
        }
      `}</style>
      <style jsx global>{`
        .DayPickerInput input {
          width: 120px;
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default DateRangePicker;
