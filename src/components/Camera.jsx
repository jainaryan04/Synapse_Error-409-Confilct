import { useEffect, useRef } from 'react';

export default function WebcamPage() {
  const videoRef = useRef(null);

  useEffect(() => {
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    }

    startWebcam();
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className='w-[50%] h-[50%]'>
        
      </div>
      <div className='w-[50%] h-[50%]'>
      <video ref={videoRef} autoPlay className=" object-cover" />
      </div>
    </div>
  );
}
