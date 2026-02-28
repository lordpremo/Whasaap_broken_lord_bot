// plugins/api.js — public APIs without key
import axios from "axios";

export default {
    async handleCommand({ sock, from, senderJid, isRuntimeOwner, command, args, m }) {
        const send = (text) => sock.sendMessage(from, { text });

        // RANDOM JOKE
        if (command === "joke") {
            try {
                const res = await axios.get("https://official-joke-api.appspot.com/random_joke");
                const j = res.data;
                return send(`😂 *JOKE:*\n${j.setup}\n${j.punchline}\n\nPOWERED BY BROKEN LORD`);
            } catch {
                return send("❌ Imeshindikana kupata joke.");
            }
        }

        // RANDOM QUOTE
        if (command === "quote") {
            try {
                const res = await axios.get("https://zenquotes.io/api/random");
                const q = res.data[0];
                return send(`💬 *QUOTE:*\n"${q.q}"\n— ${q.a}\n\nPOWERED BY BROKEN LORD`);
            } catch {
                return send("❌ Imeshindikana kupata quote.");
            }
        }

        // RANDOM FACT
        if (command === "fact") {
            try {
                const res = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
                return send(`📚 *FACT:*\n${res.data.text}\n\nPOWERED BY BROKEN LORD`);
            } catch {
                return send("❌ Imeshindikana kupata fact.");
            }
        }

        // RANDOM ANIME IMAGE
        if (command === "anime") {
            try {
                const res = await axios.get("https://api.waifu.pics/sfw/waifu");
                const url = res.data.url;
                await sock.sendMessage(
                    from,
                    {
                        image: { url },
                        caption: "🎌 Random Anime Waifu\nPOWERED BY BROKEN LORD"
                    },
                    { quoted: m }
                );
            } catch {
                return send("❌ Imeshindikana kupata anime image.");
            }
            return;
        }

        // RANDOM WAIFU (same API, different label)
        if (command === "waifu") {
            try {
                const res = await axios.get("https://api.waifu.pics/sfw/waifu");
                const url = res.data.url;
                await sock.sendMessage(
                    from,
                    {
                        image: { url },
                        caption: "💗 Random Waifu\nPOWERED BY BROKEN LORD"
                    },
                    { quoted: m }
                );
            } catch {
                return send("❌ Imeshindikana kupata waifu.");
            }
            return;
        }
    }
};
