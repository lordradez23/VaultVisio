-- ============================================================
-- VERITAS MICROFINANCE BANK - PL/SQL Stored Procedures
-- Deposit | Withdrawal | Fund Transfer
-- ACID Compliant with Rollback Support
-- ============================================================

-- ============================================================
-- PROCEDURE: sp_deposit
-- Validates account, performs deposit, logs transaction
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_deposit (
    p_account_id    IN NUMBER,
    p_amount        IN NUMBER,
    p_description   IN VARCHAR2 DEFAULT 'Cash Deposit',
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2
) AS
    v_balance_before    NUMBER(15,2);
    v_balance_after     NUMBER(15,2);
    v_is_active         NUMBER(1);
    v_account_exists    NUMBER;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        p_status := 'FAILED';
        p_message := 'Deposit amount must be greater than zero';
        RETURN;
    END IF;

    -- Check account exists and is active
    SELECT COUNT(*), MAX(is_active), MAX(balance)
    INTO v_account_exists, v_is_active, v_balance_before
    FROM Accounts
    WHERE account_id = p_account_id;

    IF v_account_exists = 0 THEN
        p_status := 'FAILED';
        p_message := 'Account does not exist';
        -- Log failed operation
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Accounts', 'FAILED_TRANSACTION', p_account_id,
                'Deposit failed: Account not found. Amount: ' || p_amount, 'FAILURE');
        COMMIT;
        RETURN;
    END IF;

    IF v_is_active = 0 THEN
        p_status := 'FAILED';
        p_message := 'Account is suspended';
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Accounts', 'FAILED_TRANSACTION', p_account_id,
                'Deposit failed: Account suspended. Amount: ' || p_amount, 'FAILURE');
        COMMIT;
        RETURN;
    END IF;

    -- Perform deposit
    v_balance_after := v_balance_before + p_amount;

    UPDATE Accounts
    SET balance = v_balance_after
    WHERE account_id = p_account_id;

    -- Log transaction
    INSERT INTO Transactions (transaction_id, account_id, transaction_type, amount,
                             balance_before, balance_after, description, status)
    VALUES (seq_transaction_id.NEXTVAL, p_account_id, 'DEPOSIT', p_amount,
            v_balance_before, v_balance_after, p_description, 'COMPLETED');

    COMMIT;
    p_status := 'SUCCESS';
    p_message := 'Deposit of ' || p_amount || ' completed. New balance: ' || v_balance_after;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_status := 'FAILED';
        p_message := 'System error: ' || SQLERRM;
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Transactions', 'FAILED_TRANSACTION', p_account_id,
                'Deposit exception: ' || SQLERRM, 'FAILURE');
        COMMIT;
END sp_deposit;
/

-- ============================================================
-- PROCEDURE: sp_withdrawal
-- Validates account, checks balance, performs withdrawal
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_withdrawal (
    p_account_id    IN NUMBER,
    p_amount        IN NUMBER,
    p_description   IN VARCHAR2 DEFAULT 'Cash Withdrawal',
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2
) AS
    v_balance_before    NUMBER(15,2);
    v_balance_after     NUMBER(15,2);
    v_min_balance       NUMBER(15,2);
    v_is_active         NUMBER(1);
    v_account_type      VARCHAR2(20);
    v_account_exists    NUMBER;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        p_status := 'FAILED';
        p_message := 'Withdrawal amount must be greater than zero';
        RETURN;
    END IF;

    -- Check account exists, is active, get balance info
    SELECT COUNT(*) INTO v_account_exists FROM Accounts WHERE account_id = p_account_id;

    IF v_account_exists = 0 THEN
        p_status := 'FAILED';
        p_message := 'Account does not exist';
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Accounts', 'FAILED_TRANSACTION', p_account_id,
                'Withdrawal failed: Account not found. Amount: ' || p_amount, 'FAILURE');
        COMMIT;
        RETURN;
    END IF;

    SELECT balance, min_balance, is_active, account_type
    INTO v_balance_before, v_min_balance, v_is_active, v_account_type
    FROM Accounts
    WHERE account_id = p_account_id
    FOR UPDATE; -- Lock row for consistency

    IF v_is_active = 0 THEN
        p_status := 'FAILED';
        p_message := 'Account is suspended';
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Accounts', 'FAILED_TRANSACTION', p_account_id,
                'Withdrawal failed: Account suspended. Amount: ' || p_amount, 'FAILURE');
        COMMIT;
        RETURN;
    END IF;

    -- Check sufficient balance (prevent negative balance)
    v_balance_after := v_balance_before - p_amount;

    IF v_balance_after < v_min_balance THEN
        p_status := 'FAILED';
        p_message := 'Insufficient funds. Available: ' || (v_balance_before - v_min_balance);
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Transactions', 'FAILED_TRANSACTION', p_account_id,
                'Withdrawal failed: Insufficient funds. Requested: ' || p_amount || ' Available: ' || v_balance_before, 'FAILURE');
        COMMIT;
        RETURN;
    END IF;

    -- Perform withdrawal
    UPDATE Accounts
    SET balance = v_balance_after
    WHERE account_id = p_account_id;

    -- Log transaction
    INSERT INTO Transactions (transaction_id, account_id, transaction_type, amount,
                             balance_before, balance_after, description, status)
    VALUES (seq_transaction_id.NEXTVAL, p_account_id, 'WITHDRAWAL', p_amount,
            v_balance_before, v_balance_after, p_description, 'COMPLETED');

    COMMIT;
    p_status := 'SUCCESS';
    p_message := 'Withdrawal of ' || p_amount || ' completed. New balance: ' || v_balance_after;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_status := 'FAILED';
        p_message := 'System error: ' || SQLERRM;
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Transactions', 'FAILED_TRANSACTION', p_account_id,
                'Withdrawal exception: ' || SQLERRM, 'FAILURE');
        COMMIT;
END sp_withdrawal;
/

-- ============================================================
-- PROCEDURE: sp_fund_transfer
-- Atomic transfer between two accounts with full validation
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_fund_transfer (
    p_from_account_id   IN NUMBER,
    p_to_account_id     IN NUMBER,
    p_amount            IN NUMBER,
    p_description       IN VARCHAR2 DEFAULT 'Fund Transfer',
    p_initiated_by      IN NUMBER DEFAULT NULL,
    p_status            OUT VARCHAR2,
    p_message           OUT VARCHAR2
) AS
    v_from_balance      NUMBER(15,2);
    v_to_balance        NUMBER(15,2);
    v_from_min_balance  NUMBER(15,2);
    v_from_active       NUMBER(1);
    v_to_active         NUMBER(1);
    v_from_exists       NUMBER;
    v_to_exists         NUMBER;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        p_status := 'FAILED';
        p_message := 'Transfer amount must be greater than zero';
        RETURN;
    END IF;

    -- Cannot transfer to same account
    IF p_from_account_id = p_to_account_id THEN
        p_status := 'FAILED';
        p_message := 'Cannot transfer to the same account';
        RETURN;
    END IF;

    -- Validate source account
    SELECT COUNT(*) INTO v_from_exists FROM Accounts WHERE account_id = p_from_account_id;
    SELECT COUNT(*) INTO v_to_exists FROM Accounts WHERE account_id = p_to_account_id;

    IF v_from_exists = 0 OR v_to_exists = 0 THEN
        p_status := 'FAILED';
        p_message := 'One or both accounts do not exist';
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Transfers', 'FAILED_TRANSACTION', p_from_account_id,
                'Transfer failed: Invalid account(s). From: ' || p_from_account_id || ' To: ' || p_to_account_id, 'FAILURE');
        COMMIT;
        RETURN;
    END IF;

    -- Lock both accounts (ordered by ID to prevent deadlocks)
    IF p_from_account_id < p_to_account_id THEN
        SELECT balance, min_balance, is_active INTO v_from_balance, v_from_min_balance, v_from_active
        FROM Accounts WHERE account_id = p_from_account_id FOR UPDATE;

        SELECT balance, is_active INTO v_to_balance, v_to_active
        FROM Accounts WHERE account_id = p_to_account_id FOR UPDATE;
    ELSE
        SELECT balance, is_active INTO v_to_balance, v_to_active
        FROM Accounts WHERE account_id = p_to_account_id FOR UPDATE;

        SELECT balance, min_balance, is_active INTO v_from_balance, v_from_min_balance, v_from_active
        FROM Accounts WHERE account_id = p_from_account_id FOR UPDATE;
    END IF;

    -- Validate both accounts are active
    IF v_from_active = 0 OR v_to_active = 0 THEN
        p_status := 'FAILED';
        p_message := 'One or both accounts are suspended';
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Transfers', 'FAILED_TRANSACTION', p_from_account_id,
                'Transfer failed: Suspended account(s)', 'FAILURE');
        COMMIT;
        RETURN;
    END IF;

    -- Check sufficient funds
    IF (v_from_balance - p_amount) < v_from_min_balance THEN
        p_status := 'FAILED';
        p_message := 'Insufficient funds in source account';
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Transfers', 'FAILED_TRANSACTION', p_from_account_id,
                'Transfer failed: Insufficient funds. Balance: ' || v_from_balance || ' Amount: ' || p_amount, 'FAILURE');
        COMMIT;
        RETURN;
    END IF;

    -- Debit source account
    UPDATE Accounts SET balance = balance - p_amount WHERE account_id = p_from_account_id;

    -- Credit destination account
    UPDATE Accounts SET balance = balance + p_amount WHERE account_id = p_to_account_id;

    -- Log debit transaction
    INSERT INTO Transactions (transaction_id, account_id, transaction_type, amount,
                             balance_before, balance_after, description, status)
    VALUES (seq_transaction_id.NEXTVAL, p_from_account_id, 'TRANSFER_OUT', p_amount,
            v_from_balance, v_from_balance - p_amount, p_description, 'COMPLETED');

    -- Log credit transaction
    INSERT INTO Transactions (transaction_id, account_id, transaction_type, amount,
                             balance_before, balance_after, description, status)
    VALUES (seq_transaction_id.NEXTVAL, p_to_account_id, 'TRANSFER_IN', p_amount,
            v_to_balance, v_to_balance + p_amount, p_description, 'COMPLETED');

    -- Log transfer record
    INSERT INTO Transfers (transfer_id, from_account_id, to_account_id, amount,
                          description, status, initiated_by)
    VALUES (seq_transfer_id.NEXTVAL, p_from_account_id, p_to_account_id, p_amount,
            p_description, 'COMPLETED', p_initiated_by);

    COMMIT;
    p_status := 'SUCCESS';
    p_message := 'Transfer of ' || p_amount || ' completed successfully';

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_status := 'FAILED';
        p_message := 'System error: ' || SQLERRM;
        INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, new_values, status)
        VALUES (seq_audit_id.NEXTVAL, 'Transfers', 'FAILED_TRANSACTION', p_from_account_id,
                'Transfer exception: ' || SQLERRM, 'FAILURE');
        COMMIT;
END sp_fund_transfer;
/

-- ============================================================
-- PROCEDURE: sp_get_balance
-- Balance inquiry for an account
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_get_balance (
    p_account_id    IN NUMBER,
    p_balance       OUT NUMBER,
    p_status        OUT VARCHAR2
) AS
BEGIN
    SELECT balance INTO p_balance
    FROM Accounts
    WHERE account_id = p_account_id AND is_active = 1;

    p_status := 'SUCCESS';

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_balance := 0;
        p_status := 'FAILED: Account not found or inactive';
END sp_get_balance;
/

-- ============================================================
-- PROCEDURE: sp_get_transaction_history
-- Returns transaction history using a SYS_REFCURSOR
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_get_transaction_history (
    p_account_id    IN NUMBER,
    p_limit         IN NUMBER DEFAULT 50,
    p_cursor        OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT transaction_id, transaction_type, amount,
               balance_before, balance_after, description,
               status, transaction_date
        FROM Transactions
        WHERE account_id = p_account_id
        ORDER BY transaction_date DESC
        FETCH FIRST p_limit ROWS ONLY;
END sp_get_transaction_history;
/
