const personal = {
    name: 'TANMAI NUTHI',
    handle: 'tanmai.n',
    role: 'SOFTWARE ENGINEER',
    established: 2001,
    // PLACEHOLDER — owner must update bio to current role
    bio: 'Software engineer. Builder of systems and interfaces. This dossier is being updated — entries below may reference the college era.',
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
    { num: '01', label: 'PERSONNEL FILE', hint: 'my journey', path: '/personnel' },
    { num: '02', label: 'CAREER DOSSIER', hint: 'work', path: '/career' },
    { num: '03', label: 'RECREATION WING', hint: 'off duty', path: '/recreation' },
    { num: '04', label: 'HOLOTAPE ARCHIVE', hint: 'logs', path: '/holotapes' },
    { num: '05', label: 'SYSTEM MONITOR', hint: 'diagnostics', path: '/monitor' },
    { num: '06', label: 'OPEN COMMS CHANNEL', hint: 'contact', path: '/comms' },
    { num: '??', label: '◼◼ REDACTED ◼◼', hint: '████████', path: '/vault' },
];

const commands = [
    { name: 'help', desc: 'LIST AVAILABLE COMMANDS' },
    { name: 'ls', desc: 'LIST TERMINAL SCREENS' },
    { name: 'open', desc: 'OPEN <SCREEN> — E.G. OPEN CAREER' },
    { name: 'theme', desc: 'CYCLE PHOSPHOR COLOR' },
    { name: 'whoami', desc: 'IDENTIFY CURRENT OPERATOR' },
    { name: 'clear', desc: 'CLEAR PROMPT OUTPUT' },
    { name: 'hack', desc: 'ATTEMPT SECURITY BYPASS' },
    { name: 'logout', desc: 'END SESSION' },
];

const hackGame = {
    attempts: 4,
    // all words must share the same length (Fallout rules)
    words: [
        'GRANTED', 'JOURNEY', 'VISITOR', 'CONSOLE', 'NETWORK', 'PROGRAM',
        'MACHINE', 'SYSTEMS', 'DOSSIER', 'ARCHIVE', 'UPLINKS', 'GAMEPAD',
    ],
};

// PLACEHOLDER — owner should replace with real off-resume facts
const vaultEntries = [
    'SUBJECT ONCE SPENT AN ENTIRE WEEKEND SPEEDRUNNING A GAME INSTEAD OF STUDYING FOR FINALS. PASSED ANYWAY. UPDATE ME.',
    'THE FIRST PROGRAM SUBJECT EVER WROTE CRASHED THE FAMILY COMPUTER. UPDATE ME.',
    'CLASSIFIED PLAYLIST: UPDATE ME WITH THE SONGS YOU PRETEND NOT TO LIKE.',
];

// PLACEHOLDER — owner should replace with real log entries (newest first)
const holotapes = [
    {
        id: 'LOG-003',
        date: '2026-06-10',
        title: 'TERMINAL REBUILT',
        body: 'Tore the old portfolio down to the studs and rebuilt it as the machine you are reading this on. UPDATE ME with real notes.',
    },
    {
        id: 'LOG-002',
        date: 'UPDATE ME',
        title: 'UPDATE ME — A THING I LEARNED',
        body: 'UPDATE ME — write about something you figured out recently.',
    },
    {
        id: 'LOG-001',
        date: 'UPDATE ME',
        title: 'UPDATE ME — FIRST ENTRY',
        body: 'UPDATE ME — why this log exists.',
    },
];

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
        summary: 'Current role — details pending declassification.',
    },
    {
        period: '2019 — 2023',
        title: 'B.TECH, COMPUTER SCIENCE',
        org: 'UPDATE ME (university)',
        summary: 'Built the original version of this terminal, among other things.',
    },
];

// PLACEHOLDER content — owner must personalize every entry marked UPDATE ME
const journey = [
    {
        year: '2001',
        title: 'SUBJECT INITIALIZED',
        note: 'UPDATE ME — where it all began.',
        body: 'Subject enters the world. Early aptitude for taking things apart; mixed record on reassembly. UPDATE ME with the real story.',
    },
    {
        year: '2013',
        title: 'FIRST CONTACT WITH A COMPUTER',
        note: 'UPDATE ME — the machine that started it.',
        body: 'First boot-up with a personal machine. Hours logged staring at a CRT, learning what a cursor wanted from you. UPDATE ME with the actual hardware and the first program written.',
    },
    {
        year: '2019',
        title: 'ENROLLED: B.TECH COMPUTER SCIENCE',
        note: 'UPDATE ME — college era, first real programs.',
        body: 'Enrolls in formal training. Discovers that loops and recursion are not optional. UPDATE ME with the dorm-room projects, the late-night debugging, and the people who made it stick.',
    },
    {
        year: '2022',
        title: 'BUILT THIS TERMINAL (V1)',
        note: 'The original portfolio this terminal replaced.',
        body: 'Shipped the first iteration of this portfolio — a more conventional site that lived here for years. The current Fallout-style rebuild stands on its bones. UPDATE ME with what V1 taught you.',
    },
    {
        year: '2023',
        title: 'WENT PROFESSIONAL',
        note: 'UPDATE ME — first role, what changed.',
        body: 'Crosses from coursework into payroll. Codebases get bigger, feedback loops get longer, opinions get stronger. UPDATE ME with the company, the team, and the first lesson the job actually taught you.',
    },
    {
        year: 'NOW',
        title: 'ONGOING OPERATIONS',
        note: 'UPDATE ME — current chapter.',
        body: 'Current assignment, still in progress. Building, breaking, and occasionally documenting. UPDATE ME with what you are actually working on right now.',
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
        blurb: 'UPDATE ME — what you like shooting.',
        shots: [
            { src: 'img/blocktopia.png', caption: 'PLACEHOLDER SHOT — replace with real photos in public/img/' },
        ],
    },
    tinkering: ['UPDATE ME — side quests, builds, experiments'],
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

const asciiBanner = [
    '████████╗ █████╗ ███╗   ██╗███╗   ███╗ █████╗ ██╗',
    '╚══██╔══╝██╔══██╗████╗  ██║████╗ ████║██╔══██╗██║',
    '   ██║   ███████║██╔██╗ ██║██╔████╔██║███████║██║',
    '   ██║   ██╔══██║██║╚██╗██║██║╚██╔╝██║██╔══██║██║',
    '   ██║   ██║  ██║██║ ╚████║██║ ╚═╝ ██║██║  ██║██║',
    '   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝',
];

const diagnostics = [
    'MEMORY CHECK .......... OK',
    'RADIATION SHIELDING ... NOMINAL',
    'COOLANT PRESSURE ...... STABLE',
    'UPLINK INTEGRITY ...... 98.6%',
    'INTRUSION COUNTER ..... 0 ATTEMPTS',
    'COFFEE RESERVES ....... CRITICAL',
];

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
    commands,
    hackGame,
    vaultEntries,
    holotapes,
    monitor,
};
