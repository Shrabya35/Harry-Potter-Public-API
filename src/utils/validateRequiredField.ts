import { Response } from "express";

type RequiredFields = Record<string, any>;

interface ValidateOptions {
  edit?: boolean;
}

export const validateRequiredFields = (
  fields: RequiredFields,
  res: Response,
  options: ValidateOptions = {}
): boolean => {
  const { edit = false } = options;

  const missingFields = Object.entries(fields)
    .filter(
      ([_, value]) => value === undefined || value === null || value === ""
    )
    .map(([key]) => key);

  if (!edit && missingFields.length > 0) {
    res.status(400).json({
      success: false,
      message: "Missing required fields",
      missingFields,
    });
    return false;
  }

  if (edit && missingFields.length === Object.keys(fields).length) {
    res.status(400).json({
      success: false,
      message: "At least one field is required for edit",
      missingFields,
    });
    return false;
  }

  return true;
};
