export type WorldStageId = 1 | 2 | 3 | 4;

export type WorldStage = {
  id: WorldStageId;
  name: 'Beginning' | 'Growing' | 'Blooming' | 'Reset';
  copy: string;
};

const BEGINNING: WorldStage = {
  id: 1,
  name: 'Beginning',
  copy: 'the path is quiet. showing up will grow this place.',
};

const GROWING: WorldStage = {
  id: 2,
  name: 'Growing',
  copy: 'a little more life is showing. keep going gently.',
};

const BLOOMING: WorldStage = {
  id: 3,
  name: 'Blooming',
  copy: 'the cottage feels more like home. you have been here.',
};

const RESET: WorldStage = {
  id: 4,
  name: 'Reset',
  copy: 'this place holds the days you gave yourself.',
};

export function getWorldStage(completedCount: number): WorldStage {
  if (completedCount >= 21) {
    return RESET;
  }
  if (completedCount >= 7) {
    return BLOOMING;
  }
  if (completedCount >= 3) {
    return GROWING;
  }
  return BEGINNING;
}

export function worldCompanionLine(
  stage: WorldStage,
  supportStyle: string | undefined,
  completedCount: number,
): string {
  if (completedCount === 0) {
    if (supportStyle === 'be-gentle') {
      return 'no rush. this world can wait for you.';
    }
    return 'your first small reset will start this place.';
  }

  return stage.copy;
}
