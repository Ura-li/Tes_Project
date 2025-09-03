import React from "react";
import { Lock } from "lucide-react";
import { CardTitle } from "./ui/card";
import { twMerge } from "tailwind-merge";

const spanMap = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
};

const CaseField = ({ label, children, lock = false, span = 1, className, childClass, star }) => {
    // Determine which lock to use
    const IconComponent = lock === true ? Lock : lock || null;
    const modifiedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && lock) {
            return React.cloneElement(child, { readOnly: true });
        }
        return child;
    });
    return (
        <>
            <CardTitle className={twMerge(
                `font-medium flex  items-center gap-4 ${className}`
            )}>
                {IconComponent ? (
                    <IconComponent className="size-4 shrink-0" />
                ) : (
                    <div className="w-5" />
                )}
                {label}
                {star ? <span className="text-red-400">*</span> : ""}
            </CardTitle>
            <CardTitle className={twMerge(spanMap[span], childClass)}>
                {modifiedChildren}
            </CardTitle>
        </>
    );
};

export default CaseField;