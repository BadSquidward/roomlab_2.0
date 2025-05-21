
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";

interface AIProviderConfigProps {
  onSave: (config: AIProviderSettings) => void;
  currentConfig?: AIProviderSettings;
}

export interface AIProviderSettings {
  provider: string;
  apiKey: string;
  model: string;
}

const AIProviderConfig: React.FC<AIProviderConfigProps> = ({ onSave, currentConfig }) => {
  const [config, setConfig] = useState<AIProviderSettings>(
    currentConfig || {
      provider: "openai",
      apiKey: "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",
      model: "gpt-image-1"
    }
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(config);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configure AI Provider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Provider Configuration</DialogTitle>
          <DialogDescription>
            Configure your preferred AI provider for generating design images. Your API key will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">
              Provider
            </Label>
            <div className="col-span-3">
              <Select 
                value={config.provider} 
                onValueChange={(value) => setConfig({ ...config, provider: value })}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <div className="col-span-3">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <div className="col-span-3">
              <Select 
                value={config.model} 
                onValueChange={(value) => setConfig({ ...config, model: value })}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-image-1">GPT Image 1</SelectItem>
                  <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                  <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIProviderConfig;
