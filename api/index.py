import os
import sys

flask_app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'flask_app')
sys.path.insert(0, flask_app_dir)

from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Attendance
from datetime import datetime

app = Flask(__name__, template_folder=os.path.join(flask_app_dir, 'templates'))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'super-secret-key-2026')

database_url = os.environ.get('DATABASE_URL', 'sqlite:////tmp/attendance.db')
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def setup_mock_data():
    if User.query.first(): return
    deps = ['cit-1', 'cit-2', 'civil-1', 'civil-2', 'elec-1', 'elec-2']
    for d in deps:
        t = User(name=f'Teacher {d.upper()}', email=f'teacher@{d}.com', role='teacher', department_id=d)
        t.set_password('password123')
        db.session.add(t)
    s1 = User(name='Kamran', email='s1@elec-2.com', role='student', department_id='elec-2')
    s1.set_password('pass123')
    db.session.add(s1)
    s2 = User(name='Ali Raza', email='s1@civil-2.com', role='student', department_id='civil-2')
    s2.set_password('pass123')
    db.session.add(s2)
    db.session.commit()

@app.before_request
def initialize_db():
    if not hasattr(app, 'db_initialized'):
        db.create_all()
        setup_mock_data()
        app.db_initialized = True

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid email or password')
    return render_template('login.html')

@app.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        new_email = request.form.get('new_email')
        new_password = request.form.get('new_password')
        if new_email and new_email != current_user.email:
            existing = User.query.filter_by(email=new_email).first()
            if existing:
                flash('That email address is already in use by another account.')
                return redirect(url_for('settings'))
            current_user.email = new_email
        if new_password:
            current_user.set_password(new_password)
        db.session.commit()
        flash('Your account settings have been successfully updated!')
        return redirect(url_for('settings'))
    return render_template('settings.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.role == 'teacher':
        students = User.query.filter_by(role='student', department_id=current_user.department_id).all()
        records = Attendance.query.filter_by(department_id=current_user.department_id).order_by(Attendance.timestamp.desc()).all()
        student_stats = {}
        if records:
            all_dates = {r.date for r in records}
            total_days = len(all_dates)
            for s in students:
                student_records = [r for r in records if r.student_id == s.id]
                present_days = sum(1 for r in student_records if r.status in ['Present', 'Leave'])
                perc = (present_days / total_days * 100) if total_days > 0 else 0
                student_stats[s.id] = round(perc, 1)
        else:
            for s in students:
                student_stats[s.id] = 0
        return render_template('teacher_dashboard.html', students=students, records=records, department=current_user.department_id, stats=student_stats)
    else:
        records = Attendance.query.filter_by(student_id=current_user.id).order_by(Attendance.date.desc()).all()
        return render_template('student_dashboard.html', records=records, department=current_user.department_id)

@app.route('/mark_attendance', methods=['POST'])
@login_required
def mark_attendance():
    if current_user.role != 'teacher':
        return "Unauthorized", 403
    student_id = request.form.get('student_id')
    status = request.form.get('status')
    att_date_str = request.form.get('attendance_date')
    if att_date_str:
        att_date = datetime.strptime(att_date_str, '%Y-%m-%d').date()
    else:
        att_date = datetime.utcnow().date()
    student = User.query.get(student_id)
    if not student or student.department_id != current_user.department_id:
        return "Invalid student or unauthorized", 403
    existing_record = Attendance.query.filter_by(student_id=student.id, date=att_date).first()
    if existing_record:
        existing_record.status = status
        db.session.commit()
        flash(f"Attendance for {student.name} updated to {status} on {att_date}.")
    else:
        record = Attendance(student_id=student.id, department_id=current_user.department_id, date=att_date, status=status)
        db.session.add(record)
        db.session.commit()
        flash(f"Attendance marked as {status} for {student.name} on {att_date}.")
    return redirect(url_for('dashboard'))

@app.route('/modify_record/<int:record_id>', methods=['POST'])
@login_required
def modify_record(record_id):
    if current_user.role != 'teacher':
        return "Unauthorized", 403
    record = Attendance.query.get(record_id)
    if not record or record.department_id != current_user.department_id:
        return "Invalid record or unauthorized", 403
    new_status = request.form.get('new_status')
    if new_status in ['Present', 'Absent', 'Leave']:
        record.status = new_status
        db.session.commit()
        flash(f"Record for {record.student.name} modified to {new_status}.")
    return redirect(url_for('dashboard'))

@app.route('/delete_record/<int:record_id>', methods=['POST'])
@login_required
def delete_record(record_id):
    if current_user.role != 'teacher':
        return "Unauthorized", 403
    record = Attendance.query.get(record_id)
    if not record or record.department_id != current_user.department_id:
        return "Invalid record or unauthorized", 403
    student_name = record.student.name
    db.session.delete(record)
    db.session.commit()
    flash(f"Record for {student_name} deleted.")
    return redirect(url_for('dashboard'))

