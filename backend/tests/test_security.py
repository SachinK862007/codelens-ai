# backend/tests/test_security.py
"""Tests for password hashing utilities and security manager"""

from backend.config.security import security_manager
from backend.utils.security_utils import security_helper


def test_password_hash_and_verify():
    pw = "mysecret"
    hashed = security_manager.get_password_hash(pw)
    assert isinstance(hashed, str) and hashed.startswith("$2b$")
    assert security_manager.verify_password(pw, hashed)
    assert not security_manager.verify_password("wrongpw", hashed)


def test_password_length_truncation():
    # manually construct a password longer than bcrypt's 72-byte limit
    long_pw = "a" * 100
    hashed = security_manager.get_password_hash(long_pw)
    # bcrypt truncates to first 72 bytes; verify both full and truncated
    assert security_manager.verify_password(long_pw, hashed)
    assert security_manager.verify_password(long_pw[:72], hashed)


def test_security_helper_matches_manager():
    # ensure the convenience helper and security manager are consistent
    pw = "anotherpw"
    h1 = security_helper.generate_password_hash(pw)
    h2 = security_manager.get_password_hash(pw)
    # both should validate correctly (they use bcrypt under the hood)
    assert security_helper.verify_password_hash(pw, h1)
    assert security_manager.verify_password(pw, h1)
    assert security_helper.verify_password_hash(pw, h2)
    assert security_manager.verify_password(pw, h2)
