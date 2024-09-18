import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import {
  Play,
  FileInput,
  FileOutput,
  ChevronRight,
  ChevronDown,
  File,
  Folder,
} from "lucide-react";
import axios from "axios";

const languages = ["javascript", "python", "java", "cpp", "typescript"];
const languageIds = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  typescript: 74,
};
const themes = ["vs-dark", "light"];

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

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

const initialFiles: FileItem[] = [
  {
    name: "src",
    type: "folder",
    children: [
      { name: "index.js", type: "file" },
      { name: "styles.css", type: "file" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [{ name: "index.html", type: "file" }],
  },
  { name: "package.json", type: "file" },
  { name: "README.md", type: "file" },
];

const RAPIDAPI_KEY = "eb27743981mshcd2e5b0c4572cc7p1d59d6jsn722b9471e68a";

export default function CodeIDE() {
  const [language, setLanguage] = useState<keyof typeof languageIds>("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(boilerplateCode["javascript"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [files] = useState(initialFiles);
  const [expandedFolders, setExpandedFolders] = useState(["src", "public"]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((name) => name !== folderName)
        : [...prev, folderName]
    );
  };

  const handleRun = async () => {
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
          language_id: languageIds[language],
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
    // Update the code when language changes
    setCode(boilerplateCode[language]);
  }, [language]);

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item: FileItem) => (
      <div key={item.name} style={{ paddingLeft: `${depth * 12}px` }}>
        {item.type === "folder" ? (
          <div
            className="flex items-center py-1 cursor-pointer hover:bg-[#2a2d2e]"
            onClick={() => toggleFolder(item.name)}
          >
            {expandedFolders.includes(item.name) ? (
              <ChevronDown className="w-4 h-4 mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1" />
            )}
            <Folder className="w-4 h-4 mr-2" />
            <span>{item.name}</span>
          </div>
        ) : (
          <div className="flex items-center py-1 cursor-pointer hover:bg-[#2a2d2e]">
            <File className="w-4 h-4 mr-2 ml-5" />
            <span>{item.name}</span>
          </div>
        )}
        {item.type === "folder" && expandedFolders.includes(item.name) && (
          <div>{item.children && renderFileTree(item.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="">
      {/* <Navbar /> */}
      <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
        <div className="flex justify-between items-center p-2 bg-[#252526] border-b border-[#3c3c3c]">
          <div className="flex items-center space-x-2 text-[20px] ml-6 gap-4">
            <Select
              onValueChange={(value: keyof typeof languageIds) => setLanguage(value)}
              value={language}
            >
              <SelectTrigger className="w-[180px] bg-[#3c3c3c] border-[#6b6b6b]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-[#252526] border-[#6b6b6b]">
                {languages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                    className="text-white hover:bg-[#3c3c3c]"
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setTheme(value)} value={theme}>
              <SelectTrigger className="w-[180px] bg-[#3c3c3c] border-[#6b6b6b]">
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent className="bg-[#252526] border-[#6b6b6b]">
                {themes.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                    className="text-white hover:bg-[#3c3c3c]"
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleRun}
            className="bg-[#0e639c] hover:bg-[#1177bb] text-white"
            disabled={loading}
          >
            <Play className="w-4 h-4 mr-2" />
            {loading ? "Running..." : "Run Code"}
          </Button>

          <div className="flex gap-10 mr-14">
            <h1>
              <a
                title=""
                href="/"
                className="cursor-pointer text-[20px] font-medium text-white transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                Home
              </a>
            </h1>

            <h1>
              <a
                title=""
                href="/event-tracker"
                className="cursor-pointer text-[20px] font-medium text-white transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                Event Tracker
              </a>
            </h1>

            <h1>
              <a
                title=""
                href="/code"
                className="cursor-pointer text-[20px] font-medium text-white transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                Code Faster
              </a>
            </h1>

          </div>
        </div>
        <PanelGroup direction="horizontal" className="flex-grow">
          <Panel defaultSize={15} minSize={10}>
            <div className="h-full text-[22px] bg-[#252526] overflow-auto">
              <div className="p-2 font-semibold text-sm">EXPLORER</div>
              {renderFileTree(files)}
            </div>
          </Panel>
          <PanelResizeHandle className="w-2 bg-[#3c3c3c] hover:bg-[#6b6b6b] transition-colors" />
          <Panel defaultSize={55} minSize={30}>
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                },
                fontSize: 20
              }}
            />
          </Panel>
          <PanelResizeHandle className="w-2 bg-[#3c3c3c] hover:bg-[#6b6b6b] transition-colors" />
          <Panel defaultSize={30} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={30} minSize={20}>
                <div className="h-full  flex flex-col">
                  <div className="p-2 bg-[#252526] border-b border-[#3c3c3c] flex items-center">
                    <FileInput className="w-4 h-4 mr-2" />
                    <h3 className="text-[20px] font-semibold">Input</h3>
                  </div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input here..."
                    className="h-full text-[20px]  resize-none bg-[#1e1e1e] text-white border-none focus:ring-0"
                  />
                </div>
              </Panel>
              <PanelResizeHandle className="h-2 bg-[#3c3c3c] hover:bg-[#6b6b6b] transition-colors" />
              <Panel defaultSize={70} minSize={20}>
                <div className="h-full flex flex-col">
                  <div className="p-2 bg-[#252526] border-b border-[#3c3c3c] flex items-center">
                    <FileOutput className="w-4 h-4 mr-2" />
                    <h3 className="text-[20px]  font-semibold">Output</h3>
                  </div>
                  <Textarea
                    value={output}
                    readOnly
                    placeholder="Output will appear here..."
                    className="h-full text-[20px]  resize-none bg-[#1e1e1e] text-white border-none focus:ring-0"
                  />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
