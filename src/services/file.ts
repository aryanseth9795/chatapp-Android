import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { database } from "./database";

export interface FileUploadResult {
  uri: string;
  type: string;
  name: string;
  size: number;
}

class FileService {
  private mediaDirectory = `${FileSystem.documentDirectory}chatsapp_media/`;

  async initialize() {
    // Create media directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(this.mediaDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.mediaDirectory, {
        intermediates: true,
      });
      console.log("Media directory created");
    }
  }

  // Pick image from gallery
  async pickImage(): Promise<FileUploadResult | null> {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        throw new Error("Permission to access gallery is required!");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      return {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `image_${Date.now()}.jpg`,
        size: (fileInfo as any).size || 0,
      };
    } catch (error) {
      console.error("Error picking image:", error);
      throw error;
    }
  }

  // Take photo with camera
  async takePhoto(): Promise<FileUploadResult | null> {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        throw new Error("Permission to access camera is required!");
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      return {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        size: (fileInfo as any).size || 0,
      };
    } catch (error) {
      console.error("Error taking photo:", error);
      throw error;
    }
  }

  // Pick document
  async pickDocument(): Promise<FileUploadResult | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];

      return {
        uri: asset.uri,
        type: asset.mimeType || "application/octet-stream",
        name: asset.name,
        size: asset.size || 0,
      };
    } catch (error) {
      console.error("Error picking document:", error);
      throw error;
    }
  }

  // Download and cache file
  async downloadFile(remoteUrl: string, messageId: string): Promise<string> {
    try {
      const fileName = `${messageId}_${Date.now()}_${this.getFileNameFromUrl(
        remoteUrl
      )}`;
      const localPath = `${this.mediaDirectory}${fileName}`;

      // Check if file already exists in cache
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (fileInfo.exists) {
        console.log("File already cached:", localPath);
        return localPath;
      }

      // Download file
      console.log("Downloading file:", remoteUrl);
      const downloadResult = await FileSystem.downloadAsync(
        remoteUrl,
        localPath
      );

      // Save to database
      const fileType = this.getFileType(fileName);
      await database.saveMediaFile({
        id: `${messageId}_${Date.now()}`,
        messageId,
        fileName,
        fileType,
        localPath: downloadResult.uri,
        remoteUrl,
        size: 0, // We could get this from response headers
        createdAt: new Date().toISOString(),
      });

      console.log("File downloaded and cached:", downloadResult.uri);
      return downloadResult.uri;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }

  // Get cached file path
  async getCachedFilePath(messageId: string): Promise<string | null> {
    try {
      const media = await database.getMediaFile(messageId);

      if (!media) return null;

      // Verify file still exists
      const fileInfo = await FileSystem.getInfoAsync(media.localPath);
      if (!fileInfo.exists) {
        console.log("Cached file not found, will re-download");
        return null;
      }

      return media.localPath;
    } catch (error) {
      console.error("Error getting cached file:", error);
      return null;
    }
  }

  // Clear all cached media
  async clearCache() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.mediaDirectory);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.mediaDirectory, { idempotent: true });
        await FileSystem.makeDirectoryAsync(this.mediaDirectory, {
          intermediates: true,
        });
        console.log("Media cache cleared");
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw error;
    }
  }

  // Get cache size
  async getCacheSize(): Promise<number> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.mediaDirectory);
      let totalSize = 0;

      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(
          `${this.mediaDirectory}${file}`
        );
        totalSize += (fileInfo as any).size || 0;
      }

      return totalSize;
    } catch (error) {
      console.error("Error getting cache size:", error);
      return 0;
    }
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  // Helper functions
  private getFileNameFromUrl(url: string): string {
    const parts = url.split("/");
    return parts[parts.length - 1] || "file";
  }

  private getFileType(fileName: string): string {
    const ext = fileName.split(".").pop()?.toLowerCase();

    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
    const videoExts = ["mp4", "mov", "avi", "mkv", "webm"];
    const audioExts = ["mp3", "wav", "aac", "m4a", "ogg"];
    const docExts = ["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"];

    if (imageExts.includes(ext || "")) return "image";
    if (videoExts.includes(ext || "")) return "video";
    if (audioExts.includes(ext || "")) return "audio";
    if (docExts.includes(ext || "")) return "document";

    return "file";
  }
}

export const fileService = new FileService();
export default fileService;
