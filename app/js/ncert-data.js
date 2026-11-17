const NCERT_DATA = [
  {
    "id": "maths",
    "name": "Mathematics",
    "nameHi": "गणित",
    "code": "041",
    "icon": "calculate",
    "color": "#2563EB",
    "books": [
      {
        "id": "maths_ncert",
        "title": "NCERT Mathematics Class 10",
        "titleHi": "एनसीईआरटी गणित कक्षा 10",
        "chapters": [
          {
            "number": 1,
            "title": "Real Numbers",
            "titleHi": "वास्तविक संख्याएँ",
            "summary": "Fundamental Theorem of Arithmetic states that every composite number can be uniquely expressed as a product of primes. Revisiting irrational numbers (proving sqrt(2), sqrt(3), sqrt(5) irrational).",
            "summaryHi": "अंकगणित की आधारभूत प्रमेय के अनुसार प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के गुणनफल के रूप में अद्वितीय रूप से व्यक्त किया जा सकता है। अपरिमेय संख्याओं का पुनर्भ्रमण।",
            "keyConcepts": [
              "Fundamental Theorem of Arithmetic: a = p1 * p2 * ... * pn",
              "HCF(a, b) * LCM(a, b) = a * b (for two positive integers)",
              "Proof of irrationality by contradiction for sqrt(p) where p is prime",
              "Decimal expansion of rational numbers"
            ],
            "formulas": [
              "HCF(a, b) x LCM(a, b) = a x b",
              "If p is prime and p divides a^2, then p divides a"
            ],
            "importantQuestions": [
              {
                "question": "Prove that sqrt(5) is an irrational number.",
                "questionHi": "सिद्ध कीजिए कि √5 एक अपरिमेय संख्या है।",
                "solution": "Assume sqrt(5) = a/b (co-prime, b!=0). 5 = a^2/b^2 => 5b^2 = a^2. So 5 divides a. Let a = 5c => 5b^2 = 25c^2 => b^2 = 5c^2. So 5 divides b. Hence 5 is a common factor, contradicting co-prime assumption. Thus sqrt(5) is irrational.",
                "marks": 3
              },
              {
                "question": "Given that HCF(306, 657) = 9, find LCM(306, 657).",
                "questionHi": "यदि HCF(306, 657) = 9 है, तो LCM(306, 657) ज्ञात कीजिए।",
                "solution": "LCM = (306 x 657) / HCF = (306 x 657) / 9 = 34 x 657 = 22,338.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "If two positive integers a and b are written as a = x^3 y^2 and b = x y^3, where x, y are prime numbers, then HCF(a, b) is:",
                "options": [
                  "xy",
                  "xy^2",
                  "x^3 y^3",
                  "x^2 y^2"
                ],
                "correctIndex": 1,
                "explanation": "HCF is product of smallest power of each common prime factor: x^1 * y^2 = xy^2."
              },
              {
                "question": "The total number of factors of a prime number is:",
                "options": [
                  "1",
                  "2",
                  "0",
                  "3"
                ],
                "correctIndex": 1,
                "explanation": "A prime number has exactly 2 factors: 1 and the number itself."
              }
            ]
          },
          {
            "number": 2,
            "title": "Polynomials",
            "titleHi": "बहुपद",
            "summary": "Geometrical meaning of zeroes of a polynomial. Relationship between zeroes and coefficients of quadratic and cubic polynomials.",
            "summaryHi": "बहुपद के शून्यकों का ज्यामितीय अर्थ। द्विघात बहुपद के शून्यकों एवं गुणांकों के बीच संबंध।",
            "keyConcepts": [
              "Zeroes are x-coordinates of points where y = p(x) intersects x-axis",
              "For quadratic ax^2 + bx + c: Sum of zeroes (alpha + beta) = -b/a",
              "Product of zeroes (alpha * beta) = c/a",
              "Quadratic polynomial: k[x^2 - (alpha + beta)x + (alpha * beta)]"
            ],
            "formulas": [
              "Sum of zeroes: α + β = -b/a",
              "Product of zeroes: αβ = c/a",
              "p(x) = k[x² - (Sum)x + (Product)]"
            ],
            "importantQuestions": [
              {
                "question": "Find the zeroes of the quadratic polynomial x^2 + 7x + 10 and verify the relationship between zeroes and coefficients.",
                "questionHi": "द्विघात बहुपद x^2 + 7x + 10 के शून्यक ज्ञात कीजिए तथा शून्यकों और गुणांकों के बीच संबंध की सत्यता की जाँच कीजिए।",
                "solution": "x^2 + 5x + 2x + 10 = (x+5)(x+2) = 0. Zeroes are -2, -5. Sum = -7 = -b/a. Product = 10 = c/a. Verified.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "A quadratic polynomial whose zeroes are -3 and 4 is:",
                "options": [
                  "x^2 - x + 12",
                  "x^2 + x + 12",
                  "x^2/2 - x/2 - 6",
                  "2x^2 + 2x - 24"
                ],
                "correctIndex": 2,
                "explanation": "p(x) = k[x^2 - (sum)x + prod] = k[x^2 - x - 12]. With k=1/2, it is x^2/2 - x/2 - 6."
              }
            ]
          },
          {
            "number": 3,
            "title": "Pair of Linear Equations in Two Variables",
            "titleHi": "दो चरों वाले रैखिक समीकरण युग्म",
            "summary": "Graphical and algebraic methods for solving a pair of linear equations: Substitution method and Elimination method. Consistency conditions.",
            "summaryHi": "दो चरों में रैखिक समीकरण युग्म को हल करने की आलेखीय और बीजगणितीय विधियाँ (प्रतिस्थापन एवं विलोपन विधि)।",
            "keyConcepts": [
              "Standard form: a1 x + b1 y + c1 = 0 and a2 x + b2 y + c2 = 0",
              "Unique solution (Intersecting): a1/a2 != b1/b2",
              "Infinitely many solutions (Coincident): a1/a2 = b1/b2 = c1/c2",
              "No solution (Parallel / Inconsistent): a1/a2 = b1/b2 != c1/c2"
            ],
            "formulas": [
              "Consistent (unique): a1/a2 ≠ b1/b2",
              "Dependent (infinite): a1/a2 = b1/b2 = c1/c2",
              "Inconsistent (none): a1/a2 = b1/b2 ≠ c1/c2"
            ],
            "importantQuestions": [
              {
                "question": "Solve by elimination: 2x + 3y = 11 and 2x - 4y = -24.",
                "questionHi": "विलोपन विधि से हल करें: 2x + 3y = 11 और 2x - 4y = -24.",
                "solution": "Subtracting gives 7y = 35 => y = 5. Substituting in first eq: 2x + 15 = 11 => 2x = -4 => x = -2.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "The lines representing the equations 3x + 2ky = 2 and 2x + 5y + 1 = 0 are parallel, then the value of k is:",
                "options": [
                  "-5/4",
                  "2/5",
                  "15/4",
                  "3/2"
                ],
                "correctIndex": 2,
                "explanation": "For parallel lines: a1/a2 = b1/b2 => 3/2 = 2k/5 => 4k = 15 => k = 15/4."
              }
            ]
          },
          {
            "number": 4,
            "title": "Quadratic Equations",
            "titleHi": "द्विघात समीकरण",
            "summary": "Standard form ax^2 + bx + c = 0. Solution by factorisation and by quadratic formula. Nature of roots using discriminant D = b^2 - 4ac.",
            "summaryHi": "द्विघात समीकरण का मानक रूप ax^2 + bx + c = 0। गुणनखंडन विधि तथा द्विघाती सूत्र द्वारा हल। विविक्तकर द्वारा मूलों की प्रकृति।",
            "keyConcepts": [
              "Quadratic formula: x = (-b ± sqrt(D)) / (2a)",
              "Discriminant D = b^2 - 4ac",
              "D > 0: Two distinct real roots",
              "D = 0: Two equal real roots",
              "D < 0: No real roots"
            ],
            "formulas": [
              "D = b² - 4ac",
              "Roots x = (-b ± √D) / (2a)"
            ],
            "importantQuestions": [
              {
                "question": "Find the discriminant of 2x^2 - 4x + 3 = 0 and hence find the nature of its roots.",
                "questionHi": "समीकरण 2x^2 - 4x + 3 = 0 का विविक्तकर ज्ञात कीजिए तथा मूलों की प्रकृति बताइए।",
                "solution": "D = (-4)^2 - 4(2)(3) = 16 - 24 = -8 < 0. Therefore, the equation has no real roots.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "If the quadratic equation x^2 - 4x + k = 0 has equal real roots, then the value of k is:",
                "options": [
                  "2",
                  "4",
                  "-4",
                  "16"
                ],
                "correctIndex": 1,
                "explanation": "For equal roots, D = 0 => (-4)^2 - 4(1)(k) = 0 => 16 - 4k = 0 => k = 4."
              }
            ]
          },
          {
            "number": 5,
            "title": "Arithmetic Progressions",
            "titleHi": "समानांतर श्रेणियाँ",
            "summary": "nth term and sum of first n terms of an arithmetic progression. Word problems based on daily life applications.",
            "summaryHi": "समानांतर श्रेणी का nवाँ पद तथा प्रथम n पदों का योग। दैनिक जीवन से संबंधित अनुप्रयोग।",
            "keyConcepts": [
              "General form: a, a+d, a+2d, ...",
              "nth term: a_n = a + (n - 1)d",
              "Sum of n terms: S_n = n/2 [2a + (n - 1)d] = n/2 [a + l]",
              "Common difference d = a_(k+1) - a_k"
            ],
            "formulas": [
              "a_n = a + (n - 1)d",
              "S_n = (n/2)[2a + (n-1)d] = (n/2)[a + l]"
            ],
            "importantQuestions": [
              {
                "question": "Find the sum of the first 22 terms of the AP: 8, 3, -2, ...",
                "questionHi": "समानांतर श्रेणी 8, 3, -2, ... के प्रथम 22 पदों का योग ज्ञात कीजिए।",
                "solution": "a = 8, d = 3 - 8 = -5, n = 22. S_22 = (22/2)[2(8) + (21)(-5)] = 11[16 - 105] = 11[-89] = -979.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "The 11th term of the AP: -3, -1/2, 2, ... is:",
                "options": [
                  "28",
                  "22",
                  "-38",
                  "-46.5"
                ],
                "correctIndex": 1,
                "explanation": "a = -3, d = -1/2 - (-3) = 5/2. a_11 = a + 10d = -3 + 10*(5/2) = -3 + 25 = 22."
              }
            ]
          },
          {
            "number": 6,
            "title": "Triangles",
            "titleHi": "त्रिभुज",
            "summary": "Similar figures, Basic Proportionality Theorem (Thales Theorem) and its converse, criteria for similarity of triangles (AAA, SSS, SAS).",
            "summaryHi": "समरूप आकृतियाँ, आधारभूत आनुपातिकता प्रमेय (थेल्स प्रमेय) और इसका विलोम, त्रिभुजों की समरूपता की कसौटियाँ।",
            "keyConcepts": [
              "Two polygons are similar if corresponding angles are equal and corresponding sides are in the same ratio",
              "Basic Proportionality Theorem: If a line is drawn parallel to one side of a triangle intersecting other two sides, it divides them in the same ratio",
              "Criteria: AAA (or AA), SSS, SAS similarity"
            ],
            "formulas": [
              "BPT: AD/DB = AE/EC if DE || BC"
            ],
            "importantQuestions": [
              {
                "question": "State and prove Basic Proportionality Theorem (Thales Theorem).",
                "questionHi": "आधारभूत आनुपातिकता प्रमेय (थेल्स प्रमेय) का कथन लिखकर सिद्ध कीजिए।",
                "solution": "Proof using areas of triangles ADE and BDE, ADE and CDE. Showing area(ADE)/area(BDE) = AD/DB and area(ADE)/area(CDE) = AE/EC. Since triangles on same base DE between same parallels have equal area, AD/DB = AE/EC.",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "If in two triangles ABC and PQR, AB/QR = BC/PR = CA/PQ, then:",
                "options": [
                  "ΔPQR ~ ΔCAB",
                  "ΔPQR ~ ΔABC",
                  "ΔCBA ~ ΔPQR",
                  "ΔBCA ~ ΔPQR"
                ],
                "correctIndex": 0,
                "explanation": "Matching vertices: A->Q, B->R, C->P. So ΔPQR ~ ΔCAB."
              }
            ]
          },
          {
            "number": 7,
            "title": "Coordinate Geometry",
            "titleHi": "निर्देशांक ज्यामिति",
            "summary": "Distance formula, Section formula (internal division), and Mid-point formula on the Cartesian plane.",
            "summaryHi": "दूरी सूत्र, विभाजन सूत्र (अंतः विभाजन) तथा मध्य बिंदु सूत्र।",
            "keyConcepts": [
              "Distance between P(x1, y1) and Q(x2, y2) = sqrt((x2 - x1)^2 + (y2 - y1)^2)",
              "Section formula: ((m1 x2 + m2 x1)/(m1 + m2), (m1 y2 + m2 y1)/(m1 + m2))",
              "Mid-point formula: ((x1 + x2)/2, (y1 + y2)/2)"
            ],
            "formulas": [
              "Distance d = √[(x₂ - x₁)² + (y₂ - y₁)²]",
              "Section: x = (m₁x₂ + m₂x₁)/(m₁+m₂), y = (m₁y₂ + m₂y₁)/(m₁+m₂)",
              "Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)"
            ],
            "importantQuestions": [
              {
                "question": "Find the ratio in which the y-axis divides the line segment joining the points (5, -6) and (-1, -4).",
                "questionHi": "y-अक्ष, बिंदुओं (5, -6) और (-1, -4) को मिलाने वाले रेखाखंड को किस अनुपात में विभाजित करता है?",
                "solution": "Let ratio be k:1. On y-axis, x = 0. So (-1k + 5)/(k + 1) = 0 => -k + 5 = 0 => k = 5. Ratio is 5:1.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "The distance of point P(-6, 8) from the origin is:",
                "options": [
                  "8",
                  "2√7",
                  "10",
                  "6"
                ],
                "correctIndex": 2,
                "explanation": "Distance = sqrt((-6)^2 + 8^2) = sqrt(36 + 64) = sqrt(100) = 10 units."
              }
            ]
          },
          {
            "number": 8,
            "title": "Introduction to Trigonometry",
            "titleHi": "त्रिकोणमिति का परिचय",
            "summary": "Trigonometric ratios of an acute angle in a right-angled triangle, values at 0°, 30°, 45°, 60°, 90°, and fundamental trigonometric identities.",
            "summaryHi": "समकोण त्रिभुज में न्यून कोण के त्रिकोणमितीय अनुपात, 0°, 30°, 45°, 60°, 90° पर मान, और मूलभूत सर्वसमिकाएँ।",
            "keyConcepts": [
              "sin θ = P/H, cos θ = B/H, tan θ = P/B",
              "cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ",
              "sin² θ + cos² θ = 1",
              "1 + tan² θ = sec² θ",
              "1 + cot² θ = cosec² θ"
            ],
            "formulas": [
              "sin²θ + cos²θ = 1",
              "sec²θ - tan²θ = 1",
              "cosec²θ - cot²θ = 1",
              "tan θ = sin θ / cos θ"
            ],
            "importantQuestions": [
              {
                "question": "Prove that (sin θ - 2 sin³ θ) / (2 cos³ θ - cos θ) = tan θ.",
                "questionHi": "सिद्ध कीजिए कि (sin θ - 2 sin³ θ) / (2 cos³ θ - cos θ) = tan θ.",
                "solution": "Numerator = sin θ(1 - 2 sin² θ) = sin θ(cos 2θ). Denominator = cos θ(2 cos² θ - 1) = cos θ(cos 2θ). Ratio = sin θ / cos θ = tan θ.",
                "marks": 4
              }
            ],
            "mcqs": [
              {
                "question": "If sin A = 1/2, then the value of cot A is:",
                "options": [
                  "√3",
                  "1/√3",
                  "√3/2",
                  "1"
                ],
                "correctIndex": 0,
                "explanation": "sin A = 1/2 => A = 30°. cot 30° = √3."
              }
            ]
          },
          {
            "number": 9,
            "title": "Some Applications of Trigonometry",
            "titleHi": "त्रिकोणमिति के कुछ अनुप्रयोग",
            "summary": "Heights and Distances: Angles of elevation and depression, simple problems involving one or two right-angled triangles.",
            "summaryHi": "ऊँचाइयाँ और दूरियाँ: उन्नयन कोण तथा अवनमन कोण, साधारण प्रश्न।",
            "keyConcepts": [
              "Line of sight",
              "Angle of elevation (looking upwards)",
              "Angle of depression (looking downwards)",
              "tan θ is commonly used: Height / Base"
            ],
            "formulas": [
              "tan θ = Opposite / Adjacent = Height / Distance"
            ],
            "importantQuestions": [
              {
                "question": "A tower stands vertically on the ground. From a point on the ground, which is 15 m away from the foot of the tower, the angle of elevation of the top of the tower is found to be 60°. Find the height of the tower.",
                "questionHi": "धरती पर एक मीनार ऊर्ध्वाधर खड़ी है। धरती के एक बिंदु से, जो मीनार के पाद-बिंदु से 15 m दूर है, मीनार के शिखर का उन्नयन कोण 60° है। मीनार की ऊँचाई ज्ञात कीजिए।",
                "solution": "tan 60° = h / 15 => √3 = h / 15 => h = 15√3 m ≈ 25.98 m.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "If the length of the shadow of a tower is equal to its height, the angle of elevation of the Sun is:",
                "options": [
                  "30°",
                  "45°",
                  "60°",
                  "90°"
                ],
                "correctIndex": 1,
                "explanation": "tan θ = height / shadow = 1 => θ = 45°."
              }
            ]
          },
          {
            "number": 10,
            "title": "Circles",
            "titleHi": "वृत्त",
            "summary": "Tangents to a circle at a point of contact. The tangent at any point of a circle is perpendicular to the radius. Lengths of tangents drawn from an external point to a circle are equal.",
            "summaryHi": "स्पर्श रेखा तथा स्पर्श बिंदु। स्पर्श बिंदु पर त्रिज्या स्पर्श रेखा पर लंब होती है। बाह्य बिंदु से खींची गई स्पर्श रेखाओं की लंबाइयाँ बराबर होती हैं।",
            "keyConcepts": [
              "A tangent touches the circle at exactly one point",
              "Theorem 1: Radius is perpendicular to tangent at point of contact (OP ⊥ AB)",
              "Theorem 2: Lengths of two tangents from an external point are equal (PA = PB)"
            ],
            "formulas": [
              "PA = PB (Tangents from external point P)"
            ],
            "importantQuestions": [
              {
                "question": "Prove that the lengths of tangents drawn from an external point to a circle are equal.",
                "questionHi": "सिद्ध कीजिए कि बाह्य बिंदु से वृत्त पर खींची गई स्पर्श रेखाओं की लंबाइयाँ बराबर होती हैं।",
                "solution": "Join OP, OA, OB. In right ΔOAP and ΔOBP: OA = OB (radii), OP = OP (common), ∠OAP = ∠OBP = 90°. By RHS congruence, ΔOAP ≅ ΔOBP => PA = PB (CPCT).",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "From a point Q, the length of the tangent to a circle is 24 cm and the distance of Q from the centre is 25 cm. The radius of the circle is:",
                "options": [
                  "7 cm",
                  "12 cm",
                  "15 cm",
                  "24.5 cm"
                ],
                "correctIndex": 0,
                "explanation": "r = sqrt(25^2 - 24^2) = sqrt(625 - 576) = sqrt(49) = 7 cm."
              }
            ]
          },
          {
            "number": 11,
            "title": "Areas Related to Circles",
            "titleHi": "वृत्तों से संबंधित क्षेत्रफल",
            "summary": "Area of sector and segment of a circle. Problems based on areas and perimeter / circumference of plane figures.",
            "summaryHi": "त्रिज्यखंड और वृत्तखंड का क्षेत्रफल। समतल आकृतियों के संयोजन के क्षेत्रफल।",
            "keyConcepts": [
              "Area of sector of angle θ = (θ/360°) * πr²",
              "Length of an arc of sector of angle θ = (θ/360°) * 2πr",
              "Area of segment = Area of sector - Area of corresponding triangle"
            ],
            "formulas": [
              "Area of sector = (θ/360) x πr²",
              "Arc length = (θ/360) x 2πr",
              "Area of minor segment = Area of sector - (1/2)r² sin θ"
            ],
            "importantQuestions": [
              {
                "question": "Find the area of a sector of a circle with radius 6 cm if angle of the sector is 60°.",
                "questionHi": "6 सेमी त्रिज्या वाले एक वृत्त के एक त्रिज्यखंड का क्षेत्रफल ज्ञात कीजिए, जिसका कोण 60° है।",
                "solution": "Area = (60/360) * (22/7) * 6 * 6 = (1/6) * (22/7) * 36 = 132/7 cm² ≈ 18.86 cm².",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "If the perimeter and the area of a circle are numerically equal, then the radius of the circle is:",
                "options": [
                  "2 units",
                  "π units",
                  "4 units",
                  "7 units"
                ],
                "correctIndex": 0,
                "explanation": "2πr = πr² => r = 2 units."
              }
            ]
          },
          {
            "number": 12,
            "title": "Surface Areas and Volumes",
            "titleHi": "पृष्ठीय क्षेत्रफल और आयतन",
            "summary": "Surface areas and volumes of combinations of any two of the following: cubes, cuboids, spheres, hemispheres and right circular cylinders/cones.",
            "summaryHi": "ठोसों के संयोजन का पृष्ठीय क्षेत्रफल और आयतन (घन, घनाभ, गोला, अर्धगोला, लंबवृत्तीय बेलन एवं शंकु)।",
            "keyConcepts": [
              "Cylinder: CSA = 2πrh, TSA = 2πr(h+r), V = πr²h",
              "Cone: CSA = πrl, TSA = πr(l+r), l = sqrt(r²+h²), V = (1/3)πr²h",
              "Sphere: SA = 4πr², V = (4/3)πr³",
              "Hemisphere: CSA = 2πr², TSA = 3πr², V = (2/3)πr³"
            ],
            "formulas": [
              "Cylinder V = πr²h",
              "Cone V = (1/3)πr²h, l = √(r² + h²)",
              "Sphere V = (4/3)πr³, SA = 4πr²",
              "Hemisphere TSA = 3πr², V = (2/3)πr³"
            ],
            "importantQuestions": [
              {
                "question": "2 cubes each of volume 64 cm³ are joined end to end. Find the surface area of the resulting cuboid.",
                "questionHi": "2 घनों, जिनमें से प्रत्येक का आयतन 64 cm³ है, के संलग्न फलकों को मिलाकर एक ठोस बनाया जाता है। प्राप्त घनाभ का पृष्ठीय क्षेत्रफल ज्ञात कीजिए।",
                "solution": "Edge of each cube a = cbrt(64) = 4 cm. Cuboid dimensions: l = 8 cm, b = 4 cm, h = 4 cm. Surface area = 2(lb + bh + hl) = 2(32 + 16 + 32) = 2(80) = 160 cm².",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "The radius of a wire is decreased to one-third. If volume remains the same, length will become:",
                "options": [
                  "3 times",
                  "6 times",
                  "9 times",
                  "27 times"
                ],
                "correctIndex": 2,
                "explanation": "V = πr²h. If r' = r/3, (r')² = r²/9. To keep V constant, h' must be 9h."
              }
            ]
          },
          {
            "number": 13,
            "title": "Statistics",
            "titleHi": "सांख्यिकी",
            "summary": "Mean, median and mode of grouped data (bimodal situation avoided). Relationship between the three measures of central tendency.",
            "summaryHi": "वर्गीकृत आंकड़ों का माध्य, माध्यक तथा बहुलक। केंद्रीय प्रवृत्ति के तीनों मापकों के बीच आनुभविक संबंध।",
            "keyConcepts": [
              "Mean (Direct): Σ(fi * xi) / Σfi",
              "Mean (Assumed): a + [Σ(fi * di) / Σfi]",
              "Mode = l + [(f1 - f0)/(2f1 - f0 - f2)] * h",
              "Median = l + [((n/2) - cf)/f] * h",
              "Empirical relationship: 3 Median = Mode + 2 Mean"
            ],
            "formulas": [
              "Mean = Σ(fi·xi) / Σfi",
              "Mode = l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] × h",
              "Median = l + [(n/2 - cf) / f] × h",
              "3 Median = Mode + 2 Mean"
            ],
            "importantQuestions": [
              {
                "question": "The median of the following data is 525. Find the values of x and y, if the total frequency is 100.",
                "questionHi": "यदि नीचे दिए गए आंकड़ों का माध्यक 525 है, तो x और y का मान ज्ञात कीजिए, यदि कुल बारंबारता 100 है।",
                "solution": "Using median class 500-600, median formula gives x = 9, y = 15.",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "If Mode = 8 and Mean = 8, then Median is:",
                "options": [
                  "8",
                  "16",
                  "24",
                  "4"
                ],
                "correctIndex": 0,
                "explanation": "3 Median = Mode + 2 Mean = 8 + 16 = 24 => Median = 8."
              }
            ]
          },
          {
            "number": 14,
            "title": "Probability",
            "titleHi": "प्रायिकता",
            "summary": "Classical definition of probability. Simple problems on finding the probability of an event. Impossible event and sure event.",
            "summaryHi": "प्रायिकता की सैद्धांतिक परिभाषा। किसी घटना की प्रायिकता पर आधारित सरल प्रश्न।",
            "keyConcepts": [
              "P(E) = Number of outcomes favorable to E / Total number of possible outcomes",
              "0 <= P(E) <= 1",
              "P(E) + P(not E) = 1",
              "Sure event has P(E) = 1, Impossible event has P(E) = 0"
            ],
            "formulas": [
              "P(E) = n(E) / n(S)",
              "P(E) + P(E') = 1"
            ],
            "importantQuestions": [
              {
                "question": "A card is drawn from a well-shuffled deck of 52 playing cards. Find the probability of getting a king of red colour.",
                "questionHi": "52 पत्तों की अच्छी तरह फेंटी गई ताश की गड्डी में से एक पत्ता निकाला जाता है। लाल रंग का बादशाह प्राप्त करने की प्रायिकता ज्ञात कीजिए।",
                "solution": "Total cards n(S) = 52. Red kings (heart, diamond) n(E) = 2. P(Red King) = 2/52 = 1/26.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "Which of the following cannot be the probability of an event?",
                "options": [
                  "2/3",
                  "-1.5",
                  "15%",
                  "0.7"
                ],
                "correctIndex": 1,
                "explanation": "Probability of an event can never be negative (0 <= P <= 1)."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "science",
    "name": "Science",
    "nameHi": "विज्ञान",
    "code": "086",
    "icon": "science",
    "color": "#16A34A",
    "books": [
      {
        "id": "science_ncert",
        "title": "NCERT Science Class 10",
        "titleHi": "एनसीईआरटी विज्ञान कक्षा 10",
        "chapters": [
          {
            "number": 1,
            "title": "Chemical Reactions and Equations",
            "titleHi": "रासायनिक अभिक्रियाएँ एवं समीकरण",
            "summary": "Chemical equation writing and balancing. Types of chemical reactions: Combination, Decomposition, Displacement, Double Displacement, Oxidation and Reduction. Corrosion and Rancidity.",
            "summaryHi": "रासायनिक समीकरण लिखना एवं संतुलित करना। रासायनिक अभिक्रियाओं के प्रकार (संयोजन, वियोजन, विस्थापन, द्विविस्थापन, उपचयन एवं अपचयन)। संक्षारण तथा विकृतगंधिता।",
            "keyConcepts": [
              "Law of conservation of mass in balancing equations",
              "Combination: A + B -> AB",
              "Decomposition: Thermal, Electrolytic, Photolytic",
              "Displacement: Fe + CuSO4 -> FeSO4 + Cu",
              "Redox: Oxidation is loss of electrons / gain of O2; Reduction is gain of electrons / loss of O2",
              "Exothermic and Endothermic reactions"
            ],
            "formulas": [
              "2Mg + O₂ → 2MgO (Combination)",
              "2FeSO₄ + heat → Fe₂O₃ + SO₂ + SO₃ (Thermal Decomposition)",
              "CuO + H₂ → Cu + H₂O (Redox)"
            ],
            "importantQuestions": [
              {
                "question": "Why should a magnesium ribbon be cleaned before burning in air?",
                "questionHi": "वायु में जलाने से पहले मैग्नीशियम रिबन को साफ क्यों किया जाता है?",
                "solution": "Magnesium reacts with atmospheric oxygen to form a protective layer of magnesium oxide (MgO). Cleaning it removes this inert layer so it burns easily.",
                "marks": 2
              },
              {
                "question": "Differentiate between exothermic and endothermic reactions with one example each.",
                "questionHi": "ऊष्माक्षेपी एवं ऊष्माशोषी अभिक्रिया में अंतर उदाहरण सहित स्पष्ट कीजिए।",
                "solution": "Exothermic: Heat is released (e.g., Respiration, burning of natural gas CH4 + 2O2 -> CO2 + 2H2O + heat). Endothermic: Heat is absorbed (e.g., Photosynthesis, decomposition of CaCO3 -> CaO + CO2).",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which of the following is a displacement reaction?",
                "options": [
                  "MgO + H2O -> Mg(OH)2",
                  "2KClO3 -> 2KCl + 3O2",
                  "Fe + CuSO4 -> FeSO4 + Cu",
                  "NaOH + HCl -> NaCl + H2O"
                ],
                "correctIndex": 2,
                "explanation": "Iron displaces copper from copper sulphate solution because iron is more reactive."
              }
            ]
          },
          {
            "number": 2,
            "title": "Acids, Bases and Salts",
            "titleHi": "अम्ल, क्षारक एवं लवण",
            "summary": "Their definitions in terms of furnishing of H+ and OH- ions, general properties, examples and uses, neutralization reaction, concept of pH scale, importance of pH in everyday life; preparation and uses of Sodium Hydroxide, Bleaching powder, Baking soda, Washing soda and Plaster of Paris.",
            "summaryHi": "H+ और OH- आयन के आधार पर अम्ल और क्षारक। pH पैमाना और दैनिक जीवन में इसका महत्व। बेकिंग सोडा, वाशिंग सोडा, विरंजक चूर्ण, प्लास्टर ऑफ पेरिस का निर्माण और उपयोग।",
            "keyConcepts": [
              "Acid turns blue litmus red; Base turns red litmus blue",
              "Neutralization: Acid + Base -> Salt + Water",
              "pH scale: 0 (strongly acidic) to 14 (strongly alkaline), 7 is neutral",
              "Salts: Bleaching Powder (CaOCl2), Baking Soda (NaHCO3), Washing Soda (Na2CO3.10H2O), Plaster of Paris (CaSO4.1/2H2O)"
            ],
            "formulas": [
              "pH = -log[H⁺]",
              "CaOCl₂ (Bleaching powder)",
              "NaHCO₃ (Baking soda)",
              "Na₂CO₃·10H₂O (Washing soda)",
              "CaSO₄·½H₂O (Plaster of Paris)"
            ],
            "importantQuestions": [
              {
                "question": "Why does distilled water not conduct electricity, whereas rain water does?",
                "questionHi": "आसवन जल विद्युत का चालक क्यों नहीं होता, जबकि वर्षा का जल होता है?",
                "solution": "Distilled water contains no dissolved ions. Rain water absorbs acidic gases like CO2, SO2 from the air, forming carbonic acid which dissociates into H+ and HCO3- ions that conduct electricity.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "A solution turns red litmus blue, its pH is likely to be:",
                "options": [
                  "1",
                  "4",
                  "5",
                  "10"
                ],
                "correctIndex": 3,
                "explanation": "Bases turn red litmus blue and have pH > 7. Hence pH 10."
              }
            ]
          },
          {
            "number": 3,
            "title": "Metals and Non-Metals",
            "titleHi": "धातु एवं अधातु",
            "summary": "Physical and chemical properties of metals and non-metals, reactivity series, formation and properties of ionic compounds, basic metallurgical processes, corrosion and its prevention.",
            "summaryHi": "धातुओं और अधातुओं के भौतिक एवं रासायनिक गुणधर्म, सक्रियता श्रेणी, आयनिक यौगिकों के गुणधर्म, धातुकर्म के आधारभूत प्रक्रम, संक्षारण और उसकी रोकथाम।",
            "keyConcepts": [
              "Metals are malleable, ductile, sonorous, good conductors of heat and electricity",
              "Reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au",
              "Ionic compounds have high melting points, soluble in water, conduct electricity in molten/aqueous state",
              "Roasting (in excess air for sulphide ores) and Calcination (in limited air for carbonate ores)",
              "Prevention of corrosion: Galvanization, painting, alloying"
            ],
            "formulas": [
              "2ZnS + 3O₂ + heat → 2ZnO + 2SO₂ (Roasting)",
              "ZnCO₃ + heat → ZnO + CO₂ (Calcination)"
            ],
            "importantQuestions": [
              {
                "question": "Why is sodium kept immersed in kerosene oil?",
                "questionHi": "सोडियम को केरोसिन में डुबोकर क्यों रखा जाता है?",
                "solution": "Sodium is an extremely reactive metal. It catches fire vigorously when exposed to atmospheric moisture and oxygen. To prevent accidental fires, it is stored in kerosene.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "Which of the following metals exists in liquid state at room temperature?",
                "options": [
                  "Iron",
                  "Mercury",
                  "Sodium",
                  "Lead"
                ],
                "correctIndex": 1,
                "explanation": "Mercury (Hg) is the only metal that is liquid at room temperature."
              }
            ]
          },
          {
            "number": 4,
            "title": "Carbon and its Compounds",
            "titleHi": "कार्बन एवं उसके यौगिक",
            "summary": "Covalent bonding in carbon compounds. Versatile nature of carbon (catenation, tetravalency). Homologous series. Nomenclature. Chemical properties: combustion, oxidation, addition, substitution. Ethanol and ethanoic acid. Soaps and detergents.",
            "summaryHi": "कार्बनिक यौगिकों में सहसंयोजी आबंधन। कार्बन की सर्वतोमुखी प्रकृति (श्रृंखलन, चतुःसंयोजकता)। समजातीय श्रेणी। एथेनॉल और एथेनोइक अम्ल। साबुन और अपमार्जक।",
            "keyConcepts": [
              "Covalent bond is formed by sharing of electron pairs",
              "Catenation is carbon's unique ability to form bonds with other carbon atoms",
              "Homologous series: differ by -CH2- unit and 14 u molecular mass",
              "Functional groups: Alcohol (-OH), Aldehyde (-CHO), Ketone (>C=O), Carboxylic acid (-COOH)",
              "Saponification: Ester + NaOH -> Soap + Alcohol",
              "Micelle formation: Hydrophilic head and hydrophobic hydrocarbon tail"
            ],
            "formulas": [
              "Alkanes: CnH2n+2",
              "Alkenes: CnH2n",
              "Alkynes: CnH2n-2",
              "CH₃COOH + C₂H₅OH + acid → CH₃COOC₂H₅ + H₂O (Esterification)"
            ],
            "importantQuestions": [
              {
                "question": "Explain the mechanism of the cleaning action of soaps with a labelled diagram of micelle.",
                "questionHi": "मिसेल के नामांकित चित्र की सहायता से साबुन की सफाई प्रक्रिया की क्रियाविधि समझाइए।",
                "solution": "Soap molecules have two ends: hydrophilic ionic head and hydrophobic hydrocarbon tail. When added to water, tails point inward towards oil/grease droplet and heads point outwards into water, forming a spherical structure called micelle. On rinsing, micelles are washed away.",
                "marks": 4
              }
            ],
            "mcqs": [
              {
                "question": "The molecular formula of butane is:",
                "options": [
                  "C4H8",
                  "C4H10",
                  "C4H6",
                  "C5H12"
                ],
                "correctIndex": 1,
                "explanation": "Butane is an alkane with 4 carbon atoms: CnH2n+2 = C4H10."
              }
            ]
          },
          {
            "number": 5,
            "title": "Life Processes",
            "titleHi": "जैव प्रक्रम",
            "summary": "Basic concepts of nutrition, respiration, transport and excretion in plants and animals.",
            "summaryHi": "सजीवों में पोषण, श्वसन, वहन तथा उत्सर्जन के मूल प्रक्रम।",
            "keyConcepts": [
              "Autotrophic nutrition (photosynthesis) vs Heterotrophic nutrition (holozoic, saprophytic, parasitic)",
              "Aerobic respiration (mitochondria, 36-38 ATP) vs Anaerobic respiration (cytoplasm, 2 ATP, lactic acid/ethanol)",
              "Human circulatory system: Double circulation, 4-chambered heart, arteries, veins, capillaries",
              "Excretory system: Nephron is structural and functional unit of kidney. Filtration, reabsorption, secretion"
            ],
            "formulas": [
              "6CO₂ + 12H₂O + sunlight + chlorophyll → C₆H₁₂O₆ + 6O₂ + 6H₂O",
              "Glucose → Pyruvate (cytoplasm) → CO₂ + H₂O + 38 ATP (mitochondria)"
            ],
            "importantQuestions": [
              {
                "question": "Describe double circulation in human beings. Why is it necessary?",
                "questionHi": "मानव में दोहरे परिसंचरण की व्याख्या कीजिए। यह क्यों आवश्यक है?",
                "solution": "Blood passes through the heart twice in one complete cycle: Pulmonary circulation (heart to lungs and back) and Systemic circulation (heart to rest of body and back). It prevents mixing of oxygenated and deoxygenated blood, ensuring high energy supply needed for warm-blooded humans.",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "The breakdown of pyruvate to give carbon dioxide, water and energy takes place in:",
                "options": [
                  "Cytoplasm",
                  "Mitochondria",
                  "Chloroplast",
                  "Nucleus"
                ],
                "correctIndex": 1,
                "explanation": "Aerobic respiration breaks down pyruvate in mitochondria to yield CO2, H2O and ATP."
              }
            ]
          },
          {
            "number": 6,
            "title": "Control and Coordination",
            "titleHi": "नियंत्रण एवं समन्वय",
            "summary": "Tropic movements in plants; Introduction to plant hormones; Control and coordination in animals: Nervous system; Voluntary, involuntary and reflex action; Chemical coordination: animal hormones.",
            "summaryHi": "पादपों में अनुवर्तन गतियाँ तथा पादप हॉर्मोन। जंतुओं में तंत्रिका तंत्र, ऐच्छिक व अनैच्छिक क्रियाएँ, प्रतिवर्ती चाप तथा अंतःस्रावी ग्रंथियाँ एवं हॉर्मोन।",
            "keyConcepts": [
              "Neuron: Dendrite -> Cell body -> Axon -> Synapse (chemical neurotransmitters)",
              "Reflex arc: Receptor -> Sensory neuron -> Spinal cord -> Motor neuron -> Effector",
              "Brain parts: Forebrain (thinking, cerebrum), Midbrain, Hindbrain (cerebellum for balance, medulla for involuntary, pons)",
              "Plant hormones: Auxin (cell elongation), Gibberellin (stem growth), Cytokinin (cell division), Abscisic Acid (stress/growth inhibitor)",
              "Endocrine glands: Pituitary (growth hormone), Thyroid (thyroxin - needs iodine), Pancreas (insulin - regulates blood sugar), Adrenal (adrenaline)"
            ],
            "formulas": [
              "Synapse: Electrical impulse → Neurotransmitter (acetylcholine) → Next dendrite"
            ],
            "importantQuestions": [
              {
                "question": "What is a reflex arc? Trace the sequence of events when you accidentally touch a hot object.",
                "questionHi": "प्रतिवर्ती चाप क्या है? जब आप किसी गर्म वस्तु को अचानक छूते हैं तो होने वाली घटनाओं के क्रम को लिखिए।",
                "solution": "Reflex arc is the pathway taken by nerve impulses in a reflex action. Skin thermoreceptors detect heat -> Sensory neuron carries signal to spinal cord -> Relay neuron -> Motor neuron sends signal -> Arm effector muscles contract and hand is pulled away instantly.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which plant hormone promotes cell division in fruits and seeds?",
                "options": [
                  "Auxin",
                  "Gibberellin",
                  "Cytokinin",
                  "Abscisic acid"
                ],
                "correctIndex": 2,
                "explanation": "Cytokinins are concentrated in areas of rapid cell division such as fruits and seeds."
              }
            ]
          },
          {
            "number": 7,
            "title": "How do Organisms Reproduce?",
            "titleHi": "जीव जनन कैसे करते हैं?",
            "summary": "Reproduction in animals and plants (asexual and sexual). Need for and methods of family planning. Safe sex vs HIV/AIDS. Child bearing and women's health.",
            "summaryHi": "पादपों एवं जंतुओं में जनन (अलैंगिक और लैंगिक)। परिवार नियोजन की विधियाँ, सुरक्षित यौन संबंध, महिला स्वास्थ्य।",
            "keyConcepts": [
              "Asexual: Fission (Amoeba, Leishmania), Fragmentation (Spirogyra), Regeneration (Planaria), Budding (Hydra, Yeast), Spore formation (Rhizopus), Vegetative propagation",
              "Sexual reproduction in flowering plants: Pollination (self/cross), double fertilization",
              "Human reproductive systems: Male (testes, sperm, testosterone), Female (ovary, egg, estrogen, progesterone, uterus, placenta)",
              "Menstrual cycle and fertilization in Fallopian tube",
              "Contraception: Barrier, Chemical, IUDs, Surgical (vasectomy, tubectomy)"
            ],
            "formulas": [
              "Pollen tube delivers male gametes to ovule → Zygote (2n) + Endosperm (3n)"
            ],
            "importantQuestions": [
              {
                "question": "What is pollination? How does it differ from fertilization? Explain double fertilization.",
                "questionHi": "परागकण क्या है? यह निषेचन से किस प्रकार भिन्न है? दोहरा निषेचन समझाइए।",
                "solution": "Pollination is transfer of pollen grains from anther to stigma. Fertilization is fusion of male and female gametes. Double fertilization in angiosperms: one male gamete fuses with egg (syngamy -> zygote), second fuses with 2 polar nuclei (triple fusion -> PEN).",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "In human females, fertilization of the egg takes place in the:",
                "options": [
                  "Uterus",
                  "Ovary",
                  "Fallopian tube",
                  "Vagina"
                ],
                "correctIndex": 2,
                "explanation": "Fertilization occurs in the ampullary region of the Fallopian tube (oviduct)."
              }
            ]
          },
          {
            "number": 8,
            "title": "Heredity and Evolution",
            "titleHi": "आनुवंशिकता एवं जैव विकास",
            "summary": "Heredity; Mendel's contribution - Laws for inheritance of traits: Sex determination: brief introduction.",
            "summaryHi": "आनुवंशिकता; मेंडल का योगदान - लक्षणों की वंशागति के नियम: लिंग निर्धारण की संक्षिप्त जानकारी।",
            "keyConcepts": [
              "Mendel's monohybrid cross: TT x tt -> F1 all Tt (tall). F2 phenotypic ratio 3:1 (Tall:Dwarf), genotypic 1:2:1",
              "Dihybrid cross (Round Yellow x Wrinkled Green): F2 ratio 9:3:3:1",
              "Law of Segregation and Law of Independent Assortment",
              "Sex determination in humans: 44 + XY (male) and 44 + XX (female). Male sperm determines child's sex (50% probability)"
            ],
            "formulas": [
              "Monohybrid F2: Phenotype 3:1, Genotype 1:2:1",
              "Dihybrid F2: 9:3:3:1"
            ],
            "importantQuestions": [
              {
                "question": "How is the sex of the child determined in human beings?",
                "questionHi": "मानव में बच्चे का लिंग निर्धारण कैसे होता है?",
                "solution": "Females have XX chromosomes and produce only X eggs. Males have XY chromosomes and produce 50% X sperms and 50% Y sperms. If an X sperm fertilizes the egg, child is female (XX). If a Y sperm fertilizes the egg, child is male (XY). Thus father's sperm determines sex.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "A cross between a tall pea plant (TT) and short pea plant (tt) resulted in progeny that were all tall plants because:",
                "options": [
                  "Tallness is the dominant trait",
                  "Shortness is dominant trait",
                  "Tallness is recessive trait",
                  "Height is not governed by genes"
                ],
                "correctIndex": 0,
                "explanation": "In heterozygous condition (Tt), only the dominant allele (T) expresses itself."
              }
            ]
          },
          {
            "number": 9,
            "title": "Light – Reflection and Refraction",
            "titleHi": "प्रकाश – परावर्तन तथा अपवर्तन",
            "summary": "Reflection of light by curved surfaces; Images formed by spherical mirrors, centre of curvature, principal axis, principal focus, focal length, mirror formula, magnification. Refraction; Laws of refraction, refractive index. Refraction of light by spherical lens; Image formed by spherical lenses; Lens formula; Magnification. Power of a lens.",
            "summaryHi": "गोलीय दर्पणों द्वारा प्रकाश का परावर्तन, दर्पण सूत्र तथा आवर्धन। अपवर्तन, अपवर्तनांक, गोलीय लेंसों द्वारा प्रकाश का अपवर्तन, लेंस सूत्र, आवर्धन तथा लेंस की क्षमता।",
            "keyConcepts": [
              "Mirror formula: 1/f = 1/v + 1/u, Magnification m = -v/u = h'/h",
              "Lens formula: 1/f = 1/v - 1/u, Magnification m = +v/u = h'/h",
              "Power of a lens P = 1 / f(in meters). Unit: Dioptre (D)",
              "Convex lens / Concave mirror: Converging. Concave lens / Convex mirror: Diverging",
              "Snell's Law: sin i / sin r = constant = n21"
            ],
            "formulas": [
              "1/v + 1/u = 1/f (Mirror)",
              "1/v - 1/u = 1/f (Lens)",
              "m = -v/u (Mirror), m = v/u (Lens)",
              "P = 1 / f (in metres) [Dioptres]"
            ],
            "importantQuestions": [
              {
                "question": "A concave lens has focal length of 15 cm. At what distance should the object from the lens be placed so that it forms an image at 10 cm from the lens? Also, find the magnification.",
                "questionHi": "किसी अवतल लेंस की फोकस दूरी 15 सेमी है। बिंब को लेंस से कितनी दूरी पर रखें कि इसका लेंस से 10 सेमी दूरी पर प्रतिबिंब बने? आवर्धन भी ज्ञात कीजिए।",
                "solution": "Concave lens: f = -15 cm, v = -10 cm. 1/f = 1/v - 1/u => 1/u = 1/v - 1/f = -1/10 - (-1/15) = -1/10 + 1/15 = -1/30. So u = -30 cm. Object distance is 30 cm. Magnification m = v/u = -10 / -30 = +1/3.",
                "marks": 4
              }
            ],
            "mcqs": [
              {
                "question": "A convex lens of focal length 20 cm produces a real, inverted image of the same size as the object. The object is placed at:",
                "options": [
                  "10 cm",
                  "20 cm",
                  "40 cm",
                  "Infinity"
                ],
                "correctIndex": 2,
                "explanation": "Same size real image is formed when object is at 2F = 2 x 20 = 40 cm."
              }
            ]
          },
          {
            "number": 10,
            "title": "The Human Eye and the Colourful World",
            "titleHi": "मानव नेत्र तथा रंगबिरंगा संसार",
            "summary": "Functioning of a lens in human eye, defects of vision and their corrections (Myopia, Hypermetropia, Presbyopia), applications of spherical mirrors and lenses. Refraction of light through a prism, dispersion of light, scattering of light, applications in daily life (twinkling of stars, blue colour of sky, reddish sunrise/sunset).",
            "summaryHi": "मानव नेत्र के भाग, दृष्टि दोष एवं उनका निवारण (निकट दृष्टि, दीर्घ दृष्टि, जरा-दूरदृष्टिता)। प्रिज्म से अपवर्तन, वर्ण विक्षेपण, प्रकाश का प्रकीर्णन (तारों का टिमटिमाना, आकाश का नीला रंग)।",
            "keyConcepts": [
              "Near point of normal eye = 25 cm, Far point = Infinity",
              "Myopia (near-sightedness): Image forms in front of retina. Corrected with concave lens",
              "Hypermetropia (far-sightedness): Image forms behind retina. Corrected with convex lens",
              "Dispersion: White light splits into 7 colours (VIBGYOR). Red bends least, Violet bends most",
              "Atmospheric refraction: Twinkling of stars, advanced sunrise (2 min) and delayed sunset (2 min)",
              "Tyndall Effect & Rayleigh Scattering: Intensity proportional to 1/lambda^4"
            ],
            "formulas": [
              "Scattering Intensity ∝ 1 / λ⁴",
              "Power of corrective lens P = 1 / f"
            ],
            "importantQuestions": [
              {
                "question": "Why does the sky appear dark instead of blue to an astronaut?",
                "questionHi": "किसी अंतरिक्ष यात्री को आकाश नीले की अपेक्षा काला क्यों दिखाई देता है?",
                "solution": "In outer space, there is no atmosphere and therefore no particulate matter to scatter sunlight. With no scattering of light reaching the astronaut's eyes, the sky appears completely dark.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "The defect of vision in which a person cannot see nearby objects clearly is called:",
                "options": [
                  "Myopia",
                  "Hypermetropia",
                  "Astigmatism",
                  "Cataract"
                ],
                "correctIndex": 1,
                "explanation": "Hypermetropia (farsightedness) makes nearby objects blurry, while distant objects are clear."
              }
            ]
          },
          {
            "number": 11,
            "title": "Electricity",
            "titleHi": "विद्युत",
            "summary": "Electric current, potential difference and electric current. Ohm's law; Resistance, Resistivity, Factors on which the resistance of a conductor depends. Series combination of resistors, parallel combination of resistors and its applications in daily life. Heating effect of electric current and its applications in daily life. Electric power, Interrelation between P, V, I and R.",
            "summaryHi": "विद्युत धारा, विभवांतर, ओम का नियम, प्रतिरोध, प्रतिरोधकता, प्रतिरोधकों का श्रेणी एवं पार्श्वक्रम संयोजन। विद्युत धारा का तापीय प्रभाव, विद्युत शक्ति।",
            "keyConcepts": [
              "Current I = Q / t (Amperes). Potential difference V = W / Q (Volts)",
              "Ohm's Law: V = I * R (at constant temperature)",
              "Resistance R = ρ * (L / A)",
              "Series: R_eq = R1 + R2 + R3 (current same)",
              "Parallel: 1/R_eq = 1/R1 + 1/R2 + 1/R3 (voltage same)",
              "Joule's Law of Heating: H = I²Rt",
              "Electric Power: P = VI = I²R = V²/R. 1 kWh = 3.6 x 10^6 J"
            ],
            "formulas": [
              "V = I × R",
              "R = ρ × (l / A)",
              "R_series = R₁ + R₂ + ...",
              "1/R_parallel = 1/R₁ + 1/R₂ + ...",
              "H = I²Rt = VIt",
              "P = VI = I²R = V²/R"
            ],
            "importantQuestions": [
              {
                "question": "State Ohm's Law. Draw a circuit diagram to verify it. Why are copper and aluminium wires usually employed for electricity transmission?",
                "questionHi": "ओम का नियम बताइए। इसे सत्यापित करने के लिए एक परिपथ आरेख खींचिए। बिजली के संचरण के लिए कॉपर तथा एल्युमिनियम के तारों का ही उपयोग क्यों किया जाता है?",
                "solution": "Ohm's Law: The electric current flowing through a metallic conductor is directly proportional to the potential difference across its ends, provided temperature remains constant (V = IR). Copper and aluminium have very low electrical resistivity, minimizing heat energy loss during long distance transmission.",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "A cylindrical conductor of length l and uniform area of cross-section A has resistance R. Another conductor of length 2l and resistance R of the same material has area of cross section:",
                "options": [
                  "A/2",
                  "3A/2",
                  "2A",
                  "3A"
                ],
                "correctIndex": 2,
                "explanation": "R = ρ l / A. New resistance R' = ρ (2l) / A'. Since R' = R, ρ (2l) / A' = ρ l / A => A' = 2A."
              }
            ]
          },
          {
            "number": 12,
            "title": "Magnetic Effects of Electric Current",
            "titleHi": "विद्युत धारा के चुंबकीय प्रभाव",
            "summary": "Magnetic field, field lines, field due to a current carrying conductor, field due to current carrying coil or solenoid; Force on current carrying conductor, Fleming's Left Hand Rule, Direct current. Alternating current: frequency of AC. Advantage of AC over DC. Domestic electric circuits.",
            "summaryHi": "चुंबकीय क्षेत्र, क्षेत्र रेखाएँ, धारावाही चालक तथा परिनालिका के कारण चुंबकीय क्षेत्र। धारावाही चालक पर बल, फ्लेमिंग का वामहस्त नियम। दिष्ट तथा प्रत्यावर्ती धारा, घरेलू विद्युत परिपथ।",
            "keyConcepts": [
              "Magnetic field lines emerge from North pole and enter South pole outside magnet; inside from S to N",
              "Right Hand Thumb Rule: Direction of magnetic field lines around a straight wire",
              "Solenoid produces uniform magnetic field inside, behaves like a bar magnet",
              "Fleming's Left Hand Rule: Thumb = Motion/Force, Forefinger = Magnetic Field, Centre finger = Current",
              "Domestic circuit: Live (220V, Red/Brown), Neutral (0V, Black/Blue), Earth (Green/Yellow). Earth wire protects from electric shock"
            ],
            "formulas": [
              "F = B × I × L × sin θ",
              "Domestic AC: 220 V, 50 Hz in India"
            ],
            "importantQuestions": [
              {
                "question": "Explain the principle and function of an earth wire in domestic electric appliances.",
                "questionHi": "घरेलू विद्युत परिपथों में भूसंपर्क तार का क्या कार्य है? धातुआवरण वाले विद्युत साधित्रों को भूसंपर्कित करना क्यों आवश्यक है?",
                "solution": "The green earth wire connects metallic casing of appliances to a metal plate buried deep in ground. If live wire touches metallic casing due to faulty insulation, current immediately flows safely into the ground through the low resistance earth wire instead of passing through human body, protecting user from fatal electric shocks.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "At the time of short circuit, the current in the circuit:",
                "options": [
                  "Reduces substantially",
                  "Does not change",
                  "Increases heavily",
                  "Varies continuously"
                ],
                "correctIndex": 2,
                "explanation": "During short circuit, resistance drops close to zero, causing electric current to increase drastically."
              }
            ]
          },
          {
            "number": 13,
            "title": "Our Environment",
            "titleHi": "हमारा पर्यावरण",
            "summary": "Eco-system, Environmental problems, Ozone depletion, waste production and their solutions. Biodegradable and non-biodegradable substances.",
            "summaryHi": "पारितंत्र, पर्यावरणीय समस्याएँ, ओजोन परत का क्षय, कचरा प्रबंधन। जैव निम्नीकरणीय एवं अजैव निम्नीकरणीय अपशिष्ट।",
            "keyConcepts": [
              "Trophic levels: Producers -> Herbivores (Primary) -> Carnivores (Secondary) -> Apex",
              "10% Law of energy transfer: Only 10% energy moves from one trophic level to next",
              "Biological Biomagnification: Progressive accumulation of non-biodegradable toxic chemicals (e.g. DDT) at higher trophic levels",
              "Ozone (O3) layer absorbs harmful UV-B radiation. Depletion caused by CFCs. Montreal Protocol 1987 frozen CFC production"
            ],
            "formulas": [
              "10% Energy Transfer: E(n+1) = 0.10 × E(n)",
              "O₂ + UV → O + O; O + O₂ → O₃ (Ozone)"
            ],
            "importantQuestions": [
              {
                "question": "What is biological magnification? Will the levels of this magnification be different at different levels of the ecosystem?",
                "questionHi": "जैव आवर्धन क्या है? क्या पारितंत्र के विभिन्न स्तरों पर यह आवर्धन भिन्न-भिन्न होगा?",
                "solution": "Biological magnification is the progressive increase in concentration of harmful non-biodegradable chemicals at successive trophic levels in a food chain. Yes, it increases at each higher level and is maximum at the topmost trophic level (humans/apex predators).",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "If 10,000 J of energy is available to producers, how much energy will be available to secondary consumers?",
                "options": [
                  "1000 J",
                  "100 J",
                  "10 J",
                  "1 J"
                ],
                "correctIndex": 1,
                "explanation": "Producers (10,000 J) -> Primary consumers (1000 J) -> Secondary consumers (100 J)."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "social_science",
    "name": "Social Science",
    "nameHi": "सामाजिक विज्ञान",
    "code": "087",
    "icon": "public",
    "color": "#D97706",
    "books": [
      {
        "id": "history",
        "title": "History: India and the Contemporary World - II",
        "titleHi": "इतिहास: भारत और समकालीन विश्व - २",
        "chapters": [
          {
            "number": 1,
            "title": "The Rise of Nationalism in Europe",
            "titleHi": "यूरोप में राष्ट्रवाद का उदय",
            "summary": "French Revolution and idea of Nation, Making of Nationalism in Europe, Age of Revolutions (1830-1848), Unification of Germany and Italy, Visualising the Nation, Nationalism and Imperialism.",
            "summaryHi": "फ्रांसीसी क्रांति और राष्ट्र का विचार, यूरोप में राष्ट्रवाद का निर्माण, क्रांतियों का युग (1830-1848), जर्मनी और इटली का एकीकरण, राष्ट्र की दृश्य-कल्पना।",
            "keyConcepts": [
              "Frederic Sorrieu's 1848 utopian vision of democratic republics",
              "Napoleonic Code (Civil Code of 1804): Equality before law, secured property rights, abolished feudal system",
              "Treaty of Vienna 1815 hosted by Duke Metternich restored conservative monarchies",
              "Unification of Germany: Otto von Bismarck ('Blood and Iron' policy), King Wilhelm I proclaimed Kaiser at Versailles in 1871",
              "Unification of Italy: Giuseppe Mazzini (Young Italy), Count Cavour (diplomat), Giuseppe Garibaldi (Red Shirts), Victor Emmanuel II",
              "Allegories: Marianne (France) and Germania (Germany, wearing crown of oak leaves signifying heroism)"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Explain the major features of the Napoleonic Code of 1804.",
                "questionHi": "1804 की नेपोलियन नागरिक संहिता की प्रमुख विशेषताओं की व्याख्या कीजिए।",
                "solution": "1. Did away with all privileges based on birth. 2. Established equality before the law. 3. Secured the right to property. 4. Abolished feudal system and freed peasants from serfdom. 5. Uniform weights, measures and common currency were introduced.",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "Who was proclaimed the German Emperor after unification in 1871?",
                "options": [
                  "Kaiser William I",
                  "Otto von Bismarck",
                  "Victor Emmanuel II",
                  "Giuseppe Mazzini"
                ],
                "correctIndex": 0,
                "explanation": "Kaiser William I of Prussia was proclaimed German Emperor at the Hall of Mirrors in Versailles in January 1871."
              }
            ]
          },
          {
            "number": 2,
            "title": "Nationalism in India",
            "titleHi": "भारत में राष्ट्रवाद",
            "summary": "First World War, Khilafat and Non-Cooperation, Differing Strands within the Movement, Towards Civil Disobedience, The Salt March and Civil Disobedience Movement, The Sense of Collective Belonging.",
            "summaryHi": "प्रथम विश्व युद्ध, खिलाफत और असहयोग आंदोलन, सविनय अवज्ञा की ओर, नमक यात्रा एवं सविनय अवज्ञा आंदोलन, सामूहिक अपनेपन का भाव।",
            "keyConcepts": [
              "Satyagraha: Truth and non-violence. Champaran (1917), Kheda (1917), Ahmedabad Mill Strike (1918)",
              "Rowlatt Act (1919) and Jallianwala Bagh Massacre (13 April 1919) ordered by General Dyer",
              "Non-Cooperation Movement (1920-1922): Surrender of titles, boycott of foreign goods, Chauri Chaura incident led to withdrawal",
              "Dandi March: 12 March 1930 to 6 April 1930, 240 miles from Sabarmati to Dandi, breaking salt law",
              "Gandhi-Irwin Pact 1931 and Poona Pact 1932 (Dr. B.R. Ambedkar and Mahatma Gandhi)",
              "Symbols of nationalism: Bharat Mata image by Abanindranath Tagore, Tricolour flag, revival of folklore"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did Mahatma Gandhi decide to call off the Civil Disobedience Movement and sign the Gandhi-Irwin Pact in 1931?",
                "questionHi": "महात्मा गांधी ने 1931 में सविनय अवज्ञा आंदोलन वापस लेने और गांधी-इरविन समझौते पर हस्ताक्षर करने का निर्णय क्यों लिया?",
                "solution": "Brutal government repression (arrest of Khan Abdul Ghaffar Khan and Gandhiji), violent clashes in Peshawar and Sholapur, attacks on police posts and municipal buildings. Gandhi sought peaceful resolution, leading to the Gandhi-Irwin Pact where Congress agreed to attend Second Round Table Conference in return for release of political prisoners.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "At which Congress session was the resolution of 'Poorna Swaraj' (Complete Independence) adopted in 1929?",
                "options": [
                  "Calcutta Session",
                  "Lahore Session",
                  "Madras Session",
                  "Nagpur Session"
                ],
                "correctIndex": 1,
                "explanation": "Under the presidency of Jawaharlal Nehru, the Lahore Congress of December 1929 formalised the demand of Poorna Swaraj."
              }
            ]
          },
          {
            "number": 3,
            "title": "The Making of a Global World",
            "titleHi": "भूमंडलीकृत विश्व का बनना",
            "summary": "Pre-modern world, Silk routes, Conquest, Disease and Trade, 19th Century global economy, Inter-war economy, Great Depression, Rebuilding world economy post-WWII (Bretton Woods institutions).",
            "summaryHi": "प्राक-आधुनिक विश्व, रेशम मार्ग, विजय, बीमारी और व्यापार, उन्नीसवीं सदी में वैश्विक अर्थव्यवस्था, महामंदी, ब्रेटन वुड्स संस्थान।",
            "keyConcepts": [
              "Silk routes linked Asia with Europe and northern Africa",
              "Rinderpest (Cattle Plague) in Africa in 1890s destroyed 90% cattle, forcing Africans into wage labour market",
              "Indentured labour migration from India (Fiji, Trinidad, Guyana, Mauritius)",
              "Great Depression (1929-mid 1930s): Wall Street Crash, agricultural overproduction, collapse of global banking",
              "Bretton Woods Conference (1944): IMF and World Bank set up to maintain post-war financial stability"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Explain the three types of movements or 'flows' within international economic exchanges in the nineteenth century.",
                "questionHi": "उन्नीसवीं सदी में अंतरराष्ट्रीय आर्थिक विनिमय के तीन प्रकार के प्रवाहों की व्याख्या कीजिए।",
                "solution": "1. Flow of trade (trade in goods like cloth or wheat). 2. Flow of labour (migration of people in search of employment). 3. Flow of capital (short-term and long-term investments over long distances).",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "The Bretton Woods Twins refers to:",
                "options": [
                  "UN and WTO",
                  "IMF and World Bank",
                  "UNESCO and UNICEF",
                  "NATO and SEATO"
                ],
                "correctIndex": 1,
                "explanation": "The International Monetary Fund (IMF) and the World Bank are known as the Bretton Woods twins."
              }
            ]
          },
          {
            "number": 4,
            "title": "The Age of Industrialisation",
            "titleHi": "औद्योगिकीकरण का युग",
            "summary": "Proto-industrialisation, factories coming up, pace of industrial change, hand labour vs steam power, industrialisation in colonies, market for goods.",
            "summaryHi": "कारखानों का उदय, औद्योगिक परिवर्तन की गति, हाथ का श्रम और वाष्प शक्ति, उपनिवेशों में औद्योगिकीकरण, वस्तुओं के लिए बाजार।",
            "keyConcepts": [
              "Proto-industrialisation: decentralized phase of industrialisation before modern factories",
              "First factory in England established in 1730s; Cotton industry boomed with Richard Arkwright's cotton mill",
              "Why Victorian industrialists preferred hand labour: seasonal demand, abundance of cheap workers, intricate designs",
              "Gomasthas: paid servants appointed by East India Company to supervise weavers and collect supplies",
              "Advertisement and calendar art to create consumer markets"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did industrial production in India increase during the First World War?",
                "questionHi": "प्रथम विश्व युद्ध के दौरान भारत में औद्योगिक उत्पादन में वृद्धि क्यों हुई?",
                "solution": "1. British mills became busy meeting war supplies; imports to India declined. 2. Indian factories were asked to supply war materials (jute bags, cloth uniforms, tents, boots). 3. New factories were set up and old ones ran multiple shifts, creating immense boom.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Who created the cotton mill that brought all production processes under one roof?",
                "options": [
                  "James Watt",
                  "Richard Arkwright",
                  "Samuel Crompton",
                  "Matthew Boulton"
                ],
                "correctIndex": 1,
                "explanation": "Richard Arkwright created the cotton mill where carding, twisting, spinning and rolling were done under one roof."
              }
            ]
          },
          {
            "number": 5,
            "title": "Print Culture and the Modern World",
            "titleHi": "मुद्रण संस्कृति और आधुनिक दुनिया",
            "summary": "First printed books in China, Japan and Korea. Print comes to Europe. Gutenberg press. The Print Revolution and its impact. Religious debates, French Revolution, 19th Century developments. India and the world of print.",
            "summaryHi": "चीन, जापान और कोरिया में मुद्रण, यूरोप में प्रिंट, गुटेनबर्ग प्रेस, प्रिंट क्रांति, धार्मिक सुधार और प्रिंट, भारत में प्रिंट संस्कृति।",
            "keyConcepts": [
              "Woodblock printing originated in China; Marco Polo brought knowledge to Italy in 1295",
              "Johannes Gutenberg invented mechanical movable type printing press in 1430s; first printed book was the Bible",
              "Martin Luther's 95 Theses (1517) sparked Protestant Reformation: 'Print is the ultimate gift of God'",
              "Print created public sphere of debate, critical thinking that helped question monarchies (French Revolution)",
              "First printing press in India brought to Goa by Portuguese Jesuits in mid-16th century",
              "Vernacular Press Act 1878 passed by Lord Lytton modelled on Irish Press Laws to censor Indian newspapers"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did Martin Luther praise print culture as the greatest gift of God?",
                "questionHi": "मार्टिन लूथर ने मुद्रण को ईश्वर का महानतम उपहार बताते हुए उसकी प्रशंसा क्यों की?",
                "solution": "In 1517, Luther wrote Ninety Five Theses criticizing corrupt practices of Roman Catholic Church. Printed copies were posted on church door at Wittenberg and widely read. Within weeks, thousands of copies circulated across Germany, directly giving birth to the Protestant Reformation.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "The first printed book produced on Gutenberg's printing press was:",
                "options": [
                  "The Quran",
                  "The Bible",
                  "The Ramayana",
                  "The Odyssey"
                ],
                "correctIndex": 1,
                "explanation": "The first book Gutenberg printed was the Bible. About 180 copies were printed in 3 years."
              }
            ]
          }
        ]
      },
      {
        "id": "geography",
        "title": "Geography: Contemporary India - II",
        "titleHi": "भूगोल: समकालीन भारत - २",
        "chapters": [
          {
            "number": 1,
            "title": "Resources and Development",
            "titleHi": "संसाधन एवं विकास",
            "summary": "Types of resources, development of resources, resource planning in India, land resources, land utilization, land degradation and conservation measures, soil classification.",
            "summaryHi": "संसाधनों के प्रकार, संसाधनों का विकास, भारत में संसाधन नियोजन, भू-उपयोग, भू-निम्नीकरण और संरक्षण, मृदा वर्गीकरण।",
            "keyConcepts": [
              "Biotic/Abiotic, Renewable/Non-renewable, National/International",
              "Agenda 21 and Rio Earth Summit 1992",
              "Alluvial, Black (Regur), Red & Yellow, Laterite, Arid, Forest soils",
              "Soil erosion: Gully erosion, sheet erosion"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Describe any three measures to control soil erosion in hilly and mountainous regions.",
                "questionHi": "पहाड़ी क्षेत्रों में मृदा अपरदन की रोकथाम के तीन उपाय बताइए।",
                "solution": "Contour ploughing, Terrace farming, Strip cropping.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Black soil is also known as:",
                "options": [
                  "Bangar",
                  "Regur",
                  "Khadar",
                  "Laterite"
                ],
                "correctIndex": 1,
                "explanation": "Black soil is known as Regur soil and is ideal for cotton cultivation."
              }
            ]
          },
          {
            "number": 2,
            "title": "Forest and Wildlife Resources",
            "titleHi": "वन एवं वन्यजीव संसाधन",
            "summary": "Biodiversity, flora and fauna in India, categories of species (IUCN), causes of depletion, conservation of forest and wildlife, Project Tiger, community and conservation.",
            "summaryHi": "जैव विविधता, भारत में वनस्पतिजात और प्राणिजात, आईयूसीएन वर्गीकरण, संरक्षण के उपाय, प्रोजेक्ट टाइगर, समुदाय और वन संरक्षण।",
            "keyConcepts": [
              "Endangered, vulnerable, rare, endemic species",
              "Project Tiger launched in 1973",
              "Reserved, Protected, and Unclassed forests",
              "Chipko Movement, Beej Bachao Andolan, Joint Forest Management (JFM)"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Differentiate between Reserved and Protected forests.",
                "questionHi": "आरक्षित और रक्षित वनों में अंतर स्पष्ट कीजिए।",
                "solution": "Reserved forests are permanently earmarked for timber and wildlife production with strict restrictions. Protected forests are protected from further depletion with limited local access.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Project Tiger was launched in India in:",
                "options": [
                  "1951",
                  "1973",
                  "1985",
                  "1992"
                ],
                "correctIndex": 1,
                "explanation": "Project Tiger was launched in 1973 to save Bengal tigers from extinction."
              }
            ]
          },
          {
            "number": 3,
            "title": "Water Resources",
            "titleHi": "जल संसाधन",
            "summary": "Water scarcity and need for conservation, multi-purpose river projects and integrated water resources management, rainwater harvesting.",
            "summaryHi": "जल दुर्लभता और जल संरक्षण की आवश्यकता, बहुउद्देशीय नदी परियोजनाएं, वर्षा जल संग्रहण।",
            "keyConcepts": [
              "Jawaharlal Nehru called multipurpose dams 'Temples of modern India'",
              "Rainwater harvesting: Rooftop harvesting, Guls/Kuls in Himalayas, Khadins and Johads in Rajasthan, Tankas"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Explain rooftop rainwater harvesting system.",
                "questionHi": "छत पर वर्षा जल संग्रहण प्रणाली को समझाइए।",
                "solution": "Rainwater falling on roofs is routed through PVC pipes into underground tanks or sumps after passing through sand-gravel filters.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "In which state is rooftop rainwater harvesting legally mandatory for all houses?",
                "options": [
                  "Rajasthan",
                  "Tamil Nadu",
                  "Gujarat",
                  "Kerala"
                ],
                "correctIndex": 1,
                "explanation": "Tamil Nadu is the first state in India to make rooftop rainwater harvesting compulsory."
              }
            ]
          },
          {
            "number": 4,
            "title": "Agriculture",
            "titleHi": "कृषि",
            "summary": "Types of farming, cropping patterns (Rabi, Kharif, Zaid), major crops (food and non-food), institutional and technological reforms, food security.",
            "summaryHi": "कृषि के प्रकार (प्रारंभिक, गहन जीविका, वाणिज्यिक), फसल प्रारूप (रबी, खरीफ, जायद), मुख्य फसलें, संस्थागत एवं तकनीकी सुधार।",
            "keyConcepts": [
              "Kharif (June-Oct): Rice, Maize, Cotton. Rabi (Oct-April): Wheat, Mustard. Zaid (Summer): Watermelon, Cucumber",
              "Major crops: Rice (high temp >25C, >100cm rainfall), Wheat (cool growing season, 50-75cm rainfall), Tea, Coffee, Sugarcane",
              "Bhoodan - Gramdan movement started by Vinoba Bhave ('Blood-less Revolution')"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Distinguish between Kharif and Rabi cropping seasons with two examples each.",
                "questionHi": "खरीफ और रबी फसलों में अंतर बताइए तथा प्रत्येक के दो उदाहरण दीजिए।",
                "solution": "Kharif: Sown at onset of monsoon (June-July), harvested in Sep-Oct (e.g. Paddy, Maize). Rabi: Sown in winter (Oct-Dec), harvested in spring (April-June) (e.g. Wheat, Gram).",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which of the following is a leguminous crop?",
                "options": [
                  "Pulses",
                  "Jowar",
                  "Millets",
                  "Sesamum"
                ],
                "correctIndex": 0,
                "explanation": "Pulses are leguminous crops that fix atmospheric nitrogen in soil."
              }
            ]
          },
          {
            "number": 5,
            "title": "Minerals and Energy Resources",
            "titleHi": "खनिज तथा ऊर्जा संसाधन",
            "summary": "What is a mineral, mode of occurrence of minerals, ferrous and non-ferrous minerals, non-metallic and rock minerals, conservation of minerals, conventional and non-conventional energy resources.",
            "summaryHi": "खनिज क्या हैं, खनिजों की उपलब्धता, लौह और अलौह खनिज, ऊर्जा के पारंपरिक और गैर-पारंपरिक स्रोत।",
            "keyConcepts": [
              "Ferrous (Iron ore: Magnetite 70% Fe, Haematite 50-60% Fe), Non-ferrous (Bauxite, Copper)",
              "Non-metallic: Mica (Koderma-Gaya-Hazaribagh belt)",
              "Conventional: Coal (Anthracite, Bituminous, Lignite, Peat), Petroleum (Mumbai High, Digboi), Natural gas",
              "Non-conventional: Solar, Wind, Biogas, Tidal, Geothermal energy"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why is solar energy called the energy resource of the future in India?",
                "questionHi": "भारत में सौर ऊर्जा को भविष्य का ऊर्जा स्रोत क्यों कहा जाता है?",
                "solution": "India is a tropical country with roughly 300 sunny days per year. It is renewable, abundant, eco-friendly, and ideal for rural and remote areas.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which is the highest quality hard coal?",
                "options": [
                  "Lignite",
                  "Bituminous",
                  "Peat",
                  "Anthracite"
                ],
                "correctIndex": 3,
                "explanation": "Anthracite is the highest quality coal containing over 80% carbon."
              }
            ]
          },
          {
            "number": 6,
            "title": "Manufacturing Industries",
            "titleHi": "विनिर्माण उद्योग",
            "summary": "Importance of manufacturing, contribution to national economy, industrial location, classification of industries, agro-based and mineral-based industries, industrial pollution and environmental degradation.",
            "summaryHi": "विनिर्माण का महत्व, राष्ट्रीय अर्थव्यवस्था में योगदान, उद्योगों का वर्गीकरण (कृषि आधारित एवं खनिज आधारित), औद्योगिक प्रदूषण और पर्यावरण क्षरण।",
            "keyConcepts": [
              "Manufacturing is backbone of economic development; modernises agriculture and reduces unemployment",
              "Classification: Agro-based (Cotton, Jute, Sugar) vs Mineral-based (Iron & Steel, Aluminium, Cement)",
              "Agglomeration economies: industries come together to benefit from urban infrastructure",
              "Pollution types: Air, Water, Thermal, Noise pollution and treatment of industrial effluents"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why is the iron and steel industry called the basic or key industry?",
                "questionHi": "लोहा और इस्पात उद्योग को बुनियादी उद्योग क्यों कहा जाता है?",
                "solution": "Because all other industries (heavy, medium and light) depend on it for their machinery, tools, construction, defense and transport vehicles.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which city is known as the electronic capital of India?",
                "options": [
                  "Hyderabad",
                  "Bengaluru",
                  "Pune",
                  "Noida"
                ],
                "correctIndex": 1,
                "explanation": "Bengaluru has emerged as the electronic and IT capital of India."
              }
            ]
          },
          {
            "number": 7,
            "title": "Lifelines of National Economy",
            "titleHi": "राष्ट्रीय अर्थव्यवस्था की जीवन रेखाएँ",
            "summary": "Transport: Roadways, Railways, Pipelines, Waterways, Major Sea Ports, Airways. Communication: Personal and mass communication. International trade. Tourism as a trade.",
            "summaryHi": "परिवहन (सड़क, रेल, पाइपलाइन, जलमार्ग, प्रमुख पत्तन, वायुमार्ग), संचार के साधन, अंतरराष्ट्रीय व्यापार, पर्यटन।",
            "keyConcepts": [
              "Golden Quadrilateral Super Highways connecting Delhi-Kolkata-Chennai-Mumbai by NHAI",
              "Railways: Largest public sector undertaking; 16 zones",
              "Major ports: Kandla (Deendayal, tidal), Mumbai (largest), Marmagao, Kochi, Chennai, Kolkata",
              "National Waterways: NW-1 (Ganga: Prayagraj to Haldia, 1620 km)",
              "Tourism promotes national integration and brings foreign exchange"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "State any three advantages of pipeline transport in India.",
                "questionHi": "भारत में पाइपलाइन परिवहन के तीन लाभ बताइए।",
                "solution": "1. Convenient for transporting crude oil, petroleum products and natural gas without trans-shipment losses. 2. Can be laid through tough terrains. 3. Low operating running costs once constructed.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which of the following ports is the oldest artificial port of India?",
                "options": [
                  "Mumbai",
                  "Chennai",
                  "Kolkata",
                  "Kandla"
                ],
                "correctIndex": 1,
                "explanation": "Chennai is one of the oldest artificial ports in India, next to Mumbai in trade volume."
              }
            ]
          }
        ]
      },
      {
        "id": "political_science",
        "title": "Political Science: Democratic Politics - II",
        "titleHi": "राजनीति विज्ञान: लोकतांत्रिक राजनीति - २",
        "chapters": [
          {
            "number": 1,
            "title": "Power Sharing",
            "titleHi": "सत्ता की साझेदारी",
            "summary": "Case studies of Belgium and Sri Lanka. Why power sharing is desirable (Prudential and Moral reasons). Forms of power sharing.",
            "summaryHi": "बेल्जियम और श्रीलंका के उदाहरण। सत्ता की साझेदारी क्यों जरूरी है (युक्तिपरक और नैतिक तर्क)। सत्ता की साझेदारी के रूप।",
            "keyConcepts": [
              "Belgium accommodation: Equal Dutch and French ministers, Community government",
              "Sri Lanka Majoritarianism: Sinhala supremacy, Buddhism state religion, civil war with LTTE",
              "Forms: Horizontal (Legislature, Executive, Judiciary), Vertical (Federal), Social groups, Political parties"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Differentiate between horizontal and vertical power sharing.",
                "questionHi": "क्षैतिज और ऊर्ध्वाधर सत्ता की साझेदारी में अंतर स्पष्ट कीजिए।",
                "solution": "Horizontal power sharing shares power among different organs of government at the same level (Legislature, Executive, Judiciary) with checks and balances. Vertical power sharing shares power among governments at different levels (Central, State, Local).",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "What led to tension between Dutch-speaking and French-speaking communities in Belgium?",
                "options": [
                  "French were minority but relatively rich and powerful",
                  "Dutch were very rich",
                  "Religious conflict",
                  "Border dispute"
                ],
                "correctIndex": 0,
                "explanation": "French minority was richer and more powerful, causing resentment among majority Dutch."
              }
            ]
          },
          {
            "number": 2,
            "title": "Federalism",
            "titleHi": "संघवाद",
            "summary": "What is federalism, key features of federalism, what makes India a federal country (Union, State, Concurrent lists), how federalism is practised, decentralisation in India (73rd and 74th Amendments 1992).",
            "summaryHi": "संघवाद क्या है, इसके प्रमुख लक्षण, भारत में संघीय व्यवस्था (संघ, राज्य, समवर्ती सूची), भाषाई राज्य, भाषा नीति, 1992 का विकेंद्रीकरण।",
            "keyConcepts": [
              "Union List (Defense, Foreign Affairs), State List (Police, Agriculture), Concurrent List (Education, Forests)",
              "Holding together federation (India, Spain) vs Coming together federation (USA, Switzerland)",
              "1992 Decentralisation: Mandatory regular panchayat elections, 1/3 reservation for women, State Election Commission, State Finance Commission"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Explain any three major steps taken towards decentralisation in India in 1992.",
                "questionHi": "1992 में भारत में विकेंद्रीकरण के लिए उठाए गए तीन प्रमुख कदमों की व्याख्या कीजिए।",
                "solution": "1. Mandatory to hold regular elections to local government bodies. 2. Seats reserved for SC, ST, OBC and at least one-third reserved for women. 3. Creation of independent State Election Commission.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Subjects like computer software that do not fall in any of the three lists are called:",
                "options": [
                  "Union subjects",
                  "State subjects",
                  "Residuary subjects",
                  "Concurrent subjects"
                ],
                "correctIndex": 2,
                "explanation": "Subjects not included in the three original lists are Residuary subjects, legislated solely by the Union Parliament."
              }
            ]
          },
          {
            "number": 3,
            "title": "Gender, Religion and Caste",
            "titleHi": "जाति, धर्म और लैंगिक मसले",
            "summary": "Gender and politics: Public/private division, women's political representation. Religion, communalism and politics: Communal politics, secular state. Caste and politics: Caste inequalities, caste in politics, politics in caste.",
            "summaryHi": "लैंगिक मसले और राजनीति, महिला प्रतिनिधित्व। धर्म, सांप्रदायिकता और धर्मनिरपेक्ष शासन। जाति और राजनीति, राजनीति में जाति।",
            "keyConcepts": [
              "Sexual division of labour, Feminist movements, Nari Shakti Vandan Adhiniyam (women's reservation)",
              "Secular state in India: No official state religion, freedom to profess/practice, prohibition of discrimination",
              "Caste in politics (vote banks, candidate selection) vs Politics in caste (sub-castes merging, backward classes coalition)"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Mention any three constitutional provisions that make India a secular state.",
                "questionHi": "भारत को धर्मनिरपेक्ष राज्य बनाने वाले किन्हीं तीन संवैधानिक प्रावधानों का उल्लेख कीजिए।",
                "solution": "1. There is no official religion for the Indian State. 2. The Constitution provides freedom to profess, practice and propagate any religion. 3. It strictly prohibits discrimination on grounds of religion.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "A person who believes in equal rights and opportunities for women and men is called a:",
                "options": [
                  "Communalist",
                  "Feminist",
                  "Secularist",
                  "Castist"
                ],
                "correctIndex": 1,
                "explanation": "A feminist is someone who advocates equal social, political and economic rights for women."
              }
            ]
          },
          {
            "number": 4,
            "title": "Political Parties",
            "titleHi": "राजनीतिक दल",
            "summary": "Why do we need political parties? Meaning, functions, necessity. How many parties should we have? National and State parties. Challenges to political parties. How can parties be reformed?",
            "summaryHi": "राजनीतिक दलों की आवश्यकता, कार्य, राष्ट्रीय एवं क्षेत्रीय दल, राजनीतिक दलों की चुनौतियाँ तथा सुधार के उपाय।",
            "keyConcepts": [
              "Three components: Leaders, Active members, Followers",
              "Functions: Contest elections, put forward policies, make laws, form government, play role of opposition, shape public opinion",
              "National party criteria: 6% valid votes in Lok Sabha or 4 states + 4 Lok Sabha seats",
              "Challenges: Lack of internal democracy, dynastic succession, money and muscle power, lack of meaningful choice",
              "Reforms: Anti-Defection Law, affidavit of assets and criminal cases, mandatory organizational elections"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Describe any three challenges faced by political parties in India.",
                "questionHi": "भारत में राजनीतिक दलों के समक्ष किन्हीं तीन चुनौतियों का वर्णन कीजिए।",
                "solution": "1. Lack of internal democracy (power concentrated in top leaders). 2. Dynastic succession (tickets given to relatives). 3. Growing role of money and muscle power during elections.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which of the following countries has a two-party system?",
                "options": [
                  "India",
                  "United States of America",
                  "China",
                  "France"
                ],
                "correctIndex": 1,
                "explanation": "The USA and the UK are primary examples of a two-party political system."
              }
            ]
          },
          {
            "number": 5,
            "title": "Outcomes of Democracy",
            "titleHi": "लोकतंत्र के परिणाम",
            "summary": "How do we assess democracy's outcomes? Accountable, responsive and legitimate government. Economic growth and development. Reduction of inequality and poverty. Accommodation of social diversity. Dignity and freedom of the citizens.",
            "summaryHi": "लोकतंत्र के परिणामों का मूल्यांकन: उत्तरदायी, जिम्मेदार और वैध शासन, आर्थिक संवृद्धि और विकास, सामाजिक विविधता का सामंजस्य, नागरिकों की गरिमा और आजादी।",
            "keyConcepts": [
              "Democracy promotes equality, enhances individual dignity, improves decision quality, resolves conflicts, and allows room to correct mistakes",
              "Democracy is transparent through Right to Information (RTI)",
              "Economic performance might be slower than authoritarian regimes, but democracy guarantees social justice, civil liberties and human dignity"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why is democracy considered a better form of government than dictatorship?",
                "questionHi": "तानाशाही की तुलना में लोकतंत्र को शासन का बेहतर रूप क्यों माना जाता है?",
                "solution": "1. Promotes equality among citizens. 2. Enhances the dignity of the individual. 3. Improves the quality of decision making through consultation. 4. Provides a peaceful method to resolve conflicts. 5. Allows room to correct mistakes.",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "Which factor is often seen as a legitimate weakness of democracy compared to dictatorships?",
                "options": [
                  "Corruption",
                  "Decision-making delay due to consultation",
                  "Lack of dignity",
                  "Absence of elections"
                ],
                "correctIndex": 1,
                "explanation": "Democracies require debate, deliberations and consensus, which can make decision making slower."
              }
            ]
          }
        ]
      },
      {
        "id": "economics",
        "title": "Economics: Understanding Economic Development",
        "titleHi": "अर्थशास्त्र: आर्थिक विकास की समझ",
        "chapters": [
          {
            "number": 1,
            "title": "Development",
            "titleHi": "विकास",
            "summary": "What development promises - different people, different goals. Income and other goals. National development. How to compare different countries or states? (Per capita income, HDI). Public facilities. Sustainability of development.",
            "summaryHi": "विकास क्या वादा करता है - विभिन्न व्यक्ति, विभिन्न लक्ष्य। आय और अन्य लक्ष्य। राष्ट्रीय विकास। प्रति व्यक्ति आय एवं मानव विकास सूचकांक (HDI)। धारणीयता।",
            "keyConcepts": [
              "Different people can have different and conflicting developmental goals",
              "World Bank uses Per Capita Income (PCI = Total National Income / Total Population) to classify countries",
              "UNDP uses Human Development Index (HDI) based on Life Expectancy, Literacy & PCI",
              "Infant Mortality Rate (IMR), Net Attendance Ratio, Literacy rate",
              "Sustainable development: Using resources without compromising needs of future generations (groundwater depletion, crude oil reserves)"
            ],
            "formulas": [
              "Per Capita Income = Total National Income / Total Population"
            ],
            "importantQuestions": [
              {
                "question": "Why does UNDP use criteria different from the World Bank for measuring development?",
                "questionHi": "विश्व बैंक की तुलना में यूएनडीपी द्वारा विकास मापने के मापदंड अलग क्यों हैं?",
                "solution": "World Bank only considers per capita income (money). UNDP considers multidimensional well-being including health status (life expectancy), educational attainment (literacy rate), along with per capita income.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which organization publishes the Human Development Report (HDR)?",
                "options": [
                  "World Bank",
                  "UNDP",
                  "IMF",
                  "WHO"
                ],
                "correctIndex": 1,
                "explanation": "United Nations Development Programme (UNDP) publishes the Human Development Report annually."
              }
            ]
          },
          {
            "number": 2,
            "title": "Sectors of the Indian Economy",
            "titleHi": "भारतीय अर्थव्यवस्था के क्षेत्रक",
            "summary": "Sectors of economic activities: Primary, Secondary, Tertiary. Comparing the three sectors. Historical change in sectors. Rising importance of tertiary sector in production. Where are most people employed? Disguised unemployment. How to create more employment? Organized and Unorganized sectors. Sectors in terms of ownership: Public and Private.",
            "summaryHi": "प्राथमिक, द्वितीयक एवं तृतीयक क्षेत्रक। तृतीयक क्षेत्रक का बढ़ता महत्व। प्रच्छन्न बेरोजगारी। संगठित तथा असंगठित क्षेत्रक। सार्वजनिक एवं निजी क्षेत्रक।",
            "keyConcepts": [
              "Primary (agriculture, dairy, mining), Secondary (industrial manufacturing), Tertiary (transport, banking, IT services)",
              "Tertiary sector contributes highest to GDP (>50%), but Primary sector still employs largest workforce (>45%)",
              "Disguised unemployment: more people working than required (marginal productivity is zero)",
              "MGNREGA 2005: 100 days guaranteed wage employment in rural areas",
              "Organized (job security, paid leaves, fixed hours, PF) vs Unorganized sector"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What is disguised unemployment? Explain with an agricultural example.",
                "questionHi": "प्रच्छन्न बेरोजगारी क्या है? कृषि का एक उदाहरण देकर समझाइए।",
                "solution": "Disguised unemployment is a situation where more people are engaged in a job than needed. For example, a small farmer's family of 5 works on a 2-hectare plot. Even if 2 members move out, total crop yield remains unchanged because those 2 members were underemployed.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Under MGNREGA 2005, the government guarantees how many days of employment in a year?",
                "options": [
                  "50 days",
                  "100 days",
                  "150 days",
                  "200 days"
                ],
                "correctIndex": 1,
                "explanation": "MGNREGA guarantees 100 days of wage employment per year to every rural household."
              }
            ]
          },
          {
            "number": 3,
            "title": "Money and Credit",
            "titleHi": "मुद्रा और साख",
            "summary": "Money as a medium of exchange. Modern forms of money: Currency, deposits with banks, cheques. Loan activities of banks. Two different credit situations. Terms of credit. Formal sector credit in India (RBI role). Self-Help Groups (SHGs) for the poor.",
            "summaryHi": "विनिमय के माध्यम के रूप में मुद्रा। मुद्रा के आधुनिक रूप (करेंसी, बैंक निक्षेप, चेक)। ऋण की शर्तें। भारत में औपचारिक क्षेत्रक में साख (आरबीआई की भूमिका)। स्वयं सहायता समूह (SHG)।",
            "keyConcepts": [
              "Barter system had problem of Double Coincidence of Wants, eliminated by money",
              "Modern money has no intrinsic value (paper notes and coins authorised by central government)",
              "Terms of credit: Interest rate, collateral (security), documentation, mode of repayment",
              "Formal sector (Banks, Cooperatives supervised by RBI) vs Informal sector (Moneylenders, traders charging exorbitant interest rates)",
              "Self-Help Groups (SHGs): 15-20 members pool small savings, offer collateral-free low interest loans"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why is it necessary for banks and cooperatives to increase their lending in rural areas?",
                "questionHi": "ग्रामीण क्षेत्रों में बैंकों और सहकारी समितियों द्वारा ऋण बढ़ाना क्यों आवश्यक है?",
                "solution": "1. To reduce rural borrowers' dependence on informal moneylenders who charge extortionate interest rates. 2. To prevent rural households from falling into severe debt traps. 3. Cheap and affordable credit empowers farmers to invest in modern agriculture, businesses, and education.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which agency supervises the functioning of formal sources of loans in India?",
                "options": [
                  "State Bank of India",
                  "Reserve Bank of India",
                  "Ministry of Finance",
                  "NABARD"
                ],
                "correctIndex": 1,
                "explanation": "The Reserve Bank of India (RBI) supervises the functioning of formal sector lenders."
              }
            ]
          },
          {
            "number": 4,
            "title": "Globalisation and the Indian Economy",
            "titleHi": "वैश्वीकरण और भारतीय अर्थव्यवस्था",
            "summary": "Production across countries. Interlinking production across countries (MNCs). Foreign trade and integration of markets. What is globalisation? Factors that have enabled globalisation (Technology, Liberalisation). World Trade Organisation (WTO). Impact of globalisation in India. The struggle for a fair globalisation.",
            "summaryHi": "विदेशी व्यापार और बाजारों का एकीकरण। वैश्वीकरण क्या है? उदारीकरण, प्रौद्योगिकी और डब्ल्यूटीओ (WTO)। भारत में वैश्वीकरण का प्रभाव। न्यायसंगत वैश्वीकरण।",
            "keyConcepts": [
              "Multinational Corporation (MNC): owns or controls production in more than one nation",
              "Liberalisation (1991 New Economic Policy): Removing trade barriers and government restrictions on foreign trade and investment",
              "World Trade Organisation (WTO) promotes free international trade among members",
              "Impact: Consumer choice widened, top Indian companies (Tata Motors, Infosys, Ranbaxy) emerged as MNCs; but small local manufacturers face intense competition"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "How has information and communication technology stimulated the globalisation process?",
                "questionHi": "सूचना और संचार प्रौद्योगिकी ने वैश्वीकरण की प्रक्रिया को किस प्रकार गति प्रदान की है?",
                "solution": "Telecommunications (internet, mobile phones, satellite connectivity) allow instant contact across continents. Massive volumes of business services (BPO, software, accounting) can now be performed in India for clients located in the US or Europe at fraction of cost.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Removing barriers or restrictions set by the government is known as:",
                "options": [
                  "Privatisation",
                  "Globalisation",
                  "Liberalisation",
                  "Industrialisation"
                ],
                "correctIndex": 2,
                "explanation": "Removing restrictions and trade barriers by the government is termed Liberalisation."
              }
            ]
          },
          {
            "number": 5,
            "title": "Consumer Rights",
            "titleHi": "उपभोक्ता अधिकार",
            "summary": "The consumer in the marketplace. Consumer movement in India. Consumer International. Consumer Protection Act (COPRA 1986 & CPA 2019). Consumer rights: Safety, Information, Choice, Seek redressal, Representation, Consumer education. Standard marks (ISI, Agmark, Hall-mark).",
            "summaryHi": "बाजार में उपभोक्ता। उपभोक्ता आंदोलन तथा कोपरा (COPRA)। उपभोक्ता के छह अधिकार (सुरक्षा, सूचना, चयन, निवारण, प्रतिनिधित्व, उपभोक्ता शिक्षा)। मानक चिन्ह (ISI, एगमार्क, हॉलमार्क)।",
            "keyConcepts": [
              "Consumer Rights: Right to Safety, Right to Information, Right to Choose, Right to be Heard, Right to Seek Redressal, Right to Consumer Education",
              "COPRA 1986 established 3-tier quasi-judicial machinery: District Commission, State Commission, National Commission",
              "Standard certifications: ISI mark (industrial electrical goods), Agmark (agricultural food), Hallmark (gold jewellery)",
              "National Consumer Day celebrated on 24th December in India"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Explain the Right to Information available to a consumer with an example.",
                "questionHi": "एक उदाहरण की सहायता से उपभोक्ता को उपलब्ध 'सूचना के अधिकार' को समझाइए।",
                "solution": "Consumers have the right to be informed about ingredients, manufacturing date, expiry date, batch number, directions for use, and MRP. For example, when buying medicine, a consumer can check the expiry date on packaging to prevent health hazards.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "National Consumer Rights Day is celebrated in India every year on:",
                "options": [
                  "24th October",
                  "24th December",
                  "15th March",
                  "5th June"
                ],
                "correctIndex": 1,
                "explanation": "24th December is observed as National Consumer Day as COPRA was enacted on this day in 1986."
              }
            ]
          }
        ]
      },
      {
        "id": "sst_map_work",
        "title": "Map Work & Essential Skills (History & Geography)",
        "titleHi": "मानचित्र कार्य एवं आवश्यक कौशल",
        "chapters": [
          {
            "number": 1,
            "title": "History & Geography Map Locations (Prescribed CBSE List)",
            "titleHi": "इतिहास एवं भूगोल के प्रमुख मानचित्र स्थल",
            "summary": "Official CBSE Map items for Class 10: Indian National Congress Sessions (Calcutta 1920, Nagpur 1920, Madras 1927), Important Centres of National Movement (Champaran, Kheda, Ahmedabad, Amritsar/Jallianwala Bagh, Chauri Chaura, Dandi). Geography: Major Soil Types, Major Dams (Salal, Bhakra Nangal, Tehri, Rana Pratap Sagar, Sardar Sarovar, Hirakud, Nagarjuna Sagar, Tungabhadra), Major Thermal & Nuclear Power Plants, Software Tech Parks, Major Seaports and International Airports.",
            "summaryHi": "सीबीएसई कक्षा 10वीं के लिए निर्धारित आधिकारिक मानचित्र स्थल। भारतीय राष्ट्रीय कांग्रेस के अधिवेशन (कलकत्ता, नागपुर, मद्रास), सत्याग्रह केंद्र (चंपारण, खेड़ा, अहमदाबाद, अमृतसर, चौरी चौरा, दांडी), प्रमुख बाँध, ताप व परमाणु ऊर्जा संयंत्र, बंदरगाह एवं हवाई अड्डे।",
            "keyConcepts": [
              "Congress Sessions: Calcutta (Sep 1920), Nagpur (Dec 1920), Madras (1927)",
              "Satyagraha Centres: Champaran (Indigo), Kheda (Crop failure), Ahmedabad (Cotton mill)",
              "Movement Turning Points: Jallianwala Bagh (Amritsar), Chauri Chaura (Calling off NCM), Dandi (Salt March/CDM)",
              "Major Dams: Salal (Chenab), Bhakra Nangal (Satluj), Tehri (Bhagirathi), Sardar Sarovar (Narmada), Hirakud (Mahanadi)",
              "Nuclear Power Plants: Narora (UP), Rawatbhata (Rajasthan), Kakrapar (Gujarat), Tarapur (Maharashtra), Kalpakkam (TN)",
              "Major Seaports: Kandla, Mumbai, Marmagao, New Mangalore, Kochi, Tuticorin, Chennai, Visakhapatnam, Paradip, Haldia"
            ],
            "formulas": [
              "Scale ratio = Map distance / Ground distance",
              "Direction convention: North (Top), South (Bottom), East (Right), West (Left)"
            ],
            "importantQuestions": [
              {
                "question": "Locate and label the place where the Indian National Congress session was held in September 1920, and the place associated with the calling off of the Non-Cooperation Movement.",
                "questionHi": "मानचित्र पर वह स्थान दर्शाइए जहाँ सितंबर 1920 में कांग्रेस अधिवेशन हुआ था तथा वह स्थान जहाँ चौरी-चौरा की घटना के बाद असहयोग आंदोलन वापस लिया गया था।",
                "solution": "1. September 1920 INC Session: Calcutta (Kolkata, West Bengal).\n2. Calling off Non-Cooperation Movement: Chauri Chaura (Gorakhpur district, Uttar Pradesh).",
                "marks": 2
              },
              {
                "question": "On the political map of India, locate and label: (a) Tehri Dam (b) Tarapur Nuclear Power Plant (c) Raja Sansi (Sri Guru Ram Dass Jee) International Airport.",
                "questionHi": "भारत के राजनीतिक मानचित्र पर दर्शाइए: (क) टिहरी बाँध (ख) तारापुर परमाणु संयंत्र (ग) राजा सांसी अंतर्राष्ट्रीय हवाई अड्डा।",
                "solution": "(a) Tehri Dam: Uttarakhand (on Bhagirathi river).\n(b) Tarapur: Maharashtra.\n(c) Raja Sansi International Airport: Amritsar, Punjab.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "In which state is the Hirakud Dam located on the Mahanadi river?",
                "options": [
                  "Odisha",
                  "Jharkhand",
                  "Chhattisgarh",
                  "West Bengal"
                ],
                "correctIndex": 0,
                "explanation": "Hirakud Dam is built across the Mahanadi river in Odisha and is one of the longest earthen dams in the world."
              },
              {
                "question": "The Indian National Congress Session of December 1920 was held at which of the following cities?",
                "options": [
                  "Nagpur",
                  "Calcutta",
                  "Madras",
                  "Lahore"
                ],
                "correctIndex": 0,
                "explanation": "The December 1920 INC session was held at Nagpur, where the Non-Cooperation programme was officially endorsed."
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          }
        ]
      }
    ]
  },
  {
    "id": "english",
    "name": "English Language & Literature",
    "nameHi": "अंग्रेज़ी",
    "code": "184",
    "icon": "menu_book",
    "color": "#7C3AED",
    "books": [
      {
        "id": "first_flight",
        "title": "First Flight (Main Textbook)",
        "titleHi": "फर्स्ट फ्लाइट",
        "chapters": [
          {
            "number": 1,
            "title": "A Letter to God & Dust of Snow, Fire and Ice",
            "titleHi": "ए लेटर टू गॉड तथा कविताएँ",
            "summary": "Lencho's absolute faith in God destroyed by hail, writes letter asking 100 pesos. Postmaster collects 70 pesos, but Lencho suspects post office employees are 'a bunch of crooks'. Poems: Dust of Snow (nature's healing power) and Fire and Ice (desire and hatred).",
            "summaryHi": "लेंचो का ईश्वर में अटूट विश्वास। ओलावृष्टि से फसल नष्ट होने पर ईश्वर को पत्र। पोस्टमास्टर की उदारता। कविताएँ: डस्ट ऑफ स्नो एवं फायर एंड आइस।",
            "keyConcepts": [
              "Irony of the ending: helpers branded as crooks",
              "Theme of unshakeable faith vs human skepticism",
              "Robert Frost's symbolism: Hemlock tree, crow, fire = greed/desire, ice = cold hatred"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did Lencho say the raindrops were like 'new coins'?",
                "questionHi": "लेंचो ने बारिश की बूंदों को 'नए सिक्के' क्यों कहा?",
                "solution": "Lencho's corn crop was ripe and desperately needed rain to yield a rich harvest. Rain ensured bountiful harvest, fetching prosperity and money.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "How much money did Lencho ask from God in his letter?",
                "options": [
                  "50 pesos",
                  "70 pesos",
                  "100 pesos",
                  "500 pesos"
                ],
                "correctIndex": 2,
                "explanation": "Lencho requested 100 pesos to sow his field again and survive till the next harvest."
              }
            ]
          },
          {
            "number": 2,
            "title": "Nelson Mandela: Long Walk to Freedom & A Tiger in the Zoo",
            "titleHi": "नेल्सन मंडेला: लॉन्ग वॉक टू फ्रीडम एवं कविता",
            "summary": "Mandela's inauguration on 10 May 1994 as South Africa's first black President at Union Buildings amphitheatre in Pretoria. Apartheid system abolished. Poem: Tiger in cage longs for wild jungle freedom.",
            "summaryHi": "10 मई 1994 को नेल्सन मंडेला का दक्षिण अफ्रीका के प्रथम अश्वेत राष्ट्रपति के रूप में शपथ ग्रहण। रंगभेद का अंत। कविता: चिड़ियाघर में बाघ का संकुचित जीवन।",
            "keyConcepts": [
              "Apartheid: racial discrimination policy",
              "Twin obligations: family and community/country",
              "Courage is not absence of fear, but triumph over it",
              "Poetic contrast between caged tiger and majestic wild predator"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What 'twin obligations' does Nelson Mandela mention in his speech?",
                "questionHi": "नेल्सन मंडेला ने अपने भाषण में किन दो दायित्वों (ट्विन ऑब्लिगेशन्स) का उल्लेख किया है?",
                "solution": "1. Obligation to his family, parents, wife and children. 2. Obligation to his people, community and country.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "On which date was Nelson Mandela sworn in as the President of South Africa?",
                "options": [
                  "10th May 1994",
                  "15th August 1994",
                  "26th January 1990",
                  "1st January 1995"
                ],
                "correctIndex": 0,
                "explanation": "Mandela was sworn in on 10 May 1994 in Pretoria."
              }
            ]
          },
          {
            "number": 3,
            "title": "Two Stories about Flying & How to Tell Wild Animals, The Ball Poem",
            "titleHi": "उड़ान की दो कहानियाँ तथा कविताएँ",
            "summary": "Part I: His First Flight (young seagull conquers fear of flying prompted by mother's food trick). Part II: Black Aeroplane (Dakota pilot guided out of storm by mysterious ghost plane). Poems: Humorously identifying predators; Loss of innocence in Ball Poem.",
            "summaryHi": "सीगल पक्षी की पहली उड़ान और डकोटा विमान चालक की रहस्यमयी ब्लैक एरोप्लेन द्वारा रक्षा। कविता: द बॉल पोएम में नुकसान की स्वीकृति।",
            "keyConcepts": [
              "Necessity and hunger overcome psychological fear",
              "Faith and mystery in survival",
              "The Ball Poem: learning epistemology of loss, coping with grief"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What does John Berryman mean by 'the epistemology of loss' in The Ball Poem?",
                "questionHi": "द बॉल पोएम में कवि का 'नुकसान की समझ' से क्या अभिप्राय है?",
                "solution": "It means understanding what it means to lose something precious and learning to endure the emotional pain of moving on in a world of possessions.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "What was the name of the old aeroplane flown by the narrator towards England?",
                "options": [
                  "Boeing 737",
                  "Old Dakota DS 088",
                  "Mirage 2000",
                  "Spitfire"
                ],
                "correctIndex": 1,
                "explanation": "The narrator was flying his old Dakota DS 088 over France back to England."
              }
            ]
          },
          {
            "number": 4,
            "title": "From the Diary of Anne Frank & Amanda!",
            "titleHi": "ऐन फ्रैंक की डायरी से एवं अमांडा!",
            "summary": "Anne Frank's reflections in her diary named 'Kitty' during hiding in Amsterdam secret annex from Nazi persecution. Her witty essays for math teacher Mr. Keesing on 'Chatterbox'. Poem: Amanda's escapist daydreams against nagging.",
            "summaryHi": "ऐन फ्रैंक द्वारा अपनी डायरी 'किट्टी' में संस्मरण। कविता: अमांडा की अपनी काल्पनिक दुनिया में स्वतंत्रता की चाह।",
            "keyConcepts": [
              "Paper has more patience than people",
              "Anne's irrepressible sense of humour and intellect",
              "Teenage psychology: need for autonomy vs parental control"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did Anne Frank decide to keep a personal diary?",
                "questionHi": "ऐन फ्रैंक ने व्यक्तिगत डायरी रखने का निर्णय क्यों लिया?",
                "solution": "She felt that 'paper has more patience than people' and she lacked a genuine, intimate friend to confide her innermost feelings to.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "What name did Anne Frank give to her beloved diary?",
                "options": [
                  "Margo",
                  "Kitty",
                  "Diana",
                  "Lizzie"
                ],
                "correctIndex": 1,
                "explanation": "Anne Frank affectionately called her diary 'Kitty'."
              }
            ]
          },
          {
            "number": 5,
            "title": "Glimpses of India & The Trees, Fog",
            "titleHi": "भारत की झलकियाँ तथा कविताएँ",
            "summary": "Three glimpses: I. A Baker from Goa (Pader and traditional bread). II. Coorg (Kodagu, coffee plantations, brave martial race, river Kaveri). III. Tea from Assam (Pranjol & Rajvir visiting tea estates). Poems: Nature breaking free; Quiet arrival of fog.",
            "summaryHi": "गोवा के बेकर, कूर्ग की प्राकृतिक सुंदरता व वीर संस्कृति, असम के चाय बागान। कविता: पेड़ों की मुक्ति एवं कोहरे का आगमन।",
            "keyConcepts": [
              "Heritage of bread-making in Goa ('Pader', 'bol')",
              "Coorg martial traditions, General Cariappa first Indian Army Chief",
              "Legend of tea (Chinese Emperor and Buddhist monk Bodhidharma)",
              "Metaphor of fog coming on 'little cat feet'"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What is the legend regarding the discovery of tea in China according to Rajvir?",
                "questionHi": "राजवीर के अनुसार चीन में चाय की खोज से जुड़ी क्या कथा है?",
                "solution": "A Chinese Emperor always boiled water before drinking. One day, leaves from twigs burning under the pot fell into boiling water, imparting delicious flavour. They were found to be tea leaves.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "Which river flows through the hills and rainforests of Coorg?",
                "options": [
                  "Ganga",
                  "Kaveri",
                  "Yamuna",
                  "Godavari"
                ],
                "correctIndex": 1,
                "explanation": "The river Kaveri obtains its water from the hills and forests of Coorg."
              }
            ]
          },
          {
            "number": 6,
            "title": "Mijbil the Otter & The Tale of Custard the Dragon",
            "titleHi": "मिजबिल द ओटर तथा कविता",
            "summary": "Gavin Maxwell brings an otter from Tigris marshes in Iraq to London. Mijbil's playful antics in bathtub and aircraft. Poem: Custard cowardly dragon saves Belinda and pets from fierce pirate.",
            "summaryHi": "गैविन मैक्सवेल का पालतू ऊदबिलाव मिजबिल और उसकी चंचल हरकतें। कविता: कस्टर्ड द ड्रैगन की वास्तविक वीरता।",
            "keyConcepts": [
              "Otters require flowing water and love playing with ping-pong balls",
              "Appearance vs true courage in Custard the Dragon",
              "Humorous ballad format"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "How did Custard the Dragon prove that he was not really a coward?",
                "questionHi": "कस्टर्ड द ड्रैगन ने कैसे सिद्ध किया कि वह कायर नहीं था?",
                "solution": "When a dangerous armed pirate broke in, all boastful pets ran away in terror. Custard charged fearlessly, roared like an engine, and swallowed the pirate whole.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "To which zoological species was Maxwell's otter classified by zoologists?",
                "options": [
                  "Lutrogale perspicillata maxwelli",
                  "Panthera leo",
                  "Canis lupus",
                  "Equus caballus"
                ],
                "correctIndex": 0,
                "explanation": "Zoologists named the subspecies Lutrogale perspicillata maxwelli (Maxwell's otter)."
              }
            ]
          },
          {
            "number": 7,
            "title": "Madam Rides the Bus & For Anne Gregory",
            "titleHi": "मैडम राइड्स द बस तथा कविता",
            "summary": "Eight-year-old Valli saves money with meticulous discipline to ride the village bus to town and back. Encounters calf alive, later sees it dead by roadside - confronting harsh mortality. Poem: Loving for inner soul rather than golden hair.",
            "summaryHi": "आठ वर्षीय वल्ली की बस यात्रा की योजना और जीवन-मृत्यु की पहली अनुभूति। कविता: बाह्य सौंदर्य बनाम आंतरिक आत्मिक सौंदर्य।",
            "keyConcepts": [
              "Valli's mature planning and pride",
              "Transition from childish innocence to awareness of death",
              "W.B. Yeats theme: Only God loves you for yourself alone, not for yellow hair"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "How did Valli save money for her first bus journey?",
                "questionHi": "वल्ली ने अपनी पहली बस यात्रा के लिए पैसे कैसे बचाए?",
                "solution": "She resisted every temptation to spend pocket money on peppermints, toys, balloons and the village merry-go-round until she collected sixty paise.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "What was the total fare for the round bus trip between Valli's village and town?",
                "options": [
                  "30 paise",
                  "50 paise",
                  "60 paise",
                  "1 rupee"
                ],
                "correctIndex": 2,
                "explanation": "30 paise one-way, making 60 paise for the round trip."
              }
            ]
          },
          {
            "number": 8,
            "title": "The Sermon at Benares & The Proposal",
            "titleHi": "द सरमन एट बनारस तथा द प्रपोजल",
            "summary": "Gautama Buddha preaches to Kisa Gotami after death of her only son: Death is universal and unavoidable for mortals. Anton Chekhov's one-act play 'The Proposal': Lomov proposes to Natalya, but petty quarrels over Oxen Meadows and dogs ruin the mood.",
            "summaryHi": "गौतम बुद्ध का उपदेश (किसा गौतमी की कथा)। चेखोव का नाटक 'द प्रपोजल' (लोमोव और नताल्या की हास्यास्पद बहसें)।",
            "keyConcepts": [
              "Buddha's teaching on impermanence and grief",
              "Satire on Russian landed aristocracy marrying for wealth and ego",
              "Lomov's hypochondria and Natalya's argumentative nature"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What did Gautama Buddha ask Kisa Gotami to bring to revive her dead child?",
                "questionHi": "गौतम बुद्ध ने किसा गौतमी से उसके मृत बच्चे को जीवित करने के लिए क्या लाने को कहा?",
                "solution": "A handful of mustard seeds from a house where no child, husband, parent or friend had ever died. When she found none, she realized death is common to all.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Over which piece of land do Lomov and Natalya fight violently in 'The Proposal'?",
                "options": [
                  "Burnt Marsh",
                  "Oxen Meadows",
                  "Birch Woods",
                  "Green Valley"
                ],
                "correctIndex": 1,
                "explanation": "They fight over the ownership of Oxen Meadows located between Birchwoods and Burnt Marsh."
              }
            ]
          }
        ]
      },
      {
        "id": "footprints",
        "title": "Footprints Without Feet (Supplementary)",
        "titleHi": "फुटप्रिंट्स विदाउट फीट",
        "chapters": [
          {
            "number": 1,
            "title": "A Triumph of Surgery",
            "titleHi": "ए ट्रायम्फ ऑफ सर्जरी",
            "summary": "Mrs. Pumphrey overfeeds her spoiled Pekingese dog Tricki with rich treats. Dr. James Herriot admits Tricki to surgery, cures him simply by diet control and vigorous exercise.",
            "summaryHi": "मिसेज पैम्फ्री का लाड़ला कुत्ता ट्रिकी। डॉ. हैरियट द्वारा केवल संतुलित आहार और व्यायाम से उसका उपचार।",
            "keyConcepts": [
              "Harm of pampering and over-indulgence",
              "Natural veterinary wisdom over medication"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What treatment was given to Tricki by Dr. Herriot at the surgery?",
                "questionHi": "डॉ. हैरियट ने अपने अस्पताल में ट्रिकी को क्या उपचार दिया?",
                "solution": "No medicine was administered. For two days, he was given plenty of water and no food. Then he was introduced to other active dogs for play and exercise.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "What kind of dog was Tricki?",
                "options": [
                  "Pomeranian",
                  "Pekingese",
                  "German Shepherd",
                  "Bull Dog"
                ],
                "correctIndex": 1,
                "explanation": "Tricki was Mrs. Pumphrey's pampered little Pekingese dog."
              }
            ]
          },
          {
            "number": 2,
            "title": "The Thief's Story",
            "titleHi": "द थीफ्स स्टोरी",
            "summary": "Hari Singh, a 15-year-old thief, befriends kind writer Anil. Anil teaches him to read and write. Hari steals Anil's money but his conscience brings him back to get educated.",
            "summaryHi": "15 वर्षीय चोर हरी सिंह और लेखक अनिल की मित्रता। शिक्षा और विश्वास से चोर का हृदय परिवर्तन।",
            "keyConcepts": [
              "Power of education and unconditional trust to reform a criminal",
              "Internal moral dilemma at train station"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did Hari Singh decide to return Anil's stolen money?",
                "questionHi": "हरी सिंह ने अनिल के चुराए हुए पैसे लौटाने का फैसला क्यों किया?",
                "solution": "He realized that stealing would give him brief wealth, but learning to read and write sentences from Anil would make him a truly respected, educated human being.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "How old was the thief Hari Singh?",
                "options": [
                  "12 years",
                  "15 years",
                  "20 years",
                  "25 years"
                ],
                "correctIndex": 1,
                "explanation": "Hari Singh was 15 years old and an experienced thief."
              }
            ]
          },
          {
            "number": 3,
            "title": "The Midnight Visitor",
            "titleHi": "द मिडनाइट विजिटर",
            "summary": "Secret agent Ausable outwits armed rival Max in a hotel room by inventing a fictional balcony story. Max jumps out of window to his death.",
            "summaryHi": "गुप्तचर ऑसेबल की चतुर बुद्धि। कल्पित बालकनी की कहानी बनाकर प्रतिद्वंद्वी मैक्स को चकमा देना।",
            "keyConcepts": [
              "Presence of mind surpasses physical appearance and weapons"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "How did Ausable trick Max into jumping out of the window?",
                "questionHi": "ऑसेबल ने मैक्स को खिड़की से कूदने के लिए कैसे मूर्ख बनाया?",
                "solution": "Ausable convincingly pretended that the window had an accessible balcony that people frequently used to break into his room. When police knocked (actually the room waiter), panicked Max jumped onto non-existent balcony.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Who was knocking at Ausable's hotel room door?",
                "options": [
                  "The Police",
                  "Henry the waiter",
                  "Max's partner",
                  "Hotel manager"
                ],
                "correctIndex": 1,
                "explanation": "Henry the room waiter had brought drinks ordered by Ausable."
              }
            ]
          },
          {
            "number": 4,
            "title": "A Question of Trust",
            "titleHi": "ए क्वेश्चन ऑफ ट्रस्ट",
            "summary": "Horace Danby robs one safe every year to buy rare books. At Shotover Grange, he is tricked by an elegant young woman claiming to be the house mistress.",
            "summaryHi": "किताबों के शौकीन होरेस डैनबी की चोरी। एक चालाक महिला ठग द्वारा उसे फंसाया जाना।",
            "keyConcepts": [
              "Honor among thieves is broken",
              "Appearances can be deceptive"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "How was Horace Danby deceived by the lady in red at Shotover Grange?",
                "questionHi": "शॉटओवर ग्रेंज में लाल कपड़ों वाली महिला ने होरेस डैनबी को कैसे धोखा दिया?",
                "solution": "She spoke with authority, patted the house dog Sherry, and pretended to be the mistress locked out of jewels safe. Horace opened safe for her without gloves and got arrested.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "What allergic condition did Horace Danby suffer from in summer?",
                "options": [
                  "Asthma",
                  "Hay fever",
                  "Eczema",
                  "Sinusitis"
                ],
                "correctIndex": 1,
                "explanation": "Horace suffered from hay fever, triggered by flower scent at Shotover Grange."
              }
            ]
          },
          {
            "number": 5,
            "title": "Footprints Without Feet",
            "titleHi": "फुटप्रिंट्स विदाउट फीट",
            "summary": "Brilliant but eccentric scientist Griffin swallows rare drugs to become invisible. Misuses power to commit burglaries and terrorizes Iping village until Constable Jaffers tries to arrest him.",
            "summaryHi": "वैज्ञानिक ग्रिफिन की अदृश्यता की खोज। शक्ति का दुरुपयोग, चोरी तथा आईपिंग गांव में उपद्रव।",
            "keyConcepts": [
              "Science without ethics leads to criminal madness",
              "Griffin as lawless genius"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did Griffin slip into a big London store and what did he do there?",
                "questionHi": "ग्रिफिन लंदन के एक बड़े स्टोर में क्यों घुसा और उसने वहाँ क्या किया?",
                "solution": "It was freezing mid-winter and he was naked. He broke open boxes, wore warm clothes, ate cold meat and sweets, and slept on quilts.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "In which village did Griffin rent two rooms at Mrs. Hall's local inn?",
                "options": [
                  "Iping",
                  "Oxford",
                  "Stratford",
                  "Dover"
                ],
                "correctIndex": 0,
                "explanation": "Griffin escaped from London to the quiet rural village of Iping."
              }
            ]
          },
          {
            "number": 6,
            "title": "The Making of a Scientist",
            "titleHi": "द मेकिंग ऑफ अ साइंटिस्ट",
            "summary": "Richard Ebright's journey from collecting butterflies to breakthrough discoveries in cell biology and DNA. Supported by his devoted mother and mentor Dr. Urquhart.",
            "summaryHi": "रिचर्ड एब्राइट की वैज्ञानिक बनने की यात्रा। तितलियों के अध्ययन से डीएनए के रहस्य तक की खोज।",
            "keyConcepts": [
              "Curiosity, hard work, and will to win for right reasons makes a scientist",
              "Discovery of monarch pupa gold spots hormone"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What are the essential ingredients in the making of a scientist according to Ebright's teacher?",
                "questionHi": "एब्राइट के शिक्षक के अनुसार एक वैज्ञानिक बनने के आवश्यक गुण क्या हैं?",
                "solution": "First-rate mind, sharp scientific curiosity, and a relentless desire to do first-class work for genuine scientific pursuit.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which book given by his mother opened the world of science to Richard Ebright?",
                "options": [
                  "The Secret Life of Plants",
                  "The Travels of Monarch X",
                  "Origin of Species",
                  "Cosmos"
                ],
                "correctIndex": 1,
                "explanation": "The children's book 'The Travels of Monarch X' by Dr. Urquhart hooked Ebright on biology."
              }
            ]
          },
          {
            "number": 7,
            "title": "The Necklace",
            "titleHi": "द नेकलेस",
            "summary": "Matilda Loisel borrows a glamorous diamond necklace from friend Madame Forestier for a grand ball. Loses it, buys a 36,000 francs replacement, spends 10 years in crushing poverty to pay debt, only to learn original was fake paste worth 500 francs.",
            "summaryHi": "मटिल्डा की दिखावे की लालसा। सहेली से हार उधार लेना, खो जाना, 10 वर्ष तक कर्ज चुकाने में जीवन बर्बाद होना और अंत में हार का नकली होना।",
            "keyConcepts": [
              "Disastrous consequences of vanity and discontentment",
              "Tragic irony of life"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "How did the loss of the necklace change the life of the Loisels?",
                "questionHi": "हार खो जाने से लोइसेल दंपति का जीवन कैसे बदल गया?",
                "solution": "They took crushing loans of 36,000 francs. They dismissed servant, moved to cheap garret, husband worked night shifts, and Matilda aged rapidly doing heavy chores for 10 agonizing years.",
                "marks": 4
              }
            ],
            "mcqs": [
              {
                "question": "How much was the borrowed necklace actually worth according to Madame Forestier?",
                "options": [
                  "36,000 francs",
                  "10,000 francs",
                  "At most 500 francs",
                  "100 francs"
                ],
                "correctIndex": 2,
                "explanation": "The original necklace was made of imitation paste worth at most 500 francs."
              }
            ]
          },
          {
            "number": 8,
            "title": "Bholi",
            "titleHi": "भोली",
            "summary": "Sulekha (Bholi), neglected due to pockmarks and stammer, transforms through an empathetic school teacher. Bravely rejects greedy groom Bishamber Nath when he demands 5,000 rupees dowry.",
            "summaryHi": "सुलेखा (भोली) का अध्यापिका के स्नेह और शिक्षा से सशक्तिकरण। लालची दूल्हे बिशंभर नाथ को दहेज मांगने पर विवाह से इनकार करना।",
            "keyConcepts": [
              "Transformative power of education for girl child",
              "Rejection of social evils like dowry"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did Bholi refuse to marry Bishamber Nath at the wedding altar?",
                "questionHi": "भोली ने विवाह मंडप में बिशंभर नाथ से विवाह करने से क्यों मना कर दिया?",
                "solution": "When Bishamber saw her pockmarks, he demanded Rs 5,000 dowry to marry her and insulted her father. Educated Bholi refused to marry such a mean, greedy, cowardly man.",
                "marks": 4
              }
            ],
            "mcqs": [
              {
                "question": "What was Bholi's real name?",
                "options": [
                  "Champa",
                  "Radha",
                  "Sulekha",
                  "Mangla"
                ],
                "correctIndex": 2,
                "explanation": "Her real name was Sulekha, but everyone called her Bholi (the simpleton)."
              }
            ]
          },
          {
            "number": 9,
            "title": "The Book That Saved the Earth",
            "titleHi": "द बुक दैट सेव्ड द अर्थ",
            "summary": "Science fiction play set in 25th century: Martian invaders led by pompous Think-Tank plan to invade Earth. Misinterpret Mother Goose nursery rhymes as terrifying Earthly weapon codes and flee to Alpha Centauri.",
            "summaryHi": "विज्ञान फंतासी नाटक। मंगल ग्रह के सम्राट थिंक-टैंक का पृथ्वी पर आक्रमण का विचार, 'मदर गूज' नर्सरी राइम्स की गलत व्याख्या और डरकर भागना।",
            "keyConcepts": [
              "Satire on foolish pride and baseless arrogance",
              "A humble book saves mankind"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "Why did Think-Tank call books 'sandwiches'?",
                "questionHi": "थिंक-टैंक ने किताबों को 'सैंडविच' क्यों कहा?",
                "solution": "Martians had never seen books. Seeing Earthlings handling books, Think-Tank assumed they were communication food or crude sandwiches eaten by Earthlings.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "Which nursery rhyme book terrified Think-Tank and aborted the Martian invasion?",
                "options": [
                  "Grimm's Fairy Tales",
                  "Aesop's Fables",
                  "Mother Goose",
                  "Alice in Wonderland"
                ],
                "correctIndex": 2,
                "explanation": "The nursery rhyme collection 'Mother Goose' caused Think-Tank to panic and flee."
              }
            ]
          }
        ]
      },
      {
        "id": "english_writing_grammar",
        "title": "Writing Skills & Applied Grammar (Section B)",
        "titleHi": "रचनात्मक लेखन एवं व्यावहारिक व्याकरण",
        "chapters": [
          {
            "number": 1,
            "title": "Formal Letter Writing (Editor, Complaint, Enquiry, Order)",
            "titleHi": "औपचारिक पत्र लेखन",
            "summary": "Comprehensive guidelines and formats for CBSE Class 10 Formal Letters (100–120 words, 5 marks). Types include: Letter to the Editor (highlighting civic or social issues), Letter of Complaint (defective products or deficient services), Letter of Enquiry (courses, travel packages), and Placing an Order.",
            "summaryHi": "सीबीएसई कक्षा 10वीं औपचारिक पत्र लेखन के मानक प्रारूप एवं उदाहरण (संपादक के नाम पत्र, शिकायती पत्र, पूछताछ पत्र तथा व्यावसायिक आदेश पत्र)।",
            "keyConcepts": [
              "Sender's Address (Top Left, 2-3 lines)",
              "Date (Expanded format: e.g. 15 November 2026)",
              "Receiver's Designation & Address (e.g. The Editor, The Times of India, New Delhi)",
              "Subject line (Brief, concise, capitalized keywords)",
              "Salutation (Sir / Madam)",
              "Body (3 distinct paragraphs: Introduction, Cause & Effects / Details, Expected Action / Remedy)",
              "Complimentary Close (Yours sincerely / Yours faithfully) and Sender's Name"
            ],
            "formulas": [
              "Formal Letter Format: Sender Address -> Date -> Receiver Address -> Subject -> Salutation -> 3-Para Body -> Sign-off"
            ],
            "importantQuestions": [
              {
                "question": "You are Akshat/Akshita of 45, Model Town, Delhi. Write a letter to the Editor of a national daily drawing attention to the frequent traffic gridlocks and reckless driving near your school zone. (100–120 words)",
                "questionHi": "अपने क्षेत्र में स्कूल के पास अनियंत्रित यातायात एवं लापरवाह ड्राइविंग की समस्या पर किसी राष्ट्रीय दैनिक के संपादक को पत्र लिखिए।",
                "solution": "Format followed strictly: Sender's address, Date, The Editor address, Subject: Chaos caused by reckless driving in school zone. Para 1: State concern via esteemed columns. Para 2: Hazards to school children, lack of traffic police, noise pollution. Para 3: Urgent speed breakers, pedestrian crossing, traffic warden deployment. Complementary close: Yours sincerely.",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "Which of the following is the most appropriate subject line for a letter of complaint about a newly purchased laptop?",
                "options": [
                  "My laptop broke please help",
                  "Complaint regarding defective Dell Inspiron laptop (Inv #4521)",
                  "Very angry with customer service",
                  "Laptop issues"
                ],
                "correctIndex": 1,
                "explanation": "A formal subject line must be objective, concise, and include identifying details such as model and invoice number."
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          },
          {
            "number": 2,
            "title": "Analytical Paragraph Writing",
            "titleHi": "विश्लेषणात्मक अनुच्छेद लेखन",
            "summary": "Mastering Analytical Paragraph writing based on given outlines, charts, pie graphs, tables, or bar diagrams (100–120 words, 5 marks). Objective language, comparison indicators, trend analysis, and balanced concluding paragraph.",
            "summaryHi": "दिए गए आंकड़ों, ग्राफ, चार्ट या फ्लोचार्ट के आधार पर विश्लेषणात्मक गद्यांश लेखन की तकनीक एवं अभ्यास।",
            "keyConcepts": [
              "Introduction: Paraphrase the prompt and state what the visual graph/chart represents",
              "Body Paragraph 1 & 2: Group data logically, highlight peak values, lowest points, and major contrasts",
              "Comparison language: 'In stark contrast to', 'witnessed an exponential surge', 'remained stagnant', 'fluctuated marginally'",
              "Conclusion: Summarize the overarching finding without introducing unverified personal opinions"
            ],
            "formulas": [
              "Structure: Paraphrased Topic (1-2 sentences) + Comparative Analysis with Data Points (4-6 sentences) + Final Takeaway (1-2 sentences)"
            ],
            "importantQuestions": [
              {
                "question": "Write an analytical paragraph in 100-120 words analyzing the trend of renewable energy adoption versus fossil fuel consumption over the past decade based on a given comparative bar graph.",
                "questionHi": "दिए गए बार ग्राफ के आधार पर पिछले दशक में नवीकरणीय ऊर्जा और जीवाश्म ईंधन की खपत का विश्लेषणात्मक विवरण 100-120 शब्दों में लिखिए।",
                "solution": "The provided data illustrates the shifting paradigm from fossil fuels toward clean energy between 2015 and 2025. While coal consumption peaked in 2017 at 62%, subsequent years recorded a steady decline down to 44%. Simultaneously, solar and wind energy witnessed a four-fold increase from 9% to 36%. In conclusion, aggressive sustainable investments have substantially diversified the energy grid.",
                "marks": 5
              }
            ],
            "mcqs": [
              {
                "question": "What is the key principle to follow while concluding an analytical paragraph?",
                "options": [
                  "Suggest random personal stories",
                  "Provide a concise synthesis of key trends without personal bias",
                  "Copy the entire data table again",
                  "End with a rhetorical question"
                ],
                "correctIndex": 1,
                "explanation": "The conclusion of an analytical paragraph must synthesize the overall pattern without external speculation or bias."
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          },
          {
            "number": 3,
            "title": "Integrated Grammar (Tenses, Modals, Concord & Reported Speech)",
            "titleHi": "व्यावहारिक व्याकरण (काल, मोडल्स, कर्ता-क्रिया संगति एवं परोक्ष कथन)",
            "summary": "Complete grammar rules for CBSE Class 10 (10 Marks). Covers: Subject-Verb Agreement, Error Identification & Correction, Gap Filling, and Reported Speech (statements, interrogatives with wh- and if/whether, and imperative commands).",
            "summaryHi": "सीबीएसई कक्षा 10वीं अंग्रेजी व्याकरण के सभी प्रमुख नियम: काल, मोडल्स, कर्ता-क्रिया संगति, अशुद्धि शोधन एवं प्रत्यक्ष-अप्रत्यक्ष कथन।",
            "keyConcepts": [
              "Subject-Verb Concord: Singular subjects take singular verbs; 'Either/Neither' takes singular; 'along with/as well as' follows first subject",
              "Modals: Must (obligation/certainty), Should/Ought to (moral duty), May/Might (possibility), Can/Could (ability/polite request)",
              "Reported Speech Tense Shift: Present Simple -> Past Simple; Present Perfect -> Past Perfect; Will -> Would; Can -> Could",
              "Reported Questions: Said to -> Asked/Inquired; remove question mark; wh-word remains; yes/no questions take if/whether",
              "Reported Commands: Said to -> Ordered/Requested/Advised + to + verb base form"
            ],
            "formulas": [
              "Direct to Indirect: said to -> told (statements), asked (questions), ordered/urged (commands)",
              "Neither of the boys + HAS (singular)",
              "Bread and butter + IS (single entity)"
            ],
            "importantQuestions": [
              {
                "question": "Report the dialogue between the teacher and Rohit: Teacher: 'Why were you absent yesterday?' Rohit: 'I was suffering from a severe viral fever.'",
                "questionHi": "अध्यापक और छात्र के मध्य संवाद को अप्रत्यक्ष कथन में बदलिए।",
                "solution": "The teacher asked Rohit why he had been absent the previous day. Rohit politely replied that he had been suffering from a severe viral fever.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "Neither the teacher nor the students ______ present in the auditorium when the announcement was made.",
                "options": [
                  "was",
                  "were",
                  "is",
                  "are"
                ],
                "correctIndex": 1,
                "explanation": "When two subjects are joined by 'neither... nor', the verb agrees with the closer subject. Here 'students' is plural, so 'were' is correct."
              },
              {
                "question": "Choose the correct reported form of: He said, 'I will complete the assignment tomorrow.'",
                "options": [
                  "He said that he will complete the assignment tomorrow.",
                  "He said that he would complete the assignment the next day.",
                  "He said that he would have completed the assignment yesterday.",
                  "He told he can complete the assignment the following day."
                ],
                "correctIndex": 1,
                "explanation": "'Will' changes to 'would', and 'tomorrow' changes to 'the next day' / 'the following day'."
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          }
        ]
      }
    ]
  },
  {
    "id": "hindi_a",
    "name": "Hindi Course A",
    "nameHi": "हिंदी (कोर्स ए)",
    "code": "002",
    "icon": "auto_stories",
    "color": "#E11D48",
    "books": [
      {
        "id": "hindi_kshitij_2",
        "title": "Kshitij Part 2 (क्षितिज भाग 2 - काव्य एवं गद्य)",
        "titleHi": "क्षितिज भाग 2",
        "chapters": [
          {
            "number": 1,
            "title": "Pad (Surdas)",
            "titleHi": "पद (सूरदास)",
            "summary": "सूरदास के भ्रमरगीत से लिए गए चार पद। गोपियों द्वारा उद्धव के योग संदेश पर व्यंग्य और अनन्य कृष्ण प्रेम का प्रतिपादन।",
            "summaryHi": "गोपियों की विरह वेदना, कृष्ण के प्रति एकनिष्ठ प्रेम और उद्धव के शुष्क ज्ञान मार्ग की निरर्थकता का सजीव चित्रण।",
            "keyConcepts": [
              "उद्धव के ज्ञान मार्ग पर गोपियों के प्रेम मार्ग की विजय",
              "कमल के पत्ते और तेल की गागर का दृष्टांत",
              "राजधर्म की सीख: प्रजा को न सताया जाए",
              "अनुप्रास, रूपक और वक्रोक्ति अलंकार का सुंदर प्रयोग"
            ],
            "formulas": [
              "काव्य सौंदर्य: ब्रजभाषा, गेय पद, वियोग शृंगार रस, माधुर्य गुण"
            ],
            "importantQuestions": [
              {
                "question": "गोपियों ने उद्धव को 'बड़भागी' क्यों कहा है? क्या यह वास्तव में प्रशंसा है?",
                "questionHi": "गोपियों द्वारा उद्धव को बड़भागी कहने में क्या व्यंग्य छिपा है?",
                "solution": "गोपियों द्वारा उद्धव को बड़भागी कहना वस्तुतः प्रशंसा नहीं बल्कि तीखा व्यंग्य है। वे कहना चाहती हैं कि कृष्ण के सान्निध्य में रहकर भी उद्धव प्रेम के बंधन और विरह के आनंद से सर्वथा अछूते रहे हैं, इसलिए वे अभागे हैं।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "सूरदास के पदों में गोपियों ने अपने प्रेम की तुलना किससे की है?",
                "options": [
                  "गुड़ से चिपटी चींटी से",
                  "कमल के पत्ते से",
                  "तेल की मटकी से",
                  "भ्रमर से"
                ],
                "correctIndex": 0,
                "explanation": "गोपियों ने कहा है 'गुर चाँटी ज्यौं पागी' अर्थात् जिस प्रकार चींटी गुड़ में चिपक कर प्राण त्याग देती है, वैसे ही वे कृष्ण प्रेम में लीन हैं।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          },
          {
            "number": 2,
            "title": "Ram-Lakshman-Parashuram Samvad (Tulsidas)",
            "titleHi": "राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)",
            "summary": "रामचरितमानस के बालकांड से उद्धृत। सीता स्वयंवर में शिव धनुष टूटने पर परशुराम के क्रोध और लक्ष्मण के व्यंग्योक्तियों का ओजस्वी वर्णन।",
            "summaryHi": "शिव धनुष भंग के पश्चात परशुराम का उग्र स्वभाव, लक्ष्मण का निडर तर्क और श्री राम की मर्यादा एवं शांत स्वभाव का प्रभावशाली संगम।",
            "keyConcepts": [
              "परशुराम का क्षत्रिय संहारक रूप और फरसे का भय",
              "लक्ष्मण का 'धनुही' वाला दृष्टांत और व्यंग्य",
              "वीर एवं रौद्र रस का सुंदर परिपाक",
              "अवधी भाषा, चौपाई और दोहा छंद"
            ],
            "formulas": [
              "काव्य तत्व: अवधी भाषा, दोहा-चौपाई छंद, वीर रस, रौद्र रस, उपमा व अतिशयोक्ति अलंकार"
            ],
            "importantQuestions": [
              {
                "question": "लक्ष्मण ने वीर योद्धा की क्या-क्या विशेषताएँ बताई हैं?",
                "questionHi": "परशुराम के समक्ष लक्ष्मण द्वारा वीर योद्धा के कौन से गुण बताए गए हैं?",
                "solution": "लक्ष्मण के अनुसार सच्चा वीर रणभूमि में अपनी वीरता का प्रदर्शन कर्म द्वारा करता है, बातों से अपनी प्रशंसा नहीं करता। वीर योद्धा धैर्यवान, क्षमाशील और ब्राह्मणों, गायों एवं दुर्बलों पर शस्त्र न उठाने वाले होते हैं।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "शिव धनुष तोड़े जाने पर परशुराम ने किसे अपना मुख्य शत्रु घोषित किया?",
                "options": [
                  "सहस्रबाहु के समान धनुष तोड़ने वाले को",
                  "राजा जनक को",
                  "लक्ष्मण को",
                  "विश्वामित्र को"
                ],
                "correctIndex": 0,
                "explanation": "परशुराम ने क्रोधित होकर कहा कि जिसने भी यह शिव धनुष तोड़ा है, वह सहस्रबाहु के समान मेरा प्रबल शत्रु है।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          },
          {
            "number": 3,
            "title": "Netaji Ka Chashma (Swayam Prakash)",
            "titleHi": "नेताजी का चश्मा (स्वयं प्रकाश)",
            "summary": "कैप्टन चश्मेवाले के माध्यम से देश के साधारण नागरिकों और देशभक्ति की सच्ची भावना को उजागर करती एक मर्मस्पर्शी कहानी।",
            "summaryHi": "कस्बे के चौराहे पर नेताजी सुभाषचंद्र बोस की संगमरमर की मूर्ति पर चश्मा लगाने वाले गरीब, लंगड़े कैप्टन के प्रति सम्मान और सच्ची देशभक्ति का संदेश।",
            "keyConcepts": [
              "देशभक्ति किसी सीमा या सेना तक सीमित नहीं, वह हर नागरिक के आचरण में है",
              "कैप्टन का मूर्ति के प्रति आदरभाव और स्वतंत्रता सेनानियों के प्रति सम्मान",
              "हालदार साहब की संवेदनशीलता और पानवाले का प्रारंभिक उपहास व पश्चाताप",
              "बच्चों द्वारा सरकंडे का चश्मा लगाना: भावी पीढ़ी में जीवित देशभक्ति"
            ],
            "formulas": [
              "मूल भाव: राष्ट्रभक्ति केवल भाषणों में नहीं, अपितु राष्ट्र के प्रति सम्मानपूर्ण कार्यों में प्रकट होती है।"
            ],
            "importantQuestions": [
              {
                "question": "सेनानी न होते हुए भी चश्मेवाले को लोग 'कैप्टन' क्यों कहते थे?",
                "questionHi": "चश्मेवाले को कैप्टन कहे जाने के क्या कारण थे?",
                "solution": "यद्यपि वह फौज में नहीं था और शरीर से बूढ़ा व लंगड़ा था, परंतु उसके मन में देश के अमर शहीदों व नेताजी के प्रति असीम आदर एवं देशप्रेम था। वह नेताजी की मूर्ति को बिना चश्मे के नहीं देख सकता था। उसकी इसी देशसेवा की भावना के कारण लोग उसे आदर व व्यंग्य में कैप्टन कहते थे।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "कैप्टन की मृत्यु के बाद नेताजी की मूर्ति पर सरकंडे का चश्मा किसने लगाया था?",
                "options": [
                  "कस्बे के नन्हें बच्चों ने",
                  "हालदार साहब ने",
                  "पानवाले ने",
                  "मास्टर मोतीलाल ने"
                ],
                "correctIndex": 0,
                "explanation": "हालदार साहब ने देखा कि कैप्टन के न रहने पर भी बच्चों ने सरकंडे का चश्मा बनाकर नेताजी की मूर्ति पर पहनाया था, जिससे सिद्ध हुआ कि नई पीढ़ी में भी देशभक्ति जीवित है।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          },
          {
            "number": 4,
            "title": "Balgobin Bhagat (Ramvriksh Benipuri)",
            "titleHi": "बालगोबिन भगत (रामवृक्ष बेनीपुरी)",
            "summary": "कबीरपंथी गृहस्थ संत बालगोबिन भगत के आदर्श जीवन, सामाजिक रूढ़ियों पर प्रहार और आडंबरहीन भक्ति का प्रेरणादायी रेखाचित्र।",
            "summaryHi": "साधु केवल वेशभूषा से नहीं बल्कि पवित्र आचरण से होता है। बालगोबिन भगत द्वारा पुत्र की मृत्यु पर उत्सव मनाना और पतोहू का पुनर्विवाह करवाना सामाजिक क्रांति का प्रतीक है।",
            "keyConcepts": [
              "संन्यास का आधार बाहरी वेशभूषा नहीं अपितु जीवन के मानवीय मूल्य हैं",
              "कबीर के पदों का तन्मयता से गायन और ईश्वर के प्रति अटूट विश्वास",
              "विधवा विवाह का समर्थन और रूढ़िवादी मान्यताओं का साहसिक खंडन",
              "आत्मा का परमात्मा में विलीन होना: मृत्यु को मिलन का पर्व मानना"
            ],
            "formulas": [
              "मूल सिद्धांत: कर्मयोग + आडंबरविहीन भक्ति = सच्चा साधुत्व"
            ],
            "importantQuestions": [
              {
                "question": "भगत ने अपने बेटे की मृत्यु पर अपनी भावनाएँ किस प्रकार व्यक्त कीं?",
                "questionHi": "पुत्र की मृत्यु पर बालगोबिन भगत का आचरण सामान्य लोगों से भिन्न क्यों था?",
                "solution": "भगत ने रोने-धोने के स्थान पर पुत्र के शव के समीप बैठकर कबीर के पद गाए और अपनी पुत्रवधू से भी उत्सव मनाने को कहा, क्योंकि उनके अनुसार विरहिणी आत्मा का अपने प्रियतम परमात्मा से मिलन हो गया था।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "बालगोबिन भगत किस संत के आदर्शों और गीतों पर चलते थे?",
                "options": [
                  "कबीरदास",
                  "सूरदास",
                  "तुलसीदास",
                  "रैदास"
                ],
                "correctIndex": 0,
                "explanation": "बालगोबिन भगत कबीर को 'साहब' मानते थे, उन्हीं के गीतों को गाते और उन्हीं के आदेशों पर चलते थे।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          }
        ]
      },
      {
        "id": "hindi_kritika_2",
        "title": "Kritika Part 2 (कृतिका भाग 2 - पूरक पाठ्यपुस्तक)",
        "titleHi": "कृतिका भाग 2",
        "chapters": [
          {
            "number": 1,
            "title": "Mata Ka Aanchal (Shivpujan Sahay)",
            "titleHi": "माता का आँचल (शिवपूजन सहाय)",
            "summary": "देहाती जीवन, बाल सुलभ क्रीड़ाओं और पिता-माता के वात्सल्य का आत्मीय चित्रण। विपत्ति के समय बालक का पिता से अधिक माता के आँचल में सुरक्षा का अनुभव करना।",
            "summaryHi": "उपन्यास 'देहाती दुनिया' से उद्धृत। भोलानाथ का बचपन, ग्रामीण खेलकूद और सांप के डर से कांपते हुए माँ की गोद में शरण लेना।",
            "keyConcepts": [
              "ग्रामीण परिवेश और बच्चों के समूहबद्ध प्राकृतिक खेल",
              "पिता का बच्चों के साथ मित्रवत व्यवहार (रामायण पाठ, भोजन, खेल)",
              "माता के वात्सल्य और आँचल की असीम ममतामयी सुरक्षा"
            ],
            "formulas": [
              "केंद्रीय भाव: संकट में माता का आँचल सर्वाधिक शांति एवं सुरक्षा प्रदान करता है।"
            ],
            "importantQuestions": [
              {
                "question": "भोलानाथ अपने साथियों को देखकर सिसकना क्यों भूल जाता था?",
                "questionHi": "रोते हुए भोलानाथ का साथियों को देखकर रोना भूल जाना बाल स्वभाव की किस विशेषता को दर्शाता है?",
                "solution": "बाल स्वभाव खेल और हमउम्र साथियों की संगति को सबसे अधिक प्रिय मानता है। साथियों को नए-नए खेलों की तैयारी करते देख भोलानाथ अपनी पीड़ा व रोना भूलकर उनके साथ खेलने में मग्न हो जाता था।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "सांप के भय से व्याकुल भोलानाथ ने अंततः कहाँ शरण ली?",
                "options": [
                  "माता के आँचल में",
                  "पिताजी के पास",
                  "मित्रों के घर",
                  "खलिहान में"
                ],
                "correctIndex": 0,
                "explanation": "पिता के पुकारने पर भी भयभीत भोलानाथ सीधे अपनी माता के पास गया और उनके आँचल में छिपकर रोने लगा।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          },
          {
            "number": 2,
            "title": "Sana Sana Hath Jodi (Madhu Kankariya)",
            "titleHi": "साना साना हाथ जोड़ि (मधु कांकड़िया)",
            "summary": "सिक्किम, गंगटोक और हिमालय की अप्रतिम प्राकृतिक सुंदरता का सजीव यात्रा वृत्तांत। साथ ही पहाड़ी जीवन के कठोर संघर्ष और सीमा पर तैनात सैनिकों के प्रति नमन।",
            "summaryHi": "प्राकृतिक सौंदर्य के पीछे छिपी कठोर वास्तविकता: पहाड़ी महिलाओं द्वारा पत्थर तोड़कर सड़क बनाना और देश की सीमाओं की रक्षा करने वाले जवानों का त्याग।",
            "keyConcepts": [
              "गंगटोक: 'मेहनतकश बादशाहों का शहर'",
              "प्रकृति का सौंदर्य और उससे मिलने वाला आत्मिक सुकून",
              "सिक्किमी युवतियों का श्रम सौंदर्य और मातृत्व व श्रम का समन्वय",
              "कटाओ: 'भारत का स्विट्जरलैंड', जहाँ प्रकृति अपने विशुद्ध रूप में है"
            ],
            "formulas": [
              "साना साना हाथ जोड़ि = छोटे-छोटे हाथ जोड़कर प्रार्थना करती हूँ कि मेरा सारा जीवन अच्छाइयों को समर्पित हो।"
            ],
            "importantQuestions": [
              {
                "question": "गंगटोक को 'मेहनतकश बादशाहों का शहर' क्यों कहा गया है?",
                "questionHi": "सिक्किम की राजधानी गंगटोक को मेहनतकश बादशाहों का नगर क्यों माना गया है?",
                "solution": "गंगटोक के निवासियों ने विषम भौगोलिक परिस्थितियों के बावजूद अपने अनथक परिश्रम और लगन से इस पर्वतीय नगर को अत्यंत सुंदर और भव्य बनाया है। यहाँ का हर व्यक्ति स्वाभिमान और कठोर श्रम से जीवन जीता है।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "सिक्किम के कटाओ स्थल को किस उपनाम से जाना जाता है?",
                "options": [
                  "भारत का स्विट्जरलैंड",
                  "देवभूमि",
                  "सैलानियों का स्वर्ग",
                  "फूलों की घाटी"
                ],
                "correctIndex": 0,
                "explanation": "कटाओ अपनी प्राकृतिक बर्फबारी और सुंदरता के कारण 'भारत का स्विट्जरलैंड' कहलाता है।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          }
        ]
      },
      {
        "id": "hindi_vyakaran_a",
        "title": "Hindi Vyakaran Course A (व्याकरण - कोर्स ए)",
        "titleHi": "व्याकरण (कोर्स ए)",
        "chapters": [
          {
            "number": 1,
            "title": "Pad Parichay (पद परिचय)",
            "titleHi": "पद परिचय",
            "summary": "वाक्य में प्रयुक्त पदों (संज्ञा, सर्वनाम, विशेषण, क्रिया, क्रियाविशेषण, अव्यय) का व्याकरणिक परिचय देना। लिंग, वचन, कारक, काल, वाच्य आदि का उल्लेख करना।",
            "summaryHi": "व्याकरणिक दृष्टि से किसी पद की संपूर्ण पहचान प्रस्तुत करना ही पद परिचय कहलाता है।",
            "keyConcepts": [
              "संज्ञा पद परिचय: भेद (व्यक्तिवाचक, जातिवाचक, भाववाचक), लिंग, वचन, कारक, क्रिया से संबंध",
              "सर्वनाम पद परिचय: भेद (पुरुषवाचक, निजवाचक आदि), लिंग, वचन, कारक",
              "विशेषण पद परिचय: भेद, लिंग, वचन, विशेष्य",
              "क्रिया पद परिचय: अकर्मक/सकर्मक, काल, वाच्य, लिंग, वचन, धातु, कर्ता"
            ],
            "formulas": [
              "सूत्र: पद का भेद + लिंग + वचन + कारक + वाक्य के अन्य पदों से संबंध"
            ],
            "importantQuestions": [
              {
                "question": "रेखांकित पद का परिचय दीजिए: 'रोहन *तेज* दौड़ता है।'",
                "questionHi": "वाक्य में 'तेज' शब्द का व्याकरणिक पद परिचय लिखिए।",
                "solution": "तेज: रीतिवाचक क्रियाविशेषण, 'दौड़ता है' क्रिया की रीति/ढंग की विशेषता बता रहा है।",
                "marks": 1
              }
            ],
            "mcqs": [
              {
                "question": "'राधा पुस्तक पढ़ती है' में 'पुस्तक' पद का सही परिचय क्या है?",
                "options": [
                  "जातिवाचक संज्ञा, स्त्रीलिंग, एकवचन, कर्म कारक",
                  "व्यक्तिवाचक संज्ञा, पुल्लिंग, एकवचन, कर्ता कारक",
                  "भाववाचक संज्ञा, स्त्रीलिंग, बहुवचन, करण कारक",
                  "गुणवाचक विशेषण, एकवचन, कर्म कारक"
                ],
                "correctIndex": 0,
                "explanation": "'पुस्तक' जातिवाचक संज्ञा है, स्त्रीलिंग है, एकवचन है तथा 'पढ़ती है' क्रिया का कर्म है।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          },
          {
            "number": 2,
            "title": "Vakya Bhed & Vachya (वाक्य भेद एवं वाच्य)",
            "titleHi": "रचना के आधार पर वाक्य भेद एवं वाच्य",
            "summary": "रचना के आधार पर वाक्य के तीन भेद: सरल वाक्य, संयुक्त वाक्य और मिश्र वाक्य। वाक्य रूपांतरण। वाच्य के तीन भेद: कर्तृवाच्य, कर्मवाच्य और भाववाच्य।",
            "summaryHi": "सरल, संयुक्त व मिश्र वाक्यों की पहचान तथा वाच्य परिवर्तन के सटीक नियम।",
            "keyConcepts": [
              "सरल वाक्य: एक उद्देश्य और एक विधेय (एक मुख्य समापिका क्रिया)",
              "संयुक्त वाक्य: दो स्वतंत्र उपवाक्य समुच्चयबोधक अव्यय (और, तथा, किंतु, परंतु, या) से जुड़े हों",
              "मिश्र वाक्य: एक मुख्य उपवाक्य और एक या अधिक आश्रित उपवाक्य (कि, जो, जैसा, जब-तब, यदि-तो)",
              "कर्तृवाच्य (कर्ता की प्रधानता), कर्मवाच्य (कर्म की प्रधानता + 'के द्वारा'), भाववाच्य (क्रिया के भाव की प्रधानता, अकर्मक क्रिया)"
            ],
            "formulas": [
              "सरल -> संयुक्त: दो स्वतंत्र वाक्य बनाकर 'और/किंतु' से जोड़ें",
              "सरल -> मिश्र: 'जो/जिसने/जब/कि' लगाकर आश्रित उपवाक्य बनाएं",
              "कर्तृवाच्य -> कर्मवाच्य: कर्ता + से/के द्वारा + क्रिया में 'जा' रूप"
            ],
            "importantQuestions": [
              {
                "question": "निर्देशानुसार रूपांतरित कीजिए: 'सूर्योदय होने पर कुहासा छंट गया।' (संयुक्त वाक्य में)",
                "questionHi": "सरल वाक्य को संयुक्त वाक्य में बदलिए।",
                "solution": "सूर्योदय हुआ और कुहासा छंट गया।",
                "marks": 1
              }
            ],
            "mcqs": [
              {
                "question": "'मुझसे अब चला नहीं जाता' यह वाक्य किस वाच्य का उदाहरण है?",
                "options": [
                  "भाववाच्य",
                  "कर्मवाच्य",
                  "कर्तृवाच्य",
                  "मिश्र वाच्य"
                ],
                "correctIndex": 0,
                "explanation": "अकर्मक क्रिया है तथा असमर्थता का भाव प्रमुख है, अतः यह भाववाच्य है।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          }
        ]
      }
    ]
  },
  {
    "id": "hindi_b",
    "name": "Hindi Course B",
    "nameHi": "हिंदी (कोर्स बी)",
    "code": "085",
    "icon": "menu_book",
    "color": "#EA580C",
    "books": [
      {
        "id": "hindi_sparsh_2",
        "title": "Sparsh Part 2 (स्पर्श भाग 2 - पद्य एवं गद्य)",
        "titleHi": "स्पर्श भाग 2",
        "chapters": [
          {
            "number": 1,
            "title": "Saakhi (Kabir)",
            "titleHi": "साखी (कबीर)",
            "summary": "कबीरदास जी की साखियाँ। मीठी वाणी का महत्व, ईश्वर की सर्वव्यापकता, अहंकार का त्याग, कस्तूरी मृग का दृष्टांत और ज्ञान रूपी दीपक से अज्ञान के अंधकार का विनाश।",
            "summaryHi": "सधुक्कड़ी भाषा में रचित कबीर की साखियों में आडंबरहीन प्रेम, नम्रता, गुरु महिमा और प्रभु भक्ति का अमर संदेश।",
            "keyConcepts": [
              "ऐसी बानी बोलिए, मन का आपा खोइ: नम्र वाणी से आत्मशांति और दूसरों को सुख",
              "कस्तूरी कुंडलि बसै, मृग ढूँढै बन माहि: ईश्वर घट-घट में विद्यमान है",
              "जब मैं था तब हरि नहीं, अब हरि हैं मैं नाहिं: अहंकार और ईश्वर एक साथ नहीं रह सकते",
              "पोथी पढ़ि पढ़ि जग मुवा, पंडित भया न कोय: प्रेम का ढाई आखर ही वास्तविक ज्ञान है"
            ],
            "formulas": [
              "काव्य लक्षण: दोहा छंद, सधुक्कड़ी/पंचमेल खिचड़ी भाषा, शांत रस, नीतिपरक उपदेश"
            ],
            "importantQuestions": [
              {
                "question": "'मीठी वाणी बोलने से औरों को सुख और अपने तन को शीतलता कैसे प्राप्त होती है?'",
                "questionHi": "कबीर के अनुसार मधुर वाणी का क्या प्रभाव पड़ता है?",
                "solution": "मीठी वाणी बोलने से अहंकार नष्ट होता है, सुनने वाले के हृदय का क्रोध शांत होता है तथा बोलने वाले का मन भी तनावमुक्त एवं शांत रहता है। इससे पारस्परिक सद्भाव में वृद्धि होती है।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "कबीर की साखी में 'दीपक देख्या माहिं' से क्या तात्पर्य है?",
                "options": [
                  "ज्ञान रूपी प्रकाश का अंतःकरण में साक्षात्कार",
                  "मिट्टी का दिया जलाना",
                  "सूर्य का निकलना",
                  "मंदिर में दीप जलाना"
                ],
                "correctIndex": 0,
                "explanation": "कबीर के अनुसार गुरु की कृपा से जब हृदय में ज्ञान का दीपक प्रज्वलित होता है, तो अज्ञान का सारा अंधकार मिट जाता है।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          },
          {
            "number": 2,
            "title": "Bade Bhai Sahab (Premchand)",
            "titleHi": "बड़े भाई साहब (प्रेमचंद)",
            "summary": "मुंशी प्रेमचंद की प्रसिद्ध मनोवैज्ञानिक कहानी। पढ़ाई की रटंत प्रणाली पर व्यंग्य, बड़े भाई की जिम्मेदारी, अनुभव का महत्व और छोटे भाई का आदरभाव।",
            "summaryHi": "उम्र में पाँच साल बड़े भाई साहब का हर समय पढ़ते रहना और फेल होना, जबकि लेखक का खेलकूद में रहकर भी अव्वल आना। अंततः जीवन में किताबी ज्ञान से अधिक अनुभव के महत्व की स्थापना।",
            "keyConcepts": [
              "शिक्षा प्रणाली की विसंगतियाँ: रटने की प्रवृत्ति बनाम व्यावहारिक समझ",
              "बड़े भाई का आत्मानुशासन: छोटे भाई को सही राह दिखाने हेतु स्वयं की इच्छाओं का दमन",
              "अनुभव का महत्व: दादा और अम्मा के पास डिग्रियाँ न होते हुए भी दुनियादारी की गहरी समझ",
              "बाल मनोविज्ञान और भ्रातृ-प्रेम का संवेदनशील चित्रण"
            ],
            "formulas": [
              "मूल संदेश: जीवन में केवल किताबी ज्ञान पर्याप्त नहीं, बड़ों का अनुभव और व्यावहारिक सूझबूझ सर्वोपरि है।"
            ],
            "importantQuestions": [
              {
                "question": "बड़े भाई साहब छोटे भाई को क्या सलाह देते थे और क्यों?",
                "questionHi": "बड़े भाई साहब द्वारा दिए जाने वाले उपदेशों का लेखक पर क्या प्रभाव पड़ता था?",
                "solution": "बड़े भाई साहब छोटे भाई को खेलकूद छोड़कर दिन-रात पढ़ाई पर ध्यान देने तथा कभी घमंड न करने की सलाह देते थे। वे उदाहरण देते थे कि रावण और चक्रवर्ती राजाओं का घमंड भी नहीं टिका। लेखक इन उपदेशों से सहम जाता था किंतु खेल का मोह पूरी तरह नहीं छोड़ पाता था।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "बड़े भाई साहब के अनुसार कौन-सी शक्ति किताबी ज्ञान से अधिक महत्वपूर्ण है?",
                "options": [
                  "जीवन का व्यावहारिक अनुभव",
                  "रटने की क्षमता",
                  "कड़ा परिश्रम",
                  "खेल में दक्षता"
                ],
                "correctIndex": 0,
                "explanation": "बड़े भाई साहब ने समझाया कि अम्मा और दादा भले ही पढ़े-लिखे न हों, लेकिन उनके पास जीवन का जो गहरा अनुभव है, वह दुनिया की किसी डिग्री से बड़ा है।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          }
        ]
      },
      {
        "id": "hindi_sanchayan_2",
        "title": "Sanchayan Part 2 (संचयन भाग 2 - पूरक पाठ्यपुस्तक)",
        "titleHi": "संचयन भाग 2",
        "chapters": [
          {
            "number": 1,
            "title": "Harihar Kaka (Mithileshwar)",
            "titleHi": "हरिहर काका (मिथिलेश्वर)",
            "summary": "ग्रामीण समाज में पारिवारिक स्वार्थ, रिश्तों की खोखली बुनियाद और धार्मिक मठाधीशों के पाखंड का यथार्थवादी चित्रण। वृद्ध हरिहर काका की जमीन पर परिजनों और महंत की गिद्ध दृष्टि।",
            "summaryHi": "पंद्रह बीघे जमीन के लिए सगे भाइयों द्वारा अत्याचार और धर्मस्थल के महंत द्वारा अपहरण। वृद्धों की सामाजिक सुरक्षा और मानवीय संवेदना का हनन।",
            "keyConcepts": [
              "स्वार्थ से संचालित आधुनिक पारिवारिक संबंध",
              "धर्म के नाम पर मठों में पनपता अनैतिक आचरण और षड्यंत्र",
              "वृद्धावस्था में असहाय व्यक्तियों की त्रासदी",
              "काका का मौन: अन्याय के विरुद्ध मूक विरोध का प्रतीक"
            ],
            "formulas": [
              "सामाजिक यथार्थ: जब तक जमीन अपने नाम है, तभी तक रिश्तेदार पूछते हैं।"
            ],
            "importantQuestions": [
              {
                "question": "हरिहर काका को जबरन उठाकर ले जाने वाले कौन थे और उनका क्या उद्देश्य था?",
                "questionHi": "महंत और उसके आदमियों द्वारा हरिहर काका का अपहरण क्यों किया गया?",
                "solution": "ठाकुरबारी के महंत और उसके गुंडों ने हरिहर काका का अपहरण उनकी 15 बीघे उपजाऊ जमीन को ठाकुरबारी के नाम जबरन वसीयत कराने के लिए किया था ताकि वे उस पर कब्जा कर सकें।",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "हरिहर काका के पास कुल कितनी कृषि भूमि थी?",
                "options": [
                  "15 बीघे",
                  "20 बीघे",
                  "10 बीघे",
                  "25 बीघे"
                ],
                "correctIndex": 0,
                "explanation": "हरिहर काका के पास उनके हिस्से की 15 बीघे जमीन थी, जो सभी विवादों की जड़ थी।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          }
        ]
      },
      {
        "id": "hindi_vyakaran_b",
        "title": "Hindi Vyakaran Course B (व्याकरण - कोर्स बी)",
        "titleHi": "व्याकरण (कोर्स बी)",
        "chapters": [
          {
            "number": 1,
            "title": "Padbandh, Samas & Vakya Rupantaran (व्याकरण संपूर्ण)",
            "titleHi": "पदबंध, समास एवं वाक्य रूपांतरण",
            "summary": "पदबंध के पाँच भेद (संज्ञा, सर्वनाम, विशेषण, क्रिया, क्रियाविशेषण पदबंध)। समास के प्रमुख भेद (तत्पुरुष, कर्मधारय, द्विगु, द्वंद्व, बहुव्रीहि, अव्ययीभाव)। रचना के आधार पर वाक्य रूपांतरण और मुहावरे।",
            "summaryHi": "कोर्स बी के सभी महत्वपूर्ण व्याकरणिक विषय: पदबंध पहचान, समस्त पद व विग्रह, वाक्य रूपांतरण और पाठ्यपुस्तक आधारित मुहावरे।",
            "keyConcepts": [
              "पदबंध: जब एक से अधिक पद मिलकर एक व्याकरणिक इकाई का कार्य करें",
              "संज्ञा पदबंध (शीर्ष पर संज्ञा), विशेषण पदबंध (संज्ञा की विशेषता बताने वाला समूह)",
              "समास: दो या दो से अधिक शब्दों का मेल (द्वंद्व: दोनों पद प्रधान, बहुव्रीहि: अन्य पद प्रधान)",
              "मुहावरे: आँखें खुलना, दाँतों पसीना आना, हवा से बातें करना, आपे से बाहर होना"
            ],
            "formulas": [
              "पहचान: अंतिम पद संज्ञा = संज्ञा पदबंध; अंतिम पद सर्वनाम = सर्वनाम पदबंध",
              "कर्मधारय = विशेषण-विशेष्य या उपमेय-उपमान (नीलगगन)",
              "बहुव्रीहि = अन्य पद प्रधान (दशानन = रावण)"
            ],
            "importantQuestions": [
              {
                "question": "'दशरथ पुत्र राम ने रावण को मारा।' इस वाक्य में 'दशरथ पुत्र राम' कौन-सा पदबंध है?",
                "questionHi": "पदबंध का भेद पहचानिए।",
                "solution": "संज्ञा पदबंध (क्योंकि अंतिम और मुख्य पद 'राम' संज्ञा है)।",
                "marks": 1
              }
            ],
            "mcqs": [
              {
                "question": "'त्रिफला' शब्द में कौन-सा समास है?",
                "options": [
                  "द्विगु समास",
                  "द्वंद्व समास",
                  "तत्पुरुष समास",
                  "अव्ययीभाव समास"
                ],
                "correctIndex": 0,
                "explanation": "पहला पद संख्यावाचक विशेषण ('त्रि' = तीन) है तथा समूह का बोध कराता है, अतः द्विगु समास है।"
              }
            ],
            "progressStatus": "Not Started",
            "isBookmarked": false
          }
        ]
      }
    ]
  },
  {
    "id": "it_ai",
    "name": "Information Technology / AI (402/417)",
    "nameHi": "सूचना प्रौद्योगिकी / एआई",
    "code": "402",
    "icon": "computer",
    "color": "#0284C7",
    "books": [
      {
        "id": "it402",
        "title": "Information Technology (Subject Code 402)",
        "titleHi": "सूचना प्रौद्योगिकी (कोड 402)",
        "chapters": [
          {
            "number": 1,
            "title": "Digital Documentation (Advanced)",
            "titleHi": "डिजिटल डॉक्यूमेंटेशन (उन्नत)",
            "summary": "Styles and formatting, inserting and using images in LibreOffice Writer / MS Word, creating and managing Table of Contents (TOC), templates, mail merge.",
            "summaryHi": "स्टाइल और फॉर्मेटिंग, छवियों का प्रयोग, विषय-सूची (TOC) निर्माण, टेम्पलेट तथा मेल मर्ज।",
            "keyConcepts": [
              "Paragraph, Character, Page and Frame styles",
              "Mail merge for bulk personalized letters",
              "Creating and updating automatic Table of Contents"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What is Mail Merge? State its two main components.",
                "questionHi": "मेल मर्ज क्या है? इसके दो मुख्य घटक बताइए।",
                "solution": "Mail Merge creates personalized letters/documents from a single template for multiple recipients. Components: Main Document and Data Source.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which shortcut key is used to open Styles and Formatting window in LibreOffice Writer?",
                "options": [
                  "F11",
                  "F5",
                  "F7",
                  "F12"
                ],
                "correctIndex": 0,
                "explanation": "F11 opens the Styles and Formatting deck."
              }
            ]
          },
          {
            "number": 2,
            "title": "Electronic Spreadsheet (Advanced)",
            "titleHi": "इलेक्ट्रॉनिक स्प्रेडशीट (उन्नत)",
            "summary": "Consolidating data, creating subtotals, What-If analysis (Scenarios, Goal Seek, Solver), linking spreadsheets, sharing worksheets and macros.",
            "summaryHi": "डेटा समेकन (Consolidation), सबटोटल, व्हाट-इफ विश्लेषण (Goal Seek), वर्कशीट लिंकिंग एवं मैक्रो।",
            "keyConcepts": [
              "Goal Seek finds input needed to achieve target output",
              "Consolidate merges data from multiple sheets",
              "Macros record repetitive tasks"
            ],
            "formulas": [
              "Goal Seek: Set cell, To value, By changing cell"
            ],
            "importantQuestions": [
              {
                "question": "What is Goal Seek in spreadsheets?",
                "questionHi": "स्प्रेडशीट में गोल सीक (Goal Seek) क्या है?",
                "solution": "Goal Seek is a What-If analysis tool that finds the input value needed to produce a specific target result in a formula.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "Which tool is best suited to determine the exam score needed to reach an overall 85% average?",
                "options": [
                  "Subtotals",
                  "Goal Seek",
                  "Macro",
                  "Consolidate"
                ],
                "correctIndex": 1,
                "explanation": "Goal Seek solves for unknown input to match a desired output target."
              }
            ]
          },
          {
            "number": 3,
            "title": "Database Management System (RDBMS)",
            "titleHi": "डेटाबेस प्रबंधन प्रणाली (RDBMS)",
            "summary": "Concepts of DBMS, tables, records, fields, keys (Primary Key, Foreign Key, Candidate Key), creating tables, forms, queries, and reports using SQL.",
            "summaryHi": "डेटाबेस की मूल अवधारणाएं, टेबल, प्राइमरी की, फॉरेन की, एसक्यूएल (SQL) क्वेरी, फॉर्म और रिपोर्ट।",
            "keyConcepts": [
              "Relational model connects tables through keys",
              "Primary Key uniquely identifies each row and cannot be NULL",
              "SQL commands: SELECT, INSERT, UPDATE, DELETE"
            ],
            "formulas": [
              "SELECT column1 FROM table WHERE condition;"
            ],
            "importantQuestions": [
              {
                "question": "Differentiate between Primary Key and Foreign Key.",
                "questionHi": "प्राइमरी की और फॉरेन की में अंतर स्पष्ट कीजिए।",
                "solution": "A Primary Key uniquely identifies each record in its table without duplicates or NULLs. A Foreign Key is a field in a table that points to the Primary Key of another table, establishing a relationship.",
                "marks": 3
              }
            ],
            "mcqs": [
              {
                "question": "Which of the following keys cannot contain NULL values?",
                "options": [
                  "Primary Key",
                  "Foreign Key",
                  "Alternate Key",
                  "Composite Key with Nulls"
                ],
                "correctIndex": 0,
                "explanation": "A Primary Key must be unique and NOT NULL."
              }
            ]
          },
          {
            "number": 4,
            "title": "Web Applications and Security",
            "titleHi": "वेब अनुप्रयोग एवं सुरक्षा",
            "summary": "Computer accessibility options, networking fundamentals (LAN, WAN, Internet), instant messaging, blogs, online transactions, internet security best practices.",
            "summaryHi": "कम्प्यूटर एक्सेसिबिलिटी विकल्प, नेटवर्किंग, ऑनलाइन सुरक्षा, मजबूत पासवर्ड, फ़िशिंग और मैलवेयर से बचाव।",
            "keyConcepts": [
              "Accessibility options: Sticky Keys, Filter Keys, Toggle Keys, High Contrast",
              "Network topologies: Star, Bus, Ring",
              "Security: Strong passwords, two-factor authentication, avoiding phishing emails and unsafe downloads"
            ],
            "formulas": [],
            "importantQuestions": [
              {
                "question": "What are Sticky Keys and who benefits from them?",
                "questionHi": "स्टिकी कीज क्या हैं और इनसे किन्हें लाभ होता है?",
                "solution": "Sticky Keys is an accessibility feature that allows modifier keys (Shift, Ctrl, Alt) to remain active until another key is pressed, assisting users with physical disabilities who cannot press multiple keys simultaneously.",
                "marks": 2
              }
            ],
            "mcqs": [
              {
                "question": "Which accessibility feature produces a tone when Caps Lock, Num Lock or Scroll Lock is turned on?",
                "options": [
                  "Sticky Keys",
                  "Toggle Keys",
                  "Filter Keys",
                  "SoundSentry"
                ],
                "correctIndex": 1,
                "explanation": "Toggle Keys emits an audio beep when locking keys are toggled."
              }
            ]
          }
        ]
      }
    ]
  }
];

if (typeof window !== 'undefined') { window.NCERT_DATA = NCERT_DATA; }
if (typeof module !== 'undefined' && module.exports) { module.exports = NCERT_DATA; }
