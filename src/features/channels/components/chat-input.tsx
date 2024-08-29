import dynamic from "next/dynamic";
import { useRef } from "react";

import Quill from "quill";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type Props = {
    placeholder: string;
};

export const ChatInput = ({ placeholder }: Props) => {
    const editorRef = useRef<Quill>(null);

    return (
        <div className="px-5 w-full">
            <Editor
                placeholder={placeholder}
                onSubmit={() => {}}
                disabled={false}
                innerRef={editorRef}
            />
        </div>
    );
};
