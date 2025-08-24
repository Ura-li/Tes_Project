// import * as React from "react";
import { useState, useEffect } from "react";
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

export default function DatePicker({ value, onChange, variant = "full", className, readOnly = false }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [timeInput, setTimeInput] = useState(
    value && isValid(value) ? format(value, "hh:mm a") : ""
  );
  
  // Keep timeInput in sync if external value changes (e.g., from date picker)
  useEffect(() => {
    if (value && isValid(value)) {
      setTimeInput(format(value, "hh:mm a"));
    }
  }, [value]);
  

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

  const validateAndSubmitTime = () => {
    const raw = timeInput.trim().toUpperCase();
    const numeric = raw.replace(/\D/g, "");
  
    // Case 1: 4-digit input (like 1741)
    if (/^\d{4}$/.test(numeric)) {
      let hour = parseInt(numeric.slice(0, 2), 10);
      let minute = parseInt(numeric.slice(2, 4), 10);
      const total = hour * 100 + minute;
  
      if (total > 2460) {
        handleTimeSelect(0, 0);
        setTimeInput("12:00 AM");
        return;
      }
  
      if (hour > 23) hour = 23;
      if (minute > 59) minute = 59;
  
      const date = setMinutes(setHours(new Date(), hour), minute);
      handleTimeSelect(hour, minute);
      setTimeInput(format(date, "hh:mm a"));
      return;
    }
  
    // Case 2: Typed input like "07:41 PM"
    const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (match) {
      let [, h, m, ampm] = match;
      let hour = parseInt(h, 10);
      const minute = parseInt(m, 10);
  
      if (ampm === "PM" && hour < 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
  
      if (!isNaN(hour) && !isNaN(minute) && minute < 60) {
        const date = setMinutes(setHours(new Date(), hour), minute);
        handleTimeSelect(hour, minute);
        setTimeInput(format(date, "hh:mm a"));
        return;
      }
    }
  
    // Invalid input — revert to current valid time
    if (value && isValid(value)) {
      setTimeInput(format(value, "hh:mm a"));
    } else {
      setTimeInput("12:00 AM");
      handleTimeSelect(0, 0);
    }
  };
  

  return (
    <div className={cn("flex gap-5 items-center ", variant === "icon" && " gap-15")}>
   
      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "border-0 rounded-md text-sm px-2 py-2 flex justify-between w-[200px] bg-none focus:ring-1 hover:ring-blue-500 hover:ring-1",
              variant === "full" && "hover:bg-gray-50 ",
              readOnly && "cursor-not-allowed text-gray-500",
            )}
            disabled={readOnly}
          >
            {/* I want to display the value in here from parameter value too */}
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
      {value && isValid(value) ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={timeInput}
            readOnly={readOnly}
            onChange={(e) => !readOnly && setTimeInput(e.target.value)}
            onBlur={() => !readOnly && validateAndSubmitTime()}
            onKeyDown={(e) => {
              if (!readOnly && e.key === "Enter") {
                validateAndSubmitTime();
              }
            }}
            className={cn(
              "border-0 rounded px-2 py-1 w-full text-sm",
              readOnly && " cursor-not-allowed text-gray-500"
            )}
            placeholder="hhmm or hh:mm AM"
          />


    <Popover open={showTimePicker && !readOnly} onOpenChange={setShowTimePicker}>
      <PopoverTrigger asChild>
        <button 
          className={cn("border rounded p-1", readOnly ? "bg-gray-100 cursor-not-allowed text-gray-400" : "hover:bg-gray-100")}
          disabled={readOnly}
        >
          <Clock className="h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="max-h-[200px] overflow-y-auto p-0  w-[7em]">
        <ul className="divide-y divide-gray-200 w-fit">
          {timeOptions.map(({ hour, minute }) => {
            const isSelected =
              getHours(value) === hour && getMinutes(value) === minute;
            const label = format(
              setMinutes(setHours(new Date(), hour), minute),
              "hh:mm a"
            );

            return (
              <li key={label}>
                <button
                  onClick={() => handleTimeSelect(hour, minute)}
                  className={cn(
                    "w-fit text-left px-4 py-2 text-sm hover:bg-blue-100",
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
        </div>
) : variant === "icon" && "---"}


    </div>
  );
}
