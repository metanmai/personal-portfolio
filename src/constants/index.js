const technologies = [
	{
		name: "HTML 5",
		icon: "img/html.png",
	},
	{
		name: "CSS 3",
		icon: "img/css.png",
	},
	{
		name: "React JS",
		icon: "img/reactjs.png",
	},
	{
		name: "Three JS",
		icon: "img/threejs.svg",
	},
	{
		name: "AWS",
		icon: "img/aws.webp",
	},
	{
		name: "Tensorflow",
		icon: "img/tensorflow.webp",
	},
	{
		name: "git",
		icon: "img/git.png",
	},
	{
		name: "docker",
		icon: "img/docker.png",
	},
	{
		name: "netlify",
		icon: "img/netlify.png",
	},
	{
		name: "cpp",
		icon: "img/cpp.png",
	},
	{
		name: "python",
		icon: "img/python.png",
	},
	{
		name: "fastAPI",
		icon: "img/fastapi.svg",
	}
];

const testimonials = [
	{
		text: "He has a natural talent for breaking down complex topics into easily digestible components, which not only benefits him in his own learning but also makes him an excellent resource for his peers.",
		person: "Avinash Tiwari",
		company: "pCloudy",
		role: "CEO"
	},
	{
		text: "Tanmai's work ethic extends beyond the classroom, as he willingly takes on challenging projects and consistently meets deadlines with high-quality results.",
		person: "Shibu Prasad Panda",
		company: "pCloudy",
		role: "Senior Lead Software Developer"
	},
	{
		text: "Tanmai's commitment to his work is truly impressive, and his ability to tackle challenges with a positive mindset is an asset to any team.",
		person: "Kofi Opoku",
		company: "Dosh",
		role: "Director"
	},
	{
		text: "Tanmai is not only a dedicated and hardworking student but also a team player who consistently brings a positive attitude to every project.",
		person: "Vishnu Athreya",
		company: "OPIN Tech",
		role: "Head Of Logistics"
	}
];

const projects = [
	{
		id: 1,
		name: "Blocktopia",
		description: "Dive into a pixelated universe, build, explore, and embark on your own unique adventures in this virtual sandbox.",
		thumbnail: "img/blocktopia.png",
		link: "https://github.com/metanmai/blocktopia",
		tech: ["react", "vite", "threejs"]
	},
	{
		id: 2,
		name: "Fake News Detection",
		description: "Using advanced algorithms and machine learning techniques, this project helps users distinguish between credible and unreliable information sources",
		thumbnail: "img/fake-news-detection.jpeg",
		link: "https://github.com/metanmai/fake-news-detection",
		tech: ["python", "tensorflow", "networkx"]
	},
	{
		id: 3,
		name: "Graph Functionalities",
		description: "The Graph Functionalities project showcases a collection of custom-built functions for handling and analyzing complex networks.",
		thumbnail: "img/graph-functionalities.webp",
		link: "https://github.com/metanmai/Graph_Functionalities",
		tech: ["C++", "pybind"]
	},
	{
		id: 4,
		name: "Chatterbox",
		description: "Chatterbox is a versatile blogging platform where users can share their thoughts, stories, and ideas with a global audience.",
		thumbnail: "img/chatterbox.png",
		link: "https://github.com/metanmai/chatterbox",
		tech: ["flask", "bootstrap-css"]
	}
];

export {technologies, testimonials, projects};