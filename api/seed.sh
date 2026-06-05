#!/bin/bash

# Test Data Seeding Script
# This script sets up the database with test data

set -e

echo "========================================"
echo "NextHire Test Data Setup"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "Error: artisan file not found. Please run this script from the api directory."
    exit 1
fi

echo "🔍 Checking dependencies..."
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed."
    exit 1
fi

echo "✓ PHP found"
echo ""

echo "🗄️  Setting up database..."
echo ""

# Run migrations with fresh database
echo "→ Running: php artisan migrate:fresh --seed"
php artisan migrate:fresh --seed

echo ""
echo "========================================"
echo "✓ Database Setup Complete!"
echo "========================================"
echo ""
echo "📝 Test Credentials:"
echo ""
echo "Admin:"
echo "  Email:    admin@nexthire.com"
echo "  Password: admin@123"
echo ""
echo "Student:"
echo "  Email:    student1@nexthire.com"
echo "  Password: password123"
echo ""
echo "Trainer:"
echo "  Email:    trainer1@nexthire.com"
echo "  Password: password123"
echo ""
echo "Company:"
echo "  Email:    company1@nexthire.com"
echo "  Password: password123"
echo ""
echo "For more details, see TEST_DATA_SETUP.md"
echo "========================================"
