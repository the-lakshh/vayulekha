
import React, { useRef, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { ICONS, COLORS, Logo } from '../constants';
import { interpretDrawing } from '../services/geminiService';

declare var Hands: any;
declare var Camera: any;

interface DrawingCanvasProps {
  onBack: () => void;
  profile: UserProfile | null;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onBack, profile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentColor, setCurrentColor] = useState(COLORS[0].value);
  const currentColorRef = useRef<string>(COLORS[0].value);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const isErasingRef = useRef<boolean>(false);
  const [geminiTitle, setGeminiTitle] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [exportTheme, setExportTheme] = useState<'light' | 'dark'>('dark');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recorderCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const recorderRafRef = useRef<number | null>(null);

  const lastPointRef = useRef<{x: number, y: number} | null>(null);
  const pinchActiveRef = useRef<boolean>(false);
  const pinchStartRef = useRef<number>(0);
  const pinchCounterRef = useRef<number>(0);

  const clearCanvas = () => {
    setGeminiTitle('');
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (ctx && drawingCanvasRef.current) {
      ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
    }
  };

  const saveCanvas = () => {
    if (!drawingCanvasRef.current) return;
    
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = drawingCanvasRef.current.width;
    exportCanvas.height = drawingCanvasRef.current.height;
    const exportCtx = exportCanvas.getContext('2d')!;
    
    exportCtx.fillStyle = exportTheme === 'dark' ? '#1E293B' : '#FFFFFF';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    
    exportCtx.drawImage(drawingCanvasRef.current, 0, 0);
    
    const link = document.createElement('a');
    link.download = `VayuLekha-${exportTheme}-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL();
    link.click();
  };

  const startRecording = () => {
    if (!canvasRef.current || !drawingCanvasRef.current) return;
    // create a composite canvas to draw both video-overlay canvas and drawing canvas
    const srcCanvas = canvasRef.current;
    const drawCanvas = drawingCanvasRef.current;
    const w = srcCanvas.width || drawCanvas.width || 640;
    const h = srcCanvas.height || drawCanvas.height || 360;

    const recCanvas = document.createElement('canvas');
    recCanvas.width = w;
    recCanvas.height = h;
    recorderCanvasRef.current = recCanvas;
    const ctx = recCanvas.getContext('2d');
    if (!ctx) return;

    // draw loop
    const render = () => {
      try {
        ctx.clearRect(0, 0, w, h);
        // draw the video overlay canvas (background)
        ctx.drawImage(srcCanvas, 0, 0, w, h);
        // draw drawing on top
        ctx.drawImage(drawCanvas, 0, 0, w, h);
      } catch (e) {
        // ignore cross-origin or other transient errors
      }
      recorderRafRef.current = requestAnimationFrame(render);
    };
    render();

    const stream = (recCanvas as HTMLCanvasElement).captureStream(30);
    let options: any = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm;codecs=vp8' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/webm' };
    }
    try {
      const mr = new MediaRecorder(stream, options);
      chunksRef.current = [];
      mr.ondataavailable = (e: any) => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VayuLekha-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        // cleanup
        if (recorderRafRef.current) cancelAnimationFrame(recorderRafRef.current);
        recorderRafRef.current = null;
        recorderCanvasRef.current = null;
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch (err) {
      console.warn('Recording failed to start', err);
      if (recorderRafRef.current) cancelAnimationFrame(recorderRafRef.current);
      recorderRafRef.current = null;
      recorderCanvasRef.current = null;
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    }
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  const handleGeminiMagic = async () => {
    if (!drawingCanvasRef.current || isProcessing) return;
    setIsProcessing(true);
    const dataUrl = drawingCanvasRef.current.toDataURL('image/png');
    const title = await interpretDrawing(dataUrl);
    setGeminiTitle(title);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !drawingCanvasRef.current) return;

    let isMounted = true;
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    const canvasCtx = canvasElement.getContext('2d')!;
    const drawingCtx = drawingCanvas.getContext('2d')!;

    const onResults = (results: any) => {
      if (!isMounted) return;

      // Canvas sizing is set once after the camera starts to avoid resizing jitter.

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.translate(canvasElement.width, 0);
      canvasCtx.scale(-1, 1);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];

        const ix = indexTip.x * canvasElement.width;
        const iy = indexTip.y * canvasElement.height;
        const tx = thumbTip.x * canvasElement.width;
        const ty = thumbTip.y * canvasElement.height;

        const dist = Math.sqrt(Math.pow(ix - tx, 2) + Math.pow(iy - ty, 2));

        // Normalize pinch distance by an estimated hand size so thresholds work across cameras
        // Use wrist (0) to middle finger MCP (9) distance as a proxy for hand size
        const wrist = landmarks[0];
        const midMCP = landmarks[9] || landmarks[5];
        const wx = wrist.x * canvasElement.width;
        const wy = wrist.y * canvasElement.height;
        const mx = (midMCP.x || wrist.x) * canvasElement.width;
        const my = (midMCP.y || wrist.y) * canvasElement.height;
        const handSize = Math.max(1, Math.sqrt(Math.pow(wx - mx, 2) + Math.pow(wy - my, 2)));

        const normalized = dist / handSize; // unitless ratio
        // Tuned ratios: tighter to start, looser to release
        const START_RATIO = 0.18; // start when index-thumb distance < 0.18 * handSize
        const RELEASE_RATIO = 0.24; // release when distance > 0.24 * handSize

        let rawPinch = pinchActiveRef.current;
        if (normalized < START_RATIO) rawPinch = true;
        else if (normalized > RELEASE_RATIO) rawPinch = false;

        // Debounce using consecutive frames for stability
        if (rawPinch && !pinchActiveRef.current) {
          pinchCounterRef.current = Math.min(10, pinchCounterRef.current + 1);
          if (pinchCounterRef.current >= 3) {
            pinchActiveRef.current = true;
            lastPointRef.current = { x: ix, y: iy };
          }
        } else if (!rawPinch) {
          pinchCounterRef.current = 0;
          pinchActiveRef.current = false;
        }

        const currentlyPinching = pinchActiveRef.current;
        setIsDrawing(currentlyPinching);

        // read current color/erase from refs to avoid re-creating handlers when UI state changes
        const activeColor = currentColorRef.current || currentColor;
        const activeErasing = isErasingRef.current ?? isErasing;
        canvasCtx.fillStyle = activeErasing ? 'rgba(239, 68, 68, 0.4)' : `${activeColor}BB`;
        canvasCtx.beginPath();
        canvasCtx.arc(ix, iy, currentlyPinching ? 5 : 10, 0, Math.PI * 2);
        canvasCtx.fill();
        canvasCtx.strokeStyle = 'white';
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();

        drawingCtx.save();
        drawingCtx.translate(drawingCanvas.width, 0);
        drawingCtx.scale(-1, 1);

        if (currentlyPinching) {
          if (activeErasing) {
            drawingCtx.globalCompositeOperation = 'destination-out';
            drawingCtx.lineWidth = 12;
          } else {
            drawingCtx.globalCompositeOperation = 'source-over';
            drawingCtx.strokeStyle = activeColor;
            drawingCtx.lineWidth = 3;
          }
          drawingCtx.lineCap = 'round';
          drawingCtx.lineJoin = 'round';

          if (lastPointRef.current) {
            drawingCtx.beginPath();
            drawingCtx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
            drawingCtx.lineTo(ix, iy);
            drawingCtx.stroke();
          }
          lastPointRef.current = { x: ix, y: iy };
        } else {
          lastPointRef.current = null;
        }
        drawingCtx.restore();
      } else {
        lastPointRef.current = null;
        setIsDrawing(false);
      }
      canvasCtx.restore();
    };

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    // Lower complexity and confidence thresholds for faster performance on lower-end devices
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    let frameCount = 0;
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        if (!isMounted) return;
        try {
          // throttle frames: only send every 2nd frame to reduce CPU/GPU load
          frameCount = (frameCount + 1) | 0;
          if ((frameCount % 2) !== 0) return;
          if (hands && typeof hands.send === 'function') {
            await hands.send({ image: videoElement });
          }
        } catch (e) {
          console.warn("MediaPipe Frame error:", e);
        }
      },
      width: 640,
      height: 360
    });

    camera.start().then(() => {
      if (isMounted) setIsCameraReady(true);
      // set canvas resolution once based on the actual video size to prevent
      // repeated resizing each frame which can cause jitter/vibration
      try {
        const vw = videoElement.videoWidth || 640;
        const vh = videoElement.videoHeight || 360;
        canvasElement.width = vw;
        canvasElement.height = vh;
        drawingCanvas.width = vw;
        drawingCanvas.height = vh;
      } catch (e) {
        console.warn('Failed to set canvas size on camera start', e);
      }
    });

    return () => {
      isMounted = false;
      camera.stop();
      try {
        hands.close();
      } catch (e) {}
      // If recording is active, stop and finalize
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {}
      if (recorderRafRef.current) {
        cancelAnimationFrame(recorderRafRef.current);
        recorderRafRef.current = null;
      }
      recorderCanvasRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden font-['Quicksand']">
      {/* Reduced Canvas status indicator size */}
      <div className="absolute top-3 right-3 z-50 flex items-center gap-2 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-xl shadow-lg border border-white/20">
        <div className={`w-2.5 h-2.5 rounded-full shadow-inner ${isDrawing ? (isErasing ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse') : 'bg-slate-300'}`}></div>
        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
          {isErasing ? 'Erase' : 'Write'}
        </span>
      </div>

      {/* Top Left Navigation - Simplified */}
      <div className="absolute top-3 left-3 z-60">
        <button 
          onClick={onBack}
          className="p-2 bg-white/40 backdrop-blur-md rounded-xl text-slate-800 shadow-md hover:scale-105 active:scale-95 transition-all border border-white/20 btn btn-light"
        >
          <ICONS.Back />
        </button>
      </div>

      {/* Minimized Palette with significantly reduced transparency/background visibility */}
      <div className="absolute left-3 top-20 z-50 flex flex-col gap-1.5 bg-white/5 backdrop-blur-[2px] p-1.5 rounded-2xl border border-white/10">
        {COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => {
              setCurrentColor(color.value);
              currentColorRef.current = color.value;
              // ensure eraser is turned off
              setIsErasing(false);
              isErasingRef.current = false;
            }}
            className={`w-7 h-7 rounded-lg transition-all transform hover:scale-110 flex items-center justify-center relative flex-shrink-0 ${
              !isErasing && currentColor === color.value ? 'scale-110 shadow-md border-2 border-white' : 'opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: color.value }}
          >
            {!isErasing && currentColor === color.value && (
              <div className="absolute -inset-1 border border-white/40 rounded-lg pointer-events-none"></div>
            )}
          </button>
        ))}
        
        <div className="w-full h-px bg-white/10 my-1 rounded-full"></div>
        
        <button
          onClick={() => {
            setIsErasing(prev => {
              const next = !prev;
              isErasingRef.current = next;
              return next;
            });
          }}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 flex-shrink-0 ${
            isErasing ? 'bg-red-500 text-white shadow-md border border-white' : 'bg-white/20 text-white border border-white/10'
          }`}
        >
          <ICONS.Eraser />
        </button>

        <button
          onClick={clearCanvas}
          className="w-7 h-7 rounded-lg bg-white/20 text-white border border-white/10 flex items-center justify-center transition-all transform hover:scale-110 hover:bg-red-500 flex-shrink-0"
        >
          <ICONS.Trash />
        </button>
      </div>

      {/* Action Buttons & Theme Toggle below Download as Sun/Moon icons */}
      <div className="absolute bottom-4 right-4 z-50 flex flex-col items-center gap-3">
         <button 
            onClick={handleGeminiMagic}
            disabled={isProcessing}
            className={`w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center transition-all shadow-xl border border-white/20 ${isProcessing ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ICONS.Sparkles />
            )}
          </button>
          
          <button
            onClick={() => { isRecording ? stopRecording() : startRecording(); }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-xl border border-white/20 ${isRecording ? 'bg-red-500' : 'bg-sky-500 hover:bg-sky-600'} text-white`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4.5A1.5 1.5 0 015.5 3h9A1.5 1.5 0 0116 4.5v11A1.5 1.5 0 0114.5 17h-9A1.5 1.5 0 014 15.5v-11z" />
              </svg>
            )}
          </button>

          <button 
            onClick={saveCanvas}
            className="w-12 h-12 bg-[#50C2F7] hover:opacity-90 text-white rounded-xl shadow-xl transition-all flex items-center justify-center border border-white/20"
          >
            <ICONS.Download />
          </button>

          {/* Theme selection as Icons (Sun/Moon) below Download */}
          <div className="flex flex-col gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
            <button 
              onClick={() => setExportTheme('light')}
              className={`p-1.5 rounded-lg transition-all ${exportTheme === 'light' ? 'bg-[#50C2F7] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              title="Light theme"
            >
              <ICONS.Sun />
            </button>
            <button 
              onClick={() => setExportTheme('dark')}
              className={`p-1.5 rounded-lg transition-all ${exportTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              title="Dark theme"
            >
              <ICONS.Moon />
            </button>
          </div>
      </div>

      {/* Main View Area - Enhanced for full visibility */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {!isCameraReady && (
            <div className="text-white text-center z-50 p-4">
                <Logo className="w-20 h-20 mx-auto mb-4 animate-pulse" showText={false} />
                <p className="text-sm fw-bold text-uppercase tracking-[0.2em] animate-pulse">Waking up Magic Studio...</p>
            </div>
        )}
        
        <video ref={videoRef} className="hidden" playsInline muted></video>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-10 opacity-30 pointer-events-none grayscale-[0.3]"></canvas>
        <canvas ref={drawingCanvasRef} className="absolute inset-0 w-full h-full object-cover z-20"></canvas>
        
        {geminiTitle && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl">
                <div className="bg-white/95 p-5 rounded-3xl shadow-2xl border-b-4 border-purple-500 animate-in slide-in-from-top-4 duration-500 text-center">
                    <p className="text-black fw-bold fst-italic text-lg mb-0">"{geminiTitle}"</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DrawingCanvas;
