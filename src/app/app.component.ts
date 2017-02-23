import { Component, OnInit } from '@angular/core';
import { initializeApp, database, app, auth } from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

var _ = require('underscore');
// import { _ } from 'underscore.js';
// import * as _ from 'underscore';
// const config = {
//   apiKey: "AIzaSyBhg6wpEhmXL_tCaRHfLeEFEwHmhLDXLF8",
//   authDomain: "people-82905.firebaseapp.com",
//   databaseURL: "https://people-82905.firebaseio.com",
//   storageBucket: "people-82905.appspot.com",
//   messagingSenderId: "96247822155"
// };
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  _hasData = false;
  messages: FirebaseListObservable<any>;
  comments: FirebaseListObservable<any>;
  snap = [];
  _newcomplaint: string = null;
  _ifNewComplaint: boolean = false;
  _isAuthenticated: boolean = false;
  loading_text = "Loading messages...";
  _username = "Kannagi";
  _user: any;
  constructor(private af: AngularFire) {

  }
  ngOnInit() {
    // initializeApp(config);
    // if (!this._isAuthenticated)
    // this.signin();
    // return;
    this.loadComplaints();

  }
  loadComplaints() {
    this._hasData = false;
    this.messages = this.af.database.list('people/thoibi');
    this.messages.subscribe((values) => {
      if (values)
        this._hasData = true;
    })
    // this.af.database.list('people/thoibi').forEach((value)=>{

    // }); 
    // this.messages.$ref.on('value', (snap) => {
    //   this._hasData = true;
    //   console.log(snap);
    //   if (this._isAuthenticated)
    //     this._ifNewComplaint = true;
    // });

    // this.messages.subscribe((res) => {
    //   if (!this.messages)
    //     this.loading_text = " 👅 No complaints! Sign in & Tap (+) to start adding complaints";
    //   if (!this.messages && this._isAuthenticated)
    //     this._ifNewComplaint = true;
    // })


    // database().ref('people/thoibi').limitToLast(50).on('value', (snap) => {
    //   //  this.messages = snap.val();
    //   // this.messages = _.values(snap.val());
    //   console.log(snap.val());
    //   this.messages = [];
    //   _.each(snap.val(), (value, key) => {
    //     this.messages.push({ key: key, value, comments: _.values(value.comments) });
    //   });
    // _.sort()
    //   if (!this.messages.length)
    //     this.loading_text = " 👅 No complaints! Sign in & Tap (+) to start adding complaints";
    //   if (!this.messages.length && this._isAuthenticated)
    //     this._ifNewComplaint = true;
    //   // console.log(this.messages);
    // });
  }
  /*messages = [
    {
      msgid: 1,
      text: "Ei ngasi thawai yam nungaite1",
      time: "4:15 AM, Feb 15, 2017",
      location: "",
      like_count: 10,
      comments: [
        "Karigi?", "Kamai tourino1"
      ]
    },
    {
      msgid: 2,
      text: "Ei ngasi thawai yam nungaite2",
      time: "4:15 AM, Feb 15, 2017",
      location: "",
      like_count: 10,
      comments: [
        "Karigi?", "Kamai tourino2"
      ]
    },
    {
      msgid: 3,
      text: "Ei ngasi thawai yam nungaite3",
      time: "4:15 AM, Feb 15, 2017",
      location: "",
      like_count: 10,
      comments: [
        "Karigi?", "Kamai tourino3"
      ]
    },
  ]*/
  msgindex: number;
  showComments(index: number, key: any) {
    // console.log(index);
    this.msgindex = index;
    this.comments = this.af.database.list('people/thoibi/' + key + '/comments')
    // this.comments.subscribe((values) => {
    //   console.log(values);
    // })
  }
  addComment(key, text: string, lastCount: number) {
    // console.log(text);
    // this.messages[this.msgindex].comments.push().;
    // this.snap.
    let comment = {
      user: this._user,
      comment: text
    }
    console.log(key)
    this.af.database.object('/people/thoibi/' + key).$ref.child('comments').push(comment);
    this.af.database.object('/people/thoibi/' + key).$ref.child('comment_count').set(lastCount + 1);
    // database().ref('/people/thoibi/' + key).child('comments').push(comment)
  }
  fav(key, lastval: number) {
    if (!this._isAuthenticated)
      return
    // console.log(i);
    // this.messages[i].like_count += 1;
    // console.log(this.messages[i].like_count);
    // database().ref('/people/thoibi').pus

    // database().ref('/people/thoibi/' + key).child('like_count').set(lastval + 1);
    console.log(key);
    this.af.database.object('/people/thoibi/' + key).$ref.child('like_count').set(lastval + 1);
    // database().ref('/people/thoibi/' + key).child('liked_by').push(this._user);
    this.af.database.object('/people/thoibi/' + key).$ref.child('liked_by').push(this._user);
  }
  addComplaint(text: string) {
    if (!text.length)
      return
    this._newcomplaint = text;
    let msg = {
      user: this._user,
      comment_count: 0,
      text: text,
      time: Date.now(),
      location: '',
      like_count: 0,
      comments: []
    }
    this.af.database.object('/people').$ref.child('thoibi').push(msg).then((res) => {
      this._newcomplaint = null;
      this._ifNewComplaint = !this._ifNewComplaint;
    });
    // database().ref('/people').child('thoibi').push(msg)
    //   // .set(msg)
    //   .then((res) => {
    //     this._newcomplaint = null;
    //     this._ifNewComplaint = !this._ifNewComplaint;
    //     // this.messages.push(msg);
    //   })
  }
  toggleNewComplaint() {
    if (!this._isAuthenticated)
      this.signin()
    this._ifNewComplaint = !this._ifNewComplaint;
  }
  authenticate(pass: number) {
    if (pass == 125)
      this._isAuthenticated = true;
  }
  signin() {
    if (!this._isAuthenticated)
      auth().signInWithPopup(new auth.GoogleAuthProvider())
        .then((res) => {
          this._isAuthenticated = true;
          this._user = auth().currentUser.toJSON();
          this._username = this._user.displayName;
          // console.log(this._user)
          // this.loadComplaints();
        });
    else
      auth().signOut().then(res => {
        this._isAuthenticated = false;
        console.log("logged out successfully.")
        this._user = null;
        this._username = "Kannagi"
      });
  }
}
