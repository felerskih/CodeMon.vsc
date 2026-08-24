import { Codemon } from "./Codemon";
import { SaberBrick } from "./SabreBrick";

export class Sabertooth extends Codemon {
    constructor() {
        super("Sabertooth", 20, "Stage2.png", new SaberBrick());
    }
}