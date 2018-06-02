import { NgModule } from '@angular/core';

import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { ApolloModule } from 'apollo-angular';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';

import { HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MaterialModule } from './material.module';

import { environment } from '../environments/environment';
import { ScheduleItemComponent } from './components/schedule-item/schedule-item.component';

@NgModule({
  declarations: [AppComponent, MapComponent, ScheduleItemComponent],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    LeafletModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: 'https://dadsetan.com:3000/graphql' }),
      cache: new InMemoryCache()
    });
  }
}
