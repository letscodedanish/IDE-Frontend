import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const fitAddon = new FitAddon();

const OPTIONS_TERM = {
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
  cols: 1000,
};

export const TerminalComponent = ({ socket }: { socket: Socket }) => {
  const terminalRef = useRef<Terminal>();
  let inputBuffer = "";
  useEffect(() => {
    if (!terminalRef.current || !socket) {
      return;
    }

    const term = new Terminal({
      ...OPTIONS_TERM,
      cursorBlink: true,
      convertEol: true,
      cursorStyle: "block",
      scrollOnUserInput: true,
      rows: 14,
      theme: {
        background: "black", // VS Code terminal background color
        foreground: "#d4d4d4", // VS Code terminal text color
        cursor: "#ffffff", // VS Code terminal cursor color
      },
    });

    term.loadAddon(fitAddon);
    // @ts-ignore
    term.open(terminalRef.current);
    fitAddon.fit();
    // const socket = new WebSocket('ws://localhost:3001');

    const onDataHandler = (data: string) => {
      console.log("Received data from terminal:", data);

      // Append received data to a buffer
      if (!inputBuffer) {
        inputBuffer = ""; // Initialize inputBuffer if it's undefined or null
      }

      // Append the received data to the buffer
      inputBuffer += data;
      term.write(data);
      // Check if the input ends with a newline character (\r or \n) indicating Enter was pressed
      if (data.includes("\r") || data.includes("\n")) {
        // Remove newline characters and trim any leading/trailing whitespace
        const command = inputBuffer.replace(/[\r\n]+/g, "").trim();
        inputBuffer = "";
        //term.writeln('');

        if (command) {
          if (command === "clear") {
            term.clear();
            socket?.emit("terminalData", { data: command });
          } else {
            // Emit the complete command to the server
            socket?.emit("terminalData", { data: command });
            console.log("Command sent to server:", command);
          }
        }

        // Clear the input buffer after emitting the command
        inputBuffer = "";
      }
      if (data === "\x7F") {
        // Handle backspace (ASCII code \x7F)
        if (inputBuffer.length > 0) {
          // Remove the last character from the input buffer and update the terminal display
          inputBuffer = inputBuffer.slice(0, -1);
          term.write("\b \b");
          // @ts-ignore
          inputBuffer -= data;
          term.write(data); // Move cursor back, clear character, move cursor back
        }
      }
      // Handle Ctrl + C (SIGINT)
      if (data === "\x03") {
        // Send SIGINT signal (Ctrl + C)
        term.writeln("^C");
        term.write("\x03");
      }
    };

    term.onData(onDataHandler);
    console.log("Terminal onData handler set up");

    socket?.emit("requestTerminal");
    console.log("Requesting terminal");

    //socket?.emit('terminalData', { data: 'ls'});

    const terminalHandler = ({ data }: { data: ArrayBuffer }) => {
      const decoder = new TextDecoder("utf-8");
      const decodedString = decoder.decode(new Uint8Array(data));
      console.log("Received data from terminal", decodedString);

      // Ensure that data is written only when terminal is ready
      // @ts-ignore
      if (!term._initialized) {
        setTimeout(() => {
          const lines = decodedString.split("\n");
          // Write each line to the terminal
          lines.forEach((line) => {
            term.writeln(line.trim()); // Trim to remove leading/trailing whitespace
          });
        }, 100); // Delay to ensure proper rendering
      } else {
        term.write(decodedString);
      }
    };

    socket?.on("terminal", terminalHandler);
    console.log("Terminal connected");

    return () => {
      socket?.off("terminal", terminalHandler);
      term.dispose(); // Cleanup terminal instance
      console.log("Terminal disconnected");
    };
  }, [terminalRef, socket]);
  // @ts-ignore
  return (
    <div
      //@ts-ignore
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100vh",
        textAlign: "left",
        overflow: "hidden",
        resize: "both",
        border: "1px solid #333333", // VS Code terminal border color
      }}
    />
  );
};

