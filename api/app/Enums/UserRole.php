<?php

namespace App\Enums;

enum UserRole: string
{
    case Student = 'student';
    case Trainer = 'trainer';
    case Company = 'company';
    case Admin = 'admin';
}
