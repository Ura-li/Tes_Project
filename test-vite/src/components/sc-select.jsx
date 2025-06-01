// import {useState, useEffect, useMemo} from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Archive, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { useEffect, useRef, useState } from "react";

export const SearchCommandBlock = ({
  options = [],
  value,
  onChange,
  placeholder = "Search...",
  renderLabel = (opt) => opt.label || opt,
  getValue = (opt) => opt.value || opt,
}) => {
  const [open, setOpen] = useState(false);
  const [positionAbove, setPositionAbove] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((opt) => getValue(opt) === value);

useEffect(() => {
    if (!open || !inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = 240; // max height (same as tailwind: max-h-60)
    const spaceBelow = window.innerHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setPositionAbove(true);
    } else {
      setPositionAbove(false);
    }
  }, [open]);

  const handleBlur = (e) => {
  setTimeout(() => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(document.activeElement)
    ) {
      setOpen(false);
    }
  }, 150);
};

  return (
    <div className="relative w-full">
      {selectedOption ? (
        <div className="flex items-center justify-start px-3 py-2 border rounded-md gap-2">
          <Archive color="blue"></Archive>
          <span className="text-md text-blue-500 font-black">{renderLabel(selectedOption)}</span>
          <button
            onClick={() => onChange(null)}
            className="ml-2  hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Command className="w-full">
          <CommandInput
          ref={inputRef}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onBlur={handleBlur}
          />
          {open && (
            <CommandList 
            ref={dropdownRef}
            className={`absolute z-50 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-y-auto ${
              positionAbove ? "bottom-full mb-2" : "top-full mt-2"
            }`}
            >
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={getValue(opt)}
                    onSelect={() => {
                      onChange(getValue(opt));
                      setOpen(false);
                    }}
                  >
          <Archive></Archive>
                    {renderLabel(opt)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      )}
    </div>
  );
};
   
  export function SelectBar({ id, onChange, value, options, placeholder }) {
    return (
      <Select value={value} onValueChange={(val) => onChange({ target: { id, value: val } })}>
        <SelectTrigger className="w-full border-black">
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.id} value={opt.name}>
                {opt.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }




  

  export function SelectBar1({ id, onChange, value }) {
    return (
      <Select value={value} onValueChange={(value) => onChange({ target: { id, value}})}>
        <SelectTrigger className="w-full border-black">
          <SelectValue placeholder="Select Salutation"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Mr. ">Mr. </SelectItem>
            <SelectItem value="Mrs. ">Mrs. </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  export function SelectBar2({ id, onChange, value }) {
    return (
      <Select value={value} onValueChange={(value) => onChange({ target: { id, value}})}>
        <SelectTrigger className="w-full  border-black">
          <SelectValue placeholder="Select Prefered Language"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  export function SelectBar3({ value, onChange }) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px] border-b-black ring-1 ring-gray-400 rounded-lg">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* { id: "Depot Repair", name: "Depot Repair" },
                { id: "Onsite", name: "Onsite" },
                { id: "Bench", name: "Bench" }, */}
            <SelectItem value="Depot Repair">Depot Repair</SelectItem>
            <SelectItem value="Onsite">Onsite</SelectItem>
            <SelectItem value="Bench">Bench</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  export function SelectBarContact() {
    return (
      <Select>
        <SelectTrigger className="w-[150px] border-black h-8">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Item1">Item 1</SelectItem>
            <SelectItem value="Item2">Item 2</SelectItem>
            <SelectItem value="Item3">Item 3</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  export function SelectBarContact2() {
    return (
      <Select>
        <SelectTrigger className="w-[330px]  border-black h-8">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Item1">Item 1</SelectItem>
            <SelectItem value="Item2">Item 2</SelectItem>
            <SelectItem value="Item3">Item 3</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  export function SelectBarContact3() {
    return (
      <Select>
        <SelectTrigger className="w-[330px] border-black h-8">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Indonesia">Indonesia</SelectItem>
            <SelectItem value="Malaysia">Malaysia</SelectItem>
            <SelectItem value="Singapura">Singapura</SelectItem>
            <SelectItem value="Inggris">Inggris</SelectItem>
            <SelectItem value="Cina">Cina</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  export function SelectBarContact4({ id, onChange }) {
    return (
      <Select onValueChange={(value) => onChange({ target: { id, value}})}>
        <SelectTrigger className="w-[150px] border-black">
          <SelectValue placeholder="Select Salutation"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Mr. ">Mr. </SelectItem>
            <SelectItem value="Mrs. ">Mrs. </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ) 
  }

  export function SelectBarRelated() {
    return (
      <Select>
        <SelectTrigger className="w-[90px] mt-0.5 h-7 font-semibold rounded-r-2xl border-none">Related
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Item">Item</SelectItem>
            <SelectItem value="Item">Item</SelectItem>
            <SelectItem value="Item">Item</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  export function SelectYN({ value, onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full hover:shadow-lg border-b-0">
        {/* Menampilkan value terpilih */}
        <span>{value}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
