import Quill, { QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import "quill/dist/quill.snow.css";

import {
    MutableRefObject,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { ALargeSmall, ImageIcon, SendHorizonal, Smile } from "lucide-react";
import { Hint } from "./hint";
import { Button } from "./ui/button";

import { cn } from "@/lib/utils";

type EditorValues = {
    image: File | null;
    body: string;
};

type Props = {
    variant?: "create" | "update";
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    onSubmit: ({ image, body }: EditorValues) => void;
    onCancel?: () => void;
};

const Editor = ({
    variant = "create",
    placeholder = "Write something...",
    defaultValue = [],
    disabled = false,
    innerRef,
    onSubmit,
    onCancel,
}: Props) => {
    const [text, setText] = useState("");
    const [isToolbarVisible, setIsToolbarVisible] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );
        const option: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                console.log("Submit form");
                                return;
                            },
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(
                                    quill.getSelection()?.index || 0,
                                    "\n"
                                );
                            },
                        },
                    },
                },
            },
        };

        const quill = new Quill(editorContainer, option);
        quillRef.current = quill;

        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        });

        return () => {
            if (container) {
                container.innerHTML = "";
            }

            quill.off(Quill.events.TEXT_CHANGE);

            if (quillRef) {
                quillRef.current = null;
            }

            if (innerRef) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    const toggleToolbar = () => {
        setIsToolbarVisible(!isToolbarVisible);
        const toolbarElement =
            containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden");
        }
    };

    const isEmpty = text.replace(/<(.|\n)*?/g, "").trim().length === 0;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:shadow-sm focus-within:border-slate-300 transition bg-white">
                <div ref={containerRef} className="h-full ql-custom"></div>

                <div className="flex px-2 pb-2 z-[5]">
                    <Hint
                        label={
                            isToolbarVisible
                                ? "Hide formatting"
                                : "Show formatting"
                        }
                    >
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            disabled={disabled}
                            onClick={toggleToolbar}
                        >
                            <ALargeSmall className="size-4" />
                        </Button>
                    </Hint>

                    <Hint label="Emoji">
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            disabled={disabled}
                        >
                            <Smile className="size-4" />
                        </Button>
                    </Hint>

                    {variant === "create" && (
                        <Hint label="Image">
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                disabled={disabled}
                            >
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    )}

                    {variant === "create" && (
                        <Button
                            size="icon-sm"
                            disabled={disabled || isEmpty}
                            className={cn(
                                "ml-auto",
                                isEmpty
                                    ? " bg-muted hover:bg-muted text-muted-foreground "
                                    : " bg-[#007a5a] hover:bg-[#007a5a]/80 text-white "
                            )}
                        >
                            <SendHorizonal className="size-4" />
                        </Button>
                    )}

                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={disabled}
                            >
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className=" bg-[#007a5a] hover:bg-[#007a5a]/80 "
                                disabled={disabled || isEmpty}
                            >
                                <span className="text-white">Save</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
                <p>
                    <strong>Shift + Enter</strong> to add new line
                </p>
            </div>
        </div>
    );
};

export default Editor;
