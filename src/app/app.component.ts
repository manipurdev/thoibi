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
    // if(typeof(Storage) !== "undefined"){
    //   console.log('cookie!!')
    // }
    // else{
    //   console.log('no cookies!')
    // }
    this.signwithcookie();

  }
  signwithcookie() {
    let lastuser = localStorage.getItem("user");

    if (lastuser) {
      this._user = JSON.parse(lastuser);
      this._isAuthenticated = true;
      console.log(this._user['uid']);
    }
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

  showComments(key: any) {
    // console.log(index);
    this.comments = this.af.database.list('people/thoibi/' + key + '/comments')
    this.af.database.list('people/thoibi/' + key).$ref.ref.child('unread_count').set(0);
    // this.comments.subscribe((values) => {
    //   console.log(values);
    // })
  }
  addComment(key, uid: string, text: string, lastCount: number, unread_count: number) {
    // console.log(text);
    // this.messages[this.msgindex].comments.push().;
    // this.snap.
    let comment = {
      user: this._user,
      comment: text,
      read_by_owner: false
    }
    console.log(key)
    console.log(this._user['uid'] != uid)
    this.af.database.object('/people/thoibi/' + key).$ref.child('comments').push(comment);
    this.af.database.object('/people/thoibi/' + key).$ref.child('comment_count').set(lastCount + 1);
    if (this._user['uid'] != uid)
      this.af.database.object('/people/thoibi/' + key).$ref.child('unread_count').set(unread_count + 1);
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
  hide(key) {
    this.af.database.object('/people/thoibi/' + key).$ref.child('hide').set(true);
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
      comments: [],
      unread_count: 0,
      hide: null
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
    // localStorage.setItem(name, JSON.stringify({user: 'ronjan'}));
    // let user = localStorage.getItem(name)
    // console.log(JSON.parse(user))
    // return;
    if (!this._isAuthenticated) { //Sign out, to sign in
      this.signwithcookie();
      if (!this._isAuthenticated)
        auth().signInWithPopup(new auth.GoogleAuthProvider())
          .then((res) => {
            this._isAuthenticated = true;
            this._user = auth().currentUser.toJSON();
            this._username = this._user.displayName;
            // console.log(this._user)
            // this.loadComplaints();
            localStorage.setItem("user", JSON.stringify(this._user));
          });
    }
    else {
      auth().signOut().then(res => {
        this._isAuthenticated = false;
        console.log("logged out successfully.")
        this._user = null;
        this._username = "Kannagi"
        localStorage.removeItem("user");
      });
    }
  }
}
