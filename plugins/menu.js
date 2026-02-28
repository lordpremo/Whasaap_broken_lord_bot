// plugins/menu.js
const OWNER_NUMBER = "255773001107";
const OWNER_NAME = "BROKENLORD";

export default {
    async handleCommand({ sock, from, senderJid, isRuntimeOwner, command, args, m, prefix, mode }) {
        if (!["menu", "help"].includes(command)) return;

        const usedPrefix = prefix || ".";
        const headerImage = "https://upcdn.io/kW2K8mM/raw/uploads/2026/02/17/4j9r78e4Jt-image.jpg%20(20).png";
        const speed = "0.0001";
        const fakeUsage = "120 MB of 8 GB";
        const fakeRamBar = "[████████░░] 80%";
        const pluginsCount = 326;
        const version = "1.0.0";
        const botMode = mode || "Private";

        const menuText = `
┏▣ ◈ *BROKEN LORD MD* ◈
┃ *ᴏᴡɴᴇʀ* : ${OWNER_NAME} (${OWNER_NUMBER})
┃ *ᴘʀᴇғɪx* : [ . ! / ]
┃ *ᴍᴏᴅᴇ* : ${botMode}
┃ *ᴘʟᴜɢɪɴs* : ${pluginsCount}
┃ *ᴠᴇʀsɪᴏɴ* : ${version}
┃ *sᴘᴇᴇᴅ* : ${speed} ms
┃ *ᴜsᴀɢᴇ* : ${fakeUsage}
┃ *ʀᴀᴍ:* ${fakeRamBar}
┗▣ 

┏▣ ◈ *MAIN* ◈
│➽ ${usedPrefix}menu
│➽ ${usedPrefix}ping
│➽ ${usedPrefix}owner
┗▣ 

┏▣ ◈ *GROUP* ◈
│➽ ${usedPrefix}antilink on/off
│➽ ${usedPrefix}antibadword on/off
│➽ ${usedPrefix}addbadword neno
│➽ ${usedPrefix}delbadword neno
│➽ ${usedPrefix}listbadword
┗▣ 

┏▣ ◈ *TOOLS* ◈
│➽ ${usedPrefix}say
│➽ ${usedPrefix}fliptext
│➽ ${usedPrefix}genpass
│➽ ${usedPrefix}tinyurl
│➽ ${usedPrefix}calculate
│➽ ${usedPrefix}sticker
│➽ ${usedPrefix}toimage
│➽ ${usedPrefix}texttopdf
│➽ ${usedPrefix}qrcode
│➽ ${usedPrefix}device
│➽ ${usedPrefix}getpp
│➽ ${usedPrefix}getabout
│➽ ${usedPrefix}obfuscate
│➽ ${usedPrefix}runeval
┗▣ 

┏▣ ◈ *DOWNLOAD* ◈
│➽ ${usedPrefix}image
│➽ ${usedPrefix}gitclone
│➽ ${usedPrefix}mediafire
│➽ ${usedPrefix}instagram
│➽ ${usedPrefix}facebook
│➽ ${usedPrefix}tiktok
│➽ ${usedPrefix}tiktokaudio
│➽ ${usedPrefix}twitter
│➽ ${usedPrefix}song
│➽ ${usedPrefix}video
┗▣ 

POWERED BY BROKEN LORD
`.trim();

        await sock.sendMessage(
            from,
            {
                image: { url: headerImage },
                caption: menuText
            },
            { quoted: m }
        );
    }
};
