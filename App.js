import React, { Component } from 'react';
import { Animated, Image, StyleSheet, Text, View, Easing, Dimensions } from 'react-native';
import { LinearGradient, Font, AppLoading } from 'expo';
import { Button, Card, Icon} from 'react-native-elements';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
    	isReady: false,
      imageHW: new Animated.Value(300)
    }
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
	      			<Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>Sproul Plaza 1:30 p.m.</Text><Icon name='location-on' color='white' />
	      		</View>
	      	</View>
	      	<View style={{flex: 2}}>
	      		<Button large fontWeight='bold' rounded={true} title='Quick Reservation' backgroundColor='#fdbf2e'/>
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
