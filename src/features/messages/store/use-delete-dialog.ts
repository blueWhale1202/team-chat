import { atom, useAtom } from "jotai";

const isOpen = atom(false);

export const useDeleteMessageDialog = () => useAtom(isOpen);
