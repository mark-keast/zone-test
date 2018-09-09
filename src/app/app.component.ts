import { Component, ViewChild, ElementRef } from '@angular/core';
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
  configMovie: Config;

  // variables for the UI
  moviesNowPlaying: Movie[] = [];
  moviesGenres: Genre[];
  rating: number;

  genreArray = [];
  genreArrayList = [];
  copyGenreList = [];
  genreButtonChosen: Array<string> = [];
  message: string;
  sliderValue = 0;

  @ViewChild('slider') slider: ElementRef;

  constructor(private service: TmdbService) {
  }

  ngOnInit() {
    // get all data and store it
    this.service.getMoviesList().subscribe(movieList => {
      this.movieStore = movieList.results;
      return this.moviesNowPlaying = movieList.results.sort((a, b) => {
        return b.popularity - a.popularity ;
      });
    });

    this.service.getMoviesGenres().subscribe(movieGenre => {
      this.genreStore = movieGenre.genres;
      return this.moviesGenres = movieGenre.genres;
    });

    this.service.getConfigImages().subscribe(config => {
      return this.configMovie = config;
    });

  }

  public getName(n: number) {
    return genreNames[n];
  }
  public getGenre() {
    return  this.genreButtonChosen.filter((item, pos) => this.genreButtonChosen.indexOf(item) === pos);
  }

  public selectGenre(idGenre: number) {
    this.message = 'Genres Available';
    this.slider.nativeElement.valueAsNumber = this.sliderValue;
    this.rating = this.sliderValue;
    this.genreButtonChosen.push(genreNames[idGenre]);
    this.emptyList();
    this.movieStore.forEach((item, index) => {
      const id = item.id;
      item.genre_ids.forEach((idGenreID, indexID) => {
          if (idGenreID === idGenre) {
            this.genreArrayList.push(item.id);
          }
      });
      // remove dup ids when chosing files that are in many categories
      this.removeDuplicateIDs(this.genreArrayList);

    });

    this.emptyList();
     this.movieStore.forEach(movieStoreItem => {
                this.genreArrayList.forEach( galItem => {
                  if ( galItem === movieStoreItem.id) {
                    this.moviesNowPlaying.push(movieStoreItem);
                  }
                });

          });
      this.orderByPopularity(this.moviesNowPlaying);
      // make copy of genre list for any rating searches/filter later
      this.copyGenreList = this.moviesNowPlaying;

  }

  // remove dup ids when chosing files that are in many categories
  private removeDuplicateIDs(arr: Array<any>) {
    return this.genreArrayList = arr.filter((item, pos) => {
        return this.genreArrayList.indexOf(item) === pos;
    });
  }

  // after first load ordering can be lost when pushing, so do a quick sweep to re-order
  private orderByPopularity(list: Movie[]) {
    return list.sort((a, b) => {
      return b.popularity - a.popularity ;
    });
  }

  private resetList() {
    this.moviesNowPlaying = this.movieStore;
  }
  public resetGenre(event: any) {
    event.preventDefault();
    this.genreButtonChosen = [];
    this.genreArray = [];
    this.moviesNowPlaying = this.movieStore;
  }

  private emptyList() {
    this.moviesNowPlaying = [];
  }

  public getRating(event: any) {
    this.message = 'Ratings Available';
    this.rating = event.target.valueAsNumber;
    // if no genre picked filter rating on main list
    if (this.genreArrayList.length === 0) {
      this.moviesNowPlaying = this.movieStore.filter(x => {
          return  event.target.valueAsNumber <= x.vote_average;
        });
    } else {
        // if we not filtering on main list we are now filtering on the genre list
        // a copy was made so we can filter and change the current view but keep tabs
        // on the final genre search requested by user
        this.moviesNowPlaying = this.copyGenreList.filter(x => {
          return  event.target.valueAsNumber <= x.vote_average;
        });
    }
  }
}
