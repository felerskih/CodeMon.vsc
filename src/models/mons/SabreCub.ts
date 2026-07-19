import { Codemon } from "./Codemon";
import { Sabertooth } from "./Sabertooth";

export class SabreCub implements Codemon {
    Name = "Sabre Cub"
    EvolvesAt = 10;
    NextStage = new Sabertooth();
    ImageFileName = "Stage1.png";
    CurrentXp = 0;

    constructor() {}
}