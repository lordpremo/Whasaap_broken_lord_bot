// plugins/tools.js
import fs from "fs-extra";
import axios from "axios";
import pdfkit from "pdfkit";

export default {
    async handleCommand({ sock, from, senderJid, isRuntimeOwner, command, args, m }) {
        const send = (text) => sock.sendMessage(from, { text });

        if (command === "say") {
            const text = args.join(" ");
            if (!text) return send("⚙️ Tumia: .say maneno yako");
            return send(text);
        }

        if (command === "fliptext") {
            const text = args.join(" ");
            if (!text) return send("⚙️ Tumia: .fliptext maneno");
            const flipped = text.split("").reverse().join("");
            return send(`🔁 *Flipped:*\n${flipped}\n\nPOWERED BY BROKEN LORD`);
        }

        if (command === "genpass") {
            const length = parseInt(args[0]) || 12;
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            let pass = "";
            for (let i = 0; i < length; i++) pass += chars[Math.floor(Math.random() * chars.length)];
            return send(`🔐 *Generated Password:*\n${pass}\n\nPOWERED BY BROKEN LORD`);
        }

        if (command === "tinyurl") {
            const url = args[0];
            if (!url || !url.startsWith("http")) return send("⚙️ Tumia: .tinyurl https://link");
            try {
                const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
                return send(`🔗 *Short URL:*\n${res.data}\n\nPOWERED BY BROKEN LORD`);
            } catch {
                return send("❌ Imeshindikana kufupisha link.");
            }
        }

        if (command === "calculate") {
            const expr = args.join(" ");
            if (!expr) return send("⚙️ Tumia: .calculate 2+3*4");
            try {
                const safe = expr.replace(/[^0-9+\-*/(). ]/g, "");
                // eslint-disable-next-line no-eval
                const result = eval(safe);
                return send(`🧮 *${expr}* = *${result}*\n\nPOWERED BY BROKEN LORD`);
            } catch {
                return send("❌ Hesabu haijasomeka.");
            }
        }

        if (command === "sticker" || command === "s") {
            const quoted = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const img = quoted?.imageMessage || m.message?.imageMessage;
            if (!img) return send("⚙️ Tumia: .sticker uki-reply picha.");
            const buffer = await sock.downloadMediaMessage({ message: img });
            await sock.sendMessage(from, { sticker: buffer }, { quoted: m });
            return;
        }

        if (command === "toimage" || command === "toimg") {
            const quoted = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const st = quoted?.stickerMessage;
            if (!st) return send("⚙️ Tumia: .toimage uki-reply sticker.");
            const buffer = await sock.downloadMediaMessage({ message: st });
            await sock.sendMessage(
                from,
                { image: buffer, caption: "🖼️ Converted from sticker\nPOWERED BY BROKEN LORD" },
                { quoted: m }
            );
            return;
        }

        if (command === "texttopdf") {
            const text = args.join(" ");
            if (!text) return send("⚙️ Tumia: .texttopdf maandishi marefu");

            const doc = new pdfkit();
            const path = `./temp_${Date.now()}.pdf`;
            const stream = fs.createWriteStream(path);
            doc.pipe(stream);
            doc.text(text);
            doc.end();

            stream.on("finish", async () => {
                const pdfBuffer = fs.readFileSync(path);
                await sock.sendMessage(
                    from,
                    {
                        document: pdfBuffer,
                        mimetype: "application/pdf",
                        fileName: "BROKEN_LORD_TEXT.pdf"
                    },
                    { quoted: m }
                );
                fs.unlinkSync(path);
            });
            return;
        }

        if (command === "qrcode") {
            const text = args.join(" ");
            if (!text) return send("⚙️ Tumia: .qrcode maneno au link");
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
            await sock.sendMessage(
                from,
                {
                    image: { url },
                    caption: "🔳 QR Code\nPOWERED BY BROKEN LORD"
                },
                { quoted: m }
            );
            return;
        }

        if (command === "device") {
            const user = sock.user;
            return send(
                `📱 *BROKEN LORD MD DEVICE INFO*\n` +
                    `• JID: ${user.id}\n` +
                    `• Name: ${user.name || "BOT"}\n\nPOWERED BY BROKEN LORD`
            );
        }

        if (command === "getpp") {
            const quoted = m?.message?.extendedTextMessage?.contextInfo?.participant;
            const target = quoted || `${args[0]?.replace(/[^0-9]/g, "")}@s.whatsapp.net` || senderJid;
            try {
                const url = await sock.profilePictureUrl(target, "image");
                await sock.sendMessage(
                    from,
                    {
                        image: { url },
                        caption: "🖼️ Profile Picture\nPOWERED BY BROKEN LORD"
                    },
                    { quoted: m }
                );
            } catch {
                await send("❌ Imeshindikana kupata profile picture.");
            }
            return;
        }

        if (command === "getabout") {
            const quoted = m?.message?.extendedTextMessage?.contextInfo?.participant;
            const target = quoted || `${args[0]?.replace(/[^0-9]/g, "")}@s.whatsapp.net` || senderJid;
            try {
                const res = await sock.fetchStatus(target);
                await send(`ℹ️ *About:*\n${res.status || "Hakuna"}\n\nPOWERED BY BROKEN LORD`);
            } catch {
                await send("❌ Imeshindikana kupata about.");
            }
            return;
        }

        if (command === "obfuscate") {
            const code = args.join(" ");
            if (!code) return send("⚙️ Tumia: .obfuscate code");
            const encoded = Buffer.from(code).toString("base64");
            return send(`🔒 *Obfuscated (Base64):*\n${encoded}\n\nPOWERED BY BROKEN LORD`);
        }

        if (command === "runeval") {
            if (!isRuntimeOwner) return send("❌ Hii ni ya OWNER tu.");
            const code = args.join(" ");
            if (!code) return send("⚙️ Tumia: .runeval code");
            try {
                // eslint-disable-next-line no-eval
                const result = await eval(code);
                return send(`✅ *Result:*\n${String(result)}\n\nPOWERED BY BROKEN LORD`);
            } catch (e) {
                return send(`❌ Error:\n${String(e)}`);
            }
        }
    }
};
