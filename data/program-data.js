/* Morrice Softball — coach-curated teaching scenarios, workouts and media entries. */
window.MORRICE_PROGRAM_DATA = {
  "situations": [
    {
      "id": "01",
      "tag": "THE ROUTINE FORCE",
      "type": "Ground ball",
      "spot": "Shortstop",
      "runners": "1st",
      "outs": 1,
      "question": "R1 on first, one out. Ground ball directly to shortstop. What is the first sure-out read?",
      "choices": [
        "Take the routine force at second if the throw is clean",
        "Fire to third—always lead base",
        "Throw home to stop a run"
      ],
      "answer": 0,
      "why": "The force at second is available. Take it if routine; otherwise secure the out at first. Don’t try to turn a double play until you have the first out.",
      "standard": "SURE OUT > HERO OUT",
      "fielder": "SS",
      "target": "2B",
      "category": "Force play"
    },
    {
      "id": "02",
      "tag": "THE FORCE AT THIRD",
      "type": "Ground ball",
      "spot": "Third base",
      "runners": "1st + 2nd",
      "outs": 1,
      "question": "Runners on first and second. One out. A routine ball is hit to third base. Where is the lead force?",
      "choices": [
        "Home plate",
        "Third base",
        "Second base"
      ],
      "answer": 1,
      "why": "With R1 and R2, the runner on second is forced to third. If 3B can step on the bag safely, take the lead force. Otherwise take the easier out.",
      "standard": "KNOW THE FORCE",
      "fielder": "3B",
      "target": "3B",
      "category": "Force play"
    },
    {
      "id": "03",
      "tag": "CUT OFF FIRST-TO-THIRD",
      "type": "Base hit",
      "spot": "Left field",
      "runners": "1st",
      "outs": 0,
      "question": "A clean single goes to left field with a runner starting at first. Which base should the defense line up to protect?",
      "choices": [
        "First base",
        "Second base regardless of the advance",
        "Third base"
      ],
      "answer": 2,
      "why": "Read the lead runner trying to go from first to third. Align the cutoff to third, and cut or hold the ball if the runner is already safe.",
      "standard": "PREVENT EXTRA BASES",
      "fielder": "LF",
      "target": "3B",
      "category": "Outfield"
    },
    {
      "id": "04",
      "tag": "PLAY AT THE PLATE",
      "type": "Base hit",
      "spot": "Right field",
      "runners": "2nd",
      "outs": 1,
      "question": "Runner on second. A single is hit to right field. Where should the relay organize if the runner may try to score?",
      "choices": [
        "Second base",
        "Home plate",
        "First base"
      ],
      "answer": 1,
      "why": "Set the line toward home. The actual throw depends on ball depth, runner speed and whether a play is realistic. Cut and redirect when the plate is lost.",
      "standard": "MAKE THE CORRECT READ",
      "fielder": "RF",
      "target": "HOME",
      "category": "Outfield"
    },
    {
      "id": "05",
      "tag": "NO HOPELESS THROW",
      "type": "Base hit",
      "spot": "Center field",
      "runners": "3rd",
      "outs": 0,
      "question": "Runner at third scores on a clean outfield single. What is the priority once a play at home is clearly gone?",
      "choices": [
        "Fire home anyway",
        "Get the ball in and prevent the batter advancing to second",
        "Hold the ball in the outfield"
      ],
      "answer": 1,
      "why": "Avoid a late home throw that lets the batter reach second. Bring the ball through your cutoff to control the next base.",
      "standard": "EAT IT WHEN THERE IS NO PLAY",
      "fielder": "CF",
      "target": "2B",
      "category": "Outfield"
    },
    {
      "id": "06",
      "tag": "EMPTY BASES",
      "type": "Base hit",
      "spot": "Left field",
      "runners": "Empty",
      "outs": 0,
      "question": "A single goes to left with the bases empty. What is the default cutoff destination?",
      "choices": [
        "Second base",
        "Home plate",
        "Third base"
      ],
      "answer": 0,
      "why": "The batter-runner is the only runner. Keep the single a single with a clean throw through the cutoff toward second.",
      "standard": "KEEP THE HITTER AT FIRST",
      "fielder": "LF",
      "target": "2B",
      "category": "Outfield"
    },
    {
      "id": "07",
      "tag": "TAG AT HOME",
      "type": "Caught fly",
      "spot": "Right field",
      "runners": "Loaded",
      "outs": 0,
      "question": "Bases loaded, no outs. The right fielder catches a shallow fly. Runner on third tags and breaks for home. What is the primary throwing target?",
      "choices": [
        "Second base",
        "Home plate, if there is a play",
        "First base"
      ],
      "answer": 1,
      "why": "Secure the catch first, then make a quick, accurate throw toward the plate if the tag-up play is realistic. Backups must respond to the actual throw.",
      "standard": "CATCH FIRST, THEN THROW",
      "fielder": "RF",
      "target": "HOME",
      "category": "Tag play"
    },
    {
      "id": "08",
      "tag": "FIRST AND THIRD",
      "type": "Base hit",
      "spot": "Left field",
      "runners": "1st + 3rd",
      "outs": 1,
      "question": "Runners at first and third. A routine hit drops into left. Home is already lost. Which additional base should the defense protect?",
      "choices": [
        "Third base for the runner advancing from first",
        "Always home",
        "First base"
      ],
      "answer": 0,
      "why": "If the runner from third has scored safely, keep R1 from taking third. This is a read, not an automatic throw.",
      "standard": "STOP THE BIG INNING",
      "fielder": "LF",
      "target": "3B",
      "category": "Outfield"
    },
    {
      "id": "09",
      "tag": "THE BUNT ROTATION",
      "type": "Bunt",
      "spot": "Third-base line",
      "runners": "1st",
      "outs": 0,
      "question": "Runner on first. A bunt rolls up the third-base line. What must happen before anyone charges?",
      "choices": [
        "3B charges; teammates communicate first-base and third-base coverage",
        "Both corners leave their bases with no call",
        "Everyone watches the pitcher"
      ],
      "answer": 0,
      "why": "The primary fielder charges under control. The middle infield and pitcher rotate according to the called coverage. Do not leave first unprotected.",
      "standard": "CORNERS CRASH / MIDDLE ROTATES",
      "fielder": "3B",
      "target": "1B",
      "category": "Bunt"
    },
    {
      "id": "10",
      "tag": "INFIELD FLY / COMMUNICATION",
      "type": "Pop fly",
      "spot": "Second base",
      "runners": "1st + 2nd",
      "outs": 1,
      "question": "One out, runners at first and second. A high pop-up stays in the infield. What comes first?",
      "choices": [
        "Throw immediately to second",
        "Communicate, secure the catch, then read runners",
        "Assume every runner advances"
      ],
      "answer": 1,
      "why": "Call the ball early and loudly. Know the infield-fly rule when it applies; runners are not automatically forced after the batter is out.",
      "standard": "BALL FIRST ALWAYS",
      "fielder": "2B",
      "target": "HOLD",
      "category": "Fly ball"
    },
    {
      "id": "11",
      "tag": "DOUBLE-PLAY TEMPTATION",
      "type": "Ground ball",
      "spot": "Second base",
      "runners": "1st + 2nd",
      "outs": 0,
      "question": "No outs, runners first and second. Routine grounder to second baseman. What is the foundation of the play?",
      "choices": [
        "Secure the ball and sure lead force, then assess a second throw",
        "Try to throw home",
        "Throw to third without checking the angle"
      ],
      "answer": 0,
      "why": "Make the first out with accuracy. A second out is a bonus only if there is time; a bad pivot can turn an easy out into a big inning.",
      "standard": "SURE OUT > HERO OUT",
      "fielder": "2B",
      "target": "2B",
      "category": "Force play"
    },
    {
      "id": "12",
      "tag": "PITCHER FIELDS",
      "type": "Dribbler",
      "spot": "Pitcher",
      "runners": "Empty",
      "outs": 2,
      "question": "Two outs, bases empty. A slow dribbler is hit directly to the pitcher. What is the play?",
      "choices": [
        "Take the clean out at first",
        "Throw to second",
        "Wait for the catcher to call the batter out"
      ],
      "answer": 0,
      "why": "Field cleanly, set the feet, and throw to a covered first base. No need for a spectacular play.",
      "standard": "MAKE THE ROUTINE PLAY ELITE",
      "fielder": "P",
      "target": "1B",
      "category": "Infield"
    },
    {
      "id": "13",
      "tag": "TWO-OUT SINGLE",
      "type": "Base hit",
      "spot": "Right field",
      "runners": "Loaded",
      "outs": 2,
      "question": "Bases loaded, two outs. A sharp single gets through the right side. The runner from second attempts to score. What should dictate the throw?",
      "choices": [
        "A realistic play at home through the called relay",
        "Throw to first by default",
        "Throw home even with no chance"
      ],
      "answer": 0,
      "why": "Organize to home if the second runner can be retired, but cut or redirect if beaten. A base hit does not itself create a force at home.",
      "standard": "READ / REACT / EXECUTE",
      "fielder": "RF",
      "target": "HOME",
      "category": "Outfield"
    },
    {
      "id": "14",
      "tag": "TAG TO THIRD",
      "type": "Caught fly",
      "spot": "Center field",
      "runners": "2nd",
      "outs": 0,
      "question": "Runner on second. A deep fly ball is caught in center; the runner tags and attempts third. What is the primary read?",
      "choices": [
        "Throw to third if a play exists",
        "Throw to first",
        "Ignore the tag"
      ],
      "answer": 0,
      "why": "Catch first. Then challenge the tag-up at third only when the throw and timing are realistic. The cutoff should line up the actual target.",
      "standard": "CATCH / FIND / THROW",
      "fielder": "CF",
      "target": "3B",
      "category": "Tag play"
    },
    {
      "id": "15",
      "tag": "RUNNER ON THIRD",
      "type": "Ground ball",
      "spot": "Shortstop",
      "runners": "3rd",
      "outs": 1,
      "question": "One out, runner at third. A sharply hit grounder goes to short. The runner freezes. What is the safe read?",
      "choices": [
        "Sure out at first, while reading the runner",
        "Throw home without checking",
        "No throw"
      ],
      "answer": 0,
      "why": "Take the routine out at first unless there is an obvious, called play at home. Stop one run from becoming three.",
      "standard": "SURE OUT FIRST",
      "fielder": "SS",
      "target": "1B",
      "category": "Infield"
    },
    {
      "id": "16",
      "tag": "GAP COVERAGE",
      "type": "Base hit",
      "spot": "Left-center gap",
      "runners": "1st",
      "outs": 0,
      "question": "A hit splits left and center. Runner starts at first. Which communication principle matters most?",
      "choices": [
        "Both outfielders dive at the same ball",
        "Center field takes command, adjacent fielder supports and backs up",
        "Leave second base uncovered"
      ],
      "answer": 1,
      "why": "CF runs the outfield and calls the gap. Field it securely, align relay toward third if the lead runner threatens, and cover the vacated positions.",
      "standard": "CF RUNS THE OUTFIELD",
      "fielder": "CF",
      "target": "3B",
      "category": "Outfield"
    }
  ],
  "pitch": [
    {
      "id": "A",
      "count": "0–0",
      "hitter": "Aggressive first-pitch swinger",
      "prompt": "Your pitcher has a reliable fastball and changeup. The hitter attacks early. What is your call?",
      "choices": [
        "Fastball at the heart of the plate",
        "Controlled changeup below the hitting zone",
        "Waste pitch several feet outside"
      ],
      "answer": 1,
      "why": "A changeup can disrupt an aggressive hitter when the pitcher can locate it and sell fastball arm speed. Do not call a noncompetitive pitch just to be clever.",
      "principle": "ATTACK THE HITTER’S TIMING",
      "zone": "Low edge"
    },
    {
      "id": "B",
      "count": "0–2",
      "hitter": "Disciplined hitter",
      "prompt": "Ahead 0–2 with a reliable fastball. Which is the most sensible next pitch plan?",
      "choices": [
        "Challenge middle-middle automatically",
        "Quality pitch near the edge of the zone; avoid giving away a free ball",
        "Throw a changeup in the dirt regardless of command"
      ],
      "answer": 1,
      "why": "An 0–2 count gives you options, but the best call still depends on pitcher command and what the hitter has shown. Aim to compete without offering a gift pitch.",
      "principle": "WIN THE NEXT PITCH",
      "zone": "Outer edge"
    },
    {
      "id": "C",
      "count": "3–0",
      "hitter": "Patient hitter",
      "prompt": "Pitcher has missed three times in a row. What should guide the next call?",
      "choices": [
        "A confidently located strike, usually the best-command fastball",
        "Try the least reliable trick pitch",
        "Aim behind the hitter"
      ],
      "answer": 0,
      "why": "The first job at 3–0 is command. Unless there is a specific called intentional walk or strategic reason, trust the pitch with the best chance to be a controlled strike.",
      "principle": "COMMAND BEFORE DECEPTION",
      "zone": "Best-control zone"
    },
    {
      "id": "D",
      "count": "1–1",
      "hitter": "Sitting on a fastball",
      "prompt": "The hitter is on time for the fastball. Your pitcher throws a usable changeup. What can change the look?",
      "choices": [
        "Repeat same-speed middle fastball",
        "Changeup with convincing fastball delivery",
        "Intentional ball four"
      ],
      "answer": 1,
      "why": "A well-disguised changeup can alter timing. It works only if the pitcher owns the pitch and can throw it competitively.",
      "principle": "CHANGE SPEED, NOT ARM ACTION",
      "zone": "Low edge"
    },
    {
      "id": "E",
      "count": "2–2",
      "hitter": "Chases pitches high",
      "prompt": "You have two strikes and the hitter has expanded up. Which option might exploit the observed tendency?",
      "choices": [
        "Elevated fastball just above the top of the zone, if commanded",
        "Fastball straight down the middle regardless",
        "A pitch the catcher cannot receive"
      ],
      "answer": 0,
      "why": "A carefully elevated fastball is an option when the hitter has shown that chase tendency. Do not turn a strikeout attempt into a wild pitch with runners aboard.",
      "principle": "PITCH WITH EVIDENCE",
      "zone": "Top edge"
    },
    {
      "id": "F",
      "count": "3–2",
      "hitter": "Runner on third",
      "prompt": "Full count, runner at third. The changeup has been inconsistent. What is the higher-percentage call?",
      "choices": [
        "The best-command fastball to a competitive location",
        "The least reliable changeup in the dirt",
        "Deliberately bounce a fastball"
      ],
      "answer": 0,
      "why": "Your pitcher must throw a usable strike and the catcher must receive it. Protect against a walk or passed ball rather than forcing a clever call.",
      "principle": "EXECUTION OVER SURPRISE",
      "zone": "Reliable strike zone"
    }
  ],
  "positions": [
    {
      "code": "P",
      "name": "PITCHER",
      "rule": "Own the middle. Field the ball first.",
      "before": "Start balanced, know runners, and know the play at first and home.",
      "primary": "Field middle bunts and comebackers; cover and back up bases as the actual throw requires.",
      "mistake": "Never chase a bunt so far that the field loses coverage.",
      "reminder": "On contact: secure it, communicate the target, throw through the base."
    },
    {
      "code": "C",
      "name": "CATCHER",
      "rule": "See the whole field. Lead the call.",
      "before": "Know outs, runners, force at home, and bunt/squeeze signals.",
      "primary": "Call the infield, direct the cutoff, receive home throws, and cover the plate.",
      "mistake": "Do not leave home open without a specific assignment.",
      "reminder": "Call the next play before the pitch; talk after contact."
    },
    {
      "code": "1B",
      "name": "FIRST BASE",
      "rule": "An out at first is worth protecting.",
      "before": "With a runner on first, hold the runner as your starting responsibility.",
      "primary": "Receive throws at first; charge the called bunt and communicate replacement coverage.",
      "mistake": "Do not charge away from first without coverage.",
      "reminder": "Find the bag, the ball, and the throwing lane."
    },
    {
      "code": "2B",
      "name": "SECOND BASE",
      "rule": "Know the force. Move before the throw.",
      "before": "Count outs and check which middle infielder has the bag or cutoff.",
      "primary": "Cover second or first in called rotations; set the right-side relay; communicate.",
      "mistake": "Do not stand where the throw is coming; create a lane.",
      "reminder": "Read the ball and cover the sure out first."
    },
    {
      "code": "SS",
      "name": "SHORTSTOP",
      "rule": "You run the infield. Say the play.",
      "before": "Know force/tag situations and who covers each bag.",
      "primary": "Direct the infield, take called second-base coverage, relay/cutoff, back up third when assigned.",
      "mistake": "Do not automatically chase the ball and vacate a needed base.",
      "reminder": "LOUD EARLY CALL. Make the routine play elite."
    },
    {
      "code": "3B",
      "name": "THIRD BASE",
      "rule": "Protect the line. Crash with purpose.",
      "before": "Read the bunt and runner at third before each pitch.",
      "primary": "Secure balls on the left side; charge bunts only with called rotation.",
      "mistake": "Do not leave third uncovered if a runner can advance there.",
      "reminder": "Know whether the out is a tag or a force."
    },
    {
      "code": "LF",
      "name": "LEFT FIELD",
      "rule": "Get behind it. Talk early.",
      "before": "Know the lead runner and likely next base.",
      "primary": "Primary in left; back up CF in the gap; throw through the called cutoff.",
      "mistake": "Do not throw past the cutoff into an easy extra base.",
      "reminder": "Control the ball. Hit the cutoff. Keep the double play in order."
    },
    {
      "code": "CF",
      "name": "CENTER FIELD",
      "rule": "You run the outfield. Own the gaps.",
      "before": "Know runner speed, outfield depth, and where LF/RF play.",
      "primary": "Call the gap and priority balls; direct outfield coverage and backups.",
      "mistake": "Never assume the corner fielder hears you—call loud and early.",
      "reminder": "BALL FIRST ALWAYS. Go get it; communicate."
    },
    {
      "code": "RF",
      "name": "RIGHT FIELD",
      "rule": "Keep runners honest. Attack the backup.",
      "before": "Know first-to-third threats and cutoffs before the pitch.",
      "primary": "Primary in right; back up CF in the gap and first base when assigned.",
      "mistake": "Do not concede extra bases with a slow recovery.",
      "reminder": "Get behind the ball and throw to a useful cutoff."
    }
  ],
  "factory": [
    {
      "id": "A",
      "title": "DAY A / LOWER BODY + ROTATION",
      "theme": "Build the base. Transfer power.",
      "moves": [
        [
          "Dynamic warm-up",
          "Leg swings, arm circles, skips and shuffles",
          "5 min"
        ],
        [
          "Goblet squat",
          "Controlled full-foot squat",
          "3 × 6"
        ],
        [
          "Dumbbell row",
          "Flat back and steady pull",
          "3 × 8 per side"
        ],
        [
          "Medicine-ball rotational throw",
          "Athletic stance; rotate hips and trunk together",
          "3 × 5 per side"
        ],
        [
          "Split squat",
          "Controlled knee tracking",
          "2 × 8 per leg"
        ],
        [
          "Farmer carry",
          "Tall posture; firm grip",
          "3 × 20 yd"
        ],
        [
          "Cool-down",
          "Hip flexor, hamstring and shoulder mobility",
          "4 min"
        ]
      ]
    },
    {
      "id": "B",
      "title": "DAY B / PUSH + HIP DRIVE",
      "theme": "Strength that carries to the field.",
      "moves": [
        [
          "Dynamic warm-up",
          "Leg swings, walking lunges, arm circles",
          "5 min"
        ],
        [
          "Dumbbell Romanian deadlift",
          "Hinge at hips; neutral back",
          "3 × 6"
        ],
        [
          "Dumbbell floor press",
          "Controlled lowering and strong push",
          "3 × 8"
        ],
        [
          "Medicine-ball chest pass",
          "Explosive with a partner or safe wall",
          "3 × 5"
        ],
        [
          "Band lateral walk",
          "Hips level, deliberate steps",
          "2 × 10 each way"
        ],
        [
          "Glute bridge",
          "Finish with hips, not lower back",
          "2 × 12"
        ],
        [
          "Cool-down",
          "Breathing, glute and upper-body mobility",
          "4 min"
        ]
      ]
    },
    {
      "id": "C",
      "title": "DAY C / SPEED + STABILITY",
      "theme": "Explode under control.",
      "moves": [
        [
          "Dynamic warm-up",
          "Skips, side shuffles, high-knee walks",
          "5 min"
        ],
        [
          "Step-up",
          "Controlled drive through lead leg",
          "3 × 6 per leg"
        ],
        [
          "Single-arm dumbbell row",
          "Brace and pull; level shoulders",
          "3 × 8 per side"
        ],
        [
          "Medicine-ball slam",
          "Athletic posture, safe bounce area",
          "3 × 5"
        ],
        [
          "Band external rotation",
          "Elbow by side, light tension",
          "2 × 10 per side"
        ],
        [
          "Short acceleration",
          "Crisp starts, full walk-back recovery",
          "4 × 10 yd"
        ],
        [
          "Cool-down",
          "Calf, hip and shoulder mobility",
          "4 min"
        ]
      ]
    }
  ],
  "media": [],
  "vaultMilestones": [
    {
      "year": "1993",
      "title": "STATE RUNNER-UP",
      "description": "The Orioles advanced through the state semifinal and reached the championship game; the record book lists a 2–7 final against Waterford Our Lady.",
      "page": 3
    },
    {
      "year": "1995",
      "title": "STATE RUNNER-UP",
      "description": "A second state title-game appearance after a 2–1 semifinal win against Au Gres-Sims; the book records a 0–5 championship result.",
      "page": 3
    },
    {
      "year": "1996",
      "title": "STATE SEMIFINALIST",
      "description": "Morrice reached the state semifinal following a 9–3 quarterfinal victory over North Muskegon.",
      "page": 3
    },
    {
      "year": "2017",
      "title": "REGIONAL APPEARANCE",
      "description": "The Orioles defeated Fowler and Portland St. Patrick in districts, then won their regional opener over Blanchard Montabella.",
      "page": 2
    }
  ]
};
