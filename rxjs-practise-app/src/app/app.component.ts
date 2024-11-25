import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import moment from 'moment';
import { map, Observable, tap } from 'rxjs';


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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  form: FormGroup;

  http$: Observable<User[]>;

  httpMock$: Observable<any>;

  title = 'rxjs-practise-app';

  url = 'http://localhost:3000';

  constructor( private fb: FormBuilder, private http: HttpClient) {
    this.http$ = this.http.get<User[]>('https://random-data-api.com/api/v2/users?size=3');
    this.httpMock$ = this.http.get(this.url + '/data')
    this.form = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      releasedAt: [moment().format('MMMM Do YYYY, h:mm:ss a')],
      longDescription: ['', Validators.required]
    })
  }

  ngOnInit() {
    //this.getData();
    this.getMockData();
  }



  getData(): void {
    this.http$
      .pipe(
        tap(()=> console.log('HTTP request executed.')),
        map(users=> users.map(user => user.address)),
      )
      .subscribe(data => {
        console.log('%c fetched data ---> ', 'color: yellow', data);
      });
  }

  getMockData(): void {
    this.httpMock$
      .pipe(
        tap(()=> console.log('Mocked HTTP request executed.')),
      )
      .subscribe(users => {
        console.log('%c fetched mocked users ---> ', 'color: yellow', users);
      });
  }

  showFormValues(): void {
    console.log('Form VALUES: ', this.form.getRawValue());
  }
}
