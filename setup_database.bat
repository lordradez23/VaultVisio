@echo off
REM ============================================================
REM Veritas Microfinance Bank - Oracle Database Setup Script
REM Run this AFTER installing Oracle XE 21c
REM ============================================================

SET ORACLE_SYS_PASS=OraclePass123
SET BANK_USER=veritas_bank
SET BANK_PASS=veritas_pass
SET DB_DSN=localhost:1521/XEPDB1
SET SQL_DIR=%~dp0sql

echo ============================================================
echo    VERITAS MICROFINANCE BANK - Database Setup
echo ============================================================
echo.

REM Step 1: Create bank user
echo [1/5] Creating database user...
echo CREATE USER %BANK_USER% IDENTIFIED BY %BANK_PASS%; GRANT CONNECT, RESOURCE, DBA TO %BANK_USER%; ALTER USER %BANK_USER% QUOTA UNLIMITED ON USERS; EXIT; | sqlplus -S sys/%ORACLE_SYS_PASS%@%DB_DSN% as sysdba

echo.
echo [2/5] Running schema.sql (Tables, Sequences, Indexes)...
sqlplus -S %BANK_USER%/%BANK_PASS%@%DB_DSN% @"%SQL_DIR%\schema.sql"

echo.
echo [3/5] Running procedures.sql (PL/SQL Stored Procedures)...
sqlplus -S %BANK_USER%/%BANK_PASS%@%DB_DSN% @"%SQL_DIR%\procedures.sql"

echo.
echo [4/5] Running triggers.sql (Audit Triggers)...
sqlplus -S %BANK_USER%/%BANK_PASS%@%DB_DSN% @"%SQL_DIR%\triggers.sql"

echo.
echo [5/5] Running seed.sql (Sample Data)...
sqlplus -S %BANK_USER%/%BANK_PASS%@%DB_DSN% @"%SQL_DIR%\seed.sql"

echo.
echo ============================================================
echo    [DONE] Database setup complete!
echo    User: %BANK_USER% / %BANK_PASS%
echo    DSN:  %DB_DSN%
echo.
echo    Now run: cd backend ^& python main.py
echo ============================================================
pause
