'use client'

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import PDFViewer from "./ui/PdfViewer"
import ChatComponent from "./ChatComponent";
import React from "react";

type Props = { pdf_url: string, chatID:number};

export const ResizeChatPdf = ({pdf_url,chatID}: Props) => {
  const [navigationRequest, setNavigationRequest] = React.useState<{ page: number; key: number } | null>(null)

  const handleNavigateToPage = (page: number) => {
    setNavigationRequest({ page, key: Date.now() })
  }

  return (
    <PanelGroup autoSaveId="example"  direction="horizontal" className="h-full bg-fog">
    {/* pdf viewer */}
    <Panel defaultSize={40} className="ml-2">
    <div className="h-full w-full">
    <PDFViewer pdf_url= {pdf_url} navigationRequest={navigationRequest} />
  </div>
  </Panel>
  {/* chat component */}
  <PanelResizeHandle className="group relative flex w-3 items-center justify-center !cursor-col-resize">
    <span className="h-10 w-1 rounded-full bg-dove/60 transition-colors group-hover:bg-rust/50" />
  </PanelResizeHandle>
  <Panel defaultSize={40}>
  <div className="h-full">
    <ChatComponent chatID = {chatID} onNavigateToPage={handleNavigateToPage}/>
  </div>
  </Panel>
  </PanelGroup>
  )
}
