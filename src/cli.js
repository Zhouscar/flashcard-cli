"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NUM_DAYS_AGO = exports.NUM_DAYS_AHEAD = void 0;
exports.doEditCardFront = doEditCardFront;
exports.doEditCardBackAtIndex = doEditCardBackAtIndex;
exports.doEditCardBack = doEditCardBack;
exports.doViewCard = doViewCard;
exports.doShowCards = doShowCards;
exports.doSearchCardsByCategories = doSearchCardsByCategories;
exports.doSearchCardsByRegex = doSearchCardsByRegex;
exports.doReviewOneCard = doReviewOneCard;
exports.doReviewSpecificCards = doReviewSpecificCards;
exports.doReviewCards = doReviewCards;
exports.doSearchCards = doSearchCards;
exports.doAddCards = doAddCards;
exports.doFillOneEmptyCard = doFillOneEmptyCard;
exports.doFillSpecificEmptyCards = doFillSpecificEmptyCards;
exports.doFillEmptyCards = doFillEmptyCards;
exports.doViewTimeline = doViewTimeline;
exports.doHome = doHome;
var ts_fsrs_1 = require("ts-fsrs");
var cards_1 = require("./cards");
var inquirer_1 = require("inquirer");
var color_1 = require("./color");
var console_1 = require("console");
var EXIT = "EXIT";
function headingify(text) {
    return "\n----".concat(text).concat("-".repeat(100 - text.length), "\n");
}
function promptText(message) {
    return __awaiter(this, void 0, void 0, function () {
        var text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            type: "input",
                            name: "text",
                            message: message,
                        },
                    ])];
                case 1:
                    text = (_a.sent()).text;
                    return [2 /*return*/, text];
            }
        });
    });
}
function promptChoice(message_1, actions_1) {
    return __awaiter(this, arguments, void 0, function (message, actions, pageSize) {
        var choice, action;
        if (pageSize === void 0) { pageSize = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (Object.keys(actions).length === 0) {
                        console.log(color_1.FgRed, "ERROR: Unhandled Choices.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "list",
                                name: "choice",
                                message: message,
                                choices: Object.keys(actions).map(function (choice, i) { return ({
                                    name: "".concat(i + 1, ". ").concat(choice),
                                    value: choice,
                                }); }),
                                pageSize: pageSize,
                            },
                        ])];
                case 1:
                    choice = (_a.sent()).choice;
                    action = actions[choice];
                    if (action === undefined) {
                        console.log(color_1.FgRed, "ERROR: Unhandled Choice.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, action()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function promptChoiceDynamic(message_1, choices_1, dynamicAction_1) {
    return __awaiter(this, arguments, void 0, function (message, choices, dynamicAction, pageSize) {
        var choice0, choice;
        if (pageSize === void 0) { pageSize = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (choices.length === 0) {
                        console.log(color_1.FgRed, "NO CHOICES AVAILABLE");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "list",
                                name: "choice0",
                                message: message,
                                choices: choices.map(function (choice, i) { return ({
                                    name: "".concat(i + 1, ". ").concat(choice),
                                    value: choice,
                                }); }),
                                pageSize: pageSize,
                            },
                        ])];
                case 1:
                    choice0 = (_a.sent()).choice0;
                    choice = choice0;
                    return [4 /*yield*/, dynamicAction(choice)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loopPrompt(heading, message, actions) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function () {
                        var willExit, allActions;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log(headingify(heading));
                                    willExit = false;
                                    allActions = __assign(__assign({}, actions), { EXIT: function () {
                                            willExit = true;
                                        } });
                                    return [4 /*yield*/, promptChoice(message, allActions)];
                                case 1:
                                    _b.sent();
                                    if (willExit)
                                        return [2 /*return*/, { value: void 0 }];
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function doEditCardFront(card) {
    return __awaiter(this, void 0, void 0, function () {
        var newFront;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            type: "input",
                            name: "newFront",
                            message: "Edit Front",
                            default: card.front,
                        },
                    ])];
                case 1:
                    newFront = (_a.sent()).newFront;
                    (0, cards_1.rewriteCardFront)(card, newFront);
                    console.log();
                    return [2 /*return*/];
            }
        });
    });
}
function doEditCardBackAtIndex(card, index) {
    return __awaiter(this, void 0, void 0, function () {
        var back, newBack;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    back = card.backs[index];
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "input",
                                name: "newBack",
                                message: "Edit Back",
                                default: back,
                            },
                        ])];
                case 1:
                    newBack = (_a.sent()).newBack;
                    (0, cards_1.rewriteCardBack)(card, index, newBack);
                    console.log();
                    return [2 /*return*/];
            }
        });
    });
}
function doEditCardBack(card) {
    return __awaiter(this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = -1;
                    return [4 /*yield*/, promptChoiceDynamic("Edit Back", card.backs, function (choice) {
                            index = card.backs.indexOf(choice);
                        })];
                case 1:
                    _a.sent();
                    (0, console_1.assert)(index >= 0);
                    return [4 /*yield*/, doEditCardBackAtIndex(card, index)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function doViewCard(card) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_2, state_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(headingify("View Card"));
                    _loop_2 = function () {
                        var willExit;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    console.log(color_1.FgCyan, "Category: ".concat(card.category, "\nFront: ").concat(card.front, "\nBacks:\n").concat(card.backs.join("\n  - "), "\nRetrievability: ").concat((0, cards_1.getRetrievability)(card)));
                                    willExit = false;
                                    return [4 /*yield*/, promptChoice("Options", (_b = {},
                                            _b["Edit Front"] = function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, doEditCardFront(card)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); },
                                            _b["Edit Back"] = function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, doEditCardBack(card)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); },
                                            _b.EXIT = function () {
                                                willExit = true;
                                            },
                                            _b))];
                                case 1:
                                    _c.sent();
                                    if (willExit)
                                        return [2 /*return*/, { value: void 0 }];
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_2()];
                case 2:
                    state_2 = _a.sent();
                    if (typeof state_2 === "object")
                        return [2 /*return*/, state_2.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function doShowCards(message, cards) {
    return __awaiter(this, void 0, void 0, function () {
        var cardsMap;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(headingify(message));
                    cardsMap = new Map();
                    cards.forEach(function (card) {
                        cardsMap.set(card.front, card);
                    });
                    return [4 /*yield*/, promptChoiceDynamic(message, cards.map(function (card) { return card.front; }), function (front) { return __awaiter(_this, void 0, void 0, function () {
                            var card;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        card = cardsMap.get(front);
                                        return [4 /*yield*/, doViewCard(card)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function doSearchCardsByCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var category, cards;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(headingify("Search Cards by Categories"));
                    category = "";
                    return [4 /*yield*/, promptChoiceDynamic("Category: ", (0, cards_1.getAllCategories)(), function (_category) {
                            category = _category;
                        })];
                case 1:
                    _a.sent();
                    cards = (0, cards_1.getCardsFromCategory)(category);
                    return [4 /*yield*/, doShowCards("Showing Cards of ".concat(category), cards)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function doSearchCardsByRegex() {
    return __awaiter(this, void 0, void 0, function () {
        var regex, cards;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(headingify("Search Cards by Regex"));
                    return [4 /*yield*/, promptText("Regex: ")];
                case 1:
                    regex = _a.sent();
                    cards = (0, cards_1.searchCards)(regex, 20);
                    return [4 /*yield*/, doShowCards("Search for ".concat(regex), cards)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
var NUM_CHOICES = 5;
function doReviewOneCard(card) {
    return __awaiter(this, void 0, void 0, function () {
        var choices, correctIndex, startTime, isCorrect, newBack;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    choices = (0, cards_1.getRandomSimilarCards)(card, NUM_CHOICES - 1).map(function (c) { return randomElement(c.backs); });
                    correctIndex = Math.floor(Math.random() * choices.length + 1);
                    choices.splice(correctIndex, 0, randomElement(card.backs));
                    console.log(color_1.FgCyan, "\n\n  [".concat(card.category, "]\n  ").concat(card.front, "\n  (").concat((0, cards_1.getRetrievability)(card), ")"));
                    startTime = performance.now() / 1000;
                    isCorrect = false;
                    return [4 /*yield*/, promptChoiceDynamic("", choices, function (choice) {
                            var duration = performance.now() / 1000 - startTime;
                            isCorrect = choice === choices[correctIndex];
                            if (duration < 10 && isCorrect) {
                                console.log(color_1.FgGreen, "\nEASILY CORRECT!!!\n");
                                (0, cards_1.rateCard)(card, (0, cards_1.getGrade)("easy"));
                            }
                            else if (duration < 30 && isCorrect) {
                                console.log(color_1.FgBlue, "\nCorrect.\n");
                                (0, cards_1.rateCard)(card, (0, cards_1.getGrade)("good"));
                            }
                            else if (isCorrect) {
                                console.log(color_1.FgGray, "\nCorrect, though it took you some time.\n");
                                (0, cards_1.rateCard)(card, (0, cards_1.getGrade)("hard"));
                            }
                            else {
                                console.log(color_1.FgYellow, "\nOops, the correct answer was: ".concat(choices[correctIndex], "\n"));
                                (0, cards_1.rateCard)(card, (0, cards_1.getGrade)("again"));
                            }
                        }, 20)];
                case 1:
                    _a.sent();
                    if (!isCorrect) return [3 /*break*/, 3];
                    return [4 /*yield*/, promptText("Redefine the card in different words\n")];
                case 2:
                    newBack = _a.sent();
                    (0, cards_1.addCardNewBack)(card, newBack);
                    console.log();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function doReviewSpecificCards(sampleCards, sortOrder) {
    return __awaiter(this, void 0, void 0, function () {
        var cards, i, j, _loop_3, state_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cards = [];
                    if (sortOrder === "descending_retreivability") {
                        cards = sampleCards.sort(function (a, b) { return (0, cards_1.getRetrievability)(a) - (0, cards_1.getRetrievability)(b); });
                    }
                    else if (sortOrder === "random") {
                        cards = __spreadArray([], sampleCards, true);
                        for (i = cards.length - 1; i > 0; i--) {
                            j = Math.floor(Math.random() * (i + 1));
                            _a = [cards[j], cards[i]], cards[i] = _a[0], cards[j] = _a[1];
                        }
                    }
                    _loop_3 = function () {
                        var card, willExit;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    card = cards.pop();
                                    willExit = false;
                                    return [4 /*yield*/, promptChoice("Keep Proceed?", (_c = {},
                                            _c["Yes"] = function () {
                                                willExit = false;
                                            },
                                            _c.EXIT = function () {
                                                willExit = true;
                                            },
                                            _c))];
                                case 1:
                                    _d.sent();
                                    if (willExit)
                                        return [2 /*return*/, { value: "EXITED" }];
                                    return [4 /*yield*/, doReviewOneCard(card)];
                                case 2:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    if (!(cards.length > 0)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_3()];
                case 2:
                    state_3 = _b.sent();
                    if (typeof state_3 === "object")
                        return [2 /*return*/, state_3.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, undefined];
            }
        });
    });
}
function doReviewCards() {
    return __awaiter(this, void 0, void 0, function () {
        var cards, newCards, learningCards, reviewCards, exited;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(headingify("Review Due Cards"));
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 5];
                    cards = (0, cards_1.getDueCards)();
                    if (cards.length === 0) {
                        console.log("\nCongradulations! You are done for the day!");
                        return [2 /*return*/];
                    }
                    newCards = cards.filter(function (card) { return card.state === ts_fsrs_1.State.New; });
                    learningCards = cards.filter(function (card) {
                        return card.state === ts_fsrs_1.State.Learning ||
                            card.state === ts_fsrs_1.State.Relearning;
                    });
                    reviewCards = cards.filter(function (card) { return card.state === ts_fsrs_1.State.Review; });
                    console.log("There are currently\n  ".concat(newCards.length, " new cards,\n  ").concat(learningCards.length, " learning cards,\n  ").concat(reviewCards.length, " review cards."));
                    exited = false;
                    console.log(headingify("Doing Learning Cards (".concat(learningCards.length, ")")));
                    return [4 /*yield*/, doReviewSpecificCards(learningCards, "random")];
                case 2:
                    exited =
                        (_a.sent()) === "EXITED";
                    if (exited)
                        return [2 /*return*/];
                    console.log(headingify("Doing Review Cards (".concat(reviewCards.length, ")")));
                    return [4 /*yield*/, doReviewSpecificCards(reviewCards, "descending_retreivability")];
                case 3:
                    exited =
                        (_a.sent()) === "EXITED";
                    if (exited)
                        return [2 /*return*/];
                    console.log(headingify("Doing New Cards (".concat(newCards.length, ")")));
                    return [4 /*yield*/, doReviewSpecificCards(newCards, "random")];
                case 4:
                    exited = (_a.sent()) === "EXITED";
                    if (exited)
                        return [2 /*return*/];
                    console.log(headingify("Completed a cycle of review. Checking for leftover cards."));
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function doSearchCards() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loopPrompt("Search Cards", "Options", (_a = {},
                        _a["Search Cards by Regex"] = doSearchCardsByRegex,
                        _a["Search Cards by Categories"] = doSearchCardsByCategories,
                        _a))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function doAddCards() {
    return __awaiter(this, void 0, void 0, function () {
        var NEW_CATEGORY, category, cards, _loop_4, state_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(headingify("Add Cards"));
                    NEW_CATEGORY = "NEW CATEGORY";
                    category = cards_1.DEFAULT_CATEGORY;
                    return [4 /*yield*/, promptChoiceDynamic("Add Cards in Category.", __spreadArray([
                            NEW_CATEGORY,
                            cards_1.DEFAULT_CATEGORY
                        ], (0, cards_1.getAllCategories)().filter(function (str) { return str !== cards_1.DEFAULT_CATEGORY; }), true), function (_category) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(_category === NEW_CATEGORY)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, promptText("New Category")];
                                    case 1:
                                        category = _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        category = _category;
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    cards = [];
                    _loop_4 = function () {
                        var willExit, willProceedFillEmpty, front, card;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    willExit = false;
                                    willProceedFillEmpty = false;
                                    return [4 /*yield*/, promptChoice("Keep Adding Placeholders?", (_b = {},
                                            _b["Yes"] = function () {
                                                console.log(headingify("New Placeholder Card"));
                                            },
                                            _b["Proceed to Fill"] = function () {
                                                willProceedFillEmpty = true;
                                            },
                                            _b.EXIT = function () {
                                                willExit = true;
                                            },
                                            _b))];
                                case 1:
                                    _c.sent();
                                    if (willExit)
                                        return [2 /*return*/, { value: void 0 }];
                                    if (willProceedFillEmpty)
                                        return [2 /*return*/, "break"];
                                    return [4 /*yield*/, promptText("Front")];
                                case 2:
                                    front = _c.sent();
                                    card = (0, cards_1.addCard)({ front: front, backs: [], category: category });
                                    cards.push(card);
                                    console.log("\nAdded ".concat(front, " as placeholder in category ").concat(category, " \n"));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_4()];
                case 3:
                    state_4 = _a.sent();
                    if (typeof state_4 === "object")
                        return [2 /*return*/, state_4.value];
                    if (state_4 === "break")
                        return [3 /*break*/, 4];
                    return [3 /*break*/, 2];
                case 4: return [4 /*yield*/, doFillSpecificEmptyCards(cards)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function doFillOneEmptyCard(card) {
    return __awaiter(this, void 0, void 0, function () {
        var newBack;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n[".concat(card.category, "]\n").concat(card.front, "\n"));
                    return [4 /*yield*/, promptText("Define this card\n")];
                case 1:
                    newBack = _a.sent();
                    (0, cards_1.addCardNewBack)(card, newBack);
                    console.log();
                    return [2 /*return*/];
            }
        });
    });
}
function doFillSpecificEmptyCards(cards) {
    return __awaiter(this, void 0, void 0, function () {
        var willExit, i;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log(headingify("Filling Empty Cards"));
                    willExit = false;
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < cards.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, promptChoice("Keep Proceed?", (_a = {},
                            _a["Yes"] = function () { },
                            _a.EXIT = function () {
                                willExit = true;
                            },
                            _a))];
                case 2:
                    _b.sent();
                    if (willExit)
                        return [2 /*return*/];
                    return [4 /*yield*/, doFillOneEmptyCard(cards[i])];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("No more empty cards to fill");
                    return [2 /*return*/];
            }
        });
    });
}
function doFillEmptyCards() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doFillSpecificEmptyCards((0, cards_1.getEmptyCards)())];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.NUM_DAYS_AHEAD = 7;
exports.NUM_DAYS_AGO = 3;
function doViewTimeline() {
    return __awaiter(this, void 0, void 0, function () {
        var reviewedAmounts, dueAmounts, now, offsetDays, date, timeline;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(headingify("View Timeline"));
                    reviewedAmounts = [];
                    dueAmounts = [];
                    now = new Date();
                    for (offsetDays = -exports.NUM_DAYS_AGO; offsetDays <= exports.NUM_DAYS_AHEAD; offsetDays++) {
                        date = new Date(now);
                        date.setDate(now.getDate() + offsetDays);
                        if (offsetDays < 0) {
                            reviewedAmounts.push((0, cards_1.getReviewedAmountOnDay)(date));
                        }
                        else if (offsetDays > 0) {
                            dueAmounts.push((0, cards_1.getDueAmountOnDay)(date));
                        }
                    }
                    timeline = "";
                    reviewedAmounts.forEach(function (amount) {
                        timeline += "[".concat(amount, "], ");
                    });
                    timeline += "[".concat((0, cards_1.getReviewedAmountOnDay)(now), ",").concat((0, cards_1.getDueCards)().length, "), ");
                    dueAmounts.forEach(function (amount, i) {
                        timeline += "(".concat(amount, ")") + (i < dueAmounts.length - 1 ? ", " : "");
                    });
                    console.log("".concat(timeline, "\n"));
                    return [4 /*yield*/, promptChoice("Exit?", { EXIT: function () { } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function doHome() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loopPrompt("Home", "Options", (_a = {},
                        _a["Review Due Cards"] = doReviewCards,
                        _a["Search Cards"] = doSearchCards,
                        _a["Fill Empty Cards"] = doFillEmptyCards,
                        _a["Add Cards"] = doAddCards,
                        _a["View Timeline"] = doViewTimeline,
                        _a))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
