import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const languages = ["javascript", "python", "java", "cpp", "typescript"];
const languageIds = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  typescript: 74,
};

// Boilerplate code for each language
const boilerplateCode: Record<string, string> = {
  javascript: `// Write your code here
console.log('Hello World!');`,
  python: `# Write your code here
print('Hello World!')`,
  java: `// Write your code here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
  cpp: `// Write your code here
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
  typescript: `// Write your code here
console.log('Hello World!');`,
};

const Code: React.FC = () => {
  const [language, setLanguage] = useState<keyof typeof languageIds>("javascript");
  const [theme, setTheme] = useState("vs-light");
  const [code, setCode] = useState(boilerplateCode["javascript"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const RAPIDAPI_KEY = "eb27743981mshcd2e5b0c4572cc7p1d59d6jsn722b9471e68a";

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const runCode = async () => {
    setLoading(true);
    try {
      const languageId = languageIds[language]; // Correctly set languageId from the object
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
      console.error("Error executing code:", error);
      setOutput("Code execution failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Update the code when the language changes
    setCode(boilerplateCode[language]);
  }, [language]);

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
              onChange={(e) => setLanguage(e.target.value as keyof typeof languageIds)}
              value={language}
              className="p-2 border border-gray-300 rounded-md"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
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
              options={{ fontSize: 18, quickSuggestions: true, wordBasedSuggestions: true }}
              onChange={handleEditorChange}
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
