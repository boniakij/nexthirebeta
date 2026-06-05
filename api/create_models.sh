#!/bin/bash

# Create models
php artisan make:model User -m
php artisan make:model Student -m
php artisan make:model Trainer -m
php artisan make:model Company -m
php artisan make:model Package -m
php artisan make:model TrainerAvailability -m
php artisan make:model Interview -m
php artisan make:model Evaluation -m
php artisan make:model Badge -m
php artisan make:model UserBadge -m
php artisan make:model PointsLedger -m
php artisan make:model Ranking -m
php artisan make:model Payment -m
php artisan make:model Invoice -m
php artisan make:model Review -m
php artisan make:model HiringCampaign -m
php artisan make:model CampaignCandidate -m
php artisan make:model Chat -m
php artisan make:model Notification -m

