
import React, { useState, useEffect, useRef } from 'react';

const SpeechRecorder = ({ onTranscriptComplete, isProcessing }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Handle cross-browser Web Speech API initializations
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Web Speech API recognition is not supported in this browser version.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    currentTranscript += event.results[i][0].transcript + ' ';
                }
            }
            if (currentTranscript) {
                setTranscript((prev) => prev + currentTranscript);
                onTranscriptComplete(currentTranscript);
            }
        };

        recognition.onerror = (e) => {
            console.error("Speech parsing glitch recorded:", e.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [onTranscriptComplete]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Mic configurations aren't available/supported on your current browser node.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 p-3 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="flex items-center justify-between w-full">
                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={toggleListening}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition duration-150 ${
                        isListening 
                        ? 'bg-rose-600 hover:bg-rose-700 animate-pulse text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    } disabled:opacity-40`}
                >
                    {isListening ? '🛑 Stop Listening...' : '🎤 Start Speaking'}
                </button>
                <span className="text-[10px] font-bold uppercase text-gray-500">
                    Status: {isListening ? <span className="text-rose-400">Live Listening</span> : 'Standby'}
                </span>
            </div>
        </div>
    );
};

export default SpeechRecorder;