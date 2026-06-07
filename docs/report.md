# Veritas Microfinance Bank - Documentation Report

## Enterprise Banking Application Using OOP and Oracle Database
### CSC 302 | Object-Oriented Programming | End of Session Project

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [OOP Design & Architecture](#3-oop-design--architecture)
4. [ER Diagram](#4-er-diagram)
5. [Database Normalization](#5-database-normalization)
6. [Database Implementation](#6-database-implementation)
7. [PL/SQL Procedures](#7-plsql-procedures)
8. [Security & Audit](#8-security--audit)
9. [Query Optimization](#9-query-optimization)
10. [Banking Functionalities](#10-banking-functionalities)
11. [How to Run](#11-how-to-run)

---

## 1. System Overview

Veritas Microfinance Bank's digital banking system serves students and staff within the university community. The system provides:

- Secure customer registration and authentication
- Savings and Current account management
- Deposit, Withdrawal, and Fund Transfer operations
- Real-time balance inquiry and transaction history
- Comprehensive audit trailing
- Role-based access control (Admin, Manager, Teller)

---

## 2. Technology Stack

| Component | Technology |
|-----------|-----------|
| Programming Language | Python 3.10+ |
| Database | Oracle Database (XE / 21c) |
| DB Connector | oracledb 2.0+ |
| IDE/Tool | Oracle SQL Developer |
| Frontend (Bonus) | Next.js 16, React 19, Tailwind CSS 4 |

---

## 3. OOP Design & Architecture

### 3.1 Class Hierarchy

```
Person (Abstract)
├── Customer
└── BankStaff

Account (Abstract)
├── SavingsAccount
└── CurrentAccount

Transaction
TransferService
AuditLogger
DatabaseManager
```

### 3.2 OOP Principles Demonstrated

| Principle | Implementation |
|-----------|---------------|
| **Encapsulation** | Private attributes (`__balance`, `__password_hash`, `__customer_id`) with controlled access via properties |
| **Inheritance** | `Customer` and `BankStaff` inherit from `Person`; `SavingsAccount` and `CurrentAccount` inherit from `Account` |
| **Polymorphism** | `get_role()` returns different values per subclass; `withdraw()` behaves differently in Savings vs Current accounts |
| **Abstraction** | `Person` and `Account` are abstract classes with `@abstractmethod` decorators |
| **Constructors** | All classes use `__init__` with parameterized construction and `super()` delegation |
| **Method Overriding** | `SavingsAccount.withdraw()` adds 80% limit; `CurrentAccount.withdraw()` adds overdraft logic |
| **Exception Handling** | `ValueError`, `PermissionError`, `ConnectionError` raised and caught throughout |
| **Database Integration** | `DatabaseManager` class connects Python to Oracle via `oracledb` |

### 3.3 Design Patterns Used

- **Composition**: `TransferService` composes `AuditLogger`
- **Context Manager**: `DatabaseManager` supports `with` statement
- **MVC-like Separation**: Models → Services → Database → Main (Controller)

---

## 4. ER Diagram

### 4.1 Entity-Relationship Diagram (Textual Representation)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Branches   │       │  BankStaff   │       │  Customers   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ *branch_id   │──┐    │ *staff_id    │       │ *customer_id │
│  branch_name │  │    │  first_name  │       │  first_name  │
│  branch_code │  ├───<│  branch_id   │       │  last_name   │
│  address     │  │    │  role        │       │  email       │
│  city        │  │    │  email       │       │  password    │
│  state       │  │    └──────────────┘       │  branch_id   │>───┐
│  phone       │  │                           └──────┬───────┘    │
└──────────────┘  │                                  │            │
                  └──────────────────────────────────┼────────────┘
                                                     │ 1
                                                     │
                                                     │ M
                                              ┌──────┴───────┐
                                              │   Accounts   │
                                              ├──────────────┤
                                              │ *account_id  │
                                              │  account_num │
                                              │  customer_id │
                                              │  account_type│
                                              │  balance     │
                                              └──────┬───────┘
                                                     │ 1
                                          ┌──────────┼──────────┐
                                          │ M        │          │ M
                                   ┌──────┴──────┐   │   ┌──────┴──────┐
                                   │Transactions │   │   │  Transfers  │
                                   ├─────────────┤   │   ├─────────────┤
                                   │*transaction │   │   │*transfer_id │
                                   │ _id         │   │   │ from_acc_id │
                                   │ account_id  │   │   │ to_acc_id   │
                                   │ type        │   │   │ amount      │
                                   │ amount      │   │   │ status      │
                                   │ balance_b4  │   │   │ initiated_by│
                                   │ balance_aft │   │   └─────────────┘
                                   └─────────────┘   │
                                                     │
                                              ┌──────┴───────┐
                                              │  AuditLogs   │
                                              ├──────────────┤
                                              │ *audit_id    │
                                              │  table_name  │
                                              │  operation   │
                                              │  record_id   │
                                              │  old_values  │
                                              │  new_values  │
                                              │  performed_by│
                                              └──────────────┘
```

### 4.2 Primary Keys

| Table | Primary Key |
|-------|-------------|
| Branches | branch_id |
| BankStaff | staff_id |
| Customers | customer_id |
| Accounts | account_id |
| Transactions | transaction_id |
| Transfers | transfer_id |
| AuditLogs | audit_id |

### 4.3 Foreign Keys

| Table | Foreign Key | References |
|-------|------------|------------|
| BankStaff | branch_id | Branches(branch_id) |
| Customers | branch_id | Branches(branch_id) |
| Accounts | customer_id | Customers(customer_id) |
| Transactions | account_id | Accounts(account_id) |
| Transfers | from_account_id | Accounts(account_id) |
| Transfers | to_account_id | Accounts(account_id) |
| Transfers | initiated_by | BankStaff(staff_id) |

### 4.4 Cardinalities

| Relationship | Cardinality |
|-------------|-------------|
| Branch → Staff | 1:M (One branch has many staff) |
| Branch → Customers | 1:M (One branch has many customers) |
| Customer → Accounts | 1:M (One customer can have multiple accounts) |
| Account → Transactions | 1:M (One account has many transactions) |
| Account → Transfers (as source) | 1:M |
| Account → Transfers (as destination) | 1:M |
| Staff → Transfers (initiator) | 1:M |

---

## 5. Database Normalization

### 5.1 First Normal Form (1NF) ✓

All tables satisfy 1NF:
- Every column contains atomic (indivisible) values
- No repeating groups or arrays
- Each row is unique (identified by primary key)

**Example**: Customer address is split into `address`, `city`, `state` — not stored as a single compound field.

### 5.2 Second Normal Form (2NF) ✓

All tables satisfy 2NF:
- Already in 1NF
- No partial dependencies — every non-key attribute depends on the **entire** primary key
- All tables use single-column surrogate primary keys (sequences), so partial dependency is impossible

**Example**: In `Accounts`, `balance` depends entirely on `account_id`, not on any subset of a composite key.

### 5.3 Third Normal Form (3NF) ✓

All tables satisfy 3NF:
- Already in 2NF
- No transitive dependencies — non-key attributes do not depend on other non-key attributes

**Example**: `Customers.city` does not determine `Customers.state` in this context (university community in one state). Branch location details are stored in the `Branches` table, not redundantly in Customers.

**Before Normalization (Violation Example)**:
```
Accounts(account_id, account_number, customer_name, customer_email, balance)
         ↑ customer_name depends on customer_email, not account_id → transitive dependency
```

**After Normalization (Our Design)**:
```
Accounts(account_id, account_number, customer_id, balance)
Customers(customer_id, first_name, last_name, email)
         ↑ Separated into own table, linked by FK
```

---

## 6. Database Implementation

### 6.1 Tables Created
- `Branches` — 8 columns, UNIQUE constraint on branch_code
- `BankStaff` — 10 columns, CHECK constraint on role
- `Customers` — 13 columns, UNIQUE constraint on email
- `Accounts` — 9 columns, CHECK constraints on account_type, balance >= 0
- `Transactions` — 9 columns, CHECK on type and status
- `Transfers` — 8 columns, CHECK that from ≠ to account
- `AuditLogs` — 10 columns, CHECK on operation type

### 6.2 Sequences
7 sequences (one per table) starting at offset values to avoid ID collision.

### 6.3 Indexes (16 total)
Optimized for common query patterns: email lookups, account number searches, transaction date filtering, audit searches.

### 6.4 Constraints
- PRIMARY KEY on every table
- FOREIGN KEY referential integrity
- CHECK constraints for valid values
- UNIQUE on email addresses and account numbers
- NOT NULL on critical fields

---

## 7. PL/SQL Procedures

### 7.1 sp_deposit
- Validates account exists and is active
- Prevents zero/negative deposits
- Updates balance atomically
- Logs transaction record
- Commits on success, rolls back on failure

### 7.2 sp_withdrawal
- Validates account exists and is active
- Uses `FOR UPDATE` row lock for consistency
- Checks balance against minimum balance (prevents negative)
- Logs failed attempts to AuditLogs
- Full rollback on exception

### 7.3 sp_fund_transfer
- Validates both accounts exist and are active
- Locks accounts in ID order (deadlock prevention)
- Checks sufficient funds in source
- Debits source, credits destination atomically
- Creates transaction records for both sides
- Creates transfer record
- Full rollback on any failure

### 7.4 sp_get_balance
- Simple balance inquiry with active account check

### 7.5 sp_get_transaction_history
- Returns cursor with paginated results (default 50 rows)

---

## 8. Security & Audit

### 8.1 Triggers (7 total)

| Trigger | Purpose |
|---------|---------|
| trg_audit_account_update | Logs every balance/status change |
| trg_audit_customer_insert | Logs new registrations |
| trg_audit_customer_update | Logs customer data modifications |
| trg_audit_account_insert | Logs new account creation |
| trg_audit_transfer_insert | Logs all transfers |
| trg_prevent_account_delete | BLOCKS physical deletion of accounts |
| trg_prevent_customer_delete | BLOCKS physical deletion of customers |

### 8.2 What Is Tracked

- All transactions (deposit, withdrawal, transfer)
- Account balance changes (before/after values)
- Customer registration and profile updates
- Failed login attempts
- Failed transactions (insufficient funds, invalid accounts)
- Attempted record deletions (blocked and logged)

### 8.3 Security Measures

- Password hashing (SHA-256)
- Soft deletes only (is_active flag instead of DELETE)
- Role-based access (ADMIN, MANAGER, TELLER)
- Row-level locking during financial operations
- Input validation at application and database level

---

## 9. Query Optimization

### 9.1 Indexes

| Index | Optimizes |
|-------|-----------|
| idx_customer_email | Login lookups (O(log n) vs O(n)) |
| idx_account_customer | Account retrieval by customer |
| idx_account_number | Transfer recipient lookup |
| idx_transaction_date | Transaction history (date-sorted) |
| idx_transaction_account | History filtering by account |
| idx_transfer_date | Transfer audit queries |
| idx_audit_date | Audit log chronological queries |

### 9.2 Optimized Joins

Transaction history query uses indexed `account_id` for direct access without full table scan:
```sql
SELECT ... FROM Transactions 
WHERE account_id = :1 
ORDER BY transaction_date DESC 
FETCH FIRST 10 ROWS ONLY;
```

### 9.3 Design Decisions for Performance

- **Sequences over MAX+1**: Avoids table locks during ID generation
- **Denormalized balance**: Balance stored in Accounts (not recalculated from Transactions) for O(1) inquiry
- **FOR UPDATE locking**: Row-level, not table-level — allows concurrent operations on different accounts
- **FETCH FIRST N ROWS**: Limits result sets instead of fetching all history
- **Ordered locking in transfers**: Prevents deadlocks by always locking lower account_id first

### 9.4 Performance Impact

| Without Optimization | With Optimization |
|---------------------|-------------------|
| Full table scan on login | Index seek on email → O(log n) |
| Lock entire Accounts table on transfer | Row-level lock → concurrent transfers |
| Recalculate balance from all transactions | Direct balance read → O(1) |
| Fetch all transaction history | Paginated (FETCH FIRST) → bounded I/O |

---

## 10. Banking Functionalities

| Feature | Status |
|---------|--------|
| Customer Registration | ✓ |
| Account Creation (Savings/Current) | ✓ |
| Deposit | ✓ |
| Withdrawal | ✓ |
| Money Transfer | ✓ |
| Balance Inquiry | ✓ |
| Transaction History | ✓ |
| Login System | ✓ |
| Admin Dashboard (Bonus) | ✓ (via Next.js frontend) |

---

## 11. How to Run

### Prerequisites
- Python 3.10+
- Oracle Database (XE 21c recommended)
- Oracle SQL Developer (for running SQL scripts)

### Step 1: Database Setup
```sql
-- In Oracle SQL Developer, run in order:
@sql/schema.sql
@sql/procedures.sql
@sql/triggers.sql
@sql/seed.sql
```

### Step 2: Python Application
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Step 3: Configure Connection
Edit `backend/main.py` and update:
```python
DB_USER = "your_oracle_user"
DB_PASSWORD = "your_oracle_password"
DB_DSN = "localhost:1521/XEPDB1"
```

---

## Project Structure

```
Bankapp_sys/
├── backend/
│   ├── models/
│   │   ├── customer.py      # Person (Abstract), Customer
│   │   ├── account.py       # Account (Abstract), SavingsAccount, CurrentAccount
│   │   ├── transaction.py   # Transaction
│   │   └── staff.py         # BankStaff
│   ├── services/
│   │   ├── transfer_service.py  # TransferService
│   │   └── audit_logger.py     # AuditLogger
│   ├── database/
│   │   └── db_manager.py       # DatabaseManager
│   ├── main.py                 # CLI Entry Point
│   └── requirements.txt
├── sql/
│   ├── schema.sql          # Tables, Sequences, Indexes, Constraints
│   ├── procedures.sql      # PL/SQL Stored Procedures
│   ├── triggers.sql        # Audit Triggers
│   └── seed.sql            # Sample Data
├── docs/
│   └── report.md           # This documentation
└── src/                    # Next.js Frontend (Bonus)
```

---

## Submitted By

- **Name**: [Student Name]
- **Matric No**: [Matric Number]
- **Course**: CSC 302 - Object-Oriented Programming
- **Session**: [Academic Session]

---

*© 2025 Veritas Microfinance Bank Digital Systems*
