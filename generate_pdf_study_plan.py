import json
import datetime

# PDF Phase definitions
phases = [
    # Phase 1: Nov 15 - Nov 30 (16 Days)
    {
        "start": datetime.date(2026, 11, 15),
        "end": datetime.date(2026, 11, 18),
        "phase": "Phase 1: Foundation Building",
        "maths": {"topic": "Statistics", "minutes": 90, "target": "Mean, median, mode calculation & empirical relation"},
        "science": {"topic": "Chemical Reactions & Equations", "minutes": 60, "target": "Balancing equations, types of reactions, oxidation & reduction"},
        "sst": {"topic": "Forest & Wildlife Resources, Water Resources", "minutes": 60, "target": "Conservation of forests, tiger project, multi-purpose dams & rainwater harvesting"},
        "english": {"topic": "A Letter to God, Dust of Snow / Fire & Ice", "minutes": 30, "target": "Lencho's irony, central themes and poetic devices"}
    },
    {
        "start": datetime.date(2026, 11, 19),
        "end": datetime.date(2026, 11, 22),
        "phase": "Phase 1: Foundation Building",
        "maths": {"topic": "Real Numbers & Polynomials", "minutes": 90, "target": "Fundamental theorem of arithmetic, proving irrationality & zeroes relation"},
        "science": {"topic": "Acids, Bases & Salts", "minutes": 60, "target": "pH scale, neutralization, baking soda, washing soda & POP"},
        "sst": {"topic": "Resources & Development", "minutes": 60, "target": "Types of resources, land degradation, soil classification & erosion control"},
        "english": {"topic": "A Triumph of Surgery, Nelson Mandela", "minutes": 30, "target": "Tricki's recovery & Mandela's twin obligations and struggle"}
    },
    {
        "start": datetime.date(2026, 11, 23),
        "end": datetime.date(2026, 11, 26),
        "phase": "Phase 1: Foundation Building",
        "maths": {"topic": "Quadratic Equations", "minutes": 90, "target": "Factorisation, quadratic formula & nature of roots (discriminant)"},
        "science": {"topic": "Electricity", "minutes": 60, "target": "Ohm's law, resistance factors, series & parallel numericals, Joule's law"},
        "sst": {"topic": "The Rise of Nationalism in Europe (Part 1)", "minutes": 60, "target": "French revolution, Napoleonic Code 1804 & Vienna Congress 1815"},
        "english": {"topic": "Two Stories about Flying, A Tiger in the Zoo", "minutes": 30, "target": "Young seagull's flight, black aeroplane & caged tiger contrast"}
    },
    {
        "start": datetime.date(2026, 11, 27),
        "end": datetime.date(2026, 11, 30),
        "phase": "Phase 1: Foundation Building",
        "maths": {"topic": "Pair of Linear Equations in Two Variables", "minutes": 90, "target": "Substitution and elimination methods, word problems & consistency"},
        "science": {"topic": "Life Processes (Part 1: Nutrition & Respiration)", "minutes": 60, "target": "Photosynthesis, human digestive system & aerobic vs anaerobic respiration"},
        "sst": {"topic": "Rise of Nationalism in Europe (Part 2), Development", "minutes": 60, "target": "Unification of Germany & Italy, Per Capita Income & HDI index"},
        "english": {"topic": "The Thief's Story, The Midnight Visitor", "minutes": 30, "target": "Hari Singh's reform & Ausable's witty presence of mind"}
    },

    # Phase 2: Dec 1 - Dec 15 (15 Days)
    {
        "start": datetime.date(2026, 12, 1),
        "end": datetime.date(2026, 12, 4),
        "phase": "Phase 2: Core Concept Mastery",
        "maths": {"topic": "Arithmetic Progressions", "minutes": 90, "target": "nth term, sum of first n terms & practical application word problems"},
        "science": {"topic": "Life Processes (Part 2: Transportation & Excretion)", "minutes": 60, "target": "Human heart double circulation, nephron diagram & urine formation"},
        "sst": {"topic": "Power Sharing, Federalism", "minutes": 60, "target": "Belgium accommodation vs Sri Lanka, federal lists & 1992 decentralisation"},
        "english": {"topic": "The Ball Poem / Amanda!, Diary of Anne Frank", "minutes": 30, "target": "Epistemology of loss, teenage escapism & Kitty diary entries"}
    },
    {
        "start": datetime.date(2026, 12, 5),
        "end": datetime.date(2026, 12, 8),
        "phase": "Phase 2: Core Concept Mastery",
        "maths": {"topic": "Triangles", "minutes": 90, "target": "Basic Proportionality Theorem (Thales) proof & AA/SSS/SAS similarity"},
        "science": {"topic": "Our Environment, Control & Coordination", "minutes": 60, "target": "10% energy law, biomagnification, neuron structure & reflex arc"},
        "sst": {"topic": "Sectors of Indian Economy, Lifelines of National Economy", "minutes": 60, "target": "Primary/Secondary/Tertiary GDP shares, disguised unemployment & Golden Quadrilateral"},
        "english": {"topic": "A Question of Trust, Glimpses of India (1, 2, 3)", "minutes": 30, "target": "Horace Danby & Baker from Goa, Coorg, Tea from Assam"}
    },
    {
        "start": datetime.date(2026, 12, 9),
        "end": datetime.date(2026, 12, 12),
        "phase": "Phase 2: Core Concept Mastery",
        "maths": {"topic": "Coordinate Geometry", "minutes": 90, "target": "Distance formula, section formula & mid-point problems"},
        "science": {"topic": "Magnetic Effects of Electric Current", "minutes": 60, "target": "Magnetic field lines, Fleming's left hand rule, solenoid & domestic circuits"},
        "sst": {"topic": "Nationalism in India (Part 1)", "minutes": 60, "target": "Rowlatt Act, Jallianwala Bagh massacre, Khilafat & Non-Cooperation movement"},
        "english": {"topic": "Mijbil the Otter, The Tale of Custard the Dragon", "minutes": 30, "target": "Maxwell's otter antics & humorous ballad of true courage"}
    },
    {
        "start": datetime.date(2026, 12, 13),
        "end": datetime.date(2026, 12, 15),
        "phase": "Phase 2: Core Concept Mastery",
        "maths": {"topic": "Introduction to Trigonometry", "minutes": 90, "target": "Trigonometric ratios table (0-90 deg) & proving identity equations"},
        "science": {"topic": "How do Organisms Reproduce?", "minutes": 60, "target": "Asexual fission/budding, flower double fertilization & human reproduction"},
        "sst": {"topic": "Nationalism in India (Part 2), Agriculture", "minutes": 60, "target": "Dandi Salt March 1930, Poona Pact & Rabi/Kharif cropping seasons"},
        "english": {"topic": "The Trees / Fog / For Anne Gregory", "minutes": 30, "target": "Nature liberation, cat-feet fog metaphor & inner vs outer beauty"}
    },

    # Phase 3: Dec 16 - Dec 31 (16 Days)
    {
        "start": datetime.date(2026, 12, 16),
        "end": datetime.date(2026, 12, 19),
        "phase": "Phase 3: High-Yield Application",
        "maths": {"topic": "Some Applications of Trigonometry", "minutes": 90, "target": "Heights and distances, angles of elevation and depression 2-triangle problems"},
        "science": {"topic": "Heredity", "minutes": 60, "target": "Mendel's monohybrid & dihybrid crosses, dominant/recessive, sex determination"},
        "sst": {"topic": "Minerals & Energy Resources, Making of a Global World", "minutes": 60, "target": "Ferrous/non-ferrous, conventional vs solar/wind & Silk routes, Great Depression"},
        "english": {"topic": "The Sermon at Benares, Footprints Without Feet", "minutes": 30, "target": "Buddha's teaching to Kisa Gotami & Griffin's lawless invisibility"}
    },
    {
        "start": datetime.date(2026, 12, 20),
        "end": datetime.date(2026, 12, 23),
        "phase": "Phase 3: High-Yield Application",
        "maths": {"topic": "Circles", "minutes": 90, "target": "Tangent perpendicular to radius & equality of tangents from external point"},
        "science": {"topic": "Metals & Non-metals", "minutes": 60, "target": "Reactivity series, ionic bonding, roasting/calcination & corrosion prevention"},
        "sst": {"topic": "Gender, Religion & Caste, Money & Credit", "minutes": 60, "target": "Secular state, feminist movements, formal vs informal credit & SHGs"},
        "english": {"topic": "The Making of a Scientist, The Necklace", "minutes": 30, "target": "Richard Ebright's curiosity & Matilda Loisel's vanity lesson"}
    },
    {
        "start": datetime.date(2026, 12, 24),
        "end": datetime.date(2026, 12, 27),
        "phase": "Phase 3: High-Yield Application",
        "maths": {"topic": "Areas Related to Circles", "minutes": 90, "target": "Sector and segment area calculations & combined plane figure areas"},
        "science": {"topic": "Light – Reflection & Refraction", "minutes": 60, "target": "Mirror and lens formula numericals, sign convention & power of lens"},
        "sst": {"topic": "Political Parties, Manufacturing Industries", "minutes": 60, "target": "Functions & challenges of parties, agro vs mineral industries & pollution control"},
        "english": {"topic": "Madam Rides the Bus, Bholi", "minutes": 30, "target": "Valli's bus journey & Bholi's transformation through education"}
    },
    {
        "start": datetime.date(2026, 12, 28),
        "end": datetime.date(2026, 12, 31),
        "phase": "Phase 3: High-Yield Application",
        "maths": {"topic": "Surface Areas & Volumes", "minutes": 90, "target": "Combination of solids (cylinder, cone, hemisphere) surface area and volume"},
        "science": {"topic": "The Human Eye & Colourful World", "minutes": 60, "target": "Myopia & hypermetropia corrections, prism dispersion & atmospheric refraction"},
        "sst": {"topic": "Print Culture & the Modern World", "minutes": 60, "target": "Gutenberg press, Martin Luther reformation & vernacular press in India"},
        "english": {"topic": "The Proposal, The Book That Saved the Earth", "minutes": 30, "target": "Lomov-Natalya comedy & Martian Think-Tank Mother Goose satire"}
    },

    # Phase 4: Jan 1 - Jan 15 (15 Days)
    {
        "start": datetime.date(2027, 1, 1),
        "end": datetime.date(2027, 1, 5),
        "phase": "Phase 4: Intensive Practice & Synthesis",
        "maths": {"topic": "Probability, Formula & Theorem Rapid Review", "minutes": 90, "target": "Classical probability problems + full formula sheet recall"},
        "science": {"topic": "Carbon & its Compounds", "minutes": 60, "target": "Catenation, tetravalency, homologous series, ethanol & micelle cleaning"},
        "sst": {"topic": "Outcomes of Democracy, Globalisation & Indian Economy", "minutes": 60, "target": "Accountable & legitimate government, MNCs, liberalisation 1991 & WTO"},
        "english": {"topic": "Grammar (Tenses, Modals, Subject-Verb Concord)", "minutes": 30, "target": "Integrated grammar gap-filling and error-correction drills"}
    },
    {
        "start": datetime.date(2027, 1, 6),
        "end": datetime.date(2027, 1, 10),
        "phase": "Phase 4: Intensive Practice & Synthesis",
        "maths": {"topic": "Weak Chapters Re-practice (Triangles, Trig, Surface Areas)", "minutes": 90, "target": "High-difficulty proving questions and 5-mark exemplar problems"},
        "science": {"topic": "Physics Numericals & Ray Diagrams + Chemistry Equations", "minutes": 60, "target": "All ray diagrams, mirror/lens numericals, circuit calculations"},
        "sst": {"topic": "Map Work (History & Geography) + Key Terms", "minutes": 60, "target": "Locating major dams, thermal/nuclear plants, ports, airports & Congress sessions"},
        "english": {"topic": "Grammar (Determiners, Reported Speech) & Writing Formats", "minutes": 30, "target": "Direct to indirect speech rules, formal letter & analytical paragraph"}
    },
    {
        "start": datetime.date(2027, 1, 11),
        "end": datetime.date(2027, 1, 15),
        "phase": "Phase 4: Intensive Practice & Synthesis",
        "maths": {"topic": "2 Full-Length Maths Sample Papers & Error Analysis", "minutes": 90, "target": "80-mark timed simulation paper + logging doubts in mistake notebook"},
        "science": {"topic": "2 Full-Length Science Sample Papers & Exemplar Review", "minutes": 60, "target": "Complete 39-question CBSE pattern test with Section A to E"},
        "sst": {"topic": "2 Full-Length SST Sample Papers & Timeline Revision", "minutes": 60, "target": "Full mock test with source-based case studies & map work"},
        "english": {"topic": "Literature Character Sketches, Poetic Devices & 1 Sample Paper", "minutes": 30, "target": "Nelson Mandela, Lencho, Ausable, Bholi sketches + sample paper"}
    }
]

# Generate day-by-day 93 days roadmap: Nov 15, 2026 to Feb 15, 2027
full_roadmap = []
cur_date = datetime.date(2026, 11, 15)
end_date = datetime.date(2027, 2, 15)
day_idx = 1

while cur_date <= end_date:
    date_str = cur_date.strftime("%Y-%m-%d")
    dow = cur_date.strftime("%A")
    is_sunday = dow == "Sunday"

    # Match Phase 1-4 block
    matched_block = None
    for b in phases:
        if b["start"] <= cur_date <= b["end"]:
            matched_block = b
            break

    if matched_block:
        phase_name = matched_block["phase"]
        maths_info = matched_block["maths"]
        sci_info = matched_block["science"]
        sst_info = matched_block["sst"]
        eng_info = matched_block["english"]
    else:
        # Final Sprint (Jan 16 - Feb 15)
        phase_name = "Phase 5: Final Board Exam Simulation & Mastery"
        sprint_cycle = (day_idx - 63) % 4
        if sprint_cycle == 0:
            maths_info = {"topic": "Mathematics All-India Pre-Board Paper", "minutes": 90, "target": "Speed and step-marking presentation drill"}
            sci_info = {"topic": "Science Section B/C/D High-Weightage Practice", "minutes": 60, "target": "Master 3-mark and 5-mark structured answers"}
            sst_info = {"topic": "Social Science Case-Based Questions", "minutes": 60, "target": "Analyze source passages and extract perfect answers"}
            eng_info = {"topic": "English Analytical Paragraph & Grammar", "minutes": 30, "target": "Data charts, graphs & letter to editor practice"}
        elif sprint_cycle == 1:
            maths_info = {"topic": "Trigonometry & Geometry Proof Masterclass", "minutes": 90, "target": "BPT, circle tangents, heights & distances proofs"}
            sci_info = {"topic": "Electricity & Light Numerical Marathon", "minutes": 60, "target": "Equivalent resistance, heating effect & refractive index"}
            sst_info = {"topic": "Complete India Map Skills Drill", "minutes": 60, "target": "100% accurate identification of ports, mines & soil belts"}
            eng_info = {"topic": "Literature Long Answer Value Questions", "minutes": 30, "target": "Thematic questions linking multiple stories"}
        elif sprint_cycle == 2:
            maths_info = {"topic": "Algebra & Statistics Marathon", "minutes": 90, "target": "Quadratics, AP sum formulas, mean/median/mode"}
            sci_info = {"topic": "Chemical Equations & Carbon Reaction Maps", "minutes": 60, "target": "Combustion, oxidation, esterification & saponification"}
            sst_info = {"topic": "History Dates & Nationalism Timeline", "minutes": 60, "target": "Revising 1804 to 1947 events chronologically"}
            eng_info = {"topic": "Footprints Without Feet Character Analysis", "minutes": 30, "target": "Griffin, Horace Danby, Matilda, Bholi depth study"}
        else:
            maths_info = {"topic": "Complete Board Pattern Mock Exam #4", "minutes": 90, "target": "Full 38 questions simulation under timed condition"}
            sci_info = {"topic": "Science Exemplar Assertion-Reason Blast", "minutes": 60, "target": "Solve 50 tricky assertion and reason questions"}
            sst_info = {"topic": "Political Science & Economics Rapid Recall", "minutes": 60, "target": "Key definitions, terms and constitutional reforms"}
            eng_info = {"topic": "CBSE Board Official Sample Paper 2027", "minutes": 30, "target": "Timed Section A (Reading comprehension) drill"}

    # Default Alarms based on PDF Daily Execution Sequence:
    # 1. Mathematics (1.5 hr) when concentration is highest: 06:00 AM
    # 2. Science (1.0 hr) concepts and numericals: 05:30 PM
    # 3. Social Science (1.0 hr) active recall and map work: 07:00 PM
    # 4. English (0.5 hr) reading and grammar: 08:30 PM
    daily_slots = [
        {
            "subject": "Mathematics",
            "topic": maths_info["topic"],
            "durationMinutes": maths_info["minutes"],
            "target": maths_info["target"],
            "scheduledTime": "06:00",
            "alarmEnabled": True
        },
        {
            "subject": "Science",
            "topic": sci_info["topic"],
            "durationMinutes": sci_info["minutes"],
            "target": sci_info["target"],
            "scheduledTime": "17:30",
            "alarmEnabled": True
        },
        {
            "subject": "Social Science",
            "topic": sst_info["topic"],
            "durationMinutes": sst_info["minutes"],
            "target": sst_info["target"],
            "scheduledTime": "19:00",
            "alarmEnabled": True
        },
        {
            "subject": "English",
            "topic": eng_info["topic"],
            "durationMinutes": eng_info["minutes"],
            "target": eng_info["target"],
            "scheduledTime": "20:30",
            "alarmEnabled": True
        }
    ]

    total_mins = sum(s["durationMinutes"] for s in daily_slots)

    full_roadmap.append({
        "dayIndex": day_idx,
        "date": date_str,
        "dayOfWeek": dow,
        "phase": phase_name,
        "isSunday": is_sunday,
        "sundayBufferRule": "Sunday 4-Hour Buffer Block: Clear any unfinished weekly targets before beginning the next block." if is_sunday else None,
        "totalDailyHours": total_mins / 60.0,
        "status": "Pending",
        "slots": daily_slots,
        # Backward compatibility fields for main UI lists:
        "subject": "4-Subject Daily Revision" if is_sunday else daily_slots[0]["subject"],
        "chapterTitle": f"Maths ({daily_slots[0]['topic']}) + Science ({daily_slots[1]['topic']})",
        "topic": f"SST: {daily_slots[2]['topic']} • English: {daily_slots[3]['topic']}",
        "estimatedMinutes": total_mins,
        "scheduledTime": "06:00",
        "alarmEnabled": True
    })

    cur_date += datetime.timedelta(days=1)
    day_idx += 1

print(f"Generated {len(full_roadmap)} days with full 4-hour, 4-subject breakdown matching PDF!")

# Save to Android Assets
with open(r"c:\Users\harsh\OneDrive\Desktop\GuruStudy\android\app\src\main\assets\default_roadmap_93days.json", "w", encoding="utf-8") as f:
    json.dump(full_roadmap, f, ensure_ascii=False, indent=2)

# Save to Web Data
with open(r"c:\Users\harsh\OneDrive\Desktop\GuruStudy\web\data\default_roadmap_93days.json", "w", encoding="utf-8") as f:
    json.dump(full_roadmap, f, ensure_ascii=False, indent=2)

with open(r"c:\Users\harsh\OneDrive\Desktop\GuruStudy\web\data\roadmap-data.js", "w", encoding="utf-8") as f:
    f.write("const ROADMAP_DATA = " + json.dumps(full_roadmap, ensure_ascii=False, indent=2) + ";\n")

print("Files saved successfully!")
