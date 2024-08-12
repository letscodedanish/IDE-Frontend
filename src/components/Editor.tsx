import { useEffect, useMemo, useState } from "react";
import {
  FaFile,
  FaFolder,
  FaTrash,
  FaPencilAlt,
  FaGithub,
} from "react-icons/fa";
import Sidebar from "./external/editor/components/sidebar";
import { Code } from "./external/editor/editor/code";
import styled from "@emotion/styled";
import {
  File,
  buildFileTree,
  RemoteFile,
} from "./external/editor/utils/file-manager";
import { FileTree } from "./external/editor/components/file-tree";
import { Socket } from "socket.io-client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./external/editor/utils/resizable";

const IconContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  background-color: black;
  border-bottom: 1px solid #ccc;
  width: 100%;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  color: black;
  flex: 1;
`;

const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Editor = ({
  files,
  onSelect,
  selectedFile,
  socket,
}: {
  files: RemoteFile[];
  onSelect: (file: File) => void;
  selectedFile: File | undefined;
  socket: Socket;
}) => {
  const [, setFileList] = useState(files);
  let rootDir = useMemo(() => buildFileTree(files), [files]);
// const [rootDir, setRootDir] = useState(useMemo(() => buildFileTree(files), [files]));
  const [repositoryLink, setRepositoryLink] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [createType, setCreateType] = useState<"file" | "folder" | null>(null);

  const handlePushToGitHub = () => {
    if (!repositoryLink) {
      alert("Please enter a valid repository link");
      return;
    }
    socket.emit("pushToGitHub", repositoryLink);
    console.log("Pushed to GitHub");
  };

  const handleCreateFile = () => {
    if (!newItemName) {
      alert("Please enter a valid file name");
      return;
    }
    socket.emit("createFile", newItemName);
    socket.on("fileCreated", () => {
    

    });
    
    
    setNewItemName("");
    setShowInput(false);
  };

  const handleCreateFolder = () => {
    if (!newItemName) {
      alert("Please enter a valid folder name");
      return;
    }
    socket.emit("createFolder", newItemName);
    setNewItemName("");
    setShowInput(false);
  };

  const handleDelete = () => {
    if (!selectedFile) {
      alert("Please select a file or folder to delete");
      return;
    }
    socket.emit("deleteItem", selectedFile.path);
    socket.on("fileDeleted", (deletedPath) => {
      setFileList((prevFiles) =>
        prevFiles.filter((file) => file.path !== deletedPath)
      );
      console.log("Deleted", deletedPath);
      if (selectedFile && selectedFile.path === deletedPath) {
        onSelect(undefined as any);
      }
    }
    );
  };

  const handleRename = () => {
    if (!selectedFile || !newItemName) {
      alert("Please select a file or folder to rename and enter a new name");
      return;
    }
    socket.emit("renameItem", {
      oldPath: selectedFile.path,
      newName: newItemName,
    });
    setNewItemName("");
  };

  useEffect(() => {
    if (!selectedFile) {
      onSelect(rootDir.files[0]);
    }
  }, [selectedFile, onSelect, rootDir.files]);

  useEffect(() => {
    socket.on("itemDeleted", (deletedPath) => {
      setFileList((prevFiles) =>
        prevFiles.filter((file) => file.path !== deletedPath)
      );
      console.log("Deleted", deletedPath);
      if (selectedFile && selectedFile.path === deletedPath) {
        onSelect(undefined as any);
      }
    });

    socket.on("githubPushResult", (result) => {
      if (result.success) {
        alert("Successfully pushed to GitHub");
      } else {
        alert(`Failed to push to GitHub: ${result.error}`);
      }
    });

    return () => {
      socket.off("itemDeleted");
      socket.off("githubPushResult");
    };
  }, [socket, selectedFile, onSelect]);

  return (
    <div>
      <Main>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30}>
            <SidebarContainer>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70}>
                  <Sidebar>
                    <IconContainer className="flex mx-auto">
                      {showInput && (
                        <Input
                          type="text"
                          placeholder={`Enter name for new ${createType}`}
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              createType === "file"
                                ? handleCreateFile()
                                : handleCreateFolder();
                            }
                          }}
                        />
                      )}
                      <IconButton
                        onClick={() => {
                          setShowInput(!showInput);
                          setCreateType("file");
                        }}
                        title="Create File"
                      >
                        <FaFile />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setShowInput(!showInput);
                          setCreateType("folder");
                        }}
                        title="Create Folder"
                      >
                        <FaFolder />
                      </IconButton>
                      <IconButton onClick={handleDelete} title="Delete">
                        <FaTrash />
                      </IconButton>
                      <IconButton onClick={handleRename} title="Rename">
                        <FaPencilAlt />
                      </IconButton>
                    </IconContainer>
                    <FileTree
                      rootDir={rootDir}
                      selectedFile={selectedFile}
                      onSelect={onSelect}
                    />
                  </Sidebar>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30}>
                  <IconContainer>
                    <Input
                      type="text"
                      placeholder="Enter GitHub repository link (e.g., https://github.com/username/repo.git)"
                      value={repositoryLink}
                      onChange={(e) => setRepositoryLink(e.target.value)}
                    />
                    <IconButton
                      onClick={handlePushToGitHub}
                      title="Push to GitHub"
                    >
                      <FaGithub />
                    </IconButton>
                  </IconContainer>
                </ResizablePanel>
              </ResizablePanelGroup>
            </SidebarContainer>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <Code socket={socket} selectedFile={selectedFile} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Main>
    </div>
  );
};
