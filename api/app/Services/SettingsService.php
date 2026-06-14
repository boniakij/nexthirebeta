<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class SettingsService
{
    private const SETTINGS_FILE = 'settings.json';

    /**
     * Get all settings (merged with defaults)
     */
    public function getSettings(): array
    {
        $defaults = $this->getDefaults();

        if (Storage::exists(self::SETTINGS_FILE)) {
            try {
                $saved = json_decode(Storage::get(self::SETTINGS_FILE), true);
                if (is_array($saved)) {
                    return array_replace_recursive($defaults, $saved);
                }
            } catch (\Exception $e) {
                // Fallback to defaults
            }
        }

        return $defaults;
    }

    /**
     * Get a specific setting key
     */
    public function get(string $key, $default = null)
    {
        $settings = $this->getSettings();
        $keys = explode('.', $key);

        foreach ($keys as $segment) {
            if (is_array($settings) && array_key_exists($segment, $settings)) {
                $settings = $settings[$segment];
            } else {
                return $default;
            }
        }

        return $settings;
    }

    /**
     * Update settings (merge with existing)
     */
    public function update(array $newSettings): array
    {
        $current = $this->getSettings();
        $merged = array_replace_recursive($current, $newSettings);
        Storage::put(self::SETTINGS_FILE, json_encode($merged, JSON_PRETTY_PRINT));
        return $merged;
    }

    /**
     * Get default settings structure
     */
    public function getDefaults(): array
    {
        return [
            'payment' => [
                'sslcommerz' => [
                    'store_id' => env('SSLCOMMERZ_STORE_ID', 'dev-store-id'),
                    'store_password' => env('SSLCOMMERZ_STORE_PASSWORD', 'dev-password'),
                    'sandbox' => true,
                    'enabled' => true,
                ],
                'bkash' => [
                    'app_key' => 'dev-key',
                    'app_secret' => 'dev-secret',
                    'username' => 'dev-user',
                    'password' => 'dev-pass',
                    'webhook_token' => env('BKASH_WEBHOOK_TOKEN', 'dev-token'),
                    'enabled' => true,
                ],
                'nagad' => [
                    'merchant_id' => 'dev-nagad-merchant',
                    'merchant_number' => '+8801700000000',
                    'public_key' => 'dev-public-key',
                    'private_key' => 'dev-private-key',
                    'enabled' => true,
                ],
                'stripe' => [
                    'client_id' => 'pk_test_dev',
                    'secret_key' => 'sk_test_dev',
                    'enabled' => true,
                ],
                'paypal' => [
                    'client_id' => 'dev-paypal-id',
                    'client_secret' => 'dev-paypal-secret',
                    'enabled' => true,
                ],
                'bank' => [
                    'bank_name' => 'Sonali Bank PLC',
                    'account_name' => 'NextHire Ltd.',
                    'account_number' => '1234567890123',
                    'routing_number' => '012345678',
                    'branch' => 'Dhaka Main Branch',
                    'enabled' => true,
                ]
            ],
            'video' => [
                'provider' => 'agora',
                'app_id' => env('AGORA_APP_ID', ''),
                'app_certificate' => env('AGORA_APP_CERTIFICATE', ''),
            ],
            'communication' => [
                'email_notifications' => true,
                'sms_notifications' => false,
                'push_notifications' => true,
            ]
        ];
    }
}
