import { useEffect, useRef, useState } from 'react';
import { submitIssue } from '../api';

export default function WebcamPage() {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const imageCount = 5;
  const rowsCount = 5;
  const [flippedCards, setFlippedCards] = useState(Array(imageCount * rowsCount).fill(false));

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error('Error accessing webcam:', err));
  }, []);

  useEffect(() => {
    if (videoRef.current) isPaused ? videoRef.current.pause() : videoRef.current.play();
  }, [isPaused]);

  const flipCardsSequentially = () => {
    let columnIndex = 0;

    const flipColumn = () => {
      if (columnIndex < imageCount) {
        let rowIndex = 0;

        const flipCardInColumn = () => {
          if (rowIndex < rowsCount) {
            const cardIndex = rowIndex * imageCount + columnIndex;
            setFlippedCards(prev => {
              const newState = [...prev];
              newState[cardIndex] = true;
              return newState;
            });
            rowIndex++;
            setTimeout(flipCardInColumn, 100);
          } else {
            columnIndex++;
            setTimeout(flipColumn, 300);
          }
        };
        flipCardInColumn();
      }
    };
    flipColumn();
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  };

  const handleIssue = async () => {
    try {
      setIsSubmitting(true);
      const imageData = captureImage();
      if (!imageData) throw new Error('Failed to capture image');

      const blob = dataURLToBlob(imageData);
      const formData = new FormData();
      formData.append('file', blob, 'captured-image.jpg');
      formData.append('description', description);
      formData.append('timestamp', new Date().toISOString());

      const response = await submitIssue(formData);
      if (response.status !== 200) throw new Error('Failed to submit issue');

      alert('Issue reported successfully');
      setDescription('');
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) buffer[i] = byteString.charCodeAt(i);
    return new Blob([buffer], { type: mimeString });
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden font-press-start">
      <div className="grid grid-rows-5 grid-cols-5 h-full w-full">
        {[...Array(rowsCount)].map((_, rowIndex) =>
          [...Array(imageCount)].map((_, imgIndex) => {
            const cardIndex = rowIndex * imageCount + imgIndex;
            return (
              <div
                key={`${rowIndex}-${imgIndex}`}
                className={`flip-card ${flippedCards[cardIndex] ? 'flip' : ''}`}
                style={{ animationDelay: `${cardIndex * 100}ms` }}
              >
                <div className="flip-card-front">
                  <img src="/text-bg.jpg" alt="Banner" className="w-full h-full object-cover" />
                </div>
                <div className="flip-card-back">
                  <img src="/text-bg.jpg" alt="Banner" className="w-full h-full object-cover opacity-50" />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex bg-white rounded-2xl shadow-lg p-4 space-x-4">
          {/* Video Section */}
          <div className="flex flex-col items-center space-y-4">
            <video ref={videoRef} autoPlay className="object-cover w-[60vw] h-[80vh] rounded-2xl shadow-md" />
            <button
              onClick={() => setIsPaused(prev => !prev)}
              className={`px-4 py-2 text-white rounded-lg ${
                isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>

          {/* Video Analysis Section */}
          <div className="w-[30vw] p-4 bg-gray-100 rounded-2xl shadow-inner space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Video Analysis</h2>
            <div className="space-y-2">
              <p className="text-gray-600">• Object Detection: <span className="font-medium text-green-600">Active</span></p>
              <p className="text-gray-600">• Frame Rate: <span className="font-medium text-blue-600">30 FPS</span></p>
              <p className="text-gray-600">• Resolution: <span className="font-medium text-purple-600">1280x720</span></p>
            </div>
            <div className="w-full space-y-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full p-2 rounded-lg text-black border border-gray-300"
                rows={3}
              />
              <button
                onClick={handleIssue}
                disabled={isSubmitting || !description.trim()}
                className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Raise Inaccuracy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
