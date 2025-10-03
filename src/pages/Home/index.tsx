import { useState, useRef, useEffect, useCallback } from "react";
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

const API_URL = import.meta.env.VITE_API_URL;

export function Home() {
  const auth = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [nextKey, setNextKey] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchMessages = useCallback(
    async (key: string | null = null) => {
      try {
        const res = await axios.get(API_URL, { params: { lastKey: key, limit: 10 } });
        const items = res.data.items || [];
        const parsed: Message[] = items.map((item: any) => ({
          id: item.messageId,
          text: item.text,
          username: String(item.username || "Unknown"),
          timestamp: new Date(item.timestamp_utc_iso8601 || Date.now()),
          isOwn: item.username === auth.user?.profile["cognito:username"],
        }));

        if (key) {
          setMessages((prev) => [...prev, ...parsed]);
        } else {
          setMessages(parsed);
        }
        setNextKey(res.data.nextKey || null);
      } catch (err) {
        console.error("Erreur fetching messages:", err);
      }
    },
    [auth.user],
  );

  useEffect(() => {
    fetchMessages(); // premier lot
  }, [fetchMessages]);

  // IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && nextKey && !loadingMore) {
          setLoadingMore(true);
          fetchMessages(nextKey).finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: "100px" }, // déclenche un peu avant
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [nextKey, loadingMore, fetchMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const body = { username: auth.user?.profile["cognito:username"], text: newMessage.trim() };
      await axios.post(API_URL, body, { headers: { "Content-Type": "application/json" } });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: newMessage.trim(),
          username: String(auth.user?.profile["cognito:username"] || "Unknown"),
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
              Welcome, <strong>{String(auth.user?.profile["cognito:username"])}</strong>! Join the conversation with {messages.length}{" "}
              messages
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

        {/* Sentinel pour scroll infini */}
        {nextKey && (
          <div ref={loadMoreRef} className="h-10 flex justify-center items-center text-muted-foreground text-sm">
            Loading more…
          </div>
        )}

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
