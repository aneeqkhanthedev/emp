import { notFound } from 'next/navigation';
import { getEmployeeById, getBaseUrl } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import QRCodeDisplay from '@/components/qr-code';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const employee = await getEmployeeById(id);

  if (!employee) {
    return {
      title: 'Employee Not Found',
    }
  }

  return {
    title: `Status: ${employee.name}`,
    description: `Check the current status of ${employee.name}`,
  }
}


export default async function EmployeeStatusPage({ params }: { params: { id: string } }) {
  const employee = await getEmployeeById(params.id);

  if (!employee) {
    notFound();
  }

  const qrCodeUrl = `${getBaseUrl()}/employee/${employee.id}`;
  const isAuthorized = employee.status === 'authorized';

  return (
    <div className="flex flex-col items-center pt-12">
      <Card className={`w-full max-w-md transition-all duration-300 ease-in-out shadow-lg ${isAuthorized ? 'border-green-500' : 'border-destructive'}`}>
        <CardHeader className="text-center pb-4">
           <div className="flex justify-center mb-4">
             <QRCodeDisplay text={qrCodeUrl} size={150} alt={`QR Code for ${employee.name}`} />
           </div>
          <CardTitle className="text-2xl">{employee.name}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-1">
             <Briefcase className="h-4 w-4 text-muted-foreground" /> {employee.position}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">

          <Badge
            variant={isAuthorized ? 'default' : 'destructive'}
            className={`px-4 py-2 text-lg font-semibold transition-colors duration-300 ${isAuthorized ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
          >
            {isAuthorized ? (
              <CheckCircle className="mr-2 h-5 w-5" />
            ) : (
              <XCircle className="mr-2 h-5 w-5" />
            )}
            {isAuthorized ? 'Authorized Person' : 'Unauthorized Person'}
          </Badge>
           <p className="text-xs text-muted-foreground text-center pt-2">
             Scan the QR code above to verify status.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
