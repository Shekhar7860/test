import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Alert, AsyncStorage, SafeAreaView,Dimensions,ScrollView } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/EvilIcons';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import { strings } from '../locales/i18n';
import Appurl from './../config';
import { ScaledSheet } from "react-native-size-matters";
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import * as userActions from '../src/actions/userActions'
import { bindActionCreators } from 'redux';
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux';

class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : this.props.user.loginFieldId.name,
      email : this.props.user.loginFieldId.email,
      visible: false,
      isDisabled:false,
      arr : [1,2],
      avatarSource : "https://noovvoo-dev.s3-us-west-2.amazonaws.com/user-default.png"
    }
    AsyncStorage.getItem('lang')
    .then((lang) => {
      if(lang==null) {
        if(I18n.currentLocale()=='ar') {
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
        let getlang = JSON.parse(lang);
        if(getlang=='ar') {
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
  asqw = async (getwq)=> {
    await AsyncStorage.setItem('lang', JSON.stringify(getwq));
    this.props.actions.setLanguage(getwq)
    console.log(this.props.user.lang)
  }
  static navigatorStyle = {
    navBarHidden : true
  }
  componentDidMount() {
    console.log(this.props, 'values')
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
    // NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }
  _handleConnectionChange = (isConnected) => {
    this.props.actions.checkInternet(isConnected);
  }
  renderDetails = (data) => {
    this.setState({username : data.name, profileImage: data.Profilepicurl});
  }

  goToPage = (page) => {
    console.log('page', page)
    this.props.navigation.navigate(page);
  }
  editProfile = () => {
    if(!this.state.isDisabled)
    {
      this.setState({isDisabled: true});

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
        console.log(this.props, 'myuserprops')
        let { loginFieldId } = this.props.user;
        this.setState({visible: true,isDisabled: true})
        let id = {'userId': loginFieldId.userId};
        return axios.post(`${Appurl.apiUrl}getUserImage`, id)
        .then((response) => {
          console.log(response, 'res')
          this.props.actions.setEditData(response.data.name, response.data.phoneNumber, response.data.email, response.data.profilePicUrl, response.data.cca2, response.data.callingCode)
          setTimeout(() => {
            this.setState({isDisabled: false, visible: false});
          }, 200);
          setTimeout(()=> {
            this.props.navigation.navigate('editProfile', { page: 'profile' });
          }, 1000)
        }).catch((error) => {
         console.log(error.response.data.msg, 'err')
          Alert.alert(
            '',
            strings('globalValues.RetryAlert'),
            [
              {
                text: strings('globalValues.AlertOKBtn'),
                onPress: ()=> {
                  this.setState({visible: false,isDisabled:false})
                }
              }
            ],
            { cancelable: false }
          );
        })
      }

    }
  }
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps.user.loginFieldId.image);
    if(nextProps.user.loginFieldId.image !== "")
    {
    this.setState({avatarSource : nextProps.user.loginFieldId.image })
    }
   }
  changeLang = ()=> {
    let {actions} = this.props;
    actions.toggleButton(true);
    Navigation.setRoot({
      root: {
        component: {
          name: 'Language'
        }
      },
    });
    // this.props.navigator.push({
    //   screen : 'Language'
    // })
  }
  changePassword = ()=> {
    let {actions} = this.props;
    actions.toggleButton(true);
    Navigation.setRoot({
      root: {
        component: {
          name: 'ChangePassword'
        }
      },
    });
    // this.props.navigator.push({
    //   screen : 'ChangePassword'
    // })
  }

 
  logout =  ()=> {
    Alert.alert(
      '',
      strings('settings.LogoutAlertText'),
      [
        {
          text: strings('settings.YesLabel'),
          onPress: async () => {
            try{
              this.props.actions.clearOnLogout()
              await AsyncStorage.removeItem('user')
              this.props.navigation.navigate('signOut');
            }
            catch(error){console.log(error)}
          }
        },
        {text: strings('settings.NoLabel'), style: 'cancel'}
      ],
      { cancelable: false }
    );
  }
  privacyPolicy = () => {
    let {actions} = this.props;
    actions.toggleButton(true);
    Navigation.setRoot({
      root: {
        component: {
          name: 'PrivacyPolicy'
        }
      },
    });
  }
  termsAndConditions = () => {
    let {actions} = this.props;
    actions.toggleButton(true);
    Navigation.setRoot({
      root: {
        component: {
          name: 'termsAndConditions'
        }
      },
    });
  }
  suggestion = ()=> {
    let {actions} = this.props;
    actions.toggleButton(true);
    Navigation.setRoot({
      root: {
        component: {
          name: 'Suggestion'
        }
      },
    });
    
  }
  contact = () => {
    let {actions} = this.props;
    actions.toggleButton(true);
    Navigation.setRoot({
      root: {
        component: {
          name: 'contact'
        }
      },
    });
  }
  paymentInfo = ()=> {
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
      let { loginFieldId } = this.props.user;
      this.setState({visible: true})
      let values= {'userId' : loginFieldId.id}
      axios.post(`${Appurl.apiUrl}requestStatusToUser`, values)
      .then((response) => {
        console.log(response);
        this.setState({visible: false})
        setTimeout(()=> {
          let {actions} = this.props;
          actions.toggleButton(true);
          this.props.navigator.push({
            screen : 'PaymentInfo',
            passProps: {paymentsArr: response.data.data}
          })
        }, 1000)
      })
      .catch((error) => {
        console.log(error)
        if(error.response.data.success == 0) {
          this.setState({visible: false})
          setTimeout(()=> {
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
          })
        }
      })
    }
  }
  showImage = () => {
    let { loginFieldId, isDisabled } = this.props.user;
    if(loginFieldId.image) {
      return (<TouchableOpacity disabled = {this.state.isDisabled} style = {{justifyContent: 'center'}} activeOpacity = {0.7} onPress = {() => {this.editProfile()}}>
                <View style={{width: 80, height: 80, borderRadius: 40}}>
                  <FastImage source = {{uri: `${Appurl.apiUrl}resizeimage?imageUrl=`+loginFieldId.image+'&width=160&height=160'}} style = {{width: 80, height: 80, borderRadius: 40}}/>
                </View>
              </TouchableOpacity>)
    }
    else {
      return (<TouchableOpacity disabled = {this.state.isDisabled} style = {{justifyContent: 'center'}} activeOpacity = {0.7} onPress = {() => {this.editProfile()}}>
        <Icon name="camera" color='#9B9B9B' size={25} style={{height: 80, width:80, borderRadius: 40, borderWidth:0.5, borderColor: '#9B9B9B', padding:27}}/>
      </TouchableOpacity>)
    }
  }
  // setImage = () => {

  // }
  render() {
  
    console.log(this.props, 'values')
    let { name, email, visible, avatarSource, image } = this.state;
    let { flexDirection, textAlign, lang, loginFieldId, isDisabled } = this.props.user;
    // this.setImage(image)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeHeader }}>
      <View style={{ flex: 1 }}>
        {/* <Spinner visible={visible} color='#8D3F7D' tintColor='#8D3F7D' animation={'fade'} cancelable={false} textStyle={{ color: '#FFF' }} /> */}
        <View style={styles.headerBackGround }>
           <View style={styles.headerContent}>
           <Image source = {{uri: avatarSource}} style = {styles.profilePic}/>
           <Text style={styles.headerText}>{loginFieldId.name} {"\n"}
          <Text style={styles.headerSmallText}>{loginFieldId.email}</Text></Text>
           </View>
        </View>
        <View style={styles.containerBorder}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
          >
            <View style={{marginTop : moderateScale(15) }}>
            <TouchableOpacity style={styles.middleContainer} onPress={this.editProfile.bind(this, 'editProfile')}>
              <View style={styles.iconContainer}>
              <Image source={require('./../Images/edit.png')}  style = {styles.icon}/>
              </View>
              <View style={styles.textContainer}>
                 <Text style={styles.editText}>{strings('settings.edit')}{"\n"}<Text style={styles.detailsText}>{strings('editProfile.editDetails')} </Text></Text>
              </View>
              <View style={styles.iconContainer}>
              <Image source={require('./../Images/ic_fwd.png')}  style = {styles.arrowIcon}/>
              </View>
            </TouchableOpacity>
            <View style={styles.inputLine} />
            <TouchableOpacity style={styles.middleContainer} onPress={this.goToPage.bind(this, 'paymentMethods')}>
              <View style={styles.iconContainer}>
              <Image source={require('./../Images/ic_booking.png')}  style = {styles.icon}/>
              </View>
              <View style={styles.textContainer}>
                 <Text style={styles.editText}>{strings('payment.Payment')}{"\n"}<Text style={styles.detailsText}>{strings('payment.ManagePayment')} </Text></Text>
              </View>
              <View style={styles.iconContainer}>
              <Image source={require('./../Images/ic_fwd.png')}  style = {styles.arrowIcon}/>
              </View>
            </TouchableOpacity>
            <View style={styles.inputLine} />
            <TouchableOpacity style={styles.middleContainer} onPress={this.goToPage.bind(this, 'changePassword')}>
              <View style={styles.iconContainer}>
              <Image source={require('./../Images/padlock.png')}  style = {styles.icon}/>
              </View>
              <View style={styles.textContainer}>
                 <Text style={styles.editText}>{strings('ChangePassword.passwordText')}{"\n"}<Text style={styles.detailsText}>{strings('ChangePassword.updatePassword')} </Text></Text>
              </View>
              <View style={styles.iconContainer}>
              <Image source={require('./../Images/ic_fwd.png')}  style = {styles.arrowIcon}/>
              </View>
            </TouchableOpacity>
            <View style={styles.inputLine} />
            <TouchableOpacity style={styles.middleContainer} onPress={this.goToPage.bind(this, 'contactUs')}>
              <View style={styles.iconContainer}>
              <Image source={require('./../Images/envelope.png')}  style = {styles.icon}/>
              </View>
              <View style={styles.textContainer}>
                 <Text style={styles.editText}>{strings('settings.contact')}{"\n"}<Text style={styles.detailsText}>{strings('payment.viewContactInfo')} </Text></Text>
              </View>
              <View style={styles.iconContainer}>
              <Image source={require('./../Images/ic_fwd.png')}  style = {styles.arrowIcon}/>
              </View>
            </TouchableOpacity>
            <View style={styles.inputLine} />
            <TouchableOpacity style={{marginHorizontal : moderateScale(24)}} onPress={this.logout.bind(this, 'logOut')}>
             <Text style={styles.logoutText}>{strings('settings.logout')}</Text>
             </TouchableOpacity>
            </View>

          </ScrollView>
          
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

export default connect(mapStateToProps, mapDispatchToProps)(profile);
const styles=ScaledSheet.create({

  registerHeading : {
    marginTop:'20@ms',
     color: colors.regHeading,
     fontSize:  '20@ms',
     lineHeight: '24@ms',
     fontWeight : fontWeight.bold,
     fontFamily : fontFamily.mediumBold 
  },
  notificationsText : {
    
      textAlign: 'center',
       fontSize: '20@ms',
       color : colors.notificationsText,
       marginTop : '20@ms',
       fontFamily : fontFamily.bold,
       fontWeight : fontWeight.bold,
       lineHeight : "24@ms"

  },
  container : {
      
  },
  containerBorder : {
    flex:1,
      borderTopLeftRadius: moderateScale(30),
      borderTopRightRadius: moderateScale(30), borderWidth : 1, borderColor : colors.borderColor,
      backgroundColor : 'white'},
headerBackGround : {
  height : '90@ms'
},
countText : {
  fontFamily : fontFamily.bold,
  color : colors.notificationsText,
  marginTop:'20@ms',
  lineHeight: '24@ms',
  fontSize:  '20@ms',
  fontWeight : fontWeight.bold
},
contentText : {
  fontFamily : fontFamily.bold,
  color : colors.themeColor,
  marginTop:'20@ms',
  lineHeight: '24@ms',
  fontSize:  '15@ms',
  fontWeight : fontWeight.bold
},
secondContent : {
  fontFamily : fontFamily.regular,
  color : colors.black,
  marginTop:'2@ms',
  lineHeight: '18@ms',
  fontSize:  '14@ms',
 
},
thirdContent : {
  fontFamily : fontFamily.regular,
  color : colors.black,
  marginTop:'2@ms',
  lineHeight: '18@ms',
  fontSize:  '14@ms',
},
timeText : {
  alignSelf : 'flex-end'
},

headerContent : {
  flexDirection : 'row',
  marginHorizontal : "24@ms",
  marginTop : "20@ms"
},
profilePic : {
  width : '60@s',
  height : "60@vs",
  borderRadius : "30@ms"
},
headerText : {
  fontSize : "16@ms", 
  color : colors.textColor,
  fontFamily : fontFamily.bold,
  fontWeight : fontWeight.bold, 
  lineHeight : "24@ms",
  marginLeft : "10@ms"
},
headerSmallText :{
  fontSize : "14@ms",
  fontFamily : fontFamily.regular,
  color :colors.smallText,
  lineHeight : "24@ms",
  marginLeft : "10@ms"

},
marginAlign : {
  marginHorizontal : "24@ms"
},
middleContainer : {
  marginHorizontal : "24@ms",
  flexDirection : 'row',
 
  marginTop : '10@ms'
},
iconContainer : {
  width : '13%'
},
textContainer : {
  width : '74%'
},
icon : {
  marginTop : '10@ms',
  width : '20@s',
  height : "20@vs"
},
arrowIcon : {
  marginTop : '10@ms',
  width : '20@s',
  height : "20@vs",
  alignSelf : 'flex-end'
},
editText : {
  fontSize : '12@ms', 
  fontFamily : fontFamily.bold, 
  fontWeight : fontWeight.bold,
  lineHeight : "24@ms",
  color : colors.black
 
},
detailsText : {
  color : colors.smallTextColor,
  fontFamily : fontFamily.regular,
  fontSize : "12@ms",
  lineHeight : "24@ms",
  marginTop : '-10@ms',
  fontWeight : 'normal',
},
inputLine: {
  height: '1@ms',
  width: '100%',
  backgroundColor: colors.black,
  opacity: 0.10,
  borderRadius: '4@ms',
  marginTop: '10@ms',
  alignSelf: 'center'
},
logoutText : {
  fontSize : "16@ms",
  fontWeight : fontWeight.bold,
  color : colors.themeColor,
  fontFamily : fontFamily.bold,
  lineHeight : "24@ms",
  marginTop : "10@ms"
}


})
