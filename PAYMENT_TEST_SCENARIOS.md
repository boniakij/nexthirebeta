# Payment System Integration Tests

## Test Execution Plan

### Environment Setup
- Backend: Laravel running on http://localhost:8000
- Frontend: Next.js running on http://localhost:3000
- Database: MySQL with payment tables migrated

## Test Scenario 1: Commission Calculation ✅

**Objective:** Verify commission calculation rules work correctly

**Steps:**
1. Admin creates commission setting: 20% for all trainers
2. Test endpoint: POST `/admin/commission-settings/calculate-preview`
3. Input: `{"package_price": 1000, "trainer_id": null}`
4. Expected output:
   ```
   {
     "commission_amount": 200,
     "trainer_net_amount": 800,
     "commission_type": "percentage"
   }
   ```

**Validation:**
- Commission calculation accurate
- Rule priority system works
- Percentage and fixed types both calculated

---

## Test Scenario 2: Payment Flow - Complete Booking to Payment ✅

**Objective:** End-to-end payment initiation and callback

**Steps:**
1. **Create booking**
   - Student books trainer package
   - API: POST `/bookings`
   - Creates booking record

2. **Initiate payment**
   - Student selects payment gateway
   - Frontend: POST `/payments/initiate` with booking_id
   - Expected: Returns payment record with gateway_url
   - Status: pending → processing

3. **Simulate gateway callback**
   - Gateway (bKash/SSLCommerz) calls webhook
   - API: POST `/payments/bkash/callback`
   - Payload: transaction_id, status='completed', amount
   - Expected: Payment status → completed

4. **Verify payment recorded**
   - GET `/payments/{id}/invoice`
   - Verify amount matches booking
   - Verify trainer_id and student_id linked

**Validation:**
- Payment created with correct amount
- Callback updates payment status
- Payment history queryable

---

## Test Scenario 3: Session Completion & Commission Calculation ✅

**Objective:** Verify commission locked at session completion

**Prerequisites:** Completed payment from Scenario 2

**Steps:**
1. **Mark session as completed**
   - Interview video session finishes
   - API: POST `/interviews/{id}/complete`
   - Triggers commission calculation

2. **Verify commission breakdown created**
   - Check: PaymentCommissionBreakdown table
   - Fields: payment_id, trainer_id, commission_setting_id
   - commission_amount, trainer_net_amount stored

3. **Verify earning ledger created**
   - Check: TrainerEarningLedger table
   - Status: 'pending'
   - available_at: now + 7 days
   - Amount: trainer_net_amount from breakdown

4. **Verify platform holding created**
   - Check: PlatformHoldingLedger table
   - status: 'platform_held'
   - gross_amount: payment amount
   - held_at: current timestamp

**Validation:**
- Commission locked at payment time (not updatable later)
- Earning pending for 7-day refund window
- Platform holds funds until refund window expires

---

## Test Scenario 4: Wallet Balance Updates ✅

**Objective:** Verify wallet state transitions during payment flow

**Prerequisites:** Scenario 1-3 completed

**Steps:**
1. **Check initial wallet**
   - GET `/trainers/me/wallet`
   - Response: total_earned=0, available=0, pending=0, withdrawn=0

2. **After payment + commission calculation**
   - Check wallet updated
   - pending_balance: should include trainer_net_amount
   - total_earned: should show gross trainer earning

3. **Simulate refund window expiry** (7 days)
   - Background job: EarningService::releaseEarnings()
   - Earning status: pending → available
   - Wallet: move from pending_balance → available_balance

4. **Verify wallet state after release**
   - available_balance: now includes released earning
   - pending_balance: decreased
   - total_earned: unchanged

**Validation:**
- Wallet balance consistency maintained
- Transition from pending → available works
- Can't withdraw from pending (only available)

---

## Test Scenario 5: Withdrawal Request & Admin Approval ✅

**Objective:** Full withdrawal workflow with balance locking

**Prerequisites:** Scenario 4 completed (with available balance)

**Steps:**
1. **Trainer requests withdrawal**
   - Trainer has 10,000 BDT available
   - POST `/trainers/me/withdrawals`
   - Payload: amount=5000, payout_method_id=1, note="Q2 earnings"
   - Expected: Status: 'pending'

2. **Verify balance locked immediately**
   - GET `/trainers/me/wallet`
   - available_balance: now 5000 (locked 5000)
   - pending_balance: unchanged
   - Wallet.available_balance decremented

3. **Admin reviews pending withdrawals**
   - Admin panel: GET `/admin/withdrawals/pending`
   - Shows withdrawal card: trainer name, 5000 BDT, pending status
   - Approve/Reject buttons visible

4. **Admin approves withdrawal**
   - Admin clicks "Approve"
   - PATCH `/admin/withdrawals/{id}/approve`
   - Payload: admin_note="Approved for Q2 payout"
   - Status: pending → approved

5. **Admin marks as paid**
   - Admin clicks "Mark Paid"
   - PATCH `/admin/withdrawals/{id}/mark-paid`
   - Payload: transaction_reference="BKASH-TXN-123456", admin_note="Processed"
   - Status: approved → paid

6. **Verify final state**
   - Withdrawal.status: 'paid'
   - Withdrawal.transaction_reference: set
   - Wallet.withdrawn_amount: incremented by 5000
   - Wallet.available_balance: still 5000 (locked during request)

**Validation:**
- Balance locked on request (prevents double-withdrawal)
- Admin approval workflow functional
- Transaction reference stored
- Wallet accounting correct

---

## Test Scenario 6: Withdrawal Rejection & Refund ✅

**Objective:** Verify balance refund on withdrawal rejection

**Steps:**
1. **Trainer requests withdrawal**
   - Same as Scenario 5, step 1
   - Withdrawal created with status 'pending'

2. **Balance locked**
   - available_balance decreased
   - withdrawal in WalletService lock state

3. **Admin rejects withdrawal**
   - PATCH `/admin/withdrawals/{id}/reject`
   - Payload: rejection_reason="Unverified account", admin_note="Account needs verification"
   - Expected: Status: pending → rejected

4. **Verify balance refunded**
   - GET `/trainers/me/wallet`
   - available_balance: restored to 10000
   - withdrawn_amount: unchanged (not processed)

5. **Withdrawal shows rejection**
   - GET `/trainers/me/withdrawals`
   - Status: 'rejected'
   - Can see rejection reason if exposed via API

**Validation:**
- Admin can reject with reason
- Balance immediately refunded on rejection
- Trainer can request again after rejection

---

## Test Scenario 7: Concurrent Withdrawal Prevention ✅

**Objective:** Prevent multiple withdrawal requests exceeding balance

**Steps:**
1. **Trainer has 5000 BDT available**
   - GET `/trainers/me/wallet` → available_balance: 5000

2. **Request withdrawal #1**
   - POST `/trainers/me/withdrawals` → amount: 3000
   - Status: 'pending'
   - available_balance now: 2000 (3000 locked)

3. **Request withdrawal #2**
   - POST `/trainers/me/withdrawals` → amount: 2000
   - Status: 'pending'
   - available_balance now: 0 (5000 total locked)

4. **Attempt withdrawal #3 (should fail)**
   - POST `/trainers/me/withdrawals` → amount: 1000
   - Expected error: "Available balance insufficient"
   - Status code: 400 or 422

5. **Verify state consistent**
   - Total withdrawals pending: 5000
   - available_balance: 0
   - Can't lock what's already locked

**Validation:**
- Concurrent requests handled
- Balance decremented per request
- Prevents overdraw

---

## Test Scenario 8: Commission Rule Priority ✅

**Objective:** Verify correct rule selected when multiple rules exist

**Steps:**
1. **Create multiple commission rules**
   - Rule 1: Global 20% (priority: 1)
   - Rule 2: Trainer-specific 15% (priority: 2, trainer_id=123)
   - Rule 3: Package-specific 25% (priority: 3, package_id=456)

2. **Test commission calculation for trainer 123, package 456**
   - Both rules apply, highest priority (3) should win
   - Expected: 25% commission applied

3. **Test for trainer 123, different package**
   - Only trainer rule applies
   - Expected: 15% commission applied

4. **Test for different trainer, default package**
   - Only global rule applies
   - Expected: 20% commission applied

**Validation:**
- Priority-based rule selection works
- Correct rule applied in each scenario
- Fallback to global rule when specific rules don't match

---

## Test Scenario 9: Payout Method Management ✅

**Objective:** Trainer can add and manage payout methods

**Steps:**
1. **List existing payout methods**
   - GET `/trainers/me/payout-methods`
   - Response: array of methods with id, method, account details, status

2. **Add new payout method**
   - POST `/trainers/me/payout-methods`
   - Payload: method='bank_transfer', bank_name='Brac Bank', account_number='1234567890', holder_name='Ahmed'
   - Expected: status='pending_verification', method created

3. **Update payout method**
   - PUT `/trainers/me/payout-methods/{id}`
   - Payload: holder_name='Updated Name', is_default=true
   - Verify update successful

4. **Delete payout method**
   - DELETE `/trainers/me/payout-methods/{id}`
   - Verify method removed

**Validation:**
- CRUD operations work
- Methods stored per trainer
- Can set default method
- Account details validated

---

## Test Scenario 10: Payment History & Invoicing ✅

**Objective:** Verify payment records queryable by student

**Steps:**
1. **Student views payment history**
   - GET `/payments/history`
   - Response: array of payments with status, amount, booking details

2. **Student views invoice**
   - GET `/payments/{id}/invoice`
   - Response: invoice PDF or JSON with details
   - Includes: booking id, trainer name, package, amount, payment method, date

**Validation:**
- Payment history accessible
- Invoice generation works
- Data formatted correctly

---

## Critical Path Test (Full Flow)

Execute these in sequence to validate full payment system:

1. ✅ Create trainer + trainer profile
2. ✅ Create package
3. ✅ Student books package → Booking created
4. ✅ Student initiates payment → Payment record created
5. ✅ Webhook callback → Payment marked completed
6. ✅ Interview completed → Commission calculated & earning created
7. ✅ Wait 7 days → Earning released to available_balance (or mock release)
8. ✅ Trainer requests withdrawal → Balance locked
9. ✅ Admin approves → Status: approved
10. ✅ Admin marks paid → Status: paid
11. ✅ Verify all ledgers and wallet state

**Success Criteria:**
- ✅ Money flows correctly through all tables
- ✅ Balances remain consistent
- ✅ Audit trail complete (all ledgers populated)
- ✅ No balance leaks or unaccounted funds
- ✅ Admin approval required before payout
- ✅ Refund window prevents immediate trainer withdrawal

---

## Database Audit Checks

After complete flow, verify:

```sql
-- Verify payment recorded
SELECT id, booking_id, amount, status FROM payments WHERE id = ?;

-- Verify holding ledger created
SELECT * FROM platform_holding_ledger WHERE payment_id = ?;

-- Verify commission breakdown locked
SELECT * FROM payment_commission_breakdowns WHERE payment_id = ?;

-- Verify earning ledger created
SELECT * FROM trainer_earning_ledger WHERE payment_id = ? AND status = 'pending';

-- Verify wallet balance updated
SELECT total_earned, available_balance, pending_balance, withdrawn_amount
FROM trainer_wallets WHERE trainer_id = ?;

-- Verify withdrawal record created
SELECT * FROM trainer_withdrawals WHERE trainer_id = ? AND status IN ('pending', 'approved', 'paid');

-- Verify ledger consistency
SELECT 
  SUM(CASE WHEN status='pending' THEN amount ELSE 0 END) as pending_total,
  SUM(CASE WHEN status='available' THEN amount ELSE 0 END) as available_total,
  SUM(CASE WHEN status='paid' THEN amount ELSE 0 END) as paid_total
FROM trainer_earning_ledger WHERE trainer_id = ?;
```

---

## Notes

- All timestamps should use UTC
- Currency field always 'BDT'
- Amounts stored as decimal(12,2)
- Status enums strictly enforced (no free text)
- Foreign keys cascading configured
- Soft deletes not used (hard delete for audit trail)
- No concurrent transaction issues (MySQL transactions adequate)
