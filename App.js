import React, { Component } from 'react';
import { Animated, Alert, AlertIOS, Image, StyleSheet, Text, View, Easing, Dimensions, Linking } from 'react-native';
import { LinearGradient, Font, AppLoading } from 'expo';
import Expo from 'expo';
import { Button, Card, Icon} from 'react-native-elements';
import firebase from 'firebase';
import { isNumber } from 'util';

var config = {
  authDomain: "californiafoodapp.firebaseapp.com",
  databaseURL: "https://californiafoodapp.firebaseio.com",
  projectId: "californiafoodapp",
  storageBucket: "californiafoodapp.appspot.com",
  messagingSenderId: "1034070381072",
  apiKey: "AIzaSyAXzCBIn6SJFKH_hUSkeswcazZuU62QYTs"
};

if(!firebase.apps.length) {
  firebase.initializeApp(config);
}

function saveReservation(customerName, numberReservations, paymentMethod){
  var today = new Date();
  var day = (today.getDate() < 10) ? '0'+today.getDate() : today.getDate();
  var month = today.getMonth()+1;//(today.getMonth()+1 < 10) ? today.getMonth()+1 : toString(today.getMonth()+1);
  var year = today.getFullYear();
  today = month+'/'+day+'/'+year;
  var dateReservation = today;

  //Save JSON of string
  firebase.database().ref("Client Reservations/"+customerName+"/").set({
    customerName,
    numberReservations,
    paymentMethod,
    dateReservation
  }).then((data) => {
    console.log("data", data);
  }).catch((error) => {
    console.log("error", error)
  })
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      name: "",
      photoURL: "",
    	isReady: false,
      imageHW: new Animated.Value(300),
      numReservations: 0,
      locationText: "Sproul Hall @ 1:30 P.M.",
    }
    this.buttonRef = React.createRef();
  }

    signIn = async () => {
      try {
        const result = await Expo.Google.logInAsync({
          androidClientId: "",
          webClientId: "",
          iosClientId: "",
          scopes: ["profile", "email"]
        })
        if(result.type === "success") {
          this.setState({
            signedIn: true,
            name: result.user.name,
            photoURL: result.user.photoUrl,
          });
          this.reserveButtonClicked();
        } else {
          console.log("Login Failed");
        }
      } catch (e) {
        console.log("error", e)
        }
    }

  reserveButtonClicked() {
    //1. Check if user logged in
    if(this.state.signedIn) {
      console.log(this.state.name);
      AlertIOS.prompt(
        'Number of Reservations:',
        'Enter number of reservations for ' + this.state.name + ':',
        [ {
            text: 'Cancel',
            onPress: () => console.log("no reservations this time"),
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: (value) => this.checkInput(value)
          }
        ]
      )
      
    }
    else {
      //Login using Google
      Alert.alert(
        'Authentication Required',
        'Please Sign In to continue your reservation!',
        [
          {text: 'Cancel', onPress: () => console.log("Cancel button pressed"), style: 'cancel'},
          {text: 'Will Do!', onPress: () => this.signIn()}
        ],
        {cancelable: false}
      );
    }    
  }

  checkInput(value) {
    console.log(parseInt(value));
    if(isNumber(parseInt(value)) && parseInt(value) > 0) {
      var intValue = parseInt(value);
      Alert.alert(
        'Your total for ' + intValue+' meals: $' + intValue*7+'.00',
        'Please select your preferred payment method: ',
        [
          {text: 'PayPal', onPress: () => this.handleReservation(this.state.name, value, "PayPal (paid)")},
          {text: 'Cash', onPress: () => this.handleReservation(this.state.name, value, "Cash (collect)")},
          {text: 'Back', onPress: () => this.reserveButtonClicked()}
        ],
        {cancelable: false}
      );
    }
    else {
      Alert.alert(
        'Invalid Reservation Number',
        'Please enter a valid number of reservations.',
        [
          {text: 'OK', onPress: () => this.reserveButtonClicked()}
        ],
        {cancelable: false}
      );
    }
  }

  handleReservation(name, amount, paymentMethod) {
    saveReservation(name, amount, paymentMethod);
    //Call method to change the Reserve button
    //this.buttonRef.current.disabled=true;
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
	      		<Text style={{color: '#fff', fontSize: 40, textAlign: 'center'}}>$7 Beef with rice</Text>
	      		<View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text 
                style={{color: '#fff', fontSize: 20, textAlign: 'center'}}> {this.state.locationText} 
              </Text>
              <Icon name='location-on' color='white' onPress={this.locationIconClicked.bind(this)} />
	      		</View>
	      	</View>
	      	<View style={{flex: 2}}>
            <Button large fontWeight='bold' rounded={true} title='Reserve Now!' backgroundColor='#fdbf2e' onPress={this.reserveButtonClicked.bind(this)}/>
	      	</View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});
