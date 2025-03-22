// import Database from "better-sqlite3";
import { s } from "./s";

const Database = require("better-sqlite3");

function initDatabase() {
    const database = new Database(`${s("cards")}.db`);
    database.pragma("journal_mode = WAL");
    database.exec(`
        CREATE TABLE IF NOT EXISTS ${s("cards")} (
        ${s("id")} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${s("front")} TEXT NOT NULL,
        ${s("backs")} TEXT NOT NULL,
        ${s("category")} TEXT NOT NULL,
        ${s("due")} DATE NOT NULL,
        ${s("stability")} REAL NOT NULL,
        ${s("difficulty")} REAL NOT NULL,
        ${s("elapsed_days")} INTEGER NOT NULL,
        ${s("scheduled_days")} INTEGER NOT NULL,
        ${s("reps")} INTEGER NOT NULL,
        ${s("lapses")} INTEGER NOT NULL,
        ${s("state")} TINYINT NOT NULL,
        ${s("last_review")} DATE
    )`);
    database.function(
        "REGEXP",
        { deterministic: true },
        (...params: unknown[]) => {
            const pattern = params[0] as string;
            const value = params[1] as string;
            try {
                const regex = new RegExp(pattern);
                return regex.test(value) ? 1 : 0;
            } catch (err) {
                return 0;
            }
        },
    );
    return database;
}

export const database = initDatabase();
