import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity, Alert, SafeAreaView,Dimensions, TextInput } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
// import { MKTextField } from 'react-native-material-kit';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import CountryPicker from 'react-native-country-picker-modal';
const { width, height } = Dimensions.get('window')
import { strings } from '../locales/i18n';
import Appurl from './../config';
import Validation from './../src/utils/Validation.js';
import ValidationAr from './../src/utils/ValidationAr.js';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import * as userActions from '../src/actions/userActions'
import { ScaledSheet } from "react-native-size-matters";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';

class forgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      countryCode : '+966',
      cca2: 'SA',
      visible : false
    }
  }
  componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      if(connectionInfo.type=='none' || connectionInfo.type=='unknown') {
        this.props.actions.checkInternet(false);
      }
      else {
        this.props.actions.checkInternet(true);
      }
    });
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }
  componentWillUnmount() {
    let {actions} = this.props;
    actions.toggleButton(false);
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }
  _handleConnectionChange = (isConnected) => {
    this.props.actions.checkInternet(isConnected);
  }
  static navigatorStyle = {
    navBarHidden : true
  }
  validationRules= () => {
    return [
      {
        field: this.state.email,
        name: 'email',
        rules: 'required|email|max:100|no_space'
      }
    ]
  }
  validationArRules= () => {
    return [
      {
        field: this.state.email,
        name: 'رقم الجوال',
        rules: 'required|no_space'
      }
    ]
  }
  back = () => {
    this.props.navigation.goBack(null)
  }
  passwordReset = () => {
    let {email, countryCode} = this.state;
    let validaton= this.props.user.lang=='en'?Validation.validate(this.validationRules()):ValidationAr.validate(this.validationArRules())
    if(validaton.length != 0) {
      return Alert.alert(
        '',
        validaton[0],
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: ()=> {
            }
          }
        ],
        { cancelable: false }
      );
    }
    else if(!this.props.user.netStatus) {
      return Alert.alert(
        '',
        strings('globalValues.NetAlert'),
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: ()=> {
              this.setState({isDisabled: false, visible: false});
            }
          }
        ],
        { cancelable: false }
      );
    }
    else {
      this.setState({visible: true});
      let number = {'email' : email, 'langaugeType': this.props.user.lang};
      return axios.post(`${Appurl.apiUrl}forgotUser`, number)
      .then((response) => {
        console.log(response)
        return this.passwordSet(response);
      }).catch((error) => {
        console.log('error', error.response.data.msg)
        this.setState({visible: false});
        if(error.response.data.success == 0) {
          if(Platform.OS=='ios') {
            setTimeout(()=> {
              Alert.alert(
                '',
                error.response.data.msg,
                [
                  {
                    text: strings('globalValues.AlertOKBtn'),
                    onPress: () => {
                      this.setState({visible: false});
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
                    this.setState({visible: false});
                  }
                }
              ],
              { cancelable: false }
            );
          }
        }
      })
    }
  }
  passwordSet = (response) => {
    Alert.alert(
      '',
      strings('forgotPassword.SuccessAlertText'),
      [
        {
          text: strings('globalValues.AlertOKBtn'),
          onPress: () => {
            this.setState({visible: false});
            this.props.navigation.goBack(null)
          }
        }
      ],
      { cancelable: false }
    );
  }
  countryPickerModal = ()=> {
    this.refs.CountryPicker.openModal();
  }
  render() {
    let { phone, countryCode, visible } = this.state;
    let { flexDirection, textAlign, lang } = this.props.user;
    return (
      <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
        <View style={{flex:1, marginHorizontal: 24}}>
          <Spinner visible={visible} color={colors.themeColor} tintColor={colors.themeColor} animation={'fade'} cancelable={false} textStyle={{color: '#FFF'}} />
          <View style={{flex: 0.1, justifyContent: 'center'}}>
            <TouchableOpacity hitSlop = {{top:7, left:7, bottom:7, right:7}} style={{height: 20, width:24, justifyContent: 'center'}} onPress={() => {this.back()}}>
                <Image source={require('./../Images/ic_close_login.png')} style={{height: 14, width:18}}/>
            </TouchableOpacity>
          </View>
           <View style={styles.topView}>
          <Image source={require('./../Images/smallLogo.png')} />
          </View>
          <View style={{flex:0.09, marginTop : moderateScale(20) }}>
            <Text style = {{fontSize: 14, color: '#474D57', fontFamily: lang=='en'?'SFProText-Regular':'HelveticaNeueLTArabic-Light', textAlign: textAlign}}> {strings('forgotPassword.heading')} </Text>
          </View>
          <View style = {{flex: 0.15, flexDirection: flexDirection, marginTop : moderateScale(20)}}>
           
           
                  <View style={{ height: verticalScale(18) }} />
                    <View style={styles.inputMainView}>
                        <Text style={styles.inputLabel}>{strings('register.email')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={email => this.email = email}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('register.email')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email} />
                        <View style={styles.inputLine} />
                    </View>
          
          </View>
           <TouchableOpacity style={styles.loginButton} onPress={() => this.passwordReset()}>
                        <Text style={styles.loginButtonText}>{strings('forgotPassword.submit')}</Text>
                    </TouchableOpacity>
          
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

export default connect(mapStateToProps, mapDispatchToProps)(forgotPassword);
const styles=ScaledSheet.create({

  registerHeading : {
    marginTop:'20@ms',
     color: colors.regHeading,
     fontSize:  '20@ms',
     lineHeight: '24@ms',
     fontWeight : fontWeight.medium,
     fontFamily : fontFamily.mediumBold 
  },
  topView : {
    flex:0.07, 
    justifyContent: 'flex-start',
    flexDirection : 'row'
  },
  alignLogin : {
    textAlign : 'right',
    marginTop:'5@ms',
    fontSize :'14@ms',
    fontWeight : fontWeight.medium,
    lineHeight : '16@ms',
    fontFamily : fontFamily.mediumBold,
    color : colors.themeColor

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
  textInputStyle: {
    // lineHeight: '19@vs',
    fontSize: '16@ms',
    color: colors.textColor,
    opacity: 0.80,
    marginTop: '5@ms',
    fontFamily: fontFamily.mediumBold,
    padding: 0,
    paddingRight: '24@ms',
    textAlign: 'left'
},
  btnEmail: {
    height: '50@vs',
    width: '300@s',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:colors.themeColor,
    borderWidth:1,
    borderRadius:'8@ms',
    padding: '10@ms',
    marginBottom : '10@ms',
    borderColor : colors.themeColor
  },
  social: {
    marginTop : '70@ms',
    alignItems: 'center'
  },
  accountText : {
    textAlign: 'center',
    color:colors.white,
    fontSize: '16@ms',
    fontWeight : fontWeight.medium,
    fontFamily : fontFamily.mediumBold,
    lineHeight: '24@ms'

  },
  bycreatingText : {
    marginTop: '10@ms',
  
    color : colors.creatingAccount,
    fontFamily : fontFamily.regular,
    lineHeight: '18@ms',
    fontSize: '12@ms'
  },
  termsofServiceText : {
    color :  'black'
  },
  inputLabel: {
    lineHeight: '16@ms',
    fontSize: '14@ms',
    color: colors.labelColor,
    opacity: 0.50,
    fontFamily: fontFamily.regular,
    textAlign: 'left'
},
visibilityIconStyle: {
  position: "absolute",
  right: 0,
  top: "10@ms",
  marginRight: "23@ms",
  alignItems: "center"
},
loginButton: {
  marginTop : '20@ms',
  height: "48@vs",
  width: width - 46,
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
}
  
})


