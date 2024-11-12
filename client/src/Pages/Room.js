import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdf from "./../OS_Full_Notes.pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function Room({ socket, setRoomDetails, roomDetails }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // Correct way to handle the callback
  function onDocumentLoadSuccess({ numPages }) {
    // Destructure numPages from the object
    setNumPages(numPages);
  }

  useEffect(() => {
    setPageNumber(roomDetails?.pageNo);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("page_update_event", (newPageNo) => {
      console.log("new page: ", newPageNo);
      setPageNumber(newPageNo);
    });

    return () => {
      socket.off("page_update_event");
    };
  }, [socket]);

  function changePage(direction) {
    if (direction) {
      console.log("+1");
      if (socket) {
        let currPage = pageNumber;
        socket.emit("change_page", currPage + 1, roomDetails?.roomId);
        setPageNumber(currPage + 1);
      }
    } else {
      console.log("-1");
      if (socket) {
        let currPage = pageNumber;
        socket.emit("change_page", currPage - 1, roomDetails?.roomId);
        setPageNumber(currPage - 1);
      }
    }
  }

  return (
    <div className="mx-auto bg-white text-black">
      {/* <p>Hi {socket?.id}</p> */}
      <div className="pdf-container">
        {roomDetails?.isAdmin ? (
          <button
            className="cursor-pointer"
            onClick={() => changePage(0)}
            disabled={pageNumber <= 1}
          >
            {"<"}
          </button>
        ) : (
          <></>
        )}{" "}
        <par>
          Page {pageNumber} of {numPages}
        </par>
        {roomDetails?.isAdmin ? (
          <button
            className="cursor-pointer"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            {">"}
          </button>
        ) : (
          <></>
        )}
        <Document
          className="h-{70%}"
          file={pdf}
          onLoadSuccess={onDocumentLoadSuccess}
          error="An error occurred!"
          loading="Loading PDF..."
        >
          <Page
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            error="An error occurred!"
            loading="Loading page..."
          />
        </Document>
      </div>
    </div>
  );
}

export default Room;
