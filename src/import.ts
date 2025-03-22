import * as fs from "fs";
import * as readline from "readline";
import { addCard } from "./cards";

async function run(filePath: string): Promise<void> {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        const leftBrcPos = line.indexOf("[");
        const rightBrcPos = line.indexOf("]", leftBrcPos);
        const threeSpacePos = line.indexOf("   ", rightBrcPos);
        const fiveSpacePos = line.indexOf("     ", threeSpacePos);

        const category = line.substring(leftBrcPos + 1, rightBrcPos);
        const front = line.substring(threeSpacePos + 3, fiveSpacePos);
        const back = line.substring(fiveSpacePos + 5);

        addCard({ front, backs: [back], category });
        console.log(`category:${category},front:${front},back:${back}`);
    }
}

run("external.txt");
