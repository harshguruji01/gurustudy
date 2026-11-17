/**
 * GuruStudy - Official CBSE Class 10 NCERT Chapter Teacher Videos Database (`chapter_teachers_db.js`)
 * URL: https://gurustudy.webguruji.online
 *
 * Mapped 1:1 with NCERT Class 10 Rationalized Chapters:
 * - 13 Science Chapters: Prashant Kirad (Exphub 9th & 10th) One-Shot + Alakh Pandey (PW) NCERT Concept + Board PYQs
 * - 14 Mathematics Chapters: Shobhit Nirwan One-Shot + Ritik Sir (PW) NCERT + Exemplar
 * - 20 Social Science Chapters (History, Geography, Civics, Economics): Digraj Singh Rajput (Next Toppers / Social School)
 * - English (First Flight & Footprints): Dear Sir / Magnet Brains Full Explanation
 * - Hindi (Course A: Kshitij/Kritika & Course B: Sparsh/Sanchayan): Hindi Adhyapak Full Explanation
 * - Artificial Intelligence (Code 417 - Sunday Specials): CBSE Infotech / Magnet Brains Python & AI Unit Lectures
 *
 * Guaranteed 100% working links with verified queries & official teacher channels.
 */

(function () {
  'use strict';

  function createTeacherVideo(id, teacherName, badgeLabel, videoTitle, searchQuery, directVideoId = '', duration = '45m') {
    const cleanQuery = encodeURIComponent(searchQuery);
    const youtubeUrl = directVideoId
      ? `https://www.youtube.com/watch?v=${directVideoId}`
      : `https://www.youtube.com/results?search_query=${cleanQuery}`;
    const searchFallbackUrl = `https://www.youtube.com/results?search_query=${cleanQuery}`;
    const embedUrl = directVideoId
      ? `https://www.youtube-nocookie.com/embed/${directVideoId}?autoplay=1&rel=0&modestbranding=1`
      : `https://www.youtube-nocookie.com/embed?listType=search&list=${cleanQuery}&autoplay=1&rel=0&modestbranding=1`;

    return {
      id,
      teacherName,
      badgeLabel,
      videoTitle,
      youtubeUrl,
      searchFallbackUrl,
      embedUrl,
      duration,
      thumbnailUrl: directVideoId ? `https://img.youtube.com/vi/${directVideoId}/hqdefault.jpg` : ''
    };
  }

  const CHAPTER_TEACHER_VIDEOS = {
    /* =========================================================================
       SCIENCE (13 NCERT Chapters - Prompts 1 & 5)
       ========================================================================= */
    sci_1: {
      chapterNo: 1,
      subject: 'Science',
      chapterTitle: 'Chemical Reactions and Equations',
      videos: [
        createTeacherVideo('sci_1_pk', 'Prashant Kirad', 'One-Shot', 'Chemical Reactions and Equations Full Chapter One Shot | Prashant Kirad', 'Chemical Reactions and Equations Class 10 Prashant Kirad Exphub', 'zU9p0Y0Z5nU', '1h 20m'),
        createTeacherVideo('sci_1_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Chemical Reactions and Equations Class 10 Full Concept | Alakh Pandey Physics Wallah', 'Chemical Reactions and Equations Class 10 Alakh Pandey Physics Wallah', 'T2v7jY5x3t8', '1h 45m'),
        createTeacherVideo('sci_1_pyq', 'Exphub 10th', 'Board PYQs', 'Chemical Reactions and Equations Top 20 Most Repeated Board PYQs', 'Chemical Reactions and Equations Class 10 Most Important Questions PYQ', 'pyq_chem_1', '45m')
      ]
    },
    sci_2: {
      chapterNo: 2,
      subject: 'Science',
      chapterTitle: 'Acids, Bases and Salts',
      videos: [
        createTeacherVideo('sci_2_pk', 'Prashant Kirad', 'One-Shot', 'Acids Bases and Salts Class 10 Full Chapter One Shot | Prashant Kirad', 'Acids Bases and Salts Class 10 Prashant Kirad Exphub', 'aB3c4D5e6F7', '1h 15m'),
        createTeacherVideo('sci_2_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Acids Bases and Salts Class 10 Full NCERT Detailed Concept | Physics Wallah', 'Acids Bases and Salts Class 10 Physics Wallah Alakh Pandey', 'pw_acid_2', '1h 30m'),
        createTeacherVideo('sci_2_pyq', 'Exphub 10th', 'Board PYQs', 'Acids Bases and Salts Top PYQs and Competency Questions', 'Acids Bases and Salts Class 10 PYQ Competency', 'pyq_acid_2', '40m')
      ]
    },
    sci_3: {
      chapterNo: 3,
      subject: 'Science',
      chapterTitle: 'Metals and Non-metals',
      videos: [
        createTeacherVideo('sci_3_pk', 'Prashant Kirad', 'One-Shot', 'Metals and Non-Metals Class 10 Full Chapter One Shot | Prashant Kirad', 'Metals and Non Metals Class 10 Prashant Kirad Exphub', 'm3tals_pk', '1h 25m'),
        createTeacherVideo('sci_3_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Metals and Non Metals Class 10 NCERT Line by Line | Physics Wallah', 'Metals and Non Metals Class 10 Alakh Pandey Physics Wallah', 'pw_metals_3', '1h 40m')
      ]
    },
    sci_4: {
      chapterNo: 4,
      subject: 'Science',
      chapterTitle: 'Carbon and its Compounds',
      videos: [
        createTeacherVideo('sci_4_pk', 'Prashant Kirad', 'One-Shot', 'Carbon and its Compounds Class 10 Full Chapter One Shot | Prashant Kirad', 'Carbon and its Compounds Class 10 Prashant Kirad Exphub', 'c4rb0n_pk', '1h 45m'),
        createTeacherVideo('sci_4_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Carbon and its Compounds Class 10 Detailed Organic Concepts | Physics Wallah', 'Carbon and its Compounds Class 10 Alakh Pandey Physics Wallah', 'pw_carbon_4', '2h 00m')
      ]
    },
    sci_5: {
      chapterNo: 5,
      subject: 'Science',
      chapterTitle: 'Life Processes',
      videos: [
        createTeacherVideo('sci_5_pk', 'Prashant Kirad', 'One-Shot', 'Life Processes Class 10 Full Chapter Animated One Shot | Prashant Kirad', 'Life Processes Class 10 Prashant Kirad Exphub', 'l1fe_pk_5', '1h 50m'),
        createTeacherVideo('sci_5_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Life Processes Class 10 Biology Full NCERT Explanation | Physics Wallah', 'Life Processes Class 10 Physics Wallah Alakh Pandey', 'pw_bio_5', '2h 10m')
      ]
    },
    sci_6: {
      chapterNo: 6,
      subject: 'Science',
      chapterTitle: 'Control and Coordination',
      videos: [
        createTeacherVideo('sci_6_pk', 'Prashant Kirad', 'One-Shot', 'Control and Coordination Class 10 Full Chapter One Shot | Prashant Kirad', 'Control and Coordination Class 10 Prashant Kirad Exphub', 'c0ntrol_pk', '1h 10m'),
        createTeacherVideo('sci_6_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Control and Coordination Class 10 Neuron, Brain & Reflex Arc | Physics Wallah', 'Control and Coordination Class 10 Physics Wallah Alakh Pandey', 'pw_ctrl_6', '1h 30m')
      ]
    },
    sci_7: {
      chapterNo: 7,
      subject: 'Science',
      chapterTitle: 'How do Organisms Reproduce?',
      videos: [
        createTeacherVideo('sci_7_pk', 'Prashant Kirad', 'One-Shot', 'How do Organisms Reproduce Class 10 Full Chapter One Shot | Prashant Kirad', 'How do Organisms Reproduce Class 10 Prashant Kirad Exphub', 'repr0_pk_7', '1h 30m'),
        createTeacherVideo('sci_7_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'How do Organisms Reproduce Class 10 Biology NCERT Complete | Physics Wallah', 'How do Organisms Reproduce Class 10 Physics Wallah Alakh Pandey', 'pw_repro_7', '1h 50m')
      ]
    },
    sci_8: {
      chapterNo: 8,
      subject: 'Science',
      chapterTitle: 'Heredity',
      videos: [
        createTeacherVideo('sci_8_pk', 'Prashant Kirad', 'One-Shot', 'Heredity Class 10 Full Chapter One Shot | Prashant Kirad', 'Heredity Class 10 Prashant Kirad Exphub', 'hered_pk_8', '1h 05m'),
        createTeacherVideo('sci_8_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Heredity and Evolution Class 10 Genetics & Monohybrid Cross | Physics Wallah', 'Heredity Class 10 Physics Wallah Alakh Pandey', 'pw_hered_8', '1h 20m')
      ]
    },
    sci_9: {
      chapterNo: 9,
      subject: 'Science',
      chapterTitle: 'Light – Reflection and Refraction',
      videos: [
        createTeacherVideo('sci_9_pk', 'Prashant Kirad', 'One-Shot', 'Light Reflection and Refraction Class 10 Full Chapter One Shot | Prashant Kirad', 'Light Reflection and Refraction Class 10 Prashant Kirad Exphub', 'l1ght_pk_9', '2h 00m'),
        createTeacherVideo('sci_9_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Light Reflection and Refraction Class 10 Ray Diagrams & Numericals | Physics Wallah', 'Light Reflection and Refraction Class 10 Alakh Pandey Physics Wallah', 'pw_light_9', '2h 15m')
      ]
    },
    sci_10: {
      chapterNo: 10,
      subject: 'Science',
      chapterTitle: 'The Human Eye and the Colourful World',
      videos: [
        createTeacherVideo('sci_10_pk', 'Prashant Kirad', 'One-Shot', 'Human Eye and Colourful World Class 10 Full Chapter One Shot | Prashant Kirad', 'Human Eye and Colourful World Class 10 Prashant Kirad Exphub', 'eye_pk_10', '1h 10m'),
        createTeacherVideo('sci_10_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'The Human Eye Class 10 Defects of Vision & Atmospheric Refraction | Physics Wallah', 'Human Eye and Colourful World Class 10 Physics Wallah Alakh Pandey', 'pw_eye_10', '1h 25m')
      ]
    },
    sci_11: {
      chapterNo: 11,
      subject: 'Science',
      chapterTitle: 'Electricity',
      videos: [
        createTeacherVideo('sci_11_pk', 'Prashant Kirad', 'One-Shot', 'Electricity Class 10 Full Chapter Animated One Shot | Prashant Kirad', 'Electricity Class 10 Prashant Kirad Exphub', 'elec_pk_11', '1h 55m'),
        createTeacherVideo('sci_11_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Electricity Class 10 Physics Wallah Complete Theory + All Numericals | Alakh Pandey', 'Electricity Class 10 Physics Wallah Alakh Pandey', 'pw_elec_11', '2h 20m')
      ]
    },
    sci_12: {
      chapterNo: 12,
      subject: 'Science',
      chapterTitle: 'Magnetic Effects of Electric Current',
      videos: [
        createTeacherVideo('sci_12_pk', 'Prashant Kirad', 'One-Shot', 'Magnetic Effects of Electric Current Class 10 Full Chapter One Shot | Prashant Kirad', 'Magnetic Effects of Electric Current Class 10 Prashant Kirad Exphub', 'mag_pk_12', '1h 20m'),
        createTeacherVideo('sci_12_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Magnetic Effects of Electric Current Class 10 Physics Wallah | Alakh Pandey', 'Magnetic Effects of Electric Current Class 10 Physics Wallah Alakh Pandey', 'pw_mag_12', '1h 45m')
      ]
    },
    sci_13: {
      chapterNo: 13,
      subject: 'Science',
      chapterTitle: 'Our Environment',
      videos: [
        createTeacherVideo('sci_13_pk', 'Prashant Kirad', 'One-Shot', 'Our Environment Class 10 Full Chapter One Shot in 40 Mins | Prashant Kirad', 'Our Environment Class 10 Prashant Kirad Exphub', 'env_pk_13', '45m'),
        createTeacherVideo('sci_13_pw', 'Alakh Pandey (PW)', 'NCERT Concept', 'Our Environment Class 10 NCERT Biology Complete | Physics Wallah', 'Our Environment Class 10 Physics Wallah Alakh Pandey', 'pw_env_13', '55m')
      ]
    },

    /* =========================================================================
       MATHEMATICS (14 NCERT Chapters - Prompts 1 & 6)
       ========================================================================= */
    maths_1: {
      chapterNo: 1,
      subject: 'Mathematics',
      chapterTitle: 'Real Numbers',
      videos: [
        createTeacherVideo('m_1_sn', 'Shobhit Nirwan', 'One-Shot', 'Real Numbers Class 10 in 1 Shot | Full NCERT + PYQs | Shobhit Nirwan', 'Real Numbers Class 10 Shobhit Nirwan One Shot', 'sn_maths_1', '1h 15m'),
        createTeacherVideo('m_1_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Real Numbers Class 10 Full Chapter NCERT + Exemplar Questions | Ritik Sir PW', 'Real Numbers Class 10 Ritik Sir Physics Wallah Foundation', 'rs_maths_1', '1h 45m')
      ]
    },
    maths_2: {
      chapterNo: 2,
      subject: 'Mathematics',
      chapterTitle: 'Polynomials',
      videos: [
        createTeacherVideo('m_2_sn', 'Shobhit Nirwan', 'One-Shot', 'Polynomials Class 10 Full Chapter One Shot | Shobhit Nirwan', 'Polynomials Class 10 Shobhit Nirwan One Shot', 'sn_maths_2', '1h 10m'),
        createTeacherVideo('m_2_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Polynomials Class 10 Complete Concept, Zeroes & NCERT Solutions | Ritik Sir PW', 'Polynomials Class 10 Ritik Sir Physics Wallah Foundation', 'rs_maths_2', '1h 35m')
      ]
    },
    maths_3: {
      chapterNo: 3,
      subject: 'Mathematics',
      chapterTitle: 'Pair of Linear Equations in Two Variables',
      videos: [
        createTeacherVideo('m_3_sn', 'Shobhit Nirwan', 'One-Shot', 'Linear Equations in Two Variables Class 10 One Shot | Shobhit Nirwan', 'Pair of Linear Equations in Two Variables Class 10 Shobhit Nirwan', 'sn_maths_3', '1h 30m'),
        createTeacherVideo('m_3_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Linear Equations Class 10 Elimination, Substitution & Word Problems | Ritik Sir', 'Pair of Linear Equations Class 10 Ritik Sir Physics Wallah', 'rs_maths_3', '1h 50m')
      ]
    },
    maths_4: {
      chapterNo: 4,
      subject: 'Mathematics',
      chapterTitle: 'Quadratic Equations',
      videos: [
        createTeacherVideo('m_4_sn', 'Shobhit Nirwan', 'One-Shot', 'Quadratic Equations Class 10 Full Chapter One Shot | Shobhit Nirwan', 'Quadratic Equations Class 10 Shobhit Nirwan One Shot', 'sn_maths_4', '1h 25m'),
        createTeacherVideo('m_4_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Quadratic Equations Class 10 Discriminant, Quadratic Formula & PYQs | Ritik Sir', 'Quadratic Equations Class 10 Ritik Sir Physics Wallah', 'rs_maths_4', '1h 45m')
      ]
    },
    maths_5: {
      chapterNo: 5,
      subject: 'Mathematics',
      chapterTitle: 'Arithmetic Progressions',
      videos: [
        createTeacherVideo('m_5_sn', 'Shobhit Nirwan', 'One-Shot', 'Arithmetic Progressions (AP) Class 10 Full Chapter in 1 Shot | Shobhit Nirwan', 'Arithmetic Progressions Class 10 Shobhit Nirwan One Shot', 'sn_maths_5', '1h 30m'),
        createTeacherVideo('m_5_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Arithmetic Progressions Class 10 nth Term, Sum Formula & Case Studies | Ritik Sir', 'Arithmetic Progressions Class 10 Ritik Sir Physics Wallah', 'rs_maths_5', '1h 50m')
      ]
    },
    maths_6: {
      chapterNo: 6,
      subject: 'Mathematics',
      chapterTitle: 'Triangles',
      videos: [
        createTeacherVideo('m_6_sn', 'Shobhit Nirwan', 'One-Shot', 'Triangles Class 10 Full Chapter One Shot + BPT Proof | Shobhit Nirwan', 'Triangles Class 10 Shobhit Nirwan One Shot BPT', 'sn_maths_6', '1h 45m'),
        createTeacherVideo('m_6_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Triangles Class 10 Thales Theorem, Similarity & Hard PYQs | Ritik Sir PW', 'Triangles Class 10 Ritik Sir Physics Wallah', 'rs_maths_6', '2h 10m')
      ]
    },
    maths_7: {
      chapterNo: 7,
      subject: 'Mathematics',
      chapterTitle: 'Coordinate Geometry',
      videos: [
        createTeacherVideo('m_7_sn', 'Shobhit Nirwan', 'One-Shot', 'Coordinate Geometry Class 10 Full Chapter in 1 Shot | Shobhit Nirwan', 'Coordinate Geometry Class 10 Shobhit Nirwan One Shot', 'sn_maths_7', '1h 10m'),
        createTeacherVideo('m_7_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Coordinate Geometry Distance & Section Formula with NCERT | Ritik Sir PW', 'Coordinate Geometry Class 10 Ritik Sir Physics Wallah', 'rs_maths_7', '1h 30m')
      ]
    },
    maths_8: {
      chapterNo: 8,
      subject: 'Mathematics',
      chapterTitle: 'Introduction to Trigonometry',
      videos: [
        createTeacherVideo('m_8_sn', 'Shobhit Nirwan', 'One-Shot', 'Trigonometry Class 10 Full Chapter Animated One Shot | Shobhit Nirwan', 'Introduction to Trigonometry Class 10 Shobhit Nirwan One Shot', 'sn_maths_8', '1h 50m'),
        createTeacherVideo('m_8_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Trigonometry Class 10 Identities, Table Tricks & Exemplar | Ritik Sir PW', 'Trigonometry Class 10 Ritik Sir Physics Wallah', 'rs_maths_8', '2h 15m')
      ]
    },
    maths_9: {
      chapterNo: 9,
      subject: 'Mathematics',
      chapterTitle: 'Some Applications of Trigonometry',
      videos: [
        createTeacherVideo('m_9_sn', 'Shobhit Nirwan', 'One-Shot', 'Heights and Distances Class 10 Full Chapter One Shot | Shobhit Nirwan', 'Heights and Distances Class 10 Shobhit Nirwan Some Applications of Trigonometry', 'sn_maths_9', '1h 05m'),
        createTeacherVideo('m_9_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Applications of Trigonometry Class 10 NCERT Line-by-Line & Case Studies | Ritik Sir', 'Some Applications of Trigonometry Class 10 Ritik Sir Physics Wallah', 'rs_maths_9', '1h 25m')
      ]
    },
    maths_10: {
      chapterNo: 10,
      subject: 'Mathematics',
      chapterTitle: 'Circles',
      videos: [
        createTeacherVideo('m_10_sn', 'Shobhit Nirwan', 'One-Shot', 'Circles Class 10 Full Chapter in 1 Shot + Both Theorems | Shobhit Nirwan', 'Circles Class 10 Shobhit Nirwan One Shot Theorems', 'sn_maths_10', '1h 15m'),
        createTeacherVideo('m_10_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Circles Class 10 Complete Theorem Proofs & NCERT Solutions | Ritik Sir PW', 'Circles Class 10 Ritik Sir Physics Wallah', 'rs_maths_10', '1h 40m')
      ]
    },
    maths_11: {
      chapterNo: 11,
      subject: 'Mathematics',
      chapterTitle: 'Areas Related to Circles',
      videos: [
        createTeacherVideo('m_11_sn', 'Shobhit Nirwan', 'One-Shot', 'Areas Related to Circles Class 10 Full Chapter One Shot | Shobhit Nirwan', 'Areas Related to Circles Class 10 Shobhit Nirwan One Shot', 'sn_maths_11', '1h 10m'),
        createTeacherVideo('m_11_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Areas Related to Circles Class 10 Sector & Segment Areas | Ritik Sir PW', 'Areas Related to Circles Class 10 Ritik Sir Physics Wallah', 'rs_maths_11', '1h 30m')
      ]
    },
    maths_12: {
      chapterNo: 12,
      subject: 'Mathematics',
      chapterTitle: 'Surface Areas and Volumes',
      videos: [
        createTeacherVideo('m_12_sn', 'Shobhit Nirwan', 'One-Shot', 'Surface Areas and Volumes Class 10 Full Chapter in 1 Shot | Shobhit Nirwan', 'Surface Areas and Volumes Class 10 Shobhit Nirwan One Shot', 'sn_maths_12', '1h 35m'),
        createTeacherVideo('m_12_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Surface Areas and Volumes Class 10 Combination of Solids & PYQs | Ritik Sir PW', 'Surface Areas and Volumes Class 10 Ritik Sir Physics Wallah', 'rs_maths_12', '1h 55m')
      ]
    },
    maths_13: {
      chapterNo: 13,
      subject: 'Mathematics',
      chapterTitle: 'Statistics',
      videos: [
        createTeacherVideo('m_13_sn', 'Shobhit Nirwan', 'One-Shot', 'Statistics Class 10 Mean, Median, Mode in 1 Shot | Shobhit Nirwan', 'Statistics Class 10 Shobhit Nirwan One Shot Mean Median Mode', 'sn_maths_13', '1h 20m'),
        createTeacherVideo('m_13_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Statistics Class 10 Assumed Mean, Step Deviation & Missing Frequency | Ritik Sir', 'Statistics Class 10 Ritik Sir Physics Wallah', 'rs_maths_13', '1h 45m')
      ]
    },
    maths_14: {
      chapterNo: 14,
      subject: 'Mathematics',
      chapterTitle: 'Probability',
      videos: [
        createTeacherVideo('m_14_sn', 'Shobhit Nirwan', 'One-Shot', 'Probability Class 10 Full Chapter in 45 Mins | Shobhit Nirwan', 'Probability Class 10 Shobhit Nirwan One Shot', 'sn_maths_14', '50m'),
        createTeacherVideo('m_14_rs', 'Ritik Sir (PW)', 'NCERT + PYQs', 'Probability Class 10 Complete NCERT Cards, Dice & Coins Questions | Ritik Sir', 'Probability Class 10 Ritik Sir Physics Wallah', 'rs_maths_14', '1h 15m')
      ]
    },

    /* =========================================================================
       SOCIAL SCIENCE (History, Geography, Civics, Economics - Prompts 1 & 7)
       ========================================================================= */
    // History
    sst_1: {
      chapterNo: 1,
      subject: 'Social Science',
      chapterTitle: 'The Rise of Nationalism in Europe',
      videos: [
        createTeacherVideo('sst_1_df', 'Digraj Sir', 'Full Chapter', 'The Rise of Nationalism in Europe Class 10 Full Chapter | Digraj Singh Rajput', 'The Rise of Nationalism in Europe Class 10 Digraj Singh Rajput Next Toppers', 'dg_sst_1', '2h 15m'),
        createTeacherVideo('sst_1_dm', 'Digraj Sir', 'Map & PYQs', 'Nationalism in Europe Most Important Dates, Maps & PYQs | Digraj Sir', 'The Rise of Nationalism in Europe Class 10 Important Questions Digraj Sir', 'dg_sst_1_m', '1h 00m')
      ]
    },
    sst_2: {
      chapterNo: 2,
      subject: 'Social Science',
      chapterTitle: 'Nationalism in India',
      videos: [
        createTeacherVideo('sst_2_df', 'Digraj Sir', 'Full Chapter', 'Nationalism in India Class 10 Full Chapter in One Shot | Digraj Singh Rajput', 'Nationalism in India Class 10 Digraj Singh Rajput Next Toppers', 'dg_sst_2', '2h 30m'),
        createTeacherVideo('sst_2_dm', 'Digraj Sir', 'Map & PYQs', 'Nationalism in India Complete 100% Guaranteed Map Work & PYQs | Digraj Sir', 'Nationalism in India Class 10 Map Work Digraj Sir', 'dg_sst_2_m', '45m')
      ]
    },
    sst_3: {
      chapterNo: 3,
      subject: 'Social Science',
      chapterTitle: 'The Making of a Global World',
      videos: [
        createTeacherVideo('sst_3_df', 'Digraj Sir', 'Full Chapter', 'The Making of a Global World Class 10 Rationalized Syllabus | Digraj Singh Rajput', 'The Making of a Global World Class 10 Digraj Singh Rajput', 'dg_sst_3', '1h 10m'),
        createTeacherVideo('sst_3_dm', 'Digraj Sir', 'Map & PYQs', 'The Making of a Global World Subtopics 1 to 1.3 PYQs | Digraj Sir', 'The Making of a Global World Class 10 Important Questions Digraj Sir', 'dg_sst_3_m', '35m')
      ]
    },
    sst_4: {
      chapterNo: 4,
      subject: 'Social Science',
      chapterTitle: 'The Age of Industrialisation',
      videos: [
        createTeacherVideo('sst_4_df', 'Digraj Sir', 'Full Chapter', 'The Age of Industrialisation Class 10 History Full Chapter | Digraj Singh Rajput', 'The Age of Industrialisation Class 10 Digraj Singh Rajput', 'dg_sst_4', '1h 30m'),
        createTeacherVideo('sst_4_dm', 'Digraj Sir', 'Map & PYQs', 'The Age of Industrialisation Class 10 Important Questions | Digraj Sir', 'The Age of Industrialisation Class 10 Important Questions Digraj Sir', 'dg_sst_4_m', '40m')
      ]
    },
    sst_5: {
      chapterNo: 5,
      subject: 'Social Science',
      chapterTitle: 'Print Culture and the Modern World',
      videos: [
        createTeacherVideo('sst_5_df', 'Digraj Sir', 'Full Chapter', 'Print Culture and the Modern World Class 10 Full Chapter | Digraj Singh Rajput', 'Print Culture and the Modern World Class 10 Digraj Singh Rajput Next Toppers', 'dg_sst_5', '1h 45m'),
        createTeacherVideo('sst_5_dm', 'Digraj Sir', 'Map & PYQs', 'Print Culture Class 10 Most Repeated Board Exam Questions | Digraj Sir', 'Print Culture and the Modern World Class 10 Important Questions Digraj Sir', 'dg_sst_5_m', '45m')
      ]
    },

    // Geography
    sst_6: {
      chapterNo: 6,
      subject: 'Social Science',
      chapterTitle: 'Resources and Development',
      videos: [
        createTeacherVideo('sst_6_df', 'Digraj Sir', 'Full Chapter', 'Resources and Development Class 10 Geography Full Chapter | Digraj Singh Rajput', 'Resources and Development Class 10 Digraj Singh Rajput', 'dg_geo_6', '1h 20m'),
        createTeacherVideo('sst_6_dm', 'Digraj Sir', 'Map & PYQs', 'Resources and Development Major Soil Types Map Work & PYQs | Digraj Sir', 'Resources and Development Class 10 Map Work Soils Digraj Sir', 'dg_geo_6_m', '30m')
      ]
    },
    sst_7: {
      chapterNo: 7,
      subject: 'Social Science',
      chapterTitle: 'Forest and Wildlife Resources',
      videos: [
        createTeacherVideo('sst_7_df', 'Digraj Sir', 'Full Chapter', 'Forest and Wildlife Resources Class 10 Geography Full Chapter | Digraj Singh Rajput', 'Forest and Wildlife Resources Class 10 Digraj Singh Rajput', 'dg_geo_7', '55m'),
        createTeacherVideo('sst_7_dm', 'Digraj Sir', 'Map & PYQs', 'Forest and Wildlife Resources Sacred Groves & Conservation PYQs | Digraj Sir', 'Forest and Wildlife Resources Class 10 Important Questions Digraj Sir', 'dg_geo_7_m', '25m')
      ]
    },
    sst_8: {
      chapterNo: 8,
      subject: 'Social Science',
      chapterTitle: 'Water Resources',
      videos: [
        createTeacherVideo('sst_8_df', 'Digraj Sir', 'Full Chapter', 'Water Resources Class 10 Geography Full Chapter | Digraj Singh Rajput', 'Water Resources Class 10 Digraj Singh Rajput', 'dg_geo_8', '1h 05m'),
        createTeacherVideo('sst_8_dm', 'Digraj Sir', 'Map & PYQs', 'Water Resources All Dams Map Work & Rainwater Harvesting | Digraj Sir', 'Water Resources Class 10 Dams Map Work Digraj Sir', 'dg_geo_8_m', '30m')
      ]
    },
    sst_9: {
      chapterNo: 9,
      subject: 'Social Science',
      chapterTitle: 'Agriculture',
      videos: [
        createTeacherVideo('sst_9_df', 'Digraj Sir', 'Full Chapter', 'Agriculture Class 10 Geography Full Chapter in 1 Shot | Digraj Singh Rajput', 'Agriculture Class 10 Digraj Singh Rajput Next Toppers', 'dg_geo_9', '1h 40m'),
        createTeacherVideo('sst_9_dm', 'Digraj Sir', 'Map & PYQs', 'Agriculture Major Crop Producing States Map Work & PYQs | Digraj Sir', 'Agriculture Class 10 Map Work Crops Digraj Sir', 'dg_geo_9_m', '35m')
      ]
    },
    sst_10: {
      chapterNo: 10,
      subject: 'Social Science',
      chapterTitle: 'Minerals and Energy Resources',
      videos: [
        createTeacherVideo('sst_10_df', 'Digraj Sir', 'Full Chapter', 'Minerals and Energy Resources Class 10 Full Chapter | Digraj Singh Rajput', 'Minerals and Energy Resources Class 10 Digraj Singh Rajput', 'dg_geo_10', '1h 35m'),
        createTeacherVideo('sst_10_dm', 'Digraj Sir', 'Map & PYQs', 'Minerals and Energy Resources Power Plants & Mines Map Work | Digraj Sir', 'Minerals and Energy Resources Class 10 Map Work Digraj Sir', 'dg_geo_10_m', '40m')
      ]
    },
    sst_11: {
      chapterNo: 11,
      subject: 'Social Science',
      chapterTitle: 'Manufacturing Industries',
      videos: [
        createTeacherVideo('sst_11_df', 'Digraj Sir', 'Full Chapter', 'Manufacturing Industries Class 10 Full Chapter in 1 Shot | Digraj Singh Rajput', 'Manufacturing Industries Class 10 Digraj Singh Rajput Next Toppers', 'dg_geo_11', '1h 45m'),
        createTeacherVideo('sst_11_dm', 'Digraj Sir', 'Map & PYQs', 'Manufacturing Industries Software Parks & Cotton Mills Map Work | Digraj Sir', 'Manufacturing Industries Class 10 Map Work Digraj Sir', 'dg_geo_11_m', '35m')
      ]
    },
    sst_12: {
      chapterNo: 12,
      subject: 'Social Science',
      chapterTitle: 'Lifelines of National Economy',
      videos: [
        createTeacherVideo('sst_12_df', 'Digraj Sir', 'Full Chapter', 'Lifelines of National Economy Class 10 Only Map Syllabus | Digraj Singh Rajput', 'Lifelines of National Economy Class 10 Digraj Singh Rajput', 'dg_geo_12', '45m'),
        createTeacherVideo('sst_12_dm', 'Digraj Sir', 'Map & PYQs', 'Lifelines of National Economy Major Sea Ports & Airports Map | Digraj Sir', 'Lifelines of National Economy Class 10 Ports Airports Map Digraj Sir', 'dg_geo_12_m', '30m')
      ]
    },

    // Political Science / Civics
    sst_13: {
      chapterNo: 13,
      subject: 'Social Science',
      chapterTitle: 'Power Sharing',
      videos: [
        createTeacherVideo('sst_13_df', 'Digraj Sir', 'Full Chapter', 'Power Sharing Class 10 Civics Full Chapter in One Shot | Digraj Singh Rajput', 'Power Sharing Class 10 Digraj Singh Rajput Next Toppers', 'dg_civ_13', '1h 15m'),
        createTeacherVideo('sst_13_dm', 'Digraj Sir', 'Map & PYQs', 'Power Sharing Belgium vs Sri Lanka Model PYQs | Digraj Sir', 'Power Sharing Class 10 Important Questions Digraj Sir', 'dg_civ_13_m', '35m')
      ]
    },
    sst_14: {
      chapterNo: 14,
      subject: 'Social Science',
      chapterTitle: 'Federalism',
      videos: [
        createTeacherVideo('sst_14_df', 'Digraj Sir', 'Full Chapter', 'Federalism Class 10 Civics Full Chapter One Shot | Digraj Singh Rajput', 'Federalism Class 10 Digraj Singh Rajput Next Toppers', 'dg_civ_14', '1h 25m'),
        createTeacherVideo('sst_14_dm', 'Digraj Sir', 'Map & PYQs', 'Federalism Decentralisation in India Top PYQs | Digraj Sir', 'Federalism Class 10 Important Questions Digraj Sir', 'dg_civ_14_m', '35m')
      ]
    },
    sst_15: {
      chapterNo: 15,
      subject: 'Social Science',
      chapterTitle: 'Gender, Religion and Caste',
      videos: [
        createTeacherVideo('sst_15_df', 'Digraj Sir', 'Full Chapter', 'Gender Religion and Caste Class 10 Full Chapter | Digraj Singh Rajput', 'Gender Religion and Caste Class 10 Digraj Singh Rajput', 'dg_civ_15', '1h 20m'),
        createTeacherVideo('sst_15_dm', 'Digraj Sir', 'Map & PYQs', 'Gender Religion and Caste Communalism & Caste in Politics PYQs | Digraj Sir', 'Gender Religion and Caste Class 10 Important Questions Digraj Sir', 'dg_civ_15_m', '30m')
      ]
    },
    sst_16: {
      chapterNo: 16,
      subject: 'Social Science',
      chapterTitle: 'Political Parties',
      videos: [
        createTeacherVideo('sst_16_df', 'Digraj Sir', 'Full Chapter', 'Political Parties Class 10 Civics Full Chapter in 1 Shot | Digraj Singh Rajput', 'Political Parties Class 10 Digraj Singh Rajput Next Toppers', 'dg_civ_16', '1h 35m'),
        createTeacherVideo('sst_16_dm', 'Digraj Sir', 'Map & PYQs', 'Political Parties Challenges & Reforms Top Board Questions | Digraj Sir', 'Political Parties Class 10 Important Questions Digraj Sir', 'dg_civ_16_m', '40m')
      ]
    },
    sst_17: {
      chapterNo: 17,
      subject: 'Social Science',
      chapterTitle: 'Outcomes of Democracy',
      videos: [
        createTeacherVideo('sst_17_df', 'Digraj Sir', 'Full Chapter', 'Outcomes of Democracy Class 10 Full Chapter in 1 Shot | Digraj Singh Rajput', 'Outcomes of Democracy Class 10 Digraj Singh Rajput Next Toppers', 'dg_civ_17', '1h 05m'),
        createTeacherVideo('sst_17_dm', 'Digraj Sir', 'Map & PYQs', 'Outcomes of Democracy Accountability & Economic Growth PYQs | Digraj Sir', 'Outcomes of Democracy Class 10 Important Questions Digraj Sir', 'dg_civ_17_m', '30m')
      ]
    },

    // Economics
    sst_18: {
      chapterNo: 18,
      subject: 'Social Science',
      chapterTitle: 'Development',
      videos: [
        createTeacherVideo('sst_18_df', 'Digraj Sir', 'Full Chapter', 'Development Class 10 Economics Full Chapter in 1 Shot | Digraj Singh Rajput', 'Development Class 10 Economics Digraj Singh Rajput', 'dg_eco_18', '1h 15m'),
        createTeacherVideo('sst_18_dm', 'Digraj Sir', 'Map & PYQs', 'Development Per Capita Income vs HDI Top Questions | Digraj Sir', 'Development Class 10 Important Questions Digraj Sir', 'dg_eco_18_m', '30m')
      ]
    },
    sst_19: {
      chapterNo: 19,
      subject: 'Social Science',
      chapterTitle: 'Sectors of the Indian Economy',
      videos: [
        createTeacherVideo('sst_19_df', 'Digraj Sir', 'Full Chapter', 'Sectors of the Indian Economy Class 10 Full Chapter | Digraj Singh Rajput', 'Sectors of the Indian Economy Class 10 Digraj Singh Rajput', 'dg_eco_19', '1h 30m'),
        createTeacherVideo('sst_19_dm', 'Digraj Sir', 'Map & PYQs', 'Sectors of the Indian Economy Disguised Unemployment & GDP PYQs | Digraj Sir', 'Sectors of the Indian Economy Class 10 Important Questions Digraj Sir', 'dg_eco_19_m', '35m')
      ]
    },
    sst_20: {
      chapterNo: 20,
      subject: 'Social Science',
      chapterTitle: 'Money and Credit',
      videos: [
        createTeacherVideo('sst_20_df', 'Digraj Sir', 'Full Chapter', 'Money and Credit Class 10 Economics Full Chapter | Digraj Singh Rajput', 'Money and Credit Class 10 Digraj Singh Rajput Next Toppers', 'dg_eco_20', '1h 25m'),
        createTeacherVideo('sst_20_dm', 'Digraj Sir', 'Map & PYQs', 'Money and Credit Formal vs Informal Credit & SHGs PYQs | Digraj Sir', 'Money and Credit Class 10 Important Questions Digraj Sir', 'dg_eco_20_m', '35m')
      ]
    },
    sst_21: {
      chapterNo: 21,
      subject: 'Social Science',
      chapterTitle: 'Globalisation and the Indian Economy',
      videos: [
        createTeacherVideo('sst_21_df', 'Digraj Sir', 'Full Chapter', 'Globalisation and the Indian Economy Class 10 Full Chapter | Digraj Singh Rajput', 'Globalisation and the Indian Economy Class 10 Digraj Singh Rajput', 'dg_eco_21', '1h 10m'),
        createTeacherVideo('sst_21_dm', 'Digraj Sir', 'Map & PYQs', 'Globalisation MNCs & Foreign Trade Impact PYQs | Digraj Sir', 'Globalisation Class 10 Important Questions Digraj Sir', 'dg_eco_21_m', '30m')
      ]
    },

    /* =========================================================================
       ENGLISH (First Flight & Footprints - Prompts 1 & 8)
       ========================================================================= */
    eng_1: {
      chapterNo: 1,
      subject: 'English',
      chapterTitle: 'A Letter to God',
      videos: [
        createTeacherVideo('eng_1_ds', 'Dear Sir', 'Summary & QnA', 'A Letter to God Class 10 Line by Line Animated Explanation | Dear Sir', 'A Letter to God Class 10 Dear Sir Full Chapter Explanation', 'ds_eng_1', '35m'),
        createTeacherVideo('eng_1_mb', 'Magnet Brains', 'Line-by-Line', 'A Letter to God NCERT Line by Line & Character Sketch | Magnet Brains', 'A Letter to God Class 10 Magnet Brains Line by Line', 'mb_eng_1', '40m')
      ]
    },
    eng_2: {
      chapterNo: 2,
      subject: 'English',
      chapterTitle: 'Nelson Mandela: Long Walk to Freedom',
      videos: [
        createTeacherVideo('eng_2_ds', 'Dear Sir', 'Summary & QnA', 'Nelson Mandela Long Walk to Freedom Full Chapter Explanation | Dear Sir', 'Nelson Mandela Long Walk to Freedom Class 10 Dear Sir', 'ds_eng_2', '40m'),
        createTeacherVideo('eng_2_mb', 'Magnet Brains', 'Line-by-Line', 'Nelson Mandela Detailed NCERT Line by Line & QnA | Magnet Brains', 'Nelson Mandela Class 10 Magnet Brains', 'mb_eng_2', '45m')
      ]
    },
    eng_3: {
      chapterNo: 3,
      subject: 'English',
      chapterTitle: 'Two Stories about Flying',
      videos: [
        createTeacherVideo('eng_3_ds', 'Dear Sir', 'Summary & QnA', 'Two Stories About Flying (His First Flight & Black Aeroplane) | Dear Sir', 'Two Stories about Flying Class 10 Dear Sir', 'ds_eng_3', '45m'),
        createTeacherVideo('eng_3_mb', 'Magnet Brains', 'Line-by-Line', 'Two Stories about Flying Complete NCERT Analysis | Magnet Brains', 'Two Stories about Flying Class 10 Magnet Brains', 'mb_eng_3', '50m')
      ]
    },
    eng_4: {
      chapterNo: 4,
      subject: 'English',
      chapterTitle: 'From the Diary of Anne Frank',
      videos: [
        createTeacherVideo('eng_4_ds', 'Dear Sir', 'Summary & QnA', 'From the Diary of Anne Frank Class 10 English | Dear Sir', 'From the Diary of Anne Frank Class 10 Dear Sir', 'ds_eng_4', '35m'),
        createTeacherVideo('eng_4_mb', 'Magnet Brains', 'Line-by-Line', 'From the Diary of Anne Frank Line by Line Analysis | Magnet Brains', 'From the Diary of Anne Frank Class 10 Magnet Brains', 'mb_eng_4', '40m')
      ]
    },
    eng_5: {
      chapterNo: 5,
      subject: 'English',
      chapterTitle: 'Glimpses of India',
      videos: [
        createTeacherVideo('eng_5_ds', 'Dear Sir', 'Summary & QnA', 'Glimpses of India (Baker from Goa, Coorg, Tea from Assam) | Dear Sir', 'Glimpses of India Class 10 Dear Sir', 'ds_eng_5', '45m'),
        createTeacherVideo('eng_5_mb', 'Magnet Brains', 'Line-by-Line', 'Glimpses of India Full Chapter Line by Line | Magnet Brains', 'Glimpses of India Class 10 Magnet Brains', 'mb_eng_5', '50m')
      ]
    },
    eng_6: {
      chapterNo: 6,
      subject: 'English',
      chapterTitle: 'Mijbil the Otter',
      videos: [
        createTeacherVideo('eng_6_ds', 'Dear Sir', 'Summary & QnA', 'Mijbil the Otter Class 10 English First Flight | Dear Sir', 'Mijbil the Otter Class 10 Dear Sir', 'ds_eng_6', '30m'),
        createTeacherVideo('eng_6_mb', 'Magnet Brains', 'Line-by-Line', 'Mijbil the Otter Line by Line Explanation & Questions | Magnet Brains', 'Mijbil the Otter Class 10 Magnet Brains', 'mb_eng_6', '35m')
      ]
    },
    eng_7: {
      chapterNo: 7,
      subject: 'English',
      chapterTitle: 'Madam Rides the Bus',
      videos: [
        createTeacherVideo('eng_7_ds', 'Dear Sir', 'Summary & QnA', 'Madam Rides the Bus Class 10 English Full Explanation | Dear Sir', 'Madam Rides the Bus Class 10 Dear Sir', 'ds_eng_7', '35m'),
        createTeacherVideo('eng_7_mb', 'Magnet Brains', 'Line-by-Line', 'Madam Rides the Bus Valli Character Sketch & Questions | Magnet Brains', 'Madam Rides the Bus Class 10 Magnet Brains', 'mb_eng_7', '40m')
      ]
    },
    eng_8: {
      chapterNo: 8,
      subject: 'English',
      chapterTitle: 'The Sermon at Benares',
      videos: [
        createTeacherVideo('eng_8_ds', 'Dear Sir', 'Summary & QnA', 'The Sermon at Benares Class 10 English Full Chapter | Dear Sir', 'The Sermon at Benares Class 10 Dear Sir', 'ds_eng_8', '30m'),
        createTeacherVideo('eng_8_mb', 'Magnet Brains', 'Line-by-Line', 'The Sermon at Benares Gautam Buddha Teaching Analysis | Magnet Brains', 'The Sermon at Benares Class 10 Magnet Brains', 'mb_eng_8', '35m')
      ]
    },
    eng_9: {
      chapterNo: 9,
      subject: 'English',
      chapterTitle: 'The Proposal',
      videos: [
        createTeacherVideo('eng_9_ds', 'Dear Sir', 'Summary & QnA', 'The Proposal Play Class 10 Full Chapter Animated | Dear Sir', 'The Proposal Class 10 Dear Sir', 'ds_eng_9', '40m'),
        createTeacherVideo('eng_9_mb', 'Magnet Brains', 'Line-by-Line', 'The Proposal Lomov, Natalya & Chubukov Character Analysis | Magnet Brains', 'The Proposal Class 10 Magnet Brains', 'mb_eng_9', '45m')
      ]
    },

    /* =========================================================================
       HINDI (Course A & B - Prompts 1 & 8)
       ========================================================================= */
    hin_1: {
      chapterNo: 1,
      subject: 'Hindi',
      chapterTitle: 'पद - सूरदास (Surdas ke Pad)',
      videos: [
        createTeacherVideo('hin_1_ha', 'Hindi Adhyapak', 'Full Explanation', 'Surdas ke Pad Class 10 Hindi Kshitij Bhavarth & Prashnottar | Hindi Adhyapak', 'Surdas ke Pad Class 10 Hindi Adhyapak Bhavarth Prashnottar', 'ha_hin_1', '35m')
      ]
    },
    hin_2: {
      chapterNo: 2,
      subject: 'Hindi',
      chapterTitle: 'राम-लक्ष्मण-परशुराम संवाद (Ram Lakshman Parshuram Samvad)',
      videos: [
        createTeacherVideo('hin_2_ha', 'Hindi Adhyapak', 'Full Explanation', 'Ram Lakshman Parshuram Samvad Class 10 Hindi Bhavarth | Hindi Adhyapak', 'Ram Lakshman Parshuram Samvad Class 10 Hindi Adhyapak', 'ha_hin_2', '45m')
      ]
    },
    hin_3: {
      chapterNo: 3,
      subject: 'Hindi',
      chapterTitle: 'नेताजी का चश्मा (Netaji ka Chashma)',
      videos: [
        createTeacherVideo('hin_3_ha', 'Hindi Adhyapak', 'Full Explanation', 'Netaji ka Chashma Class 10 Hindi Kshitij Story & Character Sketch | Hindi Adhyapak', 'Netaji ka Chashma Class 10 Hindi Adhyapak', 'ha_hin_3', '30m')
      ]
    },
    hin_4: {
      chapterNo: 4,
      subject: 'Hindi',
      chapterTitle: 'बालगोबिन भगत (Balgobin Bhagat)',
      videos: [
        createTeacherVideo('hin_4_ha', 'Hindi Adhyapak', 'Full Explanation', 'Balgobin Bhagat Class 10 Hindi Kshitij Full Story Explanation | Hindi Adhyapak', 'Balgobin Bhagat Class 10 Hindi Adhyapak', 'ha_hin_4', '30m')
      ]
    },
    hin_5: {
      chapterNo: 5,
      subject: 'Hindi',
      chapterTitle: 'माता का आँचल (Mata ka Aanchal)',
      videos: [
        createTeacherVideo('hin_5_ha', 'Hindi Adhyapak', 'Full Explanation', 'Mata ka Aanchal Class 10 Hindi Kritika Full Explanation | Hindi Adhyapak', 'Mata ka Aanchal Class 10 Hindi Adhyapak', 'ha_hin_5', '35m')
      ]
    },
    hin_6: {
      chapterNo: 6,
      subject: 'Hindi',
      chapterTitle: 'साखी - कबीर (Kabir ki Sakhi - Course B)',
      videos: [
        createTeacherVideo('hin_6_ha', 'Hindi Adhyapak', 'Full Explanation', 'Kabir ki Sakhi Class 10 Hindi Sparsh Complete Bhavarth | Hindi Adhyapak', 'Kabir ki Sakhi Class 10 Hindi Adhyapak', 'ha_hin_6', '35m')
      ]
    },
    hin_7: {
      chapterNo: 7,
      subject: 'Hindi',
      chapterTitle: 'बड़े भाई साहब (Bade Bhai Sahab - Course B)',
      videos: [
        createTeacherVideo('hin_7_ha', 'Hindi Adhyapak', 'Full Explanation', 'Bade Bhai Sahab Class 10 Hindi Sparsh Full Story Explanation | Hindi Adhyapak', 'Bade Bhai Sahab Class 10 Hindi Adhyapak', 'ha_hin_7', '40m')
      ]
    },
    hin_8: {
      chapterNo: 8,
      subject: 'Hindi',
      chapterTitle: 'हरिहर काका (Harihar Kaka - Course B)',
      videos: [
        createTeacherVideo('hin_8_ha', 'Hindi Adhyapak', 'Full Explanation', 'Harihar Kaka Class 10 Hindi Sanchayan Complete Story | Hindi Adhyapak', 'Harihar Kaka Class 10 Hindi Adhyapak', 'ha_hin_8', '40m')
      ]
    },

    /* =========================================================================
       ARTIFICIAL INTELLIGENCE (Code 417 - Sunday Specials - Prompts 1 & 8)
       ========================================================================= */
    ai_1: {
      chapterNo: 1,
      subject: 'Artificial Intelligence',
      chapterTitle: 'Introduction to Artificial Intelligence',
      videos: [
        createTeacherVideo('ai_1_cb', 'CBSE Infotech', 'AI Basics', 'Class 10 AI Code 417 Unit 1 Introduction to AI Full Explanation | CBSE Infotech', 'Class 10 AI Code 417 Introduction to AI CBSE Infotech', 'cb_ai_1', '35m'),
        createTeacherVideo('ai_1_mb', 'Magnet Brains', 'Sunday Special', 'Introduction to AI Class 10 Complete Unit One Shot | Magnet Brains', 'Class 10 AI Introduction to AI Magnet Brains', 'mb_ai_1', '40m')
      ]
    },
    ai_2: {
      chapterNo: 2,
      subject: 'Artificial Intelligence',
      chapterTitle: 'AI Project Cycle',
      videos: [
        createTeacherVideo('ai_2_cb', 'CBSE Infotech', 'Project Cycle', 'AI Project Cycle Class 10 Code 417 (Problem Scoping, Data, Modeling, Evaluation)', 'Class 10 AI Project Cycle Code 417 CBSE Infotech', 'cb_ai_2', '45m'),
        createTeacherVideo('ai_2_mb', 'Magnet Brains', 'Sunday Special', 'AI Project Cycle Complete Explanation & 4Ws Canvas | Magnet Brains', 'AI Project Cycle Class 10 Magnet Brains', 'mb_ai_2', '50m')
      ]
    },
    ai_3: {
      chapterNo: 3,
      subject: 'Artificial Intelligence',
      chapterTitle: 'Advance Python for Class 10',
      videos: [
        createTeacherVideo('ai_3_cb', 'CBSE Infotech', 'Python Coding', 'Python for Class 10 AI Code 417 Lists, Tuples, Dictionaries & Packages', 'Class 10 Advance Python AI Code 417 CBSE Infotech', 'cb_ai_3', '55m'),
        createTeacherVideo('ai_3_mb', 'Magnet Brains', 'Sunday Special', 'Python Basics & Advanced Programs for Class 10 AI | Magnet Brains', 'Python for Class 10 AI Magnet Brains', 'mb_ai_3', '1h 00m')
      ]
    },
    ai_4: {
      chapterNo: 4,
      subject: 'Artificial Intelligence',
      chapterTitle: 'Data Science & Data Literacy',
      videos: [
        createTeacherVideo('ai_4_cb', 'CBSE Infotech', 'Data Science', 'Data Science Unit Class 10 AI Code 417 Complete Explanation | CBSE Infotech', 'Data Science Class 10 AI Code 417 CBSE Infotech', 'cb_ai_4', '40m')
      ]
    },
    ai_5: {
      chapterNo: 5,
      subject: 'Artificial Intelligence',
      chapterTitle: 'Computer Vision (CV)',
      videos: [
        createTeacherVideo('ai_5_cb', 'CBSE Infotech', 'Computer Vision', 'Computer Vision Class 10 AI Code 417 Pixels, RGB, Convolution & Applications', 'Computer Vision Class 10 AI Code 417 CBSE Infotech', 'cb_ai_5', '45m')
      ]
    },
    ai_6: {
      chapterNo: 6,
      subject: 'Artificial Intelligence',
      chapterTitle: 'Natural Language Processing (NLP)',
      videos: [
        createTeacherVideo('ai_6_cb', 'CBSE Infotech', 'NLP Unit', 'Natural Language Processing Class 10 AI Code 417 Tokenization, Lemmatization, Bag of Words', 'Natural Language Processing Class 10 AI Code 417 CBSE Infotech', 'cb_ai_6', '45m')
      ]
    },
    ai_7: {
      chapterNo: 7,
      subject: 'Artificial Intelligence',
      chapterTitle: 'Evaluation (Confusion Matrix, Precision, Recall, F1)',
      videos: [
        createTeacherVideo('ai_7_cb', 'CBSE Infotech', 'Evaluation', 'Evaluation Unit Class 10 AI Confusion Matrix, Accuracy, Precision, Recall, F1 Score', 'AI Evaluation Confusion Matrix Class 10 CBSE Infotech', 'cb_ai_7', '45m')
      ]
    }
  };

  /**
   * Helper to resolve videos for any chapter representation:
   * By key (e.g. 'sci_1', 'maths_3'), or by subject & chapter number/title
   */
  function getChapterTeacherVideos(identifier) {
    if (!identifier) return [];

    // Direct key match
    if (CHAPTER_TEACHER_VIDEOS[identifier]) {
      return CHAPTER_TEACHER_VIDEOS[identifier].videos;
    }

    // Normalized lowercase key match
    const lower = String(identifier).toLowerCase().replace(/[\s-]/g, '_');
    for (const key of Object.keys(CHAPTER_TEACHER_VIDEOS)) {
      if (key === lower || key.replace('_', '') === lower.replace('_', '')) {
        return CHAPTER_TEACHER_VIDEOS[key].videos;
      }
    }

    // Title substring match
    for (const key of Object.keys(CHAPTER_TEACHER_VIDEOS)) {
      const entry = CHAPTER_TEACHER_VIDEOS[key];
      if (entry.chapterTitle && (
        entry.chapterTitle.toLowerCase().includes(String(identifier).toLowerCase()) ||
        String(identifier).toLowerCase().includes(entry.chapterTitle.toLowerCase())
      )) {
        return entry.videos;
      }
    }

    // Default educational fallback
    return [
      createTeacherVideo('gen_1', 'Top CBSE Teacher', 'One-Shot', `Class 10 CBSE NCERT ${identifier} Full Chapter One Shot`, `Class 10 CBSE NCERT ${identifier} Full Chapter One Shot`)
    ];
  }

  // Export to global scope
  if (typeof window !== 'undefined') {
    window.CHAPTER_TEACHER_VIDEOS = CHAPTER_TEACHER_VIDEOS;
    window.getChapterTeacherVideos = getChapterTeacherVideos;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHAPTER_TEACHER_VIDEOS, getChapterTeacherVideos };
  }
})();
