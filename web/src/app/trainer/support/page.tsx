'use client';

import { Card, CardBody, CardHeader, Button } from '@/components/ui';
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Support</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardBody className="text-center py-8">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">support@nexthire.com</p>
            <Button variant="outline" size="sm">Send Email</Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
            <Button variant="outline" size="sm">Start Chat</Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center py-8">
            <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">+1-800-NEXTHIRE</p>
            <Button variant="outline" size="sm">Call Us</Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center py-8">
            <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-sm text-gray-600 mb-4">Browse common questions</p>
            <Button variant="outline" size="sm">View FAQ</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
