// ============================================================
//  EXERCISE DATABASE  —  exerciseData.ts
//  80+ exercises covering all 3 generator axes:
//    Energy  : 'low' | 'medium' | 'high'
//    Space   : 'small' | 'medium' | 'large'
//    Equipment: 'none' | 'dumbbells' | 'resistance bands' | 'full gym'
// ============================================================

export type Equipment    = 'none' | 'dumbbells' | 'resistance bands' | 'full gym';
export type MuscleGroup  = 'chest' | 'back' | 'legs' | 'core' | 'arms' | 'shoulders' | 'full body';
export type Difficulty   = 'beginner' | 'intermediate' | 'advanced';
export type EnergyLevel  = 'low' | 'medium' | 'high';
export type SpaceLevel   = 'small' | 'medium' | 'large';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  equipment: Equipment[];
  muscles: MuscleGroup[];
  difficulty: Difficulty;
  defaultDuration: number;   // seconds
  energyLevel: EnergyLevel;
  spaceRequired: SpaceLevel;
  videoUrl?: string;
  image?: string;
}

// ─────────────────────────────────────────────────────────────
//  LOW ENERGY  ·  recoverable, joint-friendly, calm breathing
// ─────────────────────────────────────────────────────────────

const LOW_ENERGY: Exercise[] = [
  // — Small space —
  {
    id: 'le_001', name: 'Dead Bug',
    description: 'Lie on your back, arms up, knees bent 90°. Lower opposite arm and leg toward the floor while keeping your core braced. Return and alternate sides.',
    equipment: ['none'], muscles: ['core'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_002', name: 'Bird Dog',
    description: 'On all fours, brace your core and extend opposite arm and leg simultaneously. Hold 2 sec, return, and switch sides. Keep hips level.',
    equipment: ['none'], muscles: ['core', 'back'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_003', name: 'Glute Bridge',
    description: 'Lie on your back, feet flat and hip-width apart. Drive through your heels and squeeze your glutes to lift your hips into a straight line. Lower slowly.',
    equipment: ['none'], muscles: ['legs', 'core'], difficulty: 'beginner',
    defaultDuration: 45, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_004', name: 'Wall Sit',
    description: 'Slide your back down a wall until your thighs are parallel to the floor. Hold this seated position, keeping your back flat and knees directly above your ankles.',
    equipment: ['none'], muscles: ['legs'], difficulty: 'beginner',
    defaultDuration: 30, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_005', name: 'Clamshells',
    description: 'Lie on your side with knees bent and stacked. Keeping feet together, rotate your top knee upward like a clamshell opening. Lower with control.',
    equipment: ['none'], muscles: ['legs', 'core'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_006', name: 'Seated Band Row',
    description: 'Sit on the floor, legs straight. Loop a band around your feet. Pull both handles to your ribs, squeezing shoulder blades together, then slowly extend.',
    equipment: ['resistance bands'], muscles: ['back', 'arms'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_007', name: 'Band Pull-Apart',
    description: 'Hold a band at shoulder height with arms straight. Pull the band apart horizontally until your hands reach shoulder level, squeezing rear delts. Return slowly.',
    equipment: ['resistance bands'], muscles: ['shoulders', 'back'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_008', name: 'Dumbbell Skull Crusher',
    description: 'Lie on your back, hold dumbbells above your chest. Bend elbows to lower the weights toward your forehead, then press back up. Keep upper arms fixed.',
    equipment: ['dumbbells', 'full gym'], muscles: ['arms'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_009', name: 'Dumbbell Bicep Curl',
    description: 'Stand with a dumbbell in each hand, palms forward. Curl both weights toward your shoulders by bending the elbows only. Lower slowly for a full stretch.',
    equipment: ['dumbbells', 'full gym'], muscles: ['arms'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'low', spaceRequired: 'small',
  },
  {
    id: 'le_010', name: 'Shoulder External Rotation (Band)',
    description: 'Anchor a band at elbow height. Keep elbow at 90° tucked to your side, rotate your forearm outward against the band resistance. Slow and controlled.',
    equipment: ['resistance bands'], muscles: ['shoulders'], difficulty: 'beginner',
    defaultDuration: 30, energyLevel: 'low', spaceRequired: 'small',
  },
  // — Medium space —
  {
    id: 'le_011', name: 'Cat-Cow Stretch',
    description: 'On all fours, alternate arching your back (cow) and rounding it (cat) with deep breaths. Focus on spinal mobility and breathing rhythm.',
    equipment: ['none'], muscles: ['back', 'core'], difficulty: 'beginner',
    defaultDuration: 45, energyLevel: 'low', spaceRequired: 'medium',
  },
  {
    id: 'le_012', name: 'Cobra Stretch',
    description: 'Lie prone, hands under shoulders. Push up, straightening arms while keeping hips on the floor. Hold the backbend, then lower. Great for lower back relief.',
    equipment: ['none'], muscles: ['back', 'core'], difficulty: 'beginner',
    defaultDuration: 30, energyLevel: 'low', spaceRequired: 'medium',
  },
  {
    id: 'le_013', name: 'Seated Good Morning (Dumbbell)',
    description: 'Sit upright on a bench, dumbbell at chest. Hinge forward at the hips, keeping back flat, until chest nearly meets thighs. Drive hips forward to return.',
    equipment: ['dumbbells', 'full gym'], muscles: ['back', 'legs'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'low', spaceRequired: 'medium',
  },
  {
    id: 'le_014', name: 'Lateral Band Walk',
    description: 'Place a band around your ankles or knees. Take shuffling steps sideways, maintaining squat-quarter depth. Keep toes forward and tension in the band at all times.',
    equipment: ['resistance bands'], muscles: ['legs'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'low', spaceRequired: 'medium',
  },
  {
    id: 'le_015', name: 'Dumbbell Romanian Deadlift',
    description: 'Stand with dumbbells at your thighs. Hinge at hips, pushing them backward, keeping your back flat and knees soft. Lower until you feel hamstring stretch, then drive hips forward.',
    equipment: ['dumbbells', 'full gym'], muscles: ['legs', 'back'], difficulty: 'intermediate',
    defaultDuration: 45, energyLevel: 'low', spaceRequired: 'medium',
  },
];

// ─────────────────────────────────────────────────────────────
//  MEDIUM ENERGY  ·  elevated heart rate, strength-focused
// ─────────────────────────────────────────────────────────────

const MEDIUM_ENERGY: Exercise[] = [
  // — Small space —
  {
    id: 'me_001', name: 'Push-Up',
    description: 'Hands shoulder-width, body rigid from head to heels. Lower chest to the floor keeping elbows at ~45°. Drive through palms to full extension.',
    equipment: ['none'], muscles: ['chest', 'arms', 'shoulders'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_002', name: 'Diamond Push-Up',
    description: 'Form a diamond shape with your index fingers and thumbs. Lower slowly, keeping elbows close to your sides. Emphasises the triceps and inner chest.',
    equipment: ['none'], muscles: ['chest', 'arms'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_003', name: 'Pike Push-Up',
    description: 'Start in a downward-dog position. Bend elbows to lower your head toward the floor between your hands, then press back up. Trains the shoulders like an overhead press.',
    equipment: ['none'], muscles: ['shoulders', 'arms'], difficulty: 'intermediate',
    defaultDuration: 35, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_004', name: 'Tricep Dips (Chair)',
    description: 'Grip the edge of a chair behind you, legs extended. Lower body by bending elbows to 90°, then press back up. Keep your back close to the chair throughout.',
    equipment: ['none'], muscles: ['arms', 'chest', 'shoulders'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_005', name: 'Plank',
    description: 'Forearms on floor, body in a straight line from head to heels. Brace abs, squeeze glutes, and breathe steadily. Avoid letting hips sag or rise.',
    equipment: ['none'], muscles: ['core'], difficulty: 'beginner',
    defaultDuration: 45, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_006', name: 'Side Plank',
    description: 'Prop yourself on one forearm, feet stacked. Hold your body in a diagonal line, lifting hips high. Engage the obliques and keep breathing.',
    equipment: ['none'], muscles: ['core'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_007', name: 'Russian Twist',
    description: 'Sit with knees bent and feet raised slightly. Rotate your torso left and right, touching the floor beside each hip. Add a weight for extra challenge.',
    equipment: ['none'], muscles: ['core'], difficulty: 'intermediate',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_008', name: 'Hollow Body Hold',
    description: 'Lie on your back. Raise your shoulders and legs off the floor a few inches. Arms reach overhead. Your body should form a banana shape. Hold tight.',
    equipment: ['none'], muscles: ['core'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_009', name: 'Band Chest Press',
    description: 'Anchor a band behind you at chest height. Hold handles, step forward, and press both arms straight ahead, extending fully. Control the return.',
    equipment: ['resistance bands'], muscles: ['chest', 'arms', 'shoulders'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_010', name: 'Band Bicep Curl',
    description: 'Stand on the centre of a band, hold handles. Curl both handles up to shoulder height, keeping elbows at your sides. Squeeze at the top.',
    equipment: ['resistance bands'], muscles: ['arms'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_011', name: 'Band Overhead Tricep Extension',
    description: 'Anchor band at the floor. Grasp handle behind your head with both hands. Extend arms straight overhead by pushing up. Keep upper arms fixed.',
    equipment: ['resistance bands'], muscles: ['arms'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_012', name: 'Dumbbell Shoulder Press',
    description: 'Sit or stand with dumbbells at ear level, palms forward. Press both weights directly overhead until arms are fully extended. Lower with control.',
    equipment: ['dumbbells', 'full gym'], muscles: ['shoulders', 'arms'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_013', name: 'Dumbbell Lateral Raise',
    description: 'Stand with dumbbells at your sides, slight bend in elbows. Raise both arms out to the sides until at shoulder height. Lower slowly, avoid swinging.',
    equipment: ['dumbbells', 'full gym'], muscles: ['shoulders'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'medium', spaceRequired: 'small',
  },
  // — Medium space —
  {
    id: 'me_014', name: 'Bodyweight Squat',
    description: 'Stand feet shoulder-width, toes slightly out. Lower into a squat keeping knees tracking over toes and chest tall. Drive through heels to stand.',
    equipment: ['none'], muscles: ['legs'], difficulty: 'beginner',
    defaultDuration: 45, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_015', name: 'Reverse Lunge',
    description: 'Step one foot backward, lower your back knee toward the floor. Your front knee stays over your ankle. Push off your front heel to return. Alternate legs.',
    equipment: ['none'], muscles: ['legs'], difficulty: 'beginner',
    defaultDuration: 45, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_016', name: 'Step-Up',
    description: 'Step one foot onto a sturdy chair or bench. Drive through the heel of that foot to lift your body up. Step down with control and alternate legs.',
    equipment: ['none'], muscles: ['legs', 'core'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_017', name: 'Good Morning',
    description: 'Stand with hands behind your head. Hinge forward at the hips with a flat back until your torso is nearly parallel to the floor. Drive hips forward to return.',
    equipment: ['none'], muscles: ['back', 'legs'], difficulty: 'intermediate',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_018', name: 'Dumbbell Goblet Squat',
    description: 'Hold a dumbbell vertically at your chest. Squat deep, keeping elbows inside your knees at the bottom. Drive through heels and keep chest up.',
    equipment: ['dumbbells', 'full gym'], muscles: ['legs', 'core'], difficulty: 'beginner',
    defaultDuration: 45, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_019', name: 'Dumbbell Bent-Over Row',
    description: 'Hinge at hips with a flat back, dumbbells hanging at arm's length. Pull both to your lower ribs, squeezing shoulder blades. Lower slowly.',
    equipment: ['dumbbells', 'full gym'], muscles: ['back', 'arms'], difficulty: 'intermediate',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_020', name: 'Dumbbell Split Squat',
    description: 'Hold dumbbells at your sides. Take a lunge stance. Lower back knee toward the floor keeping front shin vertical. Press up through the front heel.',
    equipment: ['dumbbells', 'full gym'], muscles: ['legs'], difficulty: 'intermediate',
    defaultDuration: 45, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_021', name: 'Dumbbell Chest Fly',
    description: 'Lie on a bench or floor with dumbbells above your chest, slight bend in elbows. Open arms wide in an arc, lower until you feel a chest stretch, then bring together.',
    equipment: ['dumbbells', 'full gym'], muscles: ['chest'], difficulty: 'intermediate',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_022', name: 'Band Squat',
    description: 'Stand on the band, hold handles at shoulders. Perform a squat with the band resisting you throughout the movement. Drive up explosively.',
    equipment: ['resistance bands'], muscles: ['legs', 'core'], difficulty: 'beginner',
    defaultDuration: 45, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_023', name: 'Band Face Pull',
    description: 'Anchor band at face height. Grip handles, step back. Pull handles toward your face, flaring elbows wide. Excellent for rear delt health.',
    equipment: ['resistance bands'], muscles: ['shoulders', 'back'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'medium', spaceRequired: 'medium',
  },
  {
    id: 'me_024', name: 'Sumo Squat',
    description: 'Wide stance, toes pointed out at 45°. Squat deep keeping knees tracking over toes. Excellent for inner thighs and glutes. Drive through heels.',
    equipment: ['none'], muscles: ['legs'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'medium',
  },
  // — Large space —
  {
    id: 'me_025', name: 'Walking Lunge',
    description: 'Step forward into a lunge, lower your back knee, then bring the back foot forward to take the next lunge step. Alternate legs across the floor.',
    equipment: ['none'], muscles: ['legs'], difficulty: 'intermediate',
    defaultDuration: 45, energyLevel: 'medium', spaceRequired: 'large',
  },
  {
    id: 'me_026', name: 'Bear Crawl',
    description: 'On all fours with knees hovering an inch off the floor, crawl forward by moving opposite hand and foot together. Keep hips low and core engaged.',
    equipment: ['none'], muscles: ['core', 'full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'medium', spaceRequired: 'large',
  },
  {
    id: 'me_027', name: 'Inchworm',
    description: 'Stand tall, hinge forward to touch the floor. Walk hands out to a push-up position, optionally do a push-up, then walk hands back and stand.',
    equipment: ['none'], muscles: ['core', 'full body'], difficulty: 'intermediate',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'large',
  },
  {
    id: 'me_028', name: 'Lateral Lunge',
    description: 'Step wide to one side, lowering into a side lunge while keeping the opposite leg straight. Push back to centre. Targets the inner thighs and glutes.',
    equipment: ['none'], muscles: ['legs'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'large',
  },
  {
    id: 'me_029', name: 'Dumbbell Farmer Carry',
    description: 'Hold heavy dumbbells at your sides. Walk with tall posture, braced core, and controlled breathing. Excellent full-body strength and grip exercise.',
    equipment: ['dumbbells', 'full gym'], muscles: ['full body', 'arms', 'core'], difficulty: 'beginner',
    defaultDuration: 30, energyLevel: 'medium', spaceRequired: 'large',
  },
  // — Full gym specific —
  {
    id: 'me_030', name: 'Lat Pull-Down',
    description: 'Grip the bar wider than shoulders. Pull it to upper chest, driving elbows toward your hips. Lean back slightly and squeeze your lats at the bottom.',
    equipment: ['full gym'], muscles: ['back', 'arms'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_031', name: 'Cable Row',
    description: 'Sit at the cable station, feet on pads. Pull the handle to your lower abdomen, squeezing shoulder blades. Keep your torso upright and avoid rounding your back.',
    equipment: ['full gym'], muscles: ['back', 'arms'], difficulty: 'beginner',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_032', name: 'Leg Press',
    description: 'Sit in the machine, feet shoulder-width on the platform. Press the weight up by extending your legs, then lower slowly until knees reach 90°. Control every rep.',
    equipment: ['full gym'], muscles: ['legs'], difficulty: 'beginner',
    defaultDuration: 45, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_033', name: 'Pec Deck Fly',
    description: 'Sit at the machine with upper arms on the pads. Bring both arms together in front of you squeezing your chest, then return under control.',
    equipment: ['full gym'], muscles: ['chest'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_034', name: 'Tricep Pushdown (Cable)',
    description: 'Stand at a cable machine with a rope or bar attachment at the top. Keep elbows at your sides and push the attachment down until arms are straight. Control the return.',
    equipment: ['full gym'], muscles: ['arms'], difficulty: 'beginner',
    defaultDuration: 35, energyLevel: 'medium', spaceRequired: 'small',
  },
  {
    id: 'me_035', name: 'Dumbbell Incline Press',
    description: 'Set a bench to 30–45° incline. Hold dumbbells at chest level and press straight up. Emphasises the upper chest. Lower slowly for full range.',
    equipment: ['dumbbells', 'full gym'], muscles: ['chest', 'arms', 'shoulders'], difficulty: 'intermediate',
    defaultDuration: 40, energyLevel: 'medium', spaceRequired: 'medium',
  },
];

// ─────────────────────────────────────────────────────────────
//  HIGH ENERGY  ·  cardio, explosive, metabolic conditioning
// ─────────────────────────────────────────────────────────────

const HIGH_ENERGY: Exercise[] = [
  // — Small space —
  {
    id: 'he_001', name: 'Jump Squat',
    description: 'Lower into a full squat, then explode upward off both feet. Land softly, absorbing impact through bending knees, and immediately drop into the next rep.',
    equipment: ['none'], muscles: ['legs', 'full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_002', name: 'Plyo Push-Up',
    description: 'Perform a push-up with enough force that your hands leave the floor at the top. Land with soft elbows and immediately descend into the next rep.',
    equipment: ['none'], muscles: ['chest', 'arms', 'shoulders'], difficulty: 'advanced',
    defaultDuration: 25, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_003', name: 'High Knees',
    description: 'Run in place, driving your knees up to hip level on each step. Pump your arms in rhythm. Keep on your toes and maintain a fast cadence.',
    equipment: ['none'], muscles: ['legs', 'core', 'full body'], difficulty: 'beginner',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_004', name: 'Mountain Climbers',
    description: 'Start in a push-up position. Drive one knee toward your chest while the other leg extends, then rapidly alternate. Keep hips down and core braced.',
    equipment: ['none'], muscles: ['core', 'full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_005', name: 'Tuck Jumps',
    description: 'Jump as high as possible, pulling both knees toward your chest at the top. Land softly and reset quickly for the next jump.',
    equipment: ['none'], muscles: ['legs', 'core'], difficulty: 'advanced',
    defaultDuration: 20, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_006', name: 'Speed Skaters',
    description: 'Leap sideways off one foot, landing on the other while sweeping the trailing leg behind you. Mimic the motion of an ice skater. Touch the floor with one hand.',
    equipment: ['none'], muscles: ['legs', 'core'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_007', name: 'Star Jump (Jumping Jack)',
    description: 'Jump feet out wide while raising arms overhead to form a star, then jump feet together and lower arms. Keep a fast, rhythmic pace.',
    equipment: ['none'], muscles: ['full body'], difficulty: 'beginner',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_008', name: 'Flutter Kicks',
    description: 'Lie on your back, legs raised 6 inches. Alternate small rapid kicks up and down, keeping your lower back pressed into the floor and core tight.',
    equipment: ['none'], muscles: ['core', 'legs'], difficulty: 'intermediate',
    defaultDuration: 35, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_009', name: 'Explosive Band Row',
    description: 'Anchor band in front at hip height. Drive elbows back powerfully and explosively, then control the return. Move with intention — speed on the pull.',
    equipment: ['resistance bands'], muscles: ['back', 'arms', 'full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_010', name: 'Band Squat Jump',
    description: 'Stand on a band holding handles at shoulders. Explosively jump from the squat position against band resistance. Land softly and reset.',
    equipment: ['resistance bands'], muscles: ['legs', 'full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
  // — Medium space —
  {
    id: 'he_011', name: 'Burpee',
    description: 'From standing, drop hands to floor, jump feet back to push-up, do a push-up, jump feet forward, then explode up into a jump with arms overhead.',
    equipment: ['none'], muscles: ['full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_012', name: 'Squat Thrust',
    description: 'Like a half burpee — from standing, squat and place hands on floor, jump feet back to plank, then jump feet forward and stand. No push-up included.',
    equipment: ['none'], muscles: ['full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_013', name: 'Lunge Jump',
    description: 'Start in a lunge position, then explode upward, switching legs in the air to land in a lunge on the opposite side. Absorb the landing with bent knees.',
    equipment: ['none'], muscles: ['legs', 'full body'], difficulty: 'advanced',
    defaultDuration: 25, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_014', name: 'Box Jump',
    description: 'Stand facing a sturdy box or step. Swing arms back, bend knees slightly, then explode onto the box landing softly. Step down one foot at a time.',
    equipment: ['none'], muscles: ['legs', 'full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_015', name: 'Broad Jump',
    description: 'Swing arms and bend knees, then leap forward as far as possible landing in a mini squat. Walk back and repeat. Great for lower body explosive power.',
    equipment: ['none'], muscles: ['legs', 'full body'], difficulty: 'intermediate',
    defaultDuration: 25, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_016', name: 'Dumbbell Thruster',
    description: 'Hold dumbbells at shoulders, squat deep, then drive up and press the dumbbells overhead in one explosive movement. Lower back to shoulders and repeat.',
    equipment: ['dumbbells', 'full gym'], muscles: ['full body'], difficulty: 'intermediate',
    defaultDuration: 35, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_017', name: 'Dumbbell Swing',
    description: 'Hold one dumbbell with both hands. Hinge at hips, swinging it back between legs, then power your hips forward to swing it up to shoulder height. Control the descent.',
    equipment: ['dumbbells', 'full gym'], muscles: ['full body', 'legs', 'core'], difficulty: 'intermediate',
    defaultDuration: 35, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_018', name: 'Kettlebell Sumo Squat + Upright Row',
    description: 'Hold a dumbbell in sumo stance. Squat, then as you rise, pull the weight up along your body to chin height, flaring elbows wide. Lower on descent.',
    equipment: ['dumbbells', 'full gym'], muscles: ['legs', 'shoulders', 'full body'], difficulty: 'intermediate',
    defaultDuration: 40, energyLevel: 'high', spaceRequired: 'medium',
  },
  // — Large space —
  {
    id: 'he_019', name: 'Shuttle Run',
    description: 'Place two markers 5–10m apart. Sprint to the far marker, touch it, sprint back. That's one rep. Accelerate and decelerate with control each time.',
    equipment: ['none'], muscles: ['legs', 'full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'large',
  },
  {
    id: 'he_020', name: 'Sprint Interval',
    description: 'Sprint at 90% max effort for 20–30m, walk back to start. Focus on driving your knees, pumping arms, and staying on your forefoot throughout.',
    equipment: ['none'], muscles: ['legs', 'full body'], difficulty: 'intermediate',
    defaultDuration: 20, energyLevel: 'high', spaceRequired: 'large',
  },
  {
    id: 'he_021', name: 'Lateral Shuffle',
    description: 'Set two markers 4m apart. Shuffle sideways to one, touch the floor, shuffle back. Stay low in an athletic stance and never cross your feet.',
    equipment: ['none'], muscles: ['legs', 'core'], difficulty: 'beginner',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'large',
  },
  {
    id: 'he_022', name: 'Burpee Broad Jump',
    description: 'Do a burpee, then instead of a vertical jump, leap forward as far as possible. Walk back and repeat. Combines explosive power with conditioning.',
    equipment: ['none'], muscles: ['full body'], difficulty: 'advanced',
    defaultDuration: 25, energyLevel: 'high', spaceRequired: 'large',
  },
  {
    id: 'he_023', name: 'Dumbbell Man Makers',
    description: 'Holding dumbbells, do a push-up, then a renegade row each side, hop feet to hands, and stand into a shoulder press. Supreme full-body challenge.',
    equipment: ['dumbbells', 'full gym'], muscles: ['full body'], difficulty: 'advanced',
    defaultDuration: 35, energyLevel: 'high', spaceRequired: 'large',
  },
  // — Full gym exclusive high-energy —
  {
    id: 'he_024', name: 'Barbell Back Squat',
    description: 'Bar across upper traps, feet shoulder-width. Squat until thighs are at least parallel to the floor. Drive up through the whole foot. Keep chest tall.',
    equipment: ['full gym'], muscles: ['legs', 'core', 'full body'], difficulty: 'intermediate',
    defaultDuration: 45, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_025', name: 'Barbell Deadlift',
    description: 'Bar over mid-foot. Hinge and grip bar shoulder-width. Brace through lats and core, drive the floor away to stand. Hinge to lower the bar back down.',
    equipment: ['full gym'], muscles: ['back', 'legs', 'full body'], difficulty: 'advanced',
    defaultDuration: 45, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_026', name: 'Barbell Bench Press',
    description: 'Lie on a bench, bar over your chest. Unrack and lower to the sternum with control. Drive your feet into the floor and press the bar back to the start.',
    equipment: ['full gym'], muscles: ['chest', 'arms', 'shoulders'], difficulty: 'intermediate',
    defaultDuration: 45, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_027', name: 'Pull-Up',
    description: 'Hang from a bar with an overhand grip, hands slightly wider than shoulders. Pull your chin above the bar, leading with your elbows down. Lower fully.',
    equipment: ['full gym'], muscles: ['back', 'arms'], difficulty: 'advanced',
    defaultDuration: 35, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_028', name: 'Chin-Up',
    description: 'Hang from a bar with an underhand grip, shoulder-width. Pull your chest to the bar, keeping elbows close to your body. Squeeze your biceps at the top.',
    equipment: ['full gym'], muscles: ['back', 'arms'], difficulty: 'intermediate',
    defaultDuration: 35, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_029', name: 'Battle Rope Slams',
    description: 'Hold a rope in each hand. Use full-body power — legs, core, and arms — to slam both ropes explosively to the floor simultaneously. Go hard every rep.',
    equipment: ['full gym'], muscles: ['full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'medium',
  },
  {
    id: 'he_030', name: 'Treadmill Sprint',
    description: 'Set treadmill to 85–95% of max speed. Sprint for 20–30 seconds, rest for 40 seconds. Maintain an upright posture and light arm swing throughout.',
    equipment: ['full gym'], muscles: ['legs', 'full body'], difficulty: 'intermediate',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
  {
    id: 'he_031', name: 'Rowing Machine Sprint',
    description: 'Drive through your legs first, then lean back and pull the handle to your lower ribs. Slide forward and repeat. Sprint for intensity; feel every muscle.',
    equipment: ['full gym'], muscles: ['full body'], difficulty: 'beginner',
    defaultDuration: 30, energyLevel: 'high', spaceRequired: 'small',
  },
];

// ─────────────────────────────────────────────────────────────
//  COMBINED EXPORT
// ─────────────────────────────────────────────────────────────

export const EXERCISE_DB: Exercise[] = [
  ...LOW_ENERGY,
  ...MEDIUM_ENERGY,
  ...HIGH_ENERGY,
];
