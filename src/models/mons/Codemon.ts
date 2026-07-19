export interface Codemon {
    Name: string,
    EvolvesAt: number,
    NextStage: Codemon | undefined,
    ImageFileName: string,
    CurrentXp: number
}