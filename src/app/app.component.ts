import { Component } from '@angular/core';
import { TmdbService } from './services/tmdb.service';
import { OnInit } from '@angular/core';
import { Movie, ResultList, Genre, Config, genreNames } from './models/movie';
import { AfterViewInit } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  // store the original data from first API call for future ref
  movieStore: Movie[];
  genreStore: Genre[];
  configImages: Config;

  // variables for the UI
  moviesNowPlaying: Movie[] = [];
  moviesGenres: Genre[];
  rating: number;

  genreArray = [];
  message: string;

  constructor(private service: TmdbService) {
  }

  ngOnInit() {

    this.service.getMoviesList().subscribe(movieList => {
      this.movieStore = movieList.results;
      const sortArray = movieList.results.sort((a, b) => {
        return b.popularity - a.popularity ;
      });
      return this.moviesNowPlaying = sortArray;
    });

    this.service.getMoviesGenres().subscribe(movieGenre => {
      this.genreStore = movieGenre.genres;
      return this.moviesGenres = movieGenre.genres;
    });

    this.service.getConfigImages().subscribe(configImages => {
      return this.configImages = configImages;
    });

  }

  public getName(n: number) {
    return genreNames[n];
  }
  public selectGenre(idGenre: number) {
    this.message = 'Genres Avaiable';

    console.log('clicked!!');
    this.emptyList();
    this.movieStore.forEach((item, index) => {
      const id = item.id;
      item.genre_ids.forEach((idGenreID, indexID) => {
          if (idGenreID === idGenre) {
              this.genreArray.push(item);
          }

      });


    });

    console.log('just before it updaqte view');
    this.emptyList();
    this.moviesNowPlaying = this.genreArray;
  }

  private resetList() {
    this.moviesNowPlaying = this.movieStore;
  }
  public resetGenre(event: any) {
    event.preventDefault();
    this.genreArray = [];
    this.moviesNowPlaying = this.movieStore;
  }

  private emptyList() {
    this.moviesNowPlaying = [];
  }

  public getRating(event: any) {
    this.message = 'Ratings Avaiable';
    // reset movie list
    this.resetList();
    this.rating = event.target.valueAsNumber;
    this.moviesNowPlaying = this.moviesNowPlaying.filter(x => {
      return  event.target.valueAsNumber <= x.vote_average;
    });
  }
}
