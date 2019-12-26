import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity, Alert, TextInput, SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
// import { MKTextField } from 'react-native-material-kit';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
// import OneSignal from 'react-native-onesignal';
import { ScaledSheet } from "react-native-size-matters";
import CountryPicker from 'react-native-country-picker-modal';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { strings } from '../locales/i18n';
import Appurl from './../config';
import Validation from './../src/utils/Validation.js';
import ValidationAr from './../src/utils/ValidationAr.js';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import * as userActions from '../src/actions/userActions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('window')
var play='';
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : this.props.user.fbEmail==''?'':this.props.user.fbEmail.toLowerCase(),
      phone : '',
      isEmailValid : false,
      isPhoneValid : false,
      visible : false,
      pickerData : null,
      countryCode : '+966',
      cca2: 'SA',
      password: '',
      name : '',
      username : '', 
      editName : '',
      showPassword: true,
      crossIcon: false
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
    this.props.actions.setFacebookEmail('');
    let {actions} = this.props;
    actions.toggleButton(false);
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }
  _handleConnectionChange = (isConnected) => {
    this.props.actions.checkInternet(isConnected);
  }
 
  componentWillMount() {
    //  OneSignal.addEventListener('ids', this.onIds);
  }
  onIds(device) {
    play=device.userId;
  }
  validationRules= () => {
    return [
      {
        field: this.state.email,
        name: 'Email Id',
        rules: 'required|email|max:100|no_space'
      },
      {
        field: this.state.password,
        name: 'Password',
        rules: 'required|no_space|min:6'
      },
      {
        field: this.state.name,
        name: 'name',
        rules: 'required|no_space|min:6'
      },
      {
        field: this.state.username,
        name: 'username',
        rules: 'required|no_space|min:6'
      }
    ]
  }
  validationArRules= () => {
    return [
      {
        field: this.state.email,
        name: 'البريد الإلكتروني',
        rules: 'required|email|max:100|no_space'
      },
      {
          field: this.state.password,
          name: 'كلمة السر',
          rules: 'required|no_space|min:6'
      },
      {
        field: this.state.phone,
        name : 'رقم الجوال',
        rules: 'required|no_space|numeric'
      }
    ]
  }
  createScreen = () => {
    try {
      Navigation.push(this.props.componentId, {
        component: {
           name: 'login'
        }
       });
  }
catch (e)
{
  console.log('error', e)
}
  }
  static navigatorStyle = {
    navBarHidden : true
  }
  back = () => {
    this.props.navigation.goBack(null)
  }
  _showHidePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
    this.setState({ crossIcon: !this.state.crossIcon });
}

  otpVerfiication = () => {
    let {actions} = this.props;
    let { isEmailValid, isPhoneValid, email, phone, visible, countryCode, cca2, password, username, name } = this.state;
    let { lang } = this.props.user;
    let validaton= lang=='en'?Validation.validate(this.validationRules()):ValidationAr.validate(this.validationArRules())
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
      
      this.setState({visible: true})
      actions.getEmail(email.toLowerCase());
      actions.getUserName(username);
      actions.getName(name);
    //  actions.getPhone(phone);
   //   actions.getCountryCode(countryCode);
    //  OneSignal.sendTag("phone", email.toLowerCase());
      let values = {'email' : email.toLowerCase(), 'userName' : username , "name" : name, 'deviceType' : (Platform.OS == 'ios') ? 'IOS' : 'ANDROID', 'password' : password, 'langaugeType' : "en"}
      return axios.post(`${Appurl.apiUrl}userRegister`, values)
      .then((response) => {
        return this.getData(response, values);
      }).catch((error) => {
        if(error.response.data.success == 0) {
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
      })
    }
  }
  getData = (response, values) => {
    console.log(response);
    let {visible} = this.state;
    let {actions} = this.props;
    this.setState({visible: false});
    let details = {'userId': response.data.userId}
   // let userid = response.data.userId;
    console.log(details, 'details');
    actions.getLoginUserId(details);
    setTimeout(()=> {
      this.props.navigation.navigate("editProfile",  { page: 'register' });
    }, 1000)
  }
  func = (item, index) => {
    this.setState({countryCode: item});
  }
  loginScreen = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'login',
        options: {
          topBar: {
              visible: false
          }
        }
      }
    });
  }
  countryPickerModal = ()=> {
    this.refs.CountryPicker.openModal();
  }
  render() {
    let { email, phone, countryCode, password, show_password, visible, cca2 } = this.state;
    let { flexDirection, textAlign, lang, fbEmail } = this.props.user;
    return (
      <View  style={{flex:1, backgroundColor: 'white'}}>
        <View style={{flex:1, marginHorizontal: moderateScale(24)}}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always"  style={{flex:1, backgroundColor: 'white'}}>
        <Spinner visible={visible} color={colors.themeColor} tintColor={colors.themeColor} animation={'fade'} cancelable={false} textStyle={{color: '#FFF'}} />
          <View style={{flex: 0.1, marginTop:moderateScale(20), flexDirection : 'row'}}>
            <TouchableOpacity  hitSlop = {{top:7, left:7, bottom:7, right:7}} style={{height: 20, width:24, justifyContent: 'center'}} onPress={() => {this.back()}}>
              <Image source={require('./../Images/ic_close_login.png')} style={{height: 14, width:18}}/>
            </TouchableOpacity>
            <View style={{width:'85%'}}>
            <Text style={styles.alignLogin} onPress = {() => this.loginScreen()}>Login</Text>
            </View>
            
          </View>
          <View style={styles.topView}>
          <Image source={require('./../Images/smallLogo.png')} />
          </View>
          <View style={{flex:0.07}}>
            <Text style = {styles.registerHeading}>{strings('register.heading')}</Text>
          </View>
          <View style={{flex:0.45, marginTop:moderateScale(10)}}>
          <View style={{ height: verticalScale(18) }} />
                    <View style={{ marginTop:moderateScale(10)}}>
                        <Text style={styles.inputLabel}>{strings('register.name')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={name => this.name = name}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('register.name')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name} />
                        <View style={styles.inputLine} />
                    </View>
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
                       <View style={{ height: verticalScale(18) }} />
                    <View style={styles.inputMainView}>
                        <Text style={styles.inputLabel}>{strings('register.username')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={username => this.username = username}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('register.username')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(username) => this.setState({ username })}
                            value={this.state.username} />
                        <View style={styles.inputLine} />
                    </View>
                    <View style={{ height: verticalScale(18) }} />
						<View style={styles.inputMainView}>
							<Text style={styles.inputLabel}>{strings('register.password')}</Text>
							<View>
								<TextInput
									selectionColor={colors.tabsActiveColor}
									style={styles.textInputStyle}
									ref={password => (this.password = password)}
									underlineColorAndroid="transparent"
									placeholder={strings('register.password')}
                  autoCapitalize="none"
                  placeholderTextColor={colors.textColor}
									keyboardType="default"
									secureTextEntry={this.state.showPassword}
									returnKeyType={"done"}
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
								/>
								{this.state.crossIcon == false ? (
									<TouchableOpacity
										activeOpacity={0.5}
										style={styles.visibilityIconStyle}
										hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
										onPress={() => this._showHidePassword()}
									>
								 <Image source={require('./../Images/visibility-button.png')}  />
									</TouchableOpacity>
								) : (
										<TouchableOpacity
											activeOpacity={0.5}
											style={styles.visibilityIconStyle}
											hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
											onPress={() => this._showHidePassword()}
										>
									 <Image source={require('./../Images/hide_button.png')}  />
										</TouchableOpacity>
									)}
							</View>
							<View style={styles.inputLine} />
              
						</View>
            
            </View>
            

            
            <View style={{flex:0.20}}></View>
              <TouchableOpacity style={styles.loginButton} onPress={() => this.otpVerfiication()}>
                        <Text style={styles.loginButtonText}>{strings('home.account')}</Text>
                    </TouchableOpacity>
              {/* <View style={styles.social}>
           
            
            <TouchableOpacity  style={styles.btnEmail} onPress = {() => this.createScreen()}>
              <View style={{flex:0.2, alignItems: 'center'}}>
              </View>
              <View style={{flex:0.8, marginLeft: -20, backgroundColor: 'transparent'}}>
                <Text style={styles.accountText}>{strings('home.account')}</Text>
              </View>
            </TouchableOpacity>
           
          </View> */}
          <View>
          <Text style={styles.bycreatingText}>{strings('register.byCreating')} <Text style={styles.termsofServiceText} onPress = {() => this.loginScreen()}> {strings('register.terms')}</Text><Text> {strings('register.and')}</Text><Text style={styles.termsofServiceText}> {strings('register.privacy')}</Text></Text>
          </View>
          </KeyboardAwareScrollView>
        </View>
       
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
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
     marginTop:'10@ms',
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
  top: "5@ms",
  marginRight: "23@ms",
  alignItems: "center"
},
loginButton: {
  marginTop : '20@ms',
  height: "48@vs",
  width: width - 46,
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
}
  
})
