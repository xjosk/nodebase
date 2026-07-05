"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { LogoutButton } from "./logout";

const Page = () => {
  const trpc = useTRPC();
  const _queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: (ctx) => {
        toast.success(ctx.message);
      },
    }),
  );

  const testAI = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: (ctx) => {
        toast.success(ctx.message);
      },
      onError: (ctx) => {
        toast.success(ctx.message);
      },
    }),
  );

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server component
      {JSON.stringify(data, null, 2)}
      <Button
        disabled={testAI.isPending}
        onClick={() => {
          testAI.mutate();
        }}
      >
        Test AI
      </Button>
      <Button
        disabled={create.isPending}
        onClick={() => {
          create.mutate();
        }}
      >
        Create workflow
      </Button>
      <LogoutButton />
    </div>
  );
};

export default Page;
