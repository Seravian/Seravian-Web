import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-member',
  templateUrl: './team-member.component.html',
  styleUrl: './team-member.component.css'
})
export class TeamMemberComponent {
  @Input() member: any;
  @Input() index: number = -1; // Initialize with a default value of -1
}
