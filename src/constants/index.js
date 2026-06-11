const personal = {
    name: 'TANMAI NUTHI',
    designation: 'TEST SUBJECT #TN-2001',
    handle: 'tanmai.n',
    role: 'SOFTWARE ENGINEER',
    established: 2001,
    // PLACEHOLDER — owner must update bio to current containment status
    bio: 'SUBJECT EXHIBITS PERSISTENT COMPULSION TO BUILD SOFTWARE. OBSERVED CONSTRUCTING SYSTEMS AND INTERFACES WITHOUT EXTERNAL DIRECTIVE. RECORDS BELOW MAY REFERENCE THE COLLEGE-ERA CONTAINMENT PERIOD. UPDATE ME.',
    // PLACEHOLDER — owner will replace with a real PNG cutout (pip-boy style)
    portrait: 'img/boy-computer.png',
};

const bootLines = [
    'TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL',
    'COPYRIGHT 2026 TANMAI INDUSTRIES',
    'INITIALIZING BOOT SEQUENCE...',
    'CPU: MOTOROLA 68000 @ 8MHZ ............ OK',
    'MEMORY CHECK: 64K RAM ................. OK',
    'PHOSPHOR CALIBRATION .................. OK',
    'LOADING PERSONNEL DATABASE ............ OK',
    'MOUNTING /dev/career .................. OK',
    'ESTABLISHING UPLINK ................... OK',
    '',
    'WELCOME, VISITOR.',
];

const menuItems = [
    { num: '01', label: 'CAREER DOSSIER', hint: 'work', path: '/career' },
    { num: '02', label: 'PERSONNEL FILE', hint: 'classified', path: '/personnel', locked: true },
    { num: '03', label: 'SUBJECT SURVEILLANCE', hint: 'live feed', path: '/monitor' },
    { num: '04', label: 'OPEN COMMS CHANNEL', hint: 'contact', path: '/comms' },
];

const commands = [
    { name: 'help', desc: 'LIST AVAILABLE COMMANDS' },
    { name: 'ls', desc: 'LIST TERMINAL SCREENS' },
    { name: 'open', desc: 'OPEN <SCREEN> — E.G. OPEN CAREER' },
    { name: 'theme', desc: 'CYCLE PHOSPHOR COLOR' },
    { name: 'sound', desc: 'TOGGLE AUDIO ON/OFF' },
    { name: 'whoami', desc: 'IDENTIFY CURRENT OPERATOR' },
    { name: 'clear', desc: 'CLEAR PROMPT OUTPUT' },
    { name: 'hack', desc: 'ATTEMPT SECURITY BYPASS' },
    { name: 'logout', desc: 'END SESSION' },
];

const hackGame = {
    attempts: 4,
};

const monitor = {
    githubUser: 'metanmai',
    leetcodeUser: 'metanmai',
};

// PLACEHOLDER — owner must replace with real experience timeline
const experience = [
    {
        period: '2023 — PRESENT',
        title: 'SOFTWARE ENGINEER',
        org: 'UPDATE ME',
        summary: 'SUBJECT EMBEDDED AT UPDATE ME. CURRENT ASSIGNMENT — DETAILS PENDING DECLASSIFICATION.',
    },
    {
        period: '2019 — 2023',
        title: 'B.TECH, COMPUTER SCIENCE',
        org: 'UPDATE ME (university)',
        summary: 'SUBJECT UNDERWENT FORMAL TRAINING. CONSTRUCTED THE ORIGINAL VERSION OF THIS TERMINAL DURING CONTAINMENT, AMONG OTHER ARTIFACTS.',
    },
];

// PLACEHOLDER content — owner must personalize every entry marked UPDATE ME
const journey = [
    {
        year: '2001',
        title: 'SUBJECT INITIALIZED',
        note: 'LOCATION OF FIRST OBSERVATION: UPDATE ME.',
        body: 'SUBJECT ENTERS THE WORLD. EARLY APTITUDE FOR DISASSEMBLING DEVICES NOTED; REASSEMBLY RECORD INCOMPLETE. UPDATE ME WITH RECOVERED DETAILS.',
    },
    {
        year: '2013',
        title: 'FIRST CONTACT WITH A COMPUTER',
        note: 'INITIATING HARDWARE: UPDATE ME.',
        body: 'SUBJECT MAKES FIRST DOCUMENTED CONTACT WITH A PERSONAL MACHINE. HOURS LOGGED STARING INTO A CRT, ATTEMPTING TO INTERPRET A BLINKING CURSOR. UPDATE ME WITH THE ACTUAL HARDWARE AND THE FIRST PROGRAM RECORDED.',
    },
    {
        year: '2019',
        title: 'ENROLLED: B.TECH COMPUTER SCIENCE',
        note: 'CONTAINMENT FACILITY: UPDATE ME.',
        body: 'SUBJECT IS PROCESSED INTO FORMAL TRAINING. DISCOVERS THAT LOOPS AND RECURSION ARE NOT OPTIONAL. UPDATE ME WITH DORM-ROOM ARTIFACTS, LATE-NIGHT DEBUGGING SESSIONS, AND THE OTHER INDIVIDUALS WHO MADE THE CONDITIONING STICK.',
    },
    {
        year: '2022',
        title: 'BUILT THIS TERMINAL (V1)',
        note: 'ARTIFACT: ORIGINAL TERMINAL, PRECURSOR TO CURRENT BUILD.',
        body: 'SUBJECT SHIPPED THE FIRST ITERATION OF THIS PORTFOLIO — A MORE CONVENTIONAL SITE THAT REMAINED IN ROTATION FOR YEARS. THE CURRENT FALLOUT-STYLE REBUILD RESTS ON ITS BONES. UPDATE ME WITH WHAT V1 TAUGHT THE SUBJECT.',
    },
    {
        year: '2023',
        title: 'WENT PROFESSIONAL',
        note: 'FIRST DOCUMENTED EMPLOYMENT: UPDATE ME.',
        body: 'SUBJECT CROSSES FROM COURSEWORK INTO PAYROLL. CODEBASES GROW LARGER, FEEDBACK LOOPS LENGTHEN, OPINIONS HARDEN. UPDATE ME WITH THE EMPLOYER, THE TEAM, AND THE FIRST LESSON THE ROLE IMPRINTED.',
    },
    {
        year: 'NOW',
        title: 'ONGOING OPERATIONS',
        note: 'CURRENT OPERATIONAL CHAPTER: UPDATE ME.',
        body: 'CURRENT ASSIGNMENT STILL IN PROGRESS. SUBJECT OBSERVED BUILDING, BREAKING, AND OCCASIONALLY DOCUMENTING. UPDATE ME WITH WHAT THE SUBJECT IS ACTUALLY WORKING ON RIGHT NOW.',
    },
];

const recreation = {
    games: {
        nowPlaying: 'UPDATE ME',
        allTimers: ['FALLOUT: NEW VEGAS', 'UPDATE ME', 'UPDATE ME'],
    },
    music: {
        genres: ['UPDATE ME'],
    },
    photography: {
        blurb: 'SUBJECT DOCUMENTS SURROUNDINGS OBSESSIVELY. SPECIMENS BELOW. UPDATE ME.',
        shots: [
            { src: 'img/blocktopia.png', caption: 'PLACEHOLDER SHOT — replace with real photos in public/img/' },
        ],
    },
    tinkering: ['UNSANCTIONED EXPERIMENTS: UPDATE ME.'],
};

const skills = [
    { name: 'python', level: 90 },
    { name: 'react', level: 85 },
    { name: 'c++', level: 80 },
    { name: 'fastapi', level: 80 },
    { name: 'docker', level: 75 },
    { name: 'aws', level: 70 },
    { name: 'tensorflow', level: 65 },
    { name: 'git', level: 90 },
];

const projects = [
    {
        id: 1,
        name: 'BLOCKTOPIA',
        description: 'Dive into a pixelated universe, build, explore, and embark on your own unique adventures in this virtual sandbox.',
        thumbnail: 'img/blocktopia.png',
        link: 'https://github.com/metanmai/blocktopia',
        tech: ['react', 'vite', 'threejs'],
    },
    {
        id: 2,
        name: 'FAKE NEWS DETECTION',
        description: 'Using advanced algorithms and ML techniques, this project helps users distinguish between credible and unreliable information sources.',
        thumbnail: 'img/fake-news-detection.jpeg',
        link: 'https://github.com/metanmai/fake-news-detection',
        tech: ['python', 'tensorflow', 'networkx'],
    },
    {
        id: 3,
        name: 'GRAPH FUNCTIONALITIES',
        description: 'The Graph Functionalities project showcases a collection of custom-built functions for handling and analyzing complex networks.',
        thumbnail: 'img/graph-functionalities.webp',
        link: 'https://github.com/metanmai/Graph_Functionalities',
        tech: ['C++', 'pybind'],
    },
    {
        id: 4,
        name: 'CHATTERBOX',
        description: 'Chatterbox is a versatile blogging platform where users can share their thoughts, stories, and ideas with a global audience.',
        thumbnail: 'img/chatterbox.png',
        link: 'https://github.com/metanmai/chatterbox',
        tech: ['flask', 'bootstrap-css'],
    },
];

const testimonials = [
    {
        text: 'He has a natural talent for breaking down complex topics into easily digestible components, which not only benefits him in his own learning but also makes him an excellent resource for his peers.',
        person: 'Avinash Tiwari',
        company: 'pCloudy',
        role: 'CEO',
    },
    {
        text: "Tanmai's work ethic extends beyond the classroom, as he willingly takes on challenging projects and consistently meets deadlines with high-quality results.",
        person: 'Shibu Prasad Panda',
        company: 'pCloudy',
        role: 'Senior Lead Software Developer',
    },
    {
        text: "Tanmai's commitment to his work is truly impressive, and his ability to tackle challenges with a positive mindset is an asset to any team.",
        person: 'Kofi Opoku',
        company: 'Dosh',
        role: 'Director',
    },
    {
        text: 'Tanmai is not only a dedicated and hardworking student but also a team player who consistently brings a positive attitude to every project.',
        person: 'Vishnu Athreya',
        company: 'OPIN Tech',
        role: 'Head Of Logistics',
    },
];

const socials = [
    { name: 'GITHUB', link: 'https://github.com/metanmai/' },
    { name: 'LINKEDIN', link: 'https://www.linkedin.com/in/tanmai-niranjan-76326b288/' },
    { name: 'LEETCODE', link: 'https://leetcode.com/metanmai/' },
];

// "TANMAI" rendered in the Big Money-nw FIGlet font (kerned).
const asciiBanner = [
    '$$$$$$$$\\  $$$$$$\\  $$\\   $$\\ $$\\      $$\\  $$$$$$\\  $$$$$$\\',
    '\\__$$  __|$$  __$$\\ $$$\\  $$ |$$$\\    $$$ |$$  __$$\\ \\_$$  _|',
    '   $$ |   $$ /  $$ |$$$$\\ $$ |$$$$\\  $$$$ |$$ /  $$ |  $$ |',
    '   $$ |   $$$$$$$$ |$$ $$\\$$ |$$\\$$\\$$ $$ |$$$$$$$$ |  $$ |',
    '   $$ |   $$  __$$ |$$ \\$$$$ |$$ \\$$$  $$ |$$  __$$ |  $$ |',
    '   $$ |   $$ |  $$ |$$ |\\$$$ |$$ |\\$  /$$ |$$ |  $$ |  $$ |',
    '   $$ |   $$ |  $$ |$$ | \\$$ |$$ | \\_/ $$ |$$ |  $$ |$$$$$$\\',
    '   \\__|   \\__|  \\__|\\__|  \\__|\\__|     \\__|\\__|  \\__|\\______|',
];

const diagnostics = [
    'MEMORY CHECK .......... OK',
    'RADIATION SHIELDING ... NOMINAL',
    'COOLANT PRESSURE ...... STABLE',
    'UPLINK INTEGRITY ...... 98.6%',
    'INTRUSION COUNTER ..... 0 ATTEMPTS',
    'COFFEE RESERVES ....... CRITICAL',
];

// Surveillance flavor for the SUBJECT SURVEILLANCE screen. The screen picks a
// random meal + last-known position on every visit, so these are intentionally
// long lists. Bengaluru intel, lightly redacted.
const surveillance = {
    // Cardiac baseline the live monitor jitters around (resting BPM).
    heartRateBaseline: 72,
    meals: [
        'SHIRATAKI NOODLES',
        'WHEY PROTEIN SHAKE',
        'OVERNIGHT OATS',
        'BERRY GREEK YOGHURT',
        'PANEER WRAP',
        'PANEER SALAD',
        'TILAPIA WRAP',
        'PROTEIN PASTA',
        'GREEK FETA SALAD',
    ],
    locations: [
        'STUCK AT SILK BOARD JUNCTION',
        'PURPLE LINE, NAMMA METRO',
        'GRIDLOCKED ON OUTER RING ROAD',
        'KORAMANGALA, 5TH BLOCK',
        'INDIRANAGAR, 100 FT ROAD',
        'STUCK IN TRAFFIC NEAR MARATHAHALLI',
        'ELECTRONIC CITY FLYOVER (CRAWLING)',
        'WHITEFIELD, PRE-METRO TRAUMA',
        'HSR LAYOUT, SECTOR 2',
        'IBBALUR SIGNAL — 40 MIN AND COUNTING',
        'BEHIND A BMTC BUS, ORR',
        'BELLANDUR — ONE DROP OF RAIN = GRIDLOCK',
        'CUBBON PARK (RARE OUTDOOR SIGHTING)',
        'MG ROAD, NAMMA METRO',
        'STUCK AT THE TRINITY CIRCLE SIGNAL',
        'JAYANAGAR 4TH BLOCK, HUNTING DOSE',
    ],
};

// PLACEHOLDER — shown on the SUBJECT SURVEILLANCE screen when a relay can't be
// reached (e.g. an upstream API is down or blocked). Framed as "LAST KNOWN" so
// it never pretends to be live. Owner may edit these to match real numbers.
const fallback = {
    github: {
        repos: 30,
        followers: 20,
        memberSince: '2020',
        totalStars: 15,
        topLanguage: 'PYTHON',
        contributions: 500,
    },
    leetcode: {
        solved: { easy: 130, medium: 110, hard: 25, total: 265 },
        totals: { easy: 880, medium: 1850, hard: 830, all: 3560 },
        ranking: 200000,
    },
    steam: [
        { name: 'FALLOUT: NEW VEGAS', hours2w: 5.4, hoursTotal: 240 },
        { name: 'DISCO ELYSIUM', hours2w: 2.1, hoursTotal: 52 },
        { name: 'HOLLOW KNIGHT', hours2w: 1.8, hoursTotal: 76 },
    ],
    tracks: [
        { name: 'Time', artist: 'Pink Floyd' },
        { name: 'Redbone', artist: 'Childish Gambino' },
        { name: 'Midnight City', artist: 'M83' },
        { name: 'No Surprises', artist: 'Radiohead' },
    ],
};

export {
    personal,
    bootLines,
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
