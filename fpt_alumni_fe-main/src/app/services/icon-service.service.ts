import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, catchError, map } from 'rxjs';
import { ICONS, ICON_URL } from './const/const';

@Injectable({
  providedIn: 'root'
})
export class IconServiceService {

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  public loadIcons(): void {
    let iconLabels = ICONS;
    iconLabels.forEach((label) => {
      this.matIconRegistry.addSvgIcon(
        label,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${ICON_URL}/${label}.svg`)
      );
    });
  }
}
