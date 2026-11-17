/**
 * GuruStudy - CBSE Class 10 Revision Vault Data & 3D Flashcards (Prompt 18)
 * Formulas, Reactions, Key Timelines, and 3D-Flip Flashcard Engine.
 */

const CBSE_VAULT_DATA = {
  formulas: {
    maths: [
      {
        id: "m_tri",
        title: "Trigonometric Identities & Values",
        chapter: "Introduction to Trigonometry",
        content: "• sin²θ + cos²θ = 1  ==>  sin²θ = 1 - cos²θ\n• 1 + tan²θ = sec²θ  ==>  sec²θ - tan²θ = 1\n• 1 + cot²θ = cosec²θ  ==>  cosec²θ - cot²θ = 1\n• tanθ = sinθ / cosθ, cotθ = cosθ / sinθ\n• sin(90°-θ) = cosθ, tan(90°-θ) = cotθ\n• Table: sin 30°=1/2, sin 45°=1/√2, sin 60°=√3/2, tan 45°=1",
        pinned: false
      },
      {
        id: "m_quad",
        title: "Quadratic Roots & Nature of Discriminant",
        chapter: "Quadratic Equations",
        content: "• Standard form: ax² + bx + c = 0 (a ≠ 0)\n• Discriminant: D = b² - 4ac\n• Roots: x = (-b ± √D) / (2a)\n• Case 1: D > 0  --> 2 distinct real roots\n• Case 2: D = 0  --> 2 equal real roots (-b/2a)\n• Case 3: D < 0  --> No real roots",
        pinned: false
      },
      {
        id: "m_ap",
        title: "Arithmetic Progression (AP)",
        chapter: "Arithmetic Progressions",
        content: "• General form: a, a+d, a+2d, ...\n• nth Term: aₙ = a + (n - 1)d\n• Sum of n Terms: Sₙ = (n/2)[2a + (n - 1)d]\n• Sum with last term l: Sₙ = (n/2)[a + l]\n• nth term from end: aₙ(end) = l - (n - 1)d",
        pinned: false
      },
      {
        id: "m_mens",
        title: "Surface Areas and Volumes",
        chapter: "Surface Areas and Volumes",
        content: "• Cylinder: CSA = 2πrh | TSA = 2πr(r+h) | Vol = πr²h\n• Cone: l = √(r²+h²) | CSA = πrl | TSA = πr(l+r) | Vol = (1/3)πr²h\n• Sphere: Surface = 4πr² | Vol = (4/3)πr³\n• Hemisphere: CSA = 2πr² | TSA = 3πr² | Vol = (2/3)πr³",
        pinned: false
      },
      {
        id: "m_stat",
        title: "Statistics & Empirical Relationship",
        chapter: "Statistics",
        content: "• Direct Mean: x̄ = Σ(fᵢxᵢ) / Σfᵢ\n• Assumed Mean: x̄ = a + [Σ(fᵢdᵢ) / Σfᵢ]\n• Mode: l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] × h\n• Median: l + [((n/2) - cf) / f] × h\n• Empirical Formula: 3 Median = Mode + 2 Mean",
        pinned: false
      }
    ],
    science: [
      {
        id: "s_chem1",
        title: "Key Balanced Chemical Equations (Ch 1–4)",
        chapter: "Chemical Reactions and Equations",
        content: "• 2Mg + O₂ → 2MgO (White powder, dazzling light)\n• CaO + H₂O → Ca(OH)₂ + Heat (Exothermic)\n• 2Pb(NO₃)₂ --heat--> 2PbO + 4NO₂ (Brown fumes) + O₂\n• Fe + CuSO₄ → FeSO₄ (Light green) + Cu (Red-brown)\n• Na₂SO₄ + BaCl₂ → BaSO₄ (White ppt) + 2NaCl\n• CH₄ + 2O₂ → CO₂ + 2H₂O + Heat\n• Thermite: Fe₂O₃ + 2Al → 2Fe(molten) + Al₂O₃ + Heat",
        pinned: false
      },
      {
        id: "s_phy_light",
        title: "Optics Formulas & Sign Conventions",
        chapter: "Light - Reflection and Refraction",
        content: "• Mirror Formula: 1/f = 1/v + 1/u\n• Mirror Magnification: m = -v/u = h'/h\n• Lens Formula: 1/f = 1/v - 1/u\n• Lens Magnification: m = +v/u = h'/h\n• Power of Lens: P = 1 / f(in meters) [Unit: Dioptre (D)]\n• Convex lens/mirror f is (+), Concave lens/mirror f is (-)",
        pinned: false
      },
      {
        id: "s_phy_elec",
        title: "Electricity & Ohm's Law",
        chapter: "Electricity",
        content: "• Current: I = Q / t  (1 A = 1 C / 1 s)\n• Potential Diff: V = W / Q\n• Ohm's Law: V = I × R\n• Resistance: R = ρ(l / A)\n• Series: R_eq = R₁ + R₂ + R₃ (Current same)\n• Parallel: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃ (Voltage same)\n• Joule's Heating: H = I²Rt\n• Electric Power: P = VI = I²R = V²/R  [1 kWh = 3.6 × 10⁶ J]",
        pinned: false
      }
    ],
    sst: [
      {
        id: "sst_dates",
        title: "Nationalism in India — Key Timeline Dates",
        chapter: "Nationalism in India (History)",
        content: "• 1915: Gandhiji returns to India from South Africa (Jan)\n• 1916: Champaran (Bihar) Indigo Satyagraha\n• 1917: Kheda (Gujarat) Peasant Satyagraha\n• 1918: Ahmedabad Cotton Mill Worker Satyagraha\n• 1919: Rowlatt Act & Jallianwala Bagh Massacre (13 April)\n• 1920: Non-Cooperation Movement launched\n• 1922: Chauri Chaura incident; NCM called off\n• 1928: Simon Commission arrives (Go Back Simon!)\n• 1929: Lahore Congress — Purna Swaraj resolution\n• 1930: Dandi March (12 Mar - 6 Apr) & Civil Disobedience\n• 1931: Gandhi-Irwin Pact & 2nd Round Table Conference\n• 1932: Poona Pact between Gandhiji & Dr. B.R. Ambedkar",
        pinned: false
      },
      {
        id: "sst_maps",
        title: "Major Dams & Seaports (CBSE Map Syllabus)",
        chapter: "Water Resources & Lifelines of National Economy",
        content: "• Salal Dam: Chenab River (J&K)\n• Bhakra Nangal Dam: Satluj River (HP/Punjab)\n• Tehri Dam: Bhagirathi River (Uttarakhand)\n• Rana Pratap Sagar: Chambal River (Rajasthan)\n• Sardar Sarovar: Narmada River (Gujarat)\n• Hirakud Dam: Mahanadi River (Odisha - Longest dam)\n• Nagarjuna Sagar: Krishna River (Telangana/AP)\n• Major Ports: Kandla (Gujarat), Mumbai (Largest), Marmagao (Goa), New Mangalore, Kochi, Tuticorin, Chennai (Oldest artificial), Visakhapatnam (Deepest landlocked), Paradip (Odisha), Haldia (WB).",
        pinned: false
      }
    ]
  },

  flashcards: [
    {
      id: "fc_1",
      subject: "Mathematics",
      chapter: "Real Numbers",
      front: "What is the condition for a rational number p/q to have a terminating decimal expansion?",
      back: "The prime factorisation of q must be of the form 2ⁿ · 5ᵐ, where n and m are non-negative integers.",
      mastered: false
    },
    {
      id: "fc_2",
      subject: "Science",
      chapter: "Chemical Reactions",
      front: "What is the chemical formula and color of rust?",
      back: "Hydrated Iron(III) Oxide: Fe₂O₃ · xH₂O. Color is reddish-brown.",
      mastered: false
    },
    {
      id: "fc_3",
      subject: "Mathematics",
      chapter: "Trigonometry",
      front: "What is the value of (sec²θ - tan²θ) + (cosec²θ - cot²θ)?",
      back: "Value is 1 + 1 = 2 (using standard trigonometric Pythagorean identities).",
      mastered: false
    },
    {
      id: "fc_4",
      subject: "Science",
      chapter: "Life Processes",
      front: "Which artery carries deoxygenated blood in human body?",
      back: "Pulmonary Artery carries deoxygenated blood from right ventricle to lungs.",
      mastered: false
    },
    {
      id: "fc_5",
      subject: "Social Science",
      chapter: "Nationalism in India",
      front: "On which date and river bank was the tricolour unfurled for 'Purna Swaraj'?",
      back: "31st December 1929 on the banks of River Ravi, Lahore by Pt. Jawaharlal Nehru.",
      mastered: false
    },
    {
      id: "fc_6",
      subject: "Science",
      chapter: "Light",
      front: "What is the focal length of a plane mirror?",
      back: "Infinity (∞). Power of plane mirror is zero (P = 1/∞ = 0).",
      mastered: false
    },
    {
      id: "fc_7",
      subject: "AI (Code 417)",
      chapter: "AI Project Cycle",
      front: "What are the four components of the 4Ws Problem Canvas?",
      back: "1. Who (Stakeholders) \n2. What (Problem nature) \n3. Where (Context/Location) \n4. Why (Benefits of AI solution).",
      mastered: false
    },
    {
      id: "fc_8",
      subject: "Science",
      chapter: "Electricity",
      front: "State Joule's Law of Heating mathematically.",
      back: "H = I²Rt (Heat produced is directly proportional to square of current, resistance, and time).",
      mastered: false
    }
  ]
};
