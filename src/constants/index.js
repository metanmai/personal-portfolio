const personal = {
  name: "TANMAI NIRANJAN",
  designation: "STATUS: AT LARGE",
  handle: "metanmai",
  role: "GENERAL PURPOSE BUILDER",
  established: 2002,
  bio: "SUBJECT HAS SPENT YEARS TRYING TO UNDERSTAND HOW THINGS WORK AND IMPROVE THEM AGAINST THEIR WILL. KNOWN TO COLLECT PROJECTS, DISAPPEAR INTO RABBIT HOLES, AND RETURN WITH MORE QUESTIONS THAN ANSWERS. REQUIRES THE GYM, GOOD FOOD, AND NEW PROBLEMS TO REMAIN STABLE. CONTAINMENT ATTEMPTS HAVE SHOWN LIMITED SUCCESS.",
  portrait: "img/boy-computer.png",
};


const menuItems = [
  { num: "01", label: "CAREER DOSSIER", hint: "work", path: "/career" },
  {
    num: "02",
    label: "FIELD OPERATIONS",
    hint: "deployments",
    path: "/projects",
  },
  {
    num: "03",
    label: "PERSONNEL FILE",
    hint: "classified",
    path: "/personnel",
    locked: true,
  },
  {
    num: "04",
    label: "SUBJECT SURVEILLANCE",
    hint: "live feed",
    path: "/monitor",
  },
  { num: "05", label: "OPEN COMMS CHANNEL", hint: "contact", path: "/comms" },
];

const commands = [
  { name: "help", desc: "LIST AVAILABLE COMMANDS" },
  { name: "ls", desc: "LIST TERMINAL SCREENS" },
  { name: "open", desc: "OPEN <SCREEN> — E.G. OPEN CAREER" },
  { name: "theme", desc: "CYCLE PHOSPHOR COLOR" },
  { name: "sound", desc: "TOGGLE AUDIO ON/OFF" },
  { name: "whoami", desc: "IDENTIFY CURRENT OPERATOR" },
  { name: "clear", desc: "CLEAR PROMPT OUTPUT" },
  { name: "hack", desc: "ATTEMPT SECURITY BYPASS" },
  { name: "logout", desc: "END SESSION" },
];

const hackGame = {
  attempts: 4,
};

const monitor = {
    githubUser: 'metanmai',
    leetcodeUser: 'metanmai',
};

const experience = [
  {
    period: "2024 — PRESENT",
    title: "SOFTWARE DEVELOPMENT ENGINEER - I",
    org: "FINTECH — BANGALORE",
    summary:
      "GROWTH TEAM — PAYMENTS, AUTH, IDENTITY & COMMUNICATIONS. ENGINEERED ULTRA-LOW-LATENCY RISK MANAGEMENT SYSTEM IN RUST. OWNER OF BINARY OPTIONS TRADING MICROSERVICE. MIGRATED COMMS SERVICE IN-HOUSE. CUT INFRA COSTS BY $35K/MONTH.",
  },
  {
    period: "MAR 2024 — MAY 2024",
    title: "BACKEND DEVELOPMENT INTERN",
    org: "JAR",
    summary:
      "BUILT RESTFUL APIS AND DROOLS RULE-CHECKING FOR THE LENDING FEATURE. DIAGNOSED AND RESOLVED 20+ CRITICAL BUGS IN THE JAVA SPRING BOOT CODEBASE.",
  },
  {
    period: "JUN 2023 — SEP 2023",
    title: "SOFTWARE DEVELOPMENT INTERN",
    org: "PCLOUDY",
    summary:
      "SPEARHEADED SELF-HEALING AUTOMATION IN MOBILE APP TESTING USING VISUAL AI. REDUCED TESTING DURATION BY 65% AND MANUAL INTERVENTION BY 47%. BUILT SCALABLE BACKEND SYSTEM ON AWS.",
  },
];

// Life-stage timeline for the PERSONNEL FILE. Each section has its own
// surveillance "capture" — selecting a section swaps the portrait on the right.
// Drop the matching photos in public/img/ as timeline-1.png ... timeline-5.png
// (or change these paths/extensions to match your files).
const journey = [
  {
    title: "FIRST RECORDED OFFENSE",
    note: "INCIDENT LOGGED — BANGALORE.",
    body: "SUBJECT OBSERVED RIDING A VEGETABLE VENDOR'S CART UNDER UNCLEAR AUTHORITY. HAND POSITIONING AND VISUAL ANALYSIS SUGGEST EARLY RESOURCE ACQUISITION BEHAVIOR. NO VEGETABLES WERE RECOVERED. CASE REMAINS OPEN.",
    image: "img/timeline-1.jpg",
  },
  {
    title: "JUVENILE PHASE",
    note: "SCREEN DEPENDENCY DETECTED.",
    body: "SUBJECT ENTERS A PROLONGED HORIZONTAL STATE WHILE OPERATING A HANDHELD DEVICE. EARLY SIGNS OF DEEP FOCUS OBSERVED. EXTERNAL STIMULI INCREASINGLY IGNORED.",
    image: "img/timeline-2.jpg",
  },
  {
    title: "METAMORPHOSIS",
    note: "IDENTITY RECONSTRUCTION IN PROGRESS.",
    body: "SUBJECT ENTERS AN UNSTABLE DEVELOPMENT CYCLE. LIMBS LENGTHEN. VOICE PATCHES APPLIED INCONSISTENTLY. BEGINS FORMING ORIGINAL THOUGHTS AND IMMEDIATELY REGRETS SOME OF THEM. DETECTION OF SELF-AWARENESS CONFIRMED.",
    image: "img/timeline-3.jpg",
  },
  {
    title: "CONTAINMENT FAILURE IMMINENT",
    note: "DO NOT APPROACH.",
    body: "SUBJECT DEVELOPS FERAL FEATURES, IRREGULAR SLEEP CYCLES, AND STRONG SCREEN-DEPENDENT TENDENCIES, PROLONGED ISOLATION PRODUCED UNEXPECTED MUTATIONS. LATE STAGE, APPEARS LESS LIKE A HUMAN AND MORE LIKE A FOREST ENCOUNTER REPORT. COMMUNICATION IS LIMITED.",
    image: "img/timeline-4.jpg",
  },
  {
    title: "CONTAINMENT BREACH",
    note: "CURRENT STATUS: AT LARGE.",
    body: "SUBJECT UNDERGOES A COMPLETE VISUAL RECONFIGURATION. FACIAL PROFILE NORMALIZED. BEHAVIORAL ANOMALIES PERSIST. SUBJECT IS NO LONGER BELIEVED TO BE CONTAINED AND HAS SINCE REENTERED CIVILIZATION UNDER A CONVINCING HUMAN DISGUISE.",
    image: "img/timeline-5.JPG",
  },
];


// Offline fallbacks for the SUBJECT SURVEILLANCE game/audio logs: `nowPlaying`
// captions the Game Log and `music.genres` backs the Audio Log when the live
// Last.fm genre aggregation is empty.
const recreation = {
    games: {
        nowPlaying: 'FALLOUT: NEW VEGAS',
        allTimers: ['FALLOUT: NEW VEGAS', 'DISCO ELYSIUM', 'HOLLOW KNIGHT', 'ELDEN RING'],
    },
    music: {
        genres: ['PSYCHEDELIC ROCK', 'ALTERNATIVE', 'LO-FI', 'SYNTHWAVE'],
    },
};

const skills = [
  { name: "golang", level: 90 },
  { name: "rust", level: 80 },
  { name: "typescript", level: 85 },
  { name: "python", level: 85 },
  { name: "java", level: 80 },
  { name: "c++", level: 75 },
  { name: "postgresql", level: 85 },
  { name: "redis", level: 80 },
  { name: "aws", level: 80 },
  { name: "docker", level: 75 },
];

const projects = [
  {
    id: 1,
    name: "SYNAPSE MCP",
    description:
      "Cross-session AI context management tool. NPM-installable MCP server enabling AI assistants to persist and retrieve knowledge across sessions, tools, and teammates. Built with TypeScript, Svelte, Supabase, and Cloudflare Workers.",
    thumbnail: "img/dark-purple-gradient.jpeg",
    link: "https://github.com/metanmai/synapse",
    tech: ["typescript", "svelte", "supabase", "cloudflare workers"],
  },
  {
    id: 2,
    name: "GRAPH FUNCTIONALITIES",
    description:
      "Core functions from NetworkX and Boost graph libraries reimplemented in C++ for high-performance computing. Solutions outperformed Python counterparts by 25% on average.",
    thumbnail: "img/graph-functionalities.webp",
    link: "https://github.com/metanmai/Graph_Functionalities",
    tech: ["C++", "pybind"],
  },
  {
    id: 3,
    name: "CHATTERBOX",
    description:
      "A versatile blogging platform where users can share their thoughts, stories, and ideas with a global audience. Built with Flask and Bootstrap.",
    thumbnail: "img/chatterbox.png",
    link: "https://github.com/metanmai/chatterbox",
    tech: ["flask", "bootstrap"],
  },
];

const testimonials = [
  {
    text: "He has a natural talent for breaking down complex topics into easily digestible components, which not only benefits him in his own learning but also makes him an excellent resource for his peers.",
    person: "Avinash Tiwari",
    company: "pCloudy",
    role: "CEO",
  },
  {
    text: "Tanmai's work ethic extends beyond the classroom, as he willingly takes on challenging projects and consistently meets deadlines with high-quality results.",
    person: "Shibu Prasad Panda",
    company: "pCloudy",
    role: "Senior Lead Software Developer",
  },
  {
    text: "Tanmai's commitment to his work is truly impressive, and his ability to tackle challenges with a positive mindset is an asset to any team.",
    person: "Kofi Opoku",
    company: "Dosh",
    role: "Director",
  },
  {
    text: "Tanmai is not only a dedicated and hardworking student but also a team player who consistently brings a positive attitude to every project.",
    person: "Vishnu Athreya",
    company: "OPIN Tech",
    role: "Head Of Logistics",
  },
];

const socials = [
  { name: "GITHUB", link: "https://github.com/metanmai/" },
  {
    name: "LINKEDIN",
    link: "https://www.linkedin.com/in/tanmai-niranjan-76326b288/",
  },
  { name: "LEETCODE", link: "https://leetcode.com/metanmai/" },
];

const asciiBanner = [
  "$$$$$$$$\\  $$$$$$\\  $$\\   $$\\ $$\\      $$\\  $$$$$$\\  $$$$$$\\",
  "\\__$$  __|$$  __$$\\ $$$\\  $$ |$$$\\    $$$ |$$  __$$\\ \\_$$  _|",
  "   $$ |   $$ /  $$ |$$$$\\ $$ |$$$$\\  $$$$ |$$ /  $$ |  $$ |",
  "   $$ |   $$$$$$$$ |$$ $$\\$$ |$$\\$$\\$$ $$ |$$$$$$$$ |  $$ |",
  "   $$ |   $$  __$$ |$$ \\$$$$ |$$ \\$$$  $$ |$$  __$$ |  $$ |",
  "   $$ |   $$ |  $$ |$$ |\\$$$ |$$ |\\$  /$$ |$$ |  $$ |  $$ |",
  "   $$ |   $$ |  $$ |$$ | \\$$ |$$ | \\_/ $$ |$$ |  $$ |$$$$$$\\",
  "   \\__|   \\__|  \\__|\\__|  \\__|\\__|     \\__|\\__|  \\__|\\______|",
];

const diagnostics = [
  "MEMORY CHECK .......... OK",
  "RADIATION SHIELDING ... NOMINAL",
  "COOLANT PRESSURE ...... STABLE",
  "UPLINK INTEGRITY ...... 98.6%",
  "INTRUSION COUNTER ..... 0 ATTEMPTS",
  "COFFEE RESERVES ....... CRITICAL",
];

const surveillance = {
  heartRateBaseline: 72,
  meals: [
    "SHIRATAKI NOODLES",
    "WHEY PROTEIN SHAKE",
    "OVERNIGHT OATS",
    "BERRY GREEK YOGHURT",
    "PANEER WRAP",
    "PANEER SALAD",
    "TILAPIA WRAP",
    "PROTEIN PASTA",
    "GREEK FETA SALAD",
  ],
  locations: [
    "STUCK AT SILK BOARD JUNCTION",
    "PURPLE LINE, NAMMA METRO",
    "GRIDLOCKED ON OUTER RING ROAD",
    "KORAMANGALA, 5TH BLOCK",
    "INDIRANAGAR, 100 FT ROAD",
    "STUCK IN TRAFFIC NEAR MARATHAHALLI",
    "ELECTRONIC CITY FLYOVER (CRAWLING)",
    "WHITEFIELD, PRE-METRO TRAUMA",
    "HSR LAYOUT, SECTOR 2",
    "IBBALUR SIGNAL — 40 MIN AND COUNTING",
    "BEHIND A BMTC BUS, ORR",
    "BELLANDUR — ONE DROP OF RAIN = GRIDLOCK",
    "CUBBON PARK (RARE OUTDOOR SIGHTING)",
    "MG ROAD, NAMMA METRO",
    "STUCK AT THE TRINITY CIRCLE SIGNAL",
    "JAYANAGAR 4TH BLOCK, HUNTING DOSE",
  ],
};

const fallback = {
  github: {
    repos: 34,
    followers: 20,
    memberSince: "2020",
    totalStars: 5,
    topLanguage: "TYPESCRIPT",
    contributions: 500,
  },
  leetcode: {
    solved: { easy: 130, medium: 110, hard: 25, total: 265 },
    totals: { easy: 880, medium: 1850, hard: 830, all: 3560 },
    ranking: 200000,
  },
  steam: [
    { name: "ELDEN RING", hours2w: 0, hoursTotal: 114 },
    { name: "PERSONA 3 RELOAD", hours2w: 0, hoursTotal: 71 },
    { name: "BLACK MYTH: WUKONG", hours2w: 0, hoursTotal: 22 },
  ],
  tracks: [
    { name: "Time", artist: "Pink Floyd" },
    { name: "Redbone", artist: "Childish Gambino" },
    { name: "Midnight City", artist: "M83" },
    { name: "No Surprises", artist: "Radiohead" },
  ],
};

export {
  personal,
  menuItems,
  experience,
  journey,
  recreation,
  skills,
  projects,
  testimonials,
  socials,
  asciiBanner,
  diagnostics,
  surveillance,
  fallback,
  commands,
  hackGame, 
  monitor,
};
