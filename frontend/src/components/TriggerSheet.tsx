import type { NodeKind } from "./CreateWorkFlow";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

const SUPPORTED_TRIGGERS = [
  {
    id: 'timer',
    title: 'Timer',
    description: 'Trigger your workflow at a specific time or interval.',
  },
  {
    id: 'price',
    title: 'Price Trigger',
    description: 'Trigger your workflow when a specific price condition is met.',
  },
] as const;

export const TriggerSheet = ({
  onSelect,
}: {
  onSelect: (kind: NodeKind) => void;
}) => {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Select Trigger</SheetTitle>
          <SheetDescription>Select a trigger to start your workflow.</SheetDescription>
        </SheetHeader>

        <Select
          onValueChange={(id) =>
            onSelect({
              trigger: id === 'timer' ? 'hyperliquid' : 'backpack',
              action: 'hyperliquid',
              condition: 'hyperliquid',
            })
          }
        >
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Choose a trigger" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SUPPORTED_TRIGGERS.map(({ id, title, description }) => (
                <SelectItem key={id} value={id}>
                  <div className="font-medium">{title}</div>
                  <div className="text-sm text-muted-foreground">{description}</div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </SheetContent>
    </Sheet>
  );
};
