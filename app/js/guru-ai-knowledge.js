/**
 * GuruStudy - Guru AI Study Assistant Knowledge Base & Logic Engine (Prompt 17)
 * Offline-first Class 10 NCERT expert with Hinglish explanations, KaTeX formulas,
 * and live LLM endpoint support.
 */

const GURU_AI_KNOWLEDGE = {
  // Maths Quick Explanations & Formulas
  "real numbers": {
    hinglish: "Real Numbers me fundamental theorem of arithmetic sabse important hai: Every composite number can be uniquely expressed as product of primes. HCF(a,b) * LCM(a,b) = a * b. Irrationality proof (jaise √2, √3, √5) board exam me 3 marks ka guarantee aata hai!",
    formulas: "1. Fundamental Theorem: a = p1^k1 * p2^k2... \n2. HCF(a,b) × LCM(a,b) = a × b \n3. Let p be prime; if p divides a^2, then p divides a.",
    questions: [
      "Prove that √5 is an irrational number. (3 Marks - Very Imp)",
      "Given that HCF(306, 657) = 9, find LCM(306, 657).",
      "Check whether 6^n can end with the digit 0 for any natural number n.",
      "Explain why 7 × 11 × 13 + 13 is a composite number.",
      "Find the largest number that divides 70 and 125 leaving remainders 5 and 8 respectively."
    ],
    memoryTrick: "Remember 'HCF × LCM = Product' (HLP: High Level Product) & contradiction method hamesha 'Let it be rational p/q' se start karo!"
  },
  "polynomials": {
    hinglish: "Polynomials me quadratic p(x) = ax² + bx + c ke zeroes α aur β hote hain. Sum of zeroes α + β = -b/a aur Product αβ = c/a. Graph x-axis ko jitni baar kaatata hai, utne hi zeroes hote hain!",
    formulas: "1. p(x) = k[x² - (α + β)x + αβ] \n2. Sum: α + β = -b/a \n3. Product: αβ = c/a \n4. Identity: α² + β² = (α + β)² - 2αβ",
    questions: [
      "Find zeroes of quadratic polynomial 6x² - 3 - 7x and verify relations with coefficients.",
      "If α, β are zeroes of 2x² - 5x + 7, evaluate α² + β².",
      "Form a quadratic polynomial whose zeroes are 2 + √3 and 2 - √3.",
      "Find a quadratic polynomial whose sum and product of zeroes are -1/4 and 1/4.",
      "For what value of k, is -4 a zero of the polynomial x² - x - (2k + 2)?"
    ],
    memoryTrick: "Sum is Minus B over A (MBA), Product is C over A (CA). Finance trick!"
  },
  "quadratic equations": {
    hinglish: "Standard form ax² + bx + c = 0 (a ≠ 0). Discriminant D = b² - 4ac. Agar D > 0: two distinct real roots; D = 0: two equal real roots (-b/2a); D < 0: no real roots (imaginary).",
    formulas: "1. D = b² - 4ac \n2. Quadratic Formula: x = (-b ± √D) / (2a) \n3. Real & equal roots condition: D = 0",
    questions: [
      "Find the roots of 2x² - 7x + 3 = 0 using quadratic formula.",
      "Find the value of k for which 2x² + kx + 3 = 0 has two equal roots.",
      "A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream. Find speed of stream.",
      "Solve for x: 1/(x+4) - 1/(x-7) = 11/30 (x ≠ -4, 7).",
      "Two water taps together can fill a tank in 9(3/8) hours. Find time taken by each tap separately."
    ],
    memoryTrick: "B-Squared Minus 4AC decides the fate! D>0 (Double distinct), D=0 (Twins), D<0 (Zero real)."
  },
  "introduction to trigonometry": {
    hinglish: "Trigonometry right angled triangle par chalta hai. Pandit Badri Prasad Har Har Bole (PBP/HHB). sin = P/H, cos = B/H, tan = P/B. Sabse zaroori identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ.",
    formulas: "1. sin²θ + cos²θ = 1 \n2. 1 + tan²θ = sec²θ \n3. 1 + cot²θ = cosec²θ \n4. tanθ = sinθ/cosθ \n5. Values: sin30°=1/2, sin45°=1/√2, sin60°=√3/2, tan45°=1",
    questions: [
      "Prove that: (sinθ - 2sin³θ) / (2cos³θ - cosθ) = tanθ.",
      "Prove that: (cosecθ - cotθ)² = (1 - cosθ) / (1 + cosθ).",
      "If tan(A + B) = √3 and tan(A - B) = 1/√3; find A and B.",
      "Evaluate: (5cos²60° + 4sec²30° - tan²45°) / (sin²30° + cos²30°).",
      "Prove that: (cosA / (1 + sinA)) + ((1 + sinA) / cosA) = 2secA."
    ],
    memoryTrick: "Pandit Badri Prasad / Har Har Bole -> S-C-T. Sabhi identities me 1 + tan² = sec² aur 1 + cot² = cosec² yaad rakho!"
  },
  // Science Explanations
  "chemical reactions and equations": {
    hinglish: "Chemical reaction me chemical bonds tootate aur bante hain. 5 types: Combination (A+B->AB), Decomposition (AB->A+B), Displacement (More reactive kicks out less reactive), Double Displacement (Precipitation), Redox (Oxidation = Gain of O or Loss of H, Reduction = Loss of O or Gain of H). Balanced equation obeys Law of Conservation of Mass!",
    formulas: "1. 2Mg + O2 -> 2MgO (Dazzling white flame)\n2. CaO + H2O -> Ca(OH)2 + Heat (Slaked lime)\n3. 2FeSO4 --heat--> Fe2O3 + SO2 + SO3\n4. Corrosion: 4Fe + 3O2 + xH2O -> 2Fe2O3.xH2O (Rust)\n5. Rancidity prevention: Nitrogen gas flushing & antioxidants.",
    questions: [
      "Why does the color of copper sulphate solution change when an iron nail is dipped in it?",
      "Translate and balance: Hydrogen gas combines with nitrogen to form ammonia.",
      "Why is respiration considered an exothermic reaction? Explain with equation.",
      "Identify the substance oxidized, reduced, oxidizing agent and reducing agent in: MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2.",
      "What is a precipitation reaction? Give one example with chemical equation."
    ],
    memoryTrick: "OIL RIG: Oxidation Is Loss (of electrons/hydrogen), Reduction Is Gain!"
  },
  "life processes": {
    hinglish: "Life processes 4 systems par based hai: Nutrition, Respiration, Transportation, and Excretion. Autotrophic (Photosynthesis equation) vs Heterotrophic. Xylem paani transport karta hai, Phloem food (translocation). Nephron kidney ki filtration unit hai!",
    formulas: "1. Photosynthesis: 6CO2 + 12H2O --light/chlorophyll--> C6H12O6 + 6O2 + 6H2O\n2. Aerobic Respiration: Glucose -> Pyruvate -> 6CO2 + 6H2O + 38 ATP\n3. Anaerobic in Yeast: Glucose -> Pyruvate -> Ethanol + CO2 + 2 ATP\n4. Anaerobic in Muscle: Glucose -> Pyruvate -> Lactic Acid + 2 ATP (Cramps)",
    questions: [
      "Draw a neat labeled diagram of human nephron and explain urine formation.",
      "Differentiate between aerobic and anaerobic respiration.",
      "How is small intestine designed to absorb digested food effectively?",
      "What are the components of transport system in highly organized plants? Explain functions.",
      "Why is double circulation necessary in human beings?"
    ],
    memoryTrick: "XYLEM = Water (Jal -> Xylem), PHLOEM = Food (Ph -> Fruit/Food)!"
  },
  "light reflection and refraction": {
    hinglish: "Mirror formula: 1/f = 1/v + 1/u (Magnification m = -v/u). Lens formula: 1/f = 1/v - 1/u (Magnification m = +v/u). Power of Lens P = 1/f (in meters), unit is Dioptre (D). Convex lens converging hota hai, Concave diverging!",
    formulas: "1. Mirror: 1/f = 1/v + 1/u, m = -v/u = h'/h\n2. Lens: 1/f = 1/v - 1/u, m = +v/u = h'/h\n3. Snell's Law: n = sin(i) / sin(r) = c / v\n4. Power: P = 1 / f(in m) (Dioptre)",
    questions: [
      "An object 4 cm in size is placed 25 cm in front of a concave mirror of focal length 15 cm. Find position, nature and size of image.",
      "State the laws of refraction. Explain Snell's law.",
      "A convex lens forms a real and inverted image of a needle at a distance of 50 cm. If size of image equals size of object, where is needle placed? Find power.",
      "Draw ray diagram when object is placed between F and 2F of a convex lens.",
      "Why do stars twinkle while planets do not?"
    ],
    memoryTrick: "Mirror formula has PLUS (+), Lens formula has MINUS (-). But magnification is reversed: Mirror has -v/u, Lens has +v/u!"
  },
  // AI Code 417 Topic
  "ai project cycle & python": {
    hinglish: "AI Code 417 me AI Project Cycle ke 5 stages hain: Problem Scoping (4Ws canvas), Data Acquisition, Data Exploration, Data Modelling (Rule-based vs Learning-based), and Evaluation. Python me basic loops, lists aur string manipulation aate hain!",
    formulas: "1. 4Ws Canvas: Who, What, Where, Why\n2. Confusion Matrix: Accuracy = (TP + TN) / (TP + TN + FP + FN)\n3. Precision = TP / (TP + FP)\n4. Recall = TP / (TP + FN)\n5. F1-Score = 2 * (Precision * Recall) / (Precision + Recall)",
    questions: [
      "Explain the 4Ws problem canvas with a suitable real-life example.",
      "What is the difference between Rule-Based and Learning-Based AI models?",
      "Given TP=40, TN=50, FP=5, FN=5. Calculate Accuracy, Precision, Recall and F1-Score.",
      "Write a Python program to check whether a given string is a palindrome.",
      "What is Computer Vision? Explain two applications in healthcare."
    ],
    memoryTrick: "PR-Cycle: Problem -> Data Acq -> Explore -> Model -> Evaluate (PDEME)!"
  }
};

class GuruAIAssistant {
  constructor() {
    this.apiKey = localStorage.getItem('gurustudy_ai_api_key') || '';
    this.apiEndpoint = localStorage.getItem('gurustudy_ai_endpoint') || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    localStorage.setItem('gurustudy_ai_api_key', this.apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  matchTopic(query, currentSubject, currentChapter) {
    const q = (query || '').toLowerCase();
    const ch = (currentChapter || '').toLowerCase();
    const subj = (currentSubject || '').toLowerCase();

    // Direct match by chapter title
    for (const key of Object.keys(GURU_AI_KNOWLEDGE)) {
      if (ch.includes(key) || key.includes(ch) || q.includes(key)) {
        return GURU_AI_KNOWLEDGE[key];
      }
    }

    // Keyword match
    if (q.includes('real number') || q.includes('irrational') || q.includes('hcf') || q.includes('lcm')) return GURU_AI_KNOWLEDGE["real numbers"];
    if (q.includes('polynomial') || q.includes('zeroes') || q.includes('quadratic')) return GURU_AI_KNOWLEDGE["polynomials"];
    if (q.includes('trig') || q.includes('sin') || q.includes('cos') || q.includes('tan')) return GURU_AI_KNOWLEDGE["introduction to trigonometry"];
    if (q.includes('reaction') || q.includes('chemical') || q.includes('redox')) return GURU_AI_KNOWLEDGE["chemical reactions and equations"];
    if (q.includes('life process') || q.includes('nephron') || q.includes('photosynthesis')) return GURU_AI_KNOWLEDGE["life processes"];
    if (q.includes('light') || q.includes('mirror') || q.includes('lens') || q.includes('refraction')) return GURU_AI_KNOWLEDGE["light reflection and refraction"];
    if (q.includes('ai') || q.includes('417') || q.includes('python') || q.includes('precision') || q.includes('confusion')) return GURU_AI_KNOWLEDGE["ai project cycle & python"];

    // Default fallback
    return GURU_AI_KNOWLEDGE["real numbers"];
  }

  async answerQuestion(promptType, userMessage, currentSubject, currentChapter) {
    const topic = this.matchTopic(userMessage, currentSubject, currentChapter);
    const subName = currentSubject || 'General Class 10';
    const chName = currentChapter || 'Board Revision';

    // 1. Try online live API if configured
    if (this.apiKey) {
      try {
        const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Guru AI, a top CBSE Class 10 Board mentor. 
Subject: ${subName}, Chapter: ${chName}.
User Query: "${userMessage}".
Prompt Mode: "${promptType}".
Answer in concise, high-impact bullet points with clear formulas, Hinglish explanations where helpful, and exact Board Exam tips. Keep under 250 words.`
              }]
            }]
          })
        });
        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return this.formatOutput(text);
        }
      } catch (e) {
        console.warn('[GuruAI] Cloud API error, using built-in knowledge base:', e);
      }
    }

    // 2. Offline Knowledge Base responses
    switch (promptType) {
      case 'hinglish':
        return `<strong>🎯 Hinglish Explanation (${chName}):</strong><br><br>${topic.hinglish}<br><br>💡 <em>Board Pro-Tip:</em> Always write full steps and mention the NCERT theorem name in your answer sheet!`;

      case 'questions':
        return `<strong>⭐ Top 5 CBSE Board Exam Questions (${chName}):</strong><br><br>` +
          topic.questions.map((q, idx) => `<div style="margin-bottom:8px;"><strong>Q${idx+1}:</strong> ${q}</div>`).join('') +
          `<br><em>💡 Practice these in your study notebook today!</em>`;

      case 'formulas':
        return `<strong>📐 Key Formulas & Definitions (${chName}):</strong><br><br><pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; font-family:monospace; white-space:pre-wrap; font-size:0.8rem; color:#A5B4FC;">${topic.formulas}</pre>`;

      case 'memory':
        return `<strong>🧠 5-Point Memory Trick (${chName}):</strong><br><br>` +
          `1. ${topic.memoryTrick}<br>` +
          `2. <strong>Reverse Engineering:</strong> Try solving backward from the given options in MCQs.<br>` +
          `3. <strong>Unit Check:</strong> Never forget units (cm², m/s, Dioptres, Joules) in final answers.<br>` +
          `4. <strong>Sign Convention:</strong> In ray optics, object distance 'u' is ALWAYS negative (-).<br>` +
          `5. <strong>Speed Audit:</strong> Dedicate maximum 1.5 minutes per 1-mark question in Boards!`;

      default:
        return `<strong>✨ Guru AI Guidance (${chName}):</strong><br><br>${topic.hinglish}<br><br><strong>Top Formula:</strong><br><pre style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px; font-size:0.78rem;">${topic.formulas.split('\n')[0]}</pre><br><strong>Memory Tip:</strong> ${topic.memoryTrick}`;
    }
  }

  formatOutput(rawText) {
    return rawText
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
}

// Global instance
const guruAI = new GuruAIAssistant();
