'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function DepositConfirmedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  const paymentStatus = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');
  const uuid = searchParams.get('id');

  useEffect(() => {
    // Verify payment with your backend
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
          const data = await response.json();
          setPaymentData(data);
        } catch (error) {
          console.error('Payment verification failed:', error);
        }
      }
      setIsLoading(false);
    };

    verifyPayment();
  }, [sessionId]);

  if (paymentStatus !== 'success') {
    router.push('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your security deposit has been processed successfully
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Payment Details</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Completed
              </Badge>
            </div>
            <CardDescription>
              Transaction ID: {sessionId}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">Amount</p>
                <p className="text-gray-600">
                  ${paymentData?.amount ? (paymentData.amount / 100).toFixed(2) : '500.00'}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Payment Method</p>
                <p className="text-gray-600">
                  {paymentData?.payment_method || 'Credit Card'}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Date</p>
                <p className="text-gray-600">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Status</p>
                <p className="text-green-600 font-medium">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">What's Next?</CardTitle>
            <CardDescription>
              Here's what happens after your deposit payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium">Email Confirmation</p>
                  <p className="text-sm text-gray-600">
                    You'll receive a confirmation email with your receipt
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-gray-600">
                    Your application will be processed within 2-3 business days
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium">Next Steps</p>
                  <p className="text-sm text-gray-600">
                    We'll contact you with further instructions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => window.print()} 
            variant="outline" 
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          
          <Button 
            onClick={() => router.push('/')}
            className="flex-1"
          >
            Return Home
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Contact Support */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Need Help?</p>
              <p className="text-sm text-gray-600">
                Contact our support team if you have any questions
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}