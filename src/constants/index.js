const personal = {
    name: 'TANMAI NUTHI',
    handle: 'tanmai.n',
    role: 'SOFTWARE ENGINEER',
    established: 2001,
    // PLACEHOLDER — owner must update bio to current role
    bio: 'Software engineer. Builder of systems and interfaces. This dossier is being updated — entries below may reference the college era.',
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
    { num: '01', label: 'PERSONNEL FILE', hint: 'about', path: '/personnel' },
    { num: '02', label: 'PROJECT ARCHIVES', hint: 'work', path: '/archives' },
    { num: '03', label: 'FIELD COMMENDATIONS', hint: 'testimonials', path: '/commendations' },
    { num: '04', label: 'OPEN COMMS CHANNEL', hint: 'contact', path: '/comms' },
    { num: '05', label: 'TERMINAL CALIBRATION', hint: 'settings', path: '/calibration' },
];

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

export { personal, bootLines, menuItems, experience, skills, projects, testimonials, socials };
