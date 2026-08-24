import { Codemon } from "./Codemon";
import { SabreCub } from "./SabreCub";

export class Egg extends Codemon {
    private readonly customBreakText = "Your mon needs to rest a bit as it hatches!";
    constructor() {
        super("Egg", 5, "egg.png", new SabreCub());
    }

    public override getBreakText()
    {
        return this.customBreakText;
    }

}