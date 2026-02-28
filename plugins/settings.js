// plugins/settings.js — basic settings + ping
export default {
    async handleCommand({ sock, from, senderJid, isRuntimeOwner, command, args, groupSettings, db, saveDB, m }) {
        const send = (t) => sock.sendMessage(from, { text: t });

        if (command === "ping") {
            return send("🏓 BROKEN LORD MD is alive.");
        }

        if (command === "getsettings") {
            if (!groupSettings) return send("ℹ️ Hii sio group au hakuna settings.");
            return send(
                `⚙️ *GROUP SETTINGS*\n` +
                    `• ANTILINK: ${groupSettings.antilink ? "ON" : "OFF"}\n` +
                    `• ANTIBADWORD: ${groupSettings.antibadword ? "ON" : "OFF"}\n` +
                    `• BADWORDS: ${(groupSettings.badwords || []).length}\n`
            );
        }
    }
};
