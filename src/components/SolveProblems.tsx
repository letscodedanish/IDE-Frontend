import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import axios from "axios";

interface Problem {
  id: number;
  title: string;
  description: string;
  testCases: { input: string; output: string }[];
}

interface CodeTemplate {
  id: number;
  template: string;
}

interface CodeTemplates {
  [language: string]: CodeTemplate;
}

export default function SolveProblems() {
  const [language, setLanguage] = useState("javascript");
  const [theme] = useState("vs-dark");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [codeTemplates, setCodeTemplates] = useState<CodeTemplates>({});
  const [testResult, setTestResult] = useState("");

  // Fetch Codeforces Problems
  const fetchCodeforcesProblems = async () => {
    try {
      const response = await fetch("https://codeforces.com/api/problemset.problems");
      const data = await response.json();
      if (data.status === "OK") {
        // Map the problem data to your problem interface structure
        const problems = data.result.problems;
        setProblems(problems.map((p: { name: string; index: string }, idx: number) => ({
          id: idx,
          title: p.name,
          description: p.index, // Problem index and name for uniqueness
          testCases: [], // You might need to scrape or manually add test cases.
        })));
      }
    } catch (error) {
      console.error("Error fetching Codeforces problems:", error);
    }
  };

  useEffect(() => {
    const fetchCodeTemplates = async () => {
      try {
        const codeTemplatesResponse = await fetch("/data/codevalue.json");
        const codeTemplatesData = await codeTemplatesResponse.json();
        setCodeTemplates(codeTemplatesData);
        setCode(codeTemplatesData["javascript"]); // Default language code
      } catch (error) {
        console.error("Error fetching code templates:", error);
      }
    };

    fetchCodeforcesProblems(); // Fetch Codeforces problems
    fetchCodeTemplates(); // Fetch code templates
  }, []);

  const handleRun = async () => {
    setLoading(true);
    setTestResult(""); // Clear previous results
    try {
      const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions",
        params: { base64_encoded: "false", wait: "true" },
        headers: {
          "content-type": "application/json",
          language_id: codeTemplates[language]?.id || 63, // Fallback to JavaScript id
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
        data: {
          source_code: code,
          language_id: (codeTemplates[language] as CodeTemplate)?.id || 63, // Fallback to JavaScript id
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

  const runTestCases = async () => {
    if (!selectedProblem) return;

    setTestResult("Running test cases...");
    for (const testCase of selectedProblem.testCases) {
      setInput(testCase.input);
      await handleRun();
      if (output.trim() !== testCase.output.trim()) {
        setTestResult(`Test case failed!\nInput: ${testCase.input}\nExpected: ${testCase.output}\nGot: ${output}`);
        return;
      }
    }
    setTestResult("All test cases passed!");
  };

  useEffect(() => {
    if (codeTemplates[language]) {
      setCode(codeTemplates[language].template);
    }
  }, [language, codeTemplates]);

  return (
    <div className="flex h-screen">
      {/* Problem Dropdown */}
      <div className="w-1/4 bg-gray-100 border-r border-gray-300 p-4">
        <h2 className="text-lg font-semibold mb-4">Problems</h2>
        <Select onValueChange={(value) => setSelectedProblem(problems.find(p => p.id === parseInt(value)) || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a problem" />
          </SelectTrigger>
          <SelectContent>
            {problems.map((problem) => (
              <SelectItem key={problem.id} value={problem.id.toString()}>
                {problem.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Problem Details and Code Editor */}
      <div className="flex-1 flex flex-col">
        {selectedProblem ? (
          <>
            <div className="p-4 bg-white border-b border-gray-300">
              <h2 className="text-xl font-semibold">{selectedProblem.title}</h2>
              <p className="mt-2 text-gray-700">Problem Index: {selectedProblem.description}</p>
            </div>

            {/* Code and Test */}
            <div className="flex-1 flex">
              {/* Editor Section */}
              <div className="w-2/3 p-4 bg-gray-100">
                <div className="flex justify-between mb-2">
                  {/* Language Selector */}
                  <Select onValueChange={setLanguage} defaultValue={language}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(codeTemplates).map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Editor
                  height="80vh"
                  language={language}
                  theme={theme}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                />
              </div>

              {/* Input/Output Section */}
              <div className="w-1/3 p-4 bg-gray-50 border-l border-gray-300">
                <div className="flex flex-col gap-4">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Custom Input"
                    className="h-20"
                  />
                  <Textarea
                    value={output}
                    readOnly
                    placeholder="Output"
                    className="h-20"
                  />
                  <Button onClick={handleRun} disabled={loading}>
                    {loading ? "Running..." : "Run Code"}
                  </Button>
                  <Button onClick={runTestCases} disabled={loading}>
                    {loading ? "Running Tests..." : "Run Test Cases"}
                  </Button>
                  <div className="mt-4 text-green-500">{testResult}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Select a problem to start coding</p>
          </div>
        )}
      </div>
    </div>
  );
}
