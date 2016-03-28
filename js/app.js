// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'backbone'

function app() {

// ----- Model/Collection ----- //

 	var IphyCollection = Backbone.Collection.extend({
		url: 'http://api.giphy.com/v1/gifs/search?',
		_apiKey: "dc6zaTOxFJmzC",

		parse: function(rawJSON) {
			console.log(rawJSON)
			return rawJSON.data
		}
	})

// ----- View  ----- //

	var AppView = React.createClass({

		componentWillMount: function(){ // before anything renders this will act as an event listener, want it to only run once
			var self = this
			this.props.gifs.on('sync',function() {self.forceUpdate()})
		},

		render: function() {
			console.log('rendering app')

			return (
				<div className="gifsContainer" >
					<Header/>
					<Search/>
					<Scroll gifs={this.props.gifs} />
				</div>
				)
		}
	})

	var Header = React.createClass({
		render: function() {
			return (
				<div className="titleContainer">
					<h1 className="pageTitle">Iphy Page!</h1>
					<h3 className="subTitle">Search for the gifs</h3>
				</div>
				)
		}
	})

	var Scroll = React.createClass({
		_getGifsJsx: function(objArr) {
			// method 1
			var gifsArray = []
			var counter = 0
			objArr.forEach(function(gifObj) {
				counter += 1
				var component = <Gifs gif={gifObj} key={counter} />
				gifsArray.push(component)
			})
			return gifsArray
		},

		render: function() {
			return (
				<div className="gifScroll">
					{this._getGifsJsx(this.props.gifs.models)}
				</div>
				)
		}
	})

	var Gif = React.createClass({

		render: function() {
			console.log(this)
			var gifModel = this.props.gif
			console.log(gifModel.get('cats'))

			return (
				<div className="gif">
					<img src={gifModel.get('images').original.url} />
				</div>
				)
		}
	})


// ------- Router  ------- //

	var IphyRouter = Backbone.Router.extend({

		routes: {
			"scroll/:query": "handleScrollView",
			"*default": "home"
		},

		handleScrollView: function(query) { //run promise

			this.collection.reset()
			this.collection.fetch({
				data: {
					q: query,
					"api_key":this.collection._apiKey
				}
			})	

			DOM.render(<AppView gifs={this.collection} />, document.querySelector('.container')) //render data!
		},

		home: function() {
			location.hash = "home"
			DOM.render(<HomeView/>, document.querySelector('.container'))
		},

		initialize: function() {
			this.collection = new IphyCollection
			Backbone.history.start()
		}
	})

	var rtr = new IphyRouter()
}

app()











