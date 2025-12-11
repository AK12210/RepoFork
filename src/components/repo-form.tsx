"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { navigateToRepo } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Github, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

const GITHUB_REPO_REGEX = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+)(?:\/)?$/;

const FormSchema = z.object({
  url: z.string().regex(GITHUB_REPO_REGEX, {
    message: "Please enter a valid GitHub repository URL.",
  }),
});

export function RepoForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await navigateToRepo(data.url);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Invalid URL",
          description: result.error,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="https://github.com/facebook/react" 
                    {...field}
                    className="pl-10 h-12 text-base" 
                    disabled={isPending}
                    />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-12 text-base" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Analyze Repository"
          )}
        </Button>
      </form>
    </Form>
  );
}
