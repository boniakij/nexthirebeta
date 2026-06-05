<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Str;

class GenerateInvoice implements ShouldQueue
{
    use Queueable;

    protected Payment $payment;

    /**
     * Create a new job instance.
     */
    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $invoice = Invoice::create([
            'payment_id' => $this->payment->id,
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'invoice_data' => [
                'payment_id' => $this->payment->id,
                'amount' => $this->payment->amount,
                'commission' => $this->payment->commission,
                'gateway' => $this->payment->gateway,
                'status' => $this->payment->status,
                'created_at' => $this->payment->created_at,
            ],
        ]);

        // Generate PDF and store in S3
        try {
            $pdfPath = $this->generatePDF($invoice);
            $invoice->update(['pdf_path' => $pdfPath]);
        } catch (\Exception $e) {
            // Log error but don't fail the job
            \Log::error('Failed to generate invoice PDF', [
                'invoice_id' => $invoice->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Generate PDF invoice and store in S3
     */
    private function generatePDF(Invoice $invoice): string
    {
        // Placeholder for PDF generation
        // In production: use a library like TCPDF, mPDF, or Barryvdh's DomPDF
        // Example:
        // $pdf = PDF::loadView('invoices.template', ['invoice' => $invoice]);
        // $filename = 'invoices/invoice-' . $invoice->invoice_number . '.pdf';
        // Storage::disk('s3')->put($filename, $pdf->output());
        // return Storage::disk('s3')->url($filename);

        return 'invoices/invoice-' . $invoice->invoice_number . '.pdf';
    }
}
