import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { insertSysUserSchema, SysUser } from "../../../../shared/schema";

// Schema for the new user form, ensuring password is included for creation
const newUserFormSchema = insertSysUserSchema.extend({
  // Ensure passwordHash is part of the form schema if it's expected for user creation.
  // The base insertSysUserSchema from shared/schema.ts omits id, createdAt, updatedAt.
  // It includes passwordHash.
  passwordHash: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});

type NewUserFormData = z.infer<typeof newUserFormSchema>;

interface NewUserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUserCreated: (newUser: SysUser) => void;
}

export function NewUserDialog({
  isOpen,
  onOpenChange,
  onUserCreated,
}: NewUserDialogProps) {
  const { toast } = useToast();
  const form = useForm<NewUserFormData>({
    resolver: zodResolver(newUserFormSchema),
    defaultValues: {
      name: "", // This is sysUsers.name (unique username for login)
      login: "", // This is sysUsers.login (alternative login)
      email: "",
      passwordHash: "",
      firstName: "",
      lastName: "",
      active: true,
      isAdmin: false,
      // frontpageId, sysUnitId, etc., will be undefined or null by default from schema
    },
  });

  const handleFormSubmit = (data: NewUserFormData) => {
    console.log("New user data for submission:", data);
    // Mock creation:
    const newUserId = Math.floor(Math.random() * 10000) + 1000; // Mock ID
    const newUser: SysUser = {
      id: newUserId,
      name: data.name, // login/username
      login: data.login || data.name, // if login is empty, use name
      email: data.email,
      passwordHash: data.passwordHash, // In real scenario, this would be hashed by backend
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      active: data.active ?? true,
      isAdmin: data.isAdmin ?? false,
      frontpageId: null, // Or some default
      sysUnitId: null, // Or some default
      acceptedTermPolicyAt: null,
      acceptedTermPolicy: null,
      twoFactorEnabled: data.twoFactorEnabled ?? false,
      twoFactorType: null,
      twoFactorSecret: null,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      // Fill in any other required fields from SysUser type with defaults or null
      passwordSalt: null, // Example, if it's part of SysUser but not form
    };

    onUserCreated(newUser);
    toast({ title: "Sucesso", description: "Novo usuário titular criado com sucesso!" });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Criar Novo Usuário Titular</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo usuário que será o titular do contrato.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Usuário (para login) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: joao.silva" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primeiro Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João" className="neu-input" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Silva" className="neu-input" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Ex: joao.silva@example.com" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Pelo menos 6 caracteres" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Optional: Add login field if distinct from 'name' */}
            {/* <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Login Alternativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: jsilva" className="neu-input" {...field} value={field.value ?? ""}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="neu-button"
              >
                Cancelar
              </Button>
              <Button type="submit" className="neu-button neu-button-primary">
                Criar Usuário
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
