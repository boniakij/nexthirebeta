<?php

namespace App\Services;

use App\Models\Trainer;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class TrainerApprovalService
{
    /**
     * Approve a trainer application
     */
    public function approveTrainer(Trainer $trainer, int $adminId, ?string $comments = null): bool
    {
        try {
            DB::beginTransaction();

            // Update trainer status
            $trainer->update([
                'approval_status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $adminId,
                'admin_comments' => $comments,
            ]);

            // Update user role if needed
            if ($trainer->user && !$trainer->user->hasRole('trainer')) {
                $trainer->user->assignRole('trainer');
            }

            // Send approval notification email
            $this->sendApprovalEmail($trainer);

            // Log activity
            activity()
                ->causedBy(User::find($adminId))
                ->performedOn($trainer)
                ->log('Trainer approved');

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Trainer approval failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Reject a trainer application
     */
    public function rejectTrainer(Trainer $trainer, int $adminId, string $reason): bool
    {
        try {
            DB::beginTransaction();

            // Update trainer status
            $trainer->update([
                'approval_status' => 'rejected',
                'rejected_at' => now(),
                'rejected_by' => $adminId,
                'rejection_reason' => $reason,
            ]);

            // Send rejection notification email
            $this->sendRejectionEmail($trainer, $reason);

            // Log activity
            activity()
                ->causedBy(User::find($adminId))
                ->performedOn($trainer)
                ->log('Trainer rejected');

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Trainer rejection failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Suspend a trainer
     */
    public function suspendTrainer(Trainer $trainer, int $adminId, string $reason): bool
    {
        try {
            DB::beginTransaction();

            $trainer->update([
                'status' => 'suspended',
                'suspension_reason' => $reason,
                'suspended_at' => now(),
                'suspended_by' => $adminId,
            ]);

            // Send suspension notification
            $this->sendSuspensionEmail($trainer, $reason);

            // Log activity
            activity()
                ->causedBy(User::find($adminId))
                ->performedOn($trainer)
                ->log('Trainer suspended');

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Trainer suspension failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Unsuspend a trainer
     */
    public function unsuspendTrainer(Trainer $trainer, int $adminId): bool
    {
        try {
            DB::beginTransaction();

            $trainer->update([
                'status' => 'active',
                'suspension_reason' => null,
                'suspended_at' => null,
                'suspended_by' => null,
            ]);

            // Send reactivation notification
            $this->sendReactivationEmail($trainer);

            // Log activity
            activity()
                ->causedBy(User::find($adminId))
                ->performedOn($trainer)
                ->log('Trainer unsuspended');

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Trainer unsuspension failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get trainer statistics
     */
    public function getTrainerStats(Trainer $trainer): array
    {
        return [
            'id' => $trainer->id,
            'name' => $trainer->user->name ?? 'Unknown',
            'email' => $trainer->user->email ?? 'Unknown',
            'total_sessions' => $trainer->sessions()->count(),
            'total_earnings' => $trainer->calculateTotalEarnings(),
            'average_rating' => round($trainer->average_rating, 2),
            'total_reviews' => $trainer->reviews()->count(),
            'total_complaints' => $trainer->complaints()->count(),
            'approval_status' => $trainer->approval_status,
            'approved_at' => $trainer->approved_at,
            'status' => $trainer->status,
        ];
    }

    /**
     * Get pending trainers count
     */
    public function getPendingCount(): int
    {
        return Trainer::where('approval_status', 'pending')->count();
    }

    /**
     * Send approval email
     */
    private function sendApprovalEmail(Trainer $trainer): void
    {
        try {
            // TODO: Implement email sending
            // Mail::send('emails.trainer-approved', [
            //     'trainer' => $trainer,
            //     'platform_name' => config('app.name'),
            // ], function ($message) use ($trainer) {
            //     $message->to($trainer->user->email)
            //             ->subject('Your Trainer Account Has Been Approved');
            // });

            \Log::info("Approval email would be sent to: {$trainer->user->email}");
        } catch (\Exception $e) {
            \Log::error('Failed to send approval email: ' . $e->getMessage());
        }
    }

    /**
     * Send rejection email
     */
    private function sendRejectionEmail(Trainer $trainer, string $reason): void
    {
        try {
            // TODO: Implement email sending
            \Log::info("Rejection email would be sent to: {$trainer->user->email}");
        } catch (\Exception $e) {
            \Log::error('Failed to send rejection email: ' . $e->getMessage());
        }
    }

    /**
     * Send suspension email
     */
    private function sendSuspensionEmail(Trainer $trainer, string $reason): void
    {
        try {
            // TODO: Implement email sending
            \Log::info("Suspension email would be sent to: {$trainer->user->email}");
        } catch (\Exception $e) {
            \Log::error('Failed to send suspension email: ' . $e->getMessage());
        }
    }

    /**
     * Send reactivation email
     */
    private function sendReactivationEmail(Trainer $trainer): void
    {
        try {
            // TODO: Implement email sending
            \Log::info("Reactivation email would be sent to: {$trainer->user->email}");
        } catch (\Exception $e) {
            \Log::error('Failed to send reactivation email: ' . $e->getMessage());
        }
    }
}
