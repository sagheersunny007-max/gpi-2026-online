import sys
import os

from app import db, User, app

def seed():
    with app.app_context():
        # Clean existing mock students
        User.query.filter_by(role='student').delete()
        
        students_data = {
            'cit-1': [
                "Akash Mehdi", "Nayar Abbas", "Zahid Hussain", "Muhammad", "Taha Ali",
                "Muhammad Hassan", "Zuhaib Alam", "Noor Ali Mehdi", "Parveen", "Mehdi Hassan",
                "Ajmal Abbas", "Basil Abbas", "Ahmed Ali", "Arsalan Abbas", "Boo Ali",
                "Karim Abbas", "Zeeshan Abbas", "Bushra", "Muhammad Rohait", "Zain Abbas",
                "Ali Zain Gulzar", "Mudasir Ali", "Mujtaba Hussain", "Ali Hassan", "Tasawar Abbas",
                "Juneid Abbas", "Mazahar Abbas", "Shayan Abbas", "Sameer Abbas", "Ghulam Haider",
                "Zaigum Abbas", "Muhammad Faisal", "Mudasir Abbas", "Ali Abbas", "Azan Abbas",
                "Zubair Anwar", "Shayan Abbas"
            ],
            'cit-2': [
                "Basit Ali", "Mudassir Ali", "Ali Mehdi", "Atif Hussain", "M. Hassan",
                "Ali Muhammad", "Syed Mustafa", "Aqib Javeed", "Sami Jaffer", "Fayyaz Ali",
                "Shakeela Ali", "Azan Abbas", "Syed Arsalan", "Mussayib", "M. Naqi",
                "Aliyan Abbas", "Sagheer Ahmed", "Khadija Ahmed", "Ali Mehdi", "Ali Waris"
            ],
            'civil-1': [
                "Shafaat Hussain", "Waqas", "Sunaid Haider", "Muneeb Ali", "Ali Abbas",
                "Wisal Haider", "Waris Ali", "Wajid Hussain", "Shoukat", "Muntazir Mehdi",
                "Mohd Usman", "Hashim", "Ali Khamami Mir", "Mohd Saqib", "Haseeb Hussain",
                "Sameer Abbas", "Mehdi Abbas", "Asad Amin", "Mohd Abbas", "Mohd Saqlain",
                "Dilawar Abbas", "Daniyal Abbas", "Hassan Shah", "Azan Sadiq", "Shayan Abbas",
                "Arsalan Abbas", "Muhammad Saleh", "Ahtisham", "Dilawar", "Muhammad Haseeb Mehdi",
                "Karim Hussain", "Hassan Abbas", "Kifayat"
            ],
            'civil-2': [
                "Ali Raza", "Hussain Abbas", "Abbas Ali", "Mesum Haider", "Rohan Ali",
                "Sarbaz Ali", "Qamar Abbas", "Munawar Hussain", "Rehan Ali", "Saqib Hussain",
                "Sameer Abbas", "Fida Hussain", "Qamar Abbas", "Masam Raza", "Ehsan Ullah",
                "Jibran Abbas", "M. Kazim"
            ],
            'elec-1': [
                "Muhammad Haris", "Daniyal Abbas", "Shah Abdullah", "Shahid Karim", "Inzimam Karim",
                "Danish Iqbal", "Ahtisham Alam", "Sameer Abbas", "Sameer Hassan", "Awais Ali",
                "Karar Abbas", "Imdad Ali", "Manazir Hussein", "Sharam Hussein", "Ehtisham Hussein",
                "Yawar Abbas", "Ali Mehdi Mir", "Raees Ahmad", "Hifazat Hussein", "Sakhawat Hussein",
                "Athar Ali", "Muhammad Anas", "Shafiq Ul Rahman", "Meesum Abbas", "Mehdi Hussein",
                "Sheraz Hussain", "Sameer Abbas"
            ],
            'elec-2': [
                "Kamran", "Hassan Mehdi", "Sarfaraz", "Haider Raza", "Zahid",
                "Naqi", "Sulaiman", "Ejaz Hussain", "Sherayar Hamza", "Hamza Munir",
                "Ali Abbas", "Muntazir", "Sadiq", "M. Hussnain"
            ]
        }
        
        for dept_id, names in students_data.items():
            for idx, name in enumerate(names):
                u = User(name=name, email=f"s{idx+1}@{dept_id}.com", role='student', department_id=dept_id)
                u.set_password('pass123')
                db.session.add(u)
                
        db.session.commit()
        print("Successfully seeded all students from all departments into the database!")

if __name__ == '__main__':
    seed()
