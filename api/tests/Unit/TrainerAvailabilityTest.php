<?php

namespace Tests\Unit;

use App\Models\Trainer;
use App\Models\User;
use App\Models\TrainerAvailabilitySlot;
use App\Models\TrainerWeeklySchedule;
use App\Models\TrainerBlockedDate;
use App\Models\TrainerBookingRule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\TestCase;
use Tests\TestCase as BaseTestCase;

class TrainerAvailabilityTest extends BaseTestCase
{
    use RefreshDatabase;

    protected Trainer $trainer;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->trainer = Trainer::factory()->create(['user_id' => $this->user->id]);
    }

    // TrainerAvailabilitySlot Model Tests
    public function test_availability_slot_belongs_to_trainer(): void
    {
        $slot = TrainerAvailabilitySlot::create([
            'trainer_id' => $this->trainer->id,
            'date' => now()->addDay()->toDateString(),
            'start_time' => '19:00',
            'end_time' => '22:00',
            'slot_duration_minutes' => 45,
            'status' => 'available',
        ]);

        $this->assertEquals($this->trainer->id, $slot->trainer->id);
    }

    public function test_availability_slot_date_casting(): void
    {
        $slot = TrainerAvailabilitySlot::create([
            'trainer_id' => $this->trainer->id,
            'date' => '2026-06-30',
            'start_time' => '19:00',
            'end_time' => '22:00',
            'slot_duration_minutes' => 45,
            'status' => 'available',
        ]);

        $this->assertEquals('2026-06-30', $slot->date->toDateString());
    }

    public function test_availability_slot_can_have_multiple_statuses(): void
    {
        $statuses = ['available', 'reserved', 'booked', 'blocked', 'expired', 'cancelled', 'unavailable'];

        foreach ($statuses as $status) {
            $slot = TrainerAvailabilitySlot::create([
                'trainer_id' => $this->trainer->id,
                'date' => now()->addDay()->toDateString(),
                'start_time' => '19:00',
                'end_time' => '22:00',
                'slot_duration_minutes' => 45,
                'status' => $status,
            ]);

            $this->assertEquals($status, $slot->status);
        }
    }

    // TrainerWeeklySchedule Model Tests
    public function test_weekly_schedule_belongs_to_trainer(): void
    {
        $schedule = TrainerWeeklySchedule::create([
            'trainer_id' => $this->trainer->id,
            'day_of_week' => 1,
            'is_available' => true,
            'start_time' => '19:00',
            'end_time' => '22:00',
            'slot_duration_minutes' => 45,
            'buffer_minutes' => 15,
            'status' => 'active',
        ]);

        $this->assertEquals($this->trainer->id, $schedule->trainer->id);
    }

    public function test_weekly_schedule_day_of_week_validation(): void
    {
        for ($i = 0; $i < 7; $i++) {
            $schedule = TrainerWeeklySchedule::create([
                'trainer_id' => $this->trainer->id,
                'day_of_week' => $i,
                'is_available' => true,
                'start_time' => '19:00',
                'end_time' => '22:00',
                'status' => 'active',
            ]);

            $this->assertEquals($i, $schedule->day_of_week);
        }
    }

    public function test_get_day_name_helper(): void
    {
        $this->assertEquals('Sunday', TrainerWeeklySchedule::getDayName(0));
        $this->assertEquals('Monday', TrainerWeeklySchedule::getDayName(1));
        $this->assertEquals('Friday', TrainerWeeklySchedule::getDayName(5));
        $this->assertEquals('Saturday', TrainerWeeklySchedule::getDayName(6));
        $this->assertNull(TrainerWeeklySchedule::getDayName(7));
    }

    public function test_weekly_schedule_boolean_casting(): void
    {
        $schedule = TrainerWeeklySchedule::create([
            'trainer_id' => $this->trainer->id,
            'day_of_week' => 1,
            'is_available' => 1,
            'start_time' => '19:00',
            'end_time' => '22:00',
            'status' => 'active',
        ]);

        $this->assertTrue($schedule->is_available);
    }

    // TrainerBlockedDate Model Tests
    public function test_blocked_date_belongs_to_trainer(): void
    {
        $blocked = TrainerBlockedDate::create([
            'trainer_id' => $this->trainer->id,
            'block_type' => 'public_holiday',
            'date' => now()->addDay()->toDateString(),
            'is_full_day' => true,
            'reason' => 'Eid',
        ]);

        $this->assertEquals($this->trainer->id, $blocked->trainer->id);
    }

    public function test_blocked_date_block_types(): void
    {
        $blockTypes = ['personal_leave', 'public_holiday', 'emergency', 'vacation'];

        foreach ($blockTypes as $type) {
            $blocked = TrainerBlockedDate::create([
                'trainer_id' => $this->trainer->id,
                'block_type' => $type,
                'date' => now()->addDay()->toDateString(),
                'is_full_day' => true,
            ]);

            $this->assertEquals($type, $blocked->block_type);
        }
    }

    // TrainerBookingRule Model Tests
    public function test_booking_rule_belongs_to_trainer(): void
    {
        $rule = TrainerBookingRule::create([
            'trainer_id' => $this->trainer->id,
            'minimum_notice_hours' => 6,
            'max_booking_days_ahead' => 30,
        ]);

        $this->assertEquals($this->trainer->id, $rule->trainer->id);
    }

    public function test_booking_rule_boolean_casting(): void
    {
        $rule = TrainerBookingRule::create([
            'trainer_id' => $this->trainer->id,
            'allow_same_day_booking' => 1,
            'allow_reschedule' => 0,
            'allow_cancellation' => 1,
        ]);

        $this->assertTrue($rule->allow_same_day_booking);
        $this->assertFalse($rule->allow_reschedule);
        $this->assertTrue($rule->allow_cancellation);
    }

    public function test_booking_rule_integer_casting(): void
    {
        $rule = TrainerBookingRule::create([
            'trainer_id' => $this->trainer->id,
            'minimum_notice_hours' => '6',
            'max_booking_days_ahead' => '30',
        ]);

        $this->assertIsInt($rule->minimum_notice_hours);
        $this->assertIsInt($rule->max_booking_days_ahead);
    }

    // Trainer Model Relationships Tests
    public function test_trainer_has_many_availability_slots(): void
    {
        TrainerAvailabilitySlot::factory(3)->create(['trainer_id' => $this->trainer->id]);

        $this->assertCount(3, $this->trainer->availabilitySlots);
    }

    public function test_trainer_has_many_weekly_schedules(): void
    {
        TrainerWeeklySchedule::factory(7)->create(['trainer_id' => $this->trainer->id]);

        $this->assertCount(7, $this->trainer->weeklySchedules);
    }

    public function test_trainer_has_many_blocked_dates(): void
    {
        TrainerBlockedDate::factory(5)->create(['trainer_id' => $this->trainer->id]);

        $this->assertCount(5, $this->trainer->blockedDates);
    }

    public function test_trainer_has_one_booking_rule(): void
    {
        $rule = TrainerBookingRule::create(['trainer_id' => $this->trainer->id]);

        $this->assertEquals($rule->id, $this->trainer->bookingRules->id);
    }

    // Validation Tests
    public function test_slot_duration_bounds(): void
    {
        // Valid durations: 15-480 minutes
        $validDurations = [15, 30, 45, 60, 240, 480];

        foreach ($validDurations as $duration) {
            $slot = TrainerAvailabilitySlot::create([
                'trainer_id' => $this->trainer->id,
                'date' => now()->addDay()->toDateString(),
                'start_time' => '19:00',
                'end_time' => '22:00',
                'slot_duration_minutes' => $duration,
                'status' => 'available',
            ]);

            $this->assertTrue($slot->slot_duration_minutes >= 15 && $slot->slot_duration_minutes <= 480);
        }
    }

    public function test_booking_rule_defaults(): void
    {
        $rule = TrainerBookingRule::create(['trainer_id' => $this->trainer->id]);

        $this->assertEquals(6, $rule->minimum_notice_hours);
        $this->assertEquals(30, $rule->max_booking_days_ahead);
        $this->assertFalse($rule->allow_same_day_booking);
        $this->assertTrue($rule->allow_reschedule);
        $this->assertTrue($rule->allow_cancellation);
        $this->assertTrue($rule->auto_confirm_paid_bookings);
    }
}
