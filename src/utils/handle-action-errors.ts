import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import type { ValidationErrors } from "next-safe-action";
import type { z } from "zod";

export interface ActionResponse<S extends z.ZodType = z.ZodType> {
  data?: { success?: boolean; [key: string]: unknown };
  validationErrors?: ValidationErrors<S>;
  serverError?: string;
}

/**
 * Parses next-safe-action responses and maps validation errors to react-hook-form fields.
 * Returns global/root server error messages if present.
 */
export function handleActionErrors<TFormValues extends FieldValues>(
  result: ActionResponse | undefined,
  setError: UseFormSetError<TFormValues>,
): string | null {
  if (!result) return "An unknown error occurred.";

  // 1. Map Zod Validation Errors to React Hook Form Fields
  if (result.validationErrors) {
    const { _errors, ...fieldErrors } = result.validationErrors;

    // Handle field-level errors
    Object.entries(fieldErrors).forEach(([field, errorObj]) => {
      // Type assertion since next-safe-action nests field error arrays inside `_errors`
      const fieldError = errorObj as { _errors?: string[] } | undefined;
      const message = fieldError?._errors?.[0];

      if (message) {
        setError(field as Path<TFormValues>, {
          type: "server",
          message,
        });
      }
    });

    // If there are top-level form errors, return the first one as the main error message
    if (_errors && _errors.length > 0) {
      return _errors[0];
    }
  }

  // 2. Return Global Server Error (if thrown by safe action client)
  if (result.serverError) {
    return result.serverError;
  }

  return null;
}
