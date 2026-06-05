<?php

namespace App\Services;

use App\Models\User;
use App\Models\Student;
use App\Models\Trainer;
use App\Models\Company;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'status' => 'pending',
        ]);

        $this->createRoleProfile($user, $data);

        return [
            'user' => $user,
            'message' => 'Registration successful. Please verify your email.',
        ];
    }

    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw new \Exception('Invalid credentials', 401);
        }

        if ($user->email_verified_at === null) {
            throw new \Exception('Email not verified', 403);
        }

        if ($user->status !== 'active') {
            throw new \Exception('Account is not active', 403);
        }

        $token = JWTAuth::fromUser($user);
        $refreshToken = $this->generateRefreshToken($user);

        return [
            'user' => $user,
            'tokens' => [
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'expires_in' => auth('api')->factory()->getTTL() * 60,
            ],
        ];
    }

    public function refresh(string $refreshToken): array
    {
        $user = $this->validateRefreshToken($refreshToken);

        if (!$user) {
            throw new \Exception('Invalid refresh token', 401);
        }

        $newToken = JWTAuth::fromUser($user);
        $newRefreshToken = $this->generateRefreshToken($user);

        return [
            'tokens' => [
                'access_token' => $newToken,
                'refresh_token' => $newRefreshToken,
                'expires_in' => auth('api')->factory()->getTTL() * 60,
            ],
        ];
    }

    public function logout(): void
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (JWTException $e) {
            // Token already invalid
        }
    }

    public function verifyEmail(string $token): array
    {
        $user = User::where('email_verification_token', $token)
            ->where('email_verified_at', null)
            ->first();

        if (!$user) {
            throw new \Exception('Invalid or expired token', 400);
        }

        $user->update([
            'email_verified_at' => now(),
            'email_verification_token' => null,
            'status' => 'active',
        ]);

        return ['user' => $user, 'message' => 'Email verified successfully'];
    }

    public function forgotPassword(string $email): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new \Exception('User not found', 404);
        }

        $token = \Str::random(64);
        $user->update(['reset_token' => $token, 'reset_token_expires_at' => now()->addHours(2)]);

        // TODO: Send email with reset link

        return ['message' => 'Password reset email sent'];
    }

    public function resetPassword(string $token, string $password): array
    {
        $user = User::where('reset_token', $token)
            ->where('reset_token_expires_at', '>', now())
            ->first();

        if (!$user) {
            throw new \Exception('Invalid or expired token', 400);
        }

        $user->update([
            'password' => Hash::make($password),
            'reset_token' => null,
            'reset_token_expires_at' => null,
        ]);

        return ['message' => 'Password reset successfully'];
    }

    private function createRoleProfile(User $user, array $data): void
    {
        match ($user->role) {
            'student' => Student::create([
                'user_id' => $user->id,
                'full_name' => $data['full_name'],
                'total_xp' => 0,
                'current_level' => 1,
                'country_code' => $data['country_code'] ?? 'BD',
            ]),
            'trainer' => Trainer::create([
                'user_id' => $user->id,
                'full_name' => $data['full_name'],
                'is_approved' => false,
                'country_code' => $data['country_code'] ?? 'BD',
            ]),
            'company' => Company::create([
                'user_id' => $user->id,
                'company_name' => $data['company_name'] ?? $data['full_name'],
                'kyc_status' => 'pending',
                'is_verified' => false,
                'country_code' => $data['country_code'] ?? 'BD',
            ]),
        };
    }

    private function generateRefreshToken(User $user): string
    {
        RefreshToken::where('user_id', $user->id)->delete();

        $token = Str::random(64);
        RefreshToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => now()->addDays(7),
        ]);

        return $token;
    }

    private function validateRefreshToken(string $token): ?User
    {
        $refreshToken = RefreshToken::where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$refreshToken) {
            return null;
        }

        return $refreshToken->user;
    }
}
