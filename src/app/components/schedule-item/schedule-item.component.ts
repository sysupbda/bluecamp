import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import gql from 'graphql-tag';

@Component({
  selector: 'app-schedule-item',
  templateUrl: './schedule-item.component.html',
  styleUrls: ['./schedule-item.component.scss']
})
export class ScheduleItemComponent implements OnInit {
  audiences: Observable<any>;
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.audiences = this.apollo
      .watchQuery<any>({
        query: gql`
          {
            allAudiences {
              nodes {
                name
              }
            }
          }
        `
      })
      .valueChanges.pipe(
        tap(o => console.log('o', o)),
        map(result => result.data.allAudiences.nodes)
      );
  }
}
