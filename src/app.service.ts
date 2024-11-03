// src/services/api.service.ts
import axios from 'axios';

export class AppService {
  private apiBase = 'http://localhost:3001'; // Assuming your NestJS app is running on port 3000

  async getHello(): Promise<string> {
    try {
      console.log('gggggggggggggggggg');
      const response = await axios.get(`${this.apiBase}/api/hello`);
      console.log('ffff', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching hello:', error);
      throw error;
    }
  }
}
