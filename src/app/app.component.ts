import { Component , CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import * as intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    
  }
  title = 'Seravian';
}
