const personal = {
    name: 'TANMAI NIRANJAN',
    designation: 'SDE-I · GROWTH TEAM',
    handle: 'metanmai',
    role: 'SOFTWARE ENGINEER',
    established: 2001,
    bio: 'SDE WITH EXPERIENCE IN PAYMENTS, AUTH, AND DISTRIBUTED SERVICES. CURRENTLY BUILDING FINANCIAL INFRASTRUCTURE AT COINSWITCH. EXPLORES AI-DRIVEN PRODUCTS AND DEVELOPER-FIRST TOOLS.',
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

const experience = [
    {
        period: '2024 — PRESENT',
        title: 'SOFTWARE DEVELOPMENT ENGINEER - I',
        org: 'COINSWITCH (PEEPALCO)',
        summary: 'GROWTH TEAM — PAYMENTS, AUTH, IDENTITY & COMMUNICATIONS. ENGINEERED ULTRA-LOW-LATENCY RISK MANAGEMENT SYSTEM IN RUST. OWNER OF BINARY OPTIONS TRADING MICROSERVICE. MIGRATED COMMS SERVICE IN-HOUSE. CUT INFRA COSTS BY $35K/MONTH.',
    },
    {
        period: 'MAR 2024 — MAY 2024',
        title: 'BACKEND DEVELOPMENT INTERN',
        org: 'JAR',
        summary: 'BUILT RESTFUL APIS AND DROOLS RULE-CHECKING FOR THE LENDING FEATURE. DIAGNOSED AND RESOLVED 20+ CRITICAL BUGS IN THE JAVA SPRING BOOT CODEBASE.',
    },
    {
        period: 'JUN 2023 — SEP 2023',
        title: 'SOFTWARE DEVELOPMENT INTERN',
        org: 'PCLOUDY',
        summary: 'SPEARHEADED SELF-HEALING AUTOMATION IN MOBILE APP TESTING USING VISUAL AI. REDUCED TESTING DURATION BY 65% AND MANUAL INTERVENTION BY 47%. BUILT SCALABLE BACKEND SYSTEM ON AWS.',
    },
];

const journey = [
    {
        year: '2001',
        title: 'SUBJECT INITIALIZED',
        note: 'LOCATION: BANGALORE, INDIA.',
        body: 'SUBJECT ENTERS THE WORLD. EARLY APTITUDE FOR DISASSEMBLING ELECTRONICS NOTED BY PARENTAL UNITS. FIRST WORDS RUMORED TO INVOLVE A CURSOR.',
    },
    {
        year: '2013',
        title: 'FIRST CONTACT WITH A COMPUTER',
        note: 'HARDWARE: A HAND-ME-DOWN DELL LAPTOP RUNNING WINDOWS XP.',
        body: 'SUBJECT MAKES FIRST DOCUMENTED CONTACT WITH A PERSONAL MACHINE. SPENT HOURS STARING INTO A CRT, ATTEMPTING TO INTERPRET A BLINKING CURSOR. FIRST PROGRAM: A BATCH SCRIPT THAT PRINTED THE SUBJECT\'S NAME IN AN INFINITE LOOP.',
    },
    {
        year: '2018',
        title: 'RANKED TOP 1% IN KCET · TOP 7% IN JEE MAIN',
        note: 'PRE-UNIVERSITY: R.V. PU COLLEGE, BANGALORE. 84%.',
        body: 'SUBJECT ACHIEVES TOP PERCENTILE RANKINGS IN STATE AND NATIONAL ENTRANCE EXAMINATIONS. SELECTS COMPUTER SCIENCE AS THE PRIMARY DIRECTIVE.',
    },
    {
        year: '2020',
        title: 'ENROLLED: B.TECH COMPUTER SCIENCE',
        note: 'CONTAINMENT FACILITY: PES UNIVERSITY, BANGALORE.',
        body: 'SUBJECT IS PROCESSED INTO FORMAL TRAINING. DISCOVERS THAT LOOPS AND RECURSION ARE NOT OPTIONAL. COMPLETED COURSEWORK IN OOP, DBMS, WEB TECHNOLOGIES, CLOUD COMPUTING, AND DESIGN PATTERNS. GRADUATED MAY 2024 WITH 7.93 GPA.',
    },
    {
        year: '2022',
        title: 'BUILT THIS TERMINAL (V1)',
        note: 'ARTIFACT: ORIGINAL PORTFOLIO — PRECURSOR TO CURRENT BUILD.',
        body: 'SUBJECT SHIPPED THE FIRST ITERATION OF THIS PORTFOLIO — A SIMPLER SINGLE-PAGE SITE WITH SCROLL-SNAP SECTIONS, 3D SKILL ICONS, AND A CONTACT FORM. REMAINED IN ROTATION FOR YEARS. THE CURRENT FALLOUT-STYLE REBUILD RESTS ON ITS BONES.',
    },
    {
        year: '2023',
        title: 'WENT PROFESSIONAL',
        note: 'FIRST DOCUMENTED EMPLOYMENT: PCLOUDY, BANGALORE.',
        body: 'SUBJECT CROSSES FROM COURSEWORK INTO PAYROLL AS A SOFTWARE DEVELOPMENT INTERN. BUILT SELF-HEALING MOBILE TEST AUTOMATION THAT CUT TESTING TIME BY 65%. FOLLOWED BY AN INTERNSHIP AT JAR WORKING ON LENDING INFRASTRUCTURE WITH JAVA SPRING BOOT.',
    },
    {
        year: '2024',
        title: 'FULL-TIME DEPLOYMENT: COINSWITCH',
        note: 'CURRENT OPERATIONAL CHAPTER: GROWTH TEAM, BANGALORE.',
        body: 'SUBJECT JOINS COINSWITCH (PEEPALCO) AS SDE-I ON THE GROWTH TEAM. BUILDS PAYMENTS INFRASTRUCTURE — UPI LOAD-BALANCING, BANK ACCOUNT VERIFICATION, KYC COMPLIANCE INTEGRATIONS. ENGINEERS RISK MANAGEMENT SYSTEM USING RUST AND AERON. OWNS THE BINARY OPTIONS TRADING MICROSERVICE. MIGRATES COMMUNICATIONS SERVICE FROM THIRD-PARTY VENDOR TO IN-HOUSE SOLUTION, SAVING $35K/MONTH.',
    },
    {
        year: '2025',
        title: 'SYNAPSE MCP · OPEN SOURCE',
        note: 'ARTIFACT: SYNAPSE — CROSS-SESSION AI CONTEXT MANAGEMENT.',
        body: 'SUBJECT DESIGNS AND SHIPS SYNAPSE MCP, AN NPM-INSTALLABLE MCP SERVER ENABLING AI ASSISTANTS TO PERSIST AND RETRIEVE KNOWLEDGE ACROSS SESSIONS, TOOLS, AND TEAMMATES. BUILT WITH TYPESCRIPT, SVELTE, SUPABASE, AND CLOUDFLARE WORKERS.',
    },
    {
        year: 'NOW',
        title: 'ONGOING OPERATIONS',
        note: 'CURRENT ASSIGNMENT: BUILDING FINANCIAL INFRASTRUCTURE AT SCALE.',
        body: 'SUBJECT CONTINUES TO BUILD, BREAK, AND OCCASIONALLY DOCUMENT. ACTIVE AREAS: DISTRIBUTED SYSTEMS, PAYMENT ORCHESTRATION, DEVELOPER TOOLING, AND AI-ASSISTED WORKFLOWS. WON THE COINSWITCH BUG BOUNTY PROGRAM. OPEN TO EXPLORING NEW FRONTIERS.',
    },
];

const recreation = {
    games: {
        nowPlaying: 'FALLOUT: NEW VEGAS',
        allTimers: ['FALLOUT: NEW VEGAS', 'DISCO ELYSIUM', 'HOLLOW KNIGHT', 'ELDEN RING'],
    },
    music: {
        genres: ['PSYCHEDELIC ROCK', 'ALTERNATIVE', 'LO-FI', 'SYNTHWAVE'],
    },
    photography: {
        blurb: 'SUBJECT DOCUMENTS SURROUNDINGS OBSESSIVELY. SPECIMENS BELOW.',
        shots: [
            { src: 'img/blocktopia.png', caption: 'BANGALORE SKYLINE FROM INDIRANAGAR — MONSOON, 2024' },
            { src: 'img/graph-functionalities.webp', caption: 'CUBBON PARK — RARE OUTDOOR SIGHTING, EARLY MORNING' },
        ],
    },
    tinkering: [
        'BUILT SYNAPSE MCP: CROSS-SESSION AI CONTEXT MANAGEMENT TOOL.',
        'REBUILT THIS TERMINAL FROM SCRATCH WITH A FALLOUT PIP-BOY AESTHETIC.',
        'CONTRIBUTED TO OPEN-SOURCE TOOLS FOR AI-ASSISTED DEVELOPMENT WORKFLOWS.',
    ],
};

const skills = [
    { name: 'golang', level: 90 },
    { name: 'rust', level: 80 },
    { name: 'typescript', level: 85 },
    { name: 'python', level: 85 },
    { name: 'java', level: 80 },
    { name: 'c++', level: 75 },
    { name: 'postgresql', level: 85 },
    { name: 'redis', level: 80 },
    { name: 'aws', level: 80 },
    { name: 'docker', level: 75 },
];

const projects = [
    {
        id: 1,
        name: 'SYNAPSE MCP',
        description: 'Cross-session AI context management tool. NPM-installable MCP server enabling AI assistants to persist and retrieve knowledge across sessions, tools, and teammates. Built with TypeScript, Svelte, Supabase, and Cloudflare Workers.',
        thumbnail: 'img/dark-purple-gradient.jpeg',
        link: 'https://github.com/metanmai/synapse',
        tech: ['typescript', 'svelte', 'supabase', 'cloudflare workers'],
    },
    {
        id: 2,
        name: 'GRAPH FUNCTIONALITIES',
        description: 'Core functions from NetworkX and Boost graph libraries reimplemented in C++ for high-performance computing. Solutions outperformed Python counterparts by 25% on average.',
        thumbnail: 'img/graph-functionalities.webp',
        link: 'https://github.com/metanmai/Graph_Functionalities',
        tech: ['C++', 'pybind'],
    },
    {
        id: 3,
        name: 'CHATTERBOX',
        description: 'A versatile blogging platform where users can share their thoughts, stories, and ideas with a global audience. Built with Flask and Bootstrap.',
        thumbnail: 'img/chatterbox.png',
        link: 'https://github.com/metanmai/chatterbox',
        tech: ['flask', 'bootstrap'],
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

const surveillance = {
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

const fallback = {
    github: {
        repos: 34,
        followers: 20,
        memberSince: '2020',
        totalStars: 5,
        topLanguage: 'TYPESCRIPT',
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
