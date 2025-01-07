import { useState } from 'react';

const InputControls = ({ onAudioInit, onMicrophoneInit }) => {
  const [audio, setAudio] = useState(null);
  const [isMicActive, setIsMicActive] = useState(false);

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }
      const audioElement = new Audio(URL.createObjectURL(file));
      setAudio(audioElement);
      onAudioInit(audioElement);
      setIsMicActive(false);
    }
  };

  const handleMicToggle = async () => {
    if (!isMicActive) {
      if (audio) {
        audio.pause();
      }
      const success = await onMicrophoneInit();
      if (success) {
        setIsMicActive(true);
      }
    } else {
      setIsMicActive(false);
      if (audio) {
        onAudioInit(audio);
      }
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      padding: '20px',
      borderRadius: '10px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <div>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleAudioUpload}
          disabled={isMicActive}
          style={{ color: isMicActive ? 'gray' : 'white' }}
        />
      </div>
      
      <button
        onClick={handleMicToggle}
        style={{
          padding: '8px 16px',
          backgroundColor: isMicActive ? '#ff4444' : '#44ff44',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isMicActive ? 'Stop Microphone' : 'Start Microphone'}
      </button>

      {/* {audio && !isMicActive && (
        <div>
          <audio 
            controls 
            src={audio.src}
            style={{ width: '100%' }}
          />
        </div>
      )} */}
    </div>
  );
};

export default InputControls;
