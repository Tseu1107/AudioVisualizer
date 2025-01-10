import { useState, useEffect } from 'react';
import Scene from './components/Scene';
import InputControls from './components/InputControls';
import { AudioAnalyzer } from './utils/AudioAnalyzer';

function App() {
  const [analyzer, setAnalyzer] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isMicActive, setIsMicActive] = useState(false);

  useEffect(() => {
    const newAnalyzer = new AudioAnalyzer();
    setAnalyzer(newAnalyzer);

    return () => {
      if (newAnalyzer) {
        newAnalyzer.disconnect();
      }
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }
    };
  }, []);

  const handleAudioInit = async (audioElement) => {
    try {
      if (analyzer) {
        if (isMicActive) {
          analyzer.disconnect();
          setIsMicActive(false);
        }
        
        await analyzer.connectSource(audioElement);
        setAudio(audioElement);
        
        // Ensure audio context is resumed
        await analyzer.audioContext.resume();
        
        // Start playing after connection is established
        await audioElement.play();
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Clean up previous audio if exists
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }

      const audioElement = new Audio(URL.createObjectURL(file));
      
      // Wait for audio to be loaded before connecting
      audioElement.addEventListener('canplaythrough', async () => {
        await handleAudioInit(audioElement);
      }, { once: true }); // Ensure the event listener is removed after first trigger
    }
  };

  const handleMicrophoneInit = async () => {
    if (!analyzer) return false;
    
    try {
      // If microphone is already active, stop it
      if (isMicActive) {
        analyzer.disconnect();
        setIsMicActive(false);
        return false;
      }
      
      // Stop any playing audio first
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
        setAudio(null);
      }
      
      // Start microphone
      const success = await analyzer.initMicrophone();
      if (success) {
        setIsMicActive(true);
        return true;
      }
      
    } catch (error) {
      console.error("Microphone initialization failed:", error);
    }
    return false;
  };
  

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: 'white' }}>
      <InputControls 
        onAudioInit={handleAudioInit}
        onAudioUpload={handleAudioUpload}
        onMicrophoneInit={handleMicrophoneInit}
        isMicActive={isMicActive}
        audio={audio}
      />
      <Scene analyzer={analyzer} />
    </div>
  );
}

export default App;
