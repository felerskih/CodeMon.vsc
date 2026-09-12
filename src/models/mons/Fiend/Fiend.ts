import { Codemon } from "../Codemon";
import { FlyingFiend } from "./FlyingFiend";

export class Fiend extends Codemon {
    constructor() {
        super("Fiend", 15, "Fiend.png", new FlyingFiend());
    }
}