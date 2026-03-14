import { Plus, Bell, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="neu-flat px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <div className="neu-button rounded-2xl p-3 cursor-pointer hover:shadow-lg transition-all">
            <div className="flex items-center">
              <div className="neu-flat rounded-lg w-8 h-8 flex items-center justify-center mr-2">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <span className="text-primary font-medium">Início</span>
            </div>
          </div>
        </Link>
        <div className="neu-pressed rounded-2xl px-4 py-2">
          <h2 className="text-xl font-semibold text-foreground">Sistema ERP</h2>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="neu-button rounded-2xl px-6 py-3 cursor-pointer hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-2">
              <Plus className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-secondary font-medium">Novo Contrato</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="neu-button rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="neu-button rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          
          <div className="neu-flat rounded-2xl p-3 flex items-center space-x-3">
            <span className="text-sm text-muted-foreground font-medium">João Silva</span>
            <div className="neu-pressed w-10 h-10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
              JS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
