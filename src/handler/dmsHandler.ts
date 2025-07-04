import { Message } from "discord.js-selfbot-v13";
import { BaseAgent } from "../structures/BaseAgent.js"

export const dmsHandler = async (agent: BaseAgent) => {
    agent.on("messageCreate", async (message) => {
        if(!agent.captchaDetected || message.channel.type != "DM") return;
        if(!agent.config.adminID || message.author.id != agent.config.adminID) return;
        if(/^[a-zA-Z]{3,6}$/.test(message.content)) {
            const owo = message.client.users.cache.get(agent.owoID);
            const owoDM = await owo?.createDM();
            if(!owo || !owoDM) {
                message.reply("OwO DM Kanalına Ulaşılamadı")
                return;
            }

            await agent.send(message.content, { withPrefix: false, channel: owoDM });

            let filter = (m:Message) => m.author.id === agent.owoID && m.channel.type == 'DM' && /(yanlış doğrulama kodu!)|(insan olduğun doğrulandı!)|(yasaklandınız)/gim.test(m.content)
            const collector = owoDM.createMessageCollector({ filter, time: 30_000, max: 1 });
            collector.once("collect", (m) => {
                message.reply(m.content);
            });
        }
    });
}