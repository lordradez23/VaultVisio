"""
Veritas Microfinance Bank - CLI Banking Application
Main entry point demonstrating full OOP integration.
"""
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.customer import Customer
from backend.models.account import SavingsAccount, CurrentAccount
from backend.models.transaction import Transaction
from backend.models.staff import BankStaff
from backend.services.transfer_service import TransferService
from backend.services.audit_logger import AuditLogger
from backend.database.sqlite_manager import SQLiteManager


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


class BankingApp:
    """Main application controller."""

    def __init__(self):
        self._db = SQLiteManager()
        self._audit = AuditLogger()
        self._transfer_service = TransferService(self._audit)
        self._current_user = None

    def start(self):
        print("=" * 60)
        print("   VERITAS MICROFINANCE BANK - Digital Banking System")
        print("   University Community Banking Solution")
        print("=" * 60)

        self._db.connect()
        print()
        self._main_menu()

    def _main_menu(self):
        while True:
            print("\n--- Main Menu ---")
            print("1. Register")
            print("2. Login")
            print("3. Admin Login")
            print("4. Exit")
            choice = input("\nSelect option: ").strip()

            if choice == "1":
                self._register()
            elif choice == "2":
                self._login()
            elif choice == "3":
                self._admin_login()
            elif choice == "4":
                self._shutdown()
                break
            else:
                print("[!] Invalid option")

    def _register(self):
        print("\n--- Customer Registration ---")
        first_name = input("First Name: ").strip()
        last_name = input("Last Name: ").strip()
        email = input("Email: ").strip()
        phone = input("Phone: ").strip()
        password = input("Password: ").strip()
        print("Account Type:")
        print("  1. Savings (Min balance: N1,000 | 3.5% interest)")
        print("  2. Current (Min balance: N5,000 | No interest)")
        acc_type = input("Choose (1/2): ").strip()

        if not all([first_name, last_name, email, password]):
            print("[!] All fields are required")
            return

        # Check if email exists
        existing = self._db.fetch_one("SELECT customer_id FROM Customers WHERE email = ?", (email,))
        if existing:
            print("[!] Email already registered")
            return

        pwd_hash = hash_password(password)

        try:
            self._db.execute(
                """INSERT INTO Customers (first_name, last_name, email, phone, password_hash, branch_id)
                   VALUES (?, ?, ?, ?, ?, 1)""",
                (first_name, last_name, email, phone, pwd_hash)
            )
            result = self._db.fetch_one("SELECT customer_id FROM Customers WHERE email = ?", (email,))
            cust_id = result['customer_id']

            a_type = "SAVINGS" if acc_type == "1" else "CURRENT"
            acc_num = f"VRT-{a_type[:3]}-{cust_id:07d}"
            min_bal = 1000.0 if a_type == "SAVINGS" else 5000.0
            interest = 0.035 if a_type == "SAVINGS" else 0.0

            self._db.execute(
                """INSERT INTO Accounts (account_number, customer_id, account_type, balance, interest_rate, min_balance)
                   VALUES (?, ?, ?, 0.00, ?, ?)""",
                (acc_num, cust_id, a_type, interest, min_bal)
            )

            # Audit log
            self._db.execute(
                """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
                   VALUES ('Customers', 'INSERT', ?, ?, 'SUCCESS')""",
                (cust_id, f"Registered: {first_name} {last_name} ({email})")
            )

            print(f"\n[+] Registration successful!")
            print(f"    Name: {first_name} {last_name}")
            print(f"    Account: {acc_num}")
            print(f"    Type: {a_type}")
            print(f"    [Default password for demo users: 'password']")
        except RuntimeError as e:
            print(f"[!] Registration failed: {e}")

    def _login(self):
        print("\n--- Customer Login ---")
        email = input("Email: ").strip()
        password = input("Password: ").strip()
        pwd_hash = hash_password(password)

        user = self._db.fetch_one(
            "SELECT * FROM Customers WHERE email = ? AND is_active = 1", (email,)
        )

        if user and user['password_hash'] == pwd_hash:
            self._current_user = user
            self._db.execute(
                """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
                   VALUES ('Customers', 'LOGIN', ?, ?, 'SUCCESS')""",
                (user['customer_id'], f"Login: {email}")
            )
            print(f"\n[+] Welcome, {user['first_name']} {user['last_name']}!")
            self._customer_menu()
        else:
            self._db.execute(
                """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
                   VALUES ('Customers', 'FAILED_LOGIN', 0, ?, 'FAILURE')""",
                (f"Failed login: {email}",)
            )
            print("[!] Invalid credentials")

    def _admin_login(self):
        print("\n--- Staff Login ---")
        email = input("Staff Email: ").strip()
        password = input("Password: ").strip()
        pwd_hash = hash_password(password)

        staff = self._db.fetch_one(
            "SELECT * FROM BankStaff WHERE email = ? AND is_active = 1", (email,)
        )

        if staff and staff['password_hash'] == pwd_hash:
            print(f"\n[+] Welcome, {staff['first_name']} ({staff['role']})")
            self._admin_menu(staff)
        else:
            print("[!] Invalid staff credentials")
            print("    [Hint: adebayo.okunola@veritas.ng / admin]")

    def _customer_menu(self):
        while self._current_user:
            # Get account info
            account = self._db.fetch_one(
                "SELECT * FROM Accounts WHERE customer_id = ? LIMIT 1",
                (self._current_user['customer_id'],)
            )
            print(f"\n--- Banking Menu [{self._current_user['first_name']}] ---")
            if account:
                print(f"    Account: {account['account_number']} | Balance: N{account['balance']:,.2f}")
            print("\n1. Deposit")
            print("2. Withdraw")
            print("3. Transfer")
            print("4. Balance Inquiry")
            print("5. Transaction History")
            print("6. Logout")
            choice = input("\nSelect: ").strip()

            if choice == "1":
                self._deposit()
            elif choice == "2":
                self._withdraw()
            elif choice == "3":
                self._transfer()
            elif choice == "4":
                self._balance_inquiry()
            elif choice == "5":
                self._transaction_history()
            elif choice == "6":
                self._logout()
            else:
                print("[!] Invalid option")

    def _deposit(self):
        try:
            amount = float(input("Deposit amount (N): "))
            if amount <= 0:
                print("[!] Amount must be positive")
                return
        except ValueError:
            print("[!] Invalid amount")
            return

        account = self._db.fetch_one(
            "SELECT * FROM Accounts WHERE customer_id = ? LIMIT 1",
            (self._current_user['customer_id'],)
        )
        if not account:
            print("[!] No account found")
            return

        balance_before = account['balance']
        balance_after = balance_before + amount

        self._db.execute("UPDATE Accounts SET balance = ? WHERE account_id = ?",
                         (balance_after, account['account_id']))

        self._db.execute(
            """INSERT INTO Transactions (account_id, transaction_type, amount, balance_before, balance_after, description, status)
               VALUES (?, 'DEPOSIT', ?, ?, ?, 'Cash Deposit', 'COMPLETED')""",
            (account['account_id'], amount, balance_before, balance_after)
        )

        self._db.execute(
            """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
               VALUES ('Accounts', 'UPDATE', ?, ?, 'SUCCESS')""",
            (account['account_id'], f"Deposit: N{amount:,.2f} | Balance: N{balance_before:,.2f} -> N{balance_after:,.2f}")
        )

        print(f"\n[+] Deposit successful!")
        print(f"    Amount: N{amount:,.2f}")
        print(f"    New Balance: N{balance_after:,.2f}")

    def _withdraw(self):
        try:
            amount = float(input("Withdrawal amount (N): "))
            if amount <= 0:
                print("[!] Amount must be positive")
                return
        except ValueError:
            print("[!] Invalid amount")
            return

        account = self._db.fetch_one(
            "SELECT * FROM Accounts WHERE customer_id = ? LIMIT 1",
            (self._current_user['customer_id'],)
        )
        if not account:
            print("[!] No account found")
            return

        balance_before = account['balance']
        min_balance = account['min_balance']

        if (balance_before - amount) < min_balance:
            print(f"[!] Insufficient funds. Available: N{balance_before - min_balance:,.2f}")
            self._db.execute(
                """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
                   VALUES ('Transactions', 'FAILED_TRANSACTION', ?, ?, 'FAILURE')""",
                (account['account_id'], f"Withdrawal failed: N{amount:,.2f} | Balance: N{balance_before:,.2f}")
            )
            return

        balance_after = balance_before - amount

        self._db.execute("UPDATE Accounts SET balance = ? WHERE account_id = ?",
                         (balance_after, account['account_id']))

        self._db.execute(
            """INSERT INTO Transactions (account_id, transaction_type, amount, balance_before, balance_after, description, status)
               VALUES (?, 'WITHDRAWAL', ?, ?, ?, 'Cash Withdrawal', 'COMPLETED')""",
            (account['account_id'], amount, balance_before, balance_after)
        )

        self._db.execute(
            """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
               VALUES ('Accounts', 'UPDATE', ?, ?, 'SUCCESS')""",
            (account['account_id'], f"Withdrawal: N{amount:,.2f} | Balance: N{balance_before:,.2f} -> N{balance_after:,.2f}")
        )

        print(f"\n[+] Withdrawal successful!")
        print(f"    Amount: N{amount:,.2f}")
        print(f"    New Balance: N{balance_after:,.2f}")

    def _transfer(self):
        to_acc_num = input("Recipient account number: ").strip()
        try:
            amount = float(input("Transfer amount (N): "))
            if amount <= 0:
                print("[!] Amount must be positive")
                return
        except ValueError:
            print("[!] Invalid amount")
            return

        # Source account
        from_account = self._db.fetch_one(
            "SELECT * FROM Accounts WHERE customer_id = ? LIMIT 1",
            (self._current_user['customer_id'],)
        )
        # Destination account
        to_account = self._db.fetch_one(
            "SELECT * FROM Accounts WHERE account_number = ? AND is_active = 1",
            (to_acc_num,)
        )

        if not to_account:
            print("[!] Recipient account not found")
            return

        if from_account['account_id'] == to_account['account_id']:
            print("[!] Cannot transfer to same account")
            return

        from_balance = from_account['balance']
        if (from_balance - amount) < from_account['min_balance']:
            print(f"[!] Insufficient funds. Available: N{from_balance - from_account['min_balance']:,.2f}")
            return

        # Debit source
        from_after = from_balance - amount
        self._db.execute("UPDATE Accounts SET balance = ? WHERE account_id = ?",
                         (from_after, from_account['account_id']))

        # Credit destination
        to_after = to_account['balance'] + amount
        self._db.execute("UPDATE Accounts SET balance = ? WHERE account_id = ?",
                         (to_after, to_account['account_id']))

        # Log transactions
        self._db.execute(
            """INSERT INTO Transactions (account_id, transaction_type, amount, balance_before, balance_after, description, status)
               VALUES (?, 'TRANSFER_OUT', ?, ?, ?, ?, 'COMPLETED')""",
            (from_account['account_id'], amount, from_balance, from_after, f"Transfer to {to_acc_num}")
        )
        self._db.execute(
            """INSERT INTO Transactions (account_id, transaction_type, amount, balance_before, balance_after, description, status)
               VALUES (?, 'TRANSFER_IN', ?, ?, ?, ?, 'COMPLETED')""",
            (to_account['account_id'], amount, to_account['balance'], to_after, f"Transfer from {from_account['account_number']}")
        )

        # Log transfer
        self._db.execute(
            """INSERT INTO Transfers (from_account_id, to_account_id, amount, description, status)
               VALUES (?, ?, ?, 'Fund Transfer', 'COMPLETED')""",
            (from_account['account_id'], to_account['account_id'], amount)
        )

        # Audit
        self._db.execute(
            """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
               VALUES ('Transfers', 'INSERT', ?, ?, 'SUCCESS')""",
            (from_account['account_id'], f"Transfer N{amount:,.2f} to {to_acc_num}")
        )

        print(f"\n[+] Transfer successful!")
        print(f"    To: {to_acc_num}")
        print(f"    Amount: N{amount:,.2f}")
        print(f"    Your Balance: N{from_after:,.2f}")

    def _balance_inquiry(self):
        accounts = self._db.fetch_all(
            "SELECT * FROM Accounts WHERE customer_id = ?",
            (self._current_user['customer_id'],)
        )
        if accounts:
            print(f"\n{'Account':<20} {'Type':<10} {'Balance':<15} {'Status'}")
            print("-" * 60)
            for a in accounts:
                status = "Active" if a['is_active'] else "Suspended"
                print(f"{a['account_number']:<20} {a['account_type']:<10} N{a['balance']:>12,.2f} {status}")
        else:
            print("[!] No accounts found")

    def _transaction_history(self):
        account = self._db.fetch_one(
            "SELECT account_id FROM Accounts WHERE customer_id = ? LIMIT 1",
            (self._current_user['customer_id'],)
        )
        if not account:
            print("[!] No account found")
            return

        rows = self._db.fetch_all(
            """SELECT transaction_type, amount, balance_after, description, status, transaction_date
               FROM Transactions WHERE account_id = ?
               ORDER BY transaction_date DESC LIMIT 10""",
            (account['account_id'],)
        )

        if rows:
            print(f"\n{'Type':<15} {'Amount':<12} {'Balance':<12} {'Status':<10} {'Date'}")
            print("-" * 70)
            for r in rows:
                sign = "+" if r['transaction_type'] in ('DEPOSIT', 'TRANSFER_IN') else "-"
                print(f"{r['transaction_type']:<15} {sign}N{r['amount']:>9,.2f} N{r['balance_after']:>9,.2f} {r['status']:<10} {r['transaction_date']}")
        else:
            print("[i] No transactions yet")

    def _admin_menu(self, staff):
        while True:
            print(f"\n--- Admin Dashboard [{staff['role']}] ---")
            print("1. View All Customers")
            print("2. View All Accounts")
            print("3. View Audit Logs")
            print("4. Suspend/Activate Account")
            print("5. Logout")
            choice = input("\nSelect: ").strip()

            if choice == "1":
                customers = self._db.fetch_all("SELECT customer_id, first_name, last_name, email, is_active FROM Customers")
                print(f"\n{'ID':<5} {'Name':<25} {'Email':<30} {'Status'}")
                print("-" * 70)
                for c in customers:
                    status = "Active" if c['is_active'] else "Suspended"
                    print(f"{c['customer_id']:<5} {c['first_name'] + ' ' + c['last_name']:<25} {c['email']:<30} {status}")
            elif choice == "2":
                accounts = self._db.fetch_all(
                    """SELECT a.account_number, c.first_name || ' ' || c.last_name as name, 
                       a.account_type, a.balance, a.is_active
                       FROM Accounts a JOIN Customers c ON a.customer_id = c.customer_id"""
                )
                print(f"\n{'Account':<20} {'Owner':<20} {'Type':<10} {'Balance':<15} {'Status'}")
                print("-" * 75)
                for a in accounts:
                    status = "Active" if a['is_active'] else "Suspended"
                    print(f"{a['account_number']:<20} {a['name']:<20} {a['account_type']:<10} N{a['balance']:>12,.2f} {status}")
            elif choice == "3":
                logs = self._db.fetch_all("SELECT * FROM AuditLogs ORDER BY created_at DESC LIMIT 15")
                print(f"\n{'Table':<12} {'Operation':<18} {'Details':<40} {'Status'}")
                print("-" * 80)
                for l in logs:
                    details = (l['new_values'] or l['old_values'] or '')[:38]
                    print(f"{l['table_name']:<12} {l['operation']:<18} {details:<40} {l['status']}")
            elif choice == "4":
                acc_num = input("Account number to toggle: ").strip()
                acc = self._db.fetch_one("SELECT * FROM Accounts WHERE account_number = ?", (acc_num,))
                if acc:
                    new_status = 0 if acc['is_active'] else 1
                    self._db.execute("UPDATE Accounts SET is_active = ? WHERE account_id = ?",
                                     (new_status, acc['account_id']))
                    action = "Activated" if new_status else "Suspended"
                    print(f"[+] Account {acc_num} {action}")
                else:
                    print("[!] Account not found")
            elif choice == "5":
                print("[+] Admin logged out")
                break

    def _logout(self):
        print(f"[+] Goodbye, {self._current_user['first_name']}!")
        self._current_user = None

    def _shutdown(self):
        self._db.disconnect()
        print("\n[+] System shutdown. Thank you for banking with Veritas.")


if __name__ == "__main__":
    app = BankingApp()
    app.start()
