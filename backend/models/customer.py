"""
Veritas Microfinance Bank - Base & Customer Models
Demonstrates: Abstraction, Encapsulation, Constructors
"""
from abc import ABC, abstractmethod
from datetime import datetime


class Person(ABC):
    """Abstract base class for all persons in the system."""

    def __init__(self, first_name: str, last_name: str, email: str, phone: str = None):
        self._first_name = first_name
        self._last_name = last_name
        self._email = email
        self._phone = phone
        self._created_at = datetime.now()

    @property
    def full_name(self) -> str:
        return f"{self._first_name} {self._last_name}"

    @property
    def email(self) -> str:
        return self._email

    @abstractmethod
    def get_role(self) -> str:
        pass

    def __str__(self):
        return f"{self.get_role()}: {self.full_name} ({self._email})"


class Customer(Person):
    """Bank customer with encapsulated personal data."""

    def __init__(self, customer_id: int, first_name: str, last_name: str,
                 email: str, password_hash: str, phone: str = None,
                 date_of_birth: str = None, address: str = None,
                 city: str = None, state: str = None, branch_id: int = None):
        super().__init__(first_name, last_name, email, phone)
        self.__customer_id = customer_id
        self.__password_hash = password_hash
        self._date_of_birth = date_of_birth
        self._address = address
        self._city = city
        self._state = state
        self._branch_id = branch_id
        self._is_active = True

    @property
    def customer_id(self) -> int:
        return self.__customer_id

    @property
    def is_active(self) -> bool:
        return self._is_active

    def deactivate(self):
        self._is_active = False

    def activate(self):
        self._is_active = True

    def verify_password(self, password_hash: str) -> bool:
        return self.__password_hash == password_hash

    def get_role(self) -> str:
        return "CUSTOMER"
