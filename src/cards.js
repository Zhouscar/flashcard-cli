"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CATEGORY = void 0;
exports.getGrade = getGrade;
exports.getRetrievability = getRetrievability;
exports.addCard = addCard;
exports.rateCard = rateCard;
exports.rewriteCardFront = rewriteCardFront;
exports.rewriteCardBack = rewriteCardBack;
exports.addCardNewBack = addCardNewBack;
exports.getDueCards = getDueCards;
exports.getEmptyCards = getEmptyCards;
exports.getDueAmountOnDay = getDueAmountOnDay;
exports.getReviewedAmountOnDay = getReviewedAmountOnDay;
exports.getAllCategories = getAllCategories;
exports.searchCards = searchCards;
exports.getCardsFromCategory = getCardsFromCategory;
exports.getRandomSimilarCards = getRandomSimilarCards;
var ts_fsrs_1 = require("ts-fsrs");
var database_1 = require("./database");
var s_1 = require("./s");
var params = (0, ts_fsrs_1.generatorParameters)({
    enable_fuzz: true,
    enable_short_term: false,
    request_retention: 0.85,
});
var scheduler = (0, ts_fsrs_1.fsrs)(params);
function getGrade(rating) {
    switch (rating) {
        case "easy":
            return 4;
        case "good":
            return 3;
        case "hard":
            return 2;
        case "again":
            return 1;
    }
}
function parseLocalDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
exports.DEFAULT_CATEGORY = "default";
function getRetrievability(card) {
    if (card.scheduled_days <= 0)
        return 0;
    return Math.exp(-Math.log(2) * (card.elapsed_days / card.scheduled_days));
}
function addCard(_a) {
    var _b;
    var front = _a.front, backs = _a.backs, _c = _a.category, category = _c === void 0 ? exports.DEFAULT_CATEGORY : _c;
    var now = new Date();
    var card = (0, ts_fsrs_1.createEmptyCard)(now);
    var statement = database_1.database.prepare("\n        INSERT INTO ".concat((0, s_1.s)("cards"), " (\n        ").concat((0, s_1.s)("front"), ",\n        ").concat((0, s_1.s)("backs"), ",\n        ").concat((0, s_1.s)("category"), ",\n        ").concat((0, s_1.s)("due"), ",\n        ").concat((0, s_1.s)("stability"), ",\n        ").concat((0, s_1.s)("difficulty"), ",\n        ").concat((0, s_1.s)("elapsed_days"), ",\n        ").concat((0, s_1.s)("scheduled_days"), ",\n        ").concat((0, s_1.s)("reps"), ",\n        ").concat((0, s_1.s)("lapses"), ",\n        ").concat((0, s_1.s)("state"), ",\n        ").concat((0, s_1.s)("last_review"), "\n        ) VALUES\n        (?,?,?,?,?,?,?,?,?,?,?,?)\n    "));
    var lastInsertRowid = statement.run(front, JSON.stringify(backs), category, card.due.toISOString().split("T")[0], card.stability, card.difficulty, card.elapsed_days, card.scheduled_days, card.reps, card.lapses, card.state, (_b = card.last_review) === null || _b === void 0 ? void 0 : _b.toISOString().split("T")[0]).lastInsertRowid;
    return parseRawToCard(database_1.database
        .prepare("SELECT * FROM ".concat((0, s_1.s)("cards"), " WHERE id = ?"))
        .get(lastInsertRowid));
}
function rateCard(card, grade) {
    var now = new Date();
    var newCard = scheduler.repeat(card, now)[grade].card;
    var statement = database_1.database.prepare("\n        UPDATE ".concat((0, s_1.s)("cards"), " SET\n        ").concat((0, s_1.s)("due"), " = ?,\n        ").concat((0, s_1.s)("stability"), " = ?,\n        ").concat((0, s_1.s)("difficulty"), " = ?,\n        ").concat((0, s_1.s)("elapsed_days"), " = ?,\n        ").concat((0, s_1.s)("scheduled_days"), " = ?,\n        ").concat((0, s_1.s)("reps"), " = ?,\n        ").concat((0, s_1.s)("lapses"), " = ?,\n        ").concat((0, s_1.s)("state"), " = ?,\n        ").concat((0, s_1.s)("last_review"), " = ?\n        WHERE id = ").concat(card.id, "\n    "));
    statement.run(parseLocalDate(newCard.due).toISOString().split("T")[0], newCard.stability, newCard.difficulty, newCard.elapsed_days, newCard.scheduled_days, newCard.reps, newCard.lapses, newCard.state, newCard.last_review
        ? parseLocalDate(newCard.last_review).toISOString().split("T")[0]
        : undefined);
}
function rewriteCardFront(card, newFront) {
    card.front = newFront;
    var statement = database_1.database.prepare("\n        UPDATE ".concat((0, s_1.s)("cards"), " SET\n        ").concat((0, s_1.s)("front"), " = ?\n        WHERE id = ").concat(card.id, "\n    "));
    statement.run(newFront);
}
function rewriteCardBack(card, index, newBack) {
    card.backs[index] = newBack;
    var statement = database_1.database.prepare("\n        UPDATE ".concat((0, s_1.s)("cards"), " SET\n        ").concat((0, s_1.s)("backs"), " = ?\n        WHERE id = ").concat(card.id, "\n    "));
    statement.run(JSON.stringify(card.backs));
}
function addCardNewBack(card, newBack) {
    card.backs.push(newBack);
    var statement = database_1.database.prepare("\n        UPDATE ".concat((0, s_1.s)("cards"), " SET\n        ").concat((0, s_1.s)("backs"), " = ?\n        WHERE id = ").concat(card.id, "\n    "));
    statement.run(JSON.stringify(card.backs));
}
function parseRawToCard(raw) {
    var data = raw;
    var card = {
        id: data.id,
        front: data.front,
        backs: JSON.parse(data.backs),
        category: data.category,
        due: parseLocalDate(new Date(data.due)),
        stability: data.stability,
        difficulty: data.difficulty,
        elapsed_days: data.elapsed_days,
        scheduled_days: data.scheduled_days,
        reps: data.reps,
        lapses: data.lapses,
        state: data.state,
        last_review: data.last_review
            ? parseLocalDate(new Date(data.last_review))
            : undefined,
    };
    return card;
}
function getDueCards() {
    var statement = database_1.database.prepare("SELECT * FROM ".concat((0, s_1.s)("cards"), " WHERE ").concat((0, s_1.s)("due"), " <= ? AND ").concat((0, s_1.s)("backs"), " != ?"));
    var cardsRaw = statement.all(new Date().toISOString().split("T")[0], JSON.stringify([]));
    var cards = cardsRaw.map(parseRawToCard);
    return cards;
}
function getEmptyCards() {
    var statement = database_1.database.prepare("SELECT * FROM ".concat((0, s_1.s)("cards"), " WHERE ").concat((0, s_1.s)("backs"), " = ?"));
    var cardsRaw = statement.all(JSON.stringify([]));
    var cards = cardsRaw.map(parseRawToCard);
    return cards;
}
function getDueAmountOnDay(date) {
    date = parseLocalDate(date);
    var statement = database_1.database.prepare("SELECT COUNT(*) AS count FROM ".concat((0, s_1.s)("cards"), " WHERE ").concat((0, s_1.s)("due"), " = ?"));
    var result = statement.get(date.toISOString().split("T")[0]);
    return result.count;
}
function getReviewedAmountOnDay(date) {
    var statement = database_1.database.prepare("SELECT COUNT(*) AS count FROM ".concat((0, s_1.s)("cards"), " WHERE ").concat((0, s_1.s)("last_review"), " = ?"));
    var result = statement.get(date.toISOString().split("T")[0]);
    return result.count;
}
function getAllCategories() {
    var statement = database_1.database.prepare("SELECT DISTINCT ".concat((0, s_1.s)("category"), " FROM ").concat((0, s_1.s)("cards"), " WHERE ").concat((0, s_1.s)("category"), " IS NOT NULL"));
    var rows = statement.all();
    return Array.from(new Set(rows.map(function (row) { return row.category; })));
}
function searchCards(regex, numCards) {
    var statement = database_1.database.prepare("SELECT * FROM ".concat((0, s_1.s)("cards"), " WHERE ").concat((0, s_1.s)("front"), " REGEXP ? LIMIT ?"));
    return statement.all(regex, numCards).map(parseRawToCard);
}
function getCardsFromCategory(category) {
    return database_1.database
        .prepare("SELECT * FROM ".concat((0, s_1.s)("cards"), " WHERE ").concat((0, s_1.s)("category"), " = ?"))
        .all(category)
        .map(parseRawToCard);
}
function getRandomSimilarCards(card, limit) {
    var statement = database_1.database.prepare("\n        SELECT * FROM ".concat((0, s_1.s)("cards"), " \n        WHERE ").concat((0, s_1.s)("category"), " = ? AND id != ? \n        ORDER BY RANDOM() \n        LIMIT ?\n    "));
    return statement.all(card.category, card.id, limit).map(parseRawToCard);
}
