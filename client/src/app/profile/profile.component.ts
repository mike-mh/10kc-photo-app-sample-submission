import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';

import 'zone.js';
import { JsonApiSerializerService } from '../services/json-api-serializer.service';
import { UserService } from '../services/user.service';

export enum ImageStatusEnum {
  Public = 0,
  Private,
}

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  constructor(private http: HttpClient, private jsonApuSerializerService: JsonApiSerializerService, private userService: UserService) { }
  uploadingImage = false;
  imgSrc = '';
  imgBlob: Blob = new Blob();
  imageStatusEnum = ImageStatusEnum
  selectedImageStatus = ImageStatusEnum.Private;
  imageBeingPreviewed = false;
  hasBefore = false;
  hasAfter = false;

  personalImages: [{
    status: number,
    image: string,
    date: string,
    timestamp: number,
    owner: string,
    id: number
  }] = [] as any;


  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/privateimage')
      .subscribe((r: any) => {
        this.hasAfter = r.meta.hasAfter;
        this.hasBefore = r.meta.hasBefore;
        this.personalImages = r.data.map((a: any) => {
          a.attributes.timestamp = a.attributes.date;
          a.attributes.date = new Date(a.attributes.date).toDateString();
          a.attributes.id = a.id;
          return a.attributes
        });
      });
  }

  toggleUploadDisplay() {
    this.imgSrc = '';
    this.imgBlob = new Blob();
    this.imageBeingPreviewed = false;
    this.uploadingImage = !this.uploadingImage;
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = [];
    files
      .filter(f => f.fileEntry.isFile)
      .forEach(f => {
        const fileEntry = f.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          if (file.type === "image/png" || file.type === "image/jpeg") {
            this.files.push(f);
            const bytes = await file.arrayBuffer();
            this.imgBlob = new Blob([bytes], {
              type: file.type
            });

            this.imgSrc = URL.createObjectURL(this.imgBlob);
            this.imageBeingPreviewed = true;
          }
        });
      });
  }

  public submitImage() { 

    const httpClient = this.http;
    const jsonSerializer = this.jsonApuSerializerService;
    const userService = this.userService;
    const fileReader = new FileReader();
    const imageStatus = this.selectedImageStatus;
    fileReader.readAsDataURL(this.imgBlob);
    const ref = this;
    fileReader.onloadend = function () {
      const base64data = fileReader.result;

      httpClient
        .post('http://localhost:8080/api/images', jsonSerializer.serializeImage({
          owner: userService.getActiveUserId(),
          status: imageStatus,
          image: base64data,
          date: new Date().getTime()
        })).subscribe(r => {
          ref.removeImage();
          ref.http.get('http://localhost:8080/api/privateimage')
            .subscribe((r: any) => {
              ref.hasAfter = r.meta.hasAfter;
              ref.hasBefore = r.meta.hasBefore;
              ref.personalImages = (r as any).data.map((a: any) => {
                a.attributes.date = new Date(a.attributes.date).toDateString();
                a.attributes.id = a.id;
                return a.attributes
              });
              ref.toggleUploadDisplay();
            });
        });
    }
  }

  public removeImage() {
    this.imgSrc = '';
    this.imgBlob = new Blob();
    this.imageBeingPreviewed = false;
  }

  public deleteImage(id: number) {
    this.http.delete(`http://localhost:8080/api/privateimage/${id}`)
      .subscribe(r => {
        this.http.get('http://localhost:8080/api/privateimage')
          .subscribe((r: any) => {
            this.hasAfter = r.meta.hasAfter;
            this.hasBefore = r.meta.hasBefore;
            this.personalImages = r.data.map((a: any) => {
              a.attributes.date = new Date(a.attributes.date).toDateString();
              a.attributes.id = a.id;
              return a.attributes
            });
          });
      });
  }

  onStatusSelectionChange($event: any) {
    this.selectedImageStatus = $event.value;
  }

  public getNextImages() {
    const latestImage = this.personalImages.slice(-1)[0];
    this.http.get(`http://localhost:8080/api/privateimage?page[size]=4&page[after]=${latestImage.timestamp}`)
      .subscribe((r: any) => {
        this.hasAfter = r.meta.hasAfter;
        this.hasBefore = r.meta.hasBefore;
        this.personalImages = r.data.map((a: any) => {
          a.attributes.timestamp = a.attributes.date;
          a.attributes.date = new Date(a.attributes.date).toDateString();
          a.attributes.id = a.id;
          return a.attributes
        });
      });
  }

  public getPreviousImages() {
    const earliestImage = this.personalImages[0];
    this.http.get(`http://localhost:8080/api/privateimage?page[size]=4&page[before]=${earliestImage.timestamp}`)
      .subscribe((r: any) => {
        this.hasAfter = r.meta.hasAfter;
        this.hasBefore = r.meta.hasBefore;
        this.personalImages = r.data.map((a: any) => {
          a.attributes.timestamp = a.attributes.date;
          a.attributes.date = new Date(a.attributes.date).toDateString();
          a.attributes.id = a.id;
          return a.attributes
        });
      });
  }
}
