import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import 'zone.js';

@Component({
  selector: 'create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {
  constructor(private http: HttpClient) { }
}

