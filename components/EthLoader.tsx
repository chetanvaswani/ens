"use client";

export default function EthLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col gap-5 items-center justify-center py-20 animate-fade-in">

      <div className="mb-8">
        {/* Ethereum Diamond Logo */}
        <div className="eth-loader-container">
          <svg
            width="120"
            height="120"
            viewBox="0 0 256 417"
            xmlns="http://www.w3.org/2000/svg"
            className="eth-logo"
          >
            <defs>
              <linearGradient id="ethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
                <stop offset="100%" style={{ stopColor: "var(--secondary)" }} />
              </linearGradient>
            </defs>
            
            {/* Top Triangle */}
            <g className="eth-top">
              <polygon
                points="127.9611,0 125.1661,9.5 125.1661,285.168 127.9611,287.958 255.9231,212.32"
                fill="url(#ethGradient)"
                opacity="0.8"
              />
              <polygon
                points="127.962,0 0,212.32 127.962,287.959 127.962,154.158"
                fill="url(#ethGradient)"
                opacity="0.6"
              />
            </g>
            
            {/* Bottom Triangle */}
            <g className="eth-bottom">
              <polygon
                points="127.9611,312.1866 126.3861,314.1066 126.3861,412.3056 127.9611,416.9066 255.9991,236.5866"
                fill="url(#ethGradient)"
                opacity="0.8"
              />
              <polygon
                points="127.962,416.9052 127.962,312.1852 0,236.5852"
                fill="url(#ethGradient)"
                opacity="0.6"
              />
            </g>
            
            {/* Middle Triangles */}
            <g className="eth-middle">
              <polygon
                points="127.9611,287.9577 255.9211,212.3207 127.9611,154.1587"
                fill="url(#ethGradient)"
                opacity="0.4"
              />
              <polygon
                points="0,212.3208 127.9611,287.9578 127.9611,154.1588"
                fill="url(#ethGradient)"
                opacity="0.2"
              />
            </g>
          </svg>
        </div>
      </div>
      
      <div className="text-center flex flex-col gap-5">
        <p className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          {text}
        </p>
        <div className="flex items-center justify-center gap-1">
          <div className="loading-dot" style={{ background: "var(--primary)" }}></div>
          <div className="loading-dot" style={{ background: "var(--primary)", animationDelay: "0.2s" }}></div>
          <div className="loading-dot" style={{ background: "var(--primary)", animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}

