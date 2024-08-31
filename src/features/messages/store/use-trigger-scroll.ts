import { atom, useAtom } from "jotai";

const isScroll = atom(0);

export const useTriggerScroll = () => useAtom(isScroll);
