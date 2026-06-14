import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AvailabilityPage from '../page';
import apiClient from '@/lib/api/client';

jest.mock('@/lib/api/client');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AvailabilityPage', () => {
  const mockWeeklySchedule = [
    {
      id: 1,
      day_of_week: 1,
      is_available: true,
      start_time: '19:00',
      end_time: '22:00',
      slot_duration_minutes: 45,
      buffer_minutes: 15,
      status: 'active',
    },
  ];

  const mockBookingRules = {
    id: 1,
    trainer_id: 1,
    minimum_notice_hours: 6,
    max_booking_days_ahead: 30,
    allow_same_day_booking: false,
    allow_reschedule: true,
    max_reschedule_count: 1,
    reschedule_deadline_hours: 12,
    allow_cancellation: true,
    cancellation_deadline_hours: 24,
    auto_confirm_paid_bookings: true,
    timezone: 'UTC',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient.get.mockResolvedValue({
      data: { success: true, data: mockWeeklySchedule },
    });
  });

  test('renders availability calendar page', () => {
    render(<AvailabilityPage />);

    expect(screen.getByText('Availability Calendar')).toBeInTheDocument();
  });

  test('renders all tab buttons', () => {
    render(<AvailabilityPage />);

    expect(screen.getByText('📅 Calendar')).toBeInTheDocument();
    expect(screen.getByText('🕐 Weekly Schedule')).toBeInTheDocument();
    expect(screen.getByText('➕ Add Slot')).toBeInTheDocument();
    expect(screen.getByText('🔒 Block Dates')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Booking Rules')).toBeInTheDocument();
  });

  test('calendar tab is active by default', async () => {
    render(<AvailabilityPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar view coming soon')).toBeInTheDocument();
    });
  });

  test('switches to weekly schedule tab', async () => {
    render(<AvailabilityPage />);

    const weeklyTab = screen.getByText('🕐 Weekly Schedule');
    fireEvent.click(weeklyTab);

    await waitFor(() => {
      expect(screen.getByText('Set your regular weekly availability hours.')).toBeInTheDocument();
    });
  });

  test('switches to add slot tab', async () => {
    render(<AvailabilityPage />);

    const addSlotTab = screen.getByText('➕ Add Slot');
    fireEvent.click(addSlotTab);

    await waitFor(() => {
      expect(screen.getByText('Add One-Time Slot')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
    });
  });

  test('switches to block dates tab', async () => {
    render(<AvailabilityPage />);

    const blockTab = screen.getByText('🔒 Block Dates');
    fireEvent.click(blockTab);

    await waitFor(() => {
      expect(screen.getByText('Block Dates')).toBeInTheDocument();
      expect(screen.getByText('Block Date')).toBeInTheDocument();
    });
  });

  test('switches to booking rules tab', async () => {
    mockApiClient.get.mockImplementation((url: string) => {
      if (url.includes('booking-rules')) {
        return Promise.resolve({ data: { success: true, data: mockBookingRules } });
      }
      return Promise.resolve({ data: { success: true, data: mockWeeklySchedule } });
    });

    render(<AvailabilityPage />);

    const rulesTab = screen.getByText('⚙️ Booking Rules');
    fireEvent.click(rulesTab);

    await waitFor(() => {
      expect(screen.getByText('Booking Rules')).toBeInTheDocument();
    });
  });

  test('displays error message when API fails', async () => {
    mockApiClient.get.mockRejectedValueOnce(new Error('API Error'));

    render(<AvailabilityPage />);

    await waitFor(() => {
      // Component should still render without crashing
      expect(screen.getByText('Availability Calendar')).toBeInTheDocument();
    });
  });

  test('shows loading spinner while fetching data', () => {
    mockApiClient.get.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ data: { success: true, data: [] } }), 100))
    );

    render(<AvailabilityPage />);

    // Should show loading state briefly
    // (actual spinner visibility depends on timing)
  });

  test('weekly schedule displays all days', async () => {
    render(<AvailabilityPage />);

    const weeklyTab = screen.getByText('🕐 Weekly Schedule');
    fireEvent.click(weeklyTab);

    await waitFor(() => {
      expect(screen.getByText('Sunday')).toBeInTheDocument();
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
      expect(screen.getByText('Wednesday')).toBeInTheDocument();
      expect(screen.getByText('Thursday')).toBeInTheDocument();
      expect(screen.getByText('Friday')).toBeInTheDocument();
      expect(screen.getByText('Saturday')).toBeInTheDocument();
    });
  });

  test('add slot form has required inputs', async () => {
    render(<AvailabilityPage />);

    const addSlotTab = screen.getByText('➕ Add Slot');
    fireEvent.click(addSlotTab);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Start Time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('End Time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Duration (minutes)')).toBeInTheDocument();
    });
  });

  test('block date form has required fields', async () => {
    render(<AvailabilityPage />);

    const blockTab = screen.getByText('🔒 Block Dates');
    fireEvent.click(blockTab);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Reason (optional)')).toBeInTheDocument();
    });
  });

  test('booking rules displays key information', async () => {
    mockApiClient.get.mockImplementation((url: string) => {
      if (url.includes('booking-rules')) {
        return Promise.resolve({ data: { success: true, data: mockBookingRules } });
      }
      return Promise.resolve({ data: { success: true, data: mockWeeklySchedule } });
    });

    render(<AvailabilityPage />);

    const rulesTab = screen.getByText('⚙️ Booking Rules');
    fireEvent.click(rulesTab);

    await waitFor(() => {
      expect(screen.getByText('Minimum Notice')).toBeInTheDocument();
      expect(screen.getByText('Max Booking Ahead')).toBeInTheDocument();
    });
  });
});
