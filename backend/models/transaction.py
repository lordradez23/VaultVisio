"""
Veritas Microfinance Bank - Transaction Model
"""
from datetime import datetime


class Transaction:
    """Records a single financial transaction."""

    TYPES = ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT')
    STATUSES = ('COMPLETED', 'PENDING', 'FAILED', 'REVERSED')

    def __init__(self, transaction_id: int, account_id: int, transaction_type: str,
                 amount: float, balance_before: float, balance_after: float,
                 description: str = "", status: str = "COMPLETED"):
        if transaction_type not in self.TYPES:
            raise ValueError(f"Invalid transaction type: {transaction_type}")
        if amount <= 0:
            raise ValueError("Transaction amount must be positive")

        self._transaction_id = transaction_id
        self._account_id = account_id
        self._transaction_type = transaction_type
        self._amount = amount
        self._balance_before = balance_before
        self._balance_after = balance_after
        self._description = description
        self._status = status
        self._transaction_date = datetime.now()

    @property
    def transaction_id(self) -> int:
        return self._transaction_id

    @property
    def amount(self) -> float:
        return self._amount

    @property
    def transaction_type(self) -> str:
        return self._transaction_type

    @property
    def status(self) -> str:
        return self._status

    def reverse(self):
        """Mark transaction as reversed."""
        self._status = 'REVERSED'

    def __str__(self):
        sign = "+" if self._transaction_type in ('DEPOSIT', 'TRANSFER_IN') else "-"
        return f"[{self._transaction_date:%Y-%m-%d %H:%M}] {self._transaction_type}: {sign}₦{self._amount:,.2f} | {self._status}"
