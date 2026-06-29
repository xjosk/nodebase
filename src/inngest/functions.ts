// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    await step.sleep("Downloading video", "5s");

    await step.sleep("Transcribing video", "5s");

    await step.sleep("AI processing", "5s");

    await step.run("create-workflow", () => {
      return prisma.workflow.create({
        data: {
          name: "workflow-from-inngest",
        },
      });
    });
  },
);
