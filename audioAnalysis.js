// audioAnalysis.js
// Node.js helper to extract basic audio features using 'meyda'

import fs from 'fs';
import Meyda from 'meyda';
import wav from 'node-wav';

export function analyzeAudio(filePath) {
  const buffer = fs.readFileSync(filePath);
  const result = wav.decode(buffer);
  const channelData = result.channelData[0];
  const sampleRate = result.sampleRate;

  // Meyda expects a window of samples
  const features = Meyda.extract(['rms', 'spectralCentroid', 'zcr'], channelData, {
    sampleRate,
  });

  return {
    rms: features.rms,
    spectralCentroid: features.spectralCentroid,
    zeroCrossingRate: features.zcr,
    sampleRate,
  };
}
