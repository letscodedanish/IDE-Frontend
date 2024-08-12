import { useEffect, useState } from 'react';
import { Editor } from './Editor';
import { File, RemoteFile, Type } from './external/editor/utils/file-manager';
import { useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Output } from './Output';
import { TerminalComponent as Terminal } from './TerminalComponent';
import { Socket, io } from 'socket.io-client';
import { EXECUTION_ENGINE_URI } from '../config';
import { InfinitySpin } from 'react-loader-spinner';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './external/editor/utils/resizable';
import OutputWindow from './external/editor/components/localhost';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

function useSocket(replId: string) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        console.log("Connecting to socket");
        const newSocket = io(`${EXECUTION_ENGINE_URI}?roomId=${replId}`);
        setSocket(newSocket);
        console.log("Connected to socket", socket?.id);

        return () => {
            newSocket.disconnect();
        };
    }, [replId]);
    return socket;
}

export const CodingPage = () => {
    const [searchParams] = useSearchParams();
    const replId = searchParams.get('replId') ?? '';
    const [loaded, setLoaded] = useState(false);
    const socket = useSocket(replId);
    const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [showOutput, setShowOutput] = useState(false);
    
    useEffect(() => {
        if (socket) {
            socket.on('loaded', ({ rootContent }: { rootContent: RemoteFile[]}) => {
                setLoaded(true);
                setFileStructure(rootContent);
            });
        }
    }, [socket]);

    const onSelect = (file: File) => {
        if (file.type === Type.DIRECTORY) {
            socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
                setFileStructure(prev => {
                    const allFiles = [...prev, ...data];
                    return allFiles.filter((file, index, self) => 
                        index === self.findIndex(f => f.path === file.path)
                    );
                });
            });

        } else {
            socket?.emit("fetchContent", { path: file.path }, (data: string) => {
                file.content = data;
                setSelectedFile(file);
            });
        }
    };
    
    const handleOutputWindowClick = () => {
        setShowOutput(true);
    };

    if (!loaded) {
        return <div className='flex justify-center items-center h-screen'>
        <InfinitySpin
            //@ts-ignore
            visible={true}
            width="200"
            color="#4fa94d"
            ariaLabel="infinity-spin-loading"
        />
    </div>
    }

    return (
        <div className='bg-black text-white'> 
        {/* <Navbar /> */}
        <Container>
            
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={60}>
                    <Editor socket={socket!} selectedFile={selectedFile} onSelect={onSelect} files={fileStructure} />
                </ResizablePanel>
                
                <ResizableHandle withHandle className="resizable-handle" />
                
                <ResizablePanel defaultSize={40}>
                <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={30}>
                {!showOutput && (
                  <div className="output-placeholder hover:cursor-pointer" onClick={handleOutputWindowClick}>
                    <OutputWindow />
                  </div>
                )}
                {showOutput && <Output />}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={70}>
                <Terminal socket={socket!} />
              </ResizablePanel>
            </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </Container>
        </div>
    );
}
