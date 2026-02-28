// plugins/download.js
import axios from "axios";

export default {
    async handleCommand({ sock, from, senderJid, isRuntimeOwner, command, args, m }) {
        const send = (text) => sock.sendMessage(from, { text });

        const needUrl = async (usage) => {
            const url = args[0];
            if (!url || !url.startsWith("http")) {
                await send(`⚙️ Tumia: .${command} ${usage}`);
                return null;
            }
            return url;
        };

        if (command === "gitclone") {
            const url = await needUrl("https://github.com/user/repo");
            if (!url) return;
            return send(
                `📦 *GIT CLONE INFO*\n` +
                    `• Repo: ${url}\n` +
                    `• Command: git clone ${url}\n\n` +
                    `POWERED BY BROKEN LORD`
            );
        }

        if (command === "image") {
            const query = args.join(" ");
            if (!query) return send("⚙️ Tumia: .image cat / car / anime ...");
            const url = `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`;
            await sock.sendMessage(
                from,
                {
                    image: { url },
                    caption: `🖼️ Image for: *${query}*\nPOWERED BY BROKEN LORD`
                },
                { quoted: m }
            );
            return;
        }

        if (command === "mediafire") {
            const url = await needUrl("https://www.mediafire.com/file/XXXX");
            if (!url) return;
            try {
                const res = await axios.get(url);
                const match = res.data.match(/aria-label="Download file" href="([^"]+)"/);
                if (!match) {
                    await send("❌ Imeshindikana kupata direct link ya Mediafire.");
                    return;
                }
                const direct = match[1].startsWith("http") ? match[1] : `https://www.mediafire.com${match[1]}`;
                await send(
                    `📁 *MEDIAFIRE LINK FOUND*\n` +
                        `• Original: ${url}\n` +
                        `• Direct: ${direct}\n\n` +
                        `POWERED BY BROKEN LORD`
                );
            } catch {
                await send("❌ Imeshindikana kusoma Mediafire page.");
            }
            return;
        }

        if (command === "instagram" || command === "ig") {
            const url = await needUrl("https://www.instagram.com/p/XXXX");
            if (!url) return;
            return send(
                "📸 INSTAGRAM downloader inahitaji API ya IG.\n" +
                    "Ongeza endpoint yako ya kupakua reels/posts.\n\n" +
                    "POWERED BY BROKEN LORD"
            );
        }

        if (command === "facebook" || command === "fb") {
            const url = await needUrl("https://www.facebook.com/...");
            if (!url) return;
            return send(
                "📘 FACEBOOK downloader inahitaji API ya FB.\n" +
                    "Ongeza endpoint yako ya kupakua video.\n\n" +
                    "POWERED BY BROKEN LORD"
            );
        }

        if (command === "tiktok") {
            const url = await needUrl("https://www.tiktok.com/...");
            if (!url) return;
            return send(
                "🎵 TIKTOK downloader inahitaji API ya TT.\n" +
                    "Ongeza endpoint yako ya kupakua no‑wm.\n\n" +
                    "POWERED BY BROKEN LORD"
            );
        }

        if (command === "tiktokaudio") {
            const url = await needUrl("https://www.tiktok.com/...");
            if (!url) return;
            return send(
                "🎧 TIKTOK AUDIO inahitaji API ya TT.\n" +
                    "Ongeza endpoint yako ya kupakua audio.\n\n" +
                    "POWERED BY BROKEN LORD"
            );
        }

        if (command === "twitter" || command === "x") {
            const url = await needUrl("https://twitter.com/.../status/...");
            if (!url) return;
            return send(
                "🐦 TWITTER/X downloader inahitaji API.\n" +
                    "Ongeza endpoint yako ya kupakua video.\n\n" +
                    "POWERED BY BROKEN LORD"
            );
        }

        if (command === "song") {
            const query = args.join(" ");
            if (!query) return send("⚙️ Tumia: .song song title");
            return send(
                "🎵 SONG downloader inahitaji YouTube/MP3 API.\n" +
                    "Tayari structure ipo, ongeza API yako ya kupakua audio.\n\n" +
                    "POWERED BY BROKEN LORD"
            );
        }

        if (command === "video") {
            const query = args.join(" ");
            if (!query) return send("⚙️ Tumia: .video video title");
            return send(
                "🎬 VIDEO downloader inahitaji YouTube/MP4 API.\n" +
                    "Tayari structure ipo, ongeza API yako ya kupakua video.\n\n" +
                    "POWERED BY BROKEN LORD"
            );
        }
    }
};
