import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, APP_CONFIG } from 'src/app/app-config.module';

@Injectable({
  providedIn: 'root'
})
export class ListTechsApiService {

  private urlBase: string = '';

  constructor(
    @Inject(APP_CONFIG) private configMain: AppConfig,
    private httpClient: HttpClient
  ) {
    this.urlBase = this.configMain.apiEndpoint;
   }

  getAllTechs<T>(query) {
    return this.httpClient.get<T>(`${this.urlBase}/techs`, { params: query });
  }
}
