import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less'],
})
export class ResultsComponent implements OnInit {
  responseStatus = '';
  planetName = '';
  timeTaken = 0;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {

    // obtaining query parameters to decide which message should be displayed on the page
    this.route.queryParams.subscribe((params) => {
      this.responseStatus = params.get('responseStatus');
      this.planetName = params.get('planetName');
      this.timeTaken = params.get('timeTaken');
    });
  }

  navigateHome(): void {
    this.router.navigate(['/home']);
  }
}
