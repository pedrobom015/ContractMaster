// @ts-nocheck
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BatchChkForm } from "./batch-chk-form";

export function NewSettlementDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="neu-button neu-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Acerto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Novo Acerto com Cobrador</DialogTitle>
        </DialogHeader>
        <BatchChkForm 
          onSuccess={() => {
            setIsOpen(false);
            queryClient.invalidateQueries({ queryKey: ['/api/batch-checks'] });
            toast({ title: "Acerto registrado com sucesso" });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}