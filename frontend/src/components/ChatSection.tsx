import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Typography,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatSectionProps {
  onSendMessage: (message: string) => void;
  chatMessages: { sender: "user" | "bot"; message: string }[];
}

const ChatSection: React.FC<ChatSectionProps> = ({
  onSendMessage,
  chatMessages,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <Paper
      elevation={2}
      className="chat-section"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "400px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box
        className="chat-messages-container"
        ref={chatMessagesRef}
        style={{
          flexGrow: 1,
          padding: "10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List sx={{ padding: 0 }}>
          {chatMessages.map((message, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              sx={{
                flexDirection:
                  message.sender === "user" ? "row-reverse" : "row",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                paddingY: 1,
              }}
            >
              <ListItemAvatar
                sx={{
                  marginRight: message.sender === "user" ? 0 : 2,
                  marginLeft: message.sender === "user" ? 2 : 0,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor:
                      message.sender === "user"
                        ? "primary.main"
                        : "secondary.main",
                  }}
                >
                  {message.sender === "user" ? "U" : "B"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1" color="textPrimary">
                    {message.message}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {message.sender === "user" ? "You" : "Bot"}
                    </Typography>
                  </React.Fragment>
                }
                sx={{
                  textAlign: message.sender === "user" ? "right" : "left",
                  wordWrap: "break-word",
                }}
                secondaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        className="chat-input-area"
        sx={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd" }}
      >
        <TextField
          placeholder="Type your question here..."
          value={inputMessage}
          onChange={handleInputChange}
          variant="outlined"
          multiline
          fullWidth
          rows={2}
          sx={{ marginRight: 1 }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          aria-label="send"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatSection;
