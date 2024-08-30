export interface Emoji extends Record<string, any> {
    native: string;
}

export type EditorValues = {
    image: File | null;
    body: string;
};
