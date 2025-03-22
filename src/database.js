"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
// import Database from "better-sqlite3";
var s_1 = require("./s");
var Database = require("better-sqlite3");
function initDatabase() {
    var database = new Database("".concat((0, s_1.s)("cards"), ".db"));
    database.pragma("journal_mode = WAL");
    database.exec("\n        CREATE TABLE IF NOT EXISTS ".concat((0, s_1.s)("cards"), " (\n        ").concat((0, s_1.s)("id"), " INTEGER PRIMARY KEY AUTOINCREMENT,\n        ").concat((0, s_1.s)("front"), " TEXT NOT NULL,\n        ").concat((0, s_1.s)("backs"), " TEXT NOT NULL,\n        ").concat((0, s_1.s)("category"), " TEXT NOT NULL,\n        ").concat((0, s_1.s)("due"), " DATE NOT NULL,\n        ").concat((0, s_1.s)("stability"), " REAL NOT NULL,\n        ").concat((0, s_1.s)("difficulty"), " REAL NOT NULL,\n        ").concat((0, s_1.s)("elapsed_days"), " INTEGER NOT NULL,\n        ").concat((0, s_1.s)("scheduled_days"), " INTEGER NOT NULL,\n        ").concat((0, s_1.s)("reps"), " INTEGER NOT NULL,\n        ").concat((0, s_1.s)("lapses"), " INTEGER NOT NULL,\n        ").concat((0, s_1.s)("state"), " TINYINT NOT NULL,\n        ").concat((0, s_1.s)("last_review"), " DATE\n    )"));
    database.function("REGEXP", { deterministic: true }, function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var pattern = params[0];
        var value = params[1];
        try {
            var regex = new RegExp(pattern);
            return regex.test(value) ? 1 : 0;
        }
        catch (err) {
            return 0;
        }
    });
    return database;
}
exports.database = initDatabase();
