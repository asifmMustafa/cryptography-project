import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ErrorBox = ({ message }: { message: string }) => {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>Could not complete operation</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export { ErrorBox };
