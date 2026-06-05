<?php

namespace App\Events;

use App\Models\Interview;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SessionCompleted
{
    use Dispatchable, SerializesModels;

    public Interview $interview;

    /**
     * Create a new event instance.
     */
    public function __construct(Interview $interview)
    {
        $this->interview = $interview;
    }
}
