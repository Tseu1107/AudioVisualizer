export class AudioAnalyzer {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.initialize();
  }

  initialize() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  async initMicrophone() {
    try {
      await this.initialize();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (this.microphoneStream) {
        this.microphoneStream.getTracks().forEach(track => track.stop());
      }
      
      this.microphoneStream = stream;
      if (this.source) {
        this.source.disconnect();
      }
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);
      return true;
    } catch (error) {
      console.error("Microphone initialization failed:", error);
      return false;
    }
  }


  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  disconnect() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
      this.microphoneStream = null;
    }
  }

  async connectSource(audioElement) {
    await this.audioContext.resume();
    this.disconnect();
    this.source = this.audioContext.createMediaElementSource(audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }
}
