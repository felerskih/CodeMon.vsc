import { Codemon } from "./Codemon";

export class Egg extends Codemon {
    private readonly customBreakText = "Your mon needs to rest a bit as it hatches!";

    constructor(nextStage?: Codemon) {
        super("Egg", 5, "egg.png", nextStage);
    }

    public override getBreakText() {
        return this.customBreakText;
    }
}