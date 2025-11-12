import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrayControlTab } from "./array/ArrayControlTab";
import { ArrayOOQSTab } from "./array/ArrayOOQSTab";
import { ArrayPMCTab } from "./array/ArrayPMCTab";
import { ArrayWebcamsTab } from "./array/ArrayWebcamsTab";

export const ArrayTab = () => {
  return (
    <div className="h-full overflow-auto">
      <Tabs defaultValue="control" className="h-full flex flex-col">
        <TabsList className="mx-6 mt-6">
          <TabsTrigger value="control">Array Control</TabsTrigger>
          <TabsTrigger value="ooqs">OOQS</TabsTrigger>
          <TabsTrigger value="pmc">PMC</TabsTrigger>
          <TabsTrigger value="webcams">Webcams</TabsTrigger>
        </TabsList>

        <TabsContent value="control" className="flex-1 overflow-auto">
          <ArrayControlTab />
        </TabsContent>

        <TabsContent value="ooqs" className="flex-1 overflow-auto">
          <ArrayOOQSTab />
        </TabsContent>

        <TabsContent value="pmc" className="flex-1 overflow-auto">
          <ArrayPMCTab />
        </TabsContent>

        <TabsContent value="webcams" className="flex-1 overflow-auto">
          <ArrayWebcamsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
