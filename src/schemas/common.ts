import { z } from "zod";

export const PaginationInfoSchema = z.object({
  tableName: z.string().nullish(),
  totalRows: z.number(),
  totalPages: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
  resultsCount: z.number(),
}).passthrough();

export const TrackedItemSchema = z.object({
  phrase: z.string().optional(),
  type: z.enum(["keyword", "user", "subreddit", "hashtag"]).optional(),
  platform: z.enum(["twitter", "instagram", "reddit", "tiktok"]).optional(),
}).passthrough();

export const AddTrackedItemsResultSchema = z.object({
  success: z.boolean().optional(),
  addedCount: z.number().optional(),
  message: z.string().optional(),
  currentCount: z.number().optional(),
  maxTrackedItems: z.number().optional(),
  planName: z.string().optional(),
}).passthrough();

export const RemoveTrackedItemsResultSchema = z.object({
  success: z.boolean().optional(),
  removedCount: z.number().optional(),
  message: z.string().optional(),
}).passthrough();

export const PlanFeaturesSchema = z.object({
  credits: z.number(),
  creditResetFrequency: z.enum(["monthly", "never"]),
  extraCreditPrice: z.number(),
  trackedItems: z.number().optional(),
  csvRowExportLimit: z.number(),
  extraCsvRowPrice: z.number(),
  extraTrackedItemPrice: z.number().optional(),
  maxRowsPerExport: z.number().optional(),
}).passthrough();

export const AccountDetailsSchema = z.object({
  plan: z.object({
    name: z.string(),
    features: PlanFeaturesSchema,
  }),
  billing: z.object({
    billingPeriod: z.enum(["monthly", "annual"]),
    nextRenewalDate: z.string().nullable(),
  }).nullable(),
  usage: z.object({
    subscriptionCreditsRemaining: z.number(),
    extraCreditsRemaining: z.number(),
    extraTrackedItems: z.number(),
  }),
}).passthrough();
