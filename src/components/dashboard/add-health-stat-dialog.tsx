'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { submitHealthStat } from '@/app/actions';
import { Loader2, PlusCircle } from 'lucide-react';

const healthStatSchema = z.object({
  systolic: z.coerce.number().min(50, "Must be > 50").max(300, "Must be < 300"),
  diastolic: z.coerce.number().min(30, "Must be > 30").max(200, "Must be < 200"),
  sugarLevel: z.coerce.number().min(30, "Must be > 30").max(500, "Must be < 500"),
  weight: z.coerce.number().min(20, "Must be > 20").max(300, "Must be < 300"),
  heartRate: z.coerce.number().min(30, "Must be > 30").max(250, "Must be < 250"),
});

export function AddHealthStatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof healthStatSchema>>({
    resolver: zodResolver(healthStatSchema),
    defaultValues: {
      systolic: 120,
      diastolic: 80,
      sugarLevel: 100,
      weight: 68,
      heartRate: 75,
    },
  });

  async function onSubmit(values: z.infer<typeof healthStatSchema>) {
    setIsSubmitting(true);
    const result = await submitHealthStat(values);
    setIsSubmitting(false);

    if (result.success && result.alert) {
      if(result.alert.shouldSendNotification) {
        toast({
          title: `Health Alert: ${result.alert.alertLevel.charAt(0).toUpperCase() + result.alert.alertLevel.slice(1)}`,
          description: result.alert.alertMessage,
          variant: result.alert.alertLevel === 'critical' ? 'destructive' : 'default',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Your health stats have been recorded.',
        });
      }
      form.reset();
      setIsOpen(false);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Add Vitals</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Health Stats</DialogTitle>
          <DialogDescription>Enter your latest vital signs. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="systolic"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Systolic BP</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="diastolic"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Diastolic BP</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="sugarLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sugar Level (mg/dL)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Heart Rate</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
