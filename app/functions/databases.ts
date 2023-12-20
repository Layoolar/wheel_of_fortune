/**
 * Database: lowdb
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import type { TelegramUserInterface, TelegramSpinInterface } from "@app/types/databases.type";
import configs from "../configs/config";
import lowdb from "lowdb";
import lowdbFileSync from "lowdb/adapters/FileSync";

const databases = {
	users: lowdb(new lowdbFileSync<{ users: TelegramUserInterface[] }>(configs.databases.users)),
	spins: lowdb(new lowdbFileSync<{ spins: TelegramSpinInterface[] }>(configs.databases.spins)),
};

databases.users = lowdb(new lowdbFileSync(configs.databases.users));
databases.users.defaults({ users: [] }).write();
databases.spins = lowdb(new lowdbFileSync(configs.databases.spins));
databases.spins.defaults({ spins: [] }).write();

/**
 * writeUser()
 * =====================
 * Write user information from telegram context to user database
 *
 * @Context: ctx.update.message.from
 *
 * @interface [TelegramUserInterface](https://github.com/ptkdev-boilerplate/node-telegram-bot-boilerplate/blob/main/app/webcomponent/types/databases.type.ts)
 *
 * @param { TelegramUserInterface } json - telegram user object
 *
 */

const writeUser = async (json: TelegramUserInterface): Promise<void> => {
	const user_id = databases.users.get("users").find({ id: json.id }).value();

	if (user_id) {
		databases.users.get("users").find({ id: user_id.id }).assign(json).write();
	} else {
		databases.users.get("users").push(json).write();
	}
};

const writeSpin = async (json: TelegramSpinInterface): Promise<void> => {
	const user_id = databases.users.get("users").find({ id: json.user_id }).value();
	if (user_id) {
		databases.spins.get("spins").push(json).write();
	}
};

export { databases, writeUser, writeSpin };
export default databases;
