# Attendance Management System (DAE CIT 2nd Year)

A professional, real-time web application designed for **Teacher Chand Saifi** to manage and track student attendance for the DAE CIT 2nd Year (Academic Session 2025-2026).

## 🚀 Features

### 1. Daily Attendance Marking
- **One-Click Marking**: Easily mark students as Present (P), Absent (A), or Leave (L).
- **Instant Summary**: Real-time counters for Total Students (20), Present, Absent, and On Leave.
- **Search & Filter**: Find students instantly by Name or Roll Number.
- **Date Picker**: Record attendance for any specific date in the academic year.

### 2. Advanced Attendance Records (History)
- **Detailed History Log**: View every past record with a complete breakdown of which student was marked what.
- **Click-to-Edit**: Simply click on any past record card to jump back and modify its data.
- **Data Persistence**: Uses Browser LocalStorage to save records even after closing the browser.

### 3. Student Performance Analytics
- **Cumulative Performance Summary**: Automatically calculates total Presents, Leaves, and overall percentage for every student.
- **Color-Coded Status**: 
  - 🟢 **Green (>=75%)**: Safe attendance.
  - 🟡 **Yellow (50-74%)**: Warning.
  - 🔴 **Red (<50%)**: Critical/Shortage.
- **Real-time Updates**: Stats update immediately as you save or edit daily records.

## 🛠️ Technology Stack
- **Frontend**: Custom HTML5, Vanilla JavaScript (ES6+).
- **Styling**: Modern CSS3 with Glassmorphism, Responsive Grid, and Flexbox layouts.
- **Typography**: Google Fonts (Outfit).
- **Storage**: Browser-based persistent database (JSON logic).

## 📂 Project Structure
- `index.html`: Main dashboard and structure.
- `style.css`: Premium dark-themed UI and animations.
- `app.js`: Core logic for marking, searching, database management, and analytics.

## ✍️ Usage Instructions
1. Open `index.html` in any modern web browser.
2. Select the **Date** from the top right.
3. Mark students and click **"Save Daily Record"**.
4. Switch to **"View Records"** to see the detailed history and performance percentages.
5. Click any history card to **Edit** if you made a mistake.

---
*Created for DAE CIT Department - 2026*


