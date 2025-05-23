/**
 * This file contains utility TypeScript interfaces used throughout the application.
 */

// Utility types for pagination and sorting
export interface PageableObject {
  pageNumber?: number;
  paged?: boolean;
  pageSize?: number;
  offset?: number;
  sort?: SortObject;
  unpaged?: boolean;
}

export interface SortObject {
  sorted?: boolean;
  unsorted?: boolean;
  empty?: boolean;
}

// Global Response Types
export interface StringResponse {
  message?: string;
}
