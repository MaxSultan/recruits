import { EnhancedWrestlerSpreadsheetComponent } from "@/components/enhanced-wrestler-spreadsheet";
import { EnhancedWrestlingRecruitsBoard } from "@/components/enhanced-wrestling-recruits-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/utils/supabase/server";

export default async function Home() {
  const { data: athletes, error } = await supabase.from("athletes").select();

  return (
    <div className="pt-32 px-16">
      <Tabs defaultValue="perspective-spreadsheet" className="w-full">
        <TabsList>
          <TabsTrigger value="perspective-spreadsheet">
            Perspective Spreadsheet
          </TabsTrigger>
          <TabsTrigger value="recruit-board">Recruits</TabsTrigger>
          <TabsTrigger value="projected-lineup">Projected Lineup</TabsTrigger>
        </TabsList>
        <TabsContent value="recruit-board">
          <EnhancedWrestlingRecruitsBoard />
        </TabsContent>
        <TabsContent value="perspective-spreadsheet">
          <EnhancedWrestlerSpreadsheetComponent
            athletes={athletes.map((athlete) => ({
              ...athlete,
              winPercentage:
                (athlete.wins / (athlete.wins + athlete.losses)) * 100 || 0,
            }))}
          />
        </TabsContent>
        <TabsContent value="projected-lineup">Add projected Lineup</TabsContent>
      </Tabs>
    </div>
  );
}
