import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { ResultList, Genres, Config } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private baseUrl = 'https://api.themoviedb.org/3/';
  private apiKey = '1a0c7e5899add5e3d049f59520620e31';
  constructor(
    private http: HttpClient
  ) { }

  getMoviesList (): Observable<ResultList> {
    return this.http.get<ResultList>(`${this.baseUrl}movie/now_playing?api_key=${this.apiKey}`)
    .pipe(
      tap(moveiList => console.log('completed fetch'))
    );
  }

  getMoviesGenres (): Observable<Genres> {
    return this.http.get<Genres>(`${this.baseUrl}genre/movie/list?api_key=${this.apiKey}`)
    .pipe(
      tap(genresList => console.log('completed fetch'))
    );
  }
  getConfigImages (): Observable<Config> {
    return this.http.get<Config>(`${this.baseUrl}configuration?api_key=${this.apiKey}`)
    .pipe(
      tap(imageConfig => console.log('completed fetch'))
    );
  }

  handleError<T>(ar1: string, ar2: Array<any>) {

  }

}
