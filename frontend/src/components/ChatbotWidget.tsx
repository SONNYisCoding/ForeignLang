import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UiverseLoader from './ui/UiverseLoader';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const WELCOME_MESSAGE: ChatMessage = {
    id: 0,
    text: 'Xin chào! 👋 Tôi là trợ lý ForeignLang. Bạn muốn hỏi gì về việc học tiếng Anh chuyên nghiệp?',
    sender: 'bot'
};

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
            if (!sessionId) initSession();
        }
    }, [isOpen]);

    const initSession = async () => {
        let guestId = localStorage.getItem('guest_chat_id');
        if (!guestId) {
            guestId = crypto.randomUUID?.() || Math.random().toString(36).substring(7);
            localStorage.setItem('guest_chat_id', guestId);
        }

        try {
            const res = await fetch('/api/v1/chat/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ guestId }),
            });
            if (!res.ok) throw new Error('Session init failed');
            const data = await res.json();
            setSessionId(data.id);
            loadHistory(data.id);
        } catch (err) {
            console.error('Failed to init chat session', err);
        }
    };

    const loadHistory = async (sid: number) => {
        try {
            const res = await fetch(`/api/v1/chat/history/${sid}`, { credentials: 'include' });
            if (!res.ok) return;
            const data = await res.json();
            if (data.length > 0) {
                setMessages([
                    WELCOME_MESSAGE,
                    ...data.map((m: any) => ({
                        id: m.id,
                        text: m.content,
                        sender: m.sender.toLowerCase() as 'user' | 'bot',
                    })),
                ]);
            }
        } catch (err) {
            console.error('Failed to load history', err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || !sessionId || isTyping) return;

        setInput('');

        // Optimistic: show user message immediately
        const userMsg: ChatMessage = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);

        // Show typing indicator
        setIsTyping(true);

        try {
            const res = await fetch('/api/v1/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ sessionId, sender: 'USER', content: text }),
            });

            if (!res.ok) throw new Error('Send failed');

            // Bot reply is now synchronous – reload history to get the bot's response
            const historyRes = await fetch(`/api/v1/chat/history/${sessionId}`, { credentials: 'include' });
            if (historyRes.ok) {
                const data = await historyRes.json();
                setMessages([
                    WELCOME_MESSAGE,
                    ...data.map((m: any) => ({
                        id: m.id,
                        text: m.content,
                        sender: m.sender.toLowerCase() as 'user' | 'bot',
                    })),
                ]);
            }
        } catch (err) {
            console.error('Failed to send message', err);
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.', sender: 'bot' },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickReplies = [
        'ForeignLang có những tính năng gì?',
        'Gói Premium khác gì Free?',
        'How to write a professional email?',
    ];

    const handleQuickReply = (text: string) => {
        setInput(text);
        setTimeout(() => {
            const form = document.getElementById('chatbot-form') as HTMLFormElement;
            form?.requestSubmit();
        }, 50);
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col mb-4"
                        style={{ height: '520px' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                    <img src="/mascot/logofl.png" alt="ForeignLang" className="w-6 h-6 object-contain" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">ForeignLang Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-indigo-200">Powered by AI</span>
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
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                                            : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-2xl rounded-tl-sm'
                                            }`}
                                        style={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm p-3 flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Quick replies (show only if no user messages yet) */}
                            {messages.length <= 1 && !isTyping && (
                                <div className="space-y-2 mt-2">
                                    {quickReplies.map((text, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleQuickReply(text)}
                                            className="block w-full text-left text-sm px-3 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition"
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form id="chatbot-form" onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                disabled={isTyping}
                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-[44px] h-[44px]"
                            >
                                {isTyping ? <div className="scale-50 -ml-2"><UiverseLoader /></div> : <Send size={18} />}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full shadow-lg shadow-indigo-300/50 transition-all"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
};

export default ChatbotWidget;
