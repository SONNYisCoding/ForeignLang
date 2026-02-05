import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 How can I help you improve your English today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // User message
        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Mock response
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                text: "Thanks for your message! Our AI support agent is currently offline, but you can explore our specific topics in the Dashboard!",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
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
                                    <img src="/mascot/main.png" alt="Assistant" className="w-full h-full object-cover" />
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
