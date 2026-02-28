// server.js — Website + Pair Code + WhatsApp bot
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import makeWASocket, {
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import handler from "./handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));

let sock = null;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        browser: ["BROKEN LORD MD", "Chrome", "1.0.0"]
    });

    console.log("🔥 BROKEN LORD MD bot starting...");

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection }) => {
        if (connection === "open") console.log("✅ BROKEN LORD MD Connected to WhatsApp");
        if (connection === "close") {
            console.log("❌ Connection closed, restarting...");
            startBot();
        }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;
        const m = messages[0];
        if (!m.message) return;
        try {
            await handler(sock, m);
        } catch (e) {
            console.log("Handler error:", e);
        }
    });
}

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// API PAIR
app.post("/api/pair", async (req, res) => {
    try {
        const { number } = req.body;
        if (!number) return res.status(400).json({ error: "number required" });
        if (!sock) return res.status(500).json({ error: "bot not ready" });

        const code = await sock.requestPairingCode(number);
        return res.json({ code });
    } catch (e) {
        console.log("PAIR ERROR:", e);
        return res.status(500).json({ error: "failed to generate code" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌍 Pair web running on port ${PORT}`);
    startBot().catch(e => console.log("Fatal bot error:", e));
});
