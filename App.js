import React, { Component } from 'react';
import {
  StatusBar,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Text,
  View,
  StyleSheet
} from 'react-native';
import { Constants } from 'expo';

const { width, height } = Dimensions.get('window');
const DURATION = 400;
const LOGO_SIZE = 130;
const ICON_SIZE = 30;
const CLOSE_MODE = 200;
const ICON_LINE_HEIGHT = 2;

const closeItems = [0, 1];
const burgerItems = [0, 1, 2];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.closeAnimations = [];
    this.burgerAnimations = [];

    closeItems.forEach(i => {
      this.closeAnimations.push(
        new Animated.Value(i === 0 ? -CLOSE_MODE : CLOSE_MODE)
      );
    });

    burgerItems.forEach(i => {
      this.burgerAnimations.push(new Animated.Value(0));
    });

    this.state = {
      animateStripe: new Animated.Value(height),
      animateBg: new Animated.Value(0),
      animateOpacity: new Animated.Value(1),
      finished: false,
      closeFinished: false,
      burgerFinished: false
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
  }

  animateClose() {
    const animations = closeItems.map(i => {
      if (this.state.closeFinished) {
        return Animated.timing(this.closeAnimations[i], {
          toValue: i === 0 ? -CLOSE_MODE : CLOSE_MODE,
          duraction: DURATION
        });
      } else {
        return Animated.sequence([
          Animated.delay(DURATION / 2),
          Animated.timing(this.closeAnimations[i], {
            toValue: 0,
            duraction: DURATION
          })
        ]);
      }
    });

    return Animated.stagger(150, animations);
  }

  animateBurger() {
    const animations = burgerItems.map(i => {
      if (this.state.closeFinished) {
        return Animated.timing(this.burgerAnimations[i], {
          toValue: 0,
          duraction: DURATION
        });
      } else {
        return Animated.timing(this.burgerAnimations[i], {
          toValue: CLOSE_MODE,
          duraction: DURATION
        });
      }
    });

    return Animated.stagger(150, animations);
  }

  renderCloseButton() {
    return (
      <View>
        {closeItems.map(i => {
          const inputRange = i === 0 ? [-CLOSE_MODE, 0] : [0, CLOSE_MODE];

          const bg = this.closeAnimations[i].interpolate({
            inputRange: [-CLOSE_MODE / 3, 0, CLOSE_MODE / 3],
            outputRange: ['#aaa', '#353535', '#aaa']
          });
          const opacity = this.closeAnimations[i].interpolate({
            inputRange: [-CLOSE_MODE / 3, 0, CLOSE_MODE / 3],
            outputRange: [0, 1, 0]
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.line,
                {
                  marginBottom: i === 0 ? -ICON_LINE_HEIGHT : 0,
                  backgroundColor: bg,
                  transform: [
                    {
                      rotate: i === 0 ? '90deg' : '0deg'
                    },
                    {
                      translateX: this.closeAnimations[i]
                    }
                  ]
                }
              ]}
            />
          );
        })}
      </View>
    );
  }

  renderBurger() {
    return (
      <View
        style={[
          styles.closeContainer,
          styles.burgerContainer,
          { position: 'absolute', top: 0, right: 0 }
        ]}>
        <Animated.View
          style={[
            styles.line,
            styles.lineMedium,
            {
              transform: [
                {
                  translateX: this.burgerAnimations[1]
                }
              ]
            }
          ]}
        />
        <Animated.View
          style={[
            styles.line,
            {
              transform: [
                {
                  translateX: this.burgerAnimations[0]
                }
              ]
            }
          ]}
        />
        <Animated.View
          style={[
            styles.line,
            styles.lineSmall,
            {
              transform: [
                {
                  translateX: this.burgerAnimations[2]
                }
              ]
            }
          ]}
        />
      </View>
    );
  }

  restartAnimation() {
    if (this.state.finished) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.state.animateBg, {
            toValue: 1,
            duration: DURATION / 10
          }),
          Animated.timing(this.state.animateStripe, {
            toValue: height,
            duration: DURATION,
            easing: Easing.Out
          })
        ]),
        this.animateClose(),
        this.animateBurger(),
        Animated.sequence([
          Animated.delay(DURATION - 150),
          Animated.timing(this.state.animateOpacity, {
            toValue: 1,
            duration: DURATION
          })
        ])
      ]).start(() => {
        this.state.animateBg.setValue(0);
        this.setState({
          closeFinished: !this.state.closeFinished
        });
      });
    } else {
      Animated.parallel([
        Animated.timing(this.state.animateOpacity, {
          toValue: 0,
          duration: DURATION
        }),

        this.animateBurger(),
        this.animateClose(),

        Animated.sequence([
          Animated.delay(DURATION - 150),
          Animated.timing(this.state.animateStripe, {
            toValue: 0,
            duration: DURATION,
            easing: Easing.Out
          })
        ])
      ]).start(() => {
        this.state.animateOpacity.setValue(0);
        this.setState({
          closeFinished: !this.state.closeFinished
        });
      });
    }
  }

  render() {
    const top = this.state.animateStripe.interpolate({
      inputRange: [0, height],
      outputRange: [-height / 4, 0],
      extrapolate: 'clamp'
    });

    const bottom = this.state.animateStripe.interpolate({
      inputRange: [0, height],
      outputRange: [height / 4, 0],
      extrapolate: 'clamp'
    });

    const opacity = this.state.animateStripe.interpolate({
      inputRange: [0, height / 1.5, height],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });

    const translateContent = this.state.animateStripe.interpolate({
      inputRange: [0, height],
      outputRange: [0, 30],
      extrapolate: 'clamp'
    });

    const bgColor = this.state.animateBg.interpolate({
      inputRange: [0, 0.002, 1],
      outputRange: ['transparent', '#2F8BE6', '#2F8BE6']
    });

    const scaleLogo = this.state.animateOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1]
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]}
        />
        <Animated.View
          style={[
            styles.menuContainer,
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'transparent',
              opacity: opacity,
              transform: [{ translateY: translateContent }]
            }
          ]}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around',
              backgroundColor: 'transparent'
            }}>
            <Text style={styles.buttonStyle}>Login</Text>
            <Text style={styles.buttonStyle}>Create account</Text>
            <Text style={styles.buttonStyle}>Support</Text>
            <Text style={styles.buttonStyle}>About</Text>
          </View>
        </Animated.View>
        <View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            transform: [
              {
                rotate: '-35deg'
              }
            ]
          }}>
          <Animated.View
            style={[
              styles.strip,
              styles.top,
              {
                height: this.state.animateStripe,
                transform: [
                  {
                    translateY: top
                  }
                ]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.strip,
              styles.bottom,
              {
                height: this.state.animateStripe,
                transform: [
                  {
                    translateY: bottom
                  }
                ]
              }
            ]}
          />
        </View>
        <Animated.Image
          source={{
            uri: 'https://ui8.s3.amazonaws.com/v5/assets/global/touch-icon-ipad-retina.png'
          }}
          style={[
            StyleSheet.absoluteFill,
            styles.image,
            {
              opacity: this.state.animateOpacity,
              transform: [
                {
                  scale: scaleLogo
                }
              ]
            }
          ]}
        />

        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({
              finished: !this.state.finished
            });
            this.restartAnimation();
          }}>
          <View
            style={[
              styles.closeContainer,
              styles.burgerContainer,
              {
                transform: [
                  {
                    rotate: '-45deg'
                  }
                ]
              }
            ]}>

            {this.renderCloseButton()}
            {this.renderBurger()}
          </View>

        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  closeContainer: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 40,
    right: 40
  },
  line: {
    height: ICON_LINE_HEIGHT,
    width: ICON_SIZE,
    backgroundColor: '#aaa'
  },
  burgerContainer: {
    justifyContent: 'space-around'
  },
  lineMedium: {
    width: ICON_SIZE * 0.67,
    alignSelf: 'flex-start'
  },
  lineSmall: {
    width: ICON_SIZE * 0.45,
    alignSelf: 'flex-end'
  },
  image: {
    resizeMode: 'contain',
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    top: height / 2 - LOGO_SIZE / 2,
    left: width / 2 - LOGO_SIZE / 2
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: height / 5,
    backgroundColor: 'white'
  },
  buttonStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#353535'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1'
  },
  strip: {
    backgroundColor: '#353535',
    height: height,
    width: width * 3
  },
  top: {
    // backgroundColor: 'green'
  },
  bottom: {
    // backgroundColor: 'red',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e'
  }
});
