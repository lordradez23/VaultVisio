"""
Veritas Microfinance Bank - SQLite Database Manager (Local Fallback)
Mirrors Oracle schema for offline demonstration.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "veritas_bank.db")


class SQLiteManager:
    """SQLite fallback that mirrors Oracle schema for local demo."""

    def __init__(self, db_path: str = DB_PATH):
        self._db_path = db_path
        self._connection = None

    def connect(self):
        self._connection = sqlite3.connect(self._db_path)
        self._connection.row_factory = sqlite3.Row
        self._connection.execute("PRAGMA foreign_keys = ON")
        self._initialize_schema()
        print(f"[DB] Connected to local database")

    def disconnect(self):
        if self._connection:
            self._connection.close()
            self._connection = None

    def is_connected(self) -> bool:
        return self._connection is not None

    def execute(self, sql: str, params: tuple = None, commit: bool = True) -> int:
        cursor = self._connection.cursor()
        try:
            cursor.execute(sql, params or ())
            if commit:
                self._connection.commit()
            return cursor.rowcount
        except sqlite3.Error as e:
            self._connection.rollback()
            raise RuntimeError(f"SQL error: {e}")

    def fetch_one(self, sql: str, params: tuple = None) -> dict:
        cursor = self._connection.cursor()
        cursor.execute(sql, params or ())
        row = cursor.fetchone()
        if row is None:
            return None
        return dict(row)

    def fetch_all(self, sql: str, params: tuple = None) -> list:
        cursor = self._connection.cursor()
        cursor.execute(sql, params or ())
        return [dict(row) for row in cursor.fetchall()]

    def _initialize_schema(self):
        """Create tables if they don't exist."""
        cursor = self._connection.cursor()
        cursor.executescript("""
            CREATE TABLE IF NOT EXISTS Branches (
                branch_id INTEGER PRIMARY KEY AUTOINCREMENT,
                branch_name TEXT NOT NULL,
                branch_code TEXT UNIQUE NOT NULL,
                address TEXT,
                city TEXT,
                state TEXT,
                phone TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS BankStaff (
                staff_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'TELLER' CHECK (role IN ('ADMIN', 'MANAGER', 'TELLER')),
                branch_id INTEGER,
                is_active INTEGER DEFAULT 1,
                hire_date TEXT DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)
            );

            CREATE TABLE IF NOT EXISTS Customers (
                customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                password_hash TEXT NOT NULL,
                date_of_birth TEXT,
                address TEXT,
                city TEXT,
                state TEXT,
                branch_id INTEGER,
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)
            );

            CREATE TABLE IF NOT EXISTS Accounts (
                account_id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_number TEXT UNIQUE NOT NULL,
                customer_id INTEGER NOT NULL,
                account_type TEXT NOT NULL CHECK (account_type IN ('SAVINGS', 'CURRENT')),
                balance REAL DEFAULT 0.00 CHECK (balance >= 0),
                interest_rate REAL DEFAULT 0.0000,
                min_balance REAL DEFAULT 0.00,
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
            );

            CREATE TABLE IF NOT EXISTS Transactions (
                transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_id INTEGER NOT NULL,
                transaction_type TEXT NOT NULL CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT')),
                amount REAL NOT NULL CHECK (amount > 0),
                balance_before REAL NOT NULL,
                balance_after REAL NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED', 'REVERSED')),
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id) REFERENCES Accounts(account_id)
            );

            CREATE TABLE IF NOT EXISTS Transfers (
                transfer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                from_account_id INTEGER NOT NULL,
                to_account_id INTEGER NOT NULL,
                amount REAL NOT NULL CHECK (amount > 0),
                description TEXT,
                status TEXT DEFAULT 'COMPLETED',
                initiated_by INTEGER,
                transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (from_account_id) REFERENCES Accounts(account_id),
                FOREIGN KEY (to_account_id) REFERENCES Accounts(account_id),
                FOREIGN KEY (initiated_by) REFERENCES BankStaff(staff_id)
            );

            CREATE TABLE IF NOT EXISTS AuditLogs (
                audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
                table_name TEXT NOT NULL,
                operation TEXT NOT NULL,
                record_id INTEGER,
                old_values TEXT,
                new_values TEXT,
                performed_by TEXT,
                ip_address TEXT,
                status TEXT DEFAULT 'SUCCESS',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        # Seed if empty
        count = cursor.execute("SELECT COUNT(*) FROM Branches").fetchone()[0]
        if count == 0:
            self._seed_data()
        self._connection.commit()

    def _seed_data(self):
        cursor = self._connection.cursor()
        cursor.executescript("""
            INSERT INTO Branches (branch_name, branch_code, address, city, state, phone)
            VALUES ('Main Campus Branch', 'MCB001', 'University Main Gate', 'Ilorin', 'Kwara', '08012345678');

            INSERT INTO Branches (branch_name, branch_code, address, city, state, phone)
            VALUES ('Science Faculty Branch', 'SFB002', 'Faculty of Science Complex', 'Ilorin', 'Kwara', '08087654321');

            INSERT INTO BankStaff (first_name, last_name, email, password_hash, role, branch_id)
            VALUES ('Adebayo', 'Okunola', 'adebayo.okunola@veritas.ng', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'ADMIN', 1);

            INSERT INTO Customers (first_name, last_name, email, phone, password_hash, date_of_birth, address, city, state, branch_id)
            VALUES ('Oluwaseun', 'Adeyemi', 'seun.adeyemi@student.edu.ng', '08033344455', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '2001-05-15', '12 Hostel Road', 'Ilorin', 'Kwara', 1);

            INSERT INTO Customers (first_name, last_name, email, phone, password_hash, date_of_birth, address, city, state, branch_id)
            VALUES ('Amina', 'Bello', 'amina.bello@student.edu.ng', '07066677788', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '2000-11-22', '5 Staff Quarters', 'Ilorin', 'Kwara', 1);

            INSERT INTO Customers (first_name, last_name, email, phone, password_hash, date_of_birth, address, city, state, branch_id)
            VALUES ('David', 'Okafor', 'david.okafor@staff.edu.ng', '09011122233', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '1985-03-10', '8 Lecturer Avenue', 'Ilorin', 'Kwara', 2);

            INSERT INTO Accounts (account_number, customer_id, account_type, balance, interest_rate, min_balance)
            VALUES ('VRT-SAV-0000001', 1, 'SAVINGS', 25000.00, 0.035, 1000.00);

            INSERT INTO Accounts (account_number, customer_id, account_type, balance, interest_rate, min_balance)
            VALUES ('VRT-CUR-0000001', 1, 'CURRENT', 150000.00, 0.0, 5000.00);

            INSERT INTO Accounts (account_number, customer_id, account_type, balance, interest_rate, min_balance)
            VALUES ('VRT-SAV-0000002', 2, 'SAVINGS', 45000.00, 0.035, 1000.00);

            INSERT INTO Accounts (account_number, customer_id, account_type, balance, interest_rate, min_balance)
            VALUES ('VRT-CUR-0000003', 3, 'CURRENT', 500000.00, 0.0, 5000.00);
        """)

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.disconnect()
