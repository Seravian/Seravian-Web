import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  private router = inject(Router)
onsubmit(){
  this.router.navigate(['/dashboard']);

}
}
