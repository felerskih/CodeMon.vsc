import { Codemon } from "./Codemon";
import { Sabertooth } from "./Sabertooth";

export class SabreCub extends Codemon {
    constructor() {
        super("Sabre Cub", 10, "Stage1.png", new Sabertooth());
    }
}