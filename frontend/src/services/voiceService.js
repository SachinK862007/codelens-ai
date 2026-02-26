// frontend/src/services/voiceService.js
import api from './api';

class VoiceService {
  async transcribeAudio(audioBlob, language = 'en-US') {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);
      
      const response = await api.post('/voice/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Voice transcription failed');
    }
  }

  async synthesizeSpeech(text, language = 'en-US', voiceType = 'female') {
    try {
      const response = await api.post('/voice/synthesize', {
        text,
        language,
        voice_type: voiceType
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Text-to-speech failed');
    }
  }

  async processVoiceCommand(command) {
    try {
      const response = await api.post('/voice/command', { command });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Voice command processing failed');
    }
  }

  async detectLanguage(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await api.post('/voice/detect-language', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Language detection failed');
    }
  }
}

export default new VoiceService();
