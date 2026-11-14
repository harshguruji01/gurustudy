# GuruStudy • Privacy Policy & Permissions Compliance

**Last Updated:** November 2026  
**Developer:** HarshGuruJi  
**Official Email:** contact@webguruji.online  
**Application:** GuruStudy (online.webguruji.gurustudy)  

---

## 1. Privacy Statement

GuruStudy is an offline-first educational application and syllabus management companion built specifically for Class 10th NCERT students preparing for their board examinations.

We believe that student privacy and safety are paramount. **GuruStudy does not collect, sell, rent, or transmit student personal information to any third party or remote server.** All study plans, profile details, test scores, and custom reminders are stored 100% locally on your device.

---

## 2. Information Handled by the Application

### 2.1 Student Profile
- **Full Name:** Used solely to personalize in-app greetings and speak the student's name in local device study alarms (e.g., *"Hello Rahul, it's time to study Mathematics on GuruStudy"*).
- **Date of Birth:** Kept locally on the device as an optional profile detail.
- **Class & School Name:** Used locally to configure the Class 10 NCERT curriculum and personalize the dashboard.
- **Language Preference:** Used to render the user interface in Hindi or English.

All profile information is stored using encrypted local device storage (`SharedPreferences` / `LocalStorage`).

### 2.2 Academic Progress & Mistake Notebook
- Status of chapters completed, daily study minutes, streak count, and practice test results are calculated locally and never uploaded to any remote server.

---

## 3. Strict Android Permissions Justification

In strict compliance with Google Play Store Developer Policies and Android Security Guidelines, GuruStudy requests **only the bare minimum permissions necessary** to deliver reliable study alarms:

| Permission | Android API Level | Purpose & Justification |
|---|---|---|
| `android.permission.POST_NOTIFICATIONS` | API 33+ (Android 13+) | Required to post high-priority study reminders and chapter alarm alerts to the student. |
| `android.permission.SCHEDULE_EXACT_ALARM` | API 31+ (Android 12+) | Required by the core study calendar feature so that alarms ring at the precise minute chosen by the student, even in Doze mode. |
| `android.permission.USE_EXACT_ALARM` | API 33+ | Google Play compliant exact alarm permission designated for calendar, reminder, and alarm clock applications. |
| `android.permission.WAKE_LOCK` | All | Allows the device screen to turn on briefly when a scheduled study session alarm rings so the student sees the notification. |
| `android.permission.RECEIVE_BOOT_COMPLETED` | All | Reschedules pending study calendar alarms if the user reboots their smartphone, ensuring study reminders are never missed. |
| `android.permission.VIBRATE` | All | Provides gentle haptic feedback during alarm ringing. |
| `android.permission.USE_FULL_SCREEN_INTENT` | API 29+ | Allows the dedicated alarm screen to appear over the lock screen when a study session starts. |

### ❌ Permissions We Do NOT Request
GuruStudy strictly **never requests**:
- NO Location access (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`)
- NO Contacts access (`READ_CONTACTS`, `WRITE_CONTACTS`)
- NO Camera access (`CAMERA`)
- NO Microphone access (`RECORD_AUDIO`)
- NO Storage / Gallery access (`READ_EXTERNAL_STORAGE`, `MANAGE_EXTERNAL_STORAGE`)
- NO Phone or Call logs (`READ_PHONE_STATE`, `CALL_PHONE`)
- NO SMS access (`READ_SMS`, `RECEIVE_SMS`)

---

## 4. Google Play Data Safety Declaration

- **Data Collected:** None transmitted off-device.
- **Data Shared:** Zero data shared with third parties.
- **Security Practices:**
  - Data stored locally on device sandbox.
  - User can delete all data at any time via the "Delete My Data & Reset App" button in Settings.
- **Children's Privacy (COPPA & Families Policy):**
  - Designed for secondary students (Class 10th).
  - No behavioral advertising.
  - No in-app purchases.
  - No social network integrations.

---

## 5. Contact Information

For any inquiries, feedback, or verification regarding GuruStudy's privacy practices:

- **Developer:** HarshGuruJi
- **Official Email:** contact@webguruji.online
- **Website:** https://webguruji.online
