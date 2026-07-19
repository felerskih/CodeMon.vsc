import { Codemon } from "./Codemon";
import { SabreCub } from "./SabreCub";

export class Egg implements Codemon {
    Name = "Egg";
    EvolvesAt = 5;
    NextStage = new SabreCub();
    ImageFileName = "egg.png";
    CurrentXp = 0;

    constructor() {}
}