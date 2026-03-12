"use client";

export default function ChatPanel() {
  return (
    <div className="chat-panel">
      <div className="chat-panel-inner">
        <h3>Assistant</h3>

        <div className="chat-message">
          OpenAI is off in this version.
        </div>

        <div className="chat-message">
          You can still:
          {"\n"}• build the map
          {"\n"}• expand with dummy branches
          {"\n"}• edit the selected node
          {"\n"}• save and load locally
        </div>
      </div>
    </div>
  );
}
