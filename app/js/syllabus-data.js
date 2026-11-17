/**
 * GuruStudy - Official CBSE Class 10 NCERT Rationalized Syllabus & Chapter Dataset
 * Covers 88 Days (20 Nov 2026 – 15 Feb 2027)
 * Author: HarshGuruJi (contact@webguruji.online)
 */

const GURU_SYLLABUS = {
  version: '2026-27',
  examTargetYear: 2027,
  totalDays: 88,

  subjects: {
    maths: {
      name: 'Mathematics',
      code: '041',
      color: '#3B82F6',
      icon: '📐',
      dailyHours: 2.0,
      dailyMinutes: 120,
      chapters: [
        { no: 1, title: 'Real Numbers', marksWeight: 6, exercises: 2, keyTopics: ['Fundamental Theorem of Arithmetic', 'Irrationality Proofs'] },
        { no: 2, title: 'Polynomials', marksWeight: 4, exercises: 2, keyTopics: ['Zeroes of Polynomials', 'Relationship between Zeroes & Coefficients'] },
        { no: 3, title: 'Pair of Linear Equations in Two Variables', marksWeight: 6, exercises: 3, keyTopics: ['Substitution & Elimination Methods', 'Consistency of Equations'] },
        { no: 4, title: 'Quadratic Equations', marksWeight: 6, exercises: 3, keyTopics: ['Quadratic Formula', 'Nature of Roots & Discriminant'] },
        { no: 5, title: 'Arithmetic Progressions', marksWeight: 6, exercises: 3, keyTopics: ['nth Term of AP', 'Sum of First n Terms', 'Word Problems'] },
        { no: 6, title: 'Triangles', marksWeight: 10, exercises: 3, keyTopics: ['Basic Proportionality Theorem (Thales)', 'Similarity Criteria (SSS, SAS, AAA)'] },
        { no: 7, title: 'Coordinate Geometry', marksWeight: 6, exercises: 2, keyTopics: ['Distance Formula', 'Section Formula (Internal Division)'] },
        { no: 8, title: 'Introduction to Trigonometry', marksWeight: 8, exercises: 3, keyTopics: ['Trigonometric Ratios & Values (0°, 30°, 45°, 60°, 90°)', 'Trigonometric Identities (sin²θ + cos²θ = 1)'] },
        { no: 9, title: 'Some Applications of Trigonometry', marksWeight: 4, exercises: 1, keyTopics: ['Heights & Distances', 'Angles of Elevation & Depression'] },
        { no: 10, title: 'Circles', marksWeight: 6, exercises: 2, keyTopics: ['Tangent to a Circle Theorem', 'Length of Tangents from External Point'] },
        { no: 11, title: 'Areas Related to Circles', marksWeight: 4, exercises: 1, keyTopics: ['Area of Sector & Segment of a Circle'] },
        { no: 12, title: 'Surface Areas and Volumes', marksWeight: 6, exercises: 2, keyTopics: ['Surface Area & Volume of Combinations of Solids'] },
        { no: 13, title: 'Statistics', marksWeight: 7, exercises: 3, keyTopics: ['Mean (Direct & Assumed Mean)', 'Median & Mode of Grouped Data'] },
        { no: 14, title: 'Probability', marksWeight: 5, exercises: 1, keyTopics: ['Classical Definition of Probability', 'Simple Events & Experiments'] }
      ]
    },

    science: {
      name: 'Science',
      code: '086',
      color: '#10B981',
      icon: '🔬',
      dailyHours: 1.5,
      dailyMinutes: 90,
      sundayHours: 2.0,
      sundayMinutes: 120,
      branches: ['Physics', 'Chemistry', 'Biology'],
      chapters: [
        { no: 1, title: 'Chemical Reactions and Equations', branch: 'Chemistry', marksWeight: 6, keyTopics: ['Types of Reactions', 'Balancing Equations', 'Corrosion & Rancidity'] },
        { no: 2, title: 'Acids, Bases and Salts', branch: 'Chemistry', marksWeight: 6, keyTopics: ['pH Scale & Significance', 'Preparation of Bleaching Powder, Baking Soda, Plaster of Paris'] },
        { no: 3, title: 'Metals and Non-metals', branch: 'Chemistry', marksWeight: 7, keyTopics: ['Reactivity Series', 'Ionic Bonding Properties', 'Corrosion Prevention'] },
        { no: 4, title: 'Carbon and its Compounds', branch: 'Chemistry', marksWeight: 6, keyTopics: ['Covalent Bonding', 'Homologous Series', 'Nomenclature', 'Ethanol & Ethanoic Acid'] },
        { no: 5, title: 'Life Processes', branch: 'Biology', marksWeight: 9, keyTopics: ['Nutrition & Photosynthesis', 'Human Respiration', 'Circulatory System & Heart', 'Excretion in Humans & Plants'] },
        { no: 6, title: 'Control and Coordination', branch: 'Biology', marksWeight: 6, keyTopics: ['Neuron & Reflex Arc', 'Human Brain Anatomy', 'Plant Hormones & Tropic Movements'] },
        { no: 7, title: 'How do Organisms Reproduce?', branch: 'Biology', marksWeight: 7, keyTopics: ['Asexual Reproduction Modes', 'Flower Anatomy', 'Human Reproductive System & Contraception'] },
        { no: 8, title: 'Heredity', branch: 'Biology', marksWeight: 4, keyTopics: ["Mendel's Laws (Monohybrid & Dihybrid)", 'Sex Determination in Humans'] },
        { no: 9, title: 'Light – Reflection and Refraction', branch: 'Physics', marksWeight: 10, keyTopics: ['Mirror & Lens Formulas', 'Ray Diagrams', 'Refractive Index', 'Power of Lens'] },
        { no: 10, title: 'The Human Eye and the Colourful World', branch: 'Physics', marksWeight: 5, keyTopics: ['Defects of Vision (Myopia, Hypermetropia)', 'Dispersion of Light', 'Atmospheric Refraction', 'Scattering & Tyndall Effect'] },
        { no: 11, title: 'Electricity', branch: 'Physics', marksWeight: 7, keyTopics: ["Ohm's Law", 'Resistance in Series & Parallel', "Joule's Law of Heating", 'Electric Power & Commercial Unit'] },
        { no: 12, title: 'Magnetic Effects of Electric Current', branch: 'Physics', marksWeight: 6, keyTopics: ['Magnetic Field Lines', "Right-Hand Thumb Rule", 'Solenoid', "Fleming's Left-Hand Rule"] },
        { no: 13, title: 'Our Environment', branch: 'Biology', marksWeight: 5, keyTopics: ['Ecosystem & Food Chains', '10% Energy Flow Law', 'Ozone Layer Depletion & Waste Management'] }
      ]
    },

    sst: {
      name: 'Social Science',
      code: '087',
      color: '#F59E0B',
      icon: '🌍',
      dailyHours: 1.0,
      dailyMinutes: 60,
      sundayHours: 1.5,
      sundayMinutes: 90,
      books: [
        {
          bookName: 'History: India and the Contemporary World - II',
          chapters: [
            { no: 1, title: 'The Rise of Nationalism in Europe', marksWeight: 6, keyTopics: ['French Revolution & Napoleon Code', 'Unification of Germany & Italy', 'Visualising the Nation'] },
            { no: 2, title: 'Nationalism in India', marksWeight: 7, keyTopics: ['Non-Cooperation Movement', 'Civil Disobedience Movement', 'Sense of Collective Belonging', 'Map Work'] },
            { no: 3, title: 'The Making of a Global World', marksWeight: 3, keyTopics: ['Pre-modern world (Silk Routes, Disease & Conquest)'] },
            { no: 4, title: 'Print Culture and the Modern World', marksWeight: 4, keyTopics: ['First Printed Books', 'Print Revolution & Reformation', 'Print in India'] }
          ]
        },
        {
          bookName: 'Geography: Contemporary India - II',
          chapters: [
            { no: 5, title: 'Resources and Development', marksWeight: 4, keyTopics: ['Resource Planning in India', 'Soil Types & Conservation'] },
            { no: 6, title: 'Forest and Wildlife Resources', marksWeight: 2, keyTopics: ['Biodiversity in India', 'Community Conservation Efforts'] },
            { no: 7, title: 'Water Resources', marksWeight: 3, keyTopics: ['Multi-purpose River Valley Projects', 'Rainwater Harvesting Techniques'] },
            { no: 8, title: 'Agriculture', marksWeight: 5, keyTopics: ['Cropping Seasons (Rabi, Kharif, Zaid)', 'Major Food & Cash Crops', 'Institutional Reforms'] },
            { no: 9, title: 'Minerals and Energy Resources', marksWeight: 4, keyTopics: ['Ferrous & Non-ferrous Minerals', 'Conventional & Non-conventional Energy Sources'] },
            { no: 10, title: 'Manufacturing Industries', marksWeight: 4, keyTopics: ['Agro-based vs Mineral-based Industries', 'Industrial Pollution & Environmental Degradation'] },
            { no: 11, title: 'Lifelines of National Economy (Map Work Only)', marksWeight: 2, keyTopics: ['Major Sea Ports', 'International Airports of India'] }
          ]
        },
        {
          bookName: 'Political Science: Democratic Politics - II',
          chapters: [
            { no: 12, title: 'Power Sharing', marksWeight: 5, keyTopics: ['Belgium & Sri Lanka Case Studies', 'Forms of Power Sharing in Democracy'] },
            { no: 13, title: 'Federalism', marksWeight: 5, keyTopics: ['What makes India a Federal Country?', 'Decentralisation & Panchayati Raj'] },
            { no: 14, title: 'Gender, Religion and Caste', marksWeight: 4, keyTopics: ['Feminist Movements', 'Communalism & Secular State', 'Caste in Politics'] },
            { no: 15, title: 'Political Parties', marksWeight: 5, keyTopics: ['Need for Political Parties', 'National vs State Parties', 'Challenges & Reforms'] },
            { no: 16, title: 'Outcomes of Democracy', marksWeight: 3, keyTopics: ['Accountable, Responsive & Legitimate Government', 'Economic Growth vs Reduction of Inequality'] }
          ]
        },
        {
          bookName: 'Economics: Understanding Economic Development',
          chapters: [
            { no: 17, title: 'Development', marksWeight: 5, keyTopics: ['Developmental Goals & Indicators', 'Per Capita Income vs HDI', 'Sustainability'] },
            { no: 18, title: 'Sectors of the Indian Economy', marksWeight: 5, keyTopics: ['Primary, Secondary & Tertiary Sectors', 'Organised vs Unorganised', 'Disguised Unemployment'] },
            { no: 19, title: 'Money and Credit', marksWeight: 6, keyTopics: ['Formal vs Informal Credit', 'Role of RBI', 'Self Help Groups (SHGs)'] },
            { no: 20, title: 'Globalisation and the Indian Economy', marksWeight: 4, keyTopics: ['Production across Countries (MNCs)', 'Foreign Trade & WTO', 'Impact on Indian Producers'] }
          ]
        }
      ]
    },

    english: {
      name: 'English (Language & Literature)',
      code: '184',
      color: '#EC4899',
      icon: '📖',
      dailyHours: 0.5,
      dailyMinutes: 30,
      assignedDays: ['Monday', 'Wednesday', 'Friday'],
      books: [
        {
          bookName: 'First Flight (Prose & Poetry)',
          units: [
            'A Letter to God & Dust of Snow / Fire and Ice',
            'Nelson Mandela: Long Walk to Freedom & A Tiger in the Zoo',
            'Two Stories About Flying & How to Tell Wild Animals',
            'From the Diary of Anne Frank & The Ball Poem',
            'Glimpses of India & Amanda!',
            'Mijbil the Otter & The Trees',
            'Madam Rides the Bus & Fog',
            'The Sermon at Benares & The Tale of Custard the Dragon',
            'The Proposal (One Act Play) & For Anne Gregory'
          ]
        },
        {
          bookName: 'Footprints Without Feet (Supplementary)',
          units: [
            'A Triumph of Surgery',
            "The Thief's Story",
            'The Midnight Visitor',
            'A Question of Trust',
            'Footprints Without Feet',
            'The Making of a Scientist',
            'The Necklace',
            'Bholi',
            'The Book That Saved the Earth'
          ]
        },
        {
          bookName: 'Grammar & Writing Skills',
          units: [
            'Formal Letter Writing (Editor / Complaint / Placing Order)',
            'Analytical Paragraph Writing based on Chart / Graph / Cue',
            'Tenses, Modals & Subject-Verb Concord',
            'Reported Speech (Commands, Requests, Statements, Questions)'
          ]
        }
      ]
    },

    hindiA: {
      name: 'Hindi Course A',
      code: '002',
      color: '#F43F5E',
      icon: '🪔',
      dailyHours: 0.5,
      dailyMinutes: 30,
      assignedDays: ['Tuesday', 'Thursday', 'Saturday'],
      books: [
        {
          bookName: 'क्षितिज भाग-2 (Kshitij Part 2)',
          units: [
            'सूरदास के पद',
            'राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)',
            'आत्मकथ्य (जयशंकर प्रसाद)',
            'उत्साह एवं अट नहीं रही है (सूर्यकांत त्रिपाठी निराला)',
            'यह दंतुरित मुस्कान एवं फसल (नागार्जुन)',
            'संगतकार (मंगलेश डबराल)',
            'नेताजी का चश्मा (स्वयं प्रकाश)',
            'बालगोबिन भगत (रामवृक्ष बेनीपुरी)',
            'लखनवी अंदाज़ (यशपाल)',
            'एक कहानी यह भी (मन्नू भंडारी)',
            'नौबतखाने में इबादत (यतींद्र मिश्र)',
            'संस्कृति (भदंत आनंद कौसल्यायन)'
          ]
        },
        {
          bookName: 'कृतिका भाग-2 (Kritika Part 2)',
          units: [
            'माता का अँचल (शिवपूजन सहाय)',
            'साना-साना हाथ जोड़ि... (मधु कांकरिया)',
            'मैं क्यों लिखता हूँ? (अज्ञेय)'
          ]
        },
        {
          bookName: 'व्याकरण एवं लेखन (Grammar & Writing)',
          units: [
            'रचना के आधार पर वाक्य भेद',
            'वाच्य एवं पद परिचय',
            'अलंकार (अनुप्रास, श्लेष, उपमा, रूपक, उत्प्रेक्षा, अतिशयोक्ति)',
            'अनुच्छेद लेखन, पत्र लेखन, ई-मेल लेखन, विज्ञापन लेखन'
          ]
        }
      ]
    },

    hindiB: {
      name: 'Hindi Course B',
      code: '085',
      color: '#F43F5E',
      icon: '🪔',
      dailyHours: 0.5,
      dailyMinutes: 30,
      assignedDays: ['Tuesday', 'Thursday', 'Saturday'],
      books: [
        {
          bookName: 'स्पर्श भाग-2 (Sparsh Part 2)',
          units: [
            'साखी (कबीर)',
            'पद (मीरा)',
            'मनुष्यता (मैथिलीशरण गुप्त)',
            'पर्वत प्रदेश में पावस (सुमित्रानंदन पंत)',
            'तोप (वीरेन डंगवाल)',
            'कर चले हम फ़िदा (कैफ़ी आज़मी)',
            'आत्मत्राण (रवींद्रनाथ ठाकुर)',
            'बड़े भाई साहब (प्रेमचंद)',
            'डायरी का एक पन्ना (सीताराम सेकसरिया)',
            'तँतारा-वामीरो कथा (लीलाधर मंडलोई)',
            'तीसरी कसम के शिल्पकार शैलेंद्र (प्रहलाद अग्रवाल)',
            'अब कहाँ दूसरे के दुख से दुखी होने वाले (निदा फ़ाज़ली)',
            'पतझर में टूटी पत्तियाँ (रवींद्र केलेकर)',
            'कारतूस (हबीब तनवीर)'
          ]
        },
        {
          bookName: 'संचयन भाग-2 (Sanchayan Part 2)',
          units: [
            'हरिहर काका (मिथिलेश्वर)',
            'सपनों के-से दिन (गुरदयाल सिंह)',
            'टोपी शुक्ला (राही मासूम रज़ा)'
          ]
        },
        {
          bookName: 'व्याकरण एवं रचनात्मक लेखन',
          units: [
            'पदबंध एवं रचना के आधार पर वाक्य रूपांतरण',
            'समास एवं मुहावरे',
            'अनुच्छेद, औपचारिक पत्र, सूचना लेखन, विज्ञापन एवं लघुकथा लेखन'
          ]
        }
      ]
    },

    ai417: {
      name: 'Artificial Intelligence (Subject Code 417)',
      code: '417',
      color: '#8B5CF6',
      icon: '🤖',
      sundayHours: 0.5,
      sundayMinutes: 30,
      totalSundays: 13,
      chapters: [
        { week: 1, part: 'Part A', unit: 'Unit 1: Communication Skills-II', keyFocus: 'Verbal, Non-Verbal, Writing Sentences & Parts of Speech' },
        { week: 2, part: 'Part A', unit: 'Unit 2: Self-Management Skills-II', keyFocus: 'Stress Management, Independent Working, Goal Setting' },
        { week: 3, part: 'Part A', unit: 'Unit 3: ICT Skills-II', keyFocus: 'Operating System, File Management, Cyber Security Basics' },
        { week: 4, part: 'Part A', unit: 'Unit 4: Entrepreneurial Skills-II', keyFocus: 'Characteristics & Myths of Entrepreneurship' },
        { week: 5, part: 'Part A', unit: 'Unit 5: Green Skills-II', keyFocus: 'Sustainable Development Goals (SDGs) & Green Economy' },
        { week: 6, part: 'Part B', unit: 'Unit 1: Introduction to AI & Ethical Frameworks', keyFocus: 'AI Domains, Ethical Concerns (Bias, Privacy), Smart Cities' },
        { week: 7, part: 'Part B', unit: 'Unit 2: AI Project Cycle', keyFocus: 'Problem Scoping, Data Acquisition, Data Exploration, Modeling, Evaluation' },
        { week: 8, part: 'Part B', unit: 'Unit 3: Advance Python Basics for AI', keyFocus: 'Lists, Tuples, Dictionaries, Loops, Math & Random Modules' },
        { week: 9, part: 'Part B', unit: 'Unit 4: Data Science & Statistical Data', keyFocus: 'Data Visualisation, NumPy & Matplotlib Basics' },
        { week: 10, part: 'Part B', unit: 'Unit 5: Computer Vision (CV)', keyFocus: 'Pixel, Resolution, Grayscale vs RGB, Applications of CV' },
        { week: 11, part: 'Part B', unit: 'Unit 6: Natural Language Processing (NLP)', keyFocus: 'Text Normalisation, Tokenisation, Stemming, Bag of Words, TF-IDF' },
        { week: 12, part: 'Part B', unit: 'Unit 7: Evaluation & Confusion Matrix', keyFocus: 'Accuracy, Precision, Recall, F1 Score Calculations' },
        { week: 13, part: 'Part A+B', unit: 'Unit 8: Complete CBSE Sample Paper Marathon', keyFocus: '50-Mark Official CBSE 2026-27 Sample Paper Simulation' }
      ]
    }
  },

  /**
   * Returns complete flat array of chapters for easy progress tracking
   */
  getAllChapters(secondLanguageType = 'Hindi Course A') {
    const list = [];

    // Maths
    this.subjects.maths.chapters.forEach(c => {
      list.push({
        id: `maths_${c.no}`,
        subject: 'Maths',
        chapterNumber: c.no,
        chapterName: c.title,
        color: this.subjects.maths.color,
        icon: this.subjects.maths.icon
      });
    });

    // Science
    this.subjects.science.chapters.forEach(c => {
      list.push({
        id: `science_${c.no}`,
        subject: 'Science',
        chapterNumber: c.no,
        chapterName: c.title,
        color: this.subjects.science.color,
        icon: this.subjects.science.icon
      });
    });

    // Social Science
    let sstCount = 1;
    this.subjects.sst.books.forEach(b => {
      b.chapters.forEach(c => {
        list.push({
          id: `sst_${sstCount++}`,
          subject: 'SST',
          chapterNumber: c.no,
          chapterName: `${c.title} (${b.bookName.split(':')[0]})`,
          color: this.subjects.sst.color,
          icon: this.subjects.sst.icon
        });
      });
    });

    // English
    let engCount = 1;
    this.subjects.english.books.forEach(b => {
      b.units.forEach(u => {
        list.push({
          id: `english_${engCount++}`,
          subject: 'English',
          chapterNumber: engCount - 1,
          chapterName: `${u} (${b.bookName.split(' ')[0]})`,
          color: this.subjects.english.color,
          icon: this.subjects.english.icon
        });
      });
    });

    // Hindi (Course A or B)
    const hindiObj = secondLanguageType === 'Hindi Course B' ? this.subjects.hindiB : this.subjects.hindiA;
    let hinCount = 1;
    hindiObj.books.forEach(b => {
      b.units.forEach(u => {
        list.push({
          id: `hindi_${hinCount++}`,
          subject: 'Hindi',
          chapterNumber: hinCount - 1,
          chapterName: `${u} (${b.bookName.split(' ')[0]})`,
          color: hindiObj.color,
          icon: hindiObj.icon
        });
      });
    });

    // AI
    this.subjects.ai417.chapters.forEach(c => {
      list.push({
        id: `ai_${c.week}`,
        subject: 'AI',
        chapterNumber: c.week,
        chapterName: `${c.unit} [Week ${c.week}]`,
        color: this.subjects.ai417.color,
        icon: this.subjects.ai417.icon
      });
    });

    return list;
  }
};

if (typeof window !== 'undefined') {
  window.GURU_SYLLABUS = GURU_SYLLABUS;
  window.CBSE_CLASS_10_SYLLABUS = GURU_SYLLABUS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GURU_SYLLABUS;
}
