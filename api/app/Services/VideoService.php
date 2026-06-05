<?php

namespace App\Services;

use App\Models\Interview;
use Illuminate\Support\Str;

class VideoService
{
    /**
     * Generate Agora token for video session
     */
    public function generateToken(string $channelName, int $uid, string $role = 'attendee'): array
    {
        // Token valid for 2 hours
        $expirationTimeInSeconds = 2 * 60 * 60;

        try {
            // This is a placeholder - integrate with actual Agora RtcTokenBuilder
            // In production: use Agora\RtcTokenBuilder
            $token = $this->buildAgoraToken(
                $channelName,
                $uid,
                $role,
                $expirationTimeInSeconds
            );

            return [
                'token' => $token,
                'channel' => $channelName,
                'uid' => $uid,
                'expires_at' => now()->addSeconds($expirationTimeInSeconds),
            ];
        } catch (\Exception $e) {
            throw new \Exception('Failed to generate Agora token: ' . $e->getMessage());
        }
    }

    /**
     * Build Agora token (placeholder implementation)
     */
    private function buildAgoraToken(string $channelName, int $uid, string $role, int $expirationTimeInSeconds): string
    {
        // Placeholder - replace with actual Agora SDK integration
        // Example structure: RtcTokenBuilder::buildTokenWithUid(appId, appCertificate, channelName, uid, Agora\RtcTokenBuilder::ROLE_ATTENDEE, expirationTimeInSeconds)
        return hash('sha256', implode('|', [
            config('services.agora.app_id'),
            $channelName,
            $uid,
            time() + $expirationTimeInSeconds,
        ]));
    }

    /**
     * Create meeting channel for interview
     */
    public function createChannel(Interview $interview): string
    {
        $channelName = 'interview_' . $interview->id . '_' . Str::random(8);

        $interview->update([
            'agora_channel' => $channelName,
            'meeting_link' => config('app.frontend_url') . '/interview/' . $interview->id . '/join',
        ]);

        return $channelName;
    }

    /**
     * Get channel information
     */
    public function getChannelInfo(string $channelName): array
    {
        return [
            'channel_name' => $channelName,
            'app_id' => config('services.agora.app_id'),
            'base_url' => config('services.agora.base_url'),
        ];
    }
}
