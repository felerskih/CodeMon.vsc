export class Codemon {
    Name: string;
    EvolvesAt: number;
    NextStage: Codemon | undefined;
    ImageFileName: string;
    CurrentXp: number;

    private readonly startText: string = "Your mon is ready to explore again!";

    private readonly breakText: string[] = [
        "Your mon needs a nap!",
        "Your mon wants to look for a snack.",
        "Your mon is trying to meditate.",
        "Your mon needs to play for a bit!"
    ];

    constructor(
        name: string,
        evolvesAt: number,
        imageFileName: string,
        nextStage?: Codemon,
        currentXp = 0
    ) {
        this.Name = name;
        this.EvolvesAt = evolvesAt;
        this.NextStage = nextStage;
        this.ImageFileName = imageFileName;
        this.CurrentXp = currentXp;
    }

    public getBreakText(): string {
        var rand = Math.floor(Math.random() * 3);
        return this.breakText[rand];
    }

    public getStartText(): string {
        return this.startText;
    }
}