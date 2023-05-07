export type TabMessage =
  | {
      action: 'sendEnabled';
      message: boolean;
    }
  | {
      action: 'sendEffectivePath';
      message: string;
    };
