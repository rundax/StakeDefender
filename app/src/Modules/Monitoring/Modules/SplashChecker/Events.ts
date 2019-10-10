export class SplashCheckerEvents {
    public static readonly BLOCK_SKIPPED = 'monitoring.splashChecker.blockSkipped';
    public static readonly SPLASH_CHECKPOINT_1 = 'monitoring.splashChecker.checkpoint1';
    public static readonly SPLASH_CHECKPOINT_2 = 'monitoring.splashChecker.checkpoint2';
}

export interface BlockSkippedData {
    blockHeight: number;
    blockHash: string;
}

export interface SplashCheckpoint {
    blockHeight: number;
    blockHash: string;
}
