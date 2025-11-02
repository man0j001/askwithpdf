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

  /**
   * Layout:
   * - Desktop: resizable split (PDF | Chat)
   * - Mobile: handled by the parent route layout; this component focuses on split view
   */
  return (
    <PanelGroup autoSaveId="example"  direction="horizontal" className="h-full">
    {/* pdf viewer */}
    <Panel defaultSize={40} className="ml-4">
    <div className="h-full w-full">
    <PDFViewer pdf_url= {pdf_url} navigationRequest={navigationRequest} />
  </div>
  </Panel>
  {/* chat component */}
  <PanelResizeHandle className="w-4 h-full !cursor-col-resize " />
  <Panel defaultSize={40}>
  <div className="h-full">
    <ChatComponent chatID = {chatID} onNavigateToPage={handleNavigateToPage}/>
  </div>
  </Panel>
  </PanelGroup>
  )
}
