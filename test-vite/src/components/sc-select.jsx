import React from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
   
  export function SelectBar({ id, onChange, value, options, placeholder }) {
    console.log("SelectBar value:", value);
    const handleValueChange = (selectedValue) => {
      // Avoid looping by only firing if value actually changes
      if (selectedValue !== value) {
        onChange({ target: { id, value: selectedValue } });
      }
    };

    return (
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full border-black">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
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
        <SelectTrigger className="w-[200px] border-b-black">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Depot Repair">Depot Repair</SelectItem>
            <SelectItem value="Item2">Item 2</SelectItem>
            <SelectItem value="Item3">Item 3</SelectItem>
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
