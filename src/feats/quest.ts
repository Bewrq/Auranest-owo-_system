import { QuestTypes } from "../typings/typings.js";
import { logger } from "../utils/logger.js";
import { getQuestType } from "../utils/utils.js";

export const getQuestReward = (reward: string) => {
    return [...reward.matchAll(/(\d+)?\s*<:(\w+):\d+>/g)]
        .map(r => ({
            value: parseInt(r[1]) || 1,
            type: r[2]
        }))
        .reduce((acc, { type, value }) => ({
            ...acc,
            [type]: (acc[type] || 0) + value
        }), <Record<string, number>>{})
}

export const processQuestLogs = (rawQuestLogs: string): QuestTypes[] => {
    const raw = rawQuestLogs.split("\n").slice(1)
        .map(r => r.replace(/<:blank:427371936482328596>|`|\*\*/g, "").split("‣"))
        .flat().filter(r => r.length > 0)
        .reduce((acc, curr, i) => {
            if (i % 3 === 0) {
                acc.push([])
            }
            acc[acc.length - 1].push(curr.trim())
            return acc
        }, <Array<string[]>>[])

    logger.debug("Görev günlükleri tespit edildi: ")

    return raw.map(r => {
        const reward = getQuestReward(r[1]);

        logger.debug(`[${Object.entries(reward).map(r => r.join(": x")).join(" ")}] | ${r[0]} ${r[2]}`)

        return getQuestType(r[0])
    })

}