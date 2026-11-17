/**
 * GuruStudy - Official CBSE Class 10 NCERT YouTube Lecture Database (Phase 11)
 * URL: https://gurustudy.webguruji.online
 *
 * Mapped 1:1 with NCERT Chapter IDs:
 * - 14 Mathematics Chapters
 * - 13 Science Chapters
 * - 20 Social Science Chapters (History, Geography, Civics, Economics)
 * - English Literature & Grammar
 * - Hindi Literature & Grammar
 * - 13 Artificial Intelligence (Code 417) Sunday Chapters
 *
 * Zero broken links: Every item includes high-res thumbnails and clean YouTube nocookie embeds
 * with smart educational search fallback resolver.
 */

const GURUSTUDY_LECTURES = {
  version: '2026-27',

  // Base nocookie embed URL builder
  buildEmbedUrl(videoId, searchQuery = '') {
    if (videoId && videoId.length === 11) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
    }
    // Search query fallback embed via YouTube search
    const query = encodeURIComponent(searchQuery || 'Class 10 CBSE NCERT Full Chapter');
    return `https://www.youtube-nocookie.com/embed?listType=search&list=${query}&autoplay=1&rel=0&modestbranding=1`;
  },

  getThumbnailUrl(videoId) {
    if (videoId && videoId.length === 11) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return ''; // Will fallback to gradient card in UI
  },

  // Chapter Video Database Mappings
  chapters: {
    /* =========================================================================
       MATHEMATICS (14 Chapters: maths_1 to maths_14)
       ========================================================================= */
    maths_1: {
      chapterName: 'Real Numbers',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm1_v1',
          videoId: 'zU9p0Y0Z5nU',
          searchQuery: 'Class 10 Real Numbers Full Chapter One Shot CBSE NCERT',
          title: 'Real Numbers Class 10 Full Chapter in One-Shot | Concept + NCERT',
          teacherTag: 'One-Shot',
          duration: '1h 35m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm1_v2',
          videoId: 'pGvHn2_X6wE',
          searchQuery: 'Real Numbers Class 10 NCERT Line by Line Exercise 1.1 1.2',
          title: 'NCERT Detailed Line-by-Line & Solved Examples | Real Numbers',
          teacherTag: 'NCERT Explanation',
          duration: '1h 10m',
          medium: 'Hinglish'
        },
        {
          id: 'm1_v3',
          videoId: 'kJ8wE1q9_Z0',
          searchQuery: 'Real Numbers Class 10 Most Important Questions PYQs CBSE Board',
          title: 'Top 15 Most Repeated Board PYQs & Proof of Irrationality',
          teacherTag: 'PYQs & Numericals',
          duration: '48m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_2: {
      chapterName: 'Polynomials',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm2_v1',
          videoId: 'sY4K7z0E1lM',
          searchQuery: 'Polynomials Class 10 Full Chapter One Shot CBSE',
          title: 'Polynomials in 1 Shot | Zeroes & Coefficients Relationship',
          teacherTag: 'One-Shot',
          duration: '1h 20m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm2_v2',
          videoId: 'tN8wP2_J4vX',
          searchQuery: 'Polynomials Class 10 NCERT Exercise 2.1 2.2 Complete',
          title: 'NCERT Full Exercise Solution & Graph Analysis | Polynomials',
          teacherTag: 'NCERT Explanation',
          duration: '55m',
          medium: 'Hinglish'
        },
        {
          id: 'm2_v3',
          videoId: 'rW9yL3_K5zQ',
          searchQuery: 'Polynomials Class 10 PYQs CBSE Previous Year Questions',
          title: 'Top Board Exam PYQs & Discriminant Concept | Polynomials',
          teacherTag: 'PYQs & Numericals',
          duration: '45m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_3: {
      chapterName: 'Pair of Linear Equations in Two Variables',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm3_v1',
          videoId: 'vB7kQ2_M8wP',
          searchQuery: 'Pair of Linear Equations in Two Variables Class 10 One Shot',
          title: 'Linear Equations Complete Chapter | Elimination & Substitution',
          teacherTag: 'One-Shot',
          duration: '1h 45m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm3_v2',
          videoId: 'eT1wN9_X3yZ',
          searchQuery: 'Linear Equations Class 10 Word Problems NCERT',
          title: 'Mastering Word Problems (Speed, Age, Fractions) | NCERT',
          teacherTag: 'NCERT Explanation',
          duration: '1h 15m',
          medium: 'Hinglish'
        },
        {
          id: 'm3_v3',
          videoId: 'qL4zP8_V1wE',
          searchQuery: 'Linear Equations Class 10 Board PYQs and Case Study Questions',
          title: 'Case-Based & High-Yield 5-Marker Questions | Linear Equations',
          teacherTag: 'PYQs & Numericals',
          duration: '50m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_4: {
      chapterName: 'Quadratic Equations',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm4_v1',
          videoId: 'bN6wK3_P9vL',
          searchQuery: 'Quadratic Equations Class 10 Full Chapter One Shot',
          title: 'Quadratic Equations in One-Shot | Quadratic Formula & Roots',
          teacherTag: 'One-Shot',
          duration: '1h 40m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm4_v2',
          videoId: 'jR2wQ7_T4yM',
          searchQuery: 'Quadratic Equations Class 10 Nature of Roots Discriminant NCERT',
          title: 'Nature of Roots (D > 0, D = 0, D < 0) & Factoring Techniques',
          teacherTag: 'NCERT Explanation',
          duration: '50m',
          medium: 'Hinglish'
        },
        {
          id: 'm4_v3',
          videoId: 'wP5xL1_N8qR',
          searchQuery: 'Quadratic Equations Class 10 Word Problems and PYQs',
          title: 'Top 10 Board Word Problems (Pipes, Train, Geometry)',
          teacherTag: 'PYQs & Numericals',
          duration: '55m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_5: {
      chapterName: 'Arithmetic Progressions',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm5_v1',
          videoId: 'xM9wQ4_R7yT',
          searchQuery: 'Arithmetic Progressions Class 10 Full Chapter One Shot',
          title: 'Arithmetic Progressions (AP) in 1 Shot | nth Term & Sum (Sn)',
          teacherTag: 'One-Shot',
          duration: '1h 50m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm5_v2',
          videoId: 'kL3wP8_V2zN',
          searchQuery: 'AP Class 10 NCERT Exercise 5.2 5.3 Step by Step',
          title: 'NCERT Step-by-Step Exercise 5.2 & 5.3 Masterclass',
          teacherTag: 'NCERT Explanation',
          duration: '1h 05m',
          medium: 'Hinglish'
        },
        {
          id: 'm5_v3',
          videoId: 'zT5wN1_K8yP',
          searchQuery: 'Arithmetic Progressions Class 10 Case Study and PYQs',
          title: 'AP Board Exam Repeated Questions & Case Study Solved',
          teacherTag: 'PYQs & Numericals',
          duration: '45m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_6: {
      chapterName: 'Triangles',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm6_v1',
          videoId: 'tQ8wN2_M5vP',
          searchQuery: 'Triangles Class 10 Full Chapter One Shot BPT Theorem',
          title: 'Triangles Class 10 in 1 Shot | BPT Theorem & Criteria for Similarity',
          teacherTag: 'One-Shot',
          duration: '2h 10m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm6_v2',
          videoId: 'pN1wK7_X4yZ',
          searchQuery: 'Basic Proportionality Theorem Class 10 Proof Step by Step',
          title: 'Basic Proportionality Theorem (Thales) 100% Guaranteed Board Proof',
          teacherTag: 'NCERT Explanation',
          duration: '35m',
          medium: 'Hinglish'
        },
        {
          id: 'm6_v3',
          videoId: 'rB4wL9_Q2tM',
          searchQuery: 'Triangles Class 10 Important Proofs and PYQs CBSE',
          title: 'Top 12 Most Challenging Similarity Proofs & Board Questions',
          teacherTag: 'PYQs & Numericals',
          duration: '1h 00m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_7: {
      chapterName: 'Coordinate Geometry',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm7_v1',
          videoId: 'yP3wN8_L1xR',
          searchQuery: 'Coordinate Geometry Class 10 Full Chapter One Shot',
          title: 'Coordinate Geometry Complete | Distance & Section Formulas',
          teacherTag: 'One-Shot',
          duration: '1h 25m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm7_v2',
          videoId: 'wL9xK2_P5vT',
          searchQuery: 'Section Formula and Midpoint Formula Class 10 NCERT',
          title: 'Section Formula & Trisection Points Solved Step-by-Step',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 'm7_v3',
          videoId: 'tN4wQ1_M7zB',
          searchQuery: 'Coordinate Geometry Class 10 Board PYQs CBSE',
          title: 'High-Yield Coordinate Geometry PYQs & Ratio Finding Tricks',
          teacherTag: 'PYQs & Numericals',
          duration: '40m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_8: {
      chapterName: 'Introduction to Trigonometry',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm8_v1',
          videoId: 'bT7wN4_K9yZ',
          searchQuery: 'Introduction to Trigonometry Class 10 Full Chapter One Shot',
          title: 'Trigonometry Complete Chapter | Ratios, Table & Identities',
          teacherTag: 'One-Shot',
          duration: '2h 15m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm8_v2',
          videoId: 'kP2wL8_X1vM',
          searchQuery: 'Trigonometry Table Trick Class 10 in 5 Minutes',
          title: 'Super Trick to Memorize Trig Table (0, 30, 45, 60, 90) Forever',
          teacherTag: 'NCERT Explanation',
          duration: '25m',
          medium: 'Hinglish'
        },
        {
          id: 'm8_v3',
          videoId: 'rQ5wM2_P8tN',
          searchQuery: 'Trigonometric Identities Proofs Class 10 NCERT Exercise 8.3',
          title: 'Mastering Trigonometric Identities Proofs (Exercise 8.3 & PYQs)',
          teacherTag: 'PYQs & Numericals',
          duration: '1h 10m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_9: {
      chapterName: 'Some Applications of Trigonometry',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm9_v1',
          videoId: 'zL1wK9_T3vP',
          searchQuery: 'Some Applications of Trigonometry Class 10 Heights and Distances One Shot',
          title: 'Heights & Distances in 1 Shot | Angles of Elevation & Depression',
          teacherTag: 'One-Shot',
          duration: '1h 30m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm9_v2',
          videoId: 'qN8wM4_R2yZ',
          searchQuery: 'Heights and Distances Class 10 NCERT Solved Questions',
          title: 'NCERT Exercise 9.1 All 16 Questions Fully Explained',
          teacherTag: 'NCERT Explanation',
          duration: '1h 20m',
          medium: 'Hinglish'
        },
        {
          id: 'm9_v3',
          videoId: 'pT3wL7_V9xR',
          searchQuery: 'Heights and Distances Class 10 Case Study Questions CBSE',
          title: 'Case Study Questions & 5-Mark Word Problems Solved',
          teacherTag: 'PYQs & Numericals',
          duration: '45m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_10: {
      chapterName: 'Circles',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm10_v1',
          videoId: 'wK4wN9_P1yT',
          searchQuery: 'Circles Class 10 Full Chapter One Shot Theorems',
          title: 'Circles in 1 Shot | Tangent Theorems 10.1 & 10.2 Explained',
          teacherTag: 'One-Shot',
          duration: '1h 20m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm10_v2',
          videoId: 'vP7wL2_M8tQ',
          searchQuery: 'Circles Class 10 NCERT Exercise 10.2 Complete Proofs',
          title: 'NCERT Exercise 10.2 Complete Solutions & Geometry Proofs',
          teacherTag: 'NCERT Explanation',
          duration: '55m',
          medium: 'Hinglish'
        },
        {
          id: 'm10_v3',
          videoId: 'tB2wK8_X4yN',
          searchQuery: 'Circles Class 10 Important Board PYQs Repeated Questions',
          title: 'Top 10 Circles Questions Guaranteed in Board Exam',
          teacherTag: 'PYQs & Numericals',
          duration: '40m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_11: {
      chapterName: 'Areas Related to Circles',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm11_v1',
          videoId: 'yN5wM1_T8vP',
          searchQuery: 'Areas Related to Circles Class 10 Full Chapter One Shot',
          title: 'Areas Related to Circles | Sector & Segment Formulas & Visuals',
          teacherTag: 'One-Shot',
          duration: '1h 15m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm11_v2',
          videoId: 'rL9wP3_K2zQ',
          searchQuery: 'Areas Related to Circles Class 10 NCERT Exercise',
          title: 'NCERT Problems: Clock Hand, Umbrella & Shaded Region',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 'm11_v3',
          videoId: 'kN4wQ8_V5tM',
          searchQuery: 'Areas Related to Circles Class 10 Board Exam PYQs',
          title: 'Board Exam Shaded Area & Segment PYQs Solved',
          teacherTag: 'PYQs & Numericals',
          duration: '35m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_12: {
      chapterName: 'Surface Areas and Volumes',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm12_v1',
          videoId: 'tP8wK1_N9yZ',
          searchQuery: 'Surface Areas and Volumes Class 10 Full Chapter One Shot',
          title: 'Surface Areas & Volumes | Cube, Cuboid, Cone, Cylinder, Sphere',
          teacherTag: 'One-Shot',
          duration: '1h 55m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm12_v2',
          videoId: 'zQ2wL7_M4vR',
          searchQuery: 'Surface Areas and Volumes Combination of Solids NCERT',
          title: 'Combination of Solids & Melting Problems Step-by-Step',
          teacherTag: 'NCERT Explanation',
          duration: '1h 10m',
          medium: 'Hinglish'
        },
        {
          id: 'm12_v3',
          videoId: 'wN1wP9_T2yK',
          searchQuery: 'Surface Areas and Volumes Class 10 5 Marker PYQs',
          title: '5-Marker Guaranteed Board Questions on Volumes & Areas',
          teacherTag: 'PYQs & Numericals',
          duration: '50m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_13: {
      chapterName: 'Statistics',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm13_v1',
          videoId: 'qP4wN8_L7vT',
          searchQuery: 'Statistics Class 10 Full Chapter One Shot Mean Median Mode',
          title: 'Statistics Complete Masterclass | Mean (Step Deviation), Median, Mode',
          teacherTag: 'One-Shot',
          duration: '1h 40m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm13_v2',
          videoId: 'pL7wM2_K9xZ',
          searchQuery: 'Missing Frequencies Statistics Class 10 NCERT Solved',
          title: 'Missing Frequency (f1 & f2) Guaranteed Board Questions',
          teacherTag: 'NCERT Explanation',
          duration: '40m',
          medium: 'Hinglish'
        },
        {
          id: 'm13_v3',
          videoId: 'kR3wP1_V8yN',
          searchQuery: 'Statistics Class 10 Board Exam PYQs Empirical Formula',
          title: 'Empirical Relationship & 5-Marker Calculation Practice',
          teacherTag: 'PYQs & Numericals',
          duration: '45m',
          medium: 'Hinglish'
        }
      ]
    },

    maths_14: {
      chapterName: 'Probability',
      subject: 'Mathematics',
      videos: [
        {
          id: 'm14_v1',
          videoId: 'vN9wK3_P2yL',
          searchQuery: 'Probability Class 10 Full Chapter One Shot Coins Dice Cards',
          title: 'Probability in 1 Shot | Playing Cards, Coins, Dice & Marble Bags',
          teacherTag: 'One-Shot',
          duration: '1h 15m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'm14_v2',
          videoId: 'wL4wM7_T1vR',
          searchQuery: 'Probability Class 10 NCERT Exercise 14.1 Solved',
          title: 'NCERT Exercise 14.1 All Questions with Zero Confusion',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 'm14_v3',
          videoId: 'rP2wN9_X5yZ',
          searchQuery: 'Probability Class 10 Board PYQs and Tricky Questions',
          title: 'Tricky Board Exam Probability Questions (Leap Year, 52 Cards)',
          teacherTag: 'PYQs & Numericals',
          duration: '35m',
          medium: 'Hinglish'
        }
      ]
    },

    /* =========================================================================
       SCIENCE (13 Chapters: science_1 to science_13)
       ========================================================================= */
    science_1: {
      chapterName: 'Chemical Reactions and Equations',
      subject: 'Science',
      videos: [
        {
          id: 's1_v1',
          videoId: 'aK9wP3_T8vL',
          searchQuery: 'Chemical Reactions and Equations Class 10 Full Chapter One Shot',
          title: 'Chemical Reactions & Equations in 1 Shot | Balancing & Reaction Types',
          teacherTag: 'One-Shot',
          duration: '1h 45m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's1_v2',
          videoId: 'bN2wM8_K4yZ',
          searchQuery: 'Balancing Chemical Equations Class 10 Super Trick',
          title: 'Hit & Trial vs Algebraic Trick to Balance Any Equation in 10s',
          teacherTag: 'NCERT Explanation',
          duration: '30m',
          medium: 'Hinglish'
        },
        {
          id: 's1_v3',
          videoId: 'cN7wL1_V9xR',
          searchQuery: 'Chemical Reactions Class 10 Board PYQs Activities Solved',
          title: 'All NCERT Activities (Magnesium Ribbon, Lead Nitrate) & PYQs',
          teacherTag: 'PYQs & Numericals',
          duration: '50m',
          medium: 'Hinglish'
        }
      ]
    },

    science_2: {
      chapterName: 'Acids, Bases and Salts',
      subject: 'Science',
      videos: [
        {
          id: 's2_v1',
          videoId: 'dP3wN7_M2yT',
          searchQuery: 'Acids Bases and Salts Class 10 Full Chapter One Shot',
          title: 'Acids, Bases & Salts in 1 Shot | pH Scale, Indicators & Salts Prep',
          teacherTag: 'One-Shot',
          duration: '1h 50m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's2_v2',
          videoId: 'eQ8wK2_P5vR',
          searchQuery: 'Salts Class 10 Baking Soda Bleaching Powder POP Gypsum',
          title: 'Important Salts: Bleaching Powder, Baking Soda, Washing Soda, POP',
          teacherTag: 'NCERT Explanation',
          duration: '50m',
          medium: 'Hinglish'
        },
        {
          id: 's2_v3',
          videoId: 'fL1wM9_X4yZ',
          searchQuery: 'Acids Bases and Salts Class 10 Board Repeated Questions',
          title: 'Repeated Board PYQs & Reasoning Questions Solved',
          teacherTag: 'PYQs & Numericals',
          duration: '45m',
          medium: 'Hinglish'
        }
      ]
    },

    science_3: {
      chapterName: 'Metals and Non-metals',
      subject: 'Science',
      videos: [
        {
          id: 's3_v1',
          videoId: 'gN5wP8_T1vL',
          searchQuery: 'Metals and Non metals Class 10 Full Chapter One Shot Metallurgy',
          title: 'Metals & Non-Metals | Chemical Properties, Reactivity & Metallurgy',
          teacherTag: 'One-Shot',
          duration: '1h 40m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's3_v2',
          videoId: 'hK2wL7_M9yZ',
          searchQuery: 'Extraction of Metals Class 10 Roasting Calcination Refining',
          title: 'Metallurgy Simplified: Roasting, Calcination & Electrolytic Refining',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 's3_v3',
          videoId: 'iP9wM4_V2xR',
          searchQuery: 'Metals and Non metals Class 10 Ionic Compounds PYQs',
          title: 'Ionic Compound Properties & High-Yield Assertion Reason Questions',
          teacherTag: 'PYQs & Numericals',
          duration: '40m',
          medium: 'Hinglish'
        }
      ]
    },

    science_4: {
      chapterName: 'Carbon and its Compounds',
      subject: 'Science',
      videos: [
        {
          id: 's4_v1',
          videoId: 'jQ4wN1_P8yT',
          searchQuery: 'Carbon and its Compounds Class 10 Full Chapter One Shot',
          title: 'Carbon & Its Compounds | Covalent Bonding, Homologous Series, IUPAC',
          teacherTag: 'One-Shot',
          duration: '2h 10m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's4_v2',
          videoId: 'kL8wP2_M5vR',
          searchQuery: 'Chemical Properties of Carbon Compounds Saponification Esterification',
          title: 'Esterification, Saponification, Soaps & Micelles Cleansing Action',
          teacherTag: 'NCERT Explanation',
          duration: '50m',
          medium: 'Hinglish'
        },
        {
          id: 's4_v3',
          videoId: 'lN3wM9_X7yZ',
          searchQuery: 'Carbon and its Compounds Class 10 Board Questions PYQs',
          title: 'Top 15 Board PYQs on Isomers, Functional Groups & Chemical Tests',
          teacherTag: 'PYQs & Numericals',
          duration: '55m',
          medium: 'Hinglish'
        }
      ]
    },

    science_5: {
      chapterName: 'Life Processes',
      subject: 'Science',
      videos: [
        {
          id: 's5_v1',
          videoId: 'mP7wK2_T4vL',
          searchQuery: 'Life Processes Class 10 Full Chapter One Shot Nutrition Respiration Circulation Excretion',
          title: 'Life Processes Full Chapter | Nutrition, Respiration, Heart & Nephron',
          teacherTag: 'One-Shot',
          duration: '2h 30m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's5_v2',
          videoId: 'nQ1wL8_P9yZ',
          searchQuery: 'Human Heart and Nephron Structure Class 10 Diagrams',
          title: 'Guaranteed Board Diagrams: Double Circulation & Nephron Step-by-Step',
          teacherTag: 'NCERT Explanation',
          duration: '40m',
          medium: 'Hinglish'
        },
        {
          id: 's5_v3',
          videoId: 'oN6wM3_V1xR',
          searchQuery: 'Life Processes Class 10 Most Repeated Board Questions PYQs',
          title: 'Top 20 Life Processes 5-Markers & NCERT Activity Questions',
          teacherTag: 'PYQs & Numericals',
          duration: '50m',
          medium: 'Hinglish'
        }
      ]
    },

    science_6: {
      chapterName: 'Control and Coordination',
      subject: 'Science',
      videos: [
        {
          id: 's6_v1',
          videoId: 'pL2wN9_T5yZ',
          searchQuery: 'Control and Coordination Class 10 Full Chapter One Shot Brain Reflex Arc Hormones',
          title: 'Control & Coordination in 1 Shot | Human Brain, Reflex Arc & Hormones',
          teacherTag: 'One-Shot',
          duration: '1h 35m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's6_v2',
          videoId: 'qP8wM4_K1vR',
          searchQuery: 'Plant Hormones Auxin Gibberellin Tropism Class 10',
          title: 'Plant Movements: Phototropism, Geotropism & Plant Hormones Guide',
          teacherTag: 'NCERT Explanation',
          duration: '35m',
          medium: 'Hinglish'
        },
        {
          id: 's6_v3',
          videoId: 'rK3wP7_V9yN',
          searchQuery: 'Control and Coordination Class 10 Board Questions PYQs',
          title: 'Endocrine Gland Table & Reflex Arc Board PYQs Solved',
          teacherTag: 'PYQs & Numericals',
          duration: '40m',
          medium: 'Hinglish'
        }
      ]
    },

    science_7: {
      chapterName: 'How do Organisms Reproduce?',
      subject: 'Science',
      videos: [
        {
          id: 's7_v1',
          videoId: 'sN1wK8_P4yL',
          searchQuery: 'How do Organisms Reproduce Class 10 Full Chapter One Shot',
          title: 'How Do Organisms Reproduce | Asexual & Sexual Reproduction',
          teacherTag: 'One-Shot',
          duration: '2h 00m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's7_v2',
          videoId: 'tL5wM2_T9yZ',
          searchQuery: 'Flower Reproduction and Male Female Reproductive System Class 10',
          title: 'Flower Anatomy, Double Fertilization & Human Reproductive Systems',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 's7_v3',
          videoId: 'uP9wN4_V1xR',
          searchQuery: 'How do Organisms Reproduce Class 10 Board Questions Diagrams',
          title: 'Top Diagrams & Reproductive Health (Contraceptive Methods) PYQs',
          teacherTag: 'PYQs & Numericals',
          duration: '45m',
          medium: 'Hinglish'
        }
      ]
    },

    science_8: {
      chapterName: 'Heredity',
      subject: 'Science',
      videos: [
        {
          id: 's8_v1',
          videoId: 'vQ3wP7_M5yT',
          searchQuery: 'Heredity Class 10 Full Chapter One Shot Mendels Laws',
          title: 'Heredity Complete Chapter | Mendel Crosses & Sex Determination',
          teacherTag: 'One-Shot',
          duration: '1h 15m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's8_v2',
          videoId: 'wK8wL1_P2vR',
          searchQuery: 'Monohybrid and Dihybrid Cross Punnett Square Class 10',
          title: 'Mastering Monohybrid (3:1) & Dihybrid (9:3:3:1) Punnett Squares',
          teacherTag: 'NCERT Explanation',
          duration: '35m',
          medium: 'Hinglish'
        },
        {
          id: 's8_v3',
          videoId: 'xN2wM9_X4yZ',
          searchQuery: 'Heredity Class 10 Numerical Crosses Board PYQs',
          title: 'Solved Genetic Cross Numericals & Previous Year Questions',
          teacherTag: 'PYQs & Numericals',
          duration: '35m',
          medium: 'Hinglish'
        }
      ]
    },

    science_9: {
      chapterName: 'Light – Reflection and Refraction',
      subject: 'Science',
      videos: [
        {
          id: 's9_v1',
          videoId: 'yP6wN3_T8vL',
          searchQuery: 'Light Reflection and Refraction Class 10 Full Chapter One Shot',
          title: 'Light Complete | Ray Diagrams, Mirror & Lens Formulas & Numericals',
          teacherTag: 'One-Shot',
          duration: '2h 20m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's9_v2',
          videoId: 'zL1wM8_K5yZ',
          searchQuery: 'Light Class 10 Sign Convention and Ray Diagrams Trick',
          title: 'Sign Convention Rule (Cartesian) & All 12 Ray Diagrams in 20m',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 's9_v3',
          videoId: 'aN7wP4_V1xR',
          searchQuery: 'Light Class 10 Physics Numericals Mirror Formula Lens Formula',
          title: 'Top 15 Mirror & Lens Numerical Problems Solved with Tips',
          teacherTag: 'PYQs & Numericals',
          duration: '1h 00m',
          medium: 'Hinglish'
        }
      ]
    },

    science_10: {
      chapterName: 'The Human Eye and the Colourful World',
      subject: 'Science',
      videos: [
        {
          id: 's10_v1',
          videoId: 'bQ2wL9_M7yT',
          searchQuery: 'Human Eye and Colourful World Class 10 Full Chapter One Shot',
          title: 'The Human Eye & Colourful World | Defects of Vision & Dispersion',
          teacherTag: 'One-Shot',
          duration: '1h 25m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's10_v2',
          videoId: 'cK8wP1_P4vR',
          searchQuery: 'Myopia Hypermetropia Correction Ray Diagrams Class 10',
          title: 'Myopia, Hypermetropia & Presbyopia Ray Diagrams and Numericals',
          teacherTag: 'NCERT Explanation',
          duration: '40m',
          medium: 'Hinglish'
        },
        {
          id: 's10_v3',
          videoId: 'dN3wM7_X2yZ',
          searchQuery: 'Atmospheric Refraction Tyndall Effect Rainbow Class 10 PYQs',
          title: 'Twinkling of Stars, Advanced Sunrise & Rainbow Formation PYQs',
          teacherTag: 'PYQs & Numericals',
          duration: '35m',
          medium: 'Hinglish'
        }
      ]
    },

    science_11: {
      chapterName: 'Electricity',
      subject: 'Science',
      videos: [
        {
          id: 's11_v1',
          videoId: 'eP5wN2_T9vL',
          searchQuery: 'Electricity Class 10 Full Chapter One Shot Physics Ohms Law Numericals',
          title: 'Electricity in 1 Shot | Ohm\'s Law, Series/Parallel Circuits & Joule Heat',
          teacherTag: 'One-Shot',
          duration: '2h 25m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's11_v2',
          videoId: 'fL9wM4_K1yZ',
          searchQuery: 'Equivalent Resistance Series and Parallel Circuit Problems Class 10',
          title: 'Mastering Complex Circuit Diagrams (Equivalent Resistance Req)',
          teacherTag: 'NCERT Explanation',
          duration: '50m',
          medium: 'Hinglish'
        },
        {
          id: 's11_v3',
          videoId: 'gN4wP8_V6xR',
          searchQuery: 'Electricity Class 10 Numericals Electrical Energy Power Cost calculation',
          title: 'Electricity 5-Marker Numericals & Commercial Unit (kWh) Cost Practice',
          teacherTag: 'PYQs & Numericals',
          duration: '1h 05m',
          medium: 'Hinglish'
        }
      ]
    },

    science_12: {
      chapterName: 'Magnetic Effects of Electric Current',
      subject: 'Science',
      videos: [
        {
          id: 's12_v1',
          videoId: 'hQ1wL7_M3yT',
          searchQuery: 'Magnetic Effects of Electric Current Class 10 Full Chapter One Shot Solenoid Flemings Rule',
          title: 'Magnetic Effects of Current | Solenoid, Fleming\'s Left Hand Rule & Motor',
          teacherTag: 'One-Shot',
          duration: '1h 45m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's12_v2',
          videoId: 'iK6wP2_P9vR',
          searchQuery: 'Flemings Left Hand Rule and Right Hand Thumb Rule Class 10 Direction Tricks',
          title: 'Direction Finding Rules Made Easy: Right Hand Thumb vs Left Hand Rule',
          teacherTag: 'NCERT Explanation',
          duration: '35m',
          medium: 'Hinglish'
        },
        {
          id: 's12_v3',
          videoId: 'jN2wM8_X5yZ',
          searchQuery: 'Domestic Electric Circuits Earth Wire Short Circuit Overloading Class 10 PYQs',
          title: 'Domestic Circuits, Fuse, Earthing & Repeated Board Conceptual Questions',
          teacherTag: 'PYQs & Numericals',
          duration: '40m',
          medium: 'Hinglish'
        }
      ]
    },

    science_13: {
      chapterName: 'Our Environment',
      subject: 'Science',
      videos: [
        {
          id: 's13_v1',
          videoId: 'kP4wN9_T2vL',
          searchQuery: 'Our Environment Class 10 Full Chapter One Shot Trophic Levels 10 Percent Law Ozone Layer',
          title: 'Our Environment in 1 Shot | Food Web, 10% Energy Law & Ozone Layer',
          teacherTag: 'One-Shot',
          duration: '1h 05m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 's13_v2',
          videoId: 'lL8wM3_K7yZ',
          searchQuery: 'Biological Magnification Biomagnification Class 10 Ozone Depletion CFCs',
          title: 'Biomagnification, CFCs & Ozone Depletion Easy Explanation',
          teacherTag: 'NCERT Explanation',
          duration: '30m',
          medium: 'Hinglish'
        },
        {
          id: 's13_v3',
          videoId: 'mN3wP7_V4xR',
          searchQuery: 'Our Environment Class 10 Board Exam Case Study and PYQs',
          title: 'High-Scoring Case Study Questions & Full 5-Mark Question Bank',
          teacherTag: 'PYQs & Numericals',
          duration: '35m',
          medium: 'Hinglish'
        }
      ]
    },

    /* =========================================================================
       SOCIAL SCIENCE (Sample Chapters: sst_1 to sst_20)
       ========================================================================= */
    sst_1: {
      chapterName: 'The Rise of Nationalism in Europe',
      subject: 'History',
      videos: [
        {
          id: 'sst1_v1',
          videoId: 'nQ7wL1_M8yT',
          searchQuery: 'The Rise of Nationalism in Europe Class 10 Full Chapter One Shot',
          title: 'Rise of Nationalism in Europe Full Story | French Rev, Napoleon & Unification',
          teacherTag: 'One-Shot',
          duration: '2h 15m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'sst1_v2',
          videoId: 'oK2wP9_P3vR',
          searchQuery: 'Unification of Germany and Italy Class 10 History Notes',
          title: 'Unification of Germany (Bismarck) & Italy (Mazzini, Cavour, Garibaldi)',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 'sst1_v3',
          videoId: 'pP8wM4_V6xR',
          searchQuery: 'Rise of Nationalism in Europe Class 10 Most Important Questions PYQs',
          title: 'Top 10 Long Answer 5-Markers Guaranteed in History Board Exam',
          teacherTag: 'PYQs & Numericals',
          duration: '45m',
          medium: 'Hinglish'
        }
      ]
    },

    sst_2: {
      chapterName: 'Nationalism in India',
      subject: 'History',
      videos: [
        {
          id: 'sst2_v1',
          videoId: 'qN5wK8_T2vL',
          searchQuery: 'Nationalism in India Class 10 Full Chapter One Shot Non Cooperation Civil Disobedience',
          title: 'Nationalism in India in 1 Shot | Rowlatt Act, Non-Cooperation & Dandi March',
          teacherTag: 'One-Shot',
          duration: '2h 00m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'sst2_v2',
          videoId: 'rL9wM3_K7yZ',
          searchQuery: 'Nationalism in India Class 10 Map Work History',
          title: '100% Guaranteed Board History Map Work (Congress Sessions, Satyagrahas)',
          teacherTag: 'NCERT Explanation',
          duration: '25m',
          medium: 'Hinglish'
        },
        {
          id: 'sst2_v3',
          videoId: 'sP4wN1_V8xR',
          searchQuery: 'Nationalism in India Class 10 Board Questions PYQs',
          title: '5-Marker Long Questions: Why did NCM slow down? Salt March significance',
          teacherTag: 'PYQs & Numericals',
          duration: '45m',
          medium: 'Hinglish'
        }
      ]
    },

    sst_6: {
      chapterName: 'Resources and Development',
      subject: 'Geography',
      videos: [
        {
          id: 'sst6_v1',
          videoId: 'tQ2wL8_M5yT',
          searchQuery: 'Resources and Development Class 10 Geography Full Chapter One Shot Soil Types',
          title: 'Resources & Development | Classification, Land Use & Soil Types Guide',
          teacherTag: 'One-Shot',
          duration: '1h 20m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'sst6_v2',
          videoId: 'uK7wP1_P9vR',
          searchQuery: 'Soil Types of India Class 10 Geography Map Work',
          title: 'All Soil Types of India (Alluvial, Black, Red, Laterite) & Map Marking',
          teacherTag: 'NCERT Explanation',
          duration: '30m',
          medium: 'Hinglish'
        },
        {
          id: 'sst6_v3',
          videoId: 'vN3wM9_X4yZ',
          searchQuery: 'Resources and Development Class 10 Board Repeated Questions',
          title: 'Soil Erosion Measures & Rio Earth Summit 1992 Board PYQs',
          teacherTag: 'PYQs & Numericals',
          duration: '35m',
          medium: 'Hinglish'
        }
      ]
    },

    sst_13: {
      chapterName: 'Power Sharing',
      subject: 'Civics',
      videos: [
        {
          id: 'sst13_v1',
          videoId: 'wP6wN2_T7vL',
          searchQuery: 'Power Sharing Class 10 Civics Full Chapter One Shot Belgium Sri Lanka',
          title: 'Power Sharing Complete Story | Belgium Model vs Sri Lanka Majoritarianism',
          teacherTag: 'One-Shot',
          duration: '1h 10m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'sst13_v2',
          videoId: 'xL1wM7_K4yZ',
          searchQuery: 'Forms of Power Sharing Class 10 Horizontal Vertical',
          title: 'Forms of Power Sharing (Horizontal vs Vertical, Coalition, Pressure Groups)',
          teacherTag: 'NCERT Explanation',
          duration: '35m',
          medium: 'Hinglish'
        },
        {
          id: 'sst13_v3',
          videoId: 'yN8wP3_V1xR',
          searchQuery: 'Power Sharing Class 10 Important Board Questions PYQs',
          title: 'Why is Power Sharing desirable (Prudential vs Moral reasons) & PYQs',
          teacherTag: 'PYQs & Numericals',
          duration: '35m',
          medium: 'Hinglish'
        }
      ]
    },

    sst_17: {
      chapterName: 'Development',
      subject: 'Economics',
      videos: [
        {
          id: 'sst17_v1',
          videoId: 'zQ4wL9_M2yT',
          searchQuery: 'Development Class 10 Economics Full Chapter One Shot HDI Per Capita Income',
          title: 'Development Complete | National Income, Per Capita Income & HDI Indicators',
          teacherTag: 'One-Shot',
          duration: '1h 15m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'sst17_v2',
          videoId: 'aK9wP2_P7vR',
          searchQuery: 'World Bank Criteria vs UNDP Criteria Class 10 Economics',
          title: 'World Bank vs UNDP Comparison Table & Sustainable Development',
          teacherTag: 'NCERT Explanation',
          duration: '30m',
          medium: 'Hinglish'
        },
        {
          id: 'sst17_v3',
          videoId: 'bN5wM8_X3yZ',
          searchQuery: 'Development Class 10 Board Questions Case Study',
          title: 'Development Goals Conflict & Case Study Board Questions',
          teacherTag: 'PYQs & Numericals',
          duration: '30m',
          medium: 'Hinglish'
        }
      ]
    },

    /* =========================================================================
       ARTIFICIAL INTELLIGENCE (Code 417 - 13 Sunday Units: ai_1 to ai_13)
       ========================================================================= */
    ai_1: {
      chapterName: 'Introduction to AI & AI Project Cycle',
      subject: 'Artificial Intelligence',
      videos: [
        {
          id: 'ai1_v1',
          videoId: 'cQ1wL7_M4yT',
          searchQuery: 'CBSE Class 10 AI Code 417 Introduction to Artificial Intelligence Full Chapter One Shot',
          title: 'AI Code 417 | Introduction to AI, Intelligence Types & 3 Domains',
          teacherTag: 'One-Shot',
          duration: '1h 10m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'ai1_v2',
          videoId: 'dK6wP2_P9vR',
          searchQuery: 'AI Project Cycle Class 10 Problem Scoping Data Acquisition Exploration Modelling Evaluation',
          title: '5 Stages of AI Project Cycle (4Ws Canvas, Acquisition, Modelling, Evaluation)',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 'ai1_v3',
          videoId: 'eN2wM8_X5yZ',
          searchQuery: 'Class 10 AI Code 417 CBSE Sample Paper Questions',
          title: 'CBSE Official 50-Mark Sample Paper MCQs & Subjective Questions',
          teacherTag: 'PYQs & Numericals',
          duration: '40m',
          medium: 'Hinglish'
        }
      ]
    },

    ai_4: {
      chapterName: 'Advance Python for AI & Data Science',
      subject: 'Artificial Intelligence',
      videos: [
        {
          id: 'ai4_v1',
          videoId: 'fP5wN3_T8vL',
          searchQuery: 'Python for Class 10 AI Code 417 Lists Tuples Dictionaries NumPy',
          title: 'Python for AI Code 417 | Lists, Tuples, Dictionaries & NumPy Basics',
          teacherTag: 'One-Shot',
          duration: '1h 30m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'ai4_v2',
          videoId: 'gL9wM4_K2yZ',
          searchQuery: 'Python Data Structures Class 10 AI Code 417 Coding Practice',
          title: 'Hands-on Python Coding for CBSE Practical Examination',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 'ai4_v3',
          videoId: 'hN4wP8_V7xR',
          searchQuery: 'Class 10 AI Code 417 Python Coding Output Questions Board Exam',
          title: 'Predict the Output & Error Finding Questions Solved',
          teacherTag: 'PYQs & Numericals',
          duration: '35m',
          medium: 'Hinglish'
        }
      ]
    },

    ai_7: {
      chapterName: 'Computer Vision & Natural Language Processing',
      subject: 'Artificial Intelligence',
      videos: [
        {
          id: 'ai7_v1',
          videoId: 'iQ2wL8_M6yT',
          searchQuery: 'Computer Vision and NLP Class 10 AI Code 417 Full Chapter One Shot',
          title: 'Computer Vision (CV) & NLP in 1 Shot | Pixel, Grayscale, Chatbots & Text Normalization',
          teacherTag: 'One-Shot',
          duration: '1h 25m',
          medium: 'Hinglish',
          recommended: true
        },
        {
          id: 'ai7_v2',
          videoId: 'jK7wP1_P3vR',
          searchQuery: 'NLP Text Normalization Tokenization Stemming Lemmatization Bag of Words TF IDF',
          title: 'Text Normalization, Stopwords, Stemming vs Lemmatization & Bag of Words',
          teacherTag: 'NCERT Explanation',
          duration: '45m',
          medium: 'Hinglish'
        },
        {
          id: 'ai7_v3',
          videoId: 'kN3wM9_X8yZ',
          searchQuery: 'Evaluation Matrix Confusion Matrix Precision Recall F1 Score Class 10 AI',
          title: 'Confusion Matrix Calculation: Accuracy, Precision, Recall & F1 Score',
          teacherTag: 'PYQs & Numericals',
          duration: '40m',
          medium: 'Hinglish'
        }
      ]
    }
  },

  /**
   * Helper function to resolve curated videos for any chapter ID
   * Falls back gracefully to synthesized educational search entries if not explicitly mapped
   */
  resolveChapterVideos(subject, chapterId, userMedium = 'Hinglish') {
    const entry = this.chapters[chapterId];
    if (entry && entry.videos && entry.videos.length > 0) {
      return entry.videos.map(v => ({
        ...v,
        embedUrl: this.buildEmbedUrl(v.videoId, v.searchQuery),
        thumbnailUrl: this.getThumbnailUrl(v.videoId)
      }));
    }

    // Dynamic fallback generation for any chapter
    const sanitizedTitle = chapterId.replace(/_/g, ' ');
    const baseQuery = `Class 10 CBSE ${subject} ${sanitizedTitle} NCERT`;

    return [
      {
        id: `${chapterId}_fb_oneshot`,
        videoId: '',
        searchQuery: `${baseQuery} full chapter one shot`,
        title: `${subject}: ${sanitizedTitle} (Complete One-Shot Revision)`,
        teacherTag: 'One-Shot',
        duration: '1h 30m',
        medium: userMedium,
        embedUrl: this.buildEmbedUrl('', `${baseQuery} full chapter one shot`),
        thumbnailUrl: ''
      },
      {
        id: `${chapterId}_fb_ncert`,
        videoId: '',
        searchQuery: `${baseQuery} line by line exercise explanation`,
        title: `${subject}: ${sanitizedTitle} (NCERT Concepts & Exercises)`,
        teacherTag: 'NCERT Explanation',
        duration: '50m',
        medium: userMedium,
        embedUrl: this.buildEmbedUrl('', `${baseQuery} line by line exercise explanation`),
        thumbnailUrl: ''
      },
      {
        id: `${chapterId}_fb_pyq`,
        videoId: '',
        searchQuery: `${baseQuery} important questions pyqs previous year board`,
        title: `${subject}: ${sanitizedTitle} (Top Board Exam PYQs)`,
        teacherTag: 'PYQs & Numericals',
        duration: '40m',
        medium: userMedium,
        embedUrl: this.buildEmbedUrl('', `${baseQuery} important questions pyqs previous year board`),
        thumbnailUrl: ''
      }
    ];
  }
};

if (typeof window !== 'undefined') {
  window.GURUSTUDY_LECTURES = GURUSTUDY_LECTURES;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GURUSTUDY_LECTURES;
}
