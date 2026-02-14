
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, User, Lock, Key, Clock, Disc, ShieldAlert, Cpu } from "lucide-react";
import { api, ChatMessage } from "../../services/api";

const SystemLog = ({ text, type = 'info' }: { text: string, type?: 'info' | 'warn' | 'error' | 'success' }) => {
    const color = {
        info: 'text-blue-400',
        warn: 'text-yellow-400',
        error: 'text-red-500',
        success: 'text-green-400'
    }[type];

    return (
        <div className="flex items-center gap-2 text-xs font-mono opacity-70 mb-1">
            <span className={color}>[{type.toUpperCase()}]</span>
            <span className="text-zinc-500">{new Date().toLocaleTimeString()}</span>
            <span className="text-zinc-400">{text}</span>
        </div>
    );
};

const ChatSection = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [authError, setAuthError] = useState("");
    const [terminalLines, setTerminalLines] = useState<string[]>([]); // For boot sequence effect

    // Init boot sequence
    useEffect(() => {
        const bootText = [
            "Initializing secure connection...",
            "Resolving proxy servers...",
            "Handshake established.",
            "Loading PPLG-3_NEXUS protocol v2.0...",
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < bootText.length) {
                setTerminalLines(prev => [...prev, bootText[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 300);

        // Check Login
        const cachedUser = localStorage.getItem("chat_user");
        if (cachedUser) {
            setUsername(cachedUser);
            setIsLoggedIn(true);
            setLoading(true);
            fetchMessages();
        }

        return () => clearInterval(interval);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const data = await api.getMessages();
            setMessages(data.reverse());
        } catch (e) {
            // silent fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) return;
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [isLoggedIn]);

    const isInitialMount = useRef(true);

    useEffect(() => {
        // Only auto-scroll when new messages arrive if logged in
        // and NOT on the initial mount to prevent jumps
        if (isLoggedIn && messages.length > 0) {
            if (isInitialMount.current) {
                isInitialMount.current = false;
                return;
            }
            scrollToBottom();
        }
    }, [messages.length, isLoggedIn]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");
        setTerminalLines(prev => [...prev, `> Executing ${authMode} protocol for user: ${username}...`]);

        try {
            if (authMode === 'register') {
                await api.register(username, pinCode);
                localStorage.setItem("chat_user", username);
                setIsLoggedIn(true);
                setTerminalLines(prev => [...prev, "> Registration successful. Credentials cached."]);
            } else {
                await api.login(username, pinCode);
                localStorage.setItem("chat_user", username);
                setIsLoggedIn(true);
                setTerminalLines(prev => [...prev, "> Access granted. Decrypting channnel..."]);
            }
            fetchMessages();
        } catch (err: any) {
            setAuthError(err.message);
            setTerminalLines(prev => [...prev, `> ERROR: ${err.message}`]);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const tempMsg: ChatMessage = {
            id: Date.now().toString(),
            user_name: username,
            content: newMessage,
            room_id: "general",
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage("");

        await api.sendMessage({
            user_name: username,
            content: tempMsg.content
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("chat_user");
        setIsLoggedIn(false);
        setMessages([]);
        setUsername("");
        setPinCode("");
        setTerminalLines(prev => [...prev, "> Connection terminated by user."]);
    };

    return (
        <section className="py-12 px-4 bg-zinc-950 font-mono relative overflow-hidden min-h-[800px] flex flex-col items-center">
            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

            {/* Main Terminal Window */}
            <div className="w-full max-w-5xl bg-black border border-green-500/30 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.1)] overflow-hidden flex flex-col h-[700px] relative z-10">

                {/* Terminal Header */}
                <div className="bg-zinc-900 border-b border-green-500/20 p-2 flex items-center gap-4 px-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="flex-1 text-center text-xs text-green-500/50 font-bold tracking-widest uppercase">
                        root@PPLG3_NEXUS:~/encrypted_uplink
                    </div>
                    {isLoggedIn && (
                        <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 hover:underline">
                            [DISCONNECT]
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-black/95 p-4 overflow-y-auto custom-scrollbar font-mono text-sm relative">
                    {/* Matrix Grid BG */}
                    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(0deg,transparent_24%,rgba(0,255,0,0.3)_25%,rgba(0,255,0,0.3)_26%,transparent_27%,transparent_74%,rgba(0,255,0,0.3)_75%,rgba(0,255,0,0.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,255,0,0.3)_25%,rgba(0,255,0,0.3)_26%,transparent_27%,transparent_74%,rgba(0,255,0,0.3)_75%,rgba(0,255,0,0.3)_76%,transparent_77%,transparent)] bg-[size:50px_50px] pointer-events-none" />

                    {/* Boot Logs */}
                    <div className="mb-6 space-y-1">
                        {terminalLines.map((line, i) => (
                            <div key={i} className="text-green-500/60">{line}</div>
                        ))}
                    </div>

                    {!isLoggedIn ? (
                        /* Login Terminal */
                        <div className="mt-8 max-w-md mx-auto border border-green-500/30 p-6 rounded bg-black/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-green-400 mb-6">
                                <ShieldAlert className="w-5 h-5" />
                                <span className="text-lg font-bold">AUTHENTICATION_REQUIRED</span>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-green-500/70 block uppercase">Identity (Codename)</label>
                                    <div className="flex items-center gap-2 border-b border-green-500/30 py-1">
                                        <span className="text-green-500">{">"}</span>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            className="bg-transparent border-none outline-none text-green-400 w-full placeholder-green-500/20"
                                            placeholder="enter_username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-green-500/70 block uppercase">Security Pin</label>
                                    <div className="flex items-center gap-2 border-b border-green-500/30 py-1">
                                        <span className="text-green-500">{">"}</span>
                                        <input
                                            type="password"
                                            value={pinCode}
                                            onChange={e => setPinCode(e.target.value)}
                                            className="bg-transparent border-none outline-none text-green-400 w-full placeholder-green-500/20"
                                            placeholder="****"
                                        />
                                    </div>
                                </div>

                                {authError && (
                                    <div className="text-red-500 text-xs border border-red-500/30 bg-red-500/10 p-2 mt-2">
                                        [ERR] {authError}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-500/10 border border-green-500/50 text-green-400 py-1 hover:bg-green-500 hover:text-black transition-colors uppercase text-xs tracking-wider"
                                    >
                                        {authMode === 'login' ? '>> Execute Login' : '>> Init Registration'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                                        className="text-xs text-green-500/50 hover:text-green-400 underline"
                                    >
                                        [switch_mode]
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        /* Log Chat Interface */
                        <div className="space-y-1 pb-4">
                            <SystemLog text="Encryption enabled. Channel is secure." type="success" />
                            {loading && <SystemLog text="Fetching packets..." />}

                            {messages.map((msg, idx) => (
                                <div key={msg.id || idx} className="group hover:bg-green-500/5 p-0.5 -mx-2 px-2 selection:bg-green-500/30 rounded">
                                    <span className="text-zinc-500 text-[10px] mr-2">
                                        [{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                                    </span>
                                    <span className={`font-bold mr-2 ${msg.user_name === username ? 'text-green-400' : 'text-blue-400'}`}>
                                        {msg.user_name === username ? 'root' : msg.user_name}@nexus:
                                    </span>
                                    <span className="text-zinc-300 group-hover:text-green-100 transition-colors">
                                        {msg.content}
                                    </span>

                                    {/* Expiry Timer (very subtle) */}
                                    <span className="float-right text-[9px] text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                        TTL: {Math.max(0, 24 - (Date.now() - new Date(msg.created_at).getTime()) / 3600000).toFixed(1)}h
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Command Input */}
                {isLoggedIn && (
                    <div className="bg-zinc-900 border-t border-green-500/20 p-3">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <span className="text-green-500 font-bold shrink-0">
                                {username}@nexus:~$
                            </span>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-green-300 placeholder-green-500/20 font-mono"
                                placeholder="echo 'your message' > broadcast"
                            />
                            {newMessage && (
                                <span className="animate-pulse w-2 h-4 bg-green-500 block" />
                            )}
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ChatSection;
