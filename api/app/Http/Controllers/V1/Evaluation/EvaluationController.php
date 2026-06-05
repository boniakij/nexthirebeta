<?php

namespace App\Http\Controllers\V1\Evaluation;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Interview;
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    protected XPService $xpService;

    public function __construct(XPService $xpService)
    {
        $this->xpService = $xpService;
    }

    /**
     * Create evaluation for an interview
     */
    public function store(int $interviewId, Request $request): JsonResponse
    {
        $interview = Interview::findOrFail($interviewId);
        $trainer = auth()->user()->trainer;

        // Verify user is the trainer
        if (!$trainer || $interview->trainer_id !== $trainer->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only the trainer can evaluate this interview',
            ], 403);
        }

        // Verify interview is completed
        if ($interview->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Interview must be completed before evaluation',
            ], 400);
        }

        $validated = $request->validate([
            'communication_score' => 'required|integer|between:1,10',
            'technical_score' => 'required|integer|between:1,10',
            'confidence_score' => 'required|integer|between:1,10',
            'problem_solving_score' => 'required|integer|between:1,10',
            'english_score' => 'required|integer|between:1,10',
            'hr_readiness_score' => 'required|integer|between:1,10',
            'feedback_text' => 'required|string|max:2000',
        ]);

        try {
            return DB::transaction(function () use ($interview, $validated) {
                // Calculate overall level
                $scores = [
                    $validated['communication_score'],
                    $validated['technical_score'],
                    $validated['confidence_score'],
                    $validated['problem_solving_score'],
                    $validated['english_score'],
                    $validated['hr_readiness_score'],
                ];

                $averageScore = array_sum($scores) / count($scores);
                $overallLevel = $this->calculateOverallLevel($averageScore);

                // Create evaluation
                $evaluation = Evaluation::create([
                    'interview_id' => $interview->id,
                    'trainer_id' => $interview->trainer_id,
                    'student_id' => $interview->student_id,
                    'communication_score' => $validated['communication_score'],
                    'technical_score' => $validated['technical_score'],
                    'confidence_score' => $validated['confidence_score'],
                    'problem_solving_score' => $validated['problem_solving_score'],
                    'english_score' => $validated['english_score'],
                    'hr_readiness_score' => $validated['hr_readiness_score'],
                    'overall_level' => $overallLevel,
                    'feedback_text' => $validated['feedback_text'],
                ]);

                // Award XP
                $student = $interview->student;
                $this->xpService->award($student, 'interview_completed');

                // Award bonus XP if industry ready
                if ($overallLevel === 'industry_ready') {
                    $this->xpService->award($student, 'industry_ready_evaluation');
                }

                // Dispatch notification job
                \App\Jobs\SendNotification::dispatch(
                    $student->user_id,
                    'Interview Evaluation Complete',
                    "Your interview has been evaluated. Overall level: {$overallLevel}",
                    ['evaluation_id' => $evaluation->id]
                );

                return response()->json([
                    'success' => true,
                    'data' => [
                        'id' => $evaluation->id,
                        'interview_id' => $evaluation->interview_id,
                        'communication_score' => $evaluation->communication_score,
                        'technical_score' => $evaluation->technical_score,
                        'confidence_score' => $evaluation->confidence_score,
                        'problem_solving_score' => $evaluation->problem_solving_score,
                        'english_score' => $evaluation->english_score,
                        'hr_readiness_score' => $evaluation->hr_readiness_score,
                        'overall_level' => $evaluation->overall_level,
                        'feedback_text' => $evaluation->feedback_text,
                    ],
                    'message' => 'Evaluation created successfully',
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Calculate overall level based on average score
     */
    private function calculateOverallLevel(float $averageScore): string
    {
        if ($averageScore >= 9) {
            return 'industry_ready';
        } elseif ($averageScore >= 7.5) {
            return 'advanced';
        } elseif ($averageScore >= 6) {
            return 'intermediate';
        } elseif ($averageScore >= 4) {
            return 'beginner';
        }

        return 'not_ready';
    }
}
