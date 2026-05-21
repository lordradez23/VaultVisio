"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert, Fingerprint, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ScannerState = "idle" | "awaiting_camera" | "camera_ready" | "scanning" | "success" | "error";

export default function BiometricScanner({ 
  onSuccessRedirect = "/dashboard",
  scanDurationMs = 3000
}: { 
  onSuccessRedirect?: string;
  scanDurationMs?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scannerState, setScannerState] = useState<ScannerState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Initialize Camera
  const startCamera = async () => {
    setScannerState("awaiting_camera");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setScannerState("camera_ready");
    } catch (err: any) {
      console.error("Camera error:", err);
      setScannerState("error");
      setErrorMessage("Camera access denied or unavailable.");
    }
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Run the fake verification process
  const startVerification = () => {
    if (scannerState !== "camera_ready") return;
    setScannerState("scanning");

    setTimeout(() => {
      setScannerState("success");
      // Stop the camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Redirect after a brief success display
      setTimeout(() => {
        router.push(onSuccessRedirect);
      }, 1500);
    }, scanDurationMs);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      {/* Scanner Visual Container */}
      <div className={`relative w-48 h-64 mb-8 mx-auto rounded-full overflow-hidden transition-all duration-500 border-4 ${
        scannerState === "success" ? "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)] bg-emerald-500/10" :
        scannerState === "error" ? "border-red-500 bg-red-500/10" :
        scannerState === "scanning" ? "border-gold shadow-[0_0_30px_rgba(212,175,55,0.4)]" :
        "border-white/10 bg-black/50"
      }`}>
        
        {/* The Camera Feed */}
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            (scannerState === "camera_ready" || scannerState === "scanning") ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Idle/Error Empty State */}
        {(scannerState === "idle" || scannerState === "awaiting_camera" || scannerState === "error") && (
          <div className="absolute inset-0 flex items-center justify-center">
            {scannerState === "error" ? (
              <ShieldAlert className="w-12 h-12 text-red-500 opacity-50" />
            ) : (
              <div className="w-24 h-32 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Fingerprint className="w-8 h-8 text-white/20" />
              </div>
            )}
          </div>
        )}

        {/* Success Overlay */}
        {scannerState === "success" && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/30 backdrop-blur-sm z-20">
             <CheckCircle2 className="w-16 h-16 text-emerald-400" />
          </div>
        )}

        {/* Scanning Sweep Animation */}
        {scannerState === "scanning" && (
          <>
            <div className="absolute inset-0 bg-gold/10 z-10 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-transparent to-gold/80 z-20 shadow-[0_5px_10px_rgba(212,175,55,0.5)] animate-[scannerSweep_2s_ease-in-out_infinite]" />
            <style jsx>{`
              @keyframes scannerSweep {
                0% { transform: translateY(-10%); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(6400%); opacity: 0; }
              }
            `}</style>
          </>
        )}
      </div>

      {/* Status Messages & Controls */}
      <div className="text-center w-full">
        {scannerState === "idle" && (
          <button 
            onClick={startCamera}
            className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
          >
            Enable Camera
          </button>
        )}

        {scannerState === "awaiting_camera" && (
          <p className="text-sm tracking-widest uppercase text-gold font-bold animate-pulse">
            Awaiting Permissions...
          </p>
        )}

        {scannerState === "camera_ready" && (
          <button 
            onClick={startVerification}
            className="w-full py-4 rounded-xl font-bold bg-gold hover:bg-gold-dark text-black transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            Start Scan
          </button>
        )}

        {scannerState === "scanning" && (
          <p className="text-sm tracking-widest uppercase text-gold font-bold animate-pulse">
            Analyzing Biometrics...
          </p>
        )}

        {scannerState === "success" && (
          <p className="text-sm tracking-widest uppercase text-emerald-400 font-bold">
            Identity Verified
          </p>
        )}

        {scannerState === "error" && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-red-400">{errorMessage}</p>
            <button 
              onClick={startCamera}
              className="w-full py-3 rounded-xl font-bold bg-white/5 border border-red-500/30 text-white hover:bg-red-500/10 transition-all"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
