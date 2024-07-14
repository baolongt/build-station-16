import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MakeEscrowForm } from "../form/MakeEscrow";

export function OpenMakeEscrowButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"lg"}
          variant={"default"}
          className="border-2 border-indigo-500 text-xl hover:bg-indigo-500 hover:text-white"
        >
          Make Escrow
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Make Escrow</DialogTitle>
        </DialogHeader>
        <MakeEscrowForm />
      </DialogContent>
    </Dialog>
  );
}
