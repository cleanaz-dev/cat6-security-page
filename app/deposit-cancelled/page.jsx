export const dynamic = 'force-dynamic';

'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DepositCancelledPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const paymentStatus = searchParams.get('payment');
  const uuid = searchParams.get('id');

  if (paymentStatus !== 'cancelled') {
    router.push('/');
    return null;
  }

  const handleRetryPayment = () => {
    // Redirect back to the form or payment flow
    router.push(`/?retry=true&id=${uuid}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600">
            Your security deposit payment was not completed
          </p>
        </div>

        {/* Information Alert */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800">
            Don't worry! No charges were made to your account. 
            You can try again or contact us for assistance.
          </AlertDescription>
        </Alert>

        {/* What Happened Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">What Happened?</CardTitle>
            <CardDescription>
              Your payment was cancelled before completion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <p className="text-gray-600">
                This can happen for several reasons:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>You clicked the back button or closed the payment window</li>
                <li>The payment session expired</li>
                <li>There was a technical issue</li>
                <li>You chose to cancel the transaction</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">What You Can Do</CardTitle>
            <CardDescription>
              Choose from the options below to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Try Payment Again</p>
                    <p className="text-sm text-gray-600">
                      Return to complete your security deposit
                    </p>
                  </div>
                  <Button onClick={handleRetryPayment}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Need Help?</p>
                    <p className="text-sm text-gray-600">
                      Contact our support team for assistance
                    </p>
                  </div>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => router.push('/')}
            variant="outline" 
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return Home
          </Button>
          
          <Button 
            onClick={handleRetryPayment}
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">Was I charged for this cancelled payment?</p>
                <p className="text-gray-600">
                  No, cancelled payments are not charged to your account.
                </p>
              </div>
              
              <div>
                <p className="font-medium text-gray-900">How long is my application valid?</p>
                <p className="text-gray-600">
                  Your application remains active for 48 hours. You can complete the payment within this time.
                </p>
              </div>
              
              <div>
                <p className="font-medium text-gray-900">Can I use a different payment method?</p>
                <p className="text-gray-600">
                  Yes, when you retry the payment, you can choose a different card or payment method.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}