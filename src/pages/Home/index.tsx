import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: Date;
  isOwn: boolean;
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hey everyone! Welcome to our global chat! 👋",
    username: "Alex",
    timestamp: new Date(Date.now() - 300000),
    isOwn: false,
  },
  {
    id: "2",
    text: "This is such a beautiful interface! Love the professional design",
    username: "Sarah",
    timestamp: new Date(Date.now() - 240000),
    isOwn: false,
  },
  {
    id: "3",
    text: "Thanks! The blue theme is really clean and professional",
    username: "Mike",
    timestamp: new Date(Date.now() - 180000),
    isOwn: false,
  },
  {
    id: "4",
    text: "Anyone working on interesting projects lately?",
    username: "Emma",
    timestamp: new Date(Date.now() - 120000),
    isOwn: false,
  },
];

const generateRandomUsername = () => {
  const adjectives = ["Cool", "Smart", "Happy", "Bright", "Swift", "Kind", "Bold", "Calm", "Quick", "Wise"];
  const nouns = ["User", "Chat", "Friend", "Guest", "Member", "Person", "Visitor", "Buddy", "Pal", "Mate"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

export function Home() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [username] = useState(generateRandomUsername());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      username,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="border-b bg-card/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary text-xl">👥</span>
            <div>
              <h2 className="text-lg font-semibold">Global Discussion</h2>
              <p className="text-sm text-muted-foreground">
                Welcome, {username}! Join the conversation with {messages.length} messages
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="text-xs bg-primary/10 text-primary border">
                {message.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className={`flex flex-col gap-1 max-w-xs sm:max-w-md ${message.isOwn ? "items-end" : "items-start"}`}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {!message.isOwn && <span className="font-medium">{message.username}</span>}
                <span>{formatTime(message.timestamp)}</span>
              </div>

              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card text-card-foreground rounded-bl-md border"
                }`}
              >
                <p className="text-sm leading-relaxed text-pretty">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-card/50 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-background border-border resize-none min-h-[44px] rounded-2xl"
              maxLength={500}
            />
          </div>
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="w-11 h-11 rounded-full flex-shrink-0">
            <span className="text-sm">➤</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
