import { State } from "ts-fsrs";
import {
    addCard,
    addCardNewBack,
    DEFAULT_CATEGORY,
    getAllCategories,
    getCardsFromCategory,
    getDueAmountOnDay,
    getDueCards,
    getEmptyCards,
    getGrade,
    getRandomSimilarCards,
    getRetrievability,
    getReviewedAmountOnDay,
    MyCard,
    rateCard,
    rewriteCardBack,
    rewriteCardFront,
    searchCards,
} from "./cards";
import inquirer from "inquirer";
import {
    FgBlue,
    FgCyan,
    FgGray,
    FgGreen,
    FgMagenta,
    FgRed,
    FgYellow,
} from "./color";
import { off } from "process";
import { assert } from "console";

const EXIT = "EXIT";

export interface CardChoices {
    choices: string[];
    correctChoiceIndex: number;
}

function headingify(text: string) {
    return `\n----${text}${"-".repeat(100 - text.length)}\n`;
}

async function promptText(message: string): Promise<string> {
    const { text } = await inquirer.prompt([
        {
            type: "input",
            name: "text",
            message: message,
        },
    ]);
    return text;
}

async function promptChoice(
    message: string,
    actions: {
        [choice: string]: (() => Promise<void>) | (() => void) | undefined;
    },
    pageSize: number = 10,
) {
    if (Object.keys(actions).length === 0) {
        console.log(FgRed, "ERROR: Unhandled Choices.");
        return;
    }
    const { choice } = await inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: message,
            choices: Object.keys(actions).map((choice, i) => ({
                name: `${i + 1}. ${choice}`,
                value: choice,
            })),
            pageSize,
        },
    ]);
    const action = actions[choice];
    if (action === undefined) {
        console.log(FgRed, "ERROR: Unhandled Choice.");
        return;
    }
    await action();
}

async function promptChoiceDynamic(
    message: string,
    choices: string[],
    dynamicAction:
        | ((choice: string) => void)
        | ((choice: string) => Promise<void>),
    pageSize: number = 10,
) {
    if (choices.length === 0) {
        console.log(FgRed, "NO CHOICES AVAILABLE");
        return;
    }
    const { choice0 } = await inquirer.prompt([
        {
            type: "list",
            name: "choice0",
            message: message,
            choices: choices.map((choice, i) => ({
                name: `${i + 1}. ${choice}`,
                value: choice,
            })),
            pageSize,
        },
    ]);
    const choice = choice0 as (typeof choices)[number];
    await dynamicAction(choice);
}

async function loopPrompt(
    heading: string,
    message: string,
    actions: {
        [choice: string]: (() => Promise<void>) | (() => void) | undefined;
    },
) {
    while (true) {
        console.log(headingify(heading));

        let willExit = false;

        const allActions = {
            ...actions,
            EXIT: () => {
                willExit = true;
            },
        };

        await promptChoice(message, allActions);

        if (willExit) return;
    }
}

export async function doEditCardFront(card: MyCard) {
    const { newFront } = await inquirer.prompt([
        {
            type: "input",
            name: "newFront",
            message: "Edit Front",
            default: card.front,
        },
    ]);
    rewriteCardFront(card, newFront);
    console.log();
}

export async function doEditCardBackAtIndex(card: MyCard, index: number) {
    const back = card.backs[index];
    const { newBack } = await inquirer.prompt([
        {
            type: "input",
            name: "newBack",
            message: "Edit Back",
            default: back,
        },
    ]);
    rewriteCardBack(card, index, newBack);
    console.log();
}

export async function doEditCardBack(card: MyCard) {
    let index: number = -1;
    await promptChoiceDynamic("Edit Back", card.backs, (choice) => {
        index = card.backs.indexOf(choice);
    });
    assert(index >= 0);
    await doEditCardBackAtIndex(card, index);
}

export async function doViewCard(card: MyCard) {
    console.log(headingify("View Card"));

    while (true) {
        console.log(
            FgCyan,
            `Category: ${card.category}\nFront: ${card.front}\nBacks:\n${card.backs.join("\n  - ")}\nRetrievability: ${getRetrievability(card)}`,
        );
        let willExit = false;

        await promptChoice("Options", {
            ["Edit Front"]: async () => {
                await doEditCardFront(card);
            },
            ["Edit Back"]: async () => {
                await doEditCardBack(card);
            },
            EXIT: () => {
                willExit = true;
            },
        });

        if (willExit) return;
    }
}

export async function doShowCards(message: string, cards: MyCard[]) {
    console.log(headingify(message));

    const cardsMap = new Map<string, MyCard>();
    cards.forEach((card) => {
        cardsMap.set(card.front, card);
    });
    await promptChoiceDynamic(
        message,
        cards.map((card) => card.front),
        async (front) => {
            const card = cardsMap.get(front)!;
            await doViewCard(card);
        },
    );
}

export async function doSearchCardsByCategories() {
    console.log(headingify("Search Cards by Categories"));

    let category: string = "";
    await promptChoiceDynamic("Category: ", getAllCategories(), (_category) => {
        category = _category;
    });
    const cards = getCardsFromCategory(category);
    await doShowCards(`Showing Cards of ${category}`, cards);
}

export async function doSearchCardsByRegex() {
    console.log(headingify("Search Cards by Regex"));

    const regex = await promptText("Regex: ");
    const cards = searchCards(regex, 20);
    await doShowCards(`Search for ${regex}`, cards);
}

function randomElement<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const NUM_CHOICES = 5;
export async function doReviewOneCard(card: MyCard) {
    const choices: string[] = getRandomSimilarCards(card, NUM_CHOICES - 1).map(
        (c) => randomElement(c.backs),
    );
    const correctIndex = Math.floor(Math.random() * choices.length + 1);
    choices.splice(correctIndex, 0, randomElement(card.backs));

    console.log(
        FgCyan,
        `\n\n  [${card.category}]\n  ${card.front}\n  (${getRetrievability(card)})`,
    );

    const startTime = performance.now() / 1000;
    let isCorrect: boolean = false;
    await promptChoiceDynamic(
        "",
        choices,
        (choice) => {
            const duration = performance.now() / 1000 - startTime;
            isCorrect = choice === choices[correctIndex];
            if (duration < 10 && isCorrect) {
                console.log(FgGreen, "\nEASILY CORRECT!!!\n");
                rateCard(card, getGrade("easy"));
            } else if (duration < 30 && isCorrect) {
                console.log(FgBlue, "\nCorrect.\n");
                rateCard(card, getGrade("good"));
            } else if (isCorrect) {
                console.log(
                    FgGray,
                    "\nCorrect, though it took you some time.\n",
                );
                rateCard(card, getGrade("hard"));
            } else {
                console.log(
                    FgYellow,
                    `\nOops, the correct answer was: ${choices[correctIndex]}\n`,
                );
                rateCard(card, getGrade("again"));
            }
        },
        20,
    );

    if (isCorrect) {
        const newBack = await promptText(
            "Redefine the card in different words\n",
        );
        addCardNewBack(card, newBack);
        console.log();
    }
}

export async function doReviewSpecificCards(
    sampleCards: MyCard[],
    sortOrder: "random" | "descending_retreivability",
): Promise<"EXITED" | undefined> {
    let cards: MyCard[] = [];
    if (sortOrder === "descending_retreivability") {
        cards = sampleCards.sort(
            (a, b) => getRetrievability(a) - getRetrievability(b),
        );
    } else if (sortOrder === "random") {
        cards = [...sampleCards];
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }
    while (cards.length > 0) {
        const card = cards.pop()!;
        let willExit = false;
        await promptChoice("Keep Proceed?", {
            ["Yes"]: () => {
                willExit = false;
            },
            EXIT: () => {
                willExit = true;
            },
        });
        if (willExit) return "EXITED";
        await doReviewOneCard(card);
    }
    return undefined;
}

export async function doReviewCards() {
    console.log(headingify("Review Due Cards"));

    while (true) {
        const cards = getDueCards();

        if (cards.length === 0) {
            console.log("\nCongradulations! You are done for the day!");
            return;
        }

        const newCards = cards.filter((card) => card.state === State.New);
        const learningCards = cards.filter(
            (card) =>
                card.state === State.Learning ||
                card.state === State.Relearning,
        );
        const reviewCards = cards.filter((card) => card.state === State.Review);

        console.log(
            `There are currently\n  ${newCards.length} new cards,\n  ${learningCards.length} learning cards,\n  ${reviewCards.length} review cards.`,
        );

        let exited = false;

        console.log(
            headingify(`Doing Learning Cards (${learningCards.length})`),
        );

        exited =
            (await doReviewSpecificCards(learningCards, "random")) === "EXITED";
        if (exited) return;

        console.log(headingify(`Doing Review Cards (${reviewCards.length})`));

        exited =
            (await doReviewSpecificCards(
                reviewCards,
                "descending_retreivability",
            )) === "EXITED";
        if (exited) return;

        console.log(headingify(`Doing New Cards (${newCards.length})`));

        exited = (await doReviewSpecificCards(newCards, "random")) === "EXITED";
        if (exited) return;

        console.log(
            headingify(
                "Completed a cycle of review. Checking for leftover cards.",
            ),
        );
    }
}

export async function doSearchCards() {
    await loopPrompt("Search Cards", "Options", {
        ["Search Cards by Regex"]: doSearchCardsByRegex,
        ["Search Cards by Categories"]: doSearchCardsByCategories,
    });
}

export async function doAddCards() {
    console.log(headingify("Add Cards"));

    const NEW_CATEGORY = "NEW CATEGORY";

    let category: string = DEFAULT_CATEGORY;

    await promptChoiceDynamic(
        "Add Cards in Category.",
        [
            NEW_CATEGORY,
            DEFAULT_CATEGORY,
            ...getAllCategories().filter((str) => str !== DEFAULT_CATEGORY),
        ],
        async (_category) => {
            if (_category === NEW_CATEGORY) {
                category = await promptText("New Category");
            } else {
                category = _category;
            }
        },
    );

    const cards: MyCard[] = [];

    while (true) {
        let willExit = false;
        let willProceedFillEmpty = false;
        await promptChoice("Keep Adding Placeholders?", {
            ["Yes"]: () => {
                console.log(headingify("New Placeholder Card"));
            },
            ["Proceed to Fill"]: () => {
                willProceedFillEmpty = true;
            },
            EXIT: () => {
                willExit = true;
            },
        });

        if (willExit) return;
        if (willProceedFillEmpty) break;

        const front = await promptText("Front");
        const card = addCard({ front, backs: [], category });
        cards.push(card);

        console.log(
            `\nAdded ${front} as placeholder in category ${category} \n`,
        );
    }

    await doFillSpecificEmptyCards(cards);
}

export async function doFillOneEmptyCard(card: MyCard) {
    console.log(`\n[${card.category}]\n${card.front}\n`);
    const newBack = await promptText("Define this card\n");
    addCardNewBack(card, newBack);
    console.log();
}

export async function doFillSpecificEmptyCards(cards: MyCard[]) {
    console.log(headingify("Filling Empty Cards"));
    let willExit = false;
    for (let i = 0; i < cards.length; i++) {
        await promptChoice("Keep Proceed?", {
            ["Yes"]: () => {},
            EXIT: () => {
                willExit = true;
            },
        });
        if (willExit) return;
        await doFillOneEmptyCard(cards[i]);
    }
    console.log("No more empty cards to fill");
}

export async function doFillEmptyCards() {
    await doFillSpecificEmptyCards(getEmptyCards());
}

export const NUM_DAYS_AHEAD = 7;
export const NUM_DAYS_AGO = 3;

export async function doViewTimeline() {
    console.log(headingify("View Timeline"));

    const reviewedAmounts: number[] = [];
    const dueAmounts: number[] = [];
    const now = new Date();
    for (
        let offsetDays = -NUM_DAYS_AGO;
        offsetDays <= NUM_DAYS_AHEAD;
        offsetDays++
    ) {
        const date = new Date(now);
        date.setDate(now.getDate() + offsetDays);
        if (offsetDays < 0) {
            reviewedAmounts.push(getReviewedAmountOnDay(date));
        } else if (offsetDays > 0) {
            dueAmounts.push(getDueAmountOnDay(date));
        }
    }

    let timeline = "";
    reviewedAmounts.forEach((amount) => {
        timeline += `[${amount}], `;
    });
    timeline += `[${getReviewedAmountOnDay(now)},${getDueCards().length}), `;
    dueAmounts.forEach((amount, i) => {
        timeline += `(${amount})` + (i < dueAmounts.length - 1 ? ", " : "");
    });

    console.log(`${timeline}\n`);

    await promptChoice("Exit?", { EXIT: () => {} });
}

export async function doHome() {
    await loopPrompt("Home", "Options", {
        ["Review Due Cards"]: doReviewCards,
        ["Search Cards"]: doSearchCards,
        ["Fill Empty Cards"]: doFillEmptyCards,
        ["Add Cards"]: doAddCards,
        ["View Timeline"]: doViewTimeline,
    });
}
