import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity, Alert, AsyncStorage, SafeAreaView,Dimensions, TextInput } from 'react-native';
import { ScaledSheet } from "react-native-size-matters";
import { Navigation } from 'react-native-navigation';
// import { MKTextField } from 'react-native-material-kit';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
// import OneSignal from 'react-native-onesignal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import NetInfo from "@react-native-community/netinfo";
import { strings } from '../locales/i18n';
import Appurl from './../config';
import Validation from './../src/utils/Validation.js';
import ValidationAr from './../src/utils/ValidationAr.js';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import * as userActions from '../src/actions/userActions'
import { bindActionCreators } from 'redux';
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux';

class login extends Component {
  constructor(props) {
    super(props);
    // Navigation.events().bindComponent('home');
    this.state = {
      emailPhone : '',
      visible : false,
      userid : '',
      password : '',
      show_password: true,
      crossIcon: false
    }
  }
  static navigatorStyle = {
    navBarHidden : true
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
  showPassword = () => {
    let {show_password} = this.state;
    if(show_password) {
      this.setState({show_password:false})
    }
    else {
      this.setState({show_password:true})
    }
  }
  validationRules= () => {
    return [
      {
        field: this.state.emailPhone,
        name: 'Email Id',
        rules: 'required|email|max:100|no_space'
      },
      {
        field: this.state.password,
        name: 'Password',
        rules: 'required|no_space|min:6'
      }
    ]
  }
  validationArRules= () => {
    return [
      {
        field: this.state.emailPhone,
        name: 'البريد الإلكتروني',
        rules: 'required|email|max:100|no_space'
      },
      {
        field: this.state.password,
        name: 'كلمة السر',
        rules: 'required|no_space|min:6'
      }
    ]
  }
  _showHidePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
    this.setState({ crossIcon: !this.state.crossIcon });
}

  back = () => {
    let {actions} = this.props;
    actions.toggleButton(false);
    this.props.navigation.goBack(null)
  }
  loginPassword = async() => {
    let { emailPhone, visible, password } = this.state;
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
      let { actions } = this.props;
      let { lang } = this.props.user;
      actions.getLoginField(emailPhone.toLowerCase());
      let values = {'authfield' : emailPhone.toLowerCase(), 'password' : password, 'langaugeType' : lang};
      console.log(values);
      axios.post(`${Appurl.apiUrl}loginUser`, values)
      .then((response) => {
        console.log(response)
        this.setLoginPassword(response)
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
  forgetPassword = () => {
    this.props.navigation.navigate("forgotPassword");
  }
  setLoginPassword = async(response) => {
    let { visible } = this.state;
    let { actions } = this.props;
    let { lang } = this.props.user;
    try {
      this.setState({visible: false});
      let details = {'image': response.data.Profilepicurl , 'name': response.data.name ,  'userId': response.data.userId, 'email' : response.data.email.toLowerCase()}
      await AsyncStorage.setItem('user', JSON.stringify(details));
      if(Platform.OS=='ios') {
        setTimeout(()=> {
          this.props.navigation.navigate("tabBar");
        }, 800)
      }
      else {
        this.props.navigation.navigate("tabBar");
      }
    }
    catch(error) {console.log(error)}
  }

  hideTopBar = () => {
    Navigation.setDefaultOptions({
        topBar: {
        visible: false
        },
        bottomTab: {
          iconInsets: { top: 3, bottom: 3 },
          fontSize: moderateScale(10)
        }
    });
  }
  showTabs = () => {
    Navigation.setRoot({
      root: { // Don't forget to set the tabbar as root
        bottomTabs: {
          children: [
            {
              stack: {  // Each `tab` must be in a separate stack
                children: [
                  {
                    component: {
                      name: 'famcamHome'
                    }
                  }
                ],
                options: {
                  bottomTab: {
                    fontSize: moderateScale(10),
                     text: strings('globalValues.Tab1'),
                    icon: require('./../Images/ic_explore_disabled.png'),
                    selectedIcon: require('./../Images/ic_explore_enabled.png')
                  },
                
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: 'orders'
                    }
                  }
                ],
                options: {
                  bottomTab: {
                    text: strings('globalValues.Tab2'),
                    fontSize: moderateScale(10),
                    icon: require('./../Images/ic_video_disabled.png'),
                     selectedIcon: require('./../Images/video.png')
                  }
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: 'notifications'
                    }
                  }
                ],
                options: {
                  bottomTab: {
                    text: strings('globalValues.Tab3'),
                  fontSize: moderateScale(10),
                  icon: require('./../Images/ic_notification_disabled.png'),
                  selectedIcon: require('./../Images/ic_notification_enabled.png')
                  }
                }
              }
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: 'profile'
                    }
                  }
                ],
                options: {
                  bottomTab: {
                    text: strings('globalValues.Tab4'),
                    fontSize: moderateScale(10),
                 icon: require('./../Images/ic_profile_disabled.png'),
                   selectedIcon: require('./../Images/ic_profile_enabled.png')
                  }
                }
              }
            }
          ]
        }
      }
    }); }
  render() {
    let { emailPhone, password, show_password, visible } = this.state;
    let { flexDirection, textAlign, lang } = this.props.user;
    return (
      <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" style={{flex:1, marginHorizontal: 24}}>
          <Spinner visible={visible} color={colors.themeColor} tintColor={colors.themeColor} animation={'fade'} cancelable={false} textStyle={{color: '#FFF'}} />
          <View style={{flex: 0.1, justifyContent: 'center', marginTop: moderateScale(20)}}>
            <TouchableOpacity hitSlop = {{top:7, left:7, bottom:7, right:7}} style={{height: 20, width:24, justifyContent: 'center'}} onPress={() => {this.back()}}>
              <Image source={require('./../Images/ic_close_login.png')} style={{height: moderateScale(14), width:moderateScale(14)}}/>
            </TouchableOpacity>
          </View>
          <View style={styles.topView}>
          <Image source={require('./../Images/smallLogo.png')} />
          </View>
          <View style={{flex:0.07}}>
            <Text style = {styles.registerHeading}>{strings('login.gladText')}</Text>
          </View>
          <View style = {{flex:0.15, marginTop:moderateScale(20)}}>
             <View style={{ height: verticalScale(18) }} />
                    <View style={styles.inputMainView}>
                        <Text style={styles.inputLabel}>{strings('login.email')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={email => this.emailPhone = emailPhone}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('register.email')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(emailPhone) => this.setState({ emailPhone })}
                            value={this.state.emailPhone} />
                        <View style={styles.inputLine} />
                    </View>
            
          </View>
          <View style = {{flex:0.12, flexDirection: 'row',marginTop:moderateScale(10)}}>
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
          
          <View style={{flex: 0.1, justifyContent: 'flex-start',marginTop:moderateScale(10)}}>
            <TouchableOpacity style={{justifyContent: 'flex-start'}} onPress = {() => {this.forgetPassword()}}>
              <Text style={{fontSize: moderateScale(12), color: colors.themeColor, textAlign: 'right', fontFamily: fontFamily.regular, lineHeight : moderateScale(16)}}> {strings('login.forgotPassword')} </Text>
            </TouchableOpacity>
          </View>
         
        
           <TouchableOpacity style={styles.loginButton} onPress={() => this.loginPassword()}>
                        <Text style={styles.loginButtonText}>{strings('login.login')}</Text>
                    </TouchableOpacity>
        </KeyboardAwareScrollView>
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

  export default connect(mapStateToProps, mapDispatchToProps)(login);
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
    marginTop:'10@ms'
    // flex:0.10, 
    // justifyContent: 'flex-start',
    // flexDirection : 'row'
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
},
imageLogo : {}
  
})

