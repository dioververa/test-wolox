import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faArrowAltCircleDown,
  faHeart, faHeartbeat, faTimes
} from "@fortawesome/free-solid-svg-icons";
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, mapTo, scan, startWith, switchMap } from 'rxjs/operators';
import { ListTechsApiService } from '../services/list-techs.api.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-list-technologies',
  templateUrl: './list-technologies.component.html',
  styleUrls: ['./list-technologies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routerTransition', [
      state('void', style({})),
      state('*', style({})),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class ListTechnologiesComponent implements OnInit {

  faTimes = faTimes;
  faArrowAltCircleDown = faArrowAltCircleDown;
  faHeart = faHeart;
  faHeartbeat = faHeartbeat;

  filterName = '';
  filterKey = '';
  techs = [];
  readonly criteria = new FormControl('');
  readonly filterValue = (item: string, value: string): boolean => item.includes(value);
  $updateList = new Subject();
  favorites = [];

  techTypeSelected = new FormControl();
  techsType = ['Back-End', 'Front-End', 'Mobile'];
  ordersBy = [
    {
      key: 'nameAscending',
      filterName: this.translateService.instant('general.nameAscending'),
      cb: (tech1, tech2) => (tech1.tech > tech2.tech) ?
      1 : ((tech2.tech > tech1.tech) ? -1 : 0)
    },
    {
      key: 'nameDescending',
      filterName: this.translateService.instant('general.nameDescending'),
      cb: (tech1, tech2) => (tech1.tech < tech2.tech) ?
      1 : ((tech2.tech < tech1.tech) ? -1 : 0)
    }
  ];

  readonly searchingTechs$ = this.criteria.valueChanges.pipe(
    startWith(''),
    this.techsSearch(this.getTechs.bind(this)),
    catchError((err, caught) => {
      return of([]);
    })
  );

  constructor(
    public router: Router,
    private translateService: TranslateService,
    private listTechsApiService: ListTechsApiService,
    private cdRef: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.favorites = JSON.parse(localStorage.getItem("favorites") || '[]');
    merge(
      this.searchingTechs$.pipe(map( value => ({isValuechanged: true, items: value}))),
      this.criteria.valueChanges.pipe(mapTo({isValuechanged: false})),
      this.techTypeSelected.valueChanges.pipe(
        switchMap(value => this.getTechs({type: value})),
        map( value => ({isValuechanged: true, items: value}))
      ),
      this.$updateList.pipe(mapTo({isValuechanged: false})),
    ).subscribe( (value: any) => {
      const items = value.isValuechanged ? value.items : this.techs;
      this.techs = (items || [])
      .map(value => ({...value, ...{isFavorite: this.favorites.some(item => item === value.tech)}}))
      .filter(item => item.tech.includes(this.criteria.value) 
        && (!this.techTypeSelected.value || item.type.includes(this.techTypeSelected.value))) 
      .sort(this.ordersBy.find(item => item.key === this.filterKey)?.cb || this.ordersBy[0]?.cb)
      this.cdRef.markForCheck();
    }, err => {
      console.error('merge err: ', err);
    });
    this.$updateList.next();
  }

  OnOrderBy(key: string) {
    this.filterKey = key;
    this.filterName = this.ordersBy.find(item => item.key === key)?.filterName || '';
    this.$updateList.next();
  }

  OnSelectType(key: string) {
    this.filterKey = key;
    this.filterName = this.ordersBy.find(item => item.key === key)?.filterName || '';
    this.$updateList.next();
  }

  eraseFilter() {
    this.filterKey = '';
    this.filterName = '';
    this.$updateList.next();
  }

  saveFavorite(name) {
    this.favorites = this.favorites.some(value => value === name) ? 
    this.favorites.filter(value => value !== name) :
    [...this.favorites, name];
    this.$updateList.next();
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  techsSearch<T>(
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
      switchMap(value => getSearchFunction({tech: value}).pipe(startWith(null))),
      startWith([])
    );
  }

  getTechs(query): Observable<any[]>{
    return this.listTechsApiService.getAllTechs<any[]>(query)
    .pipe(catchError((err, caught) => {
        return of([]);
      })
    );
  }

  onCriteriaClear() {
    this.criteria.setValue('');
    this.cdRef.markForCheck();
  }

}
