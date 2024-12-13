import { EnhancedWrestlerSpreadsheetComponent } from "@/components/enhanced-wrestler-spreadsheet";
import { EnhancedWrestlingRecruitsBoard } from "@/components/enhanced-wrestling-recruits-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/app/initialization";
import { pascalCaseKeys } from "@/utils/strings";

export default async function Home() {
  const { data: prospect, error } = await supabase
    .from("athletes")
    .select()
    .eq("status", "unrecruited");

  if (error) console.log(error);

  const normalizedProspects = [...(prospect ?? [])].map((athlete) =>
    pascalCaseKeys(athlete)
  );

  const { data: initialRecruits, error: recruitError } = await supabase
    .from("athletes")
    .select()
    .neq("status", "unrecruited");

  if (recruitError) console.log(recruitError);

  const normalizedInitialRecruits = [...(initialRecruits ?? [])].map(
    pascalCaseKeys
  );

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
          <EnhancedWrestlingRecruitsBoard
            initialRecruits={normalizedInitialRecruits}
          />
        </TabsContent>
        <TabsContent value="perspective-spreadsheet">
          <EnhancedWrestlerSpreadsheetComponent
            athletes={normalizedProspects}
          />
        </TabsContent>
        <TabsContent value="projected-lineup">Add projected Lineup</TabsContent>
      </Tabs>
    </div>
  );
}
