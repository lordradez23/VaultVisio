-- ============================================================
-- VERITAS MICROFINANCE BANK - Seed Data
-- Sample data for demonstration and testing
-- ============================================================

-- Branches
INSERT INTO Branches (branch_id, branch_name, branch_code, address, city, state, phone)
VALUES (seq_branch_id.NEXTVAL, 'Main Campus Branch', 'MCB001', 'University Main Gate', 'Ilorin', 'Kwara', '08012345678');

INSERT INTO Branches (branch_id, branch_name, branch_code, address, city, state, phone)
VALUES (seq_branch_id.NEXTVAL, 'Science Faculty Branch', 'SFB002', 'Faculty of Science Complex', 'Ilorin', 'Kwara', '08087654321');

-- Bank Staff
INSERT INTO BankStaff (staff_id, first_name, last_name, email, password_hash, role, branch_id)
VALUES (seq_staff_id.NEXTVAL, 'Adebayo', 'Okunola', 'adebayo.okunola@veritas.ng', 'hashed_admin_pass', 'ADMIN', 7000);

INSERT INTO BankStaff (staff_id, first_name, last_name, email, password_hash, role, branch_id)
VALUES (seq_staff_id.NEXTVAL, 'Fatima', 'Ibrahim', 'fatima.ibrahim@veritas.ng', 'hashed_manager_pass', 'MANAGER', 7000);

INSERT INTO BankStaff (staff_id, first_name, last_name, email, password_hash, role, branch_id)
VALUES (seq_staff_id.NEXTVAL, 'Chukwu', 'Emeka', 'chukwu.emeka@veritas.ng', 'hashed_teller_pass', 'TELLER', 7001);

-- Customers
INSERT INTO Customers (customer_id, first_name, last_name, email, phone, password_hash, date_of_birth, address, city, state, branch_id)
VALUES (seq_customer_id.NEXTVAL, 'Oluwaseun', 'Adeyemi', 'seun.adeyemi@student.edu.ng', '08033344455', 'hashed_pass_1', TO_DATE('2001-05-15', 'YYYY-MM-DD'), '12 Hostel Road', 'Ilorin', 'Kwara', 7000);

INSERT INTO Customers (customer_id, first_name, last_name, email, phone, password_hash, date_of_birth, address, city, state, branch_id)
VALUES (seq_customer_id.NEXTVAL, 'Amina', 'Bello', 'amina.bello@student.edu.ng', '07066677788', 'hashed_pass_2', TO_DATE('2000-11-22', 'YYYY-MM-DD'), '5 Staff Quarters', 'Ilorin', 'Kwara', 7000);

INSERT INTO Customers (customer_id, first_name, last_name, email, phone, password_hash, date_of_birth, address, city, state, branch_id)
VALUES (seq_customer_id.NEXTVAL, 'David', 'Okafor', 'david.okafor@staff.edu.ng', '09011122233', 'hashed_pass_3', TO_DATE('1985-03-10', 'YYYY-MM-DD'), '8 Lecturer Avenue', 'Ilorin', 'Kwara', 7001);

-- Accounts
INSERT INTO Accounts (account_id, account_number, customer_id, account_type, balance, interest_rate, min_balance)
VALUES (seq_account_id.NEXTVAL, 'VRT-SAV-0001001', 1000, 'SAVINGS', 25000.00, 0.0350, 1000.00);

INSERT INTO Accounts (account_id, account_number, customer_id, account_type, balance, interest_rate, min_balance)
VALUES (seq_account_id.NEXTVAL, 'VRT-CUR-0001002', 1000, 'CURRENT', 150000.00, 0.0000, 5000.00);

INSERT INTO Accounts (account_id, account_number, customer_id, account_type, balance, interest_rate, min_balance)
VALUES (seq_account_id.NEXTVAL, 'VRT-SAV-0002001', 1001, 'SAVINGS', 45000.00, 0.0350, 1000.00);

INSERT INTO Accounts (account_id, account_number, customer_id, account_type, balance, interest_rate, min_balance)
VALUES (seq_account_id.NEXTVAL, 'VRT-CUR-0003001', 1002, 'CURRENT', 500000.00, 0.0000, 5000.00);

COMMIT;

-- ============================================================
-- Test the procedures
-- ============================================================
-- Example: Deposit 10000 into account 2000
-- DECLARE
--     v_status VARCHAR2(20);
--     v_message VARCHAR2(255);
-- BEGIN
--     sp_deposit(2000, 10000, 'Test deposit', v_status, v_message);
--     DBMS_OUTPUT.PUT_LINE(v_status || ': ' || v_message);
-- END;
-- /
