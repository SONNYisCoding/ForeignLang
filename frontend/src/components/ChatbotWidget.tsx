import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState<number | null>(null);

    // Initialize logic
    useEffect(() => {
        if (isOpen && !sessionId) {
            initSession();
        }
    }, [isOpen]);

    const initSession = async () => {
        let guestId = localStorage.getItem('guest_chat_id');
        if (!guestId) {
            guestId = Math.random().toString(36).substring(7);
            localStorage.setItem('guest_chat_id', guestId);
        }

        try {
            const res = await fetch('/api/v1/chat/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestId }),
            });
            const data = await res.json();
            setSessionId(data.id);

            // Load history
            loadHistory(data.id);
        } catch (err) {
            console.error("Failed to init chat session", err);
        }
    };

    const loadHistory = async (sid: number) => {
        try {
            const res = await fetch(`/api/v1/chat/history/${sid}`);
            const data = await res.json();
            setMessages(data.map((m: any) => ({
                id: m.id,
                text: m.content,
                sender: m.sender.toLowerCase()
            })));
        } catch (err) {
            console.error("Failed to load history", err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !sessionId) return;

        const userText = input;
        setInput("");

        // Optimistic update
        setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);

        try {
            const res = await fetch('/api/v1/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    sender: 'USER',
                    content: userText
                })
            });
            const data = await res.json();
            // In a real socket app, we wouldn't need this if we listen to events
            // But here we might wait for a bot reply or poll.
            // For now, let's just wait a bit and reload history or manually append if the backend returns the bot reply immediately (it doesn't in current impl, bot reply is async-ish)

            // Reload history after a short delay to catch the bot reply
            setTimeout(() => loadHistory(sessionId), 1500);

        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col mb-4"
                        style={{ height: '500px' }}
                    >
                        {/* Header */}
                        <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg overflow-hidden">
                                    <img src="/mascot/logofl.png" alt="Mascot" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">ForeignLang Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-indigo-100">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 text-sm mt-10">
                                    Say hello! 👋
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            />
                            <button
                                type="submit"
                                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-300 transition-all hover:scale-110"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} className="group-hover:animate-bounce" />}
            </button>
        </div>
    );
};

export default ChatbotWidget;
