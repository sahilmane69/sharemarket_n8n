import type { NodeKind } from "./CreateWorkFlow";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPORTED_TRIGGERS = [{
     id: "timer",
     title: "timer",
     description: "Trigger your workflow at a specific time or interval.";
},{
     id: "price",
     title: "Price Trigger",
     description: "Trigger your workflow when a specific price condition is met.";
}];
export const TriggerSheet = ({
     onSelect 
}:{ onSelect: (kind: NodeKind) => void }) => {
     return (
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Select Trigger</SheetTitle>
      <SheetDescription>Select a trigger to start your workflow.
          <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
          {SUPPORTED_TRIGGERS.map(({id, title, description}) => (
               <SelectItem key={id} value={id} onSelect={() => onSelect({trigger: id as unknown as NodeKind["trigger"], action: "hyperliquid", condition: "hyperliquid"})}>
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-muted-foreground">{description}</div>
               </SelectItem>
          ))}
    </SelectGroup>
  </SelectContent>
</Select>
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
     )
}
