import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QrCode, ScanLine, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-8">
      <h1 className="text-4xl font-bold text-primary mt-8">Welcome to EmployeePass</h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        Easily manage employee statuses and generate static QR codes for quick verification. Authorized personnel can update employee details and access levels seamlessly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2"><QrCode className="text-primary"/> QR Code Generation</CardTitle>
            <CardDescription className="text-center">Generate unique, static QR codes for each employee.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Each QR code links to the employee's current status page. The code remains the same even if the status or details change.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2"><ScanLine className="text-primary"/> Status Display</CardTitle>
            <CardDescription className="text-center">Instantly view an employee's authorization status.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">
              Scan the QR code to see if an employee is currently 'Authorized' or 'Unauthorized'. Status updates reflect immediately.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2"><Users className="text-primary"/> Data Management</CardTitle>
             <CardDescription className="text-center">Administer employee information and access levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Authorized administrators can easily add, update, or change the status of employees via the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Button asChild size="lg">
          <Link href="/admin">Go to Admin Panel</Link>
        </Button>
      </div>
    </div>
  );
}
