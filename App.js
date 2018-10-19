import React, { Component } from 'react';
import { Animated, Image, StyleSheet, Text, View, Easing, Dimensions, Linking } from 'react-native';
import { LinearGradient, Font, AppLoading } from 'expo';
import { Button, Card, Icon} from 'react-native-elements';


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
    	isReady: false,
      imageHW: new Animated.Value(300),
      locationText: "Sproul Hall @ 1:30 P.M."
    }
  }

  reserveButtonClicked() {
    //1. Check if user logged in
    //2. Log in using Google
    // Dialog asking amount
    // Options: pay with cash or pay with Venmo/Paypal
  }

  locationIconClicked() {
    var locOnly = this.state.locationText.split('@')[0];
    Linking.openURL("http://maps.google.com/maps?q=" + locOnly.replace(' ','+'));
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.imageHW, {
          toValue: 310,
          duration: 1000,
          ease: Easing.bounce
        }),
        Animated.timing(this.state.imageHW, {
          toValue: 300,
          duration: 1000,
          ease: Easing.bounce
        })
      ])
    ).start();
  }

  async componentWillMount() {
  await Font.loadAsync({
    'zuliapro': require('./assets/fonts/ZuliaPro.otf')
  });
  this.setState({isReady:true})
}


  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <LinearGradient style={styles.container} colors={['#f59937', '#fb9875', '#cd6385']}>
	      	<View style={{flex: 2}}>
	      		<Text style={{top:50, color: '#fff', fontSize: 50, fontFamily: 'zuliapro'}}>Mealy</Text>
	      	</View>
	      	<View style={{flex: 4}}>
	      		<Animated.Image style={{resizeMode: 'contain', width: this.state.imageHW, height:this.state.imageHW}} source={require('./assets/img/meal1.png')} />
	      	</View>
	      	<View style={{flex: 2}}>
	      		<Text style={{color: '#fff', fontSize: 40, textAlign: 'center'}}>$5 Beef with rice</Text>
	      		<View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text 
                style={{color: '#fff', fontSize: 20, textAlign: 'center'}}> {this.state.locationText} 
              </Text>
              <Icon name='location-on' color='white' onPress={this.locationIconClicked.bind(this)} />
	      		</View>
	      	</View>
	      	<View style={{flex: 2}}>
            <Button large fontWeight='bold' rounded={true} title='Reserve Now!' backgroundColor='#fdbf2e' onPress={this.reserveButtonClicked}/>
	      	</View>
      </LinearGradient>
    );
  }
}

var firebase = require("firebase");

var config = {
  authDomain: "californiafoodapp.firebaseapp.com",
  databaseURL: "https://californiafoodapp.firebaseio.com",
  projectId: "californiafoodapp",
  storageBucket: "californiafoodapp.appspot.com",
  messagingSenderId: "1034070381072"
};

if(!firebase.apps.length) {
  firebase.initializeApp(config);
}

function saveReservation(email, timestamp){
  //Save JSON of string
  firebase.database().ref("Client Reservations/").set({
    email,
    timestamp
  }).then((data) => {
    console.log("data", data);
  }).catch((error) => {
    console.log("error", error)
  })
}

saveReservation("fredtest00@berkeley.edu", new Date().getDate());

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});
