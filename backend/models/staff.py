"""
Veritas Microfinance Bank - BankStaff Model
Demonstrates: Inheritance, Polymorphism, Method Overloading (via defaults)
"""
from backend.models.customer import Person


class BankStaff(Person):
    """Bank employee with role-based access. Inherits from Person."""

    ROLES = ('ADMIN', 'MANAGER', 'TELLER')

    def __init__(self, staff_id: int, first_name: str, last_name: str,
                 email: str, password_hash: str, role: str = 'TELLER',
                 phone: str = None, branch_id: int = None):
        super().__init__(first_name, last_name, email, phone)
        if role not in self.ROLES:
            raise ValueError(f"Invalid role: {role}")
        self.__staff_id = staff_id
        self.__password_hash = password_hash
        self._role = role
        self._branch_id = branch_id
        self._is_active = True

    @property
    def staff_id(self) -> int:
        return self.__staff_id

    def get_role(self) -> str:
        return self._role

    def verify_password(self, password_hash: str) -> bool:
        return self.__password_hash == password_hash

    def can_approve_transfer(self) -> bool:
        """Only managers and admins can approve large transfers."""
        return self._role in ('ADMIN', 'MANAGER')

    def can_manage_users(self) -> bool:
        """Only admins can manage user accounts."""
        return self._role == 'ADMIN'
