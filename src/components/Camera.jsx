import { useEffect, useRef, useState } from 'react';
import { submitIssue, uploadVideo } from '../api';

export default function WebcamPage() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [issue, setIssue] = useState('');
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks(prev => [...prev, event.data]);
          }
        };
      })
      .catch(err => console.error('Error accessing webcam:', err));
  }, []);

  useEffect(() => {
    if (videoRef.current) isPaused ? videoRef.current.pause() : videoRef.current.play();
  }, [isPaused]);

  const startRecording = () => {
    setRecordedChunks([]);
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleUploadVideo = async () => {
    if (recordedChunks.length === 0) {
      alert('No video recorded!');
      return;
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('file', blob, description);
    formData.append('description', description);
    formData.append('timestamp', new Date().toISOString());

    try {
      setIsUploading(true);
      const response = await uploadVideo(formData);
      if (response.status !== 200) throw new Error('Failed to upload video');

      alert('Video uploaded successfully');
      setDescription('');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
      formData.append('description', issue);
      formData.append('timestamp', new Date().toISOString());

      const response = await submitIssue(formData);
      if (response.status !== 200) throw new Error('Failed to submit issue');

      alert('Issue reported successfully');
      setIssue('');
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
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg p-4 space-x-4 w-[90vw]">
          <div className="flex flex-col items-center space-y-4">
            <video ref={videoRef} autoPlay muted className="object-cover h-[20vh] w-[60vw] lg:h-[80vh] rounded-2xl shadow-md" />

            <div className="flex space-x-2">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg disabled:bg-gray-400"
              >
                Start Recording
              </button>
              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:bg-gray-400"
              >
                Stop Recording
              </button>
            </div>

            <button
              onClick={() => setIsPaused(prev => !prev)}
              className={`px-4 py-2 text-white rounded-lg ${
                isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>

          <div className="lg:w-[30vw] p-4 bg-gray-100 rounded-2xl shadow-inner space-y-4 mt-9 lg:mt-0 text-[1vh] lg:text-[3vh]">
            <h2 className="text-xl font-semibold text-gray-800">Video Upload</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the video..."
              className="w-full p-2 rounded-lg text-black border border-gray-300"
              rows={3}
            />
            <button
              onClick={handleUploadVideo}
              disabled={isUploading || recordedChunks.length === 0}
              className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>

          {/* Video Analysis Section */}
          <div className=" lg:w-[30vw] p-4 bg-gray-100 rounded-2xl shadow-inner space-y-4 mt-9 lg:mt-0 text-[1vh] lg:text-[3vh]">
            <h2 className="text-xl font-semibold text-gray-800">Video Analysis</h2>
            <div className="space-y-2">
              <p className="text-gray-600">• Object Detection: <span className="font-small lg:font-medium text-green-600">Active</span></p>
              <p className="text-gray-600">• Frame Rate: <span className=" font-small lg:font-medium text-blue-600">30 FPS</span></p>
              <p className="text-gray-600">• Resolution: <span className="font-small lg:font-medium text-purple-600">1280x720</span></p>
            </div>
            <div className="w-full space-y-2">
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full p-2 rounded-lg text-black border border-gray-300"
                rows={3}
              />
              <button
                onClick={handleIssue}
                disabled={isSubmitting || !issue.trim()}
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
