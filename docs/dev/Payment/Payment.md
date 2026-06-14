# NextHire Booking, Payment, Commission & Trainer Earning API Flow

## Business Logic

Student books a trainer package and completes payment.
The platform receives the full payment first.
The money is kept as platform-held balance until the session is completed and refund window is over.
After the session is completed, the platform calculates commission.
Trainer receives the net amount after platform commission deduction.
Trainer can later withdraw available balance.

Example:

Package Price: BDT 1,000
Platform Commission: 20%
Platform Commission Amount: BDT 200
Trainer Earning: BDT 800

---

# 1. Student Booking Flow

## Step 1: Student views trainer packages

```http
GET /trainers/{trainer_id}
Auth: Student/Public
```

Response:

```json
{
  "success": true,
  "data": {
    "trainer_id": 15,
    "name": "Rahim Uddin",
    "rating": 4.8,
    "packages": [
      {
        "id": 22,
        "title": "HR Mock Interview",
        "duration_minutes": 45,
        "price": 1000,
        "currency": "BDT",
        "status": "active"
      }
    ]
  }
}
```

---

## Step 2: Student checks trainer available slots

```http
GET /trainers/{trainer_id}/availability
Auth: Student
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "slot_id": 501,
      "trainer_id": 15,
      "date": "2026-06-30",
      "start_time": "19:00",
      "end_time": "19:45",
      "status": "available"
    }
  ]
}
```

---

## Step 3: Student creates booking

```http
POST /bookings
Auth: Student
```

Request:

```json
{
  "trainer_id": 15,
  "package_id": 22,
  "slot_id": 501
}
```

Response:

```json
{
  "success": true,
  "message": "Booking created. Please complete payment.",
  "data": {
    "booking_id": 7001,
    "interview_id": 9001,
    "payment_status": "pending",
    "booking_status": "pending_payment",
    "amount": 1000,
    "currency": "BDT"
  }
}
```

System action:

```text
- Create booking with status: pending_payment
- Reserve selected slot temporarily
- Create interview with status: pending_payment
- Create payment record with status: pending
```

---

## Step 4: Student initiates payment

```http
POST /payments/initiate
Auth: Student
```

Request:

```json
{
  "booking_id": 7001,
  "payment_method": "bkash"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "payment_id": 8101,
    "gateway": "bkash",
    "gateway_url": "https://payment-gateway-url.com/pay/8101",
    "amount": 1000,
    "currency": "BDT"
  }
}
```

System action:

```text
- Send student to payment gateway
- Payment status remains pending until callback success
```

---

# 2. Payment Gateway Callback Flow

## Step 5: Payment gateway sends success callback

```http
POST /payments/bkash/callback
Auth: None / Webhook
```

Request:

```json
{
  "payment_id": 8101,
  "gateway_txn_id": "BKASH-TXN-123456",
  "status": "completed",
  "amount": 1000,
  "currency": "BDT"
}
```

Response:

```json
{
  "success": true,
  "message": "Payment confirmed successfully."
}
```

System action:

```text
- Update payment status: completed
- Update booking status: confirmed
- Update interview status: scheduled
- Confirm trainer slot as booked
- Generate meeting link
- Send notification to student
- Send notification to trainer
- Create platform holding ledger entry
```

---

## Platform holding ledger entry

```json
{
  "payment_id": 8101,
  "booking_id": 7001,
  "interview_id": 9001,
  "trainer_id": 15,
  "student_id": 44,
  "gross_amount": 1000,
  "currency": "BDT",
  "status": "platform_held"
}
```

Important:

```text
Trainer does not receive money immediately after payment.
Money is held by platform until session is completed.
```

---

# 3. Trainer Session Flow

## Step 6: Trainer views upcoming sessions

```http
GET /trainers/me/sessions
Auth: Trainer
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "interview_id": 9001,
      "booking_id": 7001,
      "student_name": "Tanvir Ahmed",
      "package_title": "HR Mock Interview",
      "scheduled_at": "2026-06-30T19:00:00Z",
      "duration_minutes": 45,
      "status": "scheduled",
      "payment_status": "completed"
    }
  ]
}
```

---

## Step 7: Student and trainer join session

```http
POST /interviews/{interview_id}/join
Auth: Student/Trainer
```

Response:

```json
{
  "success": true,
  "data": {
    "interview_id": 9001,
    "meeting_link": "https://video.mnexthire.com/room/9001",
    "agora_token": "agora_token_here",
    "status": "in_progress"
  }
}
```

System action:

```text
- Mark participant as joined
- If session starts, update interview status: in_progress
```

---

## Step 8: Trainer completes session

```http
POST /interviews/{interview_id}/complete
Auth: Trainer
```

Request:

```json
{
  "completed_note": "Session completed successfully."
}
```

Response:

```json
{
  "success": true,
  "message": "Session marked as completed.",
  "data": {
    "interview_id": 9001,
    "status": "completed",
    "completed_at": "2026-06-30T19:50:00Z"
  }
}
```

System action:

```text
- Update interview status: completed
- Update booking status: completed
- Trigger commission calculation
- Move trainer earning to pending balance
- Start refund window check if applicable
```

---

# 4. Commission Calculation Flow

## Step 9: System calculates commission

Commission can come from admin commission setup.

```text
Package Price = BDT 1,000
Commission Type = Percentage
Commission Value = 20%
Platform Commission = BDT 200
Trainer Net Earning = BDT 800
```

System calculation:

```json
{
  "gross_amount": 1000,
  "commission_type": "percentage",
  "commission_value": 20,
  "commission_amount": 200,
  "trainer_net_amount": 800,
  "currency": "BDT"
}
```

---

## Internal API / Service: Calculate commission

```http
POST /admin/commission-settings/calculate-preview
Auth: Admin
```

Request:

```json
{
  "package_price": 1000,
  "trainer_id": 15,
  "package_id": 22,
  "package_category": "HR Interview"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "commission_rule_id": 3,
    "commission_rule_name": "Default Platform Commission",
    "commission_type": "percentage",
    "commission_value": 20,
    "gross_amount": 1000,
    "commission_amount": 200,
    "trainer_net_amount": 800,
    "currency": "BDT"
  }
}
```

Note:

```text
For real payment flow, commission should be calculated automatically by backend service.
The calculation preview API is mainly for admin testing.
```

---

# 5. Trainer Earning Ledger

## Step 10: Create trainer earning ledger after session completion

```json
{
  "trainer_id": 15,
  "student_id": 44,
  "booking_id": 7001,
  "interview_id": 9001,
  "payment_id": 8101,
  "gross_amount": 1000,
  "commission_amount": 200,
  "trainer_net_amount": 800,
  "currency": "BDT",
  "status": "pending",
  "available_at": "2026-07-01T19:50:00Z"
}
```

Earning status:

```text
pending
available
withdraw_requested
paid
cancelled
refunded
```

---

## Step 11: Move trainer earning to available balance

This can happen after refund window ends.

```http
POST /system/earnings/release
Auth: System/Cron
```

System action:

```text
- Find completed sessions where refund window is over
- Change earning status from pending to available
- Add trainer_net_amount to trainer available balance
- Keep commission_amount as platform revenue
```

Example:

```json
{
  "trainer_id": 15,
  "available_balance_added": 800,
  "platform_revenue_added": 200,
  "currency": "BDT"
}
```

---

# 6. Trainer Wallet & Withdraw Flow

## Step 12: Trainer checks wallet

```http
GET /trainers/me/wallet
Auth: Trainer
```

Response:

```json
{
  "success": true,
  "data": {
    "currency": "BDT",
    "total_earned": 800,
    "available_balance": 800,
    "pending_balance": 0,
    "withdrawn_amount": 0,
    "platform_commission_total": 200,
    "minimum_withdraw_amount": 1000,
    "withdrawal_allowed": false
  }
}
```

---

## Step 13: Trainer requests withdrawal

```http
POST /trainers/me/withdrawals
Auth: Trainer
```

Request:

```json
{
  "amount": 5000,
  "payout_method_id": 12,
  "note": "Monthly withdrawal request"
}
```

Response:

```json
{
  "success": true,
  "message": "Withdrawal request submitted successfully.",
  "data": {
    "withdrawal_id": 301,
    "amount": 5000,
    "currency": "BDT",
    "status": "pending"
  }
}
```

System action:

```text
- Validate available balance
- Validate minimum withdrawal amount
- Validate payout method
- Deduct/lock requested amount from available balance
- Create withdrawal request with status: pending
```

---

# 7. Admin Withdrawal Flow

## Step 14: Admin views pending withdrawals

```http
GET /admin/withdrawals/pending
Auth: Admin
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "withdrawal_id": 301,
      "trainer_id": 15,
      "trainer_name": "Rahim Uddin",
      "amount": 5000,
      "currency": "BDT",
      "method": "bKash",
      "account_number": "01XXXXXXXXX",
      "status": "pending",
      "requested_at": "2026-07-01T10:00:00Z"
    }
  ]
}
```

---

## Step 15: Admin approves withdrawal

```http
PATCH /admin/withdrawals/{withdrawal_id}/approve
Auth: Admin
```

Request:

```json
{
  "admin_note": "Approved for monthly payout."
}
```

Response:

```json
{
  "success": true,
  "message": "Withdrawal approved.",
  "data": {
    "withdrawal_id": 301,
    "status": "approved"
  }
}
```

---

## Step 16: Admin marks withdrawal as paid

```http
PATCH /admin/withdrawals/{withdrawal_id}/mark-paid
Auth: Admin
```

Request:

```json
{
  "transaction_reference": "BKASH-TXN-999888",
  "paid_at": "2026-07-02T15:30:00Z",
  "admin_note": "Paid through bKash merchant account."
}
```

Response:

```json
{
  "success": true,
  "message": "Withdrawal marked as paid.",
  "data": {
    "withdrawal_id": 301,
    "status": "paid",
    "transaction_reference": "BKASH-TXN-999888"
  }
}
```

System action:

```text
- Update withdrawal status: paid
- Update trainer withdrawn amount
- Create payout transaction record
- Notify trainer
```

---

# 8. Admin Commission Setup APIs

## Create commission rule

```http
POST /admin/commission-settings
Auth: Admin
```

Request:

```json
{
  "rule_name": "Default Platform Commission",
  "commission_type": "percentage",
  "commission_value": 20,
  "applies_to": "global",
  "currency": "BDT",
  "priority": 100,
  "status": "active"
}
```

Response:

```json
{
  "success": true,
  "message": "Commission rule created successfully.",
  "data": {
    "commission_rule_id": 3,
    "rule_name": "Default Platform Commission",
    "commission_value": 20,
    "status": "active"
  }
}
```

---

## List commission rules

```http
GET /admin/commission-settings
Auth: Admin
```

---

## Update commission rule

```http
PUT /admin/commission-settings/{id}
Auth: Admin
```

---

## Activate commission rule

```http
PATCH /admin/commission-settings/{id}/activate
Auth: Admin
```

---

## Deactivate commission rule

```http
PATCH /admin/commission-settings/{id}/deactivate
Auth: Admin
```

---

# 9. Full API List by Role

## Student APIs

```http
GET    /trainers
GET    /trainers/{id}
GET    /trainers/{id}/availability
POST   /bookings
GET    /bookings/{id}
POST   /bookings/{id}/cancel
POST   /payments/initiate
GET    /payments/history
GET    /payments/{id}/invoice
GET    /interviews/{id}
POST   /interviews/{id}/join
GET    /students/me/evaluations
POST   /trainers/{trainer_id}/reviews
```

---

## Trainer APIs

```http
GET    /trainers/me/dashboard
GET    /trainers/me/sessions
GET    /trainers/me/earnings
GET    /trainers/me/wallet
GET    /trainers/me/packages
POST   /trainers/me/packages
PUT    /trainers/me/packages/{id}
DELETE /trainers/me/packages/{id}
POST   /trainers/me/availability
GET    /interviews/{id}
POST   /interviews/{id}/join
POST   /interviews/{id}/complete
POST   /trainers/me/evaluations/{session_id}
GET    /trainers/me/withdrawals
POST   /trainers/me/withdrawals
GET    /trainers/me/payout-methods
POST   /trainers/me/payout-methods
PUT    /trainers/me/payout-methods/{id}
DELETE /trainers/me/payout-methods/{id}
```

---

## Admin APIs

```http
GET    /admin/dashboard
GET    /admin/users
PUT    /admin/users/{id}/status

GET    /admin/trainers/pending
POST   /admin/trainers/{id}/approve

GET    /admin/commission-settings
POST   /admin/commission-settings
GET    /admin/commission-settings/{id}
PUT    /admin/commission-settings/{id}
PATCH  /admin/commission-settings/{id}/activate
PATCH  /admin/commission-settings/{id}/deactivate
POST   /admin/commission-settings/calculate-preview

GET    /admin/payments
GET    /admin/payments/{id}

GET    /admin/withdrawals
GET    /admin/withdrawals/pending
GET    /admin/withdrawals/{id}
PATCH  /admin/withdrawals/{id}/approve
PATCH  /admin/withdrawals/{id}/reject
PATCH  /admin/withdrawals/{id}/process
PATCH  /admin/withdrawals/{id}/mark-paid

GET    /admin/reports/revenue
GET    /admin/reports/trainer-earnings
```

---

# 10. Database Tables

## payments

```text
id
payer_id
payee_id
booking_id
interview_id
amount
commission_amount
trainer_net_amount
currency
gateway
gateway_txn_id
status
invoice_path
created_at
updated_at
```

---

## platform_holding_ledger

```text
id
payment_id
booking_id
interview_id
trainer_id
student_id
gross_amount
currency
status
held_at
released_at
created_at
updated_at
```

Statuses:

```text
platform_held
released_to_trainer
refunded
cancelled
```

---

## commission_settings

```text
id
rule_name
commission_type
commission_value
fixed_amount
applies_to
trainer_id
package_id
package_category
currency
priority
status
starts_at
ends_at
created_by
updated_by
created_at
updated_at
```

---

## payment_commission_breakdowns

```text
id
payment_id
trainer_id
package_id
commission_setting_id
gross_amount
commission_type
commission_value
commission_amount
trainer_net_amount
currency
calculated_at
created_at
```

---

## trainer_wallets

```text
id
trainer_id
currency
total_earned
available_balance
pending_balance
withdrawn_amount
platform_commission_total
created_at
updated_at
```

---

## trainer_earning_ledger

```text
id
trainer_id
student_id
booking_id
interview_id
payment_id
gross_amount
commission_amount
net_amount
currency
status
available_at
created_at
updated_at
```

---

## trainer_withdrawals

```text
id
trainer_id
payout_method_id
amount
currency
status
requested_at
approved_at
processed_at
paid_at
rejected_at
rejection_reason
transaction_reference
trainer_note
admin_note
created_at
updated_at
```

---

# 11. Important Validation Rules

```text
- Student cannot book unavailable slot.
- Student cannot complete booking without successful payment.
- Payment callback amount must match booking amount.
- Payment callback must verify gateway signature.
- Trainer does not receive money immediately after student payment.
- Money is first held by platform.
- Session must be completed before trainer earning is generated.
- Commission must be calculated and locked at payment/session completion time.
- Old payments must not change if admin changes commission later.
- Trainer earning becomes available only after refund window ends.
- Pending earning cannot be withdrawn.
- Withdrawal amount cannot exceed available balance.
- Admin must approve withdrawal before payout.
- Admin must add transaction reference before marking withdrawal as paid.
- Refunded booking should reverse platform holding and trainer earning.
- Cancelled session should not generate trainer earning.
```

---

# 12. Final Step-by-Step Summary

```text
1. Student selects trainer package.
2. Student selects available slot.
3. Student creates booking.
4. Student initiates payment.
5. Student completes payment through gateway.
6. Payment gateway sends success callback.
7. Platform confirms booking and holds money.
8. Trainer and student join interview session.
9. Trainer completes session.
10. Platform calculates commission.
11. Platform keeps commission amount.
12. Trainer net earning goes to pending balance.
13. After refund window, trainer earning becomes available.
14. Trainer requests withdrawal.
15. Admin approves withdrawal.
16. Admin pays trainer through bank, bKash, or Nagad.
17. Withdrawal status becomes paid.
```
