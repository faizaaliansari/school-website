/* ================================================================
   DASHBOARD.JS - Complete Working Version
   ================================================================ */

/* ================= AUTH GUARD ================= */
const currentUser = JSON.parse(localStorage.getItem('schoolUser') || 'null');
if (!currentUser) {
  alert('Pehle login karein!');
  window.location.href = 'login.html';
}

document.getElementById('currentUser').textContent = currentUser?.name || 'Admin';

document.getElementById('logoutBtn').addEventListener('click', () => {
  if (confirm('Logout karna chahte hain?')) {
    localStorage.removeItem('schoolUser');
    window.location.href = 'login.html';
  }
});

/* ================= STORAGE HELPERS ================= */
const DB = {
  get: key => {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch(e) { return []; }
  },
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data))
};

/* ================= INITIALIZE SAMPLE DATA ================= */
if (!localStorage.getItem('schoolDataInit')) {
  DB.set('students', [
    { id: 1, roll: '101', name: 'Aarav Sharma',  cls: 'Class 5',  gender: 'Male',   father: 'Ramesh Sharma', mother: 'Sunita Sharma', phone: '9876500001', dob: '2014-03-15', address: 'New Delhi' },
    { id: 2, roll: '102', name: 'Ananya Verma',  cls: 'Class 5',  gender: 'Female', father: 'Suresh Verma',  mother: 'Kavita Verma',  phone: '9876500002', dob: '2014-07-22', address: 'Noida' },
    { id: 3, roll: '201', name: 'Rohan Gupta',   cls: 'Class 8',  gender: 'Male',   father: 'Mahesh Gupta',  mother: 'Rekha Gupta',   phone: '9876500003', dob: '2011-01-10', address: 'Gurgaon' },
    { id: 4, roll: '301', name: 'Ishita Singh',  cls: 'Class 10', gender: 'Female', father: 'Vikram Singh',  mother: 'Pooja Singh',   phone: '9876500004', dob: '2009-11-05', address: 'New Delhi' },
    { id: 5, roll: '302', name: 'Kabir Khan',    cls: 'Class 10', gender: 'Male',   father: 'Imran Khan',    mother: 'Fatima Khan',   phone: '9876500005', dob: '2009-05-18', address: 'Faridabad' }
  ]);
  DB.set('teachers', [
    { id: 1, empId: 'T001', name: 'Dr. Rajesh Kumar',  subject: 'Physics',     qual: 'M.Sc, Ph.D',    phone: '9876511111', email: 'rajesh@school.com', address: 'New Delhi' },
    { id: 2, empId: 'T002', name: 'Mrs. Priya Sharma', subject: 'Mathematics', qual: 'M.Sc Maths',    phone: '9876522222', email: 'priya@school.com',  address: 'Noida' },
    { id: 3, empId: 'T003', name: 'Ms. Neha Gupta',    subject: 'English',     qual: 'M.A English',   phone: '9876533333', email: 'neha@school.com',   address: 'Gurgaon' },
    { id: 4, empId: 'T004', name: 'Mr. Arun Verma',    subject: 'Chemistry',   qual: 'M.Sc Chemistry', phone: '9876544444', email: 'arun@school.com',  address: 'New Delhi' }
  ]);
  localStorage.setItem('schoolDataInit', 'true');
}

/* ================================================================
   ⭐ TAB SWITCHING - MAIN FIX ⭐
   ================================================================ */
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  // Remove active from all menu items
  document.querySelectorAll('.sidebar-menu li').forEach(el => el.classList.remove('active'));

  // Show selected tab
  const tabEl = document.getElementById(tabName);
  if (tabEl) tabEl.classList.add('active');

  // Highlight menu item
  const menuEl = document.querySelector(`.sidebar-menu li[data-tab="${tabName}"]`);
  if (menuEl) menuEl.classList.add('active');

  // Update page title
  const titles = {
    overview: 'Dashboard Overview',
    students: 'Students Management',
    teachers: 'Teachers Management',
    classes:  'Classes Overview'
  };
  document.getElementById('pageTitle').textContent = titles[tabName] || 'Dashboard';

  // Render content
  if (tabName === 'overview') renderOverview();
  if (tabName === 'students') renderStudents();
  if (tabName === 'teachers') renderTeachers();
  if (tabName === 'classes')  renderClasses();
}

// Attach click listeners to menu items
document.querySelectorAll('.sidebar-menu li').forEach(li => {
  li.addEventListener('click', function() {
    const tab = this.getAttribute('data-tab');
    console.log('Clicked tab:', tab);   // debug ke liye
    if (tab) switchTab(tab);
  });
});

/* ================= MODAL HELPERS ================= */
function openModal(id)  { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) e.target.classList.remove('active');
});

/* ================= OVERVIEW ================= */
function renderOverview() {
  const students = DB.get('students');
  const teachers = DB.get('teachers');
  const classes  = [...new Set(students.map(s => s.cls))];
  const boys  = students.filter(s => s.gender === 'Male').length;
  const girls = students.filter(s => s.gender === 'Female').length;

  document.getElementById('totalStudents').textContent  = students.length;
  document.getElementById('totalTeachers').textContent  = teachers.length;
  document.getElementById('totalClasses').textContent   = classes.length;
  document.getElementById('totalBoysGirls').textContent = `${boys} / ${girls}`;
}

/* ================= STUDENTS CRUD ================= */
function renderStudents() {
  const students = DB.get('students');
  const search   = (document.getElementById('studentSearch')?.value || '').toLowerCase();
  const clsFilter = document.getElementById('studentClassFilter')?.value || '';

  const filtered = students.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search) || s.roll.toLowerCase().includes(search);
    const matchClass  = !clsFilter || s.cls === clsFilter;
    return matchSearch && matchClass;
  });

  const tbody = document.getElementById('studentsTable');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">No students found. "Add Student" button dabayein.</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>${s.roll}</td>
      <td><strong>${s.name}</strong></td>
      <td>${s.cls}</td>
      <td>${s.gender}</td>
      <td>${s.father || '-'}</td>
      <td>${s.phone || '-'}</td>
      <td>
        <button class="btn-edit" onclick="editStudent(${s.id})"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn-delete" onclick="deleteStudent(${s.id})"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
  renderOverview();
}

function openStudentModal() {
  document.getElementById('studentModalTitle').textContent = 'Add Student';
  document.getElementById('studentForm').reset();
  document.getElementById('studentId').value = '';
  openModal('studentModal');
}

function editStudent(id) {
  const s = DB.get('students').find(x => x.id === id);
  if (!s) return;
  document.getElementById('studentModalTitle').textContent = 'Edit Student';
  document.getElementById('studentId').value  = s.id;
  document.getElementById('sRoll').value      = s.roll;
  document.getElementById('sName').value      = s.name;
  document.getElementById('sClass').value     = s.cls;
  document.getElementById('sGender').value    = s.gender;
  document.getElementById('sFather').value    = s.father || '';
  document.getElementById('sMother').value    = s.mother || '';
  document.getElementById('sPhone').value     = s.phone || '';
  document.getElementById('sDob').value       = s.dob || '';
  document.getElementById('sAddress').value   = s.address || '';
  openModal('studentModal');
}

function saveStudent(e) {
  e.preventDefault();
  const id = document.getElementById('studentId').value;
  const data = {
    roll:    document.getElementById('sRoll').value.trim(),
    name:    document.getElementById('sName').value.trim(),
    cls:     document.getElementById('sClass').value,
    gender:  document.getElementById('sGender').value,
    father:  document.getElementById('sFather').value.trim(),
    mother:  document.getElementById('sMother').value.trim(),
    phone:   document.getElementById('sPhone').value.trim(),
    dob:     document.getElementById('sDob').value,
    address: document.getElementById('sAddress').value.trim()
  };

  const students = DB.get('students');
  if (id) {
    const idx = students.findIndex(x => x.id == id);
    students[idx] = { ...students[idx], ...data };
    alert('✅ Student updated successfully!');
  } else {
    const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
    students.push({ id: newId, ...data });
    alert('✅ Student added successfully!');
  }
  DB.set('students', students);
  closeModal('studentModal');
  renderStudents();
}

function deleteStudent(id) {
  if (!confirm('Kya aap is student ko delete karna chahte hain?')) return;
  DB.set('students', DB.get('students').filter(s => s.id !== id));
  renderStudents();
  alert('🗑️ Student deleted successfully!');
}

/* ================= TEACHERS CRUD ================= */
function renderTeachers() {
  const teachers = DB.get('teachers');
  const search = (document.getElementById('teacherSearch')?.value || '').toLowerCase();
  const filtered = teachers.filter(t =>
    !search || t.name.toLowerCase().includes(search) || t.subject.toLowerCase().includes(search)
  );

  const tbody = document.getElementById('teachersTable');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">No teachers found. "Add Teacher" button dabayein.</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td>${t.empId}</td>
      <td><strong>${t.name}</strong></td>
      <td>${t.subject}</td>
      <td>${t.qual || '-'}</td>
      <td>${t.phone || '-'}</td>
      <td>${t.email || '-'}</td>
      <td>
        <button class="btn-edit" onclick="editTeacher(${t.id})"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn-delete" onclick="deleteTeacher(${t.id})"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
  renderOverview();
}

function openTeacherModal() {
  document.getElementById('teacherModalTitle').textContent = 'Add Teacher';
  document.getElementById('teacherForm').reset();
  document.getElementById('teacherId').value = '';
  openModal('teacherModal');
}

function editTeacher(id) {
  const t = DB.get('teachers').find(x => x.id === id);
  if (!t) return;
  document.getElementById('teacherModalTitle').textContent = 'Edit Teacher';
  document.getElementById('teacherId').value = t.id;
  document.getElementById('tEmpId').value   = t.empId;
  document.getElementById('tName').value    = t.name;
  document.getElementById('tSubject').value = t.subject;
  document.getElementById('tQual').value    = t.qual || '';
  document.getElementById('tPhone').value   = t.phone || '';
  document.getElementById('tEmail').value   = t.email || '';
  document.getElementById('tAddress').value = t.address || '';
  openModal('teacherModal');
}

function saveTeacher(e) {
  e.preventDefault();
  const id = document.getElementById('teacherId').value;
  const data = {
    empId:   document.getElementById('tEmpId').value.trim(),
    name:    document.getElementById('tName').value.trim(),
    subject: document.getElementById('tSubject').value.trim(),
    qual:    document.getElementById('tQual').value.trim(),
    phone:   document.getElementById('tPhone').value.trim(),
    email:   document.getElementById('tEmail').value.trim(),
    address: document.getElementById('tAddress').value.trim()
  };

  const teachers = DB.get('teachers');
  if (id) {
    const idx = teachers.findIndex(x => x.id == id);
    teachers[idx] = { ...teachers[idx], ...data };
    alert('✅ Teacher updated successfully!');
  } else {
    const newId = teachers.length ? Math.max(...teachers.map(t => t.id)) + 1 : 1;
    teachers.push({ id: newId, ...data });
    alert('✅ Teacher added successfully!');
  }
  DB.set('teachers', teachers);
  closeModal('teacherModal');
  renderTeachers();
}

function deleteTeacher(id) {
  if (!confirm('Kya aap is teacher ko delete karna chahte hain?')) return;
  DB.set('teachers', DB.get('teachers').filter(t => t.id !== id));
  renderTeachers();
  alert('🗑️ Teacher deleted successfully!');
}

/* ================= CLASSES ================= */
function renderClasses() {
  const students = DB.get('students');
  const classNames = ['Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5',
                      'Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];

  document.getElementById('classesGrid').innerHTML = classNames.map(c => {
    const list  = students.filter(s => s.cls === c);
    const boys  = list.filter(s => s.gender === 'Male').length;
    const girls = list.filter(s => s.gender === 'Female').length;
    return `
      <div class="class-card">
        <h3>${c}</h3>
        <p><strong>Total Students:</strong> ${list.length}</p>
        <p><strong>Boys:</strong> ${boys} | <strong>Girls:</strong> ${girls}</p>
      </div>
    `;
  }).join('');
}

/* ================= INITIAL RENDER ================= */
console.log('✅ Dashboard.js loaded successfully!');
renderStudents();
renderTeachers();
renderOverview();