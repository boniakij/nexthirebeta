<?php

namespace App\Http\Controllers\V1\Interview;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Services\VideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InterviewController extends Controller
{
    protected VideoService $videoService;

    public function __construct(VideoService $videoService)
    {
        $this->videoService = $videoService;
    }

    /**
     * Get interview details
     */
    public function show(int $id): JsonResponse
    {
        $interview = Interview::with('student', 'trainer', 'package')
            ->findOrFail($id);

        // Verify user is student or trainer in this interview
        $user = auth()->user();
        if ($interview->student->user_id !== $user->id && $interview->trainer->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $interview->id,
                'student' => [
                    'id' => $interview->student->id,
                    'name' => $interview->student->full_name,
                ],
                'trainer' => [
                    'id' => $interview->trainer->id,
                    'name' => $interview->trainer->full_name,
                ],
                'package_title' => $interview->package->title,
                'scheduled_at' => $interview->scheduled_at,
                'duration_minutes' => $interview->duration_minutes,
                'status' => $interview->status,
                'meeting_link' => $interview->meeting_link,
                'agora_channel' => $interview->agora_channel,
            ],
        ]);
    }

    /**
     * Join interview and get Agora token
     */
    public function join(int $id): JsonResponse
    {
        $interview = Interview::findOrFail($id);
        $user = auth()->user();

        // Verify user is student or trainer
        $isStudent = $interview->student->user_id === $user->id;
        $isTrainer = $interview->trainer->user_id === $user->id;

        if (!$isStudent && !$isTrainer) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to join this interview',
            ], 403);
        }

        // Verify interview is scheduled or not completed
        if (!in_array($interview->status, ['scheduled', 'in_progress'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot join this interview. Status: ' . $interview->status,
            ], 400);
        }

        try {
            // Create channel if not exists
            if (!$interview->agora_channel) {
                $this->videoService->createChannel($interview);
                $interview->refresh();
            }

            // Mark as in progress
            if ($interview->status === 'scheduled') {
                $interview->update(['status' => 'in_progress']);
            }

            // Generate Agora token
            $uid = $isStudent ? $interview->student->id : $interview->trainer->id;
            $tokenData = $this->videoService->generateToken(
                $interview->agora_channel,
                $uid,
                'attendee'
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'channel' => $tokenData['channel'],
                    'token' => $tokenData['token'],
                    'uid' => $tokenData['uid'],
                    'app_id' => config('services.agora.app_id'),
                    'expires_at' => $tokenData['expires_at'],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to join interview: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Complete interview (trainer only)
     */
    public function complete(int $id): JsonResponse
    {
        $interview = Interview::findOrFail($id);
        $trainer = auth()->user()->trainer;

        // Verify user is the trainer
        if (!$trainer || $interview->trainer_id !== $trainer->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only the trainer can complete the interview',
            ], 403);
        }

        // Verify interview is in progress
        if ($interview->status !== 'in_progress') {
            return response()->json([
                'success' => false,
                'message' => 'Interview is not in progress',
            ], 400);
        }

        try {
            $interview->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Fire SessionCompleted event
            // event(new SessionCompleted($interview));

            return response()->json([
                'success' => true,
                'message' => 'Interview marked as completed',
                'data' => [
                    'interview_id' => $interview->id,
                    'status' => $interview->status,
                    'completed_at' => $interview->completed_at,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete interview: ' . $e->getMessage(),
            ], 400);
        }
    }
}
