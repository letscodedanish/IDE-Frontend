import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const Code: React.FC = () => {
  const codeValue = `//Write your code here 
console.log('Hello Danish, Lets code!');`;
  const [code, setCode] = useState<string>(codeValue);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [languageId, setLanguageId] = useState<number>(63);
  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("light");
  const RAPIDAPI_KEY = "eb27743981mshcd2e5b0c4572cc7p1d59d6jsn722b9471e68a";

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const runCode = async () => {
    setLoading(true);
    try {
      const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions",
        params: { base64_encoded: "false", wait: "true" },
        headers: {
          "content-type": "application/json",
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
        data: {
          source_code: code,
          language_id: languageId,
          stdin: input,
        },
      };

      const response = await axios.request(options);
      setOutput(response.data.stdout || response.data.stderr || "No output");
    } catch (error) {
      console.error("Error executing code:");
      setOutput("Code execution failed");
    }
    setLoading(false);
  };

  return (
    <div className="border m-4 md:m-10 border-black rounded-lg">
      <div className="p-4 w-full text-[16px] md:text-[20px]">
        {/* Language and Theme Selection */}
        <div className="flex flex-col md:flex-row mb-4 w-full gap-4 md:gap-10">
          <div>
            <label htmlFor="language" className="mr-2 font-semibold">
              Language:
            </label>
            <select
              id="language"
              value={languageId}
              onChange={(e) => setLanguageId(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="63">JavaScript</option>
              <option value="54">C++</option>
              <option value="62">Java</option>
              <option value="71">Python</option>
            </select>
          </div>

          <div>
            <label htmlFor="theme" className="mr-2 font-semibold">
              Editor Theme:
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast Black</option>
              <option value="vs">Mono</option>
            </select>
          </div>

          <button
            onClick={runCode}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 mt-4 md:mt-0"
            disabled={loading}
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>

        {/* Main content with editor and input/output fields */}
        <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
          {/* Code Editor on the left */}
          <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg">
            <Editor
              height="400px"
              defaultLanguage="javascript"
              theme={theme}
              value={code}
              options={{ fontSize: 18 }}
              onChange={handleEditorChange}
              defaultValue="//Write your code here 
console.log('Hello, Danish Lets code!');"
            />
          </div>

          {/* Input and Output on the right */}
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <label htmlFor="input" className="font-semibold">
                Input (stdin):
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full text-[16px] md:text-[20px] h-24 p-2 border border-gray-300 rounded-md"
                placeholder="Provide input if needed"
              />
            </div>

            <div>
              <label className="font-semibold">Output:</label>
              <pre className="w-full text-[16px] md:text-[20px] h-48 p-2 border border-gray-300 bg-gray-200 rounded-md overflow-y-auto">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Code;
  