-- ============================================================
-- VERITAS MICROFINANCE BANK - Audit Triggers
-- Automatic logging of all critical operations
-- ============================================================

-- ============================================================
-- TRIGGER: Audit Account Balance Changes
-- ============================================================
CREATE OR REPLACE TRIGGER trg_audit_account_update
AFTER UPDATE OF balance, is_active ON Accounts
FOR EACH ROW
BEGIN
    INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, old_values, new_values, status)
    VALUES (
        seq_audit_id.NEXTVAL,
        'Accounts',
        'UPDATE',
        :OLD.account_id,
        'balance=' || :OLD.balance || ', is_active=' || :OLD.is_active,
        'balance=' || :NEW.balance || ', is_active=' || :NEW.is_active,
        'SUCCESS'
    );
END;
/

-- ============================================================
-- TRIGGER: Audit New Customer Registration
-- ============================================================
CREATE OR REPLACE TRIGGER trg_audit_customer_insert
AFTER INSERT ON Customers
FOR EACH ROW
BEGIN
    INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
    VALUES (
        seq_audit_id.NEXTVAL,
        'Customers',
        'INSERT',
        :NEW.customer_id,
        'Customer registered: ' || :NEW.first_name || ' ' || :NEW.last_name || ' (' || :NEW.email || ')',
        'SUCCESS'
    );
END;
/

-- ============================================================
-- TRIGGER: Audit Customer Data Changes
-- ============================================================
CREATE OR REPLACE TRIGGER trg_audit_customer_update
AFTER UPDATE ON Customers
FOR EACH ROW
BEGIN
    INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, old_values, new_values, status)
    VALUES (
        seq_audit_id.NEXTVAL,
        'Customers',
        'UPDATE',
        :OLD.customer_id,
        'email=' || :OLD.email || ', is_active=' || :OLD.is_active,
        'email=' || :NEW.email || ', is_active=' || :NEW.is_active,
        'SUCCESS'
    );
END;
/

-- ============================================================
-- TRIGGER: Audit New Account Creation
-- ============================================================
CREATE OR REPLACE TRIGGER trg_audit_account_insert
AFTER INSERT ON Accounts
FOR EACH ROW
BEGIN
    INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
    VALUES (
        seq_audit_id.NEXTVAL,
        'Accounts',
        'INSERT',
        :NEW.account_id,
        'Account created: ' || :NEW.account_number || ' Type: ' || :NEW.account_type || ' Customer: ' || :NEW.customer_id,
        'SUCCESS'
    );
END;
/

-- ============================================================
-- TRIGGER: Audit Transfer Records
-- ============================================================
CREATE OR REPLACE TRIGGER trg_audit_transfer_insert
AFTER INSERT ON Transfers
FOR EACH ROW
BEGIN
    INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
    VALUES (
        seq_audit_id.NEXTVAL,
        'Transfers',
        'INSERT',
        :NEW.transfer_id,
        'From: ' || :NEW.from_account_id || ' To: ' || :NEW.to_account_id || ' Amount: ' || :NEW.amount || ' Status: ' || :NEW.status,
        'SUCCESS'
    );
END;
/

-- ============================================================
-- TRIGGER: Prevent Account Deletion (Security)
-- ============================================================
CREATE OR REPLACE TRIGGER trg_prevent_account_delete
BEFORE DELETE ON Accounts
FOR EACH ROW
BEGIN
    INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, old_values, status)
    VALUES (
        seq_audit_id.NEXTVAL,
        'Accounts',
        'DELETE',
        :OLD.account_id,
        'Attempted deletion blocked: ' || :OLD.account_number,
        'FAILURE'
    );
    RAISE_APPLICATION_ERROR(-20001, 'Account deletion is not permitted. Deactivate instead.');
END;
/

-- ============================================================
-- TRIGGER: Prevent Customer Deletion (Security)
-- ============================================================
CREATE OR REPLACE TRIGGER trg_prevent_customer_delete
BEFORE DELETE ON Customers
FOR EACH ROW
BEGIN
    INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, old_values, status)
    VALUES (
        seq_audit_id.NEXTVAL,
        'Customers',
        'DELETE',
        :OLD.customer_id,
        'Attempted deletion blocked: ' || :OLD.email,
        'FAILURE'
    );
    RAISE_APPLICATION_ERROR(-20002, 'Customer deletion is not permitted. Deactivate instead.');
END;
/
