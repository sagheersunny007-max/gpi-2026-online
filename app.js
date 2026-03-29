// Configuration for classes, teachers, and student counts
const classConfigs = {
    'cit-1': {
        name: 'CIT 1st Year',
        teacher: 'BATOOL',
        count: 37,
        studentPrefix: 'CIT26',
        names: [
            "Akash Mehdi", "Nayar Abbas", "Zahid Hussain", "Muhammad", "Taha Ali",
            "Muhammad Hassan", "Zuhaib Alam", "Noor Ali Mehdi", "Parveen", "Mehdi Hassan",
            "Ajmal Abbas", "Basil Abbas", "Ahmed Ali", "Arsalan Abbas", "Boo Ali",
            "Karim Abbas", "Zeeshan Abbas", "Bushra", "Muhammad Rohait", "Zain Abbas",
            "Ali Zain Gulzar", "Mudasir Ali", "Mujtaba Hussain", "Ali Hassan", "Tasawar Abbas",
            "Juneid Abbas", "Mazahar Abbas", "Shayan Abbas", "Sameer Abbas", "Ghulam Haider",
            "Zaigum Abbas", "Muhammad Faisal", "Mudasir Abbas", "Ali Abbas", "Azan Abbas",
            "Zubair Anwar", "Shayan Abbas"
        ]
    },
    'cit-2': {
        name: 'CIT 2nd Year',
        teacher: 'CHAND SAIFI',
        count: 20,
        studentPrefix: 'CIT25',
        names: [
            "Basit Ali", "Mudassir Ali", "Ali Mehdi", "Atif Hussain", "M. Hassan",
            "Ali Muhammad", "Syed Mustafa", "Aqib Javeed", "Sami Jaffer", "Fayyaz Ali",
            "Shakeela Ali", "Azan Abbas", "Syed Arsalan", "Mussayib", "M. Naqi",
            "Aliyan Abbas", "Sagheer Ahmed", "Khadija Ahmed", "Ali Mehdi", "Ali Waris"
        ]
    },
    'civil-1': {
        name: 'Civil 1st Year',
        teacher: 'ADNAN',
        count: 33,
        studentPrefix: 'CIV26',
        names: [
            "Shafaat Hussain", "Waqas", "Sunaid Haider", "Muneeb Ali", "Ali Abbas",
            "Wisal Haider", "Waris Ali", "Wajid Hussain", "Shoukat", "Muntazir Mehdi",
            "Mohd Usman", "Hashim", "Ali Khamami Mir", "Mohd Saqib", "Haseeb Hussain",
            "Sameer Abbas", "Mehdi Abbas", "Asad Amin", "Mohd Abbas", "Mohd Saqlain",
            "Dilawar Abbas", "Daniyal Abbas", "Hassan Shah", "Azan Sadiq", "Shayan Abbas",
            "Arsalan Abbas", "Muhammad Saleh", "Ahtisham", "Dilawar", "Muhammad Haseeb Mehdi",
            "Karim Hussain", "Hassan Abbas", "Kifayat"
        ]
    },
    'civil-2': {
        name: 'Civil 2nd Year',
        teacher: 'JAMEEL',
        count: 17,
        studentPrefix: 'CIV25',
        names: [
            "Ali Raza", "Hussain Abbas", "Abbas Ali", "Mesum Haider", "Rohan Ali",
            "Sarbaz Ali", "Qamar Abbas", "Munawar Hussain", "Rehan Ali", "Saqib Hussain",
            "Sameer Abbas", "Fida Hussain", "Qamar Abbas", "Masam Raza", "Ehsan Ullah",
            "Jibran Abbas", "M. Kazim"
        ]
    },
    'elec-1': {
        name: 'Electrical 1st Year',
        teacher: 'ZAMEER',
        count: 27,
        studentPrefix: 'ELE26',
        names: [
            "Muhammad Haris", "Daniyal Abbas", "Shah Abdullah", "Shahid Karim", "Inzimam Karim",
            "Danish Iqbal", "Ahtisham Alam", "Sameer Abbas", "Sameer Hassan", "Awais Ali",
            "Karar Abbas", "Imdad Ali", "Manazir Hussein", "Sharam Hussein", "Ehtisham Hussein",
            "Yawar Abbas", "Ali Mehdi Mir", "Raees Ahmad", "Hifazat Hussein", "Sakhawat Hussein",
            "Athar Ali", "Muhammad Anas", "Shafiq Ul Rahman", "Meesum Abbas", "Mehdi Hussein",
            "Sheraz Hussain", "Sameer Abbas"
        ]
    },
    'elec-2': {
        name: 'Electrical 2nd Year',
        teacher: 'HASSAN',
        count: 14,
        studentPrefix: 'ELE25',
        names: [
            "Kamran", "Hassan Mehdi", "Sarfaraz", "Haider Raza", "Zahid",
            "Naqi", "Sulaiman", "Ejaz Hussain", "Sherayar Hamza", "Hamza Munir",
            "Ali Abbas", "Muntazir", "Sadiq", "M. Hussnain"
        ]
    }
};

// State
let currentClassId = 'cit-2';
let students = [];
let currentStatus = {};
const datePicker = document.getElementById('attendance-date');
const tableBody = document.getElementById('student-table-body');
const searchInput = document.getElementById('search-input');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // Load initial class
    selectClass('cit-2');
});

// Class Selection Logic
window.selectClass = (classId) => {
    currentClassId = classId;
    const config = classConfigs[classId];

    // Update UI active state
    document.querySelectorAll('.class-item').forEach(item => {
        item.classList.toggle('active', item.id === `btn-${classId}`);
    });

    // Update Role Badge and Titles
    document.getElementById('role-badge').textContent = config.teacher;
    document.getElementById('current-class-title').textContent = `Mark Attendance - ${config.name}`;
    document.getElementById('count-total').textContent = config.count;

    // Generate/Get students for this class
    generateStudents(classId);

    // Load data from DB
    loadAttendance(datePicker.value);

    // Refresh history and stats if tab is active
    if (document.getElementById('tab-history').classList.contains('active')) {
        loadHistory();
        renderCumulativeStats();
    }
};

function generateStudents(classId) {
    const config = classConfigs[classId];
    students = [];

    for (let i = 0; i < config.count; i++) {
        const rollNo = (i + 1).toString().padStart(2, '0');
        const name = config.names && config.names[i] ? config.names[i] : `Student ${rollNo}`;
        students.push({
            id: `${config.studentPrefix}-${(i + 1).toString().padStart(3, '0')}`,
            name: name,
            rollNo: rollNo
        });
    }
}

// Navigation Logic
window.switchTab = (tab) => {
    const markSec = document.getElementById('mark-section');
    const histSec = document.getElementById('history-section');
    const markBtn = document.getElementById('tab-mark');
    const histBtn = document.getElementById('tab-history');

    if (tab === 'mark') {
        markSec.style.display = 'block';
        histSec.style.display = 'none';
        markBtn.classList.add('active');
        histBtn.classList.remove('active');
    } else {
        markSec.style.display = 'none';
        histSec.style.display = 'block';
        markBtn.classList.remove('active');
        histBtn.classList.add('active');
        loadHistory();
        renderCumulativeStats();
    }
};

// Render Logic
function renderStudents(filteredStudents) {
    tableBody.innerHTML = '';
    filteredStudents.forEach(student => {
        const status = currentStatus[student.id] || null;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="roll-no">${student.rollNo}</td>
            <td class="student-name">${student.name}</td>
            <td>
                <div class="status-group">
                    <button class="status-btn present ${status === 'Present' ? 'active' : ''}" onclick="setStatus('${student.id}', 'Present')">P</button>
                    <button class="status-btn absent ${status === 'Absent' ? 'active' : ''}" onclick="setStatus('${student.id}', 'Absent')">A</button>
                    <button class="status-btn leave ${status === 'Leave' ? 'active' : ''}" onclick="setStatus('${student.id}', 'Leave')">L</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

window.setStatus = (studentId, status) => {
    if (currentStatus[studentId] === status) delete currentStatus[studentId];
    else currentStatus[studentId] = status;

    renderStudents(students);
    updateSummary();
};

function updateSummary() {
    const counts = { Present: 0, Absent: 0, Leave: 0 };
    Object.values(currentStatus).forEach(s => counts[s]++);
    document.getElementById('count-present').textContent = counts.Present;
    document.getElementById('count-absent').textContent = counts.Absent;
    document.getElementById('count-leave').textContent = counts.Leave;
}

// Database Operations
function saveToDB() {
    const date = datePicker.value;
    const db = JSON.parse(localStorage.getItem('attendance_db') || '{}');

    // Ensure class-specific structure
    if (!db[currentClassId]) db[currentClassId] = {};

    db[currentClassId][date] = {
        stats: {
            present: document.getElementById('count-present').textContent,
            absent: document.getElementById('count-absent').textContent,
            leave: document.getElementById('count-leave').textContent
        },
        records: { ...currentStatus }
    };

    localStorage.setItem('attendance_db', JSON.stringify(db));
    showToast();
    renderCumulativeStats();
}

function loadAttendance(date) {
    const db = JSON.parse(localStorage.getItem('attendance_db') || '{}');
    const classData = db[currentClassId] || {};
    currentStatus = classData[date] ? classData[date].records : {};
    renderStudents(students);
    updateSummary();
}

function loadHistory() {
    const container = document.getElementById('history-container');
    const db = JSON.parse(localStorage.getItem('attendance_db') || '{}');
    const classData = db[currentClassId] || {};
    const dates = Object.keys(classData).sort().reverse();

    if (dates.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-dim);">No records for this class yet.</div>`;
        return;
    }

    container.innerHTML = dates.map(date => {
        const data = classData[date];

        const studentDetails = students.map(s => {
            const status = data.records[s.id] || '---';
            let statusColor = 'var(--text-dim)';
            if (status === 'Present') statusColor = 'var(--success)';
            if (status === 'Absent') statusColor = 'var(--danger)';
            if (status === 'Leave') statusColor = 'var(--warning)';

            return `<div class="history-student-item">
                <span>${s.rollNo}. ${s.name}</span>
                <span style="color: ${statusColor}; font-weight: 700;">${status.charAt(0)}</span>
            </div>`;
        }).join('');

        return `
            <div class="history-card" onclick="editRecord('${date}')">
                <div class="history-header">
                    <div>
                        <h2 style="color: var(--primary)">${date}</h2>
                        <p style="font-size: 0.8rem; color: var(--text-dim);">History for ${classConfigs[currentClassId].name}</p>
                    </div>
                    <div style="display: flex; gap: 1rem; text-align: right;">
                        <div class="stat-pill">P: ${data.stats.present}</div>
                        <div class="stat-pill">A: ${data.stats.absent}</div>
                        <div class="stat-pill">L: ${data.stats.leave}</div>
                    </div>
                </div>
                <div class="history-details-grid">
                    ${studentDetails}
                </div>
            </div>
        `;
    }).join('');
}

window.editRecord = (date) => {
    datePicker.value = date;
    loadAttendance(date);
    switchTab('mark');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.clearAllData = () => {
    if (confirm(`Clear all attendance history for ${classConfigs[currentClassId].name}?`)) {
        const db = JSON.parse(localStorage.getItem('attendance_db') || '{}');
        delete db[currentClassId];
        localStorage.setItem('attendance_db', JSON.stringify(db));
        loadHistory();
        renderCumulativeStats();
    }
};

function showToast() {
    const toast = document.getElementById('toast');
    toast.style.transform = 'translateY(0)';
    setTimeout(() => toast.style.transform = 'translateY(100px)', 3000);
}

// Events
document.getElementById('save-attendance').addEventListener('click', saveToDB);
datePicker.addEventListener('change', (e) => loadAttendance(e.target.value));
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = students.filter(s => s.name.toLowerCase().includes(term) || s.rollNo.includes(term));
    renderStudents(filtered);
});

function renderCumulativeStats() {
    const container = document.getElementById('performance-summary-container');
    const db = JSON.parse(localStorage.getItem('attendance_db') || '{}');
    const classData = db[currentClassId] || {};
    const dates = Object.keys(classData);
    const totalDays = dates.length;

    if (totalDays === 0) {
        container.innerHTML = `<p style="color: var(--text-dim);">No saved records to calculate statistics.</p>`;
        return;
    }

    const stats = students.map(student => {
        let pCount = 0;
        let lCount = 0;

        dates.forEach(date => {
            const record = classData[date].records[student.id];
            if (record === 'Present') pCount++;
            if (record === 'Leave') lCount++;
        });

        const percentage = totalDays > 0 ? ((pCount / totalDays) * 100).toFixed(1) : 0;
        const color = percentage >= 75 ? 'var(--success)' : (percentage >= 50 ? 'var(--warning)' : 'var(--danger)');

        return `
            <div class="performance-metric-card">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h3>${student.rollNo}. ${student.name}</h3>
                    <span class="percent-text" style="color: ${color}">${percentage}%</span>
                </div>
                <div class="metric-stats">
                    <span>Presents: <b>${pCount}</b></span>
                    <span>Leaves: <b>${lCount}</b></span>
                    <span>Total Days: <b>${totalDays}</b></span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percentage}%; background: ${color}"></div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = stats;
}

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    if (document.body.classList.contains('light-mode')) {
        themeIcon.textContent = '🌙';
        themeToggle.innerHTML = `<span id="theme-icon">🌙</span> Dark Mode`;
    } else {
        themeIcon.textContent = '☀️';
        themeToggle.innerHTML = `<span id="theme-icon">☀️</span> Light Mode`;
    }

    // Save preference
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.textContent = '🌙';
    themeToggle.innerHTML = `<span id="theme-icon">🌙</span> Dark Mode`;
}
