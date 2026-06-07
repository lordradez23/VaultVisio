"""
Veritas Microfinance Bank - Audit Logger
Demonstrates: Encapsulation, File/Database Integration, Exception Handling
"""
from datetime import datetime


class AuditLogger:
    """Logs all banking operations for security and compliance."""

    def __init__(self, db_manager=None):
        self._db_manager = db_manager
        self._logs = []  # In-memory fallback

    def log(self, table_name: str, operation: str, record_id: int,
            details: str, status: str = "SUCCESS", performed_by: str = None):
        """Log an operation to database and/or memory."""
        entry = {
            "table_name": table_name,
            "operation": operation,
            "record_id": record_id,
            "details": details,
            "status": status,
            "performed_by": performed_by,
            "timestamp": datetime.now()
        }
        self._logs.append(entry)

        # Persist to Oracle if connected
        if self._db_manager and self._db_manager.is_connected():
            self._db_manager.execute(
                """INSERT INTO AuditLogs (audit_id, table_name, operation, record_id, 
                   new_values, performed_by, status)
                   VALUES (seq_audit_id.NEXTVAL, :1, :2, :3, :4, :5, :6)""",
                (table_name, operation, record_id, details, performed_by, status)
            )

    def log_login(self, email: str, success: bool):
        op = "LOGIN" if success else "FAILED_LOGIN"
        self.log("Customers", op, 0, f"Login attempt: {email}", "SUCCESS" if success else "FAILURE", email)

    def log_transfer(self, from_id: int, to_id: int, amount: float, status: str, reason: str = ""):
        details = f"From: {from_id} To: {to_id} Amount: {amount}"
        if reason:
            details += f" Reason: {reason}"
        self.log("Transfers", "INSERT" if status == "SUCCESS" else "FAILED_TRANSACTION",
                 from_id, details, status)

    def log_transaction(self, account_id: int, txn_type: str, amount: float, status: str):
        self.log("Transactions", txn_type, account_id,
                 f"{txn_type}: ₦{amount:,.2f}", status)

    def get_recent_logs(self, limit: int = 50) -> list:
        """Return most recent audit entries."""
        return self._logs[-limit:][::-1]
