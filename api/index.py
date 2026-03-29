import os
import sys

flask_app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'flask_app')
sys.path.insert(0, flask_app_dir)

from main_app import app
