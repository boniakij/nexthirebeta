#!/bin/bash

# Auth Testing Script for NextHire API
# Date: June 5, 2026
# API Base: http://localhost:8001/api/v1

set -e

API_URL="http://localhost:8001/api/v1"
TEST_EMAIL="testauth_$(date +%s)@nexthire.com"
TEST_PASSWORD="TestPass123"
RESULTS_FILE="/tmp/auth_test_results.txt"

echo "======================================"
echo "  NextHire AUTH Testing Script"
echo "======================================"
echo ""
echo "API URL: $API_URL"
echo "Test Email: $TEST_EMAIL"
echo "Results: $RESULTS_FILE"
echo ""

# Clear results file
> "$RESULTS_FILE"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Function to log results
log_test() {
    local test_name=$1
    local status=$2
    local details=$3

    TESTS_RUN=$((TESTS_RUN + 1))

    if [ "$status" = "PASS" ]; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        echo "[PASS] $test_name - $details" >> "$RESULTS_FILE"
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        echo "[FAIL] $test_name - $details" >> "$RESULTS_FILE"
    fi
}

echo "════════════════════════════════════════"
echo "1. Testing User Registration"
echo "════════════════════════════════════════"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"full_name\": \"Test Student\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"password_confirmation\": \"$TEST_PASSWORD\",
    \"role\": \"student\"
  }")

echo "Response: $REGISTER_RESPONSE" | jq . || echo "$REGISTER_RESPONSE"

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
    log_test "User Registration" "PASS" "Student registered successfully"
    # Extract user ID from response
    USER_ID=$(echo "$REGISTER_RESPONSE" | jq '.data.user.id' 2>/dev/null || echo "1")
else
    log_test "User Registration" "FAIL" "Registration failed"
fi

echo ""
echo "════════════════════════════════════════"
echo "2. Testing Login with Valid Credentials"
echo "════════════════════════════════════════"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"student1@nexthire.com\",
    \"password\": \"password123\"
  }")

echo "Response: $LOGIN_RESPONSE" | jq . || echo "$LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    log_test "Login with Valid Credentials" "PASS" "Login successful"
    # Extract tokens
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.access_token' 2>/dev/null)
    REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.refresh_token' 2>/dev/null)
    echo "Access Token: ${ACCESS_TOKEN:0:20}..."
    echo "Refresh Token: ${REFRESH_TOKEN:0:20}..."
else
    log_test "Login with Valid Credentials" "FAIL" "Login failed"
    ACCESS_TOKEN=""
    REFRESH_TOKEN=""
fi

echo ""
echo "════════════════════════════════════════"
echo "3. Testing Login with Invalid Password"
echo "════════════════════════════════════════"
echo ""

INVALID_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"student1@nexthire.com\",
    \"password\": \"wrongpassword\"
  }")

echo "Response: $INVALID_LOGIN" | jq . || echo "$INVALID_LOGIN"

if echo "$INVALID_LOGIN" | grep -q '"success":false'; then
    log_test "Login with Invalid Password" "PASS" "Correctly rejected"
else
    log_test "Login with Invalid Password" "FAIL" "Should reject invalid password"
fi

echo ""
echo "════════════════════════════════════════"
echo "4. Testing Protected Route (with token)"
echo "════════════════════════════════════════"
echo ""

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    PROTECTED_RESPONSE=$(curl -s -X GET "$API_URL/students/me" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json")

    echo "Response: $PROTECTED_RESPONSE" | jq . || echo "$PROTECTED_RESPONSE"

    if echo "$PROTECTED_RESPONSE" | grep -q '"success":true'; then
        log_test "Protected Route Access" "PASS" "Token is valid"
    else
        log_test "Protected Route Access" "FAIL" "Token validation failed"
    fi
else
    echo -e "${YELLOW}⚠️ SKIP${NC}: Protected Route Access (no valid token)"
fi

echo ""
echo "════════════════════════════════════════"
echo "5. Testing Protected Route (without token)"
echo "════════════════════════════════════════"
echo ""

NO_TOKEN_RESPONSE=$(curl -s -X GET "$API_URL/students/me" \
  -H "Content-Type: application/json")

echo "Response: $NO_TOKEN_RESPONSE" | jq . || echo "$NO_TOKEN_RESPONSE"

if echo "$NO_TOKEN_RESPONSE" | grep -q '"success":false'; then
    log_test "Protected Route Without Token" "PASS" "Correctly rejected"
else
    log_test "Protected Route Without Token" "FAIL" "Should reject requests without token"
fi

echo ""
echo "════════════════════════════════════════"
echo "6. Testing Token Refresh"
echo "════════════════════════════════════════"
echo ""

if [ -n "$REFRESH_TOKEN" ] && [ "$REFRESH_TOKEN" != "null" ]; then
    REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
      -H "Content-Type: application/json" \
      -d "{
        \"refresh_token\": \"$REFRESH_TOKEN\"
      }")

    echo "Response: $REFRESH_RESPONSE" | jq . || echo "$REFRESH_RESPONSE"

    if echo "$REFRESH_RESPONSE" | grep -q '"success":true'; then
        log_test "Token Refresh" "PASS" "Token refreshed successfully"
        NEW_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.data.access_token' 2>/dev/null)
        echo "New Access Token: ${NEW_TOKEN:0:20}..."
    else
        log_test "Token Refresh" "FAIL" "Token refresh failed"
    fi
else
    echo -e "${YELLOW}⚠️ SKIP${NC}: Token Refresh (no refresh token)"
fi

echo ""
echo "════════════════════════════════════════"
echo "7. Testing Logout"
echo "════════════════════════════════════════"
echo ""

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    LOGOUT_RESPONSE=$(curl -s -X POST "$API_URL/auth/logout" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json")

    echo "Response: $LOGOUT_RESPONSE" | jq . || echo "$LOGOUT_RESPONSE"

    if echo "$LOGOUT_RESPONSE" | grep -q '"success":true'; then
        log_test "Logout" "PASS" "Logout successful"
    else
        log_test "Logout" "FAIL" "Logout failed"
    fi
else
    echo -e "${YELLOW}⚠️ SKIP${NC}: Logout (no valid token)"
fi

echo ""
echo "════════════════════════════════════════"
echo "8. Testing Forgot Password"
echo "════════════════════════════════════════"
echo ""

FORGOT_RESPONSE=$(curl -s -X POST "$API_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"student1@nexthire.com\"
  }")

echo "Response: $FORGOT_RESPONSE" | jq . || echo "$FORGOT_RESPONSE"

if echo "$FORGOT_RESPONSE" | grep -q '"success":true'; then
    log_test "Forgot Password" "PASS" "Password reset email sent"
else
    log_test "Forgot Password" "FAIL" "Forgot password failed"
fi

echo ""
echo "════════════════════════════════════════"
echo "9. Testing Validation Errors"
echo "════════════════════════════════════════"
echo ""

VALIDATION_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"full_name\": \"Test\",
    \"email\": \"invalidemail\"
  }")

echo "Response: $VALIDATION_RESPONSE" | jq . || echo "$VALIDATION_RESPONSE"

if echo "$VALIDATION_RESPONSE" | grep -q '"success":false' && echo "$VALIDATION_RESPONSE" | grep -q '"errors"'; then
    log_test "Validation Errors" "PASS" "Validation errors returned"
else
    log_test "Validation Errors" "FAIL" "Validation should return errors"
fi

echo ""
echo "════════════════════════════════════════"
echo "  TEST SUMMARY"
echo "════════════════════════════════════════"
echo ""
echo "Total Tests Run: $TESTS_RUN"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""
echo "Detailed results saved to: $RESULTS_FILE"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    exit 1
fi
