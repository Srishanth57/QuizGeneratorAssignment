import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# --- 1. Define the Database URL ---

# This is the path to your database file.
# The "./" means "in the same directory as the script."
DATABASE_FILE = "quiz_history.db"
DATABASE_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)), DATABASE_FILE)

# The "connection string" for SQLite is simple:
# "sqlite:///path/to/your/file.db"
# The '///' is important! It means it's a file path.
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# --- 2. Define the SQLAlchemy Engine ---


engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False} # Specific to SQLite
)


class Base(DeclarativeBase):
    pass


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



print(f"Database engine created for: {DATABASE_URL}")

