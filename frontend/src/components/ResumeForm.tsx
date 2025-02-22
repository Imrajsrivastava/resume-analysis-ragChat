import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { uploadResumeApi } from "../services/api";

interface ResumeFormData {
  resumeFile: File | null;
}

const validationSchema = Yup.object().shape({
  resumeFile: Yup.mixed<File>()
    .required("Resume file is required")
    .test("fileType", "Unsupported File Format", (value) => {
      if (value) {
        return [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(value.type);
      }
      return true;
    }),
});

interface ResumeFormProps {
  onSubmitResponse: (response: any) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmitResponse }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (values: ResumeFormData, actions: any) => {
    setIsSubmitting(true);
    setUploadError("");
    try {
      if (!values.resumeFile) {
        setUploadError("Please select a resume file.");
        setIsSubmitting(false);
        return;
      }
      console.log(values.resumeFile);

      const formData = new FormData();
      formData.append("resume", values.resumeFile);

      const autofillData = await uploadResumeApi(formData);
      console.log("autofille response", autofillData);
      onSubmitResponse(autofillData);

      actions.setSubmitting(false);
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Resume upload failed:", error);
      setUploadError(
        "Error uploading and processing resume. Please try again."
      );
      setIsSubmitting(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ resumeFile: null } as ResumeFormData}
      validationSchema={validationSchema}
      onSubmit={handleFileUpload}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className="resume-form">
          <Box mb={2}>
            <Typography
              component="label"
              htmlFor="resumeFile"
              variant="subtitle1"
              display="block"
              mb={1}
            >
              Upload Resume (PDF or DOCX)
            </Typography>
            <input
              id="resumeFile"
              name="resumeFile"
              type="file"
              onChange={(event) => {
                setFieldValue("resumeFile", event.currentTarget.files![0]);
              }}
              className="form-field"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
            <ErrorMessage
              name="resumeFile"
              component="div"
              className="error-message"
            />
            {uploadError && (
              <div
                className="error-message"
                style={{
                  color: "#dc3545",
                  fontSize: "0.9rem",
                  marginTop: "5px",
                }}
              >
                {uploadError}
              </div>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            endIcon={
              isSubmitting && <CircularProgress size={20} color="inherit" />
            }
          >
            {isSubmitting ? "Uploading..." : "Upload & Get Response"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ResumeForm;
