"""
Veritas Microfinance Bank - Transfer Service
Demonstrates: Composition, Exception Handling, Transaction Processing
"""
from backend.models.account import Account
from backend.models.transaction import Transaction


class TransferService:
    """Handles fund transfers between accounts with validation."""

    def __init__(self, audit_logger=None):
        self._audit_logger = audit_logger

    def transfer(self, from_account: Account, to_account: Account,
                 amount: float, description: str = "Fund Transfer") -> dict:
        """
        Execute atomic fund transfer between two accounts.
        Returns dict with status and transaction details.
        """
        # Validation
        if from_account.account_id == to_account.account_id:
            raise ValueError("Cannot transfer to the same account")
        if amount <= 0:
            raise ValueError("Transfer amount must be positive")
        if not from_account.is_active or not to_account.is_active:
            raise PermissionError("One or both accounts are suspended")

        try:
            # Debit source
            debit_result = from_account.withdraw(amount)
            # Credit destination
            credit_result = to_account.deposit(amount)

            # Log audit
            if self._audit_logger:
                self._audit_logger.log_transfer(
                    from_account.account_id, to_account.account_id, amount, "SUCCESS"
                )

            return {
                "status": "SUCCESS",
                "amount": amount,
                "from_balance": debit_result["balance_after"],
                "to_balance": credit_result["balance_after"],
                "description": description
            }

        except (ValueError, PermissionError) as e:
            # Log failed transfer
            if self._audit_logger:
                self._audit_logger.log_transfer(
                    from_account.account_id, to_account.account_id, amount, "FAILED", str(e)
                )
            raise
