// plugins/group.js — antilink + antibadword
const linkRegex = /(https?:\/\/[^\s]+)/i;

export default {
    async protectMessage({ sock, m, text, from, senderJid, groupSettings }) {
        const send = (t) => sock.sendMessage(from, { text: t });

        // ANTILINK
        if (groupSettings.antilink && linkRegex.test(text)) {
            try {
                await send("🚫 *ANTILINK:* Link hairuhusiwi kwenye group hili.");
                await sock.groupParticipantsUpdate(from, [senderJid], "remove");
            } catch {
                await send("⚠️ ANTILINK imejaribu kumkick lakini haikuweza (labda sio admin).");
            }
            return;
        }

        // ANTIBADWORD
        if (groupSettings.antibadword && groupSettings.badwords?.length) {
            const lower = text.toLowerCase();
            const hit = groupSettings.badwords.find((w) => lower.includes(w.toLowerCase()));
            if (hit) {
                try {
                    await send(`🚫 *ANTIBADWORD:* Neno lililokatazwa: "${hit}"`);
                    await sock.groupParticipantsUpdate(from, [senderJid], "remove");
                } catch {
                    await send("⚠️ ANTIBADWORD imejaribu kumkick lakini haikuweza (labda sio admin).");
                }
            }
        }
    },

    async handleCommand({ sock, from, senderJid, isRuntimeOwner, command, args, groupSettings, db, saveDB, m }) {
        const send = (t) => sock.sendMessage(from, { text: t });

        const meta = await sock.groupMetadata(from);
        const isAdmin = meta.participants.find((p) => p.id === senderJid)?.admin;

        if (!["antilink", "antibadword", "addbadword", "delbadword", "listbadword"].includes(command)) return;

        if (!isAdmin && !isRuntimeOwner) {
            return send("❌ Hii command ni ya admin/owner tu.");
        }

        if (command === "antilink") {
            const opt = (args[0] || "").toLowerCase();
            if (!["on", "off"].includes(opt)) return send("⚙️ Tumia: .antilink on / off");
            groupSettings.antilink = opt === "on";
            return send(`✅ ANTILINK: ${groupSettings.antilink ? "ON" : "OFF"}`);
        }

        if (command === "antibadword") {
            const opt = (args[0] || "").toLowerCase();
            if (!["on", "off"].includes(opt)) return send("⚙️ Tumia: .antibadword on / off");
            groupSettings.antibadword = opt === "on";
            return send(`✅ ANTIBADWORD: ${groupSettings.antibadword ? "ON" : "OFF"}`);
        }

        if (command === "addbadword") {
            const word = args.join(" ").trim();
            if (!word) return send("⚙️ Tumia: .addbadword neno");
            groupSettings.badwords = groupSettings.badwords || [];
            if (!groupSettings.badwords.includes(word.toLowerCase())) {
                groupSettings.badwords.push(word.toLowerCase());
            }
            return send(`✅ Neno limeongezwa kwenye ANTIBADWORD: "${word}"`);
        }

        if (command === "delbadword") {
            const word = args.join(" ").trim().toLowerCase();
            if (!word) return send("⚙️ Tumia: .delbadword neno");
            groupSettings.badwords = groupSettings.badwords || [];
            groupSettings.badwords = groupSettings.badwords.filter((w) => w !== word);
            return send(`✅ Neno limeondolewa: "${word}"`);
        }

        if (command === "listbadword") {
            const list = groupSettings.badwords || [];
            if (!list.length) return send("ℹ️ Hakuna badwords zilizowekwa.");
            return send(`📜 *BADWORDS LIST:*\n- ${list.join("\n- ")}`);
        }
    }
};
