import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import 'zone.js';
import { JsonApiSerializerService } from '../services/json-api-serializer.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'public-images',
  templateUrl: './public-images.component.html',
  styleUrl: './public-images.component.css'
})
export class PublicImagesComponent implements OnInit {
  images: [{
    id: string,
    image: string,
    date: string,
    timestamp: number,
    owner: string,
  }] = [] as any;

  comments: [{
    comment: string,
    date: string,
    timestamp: number,
    time: string,
    owner: string,
  }] = [] as any;

  hasBefore = false;
  hasAfter = false;
  viewingComments = false;
  writingComment = false;
  isSignedIn = false;

  commentImg = '';
  commentImageOwner = '';
  commentImageDate = '';
  commentImageId = '';
  newCommentText = '';

  constructor(
    private http: HttpClient,
    private jsonApiSerializerService: JsonApiSerializerService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.isSignedIn = !!localStorage.getItem('access_token');
    this.userService.isLoggedIn()
      .subscribe(isLoggedIn => this.isSignedIn = isLoggedIn);
    this.http.get('http://localhost:8080/api/images')
      .subscribe((r: any) => {
        this.hasAfter = r.meta.hasAfter;
        this.hasBefore = r.meta.hasBefore;
        this.images = r.data.map((a: any) => {
          a.attributes.id = a.id;
          a.attributes.timestamp = a.attributes.date;
          a.attributes.date = new Date(a.attributes.date).toDateString();
          return a.attributes
        });
      });
  }

  public getNextImages() {
    const latestImage = this.images.slice(-1)[0];
    this.http.get(`http://localhost:8080/api/images?page[size]=4&page[after]=${latestImage.timestamp}`)
      .subscribe((r: any) => {
        this.hasAfter = r.meta.hasAfter;
        this.hasBefore = r.meta.hasBefore;
        this.images = r.data.map((a: any) => {
          a.attributes.id = a.id;
          a.attributes.timestamp = a.attributes.date;
          a.attributes.date = new Date(a.attributes.date).toDateString();
          return a.attributes
        });
      });
  }

  public getPreviousImages() {
    const earliestImage = this.images[0];
    this.http.get(`http://localhost:8080/api/images?page[size]=4&page[before]=${earliestImage.timestamp}`)
      .subscribe((r: any) => {
        this.hasAfter = r.meta.hasAfter;
        this.hasBefore = r.meta.hasBefore;
        this.images = r.data.map((a: any) => {
          a.attributes.id = a.id;
          a.attributes.timestamp = a.attributes.date;
          a.attributes.date = new Date(a.attributes.date).toDateString();
          return a.attributes
        });
      });
  }

  public displayComments(imgId: string, imgSrc: string, imgOwner: string, postedDate: string) {
    this.commentImageId = imgId;
    this.commentImg = imgSrc;
    this.viewingComments = true;
    this.commentImageDate = postedDate;
    this.commentImageOwner = imgOwner;

    this.http.get(`http://localhost:8080/api/comments?filter[image]=${imgId}`)
      .subscribe((r: any) => {
        this.comments = r.data.map((c: any) => ({
          comment: c.attributes.comment,
          date: (new Date(c.attributes.date)).toDateString(),
          timestamp: c.attributes.date,
          time: (new Date(c.attributes.date)).toLocaleTimeString('en-US'),
          owner: c.attributes.owner,
        }));
      })
  }

  public exitComments() {
    this.viewingComments = false;
    this.writingComment = false;
  }

  public startWritingComment() {
    this.writingComment = true;
  }

  public stopWritingComment() {
    this.writingComment = false;
    this.newCommentText = '';
  }

  public submitComment() {
    this.http.post('http://localhost:8080/api/comments?imgid',
      this.jsonApiSerializerService.serializeComment(
        {
          comment: this.newCommentText,
          date: (new Date()).getTime(),
          imageid: this.commentImageId,
        }))
      .subscribe((r: any) => {
        this.newCommentText = '';

        this.http.get(`http://localhost:8080/api/comments?filter[image]=${this.commentImageId}`)
        .subscribe((r: any) => {
          this.comments = r.data.map((c: any) => ({
            comment: c.attributes.comment,
            date: (new Date(c.attributes.date)).toDateString(),
            timestamp: c.attributes.date,
            owner: c.attributes.owner,
          }));
        })

        this.writingComment = false;
      });
  }
}

