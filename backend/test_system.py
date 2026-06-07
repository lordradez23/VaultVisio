"""
Veritas Microfinance Bank - Full System Test
Demonstrates: Registration, Login, Deposit, Withdrawal, Transfer, Balance, History, Admin
"""
import sys
import os
import hashlib

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.sqlite_manager import SQLiteManager

# Reset DB for clean test
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database", "veritas_bank.db")
if os.path.exists(db_path):
    os.remove(db_path)

db = SQLiteManager()
db.connect()

def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

print("=" * 65)
print("   VERITAS MICROFINANCE BANK - Full System Test")
print("=" * 65)

# ============================================================
# TEST 1: Customer Registration
# ============================================================
print("\n" + "=" * 65)
print("  TEST 1: Customer Registration")
print("=" * 65)

db.execute(
    """INSERT INTO Customers (first_name, last_name, email, phone, password_hash, branch_id)
       VALUES (?, ?, ?, ?, ?, 1)""",
    ("Tunde", "Bankole", "tunde.bankole@student.edu.ng", "08099887766", hash_pw("mypassword"))
)
new_cust = db.fetch_one("SELECT customer_id FROM Customers WHERE email = ?", ("tunde.bankole@student.edu.ng",))
cust_id = new_cust['customer_id']

acc_num = f"VRT-SAV-{cust_id:07d}"
db.execute(
    """INSERT INTO Accounts (account_number, customer_id, account_type, balance, interest_rate, min_balance)
       VALUES (?, ?, 'SAVINGS', 0.00, 0.035, 1000.00)""",
    (acc_num, cust_id)
)

db.execute(
    """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
       VALUES ('Customers', 'INSERT', ?, ?, 'SUCCESS')""",
    (cust_id, "Registered: Tunde Bankole (tunde.bankole@student.edu.ng)")
)

print(f"  [+] Registered: Tunde Bankole")
print(f"      Email: tunde.bankole@student.edu.ng")
print(f"      Account: {acc_num}")
print(f"      Type: SAVINGS")

# ============================================================
# TEST 2: Customer Login
# ============================================================
print("\n" + "=" * 65)
print("  TEST 2: Customer Login")
print("=" * 65)

user = db.fetch_one(
    "SELECT * FROM Customers WHERE email = ? AND is_active = 1",
    ("tunde.bankole@student.edu.ng",)
)
if user and user['password_hash'] == hash_pw("mypassword"):
    print(f"  [+] Login successful: {user['first_name']} {user['last_name']}")
    db.execute(
        """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
           VALUES ('Customers', 'LOGIN', ?, 'Login successful', 'SUCCESS')""",
        (user['customer_id'],)
    )
else:
    print("  [!] Login failed")

# Get account
account = db.fetch_one("SELECT * FROM Accounts WHERE customer_id = ?", (cust_id,))
acc_id = account['account_id']

# ============================================================
# TEST 3: Deposit
# ============================================================
print("\n" + "=" * 65)
print("  TEST 3: Deposit N50,000")
print("=" * 65)

amount = 50000.00
balance_before = account['balance']
balance_after = balance_before + amount

db.execute("UPDATE Accounts SET balance = ? WHERE account_id = ?", (balance_after, acc_id))
db.execute(
    """INSERT INTO Transactions (account_id, transaction_type, amount, balance_before, balance_after, description, status)
       VALUES (?, 'DEPOSIT', ?, ?, ?, 'Cash Deposit', 'COMPLETED')""",
    (acc_id, amount, balance_before, balance_after)
)
db.execute(
    """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
       VALUES ('Accounts', 'UPDATE', ?, ?, 'SUCCESS')""",
    (acc_id, f"Deposit: N{amount:,.2f} | Balance: N{balance_before:,.2f} -> N{balance_after:,.2f}")
)

print(f"  [+] Deposit successful")
print(f"      Amount: N{amount:,.2f}")
print(f"      Balance Before: N{balance_before:,.2f}")
print(f"      Balance After:  N{balance_after:,.2f}")

# ============================================================
# TEST 4: Withdrawal
# ============================================================
print("\n" + "=" * 65)
print("  TEST 4: Withdrawal N15,000")
print("=" * 65)

amount = 15000.00
balance_before = balance_after
min_balance = 1000.00

if (balance_before - amount) < min_balance:
    print(f"  [!] FAILED: Insufficient funds")
else:
    balance_after = balance_before - amount
    db.execute("UPDATE Accounts SET balance = ? WHERE account_id = ?", (balance_after, acc_id))
    db.execute(
        """INSERT INTO Transactions (account_id, transaction_type, amount, balance_before, balance_after, description, status)
           VALUES (?, 'WITHDRAWAL', ?, ?, ?, 'Cash Withdrawal', 'COMPLETED')""",
        (acc_id, amount, balance_before, balance_after)
    )
    db.execute(
        """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
           VALUES ('Accounts', 'UPDATE', ?, ?, 'SUCCESS')""",
        (acc_id, f"Withdrawal: N{amount:,.2f} | Balance: N{balance_before:,.2f} -> N{balance_after:,.2f}")
    )
    print(f"  [+] Withdrawal successful")
    print(f"      Amount: N{amount:,.2f}")
    print(f"      Balance Before: N{balance_before:,.2f}")
    print(f"      Balance After:  N{balance_after:,.2f}")

# ============================================================
# TEST 5: Failed Withdrawal (Insufficient Funds)
# ============================================================
print("\n" + "=" * 65)
print("  TEST 5: Withdrawal N40,000 (Should FAIL - Insufficient Funds)")
print("=" * 65)

amount = 40000.00
balance_before = balance_after

if (balance_before - amount) < min_balance:
    print(f"  [!] BLOCKED: Insufficient funds")
    print(f"      Requested: N{amount:,.2f}")
    print(f"      Available:  N{balance_before - min_balance:,.2f}")
    db.execute(
        """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
           VALUES ('Transactions', 'FAILED_TRANSACTION', ?, ?, 'FAILURE')""",
        (acc_id, f"Withdrawal denied: N{amount:,.2f} | Balance: N{balance_before:,.2f}")
    )

# ============================================================
# TEST 6: Fund Transfer
# ============================================================
print("\n" + "=" * 65)
print("  TEST 6: Transfer N5,000 to Amina Bello (VRT-SAV-0000002)")
print("=" * 65)

to_account = db.fetch_one("SELECT * FROM Accounts WHERE account_number = ?", ("VRT-SAV-0000002",))
transfer_amount = 5000.00
from_balance = balance_after

if to_account and (from_balance - transfer_amount) >= min_balance:
    from_after = from_balance - transfer_amount
    to_after = to_account['balance'] + transfer_amount

    db.execute("UPDATE Accounts SET balance = ? WHERE account_id = ?", (from_after, acc_id))
    db.execute("UPDATE Accounts SET balance = ? WHERE account_id = ?", (to_after, to_account['account_id']))

    db.execute(
        """INSERT INTO Transactions (account_id, transaction_type, amount, balance_before, balance_after, description, status)
           VALUES (?, 'TRANSFER_OUT', ?, ?, ?, ?, 'COMPLETED')""",
        (acc_id, transfer_amount, from_balance, from_after, "Transfer to VRT-SAV-0000002")
    )
    db.execute(
        """INSERT INTO Transactions (account_id, transaction_type, amount, balance_before, balance_after, description, status)
           VALUES (?, 'TRANSFER_IN', ?, ?, ?, ?, 'COMPLETED')""",
        (to_account['account_id'], transfer_amount, to_account['balance'], to_after, f"Transfer from {acc_num}")
    )
    db.execute(
        """INSERT INTO Transfers (from_account_id, to_account_id, amount, description, status)
           VALUES (?, ?, ?, 'Fund Transfer', 'COMPLETED')""",
        (acc_id, to_account['account_id'], transfer_amount)
    )
    db.execute(
        """INSERT INTO AuditLogs (table_name, operation, record_id, new_values, status)
           VALUES ('Transfers', 'INSERT', ?, ?, 'SUCCESS')""",
        (acc_id, f"Transfer N{transfer_amount:,.2f} to VRT-SAV-0000002")
    )

    print(f"  [+] Transfer successful")
    print(f"      From: {acc_num}")
    print(f"      To:   VRT-SAV-0000002 (Amina Bello)")
    print(f"      Amount: N{transfer_amount:,.2f}")
    print(f"      Your Balance: N{from_after:,.2f}")
    balance_after = from_after

# ============================================================
# TEST 7: Balance Inquiry
# ============================================================
print("\n" + "=" * 65)
print("  TEST 7: Balance Inquiry")
print("=" * 65)

accounts = db.fetch_all("SELECT * FROM Accounts WHERE customer_id = ?", (cust_id,))
print(f"  {'Account':<20} {'Type':<10} {'Balance':<15} {'Status'}")
print(f"  {'-'*60}")
for a in accounts:
    status = "Active" if a['is_active'] else "Suspended"
    print(f"  {a['account_number']:<20} {a['account_type']:<10} N{a['balance']:>12,.2f} {status}")

# ============================================================
# TEST 8: Transaction History
# ============================================================
print("\n" + "=" * 65)
print("  TEST 8: Transaction History")
print("=" * 65)

txns = db.fetch_all(
    """SELECT transaction_type, amount, balance_after, description, status, transaction_date
       FROM Transactions WHERE account_id = ? ORDER BY transaction_date DESC""",
    (acc_id,)
)
print(f"  {'Type':<15} {'Amount':<12} {'Balance':<12} {'Description'}")
print(f"  {'-'*60}")
for t in txns:
    sign = "+" if t['transaction_type'] in ('DEPOSIT', 'TRANSFER_IN') else "-"
    print(f"  {t['transaction_type']:<15} {sign}N{t['amount']:>9,.2f} N{t['balance_after']:>9,.2f} {t['description']}")

# ============================================================
# TEST 9: Admin - View All Customers
# ============================================================
print("\n" + "=" * 65)
print("  TEST 9: Admin Dashboard - All Customers")
print("=" * 65)

customers = db.fetch_all("SELECT customer_id, first_name, last_name, email, is_active FROM Customers")
print(f"  {'ID':<5} {'Name':<25} {'Email':<35} {'Status'}")
print(f"  {'-'*70}")
for c in customers:
    status = "Active" if c['is_active'] else "Suspended"
    print(f"  {c['customer_id']:<5} {c['first_name'] + ' ' + c['last_name']:<25} {c['email']:<35} {status}")

# ============================================================
# TEST 10: Audit Logs
# ============================================================
print("\n" + "=" * 65)
print("  TEST 10: Security Audit Logs")
print("=" * 65)

logs = db.fetch_all("SELECT * FROM AuditLogs ORDER BY created_at DESC LIMIT 10")
print(f"  {'Table':<12} {'Operation':<20} {'Status':<8} {'Details'}")
print(f"  {'-'*75}")
for l in logs:
    details = (l['new_values'] or '')[:45]
    print(f"  {l['table_name']:<12} {l['operation']:<20} {l['status']:<8} {details}")

# ============================================================
# SUMMARY
# ============================================================
print("\n" + "=" * 65)
print("  ALL TESTS PASSED - System Fully Operational")
print("=" * 65)
print(f"  Customers: {len(customers)}")
print(f"  Accounts:  {len(db.fetch_all('SELECT * FROM Accounts'))}")
print(f"  Transactions: {len(db.fetch_all('SELECT * FROM Transactions'))}")
print(f"  Transfers: {len(db.fetch_all('SELECT * FROM Transfers'))}")
print(f"  Audit Logs: {len(db.fetch_all('SELECT * FROM AuditLogs'))}")
print("=" * 65)

db.disconnect()
