import { Egg } from "../models/mons/Egg";
import { EggGuy } from "../models/mons/EggGuy/EggGuy";
import { Fiend } from "../models/mons/Fiend/Fiend";
import { SabreCub } from "../models/mons/SaberCub/SabreCub";

export class EggFactory {
    public static create(): Egg {
        const roll = Math.random();

        if (roll <= 1 / 3) 
            return new Egg(new Fiend());

        if (roll <= 2 / 3)
            return new Egg(new SabreCub());

        return new Egg(new EggGuy());
    }
}
