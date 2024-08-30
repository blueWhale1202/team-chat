"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";

interface Message {
    id: number;
    text: string;
    // timestamp: Date;
}

const initData: Message[] = Array(20)
    .fill(0)
    .map((_, index) => ({
        id: index,
        text: `Text: ${index + 1}`,
    }));

export default function Component() {
    const [messages, setMessages] = useState<Message[]>(initData);
    const [inputMessage, setInputMessage] = useState("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const addMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now(),
            text,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            addMessage(inputMessage);
            setInputMessage("");
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md mx-auto">
            <ScrollArea
                className="flex-grow border rounded-t-md p-4"
                ref={scrollAreaRef}
            >
                {messages.map((message) => (
                    <div key={message.id} className="mb-2">
                        <span className="font-bold">
                            {/* {message.timestamp.toLocaleTimeString()}:{" "} */}
                        </span>
                        {message.text}
                    </div>
                ))}

                <div ref={bottomRef} />
            </ScrollArea>
            <div className="flex mt-2">
                <Input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-grow"
                />
                <Button onClick={handleSendMessage} className="ml-2">
                    Send
                </Button>
            </div>
        </div>
    );
}
