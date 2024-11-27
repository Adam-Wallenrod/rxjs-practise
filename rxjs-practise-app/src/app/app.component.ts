import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import moment from 'moment';
import {
  concat,
  concatMap,
  debounceTime, exhaustMap,
  fromEvent,
  interval,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  startWith, switchMap,
  tap,
} from 'rxjs';


export interface User {
  id: number;
  uid: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  gender: string;
  phone_number: string;
  social_insurance_number: string;
  date_of_birth: string; // ISO format date string
  employment: {
    title: string;
    key_skill: string;
  };
  address: {
    city: string;
    street_name: string;
    street_address: string;
    zip_code: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  credit_card: {
    cc_number: string;
  };
  subscription: {
    plan: string;
    status: string;
    payment_method: string;
    term: string;
  };
}

export interface AnimeUser {
  id: string;
  name: string;
  email: string;
  age: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  http$: Observable<User[]>;

  httpMockGet$: Observable<any>;

  title = 'rxjs-practise-app';

  url = 'http://localhost:3000';

  @ViewChild('saveButton') saveButton!: ElementRef;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.http$ = this.http.get<User[]>('https://random-data-api.com/api/v2/users?size=3');
    this.httpMockGet$ = this.http.get(this.url + '/data');
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //this.getData();
    //this.concateObservables();
    //this.mergeObservables();
    this.getMockData();
    this.listenFormChanges();

  }

  ngAfterViewInit(): void {
    this.listenForSearch();
    this.listenForSave();
  }

  concateObservables(): void {
    const series1$ = of(1, 2);
    const series2$ = of('c', 'd');

    const result$ = concat(series1$, series2$);
    //shorthand
    result$.subscribe(console.log);
  }

  mergeObservables(): void {
    const series1$ = interval(1000).pipe(map(val => val * 10));
    const series2$ = interval(1000).pipe(map(val => val * 1000));

    const result$ = merge(series1$, series2$);
    result$.subscribe((res) => console.log('$$$ mergeObservable result --> ', res));
  }

  getData(): void {
    this.http$
      .pipe(
        tap(() => console.log('HTTP request executed.')),
        map(users => users.map(user => user.address)),
      )
      .subscribe(data => {
        console.log('%c fetched data ---> ', 'color: yellow', data);
      });
  }

  getMockData(): void {
    this.httpMockGet$
      .pipe(
        tap(() => console.log('Mocked HTTP request executed.')),
      )
      .subscribe(users => {
        console.log('%c fetched mocked users ---> ', 'color: yellow', users);
      });
  }

  listenFormChanges(): void {
    this.form.valueChanges
      .pipe(
        //concatMap(formValue => this.http.put(this.url + '/data', formValue)  )// inner observable
        mergeMap(formValue => this.http.put(this.url + '/data', formValue)),
      ).subscribe(
      saveResult => {
        console.log('Save Result --> ', saveResult);
      },
    );
  }

  listenForSearch(): void {
    const searchText$: Observable<any> = fromEvent<any>(this.searchInput.nativeElement, 'keyup');
    searchText$.pipe(
      map(event => event.target.value),
      startWith(''),
      debounceTime(200),
    );
    searchText$.pipe(
      tap(text => console.log('tap before switchMap() ', text)),
      switchMap(text => this.getSearchedUsers(text)),
    ).subscribe(result => {
      console.log('search results ==> ', result);
    });
  }

  listenForSave(): void {
    fromEvent(this.saveButton.nativeElement, 'click')
      .pipe(
        //concatMap(()=>  this.http.put(this.url + '/data', this.form.getRawValue())
        exhaustMap(() => this.http.put(this.url + '/data', this.form.getRawValue()),
        ),
      ).subscribe();
  }

  getSearchedUsers(searchPhrase: string): Observable<User[]> {
    const params = new HttpParams().set('search', searchPhrase);
    return this.http.get<User[]>(this.url + '/data', { params });
  }
}
