// plugins/owner.js
import config from "../config.js";

export default {
    async handleCommand({ sock, from, senderJid, isRuntimeOwner, command, args, m }) {
        const send = (t) => sock.sendMessage(from, { text: t });

        if (command === "owner") {
            const num = config.projectOwner.number;
            const name = config.projectOwner.name;
            return send(
                `👑 *BROKEN LORD MD OWNER*\n` +
                    `• Name: ${name}\n` +
                    `• Number: wa.me/${num}\n\nPOWERED BY BROKEN LORD`
            );
        }
    }
};
