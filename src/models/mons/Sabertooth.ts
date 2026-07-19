import { Codemon } from "./Codemon";
import { SaberBrick } from "./SabreBrick";

export class Sabertooth implements Codemon {
    Name = "Sabertooth"
    EvolvesAt = 20;
    NextStage = new SaberBrick
    ImageFileName = "Stage2.png";
    CurrentXp = 0;

    constructor() {}
}