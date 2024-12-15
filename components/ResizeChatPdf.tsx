'use client'

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import PDFViewer from "./ui/PdfViewer"
import ChatComponent from "./ChatComponent";

type Props = { pdf_url: string, chatID:number};

export const ResizeChatPdf = ({pdf_url,chatID}: Props) => {
  return (
    <PanelGroup autoSaveId="example"  direction="horizontal">
    {/* pdf viewer */}
    <Panel defaultSize={40} className="ml-4">
    <div className="h-full w-full">
    <PDFViewer pdf_url= {pdf_url} />
  </div>
  </Panel>
  {/* chat component */}
  <PanelResizeHandle className="w-4 h-full !cursor-col-resize " />
  <Panel defaultSize={40}>
  <div className="">
    <ChatComponent chatID = {chatID}/>
  </div>
  </Panel>
  </PanelGroup>
  )
}
