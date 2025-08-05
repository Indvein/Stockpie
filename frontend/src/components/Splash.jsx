
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Splash({ onFinish }) {

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { transformOrigin: "50% 50%" } });

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "power4.inOut",
    }).to(".vi-mask-group", {
      scale: 10,
      opacity: 0,
      duration: 2,
      delay: -1.8,
      ease: "expo.inOut",
      onComplete: onFinish, 
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <mask id="spMask">
            <rect width="100%" height="100%" fill="black" />
            <g className="vi-mask-group">
              <text
                x="50%" y="50%"
                fontSize="250"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontFamily="Arial Black, sans‑serif"
              >
                SP
              </text>
            </g>
          </mask>
        </defs>

        <image
          href="/bg.png"      
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#spMask)"
        />
      </svg>
    </div>
  );
}

export default Splash;
