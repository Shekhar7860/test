import React, { Component } from 'react';
import { SafeAreaView, Platform, Alert, TextInput, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { ScaledSheet, moderateScale,verticalScale, scale } from "react-native-size-matters";
import { strings } from '../locales/i18n';
import Appurl from './../config';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import * as userActions from '../src/actions/userActions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('window')
class otpInput extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      one: '',
      two: '',
      three: '',
      four: '',
      isOneValid: false,
      isTwoValid: false,
      isThreeValid: false,
      isFourValid: false,
      visible: false,
      empty_character: ' ', 
      isDisabled : false

    }
  }

  confirm = () => { 
      alert("Invalid Code")
  }
  componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      if (connectionInfo.type == 'none' || connectionInfo.type == 'unknown') {
        this.props.actions.checkInternet(false);
      }
      else {
        this.props.actions.checkInternet(true);
      }
    });
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }
  componentWillUnmount() {
    let { actions } = this.props;
    actions.toggleButton(false);
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }
  _handleConnectionChange = (isConnected) => {
    this.props.actions.checkInternet(isConnected);
  }
  back = () => {
    this.props.navigation.goBack(null)
  }
  resendOtp = () => {
    if (!this.props.user.netStatus) {
      return Alert.alert(
        '',
        strings('globalValues.NetAlert'),
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: () => {
              this.setState({ isDisabled: false, visible: false });
            }
          }
        ],
        { cancelable: false }
      );
    }
    else {
      this.setState({ visible: true });
      let values = { 'userId': this.props.user.loginFieldId };
      return axios.post(`${Appurl.apiUrl}resendUserotp`, values)
        .then((response) => {
          this.setState({ visible: false });
          setTimeout(() => {
            Alert.alert(
              '',
              strings('otp.OtpSuccess'),
              [
                {
                  text: strings('globalValues.AlertOKBtn'),
                  onPress: () => {
                  }
                }
              ]
            )
          }, 600)
        }).catch((error) => {
          if (error.response.data.success == 0) {
            this.setState({ visible: false });
            setTimeout(() => {
              Alert.alert(
                '',
                error.response.data.msg,
                [
                  {
                    text: strings('globalValues.AlertOKBtn'),
                    onPress: () => {
                    }
                  }
                ],
                { cancelable: false }
              );
            }, 600)
          }
        })
    }
  }
  validate = (field, value) => {
    let { actions } = this.props;
    let { email, callingCode, phone } = this.state;
    this.setState({ [field]: value });
    var Regex = /^[0-9]$/;
    switch (field) {
      case 'one': {
        if (!value.match(Regex)) {
          this.setState({ isOneValid: true });
        }
        else {
          this.setState({ isOneValid: false });
          this.setState({ one: value })
        }
        break;
      }
      case 'two': {
        if (!value.match(Regex)) {
          this.setState({ isTwoValid: true });
        }
        else {
          this.setState({ isTwoValid: false });
          this.setState({ two: value })
        }
        break;
      }
      case 'three': {
        if (!value.match(Regex)) {
          this.setState({ isThreeValid: true });
        }
        else {
          this.setState({ isThreeValid: false });
          this.setState({ three: value })
        }
        break;
      }
      case 'four': {
        if (!value.match(Regex)) {
          this.setState({ isFourValid: true });
        }
        else {
          this.setState({ isFourValid: false });
          this.setState({ four: value })
        }
        break;
      }
      case 'default': {
        alert(strings('otp.IncorrectAlertText'));
        break;
      }
    }
  }
  register2 = () => {
    let { one, two, three, four, isOneValid, isTwoValid, isThreeValid, isFourValid, visible } = this.state;
    if (!one || !two || !three || !four) {
      Alert.alert(
        '',
        strings('otp.4DigitAlertText'),
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: () => {
              this.setState({ visible: false });
            }
          }
        ],
        { cancelable: false }
      );
    }
    else if (!this.props.user.netStatus) {
      return Alert.alert(
        '',
        strings('globalValues.NetAlert'),
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: () => {
              this.setState({ isDisabled: false, visible: false });
            }
          }
        ],
        { cancelable: false }
      );
    }
    else if (!isOneValid && !isTwoValid && !isThreeValid && !isFourValid) {
      this.setState({ visible: true })
      let otp = one + two + three + four;
      let values = { 'otp': otp, 'userId': this.props.user.loginFieldId }
      return axios.post(`${Appurl.apiUrl}verifyUserotp`, values)
        .then((response) => {
          console.log(response)
          return this.verifyotp(response, values);
        }).catch((error) => {
          console.log(error)
          if (Platform.OS == 'ios') {
            setTimeout(() => {
              Alert.alert(
                '',
                error.response.data.msg,
                [
                  {
                    text: strings('globalValues.AlertOKBtn'),
                    onPress: () => {
                      this.setState({ visible: false });
                    }
                  }
                ],
                { cancelable: false }
              );
            }, 600)
          }
          else {
            Alert.alert(
              '',
              error.response.data.msg,
              [
                {
                  text: strings('globalValues.AlertOKBtn'),
                  onPress: () => {
                    this.setState({ visible: false });
                  }
                }
              ],
              { cancelable: false }
            );
          }
        })
    }
    else {
      Alert.alert(
        '',
        strings('otp.IncorrectAlertText'),
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: () => {
              this.setState({ visible: false });
            }
          }
        ],
        { cancelable: false }
      );
    }
  }
  verifyotp = (response, values) => {
    this.setState({ visible: false });
    setTimeout(() => {
      this.props.navigator.push({
        screen: 'profileSetup'
      })
    }, 1000)
  }
  render() {
    let { visible, isDisabled } = this.state;
    let { textAlign, lang, code, phone } = this.props.user;
    return (
     
       <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeHeader }}>
       <View style={{ flex: 1 }}>
         {/* <Spinner visible={visible} color='#8D3F7D' tintColor='#8D3F7D' animation={'fade'} cancelable={false} textStyle={{ color: '#FFF' }} /> */}
       
         <View style={styles.headerBackGround}>
       <View style={{ justifyContent: 'space-between', marginHorizontal: moderateScale(24), flexDirection: 'row', marginTop:moderateScale(20)}}>
         <TouchableOpacity disabled={isDisabled} hitSlop = {{top:7, left:7, bottom:7, right:7}} style={{height: 20, width:24, justifyContent: 'center'}} >
           {/* <Image source={require('./../Images/icBack.png')} style={{height: 14, width:18}}/> */}
         </TouchableOpacity>
         <Text style={styles.editProfileText}>{strings('editProfile.verifyMobile')}</Text>
         <TouchableOpacity disabled={isDisabled} onPress = {() => {this.back()}}>
         <Image source={require('./../Images/ic_close_login.png')} />
         </TouchableOpacity>
       </View>
        
         </View>
         <View style={styles.containerBorder}>
         <Text style={styles.welcomeTextStyle}>{strings('otp.heading')}</Text>
         {/* <Text style={{ fontSize: 14, color: '#474D57', fontFamily: lang == 'en' ? 'SFProText-Regular' : 'HelveticaNeueLTArabic-Light' }}>{strings('otp.heading')}</Text> */}
         <View style={{ flex: 0.15, flexDirection: 'row', justifyContent: 'space-around', marginTop : moderateScale(60), marginHorizontal: moderateScale(24) }}>
            <TextInput
              style={{ width: 48, borderBottomColor: '#E9EAED', borderBottomWidth: 2, fontSize: 40, width: 48, textAlign: 'center' }}
              ref="first"
              maxLength={1}
              underlineColorAndroid='transparent'
              returnKeyType="next"
              keyboardType='numeric'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(one) => {
                this.validate('one', one)
                if (one.length > 0) {
                  this.refs.second.focus();
                }
              }
              }
            />
            <TextInput
              style={{ width: 48, borderBottomColor: '#E9EAED', borderBottomWidth: 2, fontSize: 40, width: 48, textAlign: 'center' }}
              ref="second"
              maxLength={1}
              underlineColorAndroid='transparent'
              returnKeyType="next"
              keyboardType='numeric'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(two) => {
                this.validate('two', two)
                if (two.length == 0 || !two) {
                  this.refs.first.focus();
                }
                else if (two.length > 0 && two) {
                  this.refs.third.focus();
                }
              }
              }
            />
            <TextInput
              style={{ width: 48, borderBottomColor: '#E9EAED', borderBottomWidth: 2, fontSize: 40, width: 48, textAlign: 'center' }}
              ref="third"
              maxLength={1}
              underlineColorAndroid='transparent'
              returnKeyType="next"
              keyboardType='numeric'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(three) => {
                this.validate('three', three)
                if (three.length == 0 || !three) {
                  this.refs.second.focus();
                }
                else if (three.length > 0 && three) {
                  this.refs.forth.focus();
                }
              }
              }
            />
            <TextInput
              style={{ width: 48, borderBottomColor: '#E9EAED', borderBottomWidth: 2, fontSize: 40, width: 48, textAlign: 'center' }}
              ref="forth"
              maxLength={1}
              underlineColorAndroid='transparent'
              returnKeyType="done"
              keyboardType='numeric'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(four) => {
                this.validate('four', four)
                if (four.length == 0) {
                  this.refs.third.focus();
                }
              }
              }
            />
          </View>
              <TouchableOpacity style={styles.confirmButton} onPress={() => this.confirm()}>
                        <Text style={styles.confirmButtonText}>{strings('editProfile.confirm')}</Text>
                    </TouchableOpacity>
               <TouchableOpacity style={styles.loginButton} onPress={() => this.resendOtp()}>
                        <Text style={styles.loginButtonText}>{strings('editProfile.resendOTP')}</Text>
                    </TouchableOpacity>
         </View>
         
       </View>
     </SafeAreaView>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(otpInput);
const styles=ScaledSheet.create({

  editProfileText: {
      color : colors.textColor,
      fontFamily : fontFamily.bold,
      fontSize : '20@ms',
      lineHeight : '24@ms',
      fontWeight : fontWeight.bold,
      textAlign : 'center'
  },
  editProfileInfo : {
    textAlign : 'center',
    color : colors.smallText, 
    fontSize : '13@ms',
    fontFamily : fontFamily.regular,
    lineHeight : '24@ms',
    marginTop:'5@ms'
   
  },
  headerBackGround : {
   
    height : '90@ms'
  },
  profilePic : {
    width: '96@s', height: '96@vs', borderRadius: '48@ms', opacity: '0.8@ms',
    marginTop:'20@ms'
  },
  cameraImage : {
    width:'20@s',
     height:'16@vs', 
     position: 'absolute',
      marginTop: moderateScale(90),
       marginLeft:moderateScale(70)
  },
  inputLabel: {
    lineHeight: '16@ms',
    fontSize: '14@ms',
    color: colors.labelColor,
    opacity: 0.50,
    fontFamily: fontFamily.regular,
    textAlign: 'left'
  },
  textInputStyle: {
    // lineHeight: '19@vs',
    fontSize: '16@ms',
    width :width/1.5,
    color: colors.textColor,
    opacity: 0.80,
    marginTop: '5@ms',
    fontFamily: fontFamily.mediumBold,
    padding: 0,
    paddingRight: '24@ms',
    textAlign: 'left'
  },
  textInputStyleRow: {
    // lineHeight: '19@vs',
    width :width/1.5,
    fontSize: '16@ms',
    color: colors.textColor,
    opacity: 0.80,
    marginTop: '5@ms',
    fontFamily: fontFamily.mediumBold,
    padding: 0,
    paddingRight: '24@ms',
    textAlign: 'left'
  },
  inputLine: {
    height: '1@ms',
    width: width - 46,
    backgroundColor: colors.black,
    opacity: 0.10,
    borderRadius: '4@ms',
    marginTop: '10@ms',
    alignSelf: 'center'
  },
  verifyText : {
   textAlign : "right",
    fontSize : "13@ms",
    marginTop: "5@ms",
    fontFamily : fontFamily.regular,
    color : colors.themeColor,
    lineHeight : "15@ms"
  },
  textInputPhoneStyle: {
    //lineHeight: '17@vs',
    width: width/1.79,
    fontSize: '16@ms',
    color: colors.black,
    opacity: 0.80,
    fontFamily: fontFamily.regularFont,
    padding: 0,
    paddingLeft: '8@ms',
    paddingRight: '24@ms',
    textAlign: 'left'
  },
  verifiedText : {
    textAlign : "right",
     fontSize : "13@ms",
     marginTop: "5@ms",
     fontFamily : fontFamily.regular,
     color : colors.green
   },
   containerBorder : {
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30), borderWidth : 1, borderColor : colors.borderColor,
    backgroundColor : 'white',
    overflow: 'hidden', flex:1},
    loginButton: {
      position : "absolute",
      bottom : "100@ms",
      height: "48@vs",
      width: '80%',
      borderRadius: "2@ms",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.themeColor,
      alignSelf: "center"
    },
    confirmButton: {
      position : "absolute",
      bottom : "160@ms",
      height: "48@vs",
      width: '80%',
      borderRadius: "2@ms",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.themeColor,
      alignSelf: "center"
    },
    loginButtonText: {
      fontFamily: fontFamily.regular,
      textAlign: 'center',
      color:colors.white,
      fontSize: '16@ms',
      fontWeight : fontWeight.medium,
      fontFamily : fontFamily.mediumBold,
    },
    confirmButtonText: {
      fontFamily: fontFamily.regular,
      textAlign: 'center',
      color:colors.white,
      fontSize: '16@ms',
      fontWeight : fontWeight.medium,
      fontFamily : fontFamily.mediumBold,
    },
    width80 : {
      width : '80%'
    },
    width90 : {
      width : '82%'
    },
    containerInside : {
        marginHorizontal : "24@ms"
    },
    addedCardText : {
        fontSize : "14@ms",
        lineHeight : "24@ms",
        color : colors.black,
        fontFamily : fontFamily.semiBold,
        fontWeight : "600",
        marginTop : "20@ms"
    },
    cardTextRow : {
        flexDirection : "row",
        marginTop : "30@ms"
    },
    width30 : {
        width : '20%'
    },
    width60 : {
        width : "70%"
    },
    width10 : {
      width : "10%"
  },
  width15 : {
      width : "15%"
  },
  iconWidth : {
      
  },
  welcomeTextStyle : {
    marginTop : '20@ms',
    fontSize : '14@ms', 
    width : "80%",
    alignSelf : "center",
    textAlign : 'center',
    color: 'rgba(0,0,0,0.6)',
    fontFamily : 'SFUIDisplay-Regular',
    lineHeight: '20@ms'
   
  }
})


