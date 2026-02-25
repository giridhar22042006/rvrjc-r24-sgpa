/**
 * ============================================================
 *  RVRJC R24 SGPA & CGPA Calculator — Curriculum Data (data.js)
 * ============================================================
 *
 *  R24 Academic Regulations — RVR & JC College of Engineering
 *  Effective from 2024-25 batch onwards.
 *
 *  Grade System:
 *    A+ = 10, A = 9, B = 8, C = 7, D = 6, E = 5, F/W/Ab = 0
 *
 *  Mandatory / zero-credit courses do NOT affect SGPA.
 *
 *  Subject Code Format:
 *    Prefix  = Branch (CM, CD, CO, IT, EC, EE, ME, CE)
 *    Digit 1 = Year (1–4)
 *    Digit 2 = 1/2 = Theory Sem1/Sem2 of that year;
 *              5/6 = Lab/Practical Sem1/Sem2 of that year
 *    Digit 3 = Sequence
 *    MC      = Mandatory Course (zero credit)
 * ============================================================
 */

// ── Grade point mapping ─────────────────────────────────────
const GRADES = {
    "A+": 10,
    "A": 9,
    "B": 8,
    "C": 7,
    "D": 6,
    "E": 5,
    "F": 0,
    "W": 0,
    "Ab": 0,
};

// ── Branch list ─────────────────────────────────────────────
const BRANCHES = [
    "CSE",
    "CSE (AI & ML)",
    "CSE (Data Science)",
    "IT",
    "ECE",
    "EEE",
    "Mechanical Engineering",
    "Civil Engineering",
];

// ── Helper: subject entry ───────────────────────────────────
function sub(code, name, credits, type = "theory") {
    return { code, name, credits, type };
}

// ============================================================
//  CURRICULUM DATABASE
//  Key = "Branch__SemesterNumber"  (double underscore)
// ============================================================
const CURRICULUM = {};

/* ═══════════════════════════════════════════════════════════
   COMMON FIRST YEAR — SEMESTER I  (All Branches)
   ═══════════════════════════════════════════════════════════ */

const SEM1_COMMON = [
    sub("CM/CD/CO/CS/IT111", "Linear Algebra, Calculus and Differential Equations", 3),
    sub("CM/EC/EE112", "Chemistry for Engineers", 3),
    sub("CM/CD/CO/CS/IT113", "Basic Electrical and Electronics Engineering", 3),
    sub("CM/CD/CO/CS/EC/IT114", "Programming for Problem Solving", 4),
    sub("CM151", "Chemistry Lab", 1, "lab"),
    sub("CM152", "Basic Electrical & Electronics Engineering Lab", 1, "lab"),
    sub("CM153", "Programming for Problem Solving Lab", 1.5, "lab"),
    sub("CM154", "Engineering Graphics", 2),
    sub("CM/CD/CB/CO/CS/IT155", "Health and Wellness, Yoga and Sports", 0.5, "mandatory"),
];

/* ═══════════════════════════════════════════════════════════
   COMMON FIRST YEAR — SEMESTER II  (All Branches)
   ═══════════════════════════════════════════════════════════ */

const SEM2_COMMON = [
    sub("CM/CD/CO/CS/IT121", "Integral Calculus and Transforms", 3),
    sub("CM122", "Applied Physics", 3),
    sub("CM/CD/CO/CS/IT123", "Communicative English", 2),
    sub("CM/CD/CO/CS/IT124", "Digital Logic Design", 3),
    sub("CM/CB/CO/CS/IT125", "Python Programming", 2),
    sub("CM126", "Data Structures and Algorithms", 3),
    sub("CM161", "Applied Physics Lab", 1, "lab"),
    sub("CM162", "Communicative English Lab", 1, "lab"),
    sub("CM163", "Python Programming Lab", 1, "lab"),
    sub("CM164", "Data Structures Lab", 1.5, "lab"),
    sub("CM165", "NSS / NCC / Community Service", 0.5, "mandatory"),
];

// Assign common semesters to every branch
BRANCHES.forEach((branch) => {
    CURRICULUM[`${branch}__1`] = SEM1_COMMON;
    CURRICULUM[`${branch}__2`] = SEM2_COMMON;
});


/* ═══════════════════════════════════════════════════════════
   CSE (AI & ML)  —  Semesters III – VIII
   Branch Code Prefix: CM
   ═══════════════════════════════════════════════════════════ */

CURRICULUM["CSE (AI & ML)__3"] = [
    sub("CM/CD/CO/CS/IT211", "Probability, Statistics & Complex Analysis", 3),
    sub("CM/CD/CO/CS/IT212", "Universal Human Values", 2),
    sub("CM/CD/CO/CS/IT213", "Discrete Mathematical Structures", 3),
    sub("CM/CD/CO/CS/IT214", "Computer Organization", 3),
    sub("CM/CD/CO/CS/IT215", "Design and Analysis of Algorithms", 3),
    sub("CM/CD/CO/CS/IT216", "Object Oriented Programming", 3),
    sub("CM251", "Skill Enhancement Course-1", 2),
    sub("CM252", "DAA Lab", 1.5, "lab"),
    sub("CM253", "OOP Lab", 1.5, "lab"),
    sub("MC2", "Environmental Science", 0, "mandatory"),
];

CURRICULUM["CSE (AI & ML)__4"] = [
    sub("CM221", "Computational Statistics", 3),
    sub("CM222", "Artificial Intelligence", 3),
    sub("CM223", "Database Management Systems", 3),
    sub("CM224", "Operating Systems", 3),
    sub("CM225", "Computer Networks", 3),
    sub("CM261", "Skill Enhancement Course-2", 2),
    sub("CM262", "Design Thinking & Innovation", 2),
    sub("CM263", "AI Lab", 1.5, "lab"),
    sub("CM264", "DBMS Lab", 1.5, "lab"),
    sub("MC1", "Constitution of India", 0, "mandatory"),
];

CURRICULUM["CSE (AI & ML)__5"] = [
    sub("CM311", "Machine Learning", 3),
    sub("CM312", "Natural Language Processing", 3),
    sub("CM313", "Deep Learning Foundations", 3),
    sub("CM314", "Professional Elective-I", 3),
    sub("CM315", "Open Elective-I", 3),
    sub("CM351", "Machine Learning Lab", 1.5, "lab"),
    sub("CM352", "NLP Lab", 1.5, "lab"),
    sub("CM353", "Skill Enhancement Course-3", 2),
    sub("MC3", "Gender Sensitization", 0, "mandatory"),
];

CURRICULUM["CSE (AI & ML)__6"] = [
    sub("CM321", "Computer Vision", 3),
    sub("CM322", "Reinforcement Learning", 3),
    sub("CM323", "Professional Elective-II", 3),
    sub("CM324", "Professional Elective-III", 3),
    sub("CM325", "Open Elective-II", 3),
    sub("CM361", "Computer Vision Lab", 1.5, "lab"),
    sub("CM362", "Mini Project / MOOC-I", 2, "project"),
    sub("CM363", "Skill Enhancement Course-4", 2),
    sub("MC4", "Indian Traditional Knowledge", 0, "mandatory"),
];

CURRICULUM["CSE (AI & ML)__7"] = [
    sub("CM411", "Advanced Deep Learning & Applications", 3),
    sub("CM412", "Professional Elective-IV", 3),
    sub("CM413", "Professional Elective-V", 3),
    sub("CM414", "Open Elective-III", 3),
    sub("CM451", "Advanced DL Lab", 1.5, "lab"),
    sub("CM452", "Major Project Phase-I", 4, "project"),
    sub("CM453", "Summer Internship", 2, "internship"),
    sub("CM454", "MOOC-II", 2),
];

CURRICULUM["CSE (AI & ML)__8"] = [
    sub("CM421", "Professional Elective-VI", 3),
    sub("CM422", "Open Elective-IV", 3),
    sub("CM461", "Major Project Phase-II", 8, "project"),
    sub("CM462", "Comprehensive Viva", 2),
    sub("CM463", "MOOC-III", 2),
];


/* ═══════════════════════════════════════════════════════════
   CSE  —  Semesters III – VIII
   Branch Code Prefix: CO
   ═══════════════════════════════════════════════════════════ */

CURRICULUM["CSE__3"] = [
    sub("CM/CD/CO/CS/IT211", "Probability, Statistics & Complex Analysis", 3),
    sub("CM/CD/CO/CS/IT212", "Universal Human Values", 2),
    sub("CM/CD/CO/CS/IT213", "Discrete Mathematical Structures", 3),
    sub("CM/CD/CO/CS/IT214", "Computer Organization", 3),
    sub("CM/CD/CO/CS/IT215", "Design and Analysis of Algorithms", 3),
    sub("CM/CD/CO/CS/IT216", "Object Oriented Programming", 3),
    sub("CO251", "Skill Enhancement Course-1", 2),
    sub("CO252", "DAA Lab", 1.5, "lab"),
    sub("CO253", "OOP Lab", 1.5, "lab"),
    sub("MC2", "Environmental Science", 0, "mandatory"),
];

CURRICULUM["CSE__4"] = [
    sub("CO221", "Formal Languages & Automata Theory", 3),
    sub("CO222", "Software Engineering", 3),
    sub("CO223", "Database Management Systems", 3),
    sub("CO224", "Operating Systems", 3),
    sub("CO225", "Computer Networks", 3),
    sub("CO261", "Skill Enhancement Course-2", 2),
    sub("CO262", "Design Thinking & Innovation", 2),
    sub("CO263", "OS Lab", 1.5, "lab"),
    sub("CO264", "DBMS Lab", 1.5, "lab"),
    sub("MC1", "Constitution of India", 0, "mandatory"),
];

CURRICULUM["CSE__5"] = [
    sub("CO311", "Compiler Design", 3),
    sub("CO312", "Machine Learning", 3),
    sub("CO313", "Cryptography & Network Security", 3),
    sub("CO314", "Professional Elective-I", 3),
    sub("CO315", "Open Elective-I", 3),
    sub("CO351", "Machine Learning Lab", 1.5, "lab"),
    sub("CO352", "Compiler Design Lab", 1.5, "lab"),
    sub("CO353", "Skill Enhancement Course-3", 2),
    sub("MC3", "Gender Sensitization", 0, "mandatory"),
];

CURRICULUM["CSE__6"] = [
    sub("CO321", "Artificial Intelligence", 3),
    sub("CO322", "Data Mining & Warehousing", 3),
    sub("CO323", "Professional Elective-II", 3),
    sub("CO324", "Professional Elective-III", 3),
    sub("CO325", "Open Elective-II", 3),
    sub("CO361", "AI & Data Mining Lab", 1.5, "lab"),
    sub("CO362", "Mini Project / MOOC-I", 2, "project"),
    sub("CO363", "Skill Enhancement Course-4", 2),
    sub("MC4", "Indian Traditional Knowledge", 0, "mandatory"),
];

CURRICULUM["CSE__7"] = [
    sub("CO411", "Deep Learning", 3),
    sub("CO412", "Professional Elective-IV", 3),
    sub("CO413", "Professional Elective-V", 3),
    sub("CO414", "Open Elective-III", 3),
    sub("CO451", "Deep Learning Lab", 1.5, "lab"),
    sub("CO452", "Major Project Phase-I", 4, "project"),
    sub("CO453", "Summer Internship", 2, "internship"),
    sub("CO454", "MOOC-II", 2),
];

CURRICULUM["CSE__8"] = [
    sub("CO421", "Professional Elective-VI", 3),
    sub("CO422", "Open Elective-IV", 3),
    sub("CO461", "Major Project Phase-II", 8, "project"),
    sub("CO462", "Comprehensive Viva", 2),
    sub("CO463", "MOOC-III", 2),
];


/* ═══════════════════════════════════════════════════════════
   CSE (Data Science)  —  Semesters III – VIII
   Branch Code Prefix: CD
   ═══════════════════════════════════════════════════════════ */

CURRICULUM["CSE (Data Science)__3"] = [
    sub("CM/CD/CO/CS/IT211", "Probability, Statistics & Complex Analysis", 3),
    sub("CM/CD/CO/CS/IT212", "Universal Human Values", 2),
    sub("CM/CD/CO/CS/IT213", "Discrete Mathematical Structures", 3),
    sub("CM/CD/CO/CS/IT214", "Computer Organization", 3),
    sub("CM/CD/CO/CS/IT215", "Design and Analysis of Algorithms", 3),
    sub("CM/CD/CO/CS/IT216", "Object Oriented Programming", 3),
    sub("CD251", "Skill Enhancement Course-1", 2),
    sub("CD252", "DAA Lab", 1.5, "lab"),
    sub("CD253", "OOP Lab", 1.5, "lab"),
    sub("MC2", "Environmental Science", 0, "mandatory"),
];

CURRICULUM["CSE (Data Science)__4"] = [
    sub("CD221", "Statistical Methods for Data Science", 3),
    sub("CD222", "Data Analytics & Visualization", 3),
    sub("CD223", "Database Management Systems", 3),
    sub("CD224", "Operating Systems", 3),
    sub("CD225", "Computer Networks", 3),
    sub("CD261", "Skill Enhancement Course-2", 2),
    sub("CD262", "Design Thinking & Innovation", 2),
    sub("CD263", "Data Analytics Lab", 1.5, "lab"),
    sub("CD264", "DBMS Lab", 1.5, "lab"),
    sub("MC1", "Constitution of India", 0, "mandatory"),
];

CURRICULUM["CSE (Data Science)__5"] = [
    sub("CD311", "Machine Learning for Data Science", 3),
    sub("CD312", "Big Data Analytics", 3),
    sub("CD313", "Data Mining Techniques", 3),
    sub("CD314", "Professional Elective-I", 3),
    sub("CD315", "Open Elective-I", 3),
    sub("CD351", "Machine Learning Lab", 1.5, "lab"),
    sub("CD352", "Big Data Lab", 1.5, "lab"),
    sub("CD353", "Skill Enhancement Course-3", 2),
    sub("MC3", "Gender Sensitization", 0, "mandatory"),
];

CURRICULUM["CSE (Data Science)__6"] = [
    sub("CD321", "Deep Learning for Data Science", 3),
    sub("CD322", "Natural Language Processing", 3),
    sub("CD323", "Professional Elective-II", 3),
    sub("CD324", "Professional Elective-III", 3),
    sub("CD325", "Open Elective-II", 3),
    sub("CD361", "Deep Learning Lab", 1.5, "lab"),
    sub("CD362", "Mini Project / MOOC-I", 2, "project"),
    sub("CD363", "Skill Enhancement Course-4", 2),
    sub("MC4", "Indian Traditional Knowledge", 0, "mandatory"),
];

CURRICULUM["CSE (Data Science)__7"] = [
    sub("CD411", "Applied AI & Advanced Analytics", 3),
    sub("CD412", "Professional Elective-IV", 3),
    sub("CD413", "Professional Elective-V", 3),
    sub("CD414", "Open Elective-III", 3),
    sub("CD451", "Advanced Analytics Lab", 1.5, "lab"),
    sub("CD452", "Major Project Phase-I", 4, "project"),
    sub("CD453", "Summer Internship", 2, "internship"),
    sub("CD454", "MOOC-II", 2),
];

CURRICULUM["CSE (Data Science)__8"] = [
    sub("CD421", "Professional Elective-VI", 3),
    sub("CD422", "Open Elective-IV", 3),
    sub("CD461", "Major Project Phase-II", 8, "project"),
    sub("CD462", "Comprehensive Viva", 2),
    sub("CD463", "MOOC-III", 2),
];


/* ═══════════════════════════════════════════════════════════
   IT  —  Semesters III – VIII
   Branch Code Prefix: IT
   ═══════════════════════════════════════════════════════════ */

CURRICULUM["IT__3"] = [
    sub("CM/CD/CO/CS/IT211", "Probability, Statistics & Complex Analysis", 3),
    sub("CM/CD/CO/CS/IT212", "Universal Human Values", 2),
    sub("CM/CD/CO/CS/IT213", "Discrete Mathematical Structures", 3),
    sub("CM/CD/CO/CS/IT214", "Computer Organization", 3),
    sub("CM/CD/CO/CS/IT215", "Design and Analysis of Algorithms", 3),
    sub("CM/CD/CO/CS/IT216", "Object Oriented Programming", 3),
    sub("IT251", "Skill Enhancement Course-1", 2),
    sub("IT252", "DAA Lab", 1.5, "lab"),
    sub("IT253", "OOP Lab", 1.5, "lab"),
    sub("MC2", "Environmental Science", 0, "mandatory"),
];

CURRICULUM["IT__4"] = [
    sub("IT221", "Formal Languages & Automata Theory", 3),
    sub("IT222", "Software Engineering", 3),
    sub("IT223", "Database Management Systems", 3),
    sub("IT224", "Operating Systems", 3),
    sub("IT225", "Computer Networks", 3),
    sub("IT261", "Skill Enhancement Course-2", 2),
    sub("IT262", "Design Thinking & Innovation", 2),
    sub("IT263", "OS Lab", 1.5, "lab"),
    sub("IT264", "DBMS Lab", 1.5, "lab"),
    sub("MC1", "Constitution of India", 0, "mandatory"),
];

CURRICULUM["IT__5"] = [
    sub("IT311", "Information Security", 3),
    sub("IT312", "Machine Learning", 3),
    sub("IT313", "Cloud Computing", 3),
    sub("IT314", "Professional Elective-I", 3),
    sub("IT315", "Open Elective-I", 3),
    sub("IT351", "Machine Learning Lab", 1.5, "lab"),
    sub("IT352", "Cloud Computing Lab", 1.5, "lab"),
    sub("IT353", "Skill Enhancement Course-3", 2),
    sub("MC3", "Gender Sensitization", 0, "mandatory"),
];

CURRICULUM["IT__6"] = [
    sub("IT321", "Artificial Intelligence", 3),
    sub("IT322", "Internet of Things", 3),
    sub("IT323", "Professional Elective-II", 3),
    sub("IT324", "Professional Elective-III", 3),
    sub("IT325", "Open Elective-II", 3),
    sub("IT361", "AI & IoT Lab", 1.5, "lab"),
    sub("IT362", "Mini Project / MOOC-I", 2, "project"),
    sub("IT363", "Skill Enhancement Course-4", 2),
    sub("MC4", "Indian Traditional Knowledge", 0, "mandatory"),
];

CURRICULUM["IT__7"] = [
    sub("IT411", "Data Science & Analytics", 3),
    sub("IT412", "Professional Elective-IV", 3),
    sub("IT413", "Professional Elective-V", 3),
    sub("IT414", "Open Elective-III", 3),
    sub("IT451", "Data Science Lab", 1.5, "lab"),
    sub("IT452", "Major Project Phase-I", 4, "project"),
    sub("IT453", "Summer Internship", 2, "internship"),
    sub("IT454", "MOOC-II", 2),
];

CURRICULUM["IT__8"] = [
    sub("IT421", "Professional Elective-VI", 3),
    sub("IT422", "Open Elective-IV", 3),
    sub("IT461", "Major Project Phase-II", 8, "project"),
    sub("IT462", "Comprehensive Viva", 2),
    sub("IT463", "MOOC-III", 2),
];


/* ═══════════════════════════════════════════════════════════
   ECE  —  Semesters III – VIII
   Branch Code Prefix: EC
   ═══════════════════════════════════════════════════════════ */

CURRICULUM["ECE__3"] = [
    sub("EC211", "Signals and Systems", 3),
    sub("EC212", "Analog Electronic Circuits", 3),
    sub("EC213", "Network Theory", 3),
    sub("EC214", "Switching Theory and Logic Design", 3),
    sub("EC215", "Electromagnetic Waves & Transmission Lines", 3),
    sub("EC216", "Universal Human Values", 2),
    sub("EC251", "Analog Electronics Lab", 1.5, "lab"),
    sub("EC252", "Switching Theory Lab", 1.5, "lab"),
    sub("EC253", "Skill Enhancement Course-1", 2),
    sub("MC2", "Environmental Science", 0, "mandatory"),
];

CURRICULUM["ECE__4"] = [
    sub("EC221", "Analog Communications", 3),
    sub("EC222", "Linear Integrated Circuits", 3),
    sub("EC223", "Control Systems", 3),
    sub("EC224", "Pulse and Digital Circuits", 3),
    sub("EC225", "Microprocessors & Microcontrollers", 3),
    sub("EC261", "Communication Systems Lab", 1.5, "lab"),
    sub("EC262", "Microprocessors Lab", 1.5, "lab"),
    sub("EC263", "Skill Enhancement Course-2", 2),
    sub("EC264", "Design Thinking & Innovation", 2),
    sub("MC1", "Constitution of India", 0, "mandatory"),
];

CURRICULUM["ECE__5"] = [
    sub("EC311", "Digital Communications", 3),
    sub("EC312", "Digital Signal Processing", 3),
    sub("EC313", "Antennas and Wave Propagation", 3),
    sub("EC314", "Professional Elective-I", 3),
    sub("EC315", "Open Elective-I", 3),
    sub("EC351", "DSP Lab", 1.5, "lab"),
    sub("EC352", "Digital Communication Lab", 1.5, "lab"),
    sub("EC353", "Skill Enhancement Course-3", 2),
    sub("MC3", "Gender Sensitization", 0, "mandatory"),
];

CURRICULUM["ECE__6"] = [
    sub("EC321", "VLSI Design", 3),
    sub("EC322", "Wireless Communications", 3),
    sub("EC323", "Professional Elective-II", 3),
    sub("EC324", "Professional Elective-III", 3),
    sub("EC325", "Open Elective-II", 3),
    sub("EC361", "VLSI Lab", 1.5, "lab"),
    sub("EC362", "Mini Project / MOOC-I", 2, "project"),
    sub("EC363", "Skill Enhancement Course-4", 2),
    sub("MC4", "Indian Traditional Knowledge", 0, "mandatory"),
];

CURRICULUM["ECE__7"] = [
    sub("EC411", "Radar & Satellite Communications", 3),
    sub("EC412", "Professional Elective-IV", 3),
    sub("EC413", "Professional Elective-V", 3),
    sub("EC414", "Open Elective-III", 3),
    sub("EC451", "Radar & Satellite Lab", 1.5, "lab"),
    sub("EC452", "Major Project Phase-I", 4, "project"),
    sub("EC453", "Summer Internship", 2, "internship"),
    sub("EC454", "MOOC-II", 2),
];

CURRICULUM["ECE__8"] = [
    sub("EC421", "Professional Elective-VI", 3),
    sub("EC422", "Open Elective-IV", 3),
    sub("EC461", "Major Project Phase-II", 8, "project"),
    sub("EC462", "Comprehensive Viva", 2),
    sub("EC463", "MOOC-III", 2),
];


/* ═══════════════════════════════════════════════════════════
   EEE  —  Semesters III – VIII
   Branch Code Prefix: EE
   ═══════════════════════════════════════════════════════════ */

CURRICULUM["EEE__3"] = [
    sub("EE211", "Electrical Circuit Analysis", 3),
    sub("EE212", "Electro Magnetic Fields", 3),
    sub("EE213", "Analog Electronic Circuits", 3),
    sub("EE214", "Electrical Machines-I", 3),
    sub("EE215", "Signals and Systems", 3),
    sub("EE216", "Universal Human Values", 2),
    sub("EE251", "Electrical Machines Lab-I", 1.5, "lab"),
    sub("EE252", "Analog Electronics Lab", 1.5, "lab"),
    sub("EE253", "Skill Enhancement Course-1", 2),
    sub("MC2", "Environmental Science", 0, "mandatory"),
];

CURRICULUM["EEE__4"] = [
    sub("EE221", "Electrical Machines-II", 3),
    sub("EE222", "Control Systems", 3),
    sub("EE223", "Power Systems-I", 3),
    sub("EE224", "Linear Integrated Circuits", 3),
    sub("EE225", "Microprocessors & Microcontrollers", 3),
    sub("EE261", "Electrical Machines Lab-II", 1.5, "lab"),
    sub("EE262", "Control Systems Lab", 1.5, "lab"),
    sub("EE263", "Skill Enhancement Course-2", 2),
    sub("EE264", "Design Thinking & Innovation", 2),
    sub("MC1", "Constitution of India", 0, "mandatory"),
];

CURRICULUM["EEE__5"] = [
    sub("EE311", "Power Systems-II", 3),
    sub("EE312", "Power Electronics", 3),
    sub("EE313", "Digital Signal Processing", 3),
    sub("EE314", "Professional Elective-I", 3),
    sub("EE315", "Open Elective-I", 3),
    sub("EE351", "Power Electronics Lab", 1.5, "lab"),
    sub("EE352", "DSP Lab", 1.5, "lab"),
    sub("EE353", "Skill Enhancement Course-3", 2),
    sub("MC3", "Gender Sensitization", 0, "mandatory"),
];

CURRICULUM["EEE__6"] = [
    sub("EE321", "Power System Protection", 3),
    sub("EE322", "Electrical Drives", 3),
    sub("EE323", "Professional Elective-II", 3),
    sub("EE324", "Professional Elective-III", 3),
    sub("EE325", "Open Elective-II", 3),
    sub("EE361", "Electrical Drives Lab", 1.5, "lab"),
    sub("EE362", "Mini Project / MOOC-I", 2, "project"),
    sub("EE363", "Skill Enhancement Course-4", 2),
    sub("MC4", "Indian Traditional Knowledge", 0, "mandatory"),
];

CURRICULUM["EEE__7"] = [
    sub("EE411", "High Voltage Engineering", 3),
    sub("EE412", "Professional Elective-IV", 3),
    sub("EE413", "Professional Elective-V", 3),
    sub("EE414", "Open Elective-III", 3),
    sub("EE451", "HV Engineering Lab", 1.5, "lab"),
    sub("EE452", "Major Project Phase-I", 4, "project"),
    sub("EE453", "Summer Internship", 2, "internship"),
    sub("EE454", "MOOC-II", 2),
];

CURRICULUM["EEE__8"] = [
    sub("EE421", "Professional Elective-VI", 3),
    sub("EE422", "Open Elective-IV", 3),
    sub("EE461", "Major Project Phase-II", 8, "project"),
    sub("EE462", "Comprehensive Viva", 2),
    sub("EE463", "MOOC-III", 2),
];


/* ═══════════════════════════════════════════════════════════
   Mechanical Engineering  —  Semesters III – VIII
   Branch Code Prefix: ME
   ═══════════════════════════════════════════════════════════ */

CURRICULUM["Mechanical Engineering__3"] = [
    sub("ME211", "Mechanics of Solids", 3),
    sub("ME212", "Engineering Thermodynamics", 3),
    sub("ME213", "Manufacturing Processes", 3),
    sub("ME214", "Metallurgy and Material Science", 3),
    sub("ME215", "Kinematics of Machinery", 3),
    sub("ME216", "Universal Human Values", 2),
    sub("ME251", "Mechanics of Solids Lab", 1.5, "lab"),
    sub("ME252", "Manufacturing Processes Lab", 1.5, "lab"),
    sub("ME253", "Skill Enhancement Course-1", 2),
    sub("MC2", "Environmental Science", 0, "mandatory"),
];

CURRICULUM["Mechanical Engineering__4"] = [
    sub("ME221", "Dynamics of Machinery", 3),
    sub("ME222", "Thermal Engineering", 3),
    sub("ME223", "Fluid Mechanics", 3),
    sub("ME224", "Machine Design-I", 3),
    sub("ME225", "Industrial Engineering & Management", 3),
    sub("ME261", "Thermal Engineering Lab", 1.5, "lab"),
    sub("ME262", "Fluid Mechanics Lab", 1.5, "lab"),
    sub("ME263", "Skill Enhancement Course-2", 2),
    sub("ME264", "Design Thinking & Innovation", 2),
    sub("MC1", "Constitution of India", 0, "mandatory"),
];

CURRICULUM["Mechanical Engineering__5"] = [
    sub("ME311", "Heat Transfer", 3),
    sub("ME312", "Machine Design-II", 3),
    sub("ME313", "Finite Element Methods", 3),
    sub("ME314", "Professional Elective-I", 3),
    sub("ME315", "Open Elective-I", 3),
    sub("ME351", "Heat Transfer Lab", 1.5, "lab"),
    sub("ME352", "CAD/CAM Lab", 1.5, "lab"),
    sub("ME353", "Skill Enhancement Course-3", 2),
    sub("MC3", "Gender Sensitization", 0, "mandatory"),
];

CURRICULUM["Mechanical Engineering__6"] = [
    sub("ME321", "Automobile Engineering", 3),
    sub("ME322", "Robotics and Automation", 3),
    sub("ME323", "Professional Elective-II", 3),
    sub("ME324", "Professional Elective-III", 3),
    sub("ME325", "Open Elective-II", 3),
    sub("ME361", "Robotics Lab", 1.5, "lab"),
    sub("ME362", "Mini Project / MOOC-I", 2, "project"),
    sub("ME363", "Skill Enhancement Course-4", 2),
    sub("MC4", "Indian Traditional Knowledge", 0, "mandatory"),
];

CURRICULUM["Mechanical Engineering__7"] = [
    sub("ME411", "Refrigeration & Air Conditioning", 3),
    sub("ME412", "Professional Elective-IV", 3),
    sub("ME413", "Professional Elective-V", 3),
    sub("ME414", "Open Elective-III", 3),
    sub("ME451", "RAC Lab", 1.5, "lab"),
    sub("ME452", "Major Project Phase-I", 4, "project"),
    sub("ME453", "Summer Internship", 2, "internship"),
    sub("ME454", "MOOC-II", 2),
];

CURRICULUM["Mechanical Engineering__8"] = [
    sub("ME421", "Professional Elective-VI", 3),
    sub("ME422", "Open Elective-IV", 3),
    sub("ME461", "Major Project Phase-II", 8, "project"),
    sub("ME462", "Comprehensive Viva", 2),
    sub("ME463", "MOOC-III", 2),
];


/* ═══════════════════════════════════════════════════════════
   Civil Engineering  —  Semesters III – VIII
   Branch Code Prefix: CE
   ═══════════════════════════════════════════════════════════ */

CURRICULUM["Civil Engineering__3"] = [
    sub("CE211", "Mechanics of Solids-I", 3),
    sub("CE212", "Fluid Mechanics", 3),
    sub("CE213", "Surveying", 3),
    sub("CE214", "Building Materials & Construction", 3),
    sub("CE215", "Engineering Geology", 3),
    sub("CE216", "Universal Human Values", 2),
    sub("CE251", "Surveying Lab", 1.5, "lab"),
    sub("CE252", "Fluid Mechanics Lab", 1.5, "lab"),
    sub("CE253", "Skill Enhancement Course-1", 2),
    sub("MC2", "Environmental Science", 0, "mandatory"),
];

CURRICULUM["Civil Engineering__4"] = [
    sub("CE221", "Mechanics of Solids-II", 3),
    sub("CE222", "Hydraulics & Hydraulic Machinery", 3),
    sub("CE223", "Structural Analysis-I", 3),
    sub("CE224", "Concrete Technology", 3),
    sub("CE225", "Geotechnical Engineering-I", 3),
    sub("CE261", "Concrete Lab", 1.5, "lab"),
    sub("CE262", "Geotechnical Lab", 1.5, "lab"),
    sub("CE263", "Skill Enhancement Course-2", 2),
    sub("CE264", "Design Thinking & Innovation", 2),
    sub("MC1", "Constitution of India", 0, "mandatory"),
];

CURRICULUM["Civil Engineering__5"] = [
    sub("CE311", "Structural Analysis-II", 3),
    sub("CE312", "Design of Reinforced Concrete Structures", 3),
    sub("CE313", "Environmental Engineering-I", 3),
    sub("CE314", "Professional Elective-I", 3),
    sub("CE315", "Open Elective-I", 3),
    sub("CE351", "Environmental Engineering Lab", 1.5, "lab"),
    sub("CE352", "Structural Analysis Lab", 1.5, "lab"),
    sub("CE353", "Skill Enhancement Course-3", 2),
    sub("MC3", "Gender Sensitization", 0, "mandatory"),
];

CURRICULUM["Civil Engineering__6"] = [
    sub("CE321", "Design of Steel Structures", 3),
    sub("CE322", "Transportation Engineering", 3),
    sub("CE323", "Professional Elective-II", 3),
    sub("CE324", "Professional Elective-III", 3),
    sub("CE325", "Open Elective-II", 3),
    sub("CE361", "Transportation Lab", 1.5, "lab"),
    sub("CE362", "Mini Project / MOOC-I", 2, "project"),
    sub("CE363", "Skill Enhancement Course-4", 2),
    sub("MC4", "Indian Traditional Knowledge", 0, "mandatory"),
];

CURRICULUM["Civil Engineering__7"] = [
    sub("CE411", "Irrigation Engineering", 3),
    sub("CE412", "Professional Elective-IV", 3),
    sub("CE413", "Professional Elective-V", 3),
    sub("CE414", "Open Elective-III", 3),
    sub("CE451", "Irrigation Lab", 1.5, "lab"),
    sub("CE452", "Major Project Phase-I", 4, "project"),
    sub("CE453", "Summer Internship", 2, "internship"),
    sub("CE454", "MOOC-II", 2),
];

CURRICULUM["Civil Engineering__8"] = [
    sub("CE421", "Professional Elective-VI", 3),
    sub("CE422", "Open Elective-IV", 3),
    sub("CE461", "Major Project Phase-II", 8, "project"),
    sub("CE462", "Comprehensive Viva", 2),
    sub("CE463", "MOOC-III", 2),
];
