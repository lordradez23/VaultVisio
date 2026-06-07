"""
Veritas Microfinance Bank - Database Manager
Demonstrates: Encapsulation, Exception Handling, Database Integration
Uses: oracledb (successor to cx_Oracle)
"""
import oracledb


class DatabaseManager:
    """Manages Oracle database connection and operations."""

    def __init__(self, user: str, password: str, dsn: str):
        self.__user = user
        self.__password = password
        self.__dsn = dsn
        self.__connection = None

    def connect(self):
        """Establish connection to Oracle database."""
        try:
            self.__connection = oracledb.connect(
                user=self.__user,
                password=self.__password,
                dsn=self.__dsn
            )
            print(f"[DB] Connected to Oracle as {self.__user}")
        except oracledb.Error as e:
            raise ConnectionError(f"Database connection failed: {e}")

    def disconnect(self):
        """Close the database connection."""
        if self.__connection:
            self.__connection.close()
            self.__connection = None
            print("[DB] Disconnected")

    def is_connected(self) -> bool:
        return self.__connection is not None

    def execute(self, sql: str, params: tuple = None, commit: bool = True) -> int:
        """Execute a DML statement. Returns rows affected."""
        if not self.__connection:
            raise ConnectionError("Not connected to database")
        cursor = self.__connection.cursor()
        try:
            cursor.execute(sql, params or ())
            if commit:
                self.__connection.commit()
            return cursor.rowcount
        except oracledb.Error as e:
            self.__connection.rollback()
            raise RuntimeError(f"SQL execution failed: {e}")
        finally:
            cursor.close()

    def fetch_one(self, sql: str, params: tuple = None) -> dict:
        """Fetch a single row as dictionary."""
        if not self.__connection:
            raise ConnectionError("Not connected to database")
        cursor = self.__connection.cursor()
        try:
            cursor.execute(sql, params or ())
            row = cursor.fetchone()
            if row is None:
                return None
            columns = [col[0].lower() for col in cursor.description]
            return dict(zip(columns, row))
        finally:
            cursor.close()

    def fetch_all(self, sql: str, params: tuple = None) -> list:
        """Fetch all rows as list of dictionaries."""
        if not self.__connection:
            raise ConnectionError("Not connected to database")
        cursor = self.__connection.cursor()
        try:
            cursor.execute(sql, params or ())
            rows = cursor.fetchall()
            columns = [col[0].lower() for col in cursor.description]
            return [dict(zip(columns, row)) for row in rows]
        finally:
            cursor.close()

    def call_procedure(self, proc_name: str, params: list) -> list:
        """Call a PL/SQL stored procedure. Returns output parameters."""
        if not self.__connection:
            raise ConnectionError("Not connected to database")
        cursor = self.__connection.cursor()
        try:
            result = cursor.callproc(proc_name, params)
            self.__connection.commit()
            return result
        except oracledb.Error as e:
            self.__connection.rollback()
            raise RuntimeError(f"Procedure call failed: {e}")
        finally:
            cursor.close()

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.disconnect()
