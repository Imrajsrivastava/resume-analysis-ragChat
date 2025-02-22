import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import ChatSection from "./components/ChatSection";
import { sendMessageToChatbot } from "./services/api";
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

interface ChatMessage {
  sender: "user" | "bot";
  message: string;
}

interface ResumeFormData {
  resumeFile: File | null;
}

const App: React.FC = () => {
  const initialFormValues: ResumeFormData = {
    resumeFile: null,
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const [autofillMessage, setAutofillMessage] = useState<string | null>(null);

  const handleFormResponse = (response: any) => {
    console.log("Resume upload response:", response);
    setUploadResponse(response);
    setAutofillMessage("Resume uploaded and response received!");
  };

  const handleSendMessage = async (message: string) => {
    const newUserMessage: ChatMessage = { sender: "user", message: message };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const botResponse = await sendMessageToChatbot(message);
      const newBotMessage: ChatMessage = {
        sender: "bot",
        message: botResponse,
      };
      setChatMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      const errorBotMessage: ChatMessage = {
        sender: "bot",
        message: "Error communicating with chatbot.",
      };
      setChatMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        className="app-container"
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            textAlign: "center",
            backgroundColor: "primary.light",
            color: "white",
          }}
        >
          <Typography variant="h4" component="header" className="app-header">
            Resume Upload & Chat
          </Typography>
        </Paper>

        <Box
          className="app-main"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            padding: 2,
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <Paper
            elevation={2}
            className="form-section"
            sx={{ p: 3, flex: 1, minWidth: 300, mb: { xs: 2, md: 0 } }}
          >
            <Typography variant="h5" component="h2" color="primary" mb={2}>
              Upload Resume
            </Typography>
            <ResumeForm onSubmitResponse={handleFormResponse} />{" "}
            {uploadResponse && (
              <Box mt={2}>
                <Typography variant="subtitle1" component="div" mb={1}>
                  Backend Response:
                </Typography>
                <TextField
                  multiline
                  rows={5}
                  fullWidth
                  variant="outlined"
                  value={JSON.stringify(uploadResponse?.autofill, null, 2)}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            )}
          </Paper>

          <Paper
            elevation={2}
            className="chat-section-container"
            sx={{ p: 3, flex: 1, minWidth: 300, mb: { xs: 2, md: 0 } }}
          >
            <Typography variant="h5" component="h2" color="primary" mb={2}>
              Chat with Resume
            </Typography>
            {autofillMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {autofillMessage}
              </Alert>
            )}
            <ChatSection
              onSendMessage={handleSendMessage}
              chatMessages={chatMessages}
            />
          </Paper>
        </Box>

        <Box
          component="footer"
          className="app-footer"
          sx={{
            textAlign: "center",
            py: 2,
            mt: 3,
            color: "text.secondary",
            borderTop: "1px solid #eee",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © 2025 Resume App
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
