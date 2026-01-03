"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { crackHillKeyKnownPlaintext } from "@/lib/crypto";
import { ErrorBox } from "./ErrorBox";
import { ResultBox } from "./ResultBox";

const HillKnownPlaintextPanel = () => {
  const [knownPlaintext, setKnownPlaintext] = useState("short example");
  const [knownCiphertext, setKnownCiphertext] = useState("APADJTFTWLFJ");

  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    setError(null);

    try {
      const recovered = crackHillKeyKnownPlaintext(
        knownPlaintext,
        knownCiphertext
      );
      // recovered: { matrix: [[...]], keyString: "HILL" }
      setResult(JSON.stringify(recovered, null, 2));
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hill Known-Plaintext Attack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Provide a known plaintext and its corresponding ciphertext.
          Punctuation/spaces are ignored by the cracker.
        </p>

        <div className="grid gap-2">
          <Label htmlFor="kpa-plain">Known Plaintext</Label>
          <Textarea
            id="kpa-plain"
            value={knownPlaintext}
            onChange={(e) => setKnownPlaintext(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="kpa-cipher">Corresponding Ciphertext</Label>
          <Textarea
            id="kpa-cipher"
            value={knownCiphertext}
            onChange={(e) => setKnownCiphertext(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={run}>Recover Key</Button>
          <Button variant="outline" onClick={() => setResult("")}>
            Clear Result
          </Button>
        </div>

        {error ? <ErrorBox message={error} /> : null}
        <ResultBox value={result} />
      </CardContent>
    </Card>
  );
};

export { HillKnownPlaintextPanel };
