# GuruStudy • Admin & Content Management Specification

**Administrator:** HarshGuruJi  
**Official Email:** contact@webguruji.online  
**Application:** GuruStudy (`online.webguruji.gurustudy`)  

---

## 1. Overview & Purpose

To ensure GuruStudy remains current with any CBSE circulars or NCERT textbook revisions throughout the 2026–2027 academic session, this specification outlines how the administrator (**HarshGuruJi**) can manage, update, and publish new content (chapters, notes, MCQs, formula sheets, sample papers, or academic schedules) without forcing students to reinstall or reset their personal timetable.

---

## 2. Content Versioning Standard

All content packages carry a manifest versioning header:

```json
{
  "contentVersion": "2026.11.15.1",
  "curriculumSession": "2026-2027",
  "lastUpdated": "2026-11-15T00:00:00Z",
  "minAppVersionCode": 1,
  "changelog": [
    "Added Class 10 CBSE 2027 sample question paper patterns",
    "Updated Science Life Processes nephron diagram notes",
    "Verified all 93 days of 15 Nov 2026 to 15 Feb 2027 schedule"
  ]
}
```

---

## 3. Syllabus & Question Schema

### 3.1 Chapter Schema (`ncert_class10_data.json`)
```json
{
  "id": "science",
  "name": "Science",
  "nameHi": "विज्ञान",
  "code": "086",
  "books": [
    {
      "id": "science_ncert",
      "title": "NCERT Science Class 10",
      "chapters": [
        {
          "number": 1,
          "title": "Chemical Reactions and Equations",
          "titleHi": "रासायनिक अभिक्रियाएँ एवं समीकरण",
          "summary": "...",
          "summaryHi": "...",
          "keyConcepts": ["..."],
          "formulas": ["..."],
          "importantQuestions": [
            {
              "question": "...",
              "questionHi": "...",
              "solution": "...",
              "marks": 3
            }
          ],
          "mcqs": [
            {
              "question": "...",
              "options": ["...", "...", "...", "..."],
              "correctIndex": 2,
              "explanation": "..."
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 4. Safe Non-Destructive Update Rule

When HarshGuruJi deploys an updated syllabus or question pack:
1. **Student Personal Schedules are Preserved:** The student's recorded completed days, customized alarm times, study streak, and mistake notebook are stored in SQLite/LocalStorage and **never overwritten** by content refreshes.
2. **Offline Integrity:** If no internet connection is detected, the app continues functioning seamlessly using the pre-bundled local assets.
