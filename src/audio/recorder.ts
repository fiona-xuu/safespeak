import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";

let recording: Audio.Recording | null = null;
let mostRecentRecordingUri: string | null = null;

// Get the recording directory path
function getRecordingDir(): string {
  const docDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
  return `${docDir}recordings/`;
}

function getMostRecentFilePath(): string {
  return `${getRecordingDir()}most-recent.m4a`;
}

export async function startRecording() {
  // Ensure directory exists
  const recordingDir = getRecordingDir();
  try {
    await FileSystem.makeDirectoryAsync(recordingDir, { intermediates: true });
  } catch {
    // Directory might already exist, ignore error
  }

  // Delete previous recording before starting new one
  await deleteMostRecentRecording();

  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Microphone permission not granted");
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  recording = new Audio.Recording();
  await recording.prepareToRecordAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  await recording.startAsync();
}

export async function stopRecording() {
  if (!recording) return null;

  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  recording = null;

  if (uri) {
    // Copy the recording to our permanent location
    try {
      const mostRecentFile = getMostRecentFilePath();
      
      // Delete old file if it exists
      const fileInfo = await FileSystem.getInfoAsync(mostRecentFile);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(mostRecentFile, { idempotent: true });
      }

      // Copy new recording to permanent location
      await FileSystem.copyAsync({
        from: uri,
        to: mostRecentFile,
      });

      mostRecentRecordingUri = mostRecentFile;
      return mostRecentFile;
    } catch (error) {
      console.error("Error saving recording:", error);
      // Return original URI if save fails
      mostRecentRecordingUri = uri;
      return uri;
    }
  }

  return null;
}

export async function deleteMostRecentRecording() {
  try {
    if (mostRecentRecordingUri) {
      await FileSystem.deleteAsync(mostRecentRecordingUri, { idempotent: true });
    }
    // Also try to delete the permanent file location
    const mostRecentFile = getMostRecentFilePath();
    const fileInfo = await FileSystem.getInfoAsync(mostRecentFile);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(mostRecentFile, { idempotent: true });
    }
    mostRecentRecordingUri = null;
  } catch (error) {
    console.error("Error deleting recording:", error);
  }
}

export function getMostRecentRecordingUri(): string | null {
  return mostRecentRecordingUri || getMostRecentFilePath();
}

export async function hasMostRecentRecording(): Promise<boolean> {
  try {
    const mostRecentFile = getMostRecentFilePath();
    const fileInfo = await FileSystem.getInfoAsync(mostRecentFile);
    return fileInfo.exists;
  } catch {
    return false;
  }
}
