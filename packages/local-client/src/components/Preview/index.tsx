import "./preview.css";
import React, { useEffect, useRef } from "react";

interface previewProps {
  code: string;
  err: string;
}

const html = `
        <html>
            <head></head>
            <body>
                <div id="root"></div>
                <script>
                    const handleError = (error) => {
                      const root = document.querySelector('#root');
                      root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '<div>';
                      console.error(error); 
                    };
                    window.addEventListener('error', (event) => {
                      event.preventDefault();
                      handleError(event.error);
                    });
                    window.addEventListener('message', (event) => { 
                        try {
                            eval(event.data);
                        } catch(error) {
                          handleError(error);
                        }
                    }, false);
                </script>
            </body>
        </html>
    `;

const Preview: React.FC<previewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    if (iframe.current) {
      iframe.current.srcDoc = html;
      setTimeout(() => {
        iframe.current.contentWindow.postMessage(code, "*");
      }, 50);
    }
  }, [code]);
  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
