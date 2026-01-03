import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ResultBox = ({ value }: { value: string }) => {
  return (
    <Card className="mt-4">
      <CardHeader className="py-0">
        <CardTitle className="text-base">Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea value={value} readOnly className="min-h-[120px]" />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(value);
            }}
            disabled={!value}
          >
            Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ResultBox };
