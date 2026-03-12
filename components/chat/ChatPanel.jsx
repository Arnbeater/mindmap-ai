"use client";

export default function ChatPanel() {
  return (
    <div className="chat-panel">
      <div className="chat-panel-inner">
        <h3>Chat</h3>

        <div className="chat-message">
          OpenAI is temporarily disabled in this version.
        </div>

        <div className="chat-message">
          You can still:
          {"\n"}• expand nodes with dummy data
          {"\n"}• add child nodes manually
          {"\n"}• edit node title and description
          {"\n"}• save and load locally
        </div>
      </div>
    </div>
  );
}
