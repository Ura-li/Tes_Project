import * as React from "react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  format,
  getYear,
  setMonth as setMonthOfDate,
  setYear,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  isValid
} from "date-fns";
import "react-day-picker/dist/style.css";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, LucideCalendarDays, Clock } from "lucide-react";

export default function DatePicker({ value, onChange, variant = "full", className }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateSelect = (date) => {
    if (!date) {
      onChange(null);
      setShowTimePicker(false);
      return;
    }

    const updated = new Date(date);
    const currentHour = value && isValid(value) ? getHours(value) : 0;
    const currentMinute = value && isValid(value) ? getMinutes(value) : 0;
    updated.setHours(currentHour, currentMinute);

    onChange(updated);
    setShowDatePicker(false);
  };

  const handleTimeSelect = (hour, minute) => {
    if (!value || !isValid(value)) return;
    const updated = setMinutes(setHours(value, hour), minute);
    onChange(updated);
    setShowTimePicker(false);
  };

  const handleMonthSelect = (monthIndex) => {
    setViewDate(prev => setMonthOfDate(prev, monthIndex));
  };

  const handleYearChange = (direction) => {
    setViewDate(prev => setYear(prev, getYear(prev) + direction));
  };

  const timeOptions = Array.from({ length: 48 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? 0 : 30;
    return { hour, minute };
  });

  return (
    <div className="flex gap-2">
      {/* Date Picker */}
      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "border rounded-md text-sm px-2 py-2 flex justify-between w-[160px]",
              variant === "full" && "hover:bg-gray-50"
            )}
          >
            {value && isValid(value) ? format(value, "dd/M/yyyy") : "---"}
            <LucideCalendarDays className="h-4 w-4 ml-2" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="flex w-auto gap-4 p-4">
          <div className="flex flex-col items-center">
            <DayPicker
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              month={viewDate}
              onMonthChange={setViewDate}
              showOutsideDays
              fixedWeeks
              captionLayout="label"
              classNames={{
                day: "w-9 h-9 text-sm hover:bg-blue-100 rounded-full",
                day_selected: "bg-blue-500 text-white rounded-full",
                day_today: "border border-blue-500",
              }}
              components={{
                PreviousMonthButton: ({ onClick }) => (
                  <button onClick={onClick} className="p-1 hover:bg-gray-200 rounded">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                ),
                NextMonthButton: ({ onClick }) => (
                  <button onClick={onClick} className="p-1 hover:bg-gray-200 rounded">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                ),
              }}
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-2">
              <div className="text-sm font-semibold">{getYear(viewDate)}</div>
              <div>
                <button
                  onClick={() => handleYearChange(-1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ArrowUp className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => handleYearChange(1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ArrowUp className="h-4 w-4 rotate-180" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {[
                "Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"
              ].map((m, idx) => (
                <button
                  key={m}
                  onClick={() => handleMonthSelect(idx)}
                  className={cn(
                    "text-sm py-1 rounded-md text-center hover:bg-blue-100 w-14 p-3",
                    viewDate.getMonth() === idx && "bg-blue-500 text-white font-bold"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Time Picker — Only shown if a valid date is selected */}
      {value && isValid(value) && (
        <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
          <PopoverTrigger asChild>
            <button
              className="border rounded-md text-sm px-2 py-2 flex items-center gap-2 w-[120px]"
            >
              {format(value, "HH:mm")}
              <Clock className="h-4 w-4" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-[120px] max-h-[200px] overflow-y-auto p-0">
            <ul className="divide-y divide-gray-200">
              {timeOptions.map(({ hour, minute }) => {
                const isSelected =
                  getHours(value) === hour && getMinutes(value) === minute;
                const label = `${hour.toString().padStart(2, "0")}:${minute
                  .toString()
                  .padStart(2, "0")}`;
                return (
                  <li key={label}>
                    <button
                      onClick={() => handleTimeSelect(hour, minute)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-blue-100",
                        isSelected && "bg-blue-500 text-white font-semibold"
                      )}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
