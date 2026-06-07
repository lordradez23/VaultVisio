-- ============================================================
-- VERITAS MICROFINANCE BANK - Oracle Database Schema
-- Enterprise Banking Application
-- Normalized to 3NF | ACID Compliant
-- ============================================================

-- ============================================================
-- 1. SEQUENCES (Auto-increment IDs)
-- ============================================================

CREATE SEQUENCE seq_customer_id START WITH 1000 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_account_id START WITH 2000 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_transaction_id START WITH 3000 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_transfer_id START WITH 4000 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_audit_id START WITH 5000 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_staff_id START WITH 6000 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_branch_id START WITH 7000 INCREMENT BY 1 NOCACHE;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- BRANCHES (Independent entity - no FK dependencies)
CREATE TABLE Branches (
    branch_id       NUMBER PRIMARY KEY,
    branch_name     VARCHAR2(100) NOT NULL,
    branch_code     VARCHAR2(10) UNIQUE NOT NULL,
    address         VARCHAR2(255),
    city            VARCHAR2(50),
    state           VARCHAR2(50),
    phone           VARCHAR2(20),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BANK STAFF (References Branches)
CREATE TABLE BankStaff (
    staff_id        NUMBER PRIMARY KEY,
    first_name      VARCHAR2(50) NOT NULL,
    last_name       VARCHAR2(50) NOT NULL,
    email           VARCHAR2(100) UNIQUE NOT NULL,
    password_hash   VARCHAR2(255) NOT NULL,
    role            VARCHAR2(20) DEFAULT 'TELLER' CHECK (role IN ('ADMIN', 'MANAGER', 'TELLER')),
    branch_id       NUMBER,
    is_active       NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    hire_date       DATE DEFAULT SYSDATE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_staff_branch FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)
);

-- CUSTOMERS (References Branches for home branch)
CREATE TABLE Customers (
    customer_id     NUMBER PRIMARY KEY,
    first_name      VARCHAR2(50) NOT NULL,
    last_name       VARCHAR2(50) NOT NULL,
    email           VARCHAR2(100) UNIQUE NOT NULL,
    phone           VARCHAR2(20),
    password_hash   VARCHAR2(255) NOT NULL,
    date_of_birth   DATE,
    address         VARCHAR2(255),
    city            VARCHAR2(50),
    state           VARCHAR2(50),
    branch_id       NUMBER,
    is_active       NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_branch FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)
);

-- ACCOUNTS (References Customers)
CREATE TABLE Accounts (
    account_id      NUMBER PRIMARY KEY,
    account_number  VARCHAR2(20) UNIQUE NOT NULL,
    customer_id     NUMBER NOT NULL,
    account_type    VARCHAR2(20) NOT NULL CHECK (account_type IN ('SAVINGS', 'CURRENT')),
    balance         NUMBER(15,2) DEFAULT 0.00 CHECK (balance >= 0),
    interest_rate   NUMBER(5,4) DEFAULT 0.0000,
    min_balance     NUMBER(15,2) DEFAULT 0.00,
    is_active       NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_customer FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- TRANSACTIONS (References Accounts)
CREATE TABLE Transactions (
    transaction_id      NUMBER PRIMARY KEY,
    account_id          NUMBER NOT NULL,
    transaction_type    VARCHAR2(20) NOT NULL CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT')),
    amount              NUMBER(15,2) NOT NULL CHECK (amount > 0),
    balance_before      NUMBER(15,2) NOT NULL,
    balance_after       NUMBER(15,2) NOT NULL,
    description         VARCHAR2(255),
    status              VARCHAR2(20) DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED', 'REVERSED')),
    transaction_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_account FOREIGN KEY (account_id) REFERENCES Accounts(account_id)
);

-- TRANSFERS (References Accounts for source and destination)
CREATE TABLE Transfers (
    transfer_id         NUMBER PRIMARY KEY,
    from_account_id     NUMBER NOT NULL,
    to_account_id       NUMBER NOT NULL,
    amount              NUMBER(15,2) NOT NULL CHECK (amount > 0),
    description         VARCHAR2(255),
    status              VARCHAR2(20) DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED', 'REVERSED')),
    initiated_by        NUMBER,
    transfer_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transfer_from FOREIGN KEY (from_account_id) REFERENCES Accounts(account_id),
    CONSTRAINT fk_transfer_to FOREIGN KEY (to_account_id) REFERENCES Accounts(account_id),
    CONSTRAINT fk_transfer_staff FOREIGN KEY (initiated_by) REFERENCES BankStaff(staff_id),
    CONSTRAINT chk_diff_accounts CHECK (from_account_id != to_account_id)
);

-- AUDIT LOGS (Security & tracking)
CREATE TABLE AuditLogs (
    audit_id        NUMBER PRIMARY KEY,
    table_name      VARCHAR2(50) NOT NULL,
    operation       VARCHAR2(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'FAILED_TRANSACTION')),
    record_id       NUMBER,
    old_values      CLOB,
    new_values      CLOB,
    performed_by    VARCHAR2(100),
    ip_address      VARCHAR2(50),
    status          VARCHAR2(20) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILURE')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES (Query Optimization)
-- ============================================================

CREATE INDEX idx_customer_email ON Customers(email);
CREATE INDEX idx_customer_branch ON Customers(branch_id);
CREATE INDEX idx_account_customer ON Accounts(customer_id);
CREATE INDEX idx_account_number ON Accounts(account_number);
CREATE INDEX idx_account_type ON Accounts(account_type);
CREATE INDEX idx_transaction_account ON Transactions(account_id);
CREATE INDEX idx_transaction_date ON Transactions(transaction_date);
CREATE INDEX idx_transaction_type ON Transactions(transaction_type);
CREATE INDEX idx_transfer_from ON Transfers(from_account_id);
CREATE INDEX idx_transfer_to ON Transfers(to_account_id);
CREATE INDEX idx_transfer_date ON Transfers(transfer_date);
CREATE INDEX idx_audit_table ON AuditLogs(table_name);
CREATE INDEX idx_audit_operation ON AuditLogs(operation);
CREATE INDEX idx_audit_date ON AuditLogs(created_at);
CREATE INDEX idx_staff_email ON BankStaff(email);

-- ============================================================
-- 4. COMMENTS (Documentation)
-- ============================================================

COMMENT ON TABLE Branches IS 'Bank branch locations';
COMMENT ON TABLE BankStaff IS 'Bank employees with role-based access';
COMMENT ON TABLE Customers IS 'Registered bank customers';
COMMENT ON TABLE Accounts IS 'Customer bank accounts (Savings/Current)';
COMMENT ON TABLE Transactions IS 'Individual account transactions';
COMMENT ON TABLE Transfers IS 'Fund transfers between accounts';
COMMENT ON TABLE AuditLogs IS 'Security audit trail for all operations';
