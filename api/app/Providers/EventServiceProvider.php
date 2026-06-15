<?php

namespace App\Providers;

use Illuminate\Auth\Events\Login;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        'App\Events\SessionCompleted' => [
            'App\Listeners\AwardSessionCompletionXP',
        ],
        Login::class => [
            'App\Listeners\AwardDailyLoginXP',
        ],
    ];

    public function boot(): void
    {
        //
    }
}
