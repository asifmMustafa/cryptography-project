"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CaesarPanel } from "@/components/CaesarPanel";
import { AffinePanel } from "@/components/AffinePanel";
import { PlayfairPanel } from "@/components/PlayfairPanel";
import { HillPanel } from "@/components/HillPanel";
import { HillKnownPlaintextPanel } from "@/components/HillKnownPlaintextPanel";

const HomePage = () => {
  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Classical Cipher Toolkit
      </h1>

      <Separator className="my-6" />

      <Tabs defaultValue="caesar" className="w-full">
        <TabsList className="flex flex-wrap justify-start">
          <TabsTrigger value="caesar">Caesar</TabsTrigger>
          <TabsTrigger value="affine">Affine</TabsTrigger>
          <TabsTrigger value="playfair">Playfair</TabsTrigger>
          <TabsTrigger value="hill">Hill</TabsTrigger>
          <TabsTrigger value="hill-kpa">Hill KPA</TabsTrigger>
        </TabsList>

        <TabsContent value="caesar" className="mt-6">
          <CaesarPanel />
        </TabsContent>

        <TabsContent value="affine" className="mt-6">
          <AffinePanel />
        </TabsContent>

        <TabsContent value="playfair" className="mt-6">
          <PlayfairPanel />
        </TabsContent>

        <TabsContent value="hill" className="mt-6">
          <HillPanel />
        </TabsContent>

        <TabsContent value="hill-kpa" className="mt-6">
          <HillKnownPlaintextPanel />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default HomePage;
