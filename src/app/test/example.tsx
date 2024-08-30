"use client";

import { useConfirm } from "./confirm-provider";

export const ExampleComponent: React.FC = () => {
    const confirm = useConfirm();

    const handleDeletePost = async () => {
        const isConfirmed = await confirm(
            "Delete Post",
            "Are you sure you want to delete this post?"
        );
        if (isConfirmed) {
            // Perform delete operation
            console.log("Post deleted");
        }
    };

    const handleDeleteMessage = async () => {
        const isConfirmed = await confirm(
            "Delete message",
            "Do you want to delete this message?"
        );
        if (isConfirmed) {
            // Perform delete operation
            console.log("Message deleted");
        }
    };

    return (
        <div className="space-x-4">
            <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-500 text-white rounded"
            >
                Delete Post
            </button>
            <button
                onClick={handleDeleteMessage}
                className="px-4 py-2 bg-red-500 text-white rounded"
            >
                Delete Message
            </button>
        </div>
    );
};
