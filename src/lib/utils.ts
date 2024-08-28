import { type ClassValue, clsx } from "clsx";
import { Charset, charset, generate } from "referral-codes";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateJoinCode = () => {
    return generate({
        length: 6,
        charset: charset(Charset.NUMBERS),
    })[0];
};

export const parsedName = (name: string) => {
    return name.replace(/\s+/g, "-").toLowerCase();
};
