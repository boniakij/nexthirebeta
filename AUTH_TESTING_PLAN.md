# Authentication Modules Testing Plan

**Test Date:** June 5, 2026  
**API Base URL:** `http://localhost:8001/api/v1`  
**Status:** Ready for Testing  

---

## 📋 Testing Checklist

### Authentication Endpoints to Test

- [ ] POST `/auth/register` - User registration
- [ ] POST `/auth/login` - User login
- [ ] POST `/auth/logout` - User logout
- [ ] POST `/auth/refresh` - Token refresh
- [ ] POST `/auth/verify-email` - Email verification
- [ ] POST `/auth/forgot-password` - Password reset request
- [ ] POST `/auth/reset-password` - Password reset confirmation
- [ ] POST `/auth/google` - Google OAuth (optional)
- [ ] POST `/auth/phone-otp` - Phone OTP (optional)
- [ ] POST `/auth/verify-otp` - OTP verification (optional)

---

## 🧪 Test Case 1: User Registration

### Test: Register as Student

**Endpoint:** `POST /auth/register`

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Student",
    "email": "teststudent@nexthire.com",
    "password": "TestPass123",
    "password_confirmation": "TestPass123",
    "role": "student"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "uuid": "uuid-here",
      "email": "teststudent@nexthire.com",
      "role": "student",
      "status": "pending"
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
}
```

**Verification:**
- [ ] Status code is 201
- [ ] User created in database
- [ ] Email is unique (test duplicate)
- [ ] Password is hashed
- [ ] Status is "pending"
- [ ] Email verification sent (check logs)

---

## 🧪 Test Case 2: Email Verification

### Test: Verify Email

**Endpoint:** `POST /auth/verify-email`

**Note:** You'll need the verification token from the email or database

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification-token-from-email"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully.",
    "user": {
      "id": 1,
      "email": "teststudent@nexthire.com",
      "status": "active"
    }
  }
}
```

**Verification:**
- [ ] Status code is 200
- [ ] User status changed to "active"
- [ ] Can now login

---

## 🧪 Test Case 3: User Login

### Test: Login with Valid Credentials

**Endpoint:** `POST /auth/login`

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@nexthire.com",
    "password": "password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "uuid": "uuid-here",
      "email": "student1@nexthire.com",
      "role": "student",
      "status": "active",
      "profile_photo": null
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "refresh-token-here",
      "expires_in": 900
    }
  }
}
```

**Verification:**
- [ ] Status code is 200
- [ ] Access token returned
- [ ] Refresh token returned
- [ ] Token expires_in is 900 (15 minutes)
- [ ] User data returned
- [ ] Can use token for authenticated requests

---

## 🧪 Test Case 4: Login - Invalid Credentials

### Test: Login with Wrong Password

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@nexthire.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

**Verification:**
- [ ] Status code is 401
- [ ] No tokens returned
- [ ] Error message is clear

---

## 🧪 Test Case 5: Login - Unverified Email

### Test: Login without Email Verification

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teststudent@nexthire.com",
    "password": "TestPass123"
  }'
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Please verify your email address before logging in."
}
```

**Verification:**
- [ ] Status code is 403
- [ ] Cannot login before email verification
- [ ] Message is helpful

---

## 🧪 Test Case 6: Token Refresh

### Test: Get New Access Token

**Endpoint:** `POST /auth/refresh`

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "refresh-token-from-login"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
  }
}
```

**Verification:**
- [ ] Status code is 200
- [ ] New access token returned
- [ ] Old token still works until expired
- [ ] Refresh token unchanged

---

## 🧪 Test Case 7: Logout

### Test: Logout User

**Endpoint:** `POST /auth/logout`

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully."
  }
}
```

**Verification:**
- [ ] Status code is 200
- [ ] Tokens are invalidated
- [ ] Cannot use token for authenticated requests
- [ ] Must login again

---

## 🧪 Test Case 8: Protected Route Access

### Test: Access Protected Endpoint with Token

**Endpoint:** `GET /students/me`

**Request (WITH Token):**
```bash
curl -X GET http://localhost:8001/api/v1/students/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Test Student",
    "email": "teststudent@nexthire.com",
    ...
  }
}
```

**Request (WITHOUT Token):**
```bash
curl -X GET http://localhost:8001/api/v1/students/me \
  -H "Content-Type: application/json"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Unauthenticated. Please login."
}
```

**Verification:**
- [ ] With valid token: returns 200 with data
- [ ] Without token: returns 401
- [ ] With invalid token: returns 401
- [ ] With expired token: returns 401

---

## 🧪 Test Case 9: Forgot Password

### Test: Request Password Reset

**Endpoint:** `POST /auth/forgot-password`

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@nexthire.com"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset link sent to your email."
  }
}
```

**Verification:**
- [ ] Status code is 200
- [ ] Email sent (check logs)
- [ ] Response same for existing and non-existing emails (security)

---

## 🧪 Test Case 10: Reset Password

### Test: Confirm Password Reset

**Endpoint:** `POST /auth/reset-password`

**Note:** You need the reset token from the password reset email

**Request:**
```bash
curl -X POST http://localhost:8001/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-email",
    "email": "student1@nexthire.com",
    "password": "NewPassword123",
    "password_confirmation": "NewPassword123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully. Please login with your new password."
  }
}
```

**Verification:**
- [ ] Status code is 200
- [ ] Can login with new password
- [ ] Old password no longer works

---

## 🧪 Test Case 11: Validation Errors

### Test: Register with Invalid Data

**Request (Missing fields):**
```bash
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test",
    "email": "invalidemail"
  }'
```

**Expected Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email must be a valid email address."],
    "password": ["The password field is required."],
    "role": ["The role field is required."]
  }
}
```

**Verification:**
- [ ] Status code is 422
- [ ] All validation errors returned
- [ ] Error messages are helpful

---

## 🧪 Test Case 12: Register All Roles

### Test: Register as Different Roles

**Test 1: Register as Trainer**
```bash
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Trainer",
    "email": "testtrainer@nexthire.com",
    "password": "TestPass123",
    "password_confirmation": "TestPass123",
    "role": "trainer"
  }'
```

**Test 2: Register as Company**
```bash
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Company",
    "email": "testcompany@nexthire.com",
    "password": "TestPass123",
    "password_confirmation": "TestPass123",
    "role": "company"
  }'
```

**Verification:**
- [ ] All roles can register
- [ ] Role is correctly stored
- [ ] Each role has correct dashboard access

---

## 📊 Test Execution Summary

### Test Environment
- **API URL:** http://localhost:8001/api/v1
- **Database:** nexthire3
- **Test Data:** Using seeded accounts

### Test Accounts Available
```
student1@nexthire.com / password123 ✅
student2@nexthire.com / password123 ✅
trainer1@nexthire.com / password123 ✅
company1@nexthire.com / password123 ✅
admin@nexthire.com / admin@123 ✅
```

---

## ✅ Success Criteria

**All tests must pass:**
- [ ] Registration works for all roles
- [ ] Email verification required
- [ ] Login succeeds with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Tokens are generated and valid
- [ ] Token refresh works
- [ ] Protected routes check authentication
- [ ] Logout invalidates tokens
- [ ] Password reset works
- [ ] Validation errors are clear

---

## 🚀 Test Execution Steps

1. **Start API server:**
   ```bash
   cd /home/boni/Desktop/nexthire/api
   php artisan serve --port=8001
   ```

2. **Run each test case:**
   - Copy the curl command
   - Paste in terminal
   - Verify response matches expected

3. **Document results:**
   - ✅ Pass: Test succeeded as expected
   - ❌ Fail: Test failed, note the issue
   - ⚠️ Warn: Unexpected but acceptable

4. **Report:**
   - Total tests: 12+
   - Passed: __
   - Failed: __
   - Issues: __

---

## 📝 Notes

- Keep access tokens from successful login tests for use in protected endpoint tests
- Use different email addresses for each test to avoid conflicts
- Check API logs for debugging (`storage/logs/laravel.log`)
- Test both success and failure paths
- Verify error messages are helpful

---

**Status:** Ready for Testing  
**Created:** June 5, 2026  
**Version:** 1.0
