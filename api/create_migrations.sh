#!/bin/bash

# Create migrations in order
php artisan make:migration create_users_table --create=users
php artisan make:migration create_students_table --create=students
php artisan make:migration create_trainers_table --create=trainers
php artisan make:migration create_companies_table --create=companies
php artisan make:migration create_packages_table --create=packages
php artisan make:migration create_trainer_availability_table --create=trainer_availability
php artisan make:migration create_interviews_table --create=interviews
php artisan make:migration create_evaluations_table --create=evaluations
php artisan make:migration create_badges_table --create=badges
php artisan make:migration create_user_badges_table --create=user_badges
php artisan make:migration create_points_ledger_table --create=points_ledger
php artisan make:migration create_rankings_table --create=rankings
php artisan make:migration create_payments_table --create=payments
php artisan make:migration create_invoices_table --create=invoices
php artisan make:migration create_reviews_table --create=reviews
php artisan make:migration create_hiring_campaigns_table --create=hiring_campaigns
php artisan make:migration create_campaign_candidates_table --create=campaign_candidates
php artisan make:migration create_chats_table --create=chats
php artisan make:migration create_notifications_table --create=notifications

