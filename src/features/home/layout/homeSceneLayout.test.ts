import {
  getHomeCoverLayout,
  getHomeMascotArmsRect,
  getHomeMascotGroupRect,
  getHomeMascotSteamRect,
  HOME_COVER_FOCUS,
  HOME_ENVIRONMENT_ART_ASPECT,
  HOME_MASCOT_ARMS_PIVOT,
  HOME_MASCOT_SCENE,
} from './homeSceneLayout';

const VIEWPORTS = [
  { name: 'iphone-small', width: 390, height: 844 },
  { name: 'iphone-standard', width: 393, height: 852 },
  { name: 'iphone-tall', width: 430, height: 932 },
] as const;

/** Log top–bottom in illustrated scene space (from the clean environment art). */
const LOG_SCENE_TOP = 0.62;
const LOG_SCENE_BOTTOM = 0.74;
const COTTAGE_SCENE_LEFT = 0.62;

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

check(
  'cover crop does not stretch (wide viewport keeps art aspect)',
  (() => {
    const layout = getHomeCoverLayout(800, 400);
    const aspect = layout.width / layout.height;
    return Math.abs(aspect - HOME_ENVIRONMENT_ART_ASPECT) < 1e-9;
  })(),
);

check(
  'cover crop does not stretch (tall viewport keeps art aspect)',
  (() => {
    const layout = getHomeCoverLayout(390, 844);
    const aspect = layout.width / layout.height;
    return Math.abs(aspect - HOME_ENVIRONMENT_ART_ASPECT) < 1e-9;
  })(),
);

check(
  'wide viewport crops vertically using FOCUS_Y',
  (() => {
    const layout = getHomeCoverLayout(900, 500);
    return layout.left === 0 && layout.top < 0 && layout.height > 500;
  })(),
);

for (const viewport of VIEWPORTS) {
  const cover = getHomeCoverLayout(viewport.width, viewport.height);
  const group = getHomeMascotGroupRect(cover);
  const aspect = cover.width / cover.height;

  check(
    `${viewport.name} cover keeps art aspect`,
    Math.abs(aspect - HOME_ENVIRONMENT_ART_ASPECT) < 1e-9,
    `got ${aspect}`,
  );

  check(
    `${viewport.name} is height-driven (side crop) with FOCUS_X`,
    cover.top === 0 && cover.left <= 0 && cover.height === viewport.height,
  );

  const extra = cover.width - viewport.width;
  if (extra > 0.5) {
    check(
      `${viewport.name} side crop uses FOCUS_X`,
      Math.abs(cover.left + extra * HOME_COVER_FOCUS.x) < 0.01,
    );
  }

  check(
    `${viewport.name} mascot stays on-screen`,
    group.left >= cover.left - 1 &&
      group.top >= cover.top - 1 &&
      group.left + group.width <= cover.left + cover.width + 1 &&
      group.top + group.height <= cover.top + cover.height + 1,
  );

  const sceneLeft = (group.left - cover.left) / cover.width;
  const sceneRight = (group.left + group.width - cover.left) / cover.width;
  const sceneTop = (group.top - cover.top) / cover.height;
  const sceneBottom = (group.top + group.height - cover.top) / cover.height;

  check(
    `${viewport.name} mascot sits in the log band`,
    sceneBottom >= LOG_SCENE_TOP && sceneBottom <= LOG_SCENE_BOTTOM + 0.02,
    `bottom=${sceneBottom.toFixed(3)}`,
  );

  check(
    `${viewport.name} mascot does not cover the cottage`,
    sceneRight < COTTAGE_SCENE_LEFT,
    `right=${sceneRight.toFixed(3)}`,
  );

  check(
    `${viewport.name} mascot is lower-left, not in the sky`,
    sceneTop > 0.45 && sceneLeft < 0.2,
    `top=${sceneTop.toFixed(3)} left=${sceneLeft.toFixed(3)}`,
  );

  const arms = getHomeMascotArmsRect(group);
  const steam = getHomeMascotSteamRect(group);

  check(
    `${viewport.name} arms stay inside the mascot group`,
    arms.left >= 0 &&
      arms.top >= 0 &&
      arms.left + arms.width <= group.width + 1 &&
      arms.top + arms.height <= group.height + 1,
  );

  const mugCenterX = arms.left + arms.width * 0.62;
  const steamCenterX = steam.left + steam.width * 0.5;
  check(
    `${viewport.name} steam sits above the mug (horizontally aligned)`,
    Math.abs(steamCenterX - mugCenterX) < group.width * 0.12,
    `steamX=${steamCenterX.toFixed(1)} mugX=${mugCenterX.toFixed(1)}`,
  );

  check(
    `${viewport.name} steam is above the mug, not below`,
    steam.top < arms.top + arms.height * 0.45,
  );
}

check(
  'mascot group scales as one unit (scene width drives size)',
  HOME_MASCOT_SCENE.width > 0.2 && HOME_MASCOT_SCENE.width < 0.4,
);

check(
  'arms sip pivot is near the inner elbow, not the sprite center',
  HOME_MASCOT_ARMS_PIVOT.xPercent < 0.4 &&
    HOME_MASCOT_ARMS_PIVOT.yPercent > 0.55 &&
    HOME_MASCOT_ARMS_PIVOT.yPercent < 0.85,
  `pivot=${HOME_MASCOT_ARMS_PIVOT.xPercent},${HOME_MASCOT_ARMS_PIVOT.yPercent}`,
);

if (failed > 0) {
  throw new Error(`${failed} layout check(s) failed`);
}

console.log('\nall layout checks passed');
