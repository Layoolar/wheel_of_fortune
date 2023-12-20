/**
 * Telegraf Hears
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import bot from "./telegraf";
import * as databases from "./databases";
import crypto from "crypto";

/**
 * hears: any taxt
 * =====================
 * Listen any text user write
 *
 */
const text = async (): Promise<void> => {
	bot.on("text", (ctx) => {
		ctx.telegram.sendMessage(ctx.message.chat.id, `Your text --> ${ctx.update.message.text}`);
	});
};
const message = async (): Promise<void> => {
	//
	bot.on("message", (ctx) => {
		ctx.reply("Thank you for playing Wheel of Fortune", { reply_markup: { remove_keyboard: true } });

		const data: string | undefined = ctx.webAppData?.data.text();
		let jsonData: { spinResult: string };
		if (data) {
			jsonData = JSON.parse(data);
			const uuid = crypto.randomUUID();

			ctx.reply(`User ${ctx.update.message.from.username} spun ${jsonData.spinResult}`);
			const spinData = {
				id: uuid,
				user_id: ctx.update.message.from.id,
				spin_result: jsonData.spinResult,
				spin_date: new Date(Date.now()),
			};
			databases.writeSpin(spinData);
		}
	});
};

export { text, message };
export default text;
