import { useEffect, useRef, useState, useCallback } from "react";
import {
    IoArrowBack,
    IoCallOutline,
    IoVideocamOutline,
    IoEllipsisVertical,
    IoCloseOutline,
    IoHappyOutline,
    IoAttachOutline,
    IoMicOutline,
    IoCartOutline,
    IoCheckmarkDoneSharp,
    IoLeafOutline,
    IoSparklesOutline,
    IoCheckmarkCircle,
} from "react-icons/io5";
import {
    FaWhatsapp,
    FaInstagram,
    FaRegHeart,
    FaRegPaperPlane,
    FaQrcode,
} from "react-icons/fa";
import {
    HiOutlineShoppingBag,
    HiOutlineSparkles,
} from "react-icons/hi";
import { BsShop, BsBoxSeam } from "react-icons/bs";
import { RiRefreshLine } from "react-icons/ri";
import { MdStorefront } from "react-icons/md";

/* ── Catalog products ── */
const PRODUCTS = [
    { id: 1, name: "Vitamin C Serum", desc: "Brightening face serum", price: 899, cls: "serum" },
    { id: 2, name: "Moisturizer SPF 30", desc: "Daily sun protection", price: 1299, cls: "moist" },
    { id: 3, name: "Clay Face Mask", desc: "Deep pore cleanser", price: 649, cls: "mask" },
];

/* ── Flow form fields ── */
const FLOW_FIELDS = [
    { label: "Full Name", value: "Priya Sharma" },
    { label: "Phone Number", value: "9876543210" },
    { label: "Address Line 1", value: "42 MG Road" },
    { label: "City", value: "Bengaluru" },
    { label: "Pincode", value: "560001" },
];

/* ── Feature pill text per step ── */
const PILL_STEPS = [
    { key: 0, text: "Click-to-WhatsApp Ad" },
    { key: 2, text: "AI replies instantly" },
    { key: 4, text: "Native catalog — no app needed" },
    { key: 8, text: "WhatsApp Flows — no redirects" },
    { key: 10, text: "In-chat payment request" },
    { key: 13, text: "Auto order confirmation" },
];

export default function PhonePreview() {
    const sectionRef = useRef(null);
    const chatEndRef = useRef(null);
    const timersRef = useRef([]);

    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);
    const [pillIdx, setPillIdx] = useState(0);
    const [igSlideOut, setIgSlideOut] = useState(false);
    const [igBtnPulsing, setIgBtnPulsing] = useState(true);

    // WhatsApp state
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [inputText, setInputText] = useState("Message");
    const [inputTyping, setInputTyping] = useState(false);

    // Overlays
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [flowOpen, setFlowOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [addedProducts, setAddedProducts] = useState([]);
    const [showViewCart, setShowViewCart] = useState(false);
    const [flowFieldValues, setFlowFieldValues] = useState({});
    const [flowFillingIdx, setFlowFillingIdx] = useState(-1);
    const [flowReady, setFlowReady] = useState(false);
    const [flashProductId, setFlashProductId] = useState(null);

    /* --- helpers --- */
    const delay = (ms) =>
        new Promise((r) => {
            const t = setTimeout(r, ms);
            timersRef.current.push(t);
        });

    const scrollChat = useCallback(() => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
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
            setInputText(text.slice(0, i));
            await delay(40);
        }
        await delay(300);
        setInputTyping(false);
        setInputText("Message");
    }, []);

    const typeFlowField = useCallback(async (idx) => {
        const field = FLOW_FIELDS[idx];
        setFlowFillingIdx(idx);
        for (let i = 0; i <= field.value.length; i++) {
            setFlowFieldValues((prev) => ({ ...prev, [idx]: field.value.slice(0, i) }));
            await delay(50);
        }
        setFlowFillingIdx(-1);
    }, []);

    /* --- reset state --- */
    const resetState = useCallback(() => {
        // clear all pending timers
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];

        setMessages([]);
        setTyping(false);
        setIgSlideOut(false);
        setIgBtnPulsing(true);
        setCatalogOpen(false);
        setFlowOpen(false);
        setCartItems([]);
        setAddedProducts([]);
        setShowViewCart(false);
        setFlowFieldValues({});
        setFlowFillingIdx(-1);
        setFlowReady(false);
        setDone(false);
        setInputText("Message");
        setInputTyping(false);
        setPillIdx(0);
    }, []);

    /* --- main timeline --- */
    const runTimeline = useCallback(async () => {
        resetState();

        // Step 0 — Instagram ad visible, button pulsing
        await delay(2500);

        // Tap WA button, transition
        setIgBtnPulsing(false);
        await delay(400);
        setIgSlideOut(true);
        await delay(500);

        // Step 1 — Customer sends first message
        await simulateCustomerTyping("How much is the moisturizer?");
        addMsg({ type: "text", sender: "customer", text: "How much is the moisturizer?" });
        await delay(800);

        // Step 2 — AI typing then welcome template
        setPillIdx(1);
        await showTyping(1800);
        addMsg({
            type: "template-image",
            sender: "ai",
            image: "skincare-banner",
            body: "Hi! Welcome to Glowly Skincare. How can we help you today?",
            buttons: ["Browse Products", "View Categories"],
        });
        await delay(2500);

        // Step 3 — Customer taps "Browse Products"
        addMsg({ type: "text", sender: "customer", text: "Browse Products" });
        await delay(600);

        // Step 4 — AI sends catalog message
        setPillIdx(2);
        await showTyping(1200);
        addMsg({
            type: "template-btn",
            sender: "ai",
            body: "Here are our top products! Browse and add to cart.",
            buttons: ["View Catalog"],
        });
        await delay(1200);

        // Open catalog overlay
        setCatalogOpen(true);
        await delay(1200);

        // Auto add product 1
        setAddedProducts((p) => [...p, 1]);
        setCartItems((c) => [...c, PRODUCTS[0]]);
        setFlashProductId(1);
        await delay(300);
        setFlashProductId(null);
        await delay(1200);

        // Auto add product 2
        setAddedProducts((p) => [...p, 2]);
        setCartItems((c) => [...c, PRODUCTS[1]]);
        setFlashProductId(2);
        await delay(300);
        setFlashProductId(null);
        await delay(1000);

        // Show view cart button, then auto-tap
        setShowViewCart(true);
        await delay(1000);
        setCatalogOpen(false);
        setShowViewCart(false);
        await delay(400);

        // Step 5 — Cart summary
        await showTyping(800);
        addMsg({
            type: "template-cart",
            sender: "ai",
            items: [
                { name: "Vitamin C Serum", price: "₹899" },
                { name: "Moisturizer SPF", price: "₹1,299" },
            ],
            total: "₹2,198",
            buttons: ["Checkout", "Continue Shopping"],
        });
        await delay(2000);

        // Step 6 — Customer taps "Checkout"
        addMsg({ type: "text", sender: "customer", text: "Checkout" });
        await delay(500);

        // Step 7 — AI sends flow message
        await showTyping(1200);
        addMsg({
            type: "template-btn",
            sender: "ai",
            body: "Almost there! We just need your delivery address to complete your order.",
            buttons: ["Enter Delivery Details"],
        });
        await delay(1200);

        // Step 8 — Open flow overlay
        setPillIdx(3);
        setFlowOpen(true);
        await delay(600);

        // Auto-fill fields one by one
        for (let i = 0; i < FLOW_FIELDS.length; i++) {
            await typeFlowField(i);
            await delay(200);
        }
        setFlowReady(true);
        await delay(600);

        // Submit & close
        setFlowOpen(false);
        await delay(400);

        // Customer confirms
        addMsg({ type: "text", sender: "customer", text: "Address saved" });
        await delay(600);

        // Step 9 — AI sends payment template
        setPillIdx(4);
        await showTyping(1500);
        addMsg({
            type: "template-payment",
            sender: "ai",
            items: [
                { name: "Vitamin C Serum", price: "₹899" },
                { name: "Moisturizer SPF", price: "₹1,299" },
                { name: "Delivery", price: "₹49" },
            ],
            total: "₹2,247",
            upi: "glowly@okaxis",
        });
        await delay(3000);

        // Step 10 — Customer pays
        addMsg({ type: "text", sender: "customer", text: "Paid" });
        await delay(800);

        // Step 11 — Verification
        await showTyping(3200);

        // Step 12 — Confirmation template
        setPillIdx(5);
        addMsg({
            type: "template-confirm",
            sender: "ai",
            body: "Order Confirmed!\n\nOrder ID: #GLW-00142\nEstimated Delivery: 3–5 business days\n\nThank you for shopping with Glowly Skincare!",
            buttons: ["Track Order", "Shop Again"],
        });
        await delay(2000);

        setDone(true);
    }, [addMsg, showTyping, simulateCustomerTyping, typeFlowField, scrollChat, resetState]);

    /* --- Intersection Observer trigger --- */
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                    runTimeline();
                }
            },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [started, runTimeline]);

    /* --- scroll on new messages --- */
    useEffect(() => {
        scrollChat();
    }, [messages, typing, scrollChat]);

    /* --- handle replay --- */
    const handleReplay = () => {
        setStarted(true);
        setDone(false);
        runTimeline();
    };

    /* --- Render helpers --- */
    const renderBubble = (msg) => {
        const isOut = msg.sender === "customer";
        const time = "9:42 AM";

        if (msg.type === "text") {
            return (
                <div key={msg.id} className={`wa-bubble ${isOut ? "outgoing" : "incoming"} wa-msg-enter`}>
                    <div className="wa-bubble-text">{msg.text}</div>
                    <div className="wa-bubble-meta">
                        <span>{time}</span>
                        {isOut && (
                            <span className="wa-ticks">
                                <IoCheckmarkDoneSharp size={14} />
                            </span>
                        )}
                    </div>
                </div>
            );
        }

        if (msg.type === "template-image") {
            return (
                <div key={msg.id} className="wa-bubble incoming wa-template wa-msg-enter">
                    <div className={`wa-template-img-placeholder ${msg.image}`}>
                        <HiOutlineSparkles size={32} />
                    </div>
                    <div className="wa-template-body">{msg.body}</div>
                    <div className="wa-template-btns">
                        {msg.buttons.map((b, i) => (
                            <button key={i} className="wa-template-btn">
                                {i === 0 ? <HiOutlineShoppingBag size={14} /> : <BsShop size={14} />}
                                {b}
                            </button>
                        ))}
                    </div>
                    <div className="wa-bubble-meta" style={{ padding: "0 8px 4px" }}>
                        <span>{time}</span>
                    </div>
                </div>
            );
        }

        if (msg.type === "template-btn") {
            return (
                <div key={msg.id} className="wa-bubble incoming wa-template wa-msg-enter">
                    <div className="wa-template-body">{msg.body}</div>
                    <div className="wa-template-btns">
                        {msg.buttons.map((b, i) => (
                            <button key={i} className="wa-template-btn">
                                {b}
                            </button>
                        ))}
                    </div>
                    <div className="wa-bubble-meta" style={{ padding: "0 8px 4px" }}>
                        <span>{time}</span>
                    </div>
                </div>
            );
        }

        if (msg.type === "template-cart") {
            return (
                <div key={msg.id} className="wa-bubble incoming wa-template wa-msg-enter">
                    <div className="wa-template-body">
                        <strong><IoCartOutline size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />Your Cart</strong>
                        <br /><br />
                        {msg.items.map((item, i) => (
                            <span key={i}>• {item.name} &nbsp; {item.price}<br /></span>
                        ))}
                        <span style={{ display: "inline-block", width: "100%", borderTop: "1px solid #e5e5e5", margin: "6px 0" }} />
                        <strong>Total: {msg.total}</strong>
                        <br /><br />
                        Ready to checkout?
                    </div>
                    <div className="wa-template-btns">
                        {msg.buttons.map((b, i) => (
                            <button key={i} className="wa-template-btn">
                                {i === 0 && <IoCheckmarkCircle size={14} />}
                                {i === 1 && <HiOutlineShoppingBag size={14} />}
                                {b}
                            </button>
                        ))}
                    </div>
                    <div className="wa-bubble-meta" style={{ padding: "0 8px 4px" }}>
                        <span>{time}</span>
                    </div>
                </div>
            );
        }

        if (msg.type === "template-payment") {
            return (
                <div key={msg.id} className="wa-bubble incoming wa-template wa-msg-enter">
                    <div className="wa-template-img-placeholder upi-qr">
                        <FaQrcode size={64} color="#333" />
                        <span className="qr-label">Scan to Pay</span>
                    </div>
                    <div className="wa-template-body">
                        <strong>Payment Details</strong>
                        <br /><br />
                        {msg.items.map((item, i) => (
                            <span key={i}>{item.name} &nbsp; {item.price}<br /></span>
                        ))}
                        <span style={{ display: "inline-block", width: "100%", borderTop: "1px solid #e5e5e5", margin: "6px 0" }} />
                        <strong>Total Payable: {msg.total}</strong>
                        <br /><br />
                        Scan the QR above or pay to UPI: {msg.upi}
                    </div>
                    <div className="wa-bubble-meta" style={{ padding: "0 8px 4px" }}>
                        <span>{time}</span>
                    </div>
                </div>
            );
        }

        if (msg.type === "template-confirm") {
            return (
                <div key={msg.id} className="wa-bubble incoming wa-template wa-msg-enter">
                    <div className="wa-template-img-placeholder success-banner">
                        <IoCheckmarkCircle size={42} />
                    </div>
                    <div className="wa-template-body" style={{ whiteSpace: "pre-line" }}>
                        {msg.body}
                    </div>
                    <div className="wa-template-btns">
                        {msg.buttons.map((b, i) => (
                            <button key={i} className="wa-template-btn">
                                {i === 0 ? <BsBoxSeam size={14} /> : <HiOutlineShoppingBag size={14} />}
                                {b}
                            </button>
                        ))}
                    </div>
                    <div className="wa-bubble-meta" style={{ padding: "0 8px 4px" }}>
                        <span>9:44 AM</span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <section className="phone-section" ref={sectionRef}>
            {/* Feature Pill */}
            <div className="feature-pill">
                <div className="feature-pill-inner" key={PILL_STEPS[pillIdx]?.key}>
                    <IoSparklesOutline size={14} className="pill-icon" />
                    <span>{PILL_STEPS[pillIdx]?.text}</span>
                </div>
            </div>

            {/* Phone Mockup */}
            <div className="phone-mockup">
                <div className="phone-screen">
                    {/* Status Bar */}
                    <div className="status-bar">
                        <span className="status-bar-time">9:41</span>
                        <div className="status-icons">
                            <span>▂▄▆█</span>
                        </div>
                    </div>

                    {/* WhatsApp Screen (behind IG) */}
                    <div className="wa-screen">
                        <div className="wa-header">
                            <span className="wa-back"><IoArrowBack size={18} /></span>
                            <div className="wa-avatar">
                                <IoLeafOutline size={18} color="#2d6a4f" />
                            </div>
                            <div className="wa-contact-info">
                                <div className="wa-contact-name">Glowly Skincare</div>
                                <div className="wa-contact-status">online</div>
                            </div>
                            <div className="wa-header-icons">
                                <IoVideocamOutline size={18} />
                                <IoCallOutline size={18} />
                                <IoEllipsisVertical size={18} />
                            </div>
                        </div>

                        <div className="wa-chat">
                            <div className="wa-date-chip">TODAY</div>
                            {messages.map(renderBubble)}
                            {typing && (
                                <div className="wa-typing wa-msg-enter">
                                    <span className="wa-typing-dot" />
                                    <span className="wa-typing-dot" />
                                    <span className="wa-typing-dot" />
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

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

                        {/* Catalog Overlay */}
                        <div className={`wa-overlay-scrim ${catalogOpen ? "active" : ""}`} />
                        <div className={`wa-overlay ${catalogOpen ? "active" : ""}`} style={{ height: "75%" }}>
                            <div className="catalog-header">
                                <span className="catalog-title">Glowly Skincare</span>
                                <div className="catalog-header-actions">
                                    <div className="catalog-cart-icon">
                                        <IoCartOutline size={20} />
                                        {cartItems.length > 0 && (
                                            <span className={`catalog-cart-badge ${flashProductId ? "bounce" : ""}`}>
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </div>
                                    <button className="catalog-close" onClick={() => setCatalogOpen(false)}>
                                        <IoCloseOutline size={22} />
                                    </button>
                                </div>
                            </div>
                            <div className="catalog-products">
                                {PRODUCTS.map((p) => (
                                    <div
                                        key={p.id}
                                        className={`catalog-product ${flashProductId === p.id ? "added-flash" : ""}`}
                                    >
                                        <div className={`catalog-product-img ${p.cls}`}>
                                            {p.cls === "serum" && <HiOutlineSparkles size={24} color="#92400e" />}
                                            {p.cls === "moist" && <IoLeafOutline size={24} color="#166534" />}
                                            {p.cls === "mask" && <MdStorefront size={24} color="#5b21b6" />}
                                        </div>
                                        <div className="catalog-product-details">
                                            <div className="catalog-product-name">{p.name}</div>
                                            <div className="catalog-product-desc">{p.desc}</div>
                                            <div className="catalog-product-price">₹{p.price}</div>
                                        </div>
                                        <button className={`catalog-add-btn ${addedProducts.includes(p.id) ? "added" : ""}`}>
                                            {addedProducts.includes(p.id) ? "Added" : "Add +"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {showViewCart && (
                                <button className="catalog-view-cart">
                                    <IoCartOutline size={16} style={{ marginRight: 4 }} />
                                    View Cart ({cartItems.length})
                                </button>
                            )}
                        </div>

                        {/* Flow Overlay */}
                        <div className={`wa-overlay-scrim ${flowOpen ? "active" : ""}`} />
                        <div className={`wa-overlay ${flowOpen ? "active" : ""}`} style={{ height: "80%" }}>
                            <div className="flow-header">
                                <div className="flow-header-left">
                                    <span className="flow-header-title">Glowly Skincare</span>
                                    <span className="flow-header-powered">
                                        Powered by <FaWhatsapp size={10} style={{ marginLeft: 2 }} /> WhatsApp
                                    </span>
                                </div>
                                <button className="flow-close">
                                    <IoCloseOutline size={22} />
                                </button>
                            </div>
                            <div className="flow-form">
                                {FLOW_FIELDS.map((f, idx) => (
                                    <div key={idx} className="flow-field">
                                        <label>{f.label}</label>
                                        <div
                                            className={`flow-field-input ${flowFillingIdx === idx ? "filling" : flowFieldValues[idx] ? "filled" : ""
                                                }`}
                                        >
                                            {flowFieldValues[idx] || ""}
                                        </div>
                                    </div>
                                ))}
                                <button className={`flow-submit ${flowReady ? "ready" : ""}`}>Submit</button>
                            </div>
                        </div>
                    </div>

                    {/* Instagram Screen (on top) */}
                    <div className={`ig-screen ${igSlideOut ? "slide-out" : ""}`}>
                        <div className="ig-topbar">
                            <span className="ig-logo"><FaInstagram size={22} /></span>
                            <div className="ig-topbar-icons">
                                <FaRegHeart size={18} />
                                <FaRegPaperPlane size={18} />
                            </div>
                        </div>
                        <div className="ig-feed">
                            <div className="ig-blur-post" />
                            <div className="ig-ad-card">
                                <div className="ig-ad-header">
                                    <div className="ig-ad-avatar">
                                        <IoLeafOutline size={16} color="#2d6a4f" />
                                    </div>
                                    <div className="ig-ad-info">
                                        <div className="ig-ad-name">Glowly Skincare</div>
                                        <div className="ig-ad-sponsored">Sponsored</div>
                                    </div>
                                    <IoEllipsisVertical size={16} color="white" />
                                </div>
                                <div className="ig-ad-image">
                                    <div className="ig-ad-image-content">
                                        <span className="product-icon">
                                            <HiOutlineSparkles size={48} />
                                        </span>
                                        <div className="brand-text">GLOWLY</div>
                                        <div className="tagline">Your skin, perfected</div>
                                    </div>
                                </div>
                                <div className="ig-ad-copy">
                                    <div className="ig-ad-headline">Transform your skincare routine</div>
                                    <div className="ig-ad-subtext">Shop our bestsellers — delivered to your door</div>
                                </div>
                                <button className={`ig-wa-btn ${igBtnPulsing ? "pulsing" : ""}`}>
                                    <FaWhatsapp size={16} /> Send Message on WhatsApp
                                </button>
                            </div>
                            <div className="ig-blur-bottom" />
                        </div>
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
