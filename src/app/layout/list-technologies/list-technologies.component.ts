import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, mapTo, scan, startWith, switchMap } from 'rxjs/operators';
import { ListTechsApiService } from '../services/list-techs.api.service';
import { faTimes, faArrowAltCircleDown,
  faHeart, faHeartbeat
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-list-technologies',
  templateUrl: './list-technologies.component.html',
  styleUrls: ['./list-technologies.component.scss']
})
export class ListTechnologiesComponent implements OnInit {

  faTimes = faTimes;
  faArrowAltCircleDown = faArrowAltCircleDown;
  faHeart = faHeart;
  faHeartbeat = faHeartbeat;

  noVisible = false;
  filterName = '';
  filterKey = '';
  pendingMessagesList = [];
  viewedMessagesList = [];
  techs = [];
  readonly criteria = new FormControl('');
  readonly filterValue = (item: string, value: string): boolean => item.includes(value);
  readonly emptyArray = [];
  isSearchingActived = false;
  $updateList = new Subject();
  favorites = [];

  techTypeSelected = new FormControl();
  techsType = ['Back-End', 'Front-End', 'Mobile'];
  ordersBy = [
    {
      key: 'nameAscending',
      filterName: this.translateService.instant('general.nameAscending'),
      cb: (messageA, messageB) => (messageA.channel.Name > messageB.channel.Name) ?
      1 : ((messageB.channel.Name > messageA.channel.Name) ? -1 : 0)
    },
    {
      key: 'nameDescending',
      filterName: this.translateService.instant('general.nameDescending'),
      cb: (messageA, messageB) => (messageA.channel.Name < messageB.channel.Name) ?
      1 : ((messageB.channel.Name < messageA.channel.Name) ? -1 : 0)
    }
  ];

  readonly searchingMessages$ = this.criteria.valueChanges.pipe(
    this.messageSearch(this.getMessages.bind(this)),
    catchError((err, caught) => {
      return of([]);
    })
  );

  constructor(
    public router: Router,
    private translateService: TranslateService,
    private listTechsApiService: ListTechsApiService
  ) { }

  async ngOnInit() {
    this.favorites = JSON.parse(localStorage.getItem("favorites") || '[]');
    merge(
      this.searchingMessages$.pipe(map( value => ({isValuechanged: true, items: value}))),
      this.criteria.valueChanges.pipe(mapTo({isValuechanged: false})),
      this.criteria.valueChanges.pipe(
        switchMap(value => this.getMessages({type: value})),
        mapTo({isValuechanged: false})
      ),
      this.$updateList.pipe(mapTo({isValuechanged: false})),
    ).subscribe( (value: any) => {
      const items = value.isValuechanged ? value.items : this.techs;
      this.techs = (items || [])
      .map(value => ({...value, isFavorite: this.favorites.some(item => item === value.name)}))
      .filter(item => item.name.includes(this.criteria.value)) 
      .sort(this.ordersBy.find(item => item.key === this.filterKey)?.cb || this.ordersBy[0]?.cb)
    }, err => {
      console.error('merge err: ', err);
    });
    this.$updateList.next();
  }

  OnOrderBy(key: string) {
    this.noVisible = true;
    this.filterKey = key;
    this.filterName = this.ordersBy.find(item => item.key === key)?.filterName || '';
    this.$updateList.next();
  }

  OnSelectType(key: string) {
    this.noVisible = true;
    this.filterKey = key;
    this.filterName = this.ordersBy.find(item => item.key === key)?.filterName || '';
    this.$updateList.next();
  }

  eraseFilter() {
    this.noVisible = false;
    this.filterKey = '';
    this.filterName = '';
    this.$updateList.next();
  }

  saveFavorite(name) {
    this.techs = this.techs.filter(value => value.name === name)
    .map(value => ({...value, isFavorite: this.favorites.some(item => item === value.name)}));
    const favorites = this.techs.reduce((curr, acum) => {
      curr.isFavorite ? [...acum, curr.name] : acum
    }, []);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  messageSearch<T>(
    getSearchFunction: (search: any) => Observable<T[]>,
    searchDebouceTimeMs: number = 200,
  ): OperatorFunction<string, T[] | null> {
    return source => source.pipe(
      debounceTime(searchDebouceTimeMs),
      scan((previousSearched, current) => {
        return previousSearched !== '' && current.includes(previousSearched)
          ? previousSearched
          : current;
      }, ''),
      distinctUntilChanged(),
      switchMap(value => getSearchFunction({name: value}).pipe(startWith(null))),
      startWith([])
    );
  }

  getMessages(query): Observable<any[]>{
    return this.listTechsApiService.getAllTechs<any[]>(query)
    .pipe(catchError((err, caught) => {
        return of([]);
      })
    );
  }

  onCriteriaClear() {
    this.criteria.setValue('');
  }

}
