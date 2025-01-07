import { useState, useEffect } from 'react';

const AudioUpload = ({ onAudioInit }) => {
  const [audio, setAudio] = useState(null);

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioElement = new Audio(URL.createObjectURL(file));
      setAudio(audioElement);
    }
  };

  useEffect(() => {
    if (audio) {
      onAudioInit(audio);
    }
  }, [audio]);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <input type="file" accept="audio/*" onChange={handleAudioUpload} />
      {audio && (
        <div style={{ marginTop: '10px' }}>
          <audio controls src={audio.src} />
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
