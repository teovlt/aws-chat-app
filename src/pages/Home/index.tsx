import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "react-oidc-context";

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: Date;
  isOwn: boolean;
}

const API_URL = "https://xvkzbvpitd.execute-api.eu-west-1.amazonaws.com/prod/api/messages";

const generateRandomUsername = () => {
  const adjectives = ["Cool", "Smart", "Happy", "Bright", "Swift", "Kind", "Bold", "Calm", "Quick", "Wise"];
  const nouns = ["User", "Chat", "Friend", "Guest", "Member", "Person", "Visitor", "Buddy", "Pal", "Mate"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

export function Home() {
  const auth = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
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

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(API_URL);

        const items = res.data.items || [];

        const parsedMessages: Message[] = items.map((item: any) => ({
          id: item.messageId,
          text: item.content,
          username: String(item.username || "Unknown"),
          timestamp: new Date(item.timestamp_utc_iso8601 || Date.now()),
          isOwn: item.username === username,
        }));

        setMessages(parsedMessages);
      } catch (err) {
        console.error("Erreur fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const body = { username, content: newMessage.trim() };
      await axios.post(API_URL, body, {
        headers: { "Content-Type": "application/json" },
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          text: newMessage.trim(),
          username,
          timestamp: new Date(),
          isOwn: true,
        },
      ]);

      setNewMessage("");
      inputRef.current?.focus();
      scrollToBottom();
    } catch (err) {
      console.error("Erreur sending message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-primary text-xl">👥</span>
          <div>
            <h2 className="text-lg font-semibold">Global Discussion</h2>
            <p className="text-sm text-muted-foreground">
              Welcome, <strong>{auth.user?.profile.email}</strong> ! Join the conversation with {messages.length} messages
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Live
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
      <div className="border-t bg-card/50 p-4 flex gap-3 items-end">
        <Input
          ref={inputRef}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-background border-border resize-none min-h-[44px] rounded-2xl"
          maxLength={500}
        />
        <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="w-11 h-11 rounded-full flex-shrink-0">
          <span className="text-sm">➤</span>
        </Button>
      </div>
    </div>
  );
}
