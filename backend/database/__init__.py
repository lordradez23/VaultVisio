from backend.database.sqlite_manager import SQLiteManager

try:
    from backend.database.db_manager import DatabaseManager
except ImportError:
    DatabaseManager = None
