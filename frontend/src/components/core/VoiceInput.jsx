// frontend/src/components/core/VoiceInput.jsx
import React, { useState, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaStop } from 'react-icons/fa';

const VoiceInput = ({ onVoiceInput, onVoiceCommand, language = 'en-US' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + transcript + ' ');
            // Trigger voice input callback for final results
            onVoiceInput && onVoiceInput(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.start();
      setRecognition(recognitionInstance);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('Error starting voice input');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // In a real implementation, you would send this to your backend
        console.log('Audio recorded:', audioBlob.size, 'bytes');
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleVoiceCommand = (command) => {
    onVoiceCommand && onVoiceCommand(command);
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700 flex items-center">
          <FaMicrophone className="mr-2 text-blue-500" />
          Voice Controls
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleVoiceCommand('run')}
            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
          >
            Run Code
          </button>
          <button
            onClick={() => handleVoiceCommand('explain')}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
          >
            Explain
          </button>
          <button
            onClick={() => handleVoiceCommand('debug')}
            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
          >
            Debug
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Voice Recognition */}
        <div className="border rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Speech to Text</span>
            <div className="flex space-x-2">
              {isListening ? (
                <button
                  onClick={stopListening}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  <FaStop size={12} />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={startListening}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  <FaMicrophone size={12} />
                  <span>Start</span>
                </button>
              )}
            </div>
          </div>
          
          {transcript && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <div className="font-medium mb-1">Transcript:</div>
              <div className="whitespace-pre-wrap">{transcript}</div>
            </div>
          )}
        </div>

        {/* Audio Recording */}
        <div className="border rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Audio Recording</span>
            <div className="flex space-x-2">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  <FaStop size={12} />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                >
                  <FaMicrophone size={12} />
                  <span>Record</span>
                </button>
              )}
            </div>
          </div>
          
          {isRecording && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Recording...</span>
            </div>
          )}
        </div>

        {/* Quick Commands */}
        <div className="border rounded p-3">
          <div className="font-medium text-sm mb-2">Voice Commands</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-100 p-2 rounded">&quot;Run my code&quot;</div>
            <div className="bg-gray-100 p-2 rounded">&quot;Explain this&quot;</div>
            <div className="bg-gray-100 p-2 rounded">&quot;Debug error&quot;</div>
            <div className="bg-gray-100 p-2 rounded">&quot;Next step&quot;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
