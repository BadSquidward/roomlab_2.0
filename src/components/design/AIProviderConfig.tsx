
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
      model: "dall-e-3"
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
                  <SelectItem value="stabilityai">Stability AI</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
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
              {config.provider === "openai" ? (
                <Select 
                  value={config.model} 
                  onValueChange={(value) => setConfig({ ...config, model: value })}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                    <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                  </SelectContent>
                </Select>
              ) : config.provider === "stabilityai" ? (
                <Select 
                  value={config.model} 
                  onValueChange={(value) => setConfig({ ...config, model: value })}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stable-diffusion-xl">Stable Diffusion XL</SelectItem>
                    <SelectItem value="stable-diffusion-3">Stable Diffusion 3</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select 
                  value={config.model} 
                  onValueChange={(value) => setConfig({ ...config, model: value })}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-2.0-flash-preview-image-generation">Gemini 2.0 Flash Preview</SelectItem>
                    <SelectItem value="imagen-3.0-generate-002">Imagen 3.0</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
