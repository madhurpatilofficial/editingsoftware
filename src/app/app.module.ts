import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { AppComponent } from './app.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule} from '@angular/material/tooltip';

import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FooterComponent } from './components/footer/footer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ColorSketchModule } from 'ngx-color/sketch';

@NgModule({
  declarations: [
    AppComponent,
    TextEditorComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    FormsModule,
    MatDialogModule,
    ColorSketchModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }