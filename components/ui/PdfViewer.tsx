'use client'

import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type NavigationRequest = {
  page: number;
  key: number;
};

type Props = {
  pdf_url: string;
  navigationRequest?: NavigationRequest | null;
};

const PDFViewer = ({ pdf_url, navigationRequest }: Props) => {
  const [numPages, setNumPages] = React.useState<number>(0);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [highlightedPage, setHighlightedPage] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pageRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const highlightTimeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect?.width) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.clientWidth);

    return () => observer.disconnect();
  }, []);

  const handleDocumentLoadSuccess = React.useCallback((payload: { numPages: number }) => {
    setNumPages(payload.numPages);
  }, []);

  const performNavigation = React.useCallback(
    (request: NavigationRequest) => {
      const targetElement = pageRefs.current.get(request.page);
      if (!targetElement) {
        return false;
      }

      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightedPage(request.page);

      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = window.setTimeout(() => {
        setHighlightedPage((current) => (current === request.page ? null : current));
        highlightTimeoutRef.current = undefined;
      }, 2000);

      return true;
    },
    [],
  );

  React.useEffect(() => {
    if (!navigationRequest) return;

    let attempts = 0;
    let cancelled = false;

    const tryNavigate = () => {
      if (cancelled) return;
      const success = performNavigation(navigationRequest);
      if (!success && attempts < 10) {
        attempts += 1;
        window.setTimeout(tryNavigate, 200);
      }
    };

    tryNavigate();

    return () => {
      cancelled = true;
    };
  }, [navigationRequest, performNavigation]);

  React.useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const pageWidth = React.useMemo(() => {
    if (!containerWidth) return 600;
    const paddingOffset = 32; // account for padding
    const usableWidth = containerWidth - paddingOffset;
    return Math.max(Math.min(usableWidth, 900), 320);
  }, [containerWidth]);

  return (
    <div ref={containerRef} className="steep-scroll h-full overflow-y-scroll bg-fog px-2 py-4">
      {!pdf_url ? (
        <div className="flex h-full items-center justify-center text-[14px] tracking-[-0.009em] text-graphite">
          No PDF selected.
        </div>
      ) : (
        <Document
          file={{ url: pdf_url }}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading={<div className="p-4 text-[14px] tracking-[-0.009em] text-graphite">Loading PDF…</div>}
          error={<div className="p-4 text-[14px] tracking-[-0.009em] text-rust">Failed to load PDF.</div>}
        >
          {Array.from({ length: numPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <div
                key={pageNumber}
                ref={(element) => {
                  if (element) {
                    pageRefs.current.set(pageNumber, element);
                  } else {
                    pageRefs.current.delete(pageNumber);
                  }
                }}
                className={cn(
                  "mb-6 flex justify-center transition-all duration-500 [&_.react-pdf__Page]:overflow-hidden [&_.react-pdf__Page]:rounded-xl [&_.react-pdf__Page]:shadow-steep-soft",
                  {
                    "[&_.react-pdf__Page]:ring-2 [&_.react-pdf__Page]:ring-rust/50 [&_.react-pdf__Page]:ring-offset-4 [&_.react-pdf__Page]:ring-offset-fog":
                      highlightedPage === pageNumber,
                  },
                )}
              >
                <Page
                  pageNumber={pageNumber}
                  width={pageWidth}
                  renderAnnotationLayer
                  renderTextLayer
                />
              </div>
            );
          })}
        </Document>
      )}
    </div>
  );
};

export default PDFViewer;