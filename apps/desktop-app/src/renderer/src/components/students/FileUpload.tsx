import React, { ReactNode } from "react";
import { Upload, File } from "lucide-react";
import Typography from "../ui/Typography";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useStudentStore } from "@renderer/stores/useStudentStore";
import { toast } from "sonner";

// TODO: Add the upload data logic later on...
const FileUpload = (): React.ReactElement => {
  const { handleExcelUpload, loading } = useStudentStore();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await handleExcelUpload(file);
      if (!result.error) {
        toast.success("Student data uploaded successfully!");
      } else {
        toast.error("Upload failed", { description: result.error });
      }
    } catch (error: unknown) {
      toast.error("Unexpected error", { description: error as ReactNode });
    }
  };

  return (
    <div className="bg-PRIMARY-50 dark:bg-PRIMARY-900 border-PRIMARY-200 dark:border-PRIMARY-700 w-full rounded-lg border p-4 shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <File className="text-TEXTdark dark:text-TEXTlight h-10 w-10" />
        <div>
          <Typography
            variant="h4"
            className="text-TEXTdark dark:text-TEXTlight"
          >
            Upload Student Data
          </Typography>
          <Typography
            variant="small"
            className="text-TEXTmuted dark:text-TEXTmuted"
          >
            Upload an Excel file with student data for verification
          </Typography>
        </div>
      </div>

      <Label
        htmlFor="file-upload"
        className="bg-PRIMARY-200/40 dark:bg-PRIMARY-800/40 border-PRIMARY-400 dark:border-PRIMARY-600 hover:bg-PRIMARY-200/60 hover:dark:bg-PRIMARY-800/60 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition"
      >
        <Upload className="text-TEXTdark dark:text-TEXTlight h-8 w-8" />
        <div>
          <Typography
            variant="small"
            className="text-TEXTdark dark:text-TEXTlight font-semibold"
          >
            Click to upload{" "}
          </Typography>
          <Typography
            variant="small"
            className="text-TEXTmuted dark:text-TEXTmuted"
          >
            or drag and drop
          </Typography>
        </div>
        <Typography
          variant="small"
          className="text-TEXTmuted dark:text-TEXTmuted mt-1"
        >
          Excel files only (XLS, XLSX)
        </Typography>
        <Input
          id="file-upload"
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </Label>
    </div>
  );
};

export default FileUpload;
