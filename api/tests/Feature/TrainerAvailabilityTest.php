<?php

namespace Tests\Feature;

use App\Models\Trainer;
use App\Models\User;
use App\Models\TrainerAvailabilitySlot;
use App\Models\TrainerWeeklySchedule;
use App\Models\TrainerBlockedDate;
use App\Models\TrainerBookingRule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TrainerAvailabilityTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected Trainer $trainer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->trainer = Trainer::factory()->create(['user_id' => $this->user->id]);
    }

    // Weekly Schedule Tests
    public function test_get_weekly_schedule(): void
    {
        TrainerWeeklySchedule::factory()->create(['trainer_id' => $this->trainer->id]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/trainers/me/availability/weekly-schedule');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data']);
    }

    public function test_update_weekly_schedule(): void
    {
        $schedule = [
            [
                'day_of_week' => 1,
                'is_available' => true,
                'start_time' => '19:00',
                'end_time' => '22:00',
                'slot_duration_minutes' => 45,
                'buffer_minutes' => 15,
            ],
        ];

        $response = $this->actingAs($this->user)
            ->putJson('/api/v1/trainers/me/availability/weekly-schedule', [
                'schedule' => $schedule,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('trainer_weekly_schedules', [
            'trainer_id' => $this->trainer->id,
            'day_of_week' => 1,
            'is_available' => true,
        ]);
    }

    public function test_update_weekly_schedule_validation(): void
    {
        $response = $this->actingAs($this->user)
            ->putJson('/api/v1/trainers/me/availability/weekly-schedule', [
                'schedule' => [
                    [
                        'day_of_week' => 1,
                        'is_available' => true,
                        // Missing start_time & end_time
                    ],
                ],
            ]);

        $response->assertStatus(422);
    }

    // Availability Slots Tests
    public function test_add_availability_slot(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/trainers/me/availability/slots', [
                'date' => now()->addDay()->toDateString(),
                'start_time' => '19:00',
                'end_time' => '22:00',
                'slot_duration_minutes' => 45,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('trainer_availability_slots', [
            'trainer_id' => $this->trainer->id,
            'status' => 'available',
        ]);
    }

    public function test_cannot_add_overlapping_slot(): void
    {
        $date = now()->addDay()->toDateString();

        TrainerAvailabilitySlot::create([
            'trainer_id' => $this->trainer->id,
            'date' => $date,
            'start_time' => '19:00',
            'end_time' => '22:00',
            'slot_duration_minutes' => 45,
            'status' => 'available',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/trainers/me/availability/slots', [
                'date' => $date,
                'start_time' => '20:00',
                'end_time' => '21:00',
                'slot_duration_minutes' => 45,
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_add_slot_validation_duration(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/trainers/me/availability/slots', [
                'date' => now()->addDay()->toDateString(),
                'start_time' => '19:00',
                'end_time' => '22:00',
                'slot_duration_minutes' => 10, // Invalid: < 15
            ]);

        $response->assertStatus(422);
    }

    public function test_delete_availability_slot(): void
    {
        $slot = TrainerAvailabilitySlot::create([
            'trainer_id' => $this->trainer->id,
            'date' => now()->addDay()->toDateString(),
            'start_time' => '19:00',
            'end_time' => '22:00',
            'slot_duration_minutes' => 45,
            'status' => 'available',
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/v1/trainers/me/availability/slots/{$slot->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('trainer_availability_slots', ['id' => $slot->id]);
    }

    public function test_cannot_delete_booked_slot(): void
    {
        $slot = TrainerAvailabilitySlot::create([
            'trainer_id' => $this->trainer->id,
            'date' => now()->addDay()->toDateString(),
            'start_time' => '19:00',
            'end_time' => '22:00',
            'slot_duration_minutes' => 45,
            'status' => 'booked',
            'booking_id' => 1,
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/v1/trainers/me/availability/slots/{$slot->id}");

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_get_available_slots_public(): void
    {
        TrainerAvailabilitySlot::create([
            'trainer_id' => $this->trainer->id,
            'date' => now()->addDay()->toDateString(),
            'start_time' => '19:00',
            'end_time' => '19:45',
            'slot_duration_minutes' => 45,
            'status' => 'available',
        ]);

        $response = $this->getJson(
            "/api/v1/trainers/{$this->trainer->id}/availability/slots"
        );

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data'])
            ->assertJsonCount(1, 'data');
    }

    // Blocked Dates Tests
    public function test_add_blocked_date(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/trainers/me/availability/blocked-dates', [
                'block_type' => 'public_holiday',
                'date' => now()->addDay()->toDateString(),
                'is_full_day' => true,
                'reason' => 'Eid holiday',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('trainer_blocked_dates', [
            'trainer_id' => $this->trainer->id,
            'block_type' => 'public_holiday',
        ]);
    }

    public function test_get_blocked_dates(): void
    {
        TrainerBlockedDate::factory()->create(['trainer_id' => $this->trainer->id]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/trainers/me/availability/blocked-dates');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data']);
    }

    public function test_delete_blocked_date(): void
    {
        $blocked = TrainerBlockedDate::factory()->create(['trainer_id' => $this->trainer->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/v1/trainers/me/availability/blocked-dates/{$blocked->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('trainer_blocked_dates', ['id' => $blocked->id]);
    }

    // Booking Rules Tests
    public function test_get_booking_rules(): void
    {
        TrainerBookingRule::factory()->create(['trainer_id' => $this->trainer->id]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/trainers/me/availability/booking-rules');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data']);
    }

    public function test_update_booking_rules(): void
    {
        $response = $this->actingAs($this->user)
            ->putJson('/api/v1/trainers/me/availability/booking-rules', [
                'minimum_notice_hours' => 12,
                'max_booking_days_ahead' => 60,
                'allow_same_day_booking' => true,
                'allow_cancellation' => true,
                'cancellation_deadline_hours' => 48,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('trainer_booking_rules', [
            'trainer_id' => $this->trainer->id,
            'minimum_notice_hours' => 12,
        ]);
    }

    // Authentication Tests
    public function test_unauthenticated_request_fails(): void
    {
        $response = $this->getJson('/api/v1/trainers/me/availability/weekly-schedule');

        $response->assertStatus(401);
    }

    public function test_other_trainer_cannot_access(): void
    {
        $otherUser = User::factory()->create();
        $otherTrainer = Trainer::factory()->create(['user_id' => $otherUser->id]);

        $slot = TrainerAvailabilitySlot::create([
            'trainer_id' => $this->trainer->id,
            'date' => now()->addDay()->toDateString(),
            'start_time' => '19:00',
            'end_time' => '22:00',
            'slot_duration_minutes' => 45,
            'status' => 'available',
        ]);

        $response = $this->actingAs($otherUser)
            ->deleteJson("/api/v1/trainers/me/availability/slots/{$slot->id}");

        $response->assertStatus(404);

        // Original slot still exists
        $this->assertDatabaseHas('trainer_availability_slots', ['id' => $slot->id]);
    }
}
