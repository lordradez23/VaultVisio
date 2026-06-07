"""
Veritas Microfinance Bank - Account Models
Demonstrates: Inheritance, Polymorphism, Method Overriding, Encapsulation
"""
from abc import ABC, abstractmethod
from datetime import datetime


class Account(ABC):
    """Abstract base account class."""

    def __init__(self, account_id: int, account_number: str, customer_id: int,
                 balance: float = 0.0, min_balance: float = 0.0):
        self._account_id = account_id
        self._account_number = account_number
        self._customer_id = customer_id
        self.__balance = balance  # Private - encapsulation
        self._min_balance = min_balance
        self._is_active = True
        self._created_at = datetime.now()

    @property
    def account_id(self) -> int:
        return self._account_id

    @property
    def account_number(self) -> str:
        return self._account_number

    @property
    def customer_id(self) -> int:
        return self._customer_id

    @property
    def balance(self) -> float:
        return self.__balance

    @property
    def is_active(self) -> bool:
        return self._is_active

    @abstractmethod
    def get_account_type(self) -> str:
        pass

    @abstractmethod
    def calculate_interest(self) -> float:
        pass

    def deposit(self, amount: float) -> dict:
        """Deposit funds into account."""
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        if not self._is_active:
            raise PermissionError("Account is suspended")
        balance_before = self.__balance
        self.__balance += amount
        return {"balance_before": balance_before, "balance_after": self.__balance}

    def withdraw(self, amount: float) -> dict:
        """Withdraw funds from account."""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if not self._is_active:
            raise PermissionError("Account is suspended")
        if (self.__balance - amount) < self._min_balance:
            raise ValueError(f"Insufficient funds. Available: {self.__balance - self._min_balance}")
        balance_before = self.__balance
        self.__balance -= amount
        return {"balance_before": balance_before, "balance_after": self.__balance}

    def suspend(self):
        self._is_active = False

    def reactivate(self):
        self._is_active = True

    def __str__(self):
        return f"{self.get_account_type()} [{self._account_number}] Balance: ₦{self.__balance:,.2f}"


class SavingsAccount(Account):
    """Savings account with interest accrual. Inherits from Account."""

    INTEREST_RATE = 0.035  # 3.5% annual
    DEFAULT_MIN_BALANCE = 1000.0

    def __init__(self, account_id: int, account_number: str, customer_id: int,
                 balance: float = 0.0, interest_rate: float = None):
        super().__init__(account_id, account_number, customer_id, balance, self.DEFAULT_MIN_BALANCE)
        self._interest_rate = interest_rate or self.INTEREST_RATE

    def get_account_type(self) -> str:
        return "SAVINGS"

    def calculate_interest(self) -> float:
        """Calculate monthly interest on current balance."""
        return self.balance * (self._interest_rate / 12)

    def withdraw(self, amount: float) -> dict:
        """Override: Savings accounts have stricter withdrawal limits."""
        if amount > self.balance * 0.8:
            raise ValueError("Cannot withdraw more than 80% of savings balance in one transaction")
        return super().withdraw(amount)


class CurrentAccount(Account):
    """Current account with overdraft facility. Inherits from Account."""

    DEFAULT_MIN_BALANCE = 5000.0

    def __init__(self, account_id: int, account_number: str, customer_id: int,
                 balance: float = 0.0, overdraft_limit: float = 0.0):
        super().__init__(account_id, account_number, customer_id, balance, self.DEFAULT_MIN_BALANCE)
        self._overdraft_limit = overdraft_limit

    def get_account_type(self) -> str:
        return "CURRENT"

    def calculate_interest(self) -> float:
        """Current accounts earn no interest."""
        return 0.0

    def withdraw(self, amount: float) -> dict:
        """Override: Current accounts allow overdraft up to limit."""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if not self._is_active:
            raise PermissionError("Account is suspended")
        effective_min = self._min_balance - self._overdraft_limit
        if (self.balance - amount) < effective_min:
            raise ValueError(f"Exceeds overdraft limit. Max withdrawal: {self.balance - effective_min}")
        balance_before = self.balance
        # Call parent's deposit with negative to bypass parent's min_balance check
        # Actually use the Account's internal mechanism
        return super().withdraw(amount)
