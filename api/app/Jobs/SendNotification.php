<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Str;

class SendNotification implements ShouldQueue
{
    use Queueable;

    protected int $userId;
    protected string $title;
    protected string $body;
    protected ?array $data;

    /**
     * Create a new job instance.
     */
    public function __construct(int $userId, string $title, string $body, ?array $data = null)
    {
        $this->userId = $userId;
        $this->title = $title;
        $this->body = $body;
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = User::findOrFail($this->userId);

        // Create notification record
        $notification = Notification::create([
            'id' => Str::uuid(),
            'user_id' => $this->userId,
            'type' => 'system',
            'title' => $this->title,
            'body' => $this->body,
            'data' => $this->data,
        ]);

        // Send email notification
        try {
            // In production: use SES or other email service
            // Mail::to($user->email)->send(new NotificationEmail($notification));
            // For now, just log
            \Log::info('Notification sent', [
                'notification_id' => $notification->id,
                'user_id' => $this->userId,
                'title' => $this->title,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to send email notification', [
                'notification_id' => $notification->id,
                'error' => $e->getMessage(),
            ]);
        }

        // Optional: Send SMS via Twilio
        // $this->sendSMS($user->phone, $this->title . ': ' . $this->body);
    }

    /**
     * Send SMS notification
     */
    private function sendSMS(?string $phone, string $message): void
    {
        if (!$phone) {
            return;
        }

        try {
            // In production: use Twilio SDK
            // $twilio = new \Twilio\Rest\Client(config('services.twilio.account_sid'), config('services.twilio.auth_token'));
            // $twilio->messages->create($phone, ['from' => config('services.twilio.from_number'), 'body' => $message]);
        } catch (\Exception $e) {
            \Log::error('Failed to send SMS notification', [
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
