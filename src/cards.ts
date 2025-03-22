import {
    Card,
    createEmptyCard,
    fsrs,
    generatorParameters,
    Grade,
} from "ts-fsrs";
import { database } from "./database";
import { s } from "./s";

const params = generatorParameters({
    enable_fuzz: true,
    enable_short_term: false,
    request_retention: 0.85,
});

const scheduler = fsrs(params);

export function getGrade(rating: "easy" | "good" | "hard" | "again"): Grade {
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

interface CardCore extends Card {
    id: number;
}

interface MyCardProps {
    front: string;
    backs: string[];
    category: string;
}

function parseLocalDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export type MyCard = MyCardProps & CardCore;

export const DEFAULT_CATEGORY = "default";

export function getRetrievability(card: Card): number {
    if (card.scheduled_days <= 0) return 0;
    return Math.exp(-Math.log(2) * (card.elapsed_days / card.scheduled_days));
}

export function addCard({
    front,
    backs,
    category = DEFAULT_CATEGORY,
}: MyCardProps): MyCard {
    const now = new Date();
    const card = createEmptyCard(now);
    const statement = database.prepare(`
        INSERT INTO ${s("cards")} (
        ${s("front")},
        ${s("backs")},
        ${s("category")},
        ${s("due")},
        ${s("stability")},
        ${s("difficulty")},
        ${s("elapsed_days")},
        ${s("scheduled_days")},
        ${s("reps")},
        ${s("lapses")},
        ${s("state")},
        ${s("last_review")}
        ) VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?)
    `);
    const { lastInsertRowid } = statement.run(
        front,
        JSON.stringify(backs),
        category,
        card.due.toISOString().split("T")[0],
        card.stability,
        card.difficulty,
        card.elapsed_days,
        card.scheduled_days,
        card.reps,
        card.lapses,
        card.state,
        card.last_review?.toISOString().split("T")[0],
    );
    return parseRawToCard(
        database
            .prepare(`SELECT * FROM ${s("cards")} WHERE id = ?`)
            .get(lastInsertRowid),
    );
}

export function rateCard(card: MyCard, grade: Grade): void {
    const now = new Date();
    const newCard: Card = scheduler.repeat(card, now)[grade].card;
    const statement = database.prepare(`
        UPDATE ${s("cards")} SET
        ${s("due")} = ?,
        ${s("stability")} = ?,
        ${s("difficulty")} = ?,
        ${s("elapsed_days")} = ?,
        ${s("scheduled_days")} = ?,
        ${s("reps")} = ?,
        ${s("lapses")} = ?,
        ${s("state")} = ?,
        ${s("last_review")} = ?
        WHERE id = ${card.id}
    `);
    statement.run(
        parseLocalDate(newCard.due).toISOString().split("T")[0],
        newCard.stability,
        newCard.difficulty,
        newCard.elapsed_days,
        newCard.scheduled_days,
        newCard.reps,
        newCard.lapses,
        newCard.state,
        newCard.last_review
            ? parseLocalDate(newCard.last_review).toISOString().split("T")[0]
            : undefined,
    );
}

export function rewriteCardFront(card: MyCard, newFront: string): void {
    card.front = newFront;
    const statement = database.prepare(`
        UPDATE ${s("cards")} SET
        ${s("front")} = ?
        WHERE id = ${card.id}
    `);
    statement.run(newFront);
}

export function rewriteCardBack(
    card: MyCard,
    index: number,
    newBack: string,
): void {
    card.backs[index] = newBack;
    const statement = database.prepare(`
        UPDATE ${s("cards")} SET
        ${s("backs")} = ?
        WHERE id = ${card.id}
    `);
    statement.run(JSON.stringify(card.backs));
}

export function addCardNewBack(card: MyCard, newBack: string): void {
    card.backs.push(newBack);
    const statement = database.prepare(`
        UPDATE ${s("cards")} SET
        ${s("backs")} = ?
        WHERE id = ${card.id}
    `);
    statement.run(JSON.stringify(card.backs));
}

function parseRawToCard(raw: unknown): MyCard {
    const data = raw as {
        id: number;
        front: string;
        backs: string;
        category: string;
        due: string;
        stability: number;
        difficulty: number;
        elapsed_days: number;
        scheduled_days: number;
        reps: number;
        lapses: number;
        state: number;
        last_review: string | null;
    };
    const card: MyCard = {
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

export function getDueCards(): MyCard[] {
    const statement = database.prepare(
        `SELECT * FROM ${s("cards")} WHERE ${s("due")} <= ? AND ${s("backs")} != ?`,
    );
    const cardsRaw = statement.all(
        new Date().toISOString().split("T")[0],
        JSON.stringify([]),
    );
    const cards: MyCard[] = cardsRaw.map(parseRawToCard);
    return cards;
}

export function getEmptyCards(): MyCard[] {
    const statement = database.prepare(
        `SELECT * FROM ${s("cards")} WHERE ${s("backs")} = ?`,
    );
    const cardsRaw = statement.all(JSON.stringify([]));
    const cards: MyCard[] = cardsRaw.map(parseRawToCard);
    return cards;
}

export function getDueAmountOnDay(date: Date): number {
    date = parseLocalDate(date);
    const statement = database.prepare(
        `SELECT COUNT(*) AS count FROM ${s("cards")} WHERE ${s("due")} = ?`,
    );
    const result = statement.get(date.toISOString().split("T")[0]) as {
        count: number;
    };
    return result.count;
}

export function getReviewedAmountOnDay(date: Date): number {
    const statement = database.prepare(
        `SELECT COUNT(*) AS count FROM ${s("cards")} WHERE ${s("last_review")} = ?`,
    );
    const result = statement.get(date.toISOString().split("T")[0]) as {
        count: number;
    };
    return result.count;
}

export function getAllCategories(): string[] {
    const statement = database.prepare(
        `SELECT DISTINCT ${s("category")} FROM ${s("cards")} WHERE ${s("category")} IS NOT NULL`,
    );
    const rows = statement.all();
    return Array.from(
        new Set(
            rows.map((row: unknown) => (row as { category: string }).category),
        ),
    );
}

export function searchCards(regex: string, numCards: number): MyCard[] {
    const statement = database.prepare(
        `SELECT * FROM ${s("cards")} WHERE ${s("front")} REGEXP ? LIMIT ?`,
    );
    return statement.all(regex, numCards).map(parseRawToCard);
}

export function getCardsFromCategory(category: string): MyCard[] {
    return database
        .prepare(`SELECT * FROM ${s("cards")} WHERE ${s("category")} = ?`)
        .all(category)
        .map(parseRawToCard);
}

export function getRandomSimilarCards(card: MyCard, limit: number): MyCard[] {
    const statement = database.prepare(`
        SELECT * FROM ${s("cards")} 
        WHERE ${s("category")} = ? AND id != ? 
        ORDER BY RANDOM() 
        LIMIT ?
    `);
    return statement.all(card.category, card.id, limit).map(parseRawToCard);
}
