// handler.js — main command router
import config from "./config.js";
import menuPlugin from "./plugins/menu.js";
import groupPlugin from "./plugins/group.js";
import ownerPlugin from "./plugins/owner.js";
import settingsPlugin from "./plugins/settings.js";
import toolsPlugin from "./plugins/tools.js";
import downloadPlugin from "./plugins/download.js";
import apiPlugin from "./plugins/api.js";

export default async function handler(sock, m) {
    try {
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        const senderJid = m.key.participant || m.key.remoteJid;
        const text =
            m.message?.conversation ||
            m.message?.extendedTextMessage?.text ||
            m.message?.imageMessage?.caption ||
            m.message?.videoMessage?.caption ||
            "";

        const prefixes = config.prefix || [".", "!", "/"];
        let prefix = null;

        for (const p of prefixes) {
            if (text.startsWith(p)) {
                prefix = p;
                break;
            }
        }

        if (!prefix && !isGroup) return;

        const body = prefix ? text.slice(prefix.length).trim() : "";
        const args = body ? body.split(" ") : [];
        const command = body ? args.shift().toLowerCase() : "";

        const runtimeOwner = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const isRuntimeOwner = senderJid === runtimeOwner;

        if (!global.db) global.db = { groups: {} };
        if (isGroup && !global.db.groups[from]) {
            global.db.groups[from] = {
                antilink: config.defaults.antilink,
                antibadword: config.defaults.antibadword,
                antidelete: config.defaults.antidelete,
                welcome: config.defaults.welcome,
                badwords: [...config.defaults.badwords]
            };
        }

        const groupSettings = global.db.groups[from] || {};
        const saveDB = () => {};

        if (isGroup) {
            await groupPlugin.protectMessage({
                sock,
                m,
                text,
                from,
                senderJid,
                groupSettings
            });
        }

        if (!prefix) return;

        await menuPlugin.handleCommand({
            sock,
            from,
            senderJid,
            isRuntimeOwner,
            command,
            args,
            m,
            prefix,
            mode: config.mode
        });

        if (isGroup) {
            await groupPlugin.handleCommand({
                sock,
                from,
                senderJid,
                isRuntimeOwner,
                command,
                args,
                groupSettings,
                db: global.db,
                saveDB,
                m
            });
        }

        await ownerPlugin.handleCommand({
            sock,
            from,
            senderJid,
            isRuntimeOwner,
            command,
            args,
            m
        });

        await settingsPlugin.handleCommand({
            sock,
            from,
            senderJid,
            isRuntimeOwner,
            command,
            args,
            groupSettings,
            db: global.db,
            saveDB,
            m
        });

        await toolsPlugin.handleCommand({
            sock,
            from,
            senderJid,
            isRuntimeOwner,
            command,
            args,
            m
        });

        await downloadPlugin.handleCommand({
            sock,
            from,
            senderJid,
            isRuntimeOwner,
            command,
            args,
            m
        });

        await apiPlugin.handleCommand({
            sock,
            from,
            senderJid,
            isRuntimeOwner,
            command,
            args,
            m
        });
    } catch (e) {
        console.log("Handler Error:", e);
    }
}
