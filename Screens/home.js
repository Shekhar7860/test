import React,{ Component } from 'react';
import { ScaledSheet } from "react-native-size-matters";
import { Text, View, ImageBackground, Platform, StyleSheet, Alert, TouchableOpacity, Dimensions, Image, AsyncStorage, SafeAreaView} from 'react-native';
import { Navigation } from 'react-native-navigation';
import NetInfo from "@react-native-community/netinfo";
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import  { Notification, NotificationOpen } from 'react-native-firebase';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from 'react-native-i18n';
import axios from 'axios';
import FBSDK from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import SplashScreen from "react-native-splash-screen";
import { strings } from '../locales/i18n';
import Appurl from './../config';
const { width, height } = Dimensions.get('window')
import * as userActions from '../src/actions/userActions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import { LoginManager,   AccessToken } from 'react-native-fbsdk';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
class home extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
   // Navigation.events().bindComponent(this);
    this.state = {
      isSwitch1On: false,
      langColor : true,
      visible: false
    };
    AsyncStorage.getItem('lang')
    .then((lang) => {
      if(lang!=null) {
        let getlang = JSON.parse(lang);
        console.log(getlang)
        if(getlang=='ar') {
          this.setState({langColor:false});
          this.asqw('ar');
          I18n.locale = 'ar';
          I18n.currentLocale();
        }
        else {
          this.asqw('en');
          I18n.locale = 'en';
          I18n.currentLocale();
        }
      }
      else {
        if(I18n.currentLocale()=='ar') {
          this.setState({langColor:false});
          this.asqw('ar');
          I18n.locale = 'ar';
          I18n.currentLocale();
        }
        else {
          this.asqw('en');
          I18n.locale = 'en';
          I18n.currentLocale();
        }
      }
    })
  }
  componentDidMount() {
   // const notification = {};

   // firebase.notifications().displayNotification(notification);
    firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
         console.log(notificationOpen, 'm working ')
        }
        else
        {
          console.log(notificationOpen, 'm not working ')
        }
      });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(() => {
      if (notificationOpen) {
        console.log("m working down ")
       }
       else
       {
         console.log("m not working down not  ")
       }
    });
    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
      console.log(notification, 'notification')
  });
  this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
    console.log(notification, 'notificationdata')
  });

  GoogleSignin.configure({
    webClientId: Platform.OS === 'android' ? '900050765131-3p34hnkecm329cfb0ivnt3qjgcgqbcef.apps.googleusercontent.com' : '57919639350-ub3kliuujpa8946nh8nu996pvc7htqi7.apps.googleusercontent.com',
    scopes: ['openid', 'email', 'profile'],
    shouldFetchBasicProfile: true,
  });
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
    this.notificationOpenedListener();
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
}

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo, 'djdjdjdj')
      if(userInfo.user.email) {
        console.log('ifdataemail')
        this.setState({fbEmail: userInfo.user.emai})
        let values = { 'email' : userInfo.user.email, 'langaugeType' : this.props.user.lang }
        console.log(values)
        return axios.post(`${Appurl.apiUrl}userFaceBookLogin`, values)
        .then((response) => {
          console.log(response)
          return this.getData(response);
        }).catch((error) => {
            console.log(error)
            this.props.actions.toggleButton(false);
            this.setState({visible: false})
            setTimeout(()=> {
              Alert.alert(
                '',
                strings('globalValues.RetryAlert'),
                [
                  {
                    text: strings('globalValues.AlertOKBtn'),
                    onPress: () => {
                    }
                  }
                ],
                { cancelable: false }
              )
            }, 600)
        })
      }
      else {
        _this.props.actions.toggleButton(false);
        _this.setState({visible: false})
        setTimeout(()=> {
          Navigation.push(this.props.componentId, {
            component: {
              name: 'register',
              options: {
                topBar: {
                    visible: false
                }
              }
            }
          });
        }, 1000)
      }
    } catch (error) {
      console.log(error, 'error')
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  componentWillMount() {
    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    // OneSignal.addEventListener('registered', this.onRegistered);
    // OneSignal.addEventListener('ids', this.onIds);
    // OneSignal.inFocusDisplaying(2);
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    // OneSignal.removeEventListener('received', this.onReceived);
    // OneSignal.removeEventListener('opened', this.onOpened);
    // OneSignal.removeEventListener('registered', this.onRegistered);
    // OneSignal.removeEventListener('ids', this.onIds);
  }
  onReceived(notification) {
    console.log("Notification received: ", notification);
  }
  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }
  onRegistered(notifData) {
    console.log("Device had been registered for push notifications!", notifData);
  }
  onIds(device) {
    console.log(device)
  }
  _handleConnectionChange = (isConnected) => {
    this.props.actions.checkInternet(isConnected);
  }

  set = () => {

  }
  registerScreen = () => {
   
    let {actions} = this.props;
    actions.toggleButton(true);
    this.props.navigation.navigate("register");
    // Navigation.push(this.props.componentId, {
    //   component: {
    //     name: 'register',
    //     options: {
    //       topBar: {
    //           visible: false
    //       },
    //       bottomTabs: { 
    //         visible: false,
    //       } 
    //     }
    //   }
    // });
    // Navigation.setRoot({
    //   root: {
    //     component: {
    //       name: 'register'
    //     }
    //   },
    // });
  }
  appLang = async (selectedLg)=> {
    let { langColor } = this.state;
    if(selectedLg === 'en') {
      this.setState({langColor:true});
      I18n.locale = 'en';
      I18n.currentLocale();
    }
    else {
      this.setState({langColor:false});
      I18n.locale = 'ar';
      I18n.currentLocale();
    }
    this.asqw(selectedLg);
  }
  asqw = async(getwq) => {
    console.log(getwq);
    await AsyncStorage.setItem('lang', JSON.stringify(getwq));
    this.props.actions.setLanguage(getwq);
  }
  loginScreen = () => {
    let {actions} = this.props;
    actions.toggleButton(true);
    this.props.navigation.navigate("login");
    // this.props.navigator.push({
    //   screen : 'login'
    // })
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
  // login = () => {
  //   auth0
  //   .webAuth
  //   .authorize({
  //     scope: 'openid profile email',
  //   connection : 'facebook',
  //   audience: 'https://' + credentials.domain + '/userinfo'})
  //   .then(credentials =>
  //     console.log(credentials)
  //     // Successfully authenticated
  //     // Store the accessToken
  //   )
  //   .catch(error => console.log(error));
  // }
  facebookLogin = ()=> {
    // this.props.actions.toggleButton(true);
    // this.setState({visible: true})
    if(!this.props.user.netStatus) {
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
    else{
      let _this = this;
      LoginManager.logInWithPermissions(['public_profile','email'])
      .then(
        function(result) {
          console.log('working')
          console.log(result)
          if (result.isCancelled) {
            console.log('Login cancelled');
          }
          else {
            _this.props.actions.toggleButton(true);
            _this.setState({visible: true})
            AccessToken.getCurrentAccessToken()
            .then(
              (data) => {
                console.log(data)
                fetch('https://graph.facebook.com/v2.6/me?fields=email&access_token='+data.accessToken)
                .then((response) => response.json())
                .then((json) => {
                  console.log(json)
                  // let values = {'provider_user_id': json.id, 'provider': 'facebook', 'name': json.name, 'email': json.email, 'profile_pic' : '', 'timezone' : DeviceInfo.getTimezone(), 'fcm_id' : json.email?json.email:json.id};
                  if(json.email) {
                    console.log('ifdataemail')
                    _this.setState({fbEmail: json.email.toLowerCase()})
                    let values = { 'email' : json.email.toLowerCase(), 'langaugeType' : _this.props.user.lang }
                    console.log(values)
                    return axios.post(`${Appurl.apiUrl}userFaceBookLogin`, values)
                    .then((response) => {
                      console.log(response, 'resfb')
                      return _this.getData(response);
                    }).catch((error) => {
                        console.log(error)
                        _this.props.actions.toggleButton(false);
                        _this.setState({visible: false})
                        setTimeout(()=> {
                          Alert.alert(
                            '',
                            strings('globalValues.RetryAlert'),
                            [
                              {
                                text: strings('globalValues.AlertOKBtn'),
                                onPress: () => {
                                }
                              }
                            ],
                            { cancelable: false }
                          )
                        }, 600)
                    })
                  }
                  else {
                    _this.props.actions.toggleButton(false);
                    _this.setState({visible: false})
                    setTimeout(()=> {
                      _this.props.navigator.push({
                        screen: 'register'
                      })
                    }, 1000)
                  }
                })
                .catch((error) => {
                  console.log(error)
                  _this.props.actions.toggleButton(false);
                  _this.setState({visible: false})
                })
              }
            )
          }
        },
        function(error) {
          console.log(error)
          _this.props.actions.toggleButton(false);
          _this.setState({visible: false})
        }
      );
    }
  }
  // webAuth(connection) {
  //   this.props.actions.toggleButton(true);
  //   this.setState({visible: true})
  //       auth0.webAuth
  //           .authorize({
  //               scope: 'openid profile email',
  //               connection: connection,
  //               // prompt: 'consent',
  //               audience: 'https://' + credentials.domain + '/userinfo'
  //           })
  //           .then(credentials => {
  //               this.onSuccess(credentials);
  //           })
  //           .catch(error => {
  //             this.props.actions.toggleButton(false);
  //             this.setState({visible: false});
  //             console.log(error)
  //           });
  //   }
  // this.alert('Error', error.error_description)
  alert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: strings('globalValues.AlertOKBtn'),
          onPress: () => {
            this.props.actions.toggleButton(false);
            this.setState({visible: false});
          }
        }
      ],
      { cancelable: false }
    );
  }

  loginGoogle = () => {
    alert('coming soon')
  }
  // onSuccess(credentials) {
  // this.setState({visible: false});
  //     auth0.auth
  //         .userInfo({ token: credentials.accessToken })
  //         .then((data)=> {
  //           console.log(data)
  //           console.log(data.email)
  //           if(data.email) {
  //             console.log('ifdataemail')
  //             this.setState({fbEmail: data.email})
  //             let values = { 'email' : data.email, 'langaugeType' : this.props.user.lang }
  //             console.log(values)
  //             return axios.post(`${Appurl.apiUrl}userFaceBookLogin`, values)
  //             .then((response) => {
  //               console.log(response)
  //               return this.getData(response);
  //             }).catch((error) => {
  //                 console.log(error)
  //                 Alert.alert(
  //                     '',
  //                     'Error occured!',
  //                     [
  //                         {
  //                                 text: strings('globalValues.AlertOKBtn'),
  //                                 onPress: () => {
  //                                   this.props.actions.toggleButton(false);
  //                                   this.setState({visible: false});
  //                         } }
  //                     ],
  //                     { cancelable: false }
  //                 )
  //             })
  //           }
  //           else {
  //             this.props.actions.toggleButton(false);
  //             this.setState({visible: false});
  //             setTimeout(()=> {
  //               this.props.navigator.push({
  //                 screen: 'register'
  //               })
  //             }, 1000)
  //           }
  //           // Alert.alert(
  //           //     '',
  //           //     'Thanks '+data.name+' Further functionality will be implemented in next build!',
  //           //     [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
  //           //     { cancelable: false }
  //           // );
  //         })
  //         .catch(error => {
  //           this.props.actions.toggleButton(false);
  //           this.setState({visible: false});
  //           this.alert('', error.json.error_description)
  //         });
  // }
  getData = (response)=> {
    this.props.actions.toggleButton(false);
    this.setState({visible: false});
    let { fbEmail } = this.state;
    console.log(response)
    if(response.data.success==1) {
      this.setLoginPassword(response);
    }
    else {
      this.props.actions.toggleButton(false);
      this.setState({visible: false});
      this.props.actions.setFacebookEmail(fbEmail.toLowerCase())
      setTimeout(()=> {
        this.props.navigation.navigate("register");
      }, 1000)
    }
  }
  setLoginPassword = async(response) => {
    console.log(response);
    let { visible } = this.state;
    let { actions } = this.props;
    let { lang } = this.props.user;
   // OneSignal.sendTag("phone", response.data.email)
    try {
     // console.log(response.data.data.userId, 'userId')
      let details = {'image': response.data.data.profilePicUrl  , 'name': response.data.data.name , 'userId': response.data.data.userId, 'email' : response.data.data.email}
      console.log(details, 'details')
      await AsyncStorage.setItem('user', JSON.stringify(details));
      this.props.actions.toggleButton(false);
   setTimeout(() => {
     this.props.navigation.navigate("tabBar");
   }, 1000);
    }
    catch(error) {
      console.log(error)
      this.props.actions.toggleButton(false);
      this.setState({visible: false});
    }
  }
  termsAndConditions = () => {
    this.props.actions.toggleButton(true);
    Navigation.setRoot({
      root: {
        component: {
          name: 'termsAndConditions'
        }
      },
    });
    // this.props.navigator.push({
    //   screen : 'termsAndConditions'
    // })
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
                  }
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
    });
   
   
  }
  render() {
    let { langColor, visible } = this.state;
    let { isDisabled } = this.props.user;
    return (
      <SafeAreaView style={{flex:1}}>
        {/* <View source={require('./../Images/pexels-photo-69970.png')} style={styles.backgroundImage}> */}
        <Spinner visible={visible} color={colors.themeColor} tintColor={colors.themeColor} animation={'fade'} cancelable={false} textStyle={{color: '#FFF'}} />
        <View style={styles.welcomeInfo}>
        <Image source={require('./../Images/logo.png')} style={styles.imageLogo}/>
        <Text style={styles.textLarge}>{strings('home.welcomeText')}</Text>
        <Text style={styles.welcomeTextStyle}>{strings('home.bookText')}  {"\n"} {strings('home.favPeople')}</Text>
        </View>
          {/* <View style={{flex:0.1, flexDirection: 'row', marginHorizontal: 15, alignItems: 'flex-end'}}>
            <View style={{flex:0.35, height:32, flexDirection: 'row'}}>
              <TouchableOpacity activeOpacity={1} style={{flex:0.5, padding: 10, backgroundColor: langColor?'white':'#EDEDED', borderTopLeftRadius: 12, borderBottomLeftRadius: 12, justifyContent: 'center'}} onPress={()=>this.appLang('en')}>
                <Text style={{textAlign: 'center', color: langColor?'#4A4A4A':'#BFBFBF', fontSize: 14, fontFamily: 'SFProDisplay-Semibold'}}>Eng</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={{flex:0.5, padding: 10, backgroundColor: langColor?'#EDEDED':'white', borderTopRightRadius: 12, borderBottomRightRadius: 12, justifyContent: 'center'}} onPress={()=>this.appLang('ar')}>
                <Text style={{fontFamily: 'HelveticaNeueLTArabic-Roman',textAlign: 'center', color : langColor?'#BFBFBF':'#4A4A4A', fontSize: 14, paddingBottom: 10, backgroundColor:'transparent'}}>ع</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: langColor?0.45:0.25}}></View>
            <TouchableOpacity disabled={isDisabled} hitSlop={{top:7, bottom:7, left:7, right:7}} style={{flex: langColor?0.2:0.4,height: 32, justifyContent: 'center', backgroundColor: 'transparent'}} onPress = {() => {this.loginScreen()}}>
              <Text style={{color: 'white', textAlign: 'right', fontSize: 18, fontFamily: langColor?'SFProDisplay-Bold':'HelveticaNeueLTArabic-Bold'}}>{strings('home.login')}</Text>
            </TouchableOpacity>
          </View> */}
          {/* <View style={{flex:0.25}}></View>
          <View style={{flex:0.25,justifyContent: 'center', alignItems: 'center'}}>
            <Image resizeMode='contain' style={{height: 200, width: 230}} source={require('./../Images/FAMCAMM3.png')}/>
          </View>
          <View style={{flex:0.15}}></View> */}
          <View style={styles.social}>
            <TouchableOpacity disabled={isDisabled} style={styles.btnFb} onPress = {() => this.facebookLogin()}>
              <View style={{flex:0.2, alignItems: 'center'}}>
              <Image source={require('./../Images/ic_facebook.png')} />
              </View>
              <View style={{flex:0.8, marginLeft: -20, backgroundColor: 'transparent'}}>
                <Text style={styles.fbText}>{strings('home.fb_button')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={isDisabled} style={styles.btnEmail} onPress = {() => this.signIn()}>
              <View style={{flex:0.2, alignItems: 'center'}}>
              <Image source={require('./../Images/ic_google.png')} />
              </View>
              <View style={{flex:0.8, marginLeft: -20, backgroundColor: 'transparent'}}>
                <Text style={styles.googleText}>{strings('home.email')}</Text>
              </View>
            </TouchableOpacity>
           
            <TouchableOpacity style={styles.loginButton} onPress={() => this.registerScreen()}>
                        <Text style={styles.loginButtonText}>{strings('home.account')}</Text>
                    </TouchableOpacity>
            <View style={{flex:1/3, backgroundColor: 'transparent'}}>
              <Text style={{color: '#FFFFFF', fontSize: 12, opacity: 0.88, fontFamily: langColor?'SFProText-Regular':'HelveticaNeueLTArabic-Light', textDecorationLine: 'underline'}} onPress={this.termsAndConditions}>{strings('home.message')}</Text>
            </View>
          </View>
          <Text style={styles.alreadyUserText}>{strings('home.oldUser')} <Text style={styles.logInText} onPress = {() => this.loginScreen()}>{strings('home.login')}</Text></Text>
          <View>
           
          </View>
        {/* </View> */}
      </SafeAreaView >
    );
  }
}

const styles=ScaledSheet.create({
  backgroundImage: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
  },
  imageLogo : {
    
  },
  googleText : {
    textAlign: 'center',
    color:'rgba(72,72,72,0.87)', 
    fontSize:  '16@ms',
    lineHeight: '24@ms',
    fontWeight : '500',
    fontFamily : 'SFUIDisplay-Medium' 
   
  },
  welcomeInfo : {
    alignItems : 'center',
    marginTop : '40@ms'
  },
  textLarge : {
    fontSize : '24@ms', 
    marginTop : '15@ms',
    fontWeight :'600',
    fontFamily : 'SFUIDisplay-Bold',
    lineHeight: '24@ms'
  },
  welcomeTextStyle : {
    marginTop : '5@ms',
    fontSize : '14@ms', 
    textAlign : 'center',
    color: 'rgba(0,0,0,0.6)',
    fontFamily : 'SFUIDisplay-Regular',
    lineHeight: '20@ms'
   
  },
  social: {
   
    marginTop : '70@ms',
    alignItems: 'center'
  },
  btnFb: {
    // height:50,
    // width:Dimensions.get('window').width*0.8,
    height: '50@vs',
    width: '300@s',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#3B5998',
    borderRadius:'8@ms',
    padding: '10@ms',
    marginBottom : '10@ms'
  },
  accountText : {
    textAlign: 'center',color:'rgba(72,72,72,0.87)', fontSize: '16@ms',
    fontWeight : '500',
    fontFamily : 'SFUIDisplay-Medium' 

  },
  fbText : {
    textAlign: 'center',color:'#FFFFFF', fontSize: '16@ms',
    fontWeight : '500',
    fontFamily : 'SFUIDisplay-Medium' 
  },
  btnEmail: {
    height: '50@vs',
    width: '300@s',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#FFFFFF',
    borderWidth:1,
    borderRadius:'8@ms',
    padding: '10@ms',
    marginBottom : '10@ms',
    borderColor : 'rgba(72,72,72,0.87)',
    borderColor : 'rgba(0,0,0,0.16)'
  },
  alreadyUserText : {
    marginTop: '10@ms',
    textAlign : 'center',
    color : 'rgba(0,0,0,0.6)',
    fontFamily : 'SFUIDisplay-Regular',
    lineHeight: '18@ms',
    fontSize: '15@ms'
  },
  logInText : {
    color :  '#F09D00'
  },
  loginButton: {
 
  height: "48@vs",
 width: '300@s',
  borderRadius: "2@ms",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.white,
  alignSelf: "center",
   borderWidth:1,
    borderRadius:'8@ms',
    borderColor : 'rgba(0,0,0,0.16)'
},
loginButtonText: {
  fontSize: '16@ms',
  fontWeight : fontWeight.medium,
  fontFamily : fontFamily.mediumBold,
  color:'rgba(72,72,72,0.87)',
  marginLeft : '15@ms'
  
}
})

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
export default connect(mapStateToProps, mapDispatchToProps)(home);
