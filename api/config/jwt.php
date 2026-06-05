<?php

return [
    'secret' => env('JWT_SECRET'),
    'ttl' => env('JWT_ACCESS_TTL', 15),
    'refresh_ttl' => env('JWT_REFRESH_TTL', 10080),
    'algo' => 'HS256',
    'blacklist_enabled' => true,
];
