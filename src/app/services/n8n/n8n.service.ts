import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class N8nService {
  constructor(private readonly http: HttpClient) {}

  getN8nData(chat: string) {
    const url = 'https://dnndjh-3000.csb.app/api/cors-proxy/clients';
    const body = { chat: chat};
    return this.http.post(url, body).pipe(
      catchError((error) => {
        console.error('Error fetching data from n8n:', error);
        return throwError(() => new Error('Failed to fetch data from n8n'));
      })
    );
  }
}
