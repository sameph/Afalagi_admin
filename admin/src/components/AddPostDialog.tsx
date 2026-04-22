import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdminPost } from "@/lib/api";

interface AddPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultType?: 'lost_item' | 'found_item' | 'lost_person' | 'found_person';
}

export function AddPostDialog({ open, onOpenChange, onSuccess, defaultType = 'lost_item' }: AddPostDialogProps) {
  const [type, setType] = useState(defaultType);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(formRef.current);
      // FormData will automatically pick up inputs with name attributes.
      // Append the type manually since it's controlled by shadcn select.
      formData.set('type', type);
      
      await createAdminPost(formData);
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong while creating the report.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPerson = type === "lost_person" || type === "found_person";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>Add New Report</DialogTitle>
        </DialogHeader>

        {error && <div className="text-sm text-destructive font-medium border border-destructive/20 p-3 rounded-md bg-destructive/10">{error}</div>}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lost_item">Lost Item</SelectItem>
                  <SelectItem value="found_item">Found Item</SelectItem>
                  <SelectItem value="lost_person">Missing Person</SelectItem>
                  <SelectItem value="found_person">Found Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="Brief title" />
            </div>
            
            {isPerson ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="personName">Person's Name</Label>
                  <Input id="personName" name="personName" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" placeholder="Age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" defaultValue="">
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input id="itemName" name="itemName" placeholder="E.g., iPhone 14" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="E.g., Electronics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" name="brand" placeholder="E.g., Apple" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" name="color" placeholder="E.g., Space Gray" />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="City or Address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastSeenDate">Date (Lost/Found)</Label>
              <Input id="lastSeenDate" name="lastSeenDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" name="contactPhone" type="tel" placeholder="Contact number" />
            </div>

            <div className="space-y-2">
               <Label>{isPerson ? "Person Image" : "Item Image"}</Label>
               <Input 
                 name={isPerson ? "personImages" : "itemImages"} 
                 type="file" 
                 accept="image/*" 
                 multiple 
               />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" required placeholder="Detailed description of the item or person..." rows={4} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
