<?php

namespace App\Http\Controllers\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());

            return response()->json([
                'success' => true,
                'data' => ['user' => $result['user']],
                'message' => $result['message'],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->email,
                $request->password
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $result['user'],
                    'tokens' => $result['tokens'],
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function refresh(Request $request): JsonResponse
    {
        try {
            $refreshToken = $request->input('refresh_token');

            if (!$refreshToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'Refresh token required',
                ], 400);
            }

            $result = $this->authService->refresh($refreshToken);

            return response()->json([
                'success' => true,
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        }
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        try {
            $token = $request->input('token');

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token required',
                ], 400);
            }

            $result = $this->authService->verifyEmail($token);

            return response()->json([
                'success' => true,
                'data' => ['user' => $result['user']],
                'message' => $result['message'],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        }
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $email = $request->input('email');

            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email required',
                ], 400);
            }

            $result = $this->authService->forgotPassword($email);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        }
    }

    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $token = $request->input('token');
            $password = $request->input('password');
            $passwordConfirm = $request->input('password_confirmation');

            if (!$token || !$password) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token and password required',
                ], 400);
            }

            if ($password !== $passwordConfirm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Passwords do not match',
                ], 400);
            }

            $result = $this->authService->resetPassword($token, $password);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        }
    }

    public function googleLogin(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Not implemented',
        ], 501);
    }

    public function sendOTP(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Not implemented',
        ], 501);
    }

    public function verifyOTP(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Not implemented',
        ], 501);
    }
}
