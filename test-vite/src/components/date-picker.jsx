import * as React from "react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, getYear, setMonth as setMonthOfDate, setYear } from "date-fns";
import "react-day-picker/dist/style.css";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // adjust path
import { cn } from "@/lib/utils"; // adjust path
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, LucideCalendarDays } from "lucide-react";

export default function DatePicker({ value, onChange }) {
  const [selected, setSelected] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());

  const handleSelect = (date) => {
    onChange(date);
  };

  const handleMonthSelect = (monthIndex) => {
    setViewDate(prev => setMonthOfDate(prev, monthIndex));
  };

  const handleYearChange = (direction) => {
    setViewDate(prev => setYear(prev, getYear(prev) + direction));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-2 py-2 border rounded-md  text-sm hover:bg-gray-50">
          {/* {selected ? format(selected, "PPP") : "Select date"} */}
          <LucideCalendarDays className=" h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex w-auto gap-4 p-4">
        {/* Left Calendar */}
        <div className="flex flex-col items-center">
      <DayPicker
        mode="single"
        selected={value}
        onSelect={handleSelect}
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

        {/* Right Month Selector */}
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-2">
            <div className="text-sm font-semibold">
              {getYear(viewDate)}
            </div>
            <div className="">
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
  );
}
