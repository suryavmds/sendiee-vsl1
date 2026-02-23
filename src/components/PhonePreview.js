import { useEffect, useRef, useState, useCallback } from "react";
import {
    IoArrowBack,
    IoCallOutline,
    IoVideocamOutline,
    IoEllipsisVertical,
    IoHappyOutline,
    IoAttachOutline,
    IoMicOutline,
    IoCheckmarkDoneSharp,
    IoSparklesOutline,
} from "react-icons/io5";
import { MdSignalWifiStatusbar2Bar } from "react-icons/md";

import { RiRefreshLine } from "react-icons/ri";

/* ── Chat script ── */
const SCRIPT = [
    // English opener
    { sender: "customer", text: "Hi, do you have cold pressed groundnut oil?", lang: "en" },
    { sender: "ai", text: "Hi there! 👋 Yes, we have premium cold pressed groundnut oil. Available in 500ml (₹349) and 1L (₹599). Would you like to order?", lang: "en" },

    // Tamil
    { sender: "customer", text: "நல்லெண்ணெய் இருக்கா? விலை என்ன?", lang: "ta" },
    { sender: "ai", text: "நிச்சயமாக! எங்களிடம் மரச்செக்கு நல்லெண்ணெய் உள்ளது 🌿\n500ml — ₹299\n1 Litre — ₹549\nஉங்களுக்கு எந்த அளவு வேணும்?", lang: "ta" },

    // Hindi
    { sender: "customer", text: "Bhai jaggery ka rate kya hai?", lang: "hi" },
    { sender: "ai", text: "जी, हमारे पास organic गुड़ उपलब्ध है! 🍯\n500g — ₹149\n1kg — ₹269\nबिल्कुल शुद्ध और natural। Order करूँ?", lang: "hi" },

    // English follow-up
    { sender: "customer", text: "What's the delivery time to Chennai?", lang: "en" },
    { sender: "ai", text: "Delivery to Chennai takes 2-3 business days 🚚\nFree shipping on orders above ₹500!\nShall I add the groundnut oil + jaggery combo?", lang: "en" },

    // Malayalam
    { sender: "customer", text: "Keralathilekk delivery undoo?", lang: "ml" },
    { sender: "ai", text: "ഉണ്ട്! കേരളത്തിലേക്ക് 3-4 ദിവസത്തിനുള്ളിൽ delivery ചെയ്യും 📦\n₹500-ന് മുകളിൽ order ചെയ്താൽ free shipping. Order ചെയ്യട്ടെ?", lang: "ml" },

    // Closing — Tamil mix
    { sender: "customer", text: "Super! 1L groundnut oil + 1kg jaggery order panunga", lang: "ta" },
    { sender: "ai", text: "Order confirmed! ✅\n\n🛒 1L Cold Pressed Groundnut Oil — ₹599\n🍯 1kg Organic Jaggery — ₹269\n\nTotal: ₹868 (Free Delivery!)\n\nPayment link அனுப்பறேன். Thank you for choosing 7LAND Foods! 🌾", lang: "ta" },
];

/* ── Feature pill text per phase ── */
const PILL_STEPS = [
    "AI replies in seconds",
    "Multilingual — Tamil",
    "Multilingual — Hindi",
    "Smart product recommendations",
    "Multilingual — Malayalam",
    "Instant order confirmation",
];

export default function PhonePreview() {
    const sectionRef = useRef(null);
    const chatRef = useRef(null);
    const abortRef = useRef(false);
    const hasStartedRef = useRef(false);

    const [done, setDone] = useState(false);
    const [pillIdx, setPillIdx] = useState(0);
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [inputText, setInputText] = useState("Message");
    const [inputTyping, setInputTyping] = useState(false);

    /* --- helpers --- */
    const delay = (ms) =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                if (abortRef.current) { reject(new Error("aborted")); return; }
                resolve();
            }, ms);
        });

    const scrollChat = useCallback(() => {
        requestAnimationFrame(() => {
            const el = chatRef.current;
            if (el) el.scrollTop = el.scrollHeight;
        });
    }, []);

    const addMsg = useCallback(
        (msg) => {
            setMessages((prev) => [...prev, { ...msg, id: Date.now() + Math.random() }]);
            scrollChat();
        },
        [scrollChat]
    );

    const showTyping = useCallback(
        async (duration) => {
            setTyping(true);
            scrollChat();
            await delay(duration);
            setTyping(false);
        },
        [scrollChat]
    );

    const simulateCustomerTyping = useCallback(async (text) => {
        setInputTyping(true);
        setInputText("");
        for (let i = 0; i <= text.length; i++) {
            if (abortRef.current) return;
            setInputText(text.slice(0, i));
            await delay(30);
        }
        await delay(200);
        setInputTyping(false);
        setInputText("Message");
    }, []);

    /* --- reset --- */
    const resetState = useCallback(() => {
        abortRef.current = true;
        setTimeout(() => { abortRef.current = false; }, 50);
        setMessages([]);
        setTyping(false);
        setDone(false);
        setInputText("Message");
        setInputTyping(false);
        setPillIdx(0);
    }, []);

    /* --- main timeline --- */
    const runTimeline = useCallback(async () => {
        try {
            await delay(1500);

            for (let i = 0; i < SCRIPT.length; i++) {
                const msg = SCRIPT[i];

                if (msg.sender === "customer") {
                    // Simulate customer typing
                    await simulateCustomerTyping(msg.text);
                    addMsg({ type: "text", sender: "customer", text: msg.text });
                    await delay(600);
                } else {
                    // Update pill based on conversation phase
                    const pillMap = { 0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 4, 9: 4, 10: 5, 11: 5 };
                    if (pillMap[i] !== undefined) setPillIdx(pillMap[i]);

                    // AI typing then response
                    const typingDuration = 800 + Math.min(msg.text.length * 8, 1200);
                    await showTyping(typingDuration);
                    addMsg({ type: "text", sender: "ai", text: msg.text });
                    await delay(2000);
                }
            }

            setDone(true);
        } catch (e) {
            if (e.message !== "aborted") throw e;
        }
    }, [addMsg, showTyping, simulateCustomerTyping, scrollChat]);

    /* --- Intersection Observer --- */
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStartedRef.current) {
                    hasStartedRef.current = true;
                    abortRef.current = false;
                    runTimeline();
                }
            },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [runTimeline]);

    /* --- scroll on new messages --- */
    useEffect(() => {
        scrollChat();
    }, [messages, typing, scrollChat]);

    /* --- replay --- */
    const handleReplay = () => {
        resetState();
        setTimeout(() => {
            abortRef.current = false;
            runTimeline();
        }, 100);
    };

    /* --- time helper --- */
    const getTime = (idx) => {
        const base = 41; // 9:41
        const min = base + Math.floor(idx / 2);
        return `9:${min < 10 ? "0" + min : min} AM`;
    };

    /* --- render bubble --- */
    const renderBubble = (msg, idx) => {
        const isOut = msg.sender === "customer";
        const time = getTime(idx);

        return (
            <div key={msg.id} className={`wa-bubble ${isOut ? "outgoing" : "incoming"} wa-msg-enter`}>
                <div className="wa-bubble-text">{msg.text}</div>
                <div className="wa-bubble-meta">
                    <span>{time}</span>
                    {isOut && (
                        <span className="wa-ticks read">
                            <IoCheckmarkDoneSharp size={14} />
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className="phone-section" ref={sectionRef}>
            {/* Feature Pill */}
            <div className="feature-pill">
                <div className="feature-pill-inner" key={pillIdx}>
                    <IoSparklesOutline size={14} className="pill-icon" />
                    <span>{PILL_STEPS[pillIdx]}</span>
                </div>
            </div>

            {/* Phone Mockup */}
            <div className="phone-mockup">
                <div className="phone-screen">
                    {/* Status Bar */}
                    <div className="status-bar">
                        <span className="status-bar-time">9:41</span>
                        <div className="status-icons">
                            <span><MdSignalWifiStatusbar2Bar /></span>
                        </div>
                    </div>

                    {/* WA Header */}
                    <div className="wa-header">
                        <span className="wa-back"><IoArrowBack size={18} /></span>
                        <div className="wa-avatar">
                            <span style={{ fontSize: 16 }}>🌾</span>
                        </div>
                        <div className="wa-contact-info">
                            <div className="wa-contact-name">7LAND Foods</div>
                            <div className="wa-contact-status">{typing ? "typing..." : "online"}</div>
                        </div>
                        <div className="wa-header-icons">
                            <IoVideocamOutline size={18} />
                            <IoCallOutline size={18} />
                            <IoEllipsisVertical size={18} />
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="wa-chat" ref={chatRef}>
                        <div className="wa-date-chip">TODAY</div>
                        <div className="wa-e2e-notice">
                            🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
                        </div>
                        {messages.map(renderBubble)}
                        {typing && (
                            <div className="wa-typing wa-msg-enter">
                                <span className="wa-typing-dot" />
                                <span className="wa-typing-dot" />
                                <span className="wa-typing-dot" />
                            </div>
                        )}
                    </div>

                    {/* Input Bar */}
                    <div className="wa-input-bar">
                        <div className="wa-input-field">
                            <span className="wa-input-icons"><IoHappyOutline size={20} /></span>
                            <span className={`wa-input-text ${inputTyping ? "typing-active" : ""}`}>
                                {inputText || "\u00A0"}
                            </span>
                            <span className="wa-input-icons"><IoAttachOutline size={20} /></span>
                        </div>
                        <div className="wa-mic-btn"><IoMicOutline size={20} /></div>
                    </div>
                </div>
            </div>

            {/* Replay Button */}
            {done && (
                <button className="replay-btn" onClick={handleReplay}>
                    <RiRefreshLine size={14} style={{ marginRight: 4 }} /> Replay Demo
                </button>
            )}
        </section>
    );
}
