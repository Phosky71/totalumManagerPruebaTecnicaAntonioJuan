import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

window.currentClientPage = 0;
window.currentProductPage = 0;
window.currentPedidoPage = 0;
