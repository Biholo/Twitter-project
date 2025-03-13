import { Client } from 'minio';
import { Readable } from 'stream';

class MinioService {
  private client: Client;
  private bucketName: string = 'twitter-clone';

  constructor() {
    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
      secretKey: process.env.MINIO_SECRET_KEY || 'password123'
    });
  }

  async initialize(): Promise<void> {
    try {
      const bucketExists = await this.client.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.client.makeBucket(this.bucketName);
        console.log('Bucket créé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de MinIO:', error);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.client.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype }
      );
      
      return `${process.env.MINIO_PUBLIC_URL}/${this.bucketName}/${fileName}`;
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, fileName);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }
}

const minioService = new MinioService();
export default minioService;