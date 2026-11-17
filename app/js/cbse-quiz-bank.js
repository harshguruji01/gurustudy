/**
 * GuruStudy - CBSE Class 10 Interactive Quiz Engine & Question Bank (Prompt 20)
 * MCQs, Assertion-Reason, and Case-Study Questions with instant explanations.
 */

const CBSE_QUIZ_BANK = [
  // Mathematics
  {
    id: "q_m_1",
    subject: "Mathematics",
    chapter: "Real Numbers",
    type: "mcq",
    question: "If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:",
    options: ["xy", "xy²", "x³y³", "x²y²"],
    correctIndex: 1,
    explanation: "HCF is the product of the smallest power of each common prime factor involved in the numbers. Smallest power of x is 1, and smallest power of y is 2. Therefore, HCF(a, b) = xy²."
  },
  {
    id: "q_m_2",
    subject: "Mathematics",
    chapter: "Polynomials",
    type: "assertion_reason",
    question: "Assertion (A): The polynomial p(x) = x² + 3x + 3 has two real zeroes.\nReason (R): A quadratic polynomial can have at most two zeroes.",
    options: [
      "Both (A) and (R) are true and (R) is correct explanation of (A)",
      "Both (A) and (R) are true but (R) is NOT correct explanation of (A)",
      "(A) is false but (R) is true",
      "(A) is true but (R) is false"
    ],
    correctIndex: 2,
    explanation: "For p(x) = x² + 3x + 3, Discriminant D = b² - 4ac = 3² - 4(1)(3) = 9 - 12 = -3 < 0. Thus, p(x) has no real zeroes. Therefore, Assertion (A) is false, but Reason (R) is a true statement."
  },
  {
    id: "q_m_3",
    subject: "Mathematics",
    chapter: "Introduction to Trigonometry",
    type: "mcq",
    question: "If sin θ + cos θ = √2 cos θ, then the value of (cos θ - sin θ) is:",
    options: ["√2 sin θ", "√2 cos θ", "2 sin θ", "1 / √2"],
    correctIndex: 0,
    explanation: "Given sin θ = (√2 - 1) cos θ ==> cos θ = sin θ / (√2 - 1) = (√2 + 1) sin θ. Therefore, cos θ - sin θ = (√2 + 1) sin θ - sin θ = √2 sin θ."
  },
  {
    id: "q_m_4",
    subject: "Mathematics",
    chapter: "Quadratic Equations",
    type: "mcq",
    question: "Which of the following equations has 2 as a root?",
    options: ["x² - 4x + 5 = 0", "x² + 3x - 12 = 0", "2x² - 7x + 6 = 0", "3x² - 6x - 2 = 0"],
    correctIndex: 2,
    explanation: "Substituting x = 2 into 2x² - 7x + 6 gives: 2(2)² - 7(2) + 6 = 8 - 14 + 6 = 0. Hence, x = 2 is a root."
  },

  // Science
  {
    id: "q_s_1",
    subject: "Science",
    chapter: "Chemical Reactions and Equations",
    type: "assertion_reason",
    question: "Assertion (A): Exposure of silver chloride to sunlight for a long duration turns grey.\nReason (R): This is due to the formation of silver by decomposition of silver chloride.",
    options: [
      "Both (A) and (R) are true and (R) is correct explanation of (A)",
      "Both (A) and (R) are true but (R) is NOT correct explanation of (A)",
      "(A) is true but (R) is false",
      "(A) is false but (R) is true"
    ],
    correctIndex: 0,
    explanation: "2AgCl(s) --sunlight--> 2Ag(s) + Cl₂(g). White silver chloride turns grey in sunlight due to photochemical decomposition into metallic silver."
  },
  {
    id: "q_s_2",
    subject: "Science",
    chapter: "Life Processes",
    type: "mcq",
    question: "The correct sequence of anaerobic reactions in human muscle cells during vigorous exercise is:",
    options: [
      "Glucose --cytoplasm--> Pyruvate --mitochondria--> Lactic acid",
      "Glucose --cytoplasm--> Pyruvate --cytoplasm--> Lactic acid + Energy",
      "Glucose --cytoplasm--> Pyruvate --mitochondria--> CO₂ + H₂O",
      "Glucose --cytoplasm--> Pyruvate --cytoplasm--> Ethanol + CO₂"
    ],
    correctIndex: 1,
    explanation: "In absence/lack of oxygen in muscle cells, glucose (6-C) breaks down to pyruvate (3-C) in cytoplasm, which is converted to lactic acid (3-C) + energy in the cytoplasm itself, causing muscle cramps."
  },
  {
    id: "q_s_3",
    subject: "Science",
    chapter: "Light - Reflection and Refraction",
    type: "mcq",
    question: "A full length image of a distant tall building can definitely be seen by using:",
    options: ["A concave mirror", "A convex mirror", "A plane mirror", "Both concave and plane mirror"],
    correctIndex: 1,
    explanation: "Convex mirrors have a wide field of view because they are curved outwards, and always form a virtual, erect, and diminished image regardless of object distance."
  },
  {
    id: "q_s_4",
    subject: "Science",
    chapter: "Electricity",
    type: "mcq",
    question: "A cylindrical conductor of length l and uniform area of cross-section A has resistance R. Another conductor of length 2l and resistance R of the same material has cross-sectional area:",
    options: ["A/2", "3A/2", "2A", "3A"],
    correctIndex: 2,
    explanation: "R = ρ(l / A). For the new conductor, R = ρ(2l / A'). Since R and ρ are unchanged: l/A = 2l/A' ==> A' = 2A."
  },

  // Social Science
  {
    id: "q_sst_1",
    subject: "Social Science",
    chapter: "Nationalism in India",
    type: "mcq",
    question: "Why was the Simon Commission boycotted by Indians in 1928?",
    options: [
      "It supported the British Queen directly",
      "It did not have a single Indian member",
      "It banned the Indian National Congress",
      "It increased the salt tax by 50%"
    ],
    correctIndex: 1,
    explanation: "The statutory commission under Sir John Simon set up by the British Government had all British members and not a single Indian representative, which was seen as an insult to Indian self-respect."
  },
  {
    id: "q_sst_2",
    subject: "Social Science",
    chapter: "Power Sharing",
    type: "assertion_reason",
    question: "Assertion (A): Power sharing is good for democracy.\nReason (R): It helps to reduce the possibility of conflict between social groups.",
    options: [
      "Both (A) and (R) are true and (R) is correct explanation of (A)",
      "Both (A) and (R) are true but (R) is NOT correct explanation of (A)",
      "(A) is true but (R) is false",
      "(A) is false but (R) is true"
    ],
    correctIndex: 0,
    explanation: "Prudential reason: Power sharing prevents instability and civil strife between linguistic/social communities, keeping the democratic structure resilient."
  },

  // AI Code 417
  {
    id: "q_ai_1",
    subject: "AI (Code 417)",
    chapter: "AI Project Cycle",
    type: "mcq",
    question: "In the Confusion Matrix, the formula for Recall (Sensitivity) is given by:",
    options: [
      "TP / (TP + FP)",
      "TP / (TP + FN)",
      "(TP + TN) / Total",
      "2 × (Precision × Recall) / (Precision + Recall)"
    ],
    correctIndex: 1,
    explanation: "Recall measures the fraction of actual positive instances correctly identified: Recall = TP / (TP + FN)."
  }
];

class QuizEngine {
  constructor() {
    this.weakTopicsStorageKey = 'gurustudy_needs_practice_topics';
  }

  getQuestions(subject = 'all', mode = 'quick') {
    let pool = [...CBSE_QUIZ_BANK];
    if (subject !== 'all') {
      pool = pool.filter(q => q.subject.toLowerCase().includes(subject.toLowerCase()));
    }
    const count = mode === 'quick' ? 5 : 10;
    return pool.slice(0, count);
  }

  getWeakTopics() {
    try {
      const saved = localStorage.getItem(this.weakTopicsStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading weak topics:', e);
    }
    return [
      { subject: "Mathematics", chapter: "Introduction to Trigonometry", scorePct: 40, reason: "Identities speed check" },
      { subject: "Science", chapter: "Light - Reflection and Refraction", scorePct: 50, reason: "Sign conventions for lenses" }
    ];
  }

  logWeakTopic(subject, chapter, scorePct) {
    if (scorePct >= 70) return; // Only log topics below 70%
    const current = this.getWeakTopics();
    const existingIdx = current.findIndex(t => t.chapter.toLowerCase() === chapter.toLowerCase());
    if (existingIdx >= 0) {
      current[existingIdx].scorePct = scorePct;
    } else {
      current.push({ subject, chapter, scorePct, reason: "Scored < 70% in Practice Quiz" });
    }
    localStorage.setItem(this.weakTopicsStorageKey, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('gurustudy:weak-topics-updated', { detail: { topics: current } }));
  }
}

// Global instance
const guruQuizEngine = new QuizEngine();
