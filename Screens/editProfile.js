import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity,Dimensions, Alert, TextInput, AsyncStorage, PermissionsAndroid, SafeAreaView} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
// import { MKTextField } from 'react-native-material-kit';
import { ScaledSheet, moderateScale } from "react-native-size-matters";
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { RNS3 } from 'react-native-aws3';
//import OneSignal from 'react-native-onesignal';
import ImagePicker from 'react-native-image-picker';
import CountryPicker from 'react-native-country-picker-modal';
import FastImage from 'react-native-fast-image';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import { strings } from '../locales/i18n';
import Appurl from './../config';
import Validation from './../src/utils/Validation.js';
import ValidationAr from './../src/utils/ValidationAr.js';
import { verticalScale, scale } from 'react-native-size-matters';
import * as userActions from '../src/actions/userActions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('window')
var abc;
var bca;
const option = {
  keyPrefix: "ImagesUser/",
  bucket: "famcamuploads",
  region: "us-east-2",
  accessKey: "AKIAI4LEFCTKJNKI63IQ",
  secretKey: "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",
  successActionStatus: 201
};
var options = {
  title: 'Select Image',
  mediaType : 'photo',
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
class editProfile extends Component {
  constructor(props) {
    super(props);
   // console.log(this.props, 'props')
    this.state = {
      name : '',
      phone : this.props.user.editPhone,
      email : this.props.user.editEmail,
      avatarSource :this.props.user.editPhoto,
      visible : false,
      photo : "",
      isDisabled: false,
      phoneNumber: "",
      selectedCountryCode: "+91",
      selectedCountry: 'Select Country',
      cca2: "IN",
      // selectedCountryCode: this.props.user.editCCA2,
      // selectedCountry: this.props.user.editCallingCode,
      // cca2: this.props.user.editCCA2,
      username : "", 
      bio : "",
      pageName : ""
    }
  }
  componentDidMount() {
    if(this.props.navigation.state.params)
    {
      console.log(this.props.navigation.state.params, 'params')
      this.setState({pageName : this.props.navigation.state.params.page})
    }
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
    navBarHidden: true,
    tabBarHidden: true
  }
  validationRules= () => {
    return [
      {
        field: this.state.name,
        name: 'Full name',
        rules: 'required|min:2|max:50'
      },
      {
        field: this.state.phone,
        name: 'Phone Number',
        rules: 'required|no_space|numeric'
      },
      {
        field: this.state.email,
        name : 'Email Id',
        rules: 'required|email|max:100|no_space'
      }
    ]
  }
  validationArRules= () => {
    return [
      {
        field: this.state.name,
        name: 'الإسم الكامل',
        rules: 'required|min:2|max:50'
      },
      {
        field: this.state.phone,
        name: 'رقم الجوال',
        rules: 'required|no_space|numeric'
      },
      {
        field: this.state.email,
        name : 'البريد الإلكتروني',
        rules: 'required|email|max:100|no_space'
      }
    ]
  }
  back = () => {
    let {actions} = this.props;
    actions.toggleButton(false);
    this.props.navigation.goBack(null)
   // this.props.navigator.pop();
  }

  hideTopBar = () => {
    Navigation.setDefaultOptions({
        topBar: {
        visible: false
        },
      bottomTab: {
       
      
      }
    });
  }
  image = async() => {
    console.log('this image working' )
    let {avatarSource} = this.state;
    let {actions} = this.props;
    if(Platform.OS == 'android' && Platform.Version > 22){
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]
    );
    if (granted['android.permission.WRITE_EXTERNAL_STORAGE'] != 'granted' || granted['android.permission.CAMERA'] != 'granted')
      return Alert.alert('', strings('editProfile.alertText'));
    }

    ImagePicker.showImagePicker(options, (response) => {
      let {avatarSource} = this.state;
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else if(!response.error && !response.didCancel) {
        // ImagePickerCrop.openCropper({
        //         path: response.uri,
        //         width: 320,
        //         height: 200,
        //         includeBase64: true
        //       }).then(image => {
        //         console.log(image)
        //         bca=image.path;
        //         avatarSource = 'data:image/jpeg;base64,' + image.data;
        //         this.setState({avatarSource});
        //       }).catch((error)=> {
        //         console.log(error)
        //       })
        // avatarSource = 'data:image/jpeg;base64,' + response.data;
        this.setState({avatarSource: response.uri});
      }
      // actions.getImage(avatarSource);
    });
  }

phoneNumberCheckZeros=()=>{

}

verify = (val) => {
  this.props.navigation.navigate(val);
}

  saveDetails = async () => {
    let { name, avatarSource, phone, email, selectedCountryCode, cca2, bio, username } = this.state;
    let { actions } = this.props;
    let { lang, loginFieldId } = this.props.user;
   
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
    else if(phone.length<6 || phone.length>15) {
      return Alert.alert(
        '',
        strings('globalValues.PhoneNumberValidation'),
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
      this.setState({visible: true, isDisabled: true});
      if(avatarSource) {
        var textorder = '';
        var possible = '_qazwsxedcvfrtgbnhyujmkiolp12345678900987654321ploikmjunhytgbrfdzcxewqas';
        for(var i = 0; i < 10; i++) {
          textorder += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        var finalTextOrder = textorder.replace(/\s/g,'')
        const file = {
          uri: avatarSource,
          name: finalTextOrder+'.jpg',
          type: 'image/jpg'
        }
        await RNS3.put(file,option).then(response => {
          if(response.status !== 201) {
            this.setState({visible: false})
            throw new Error("Failed to upload image to S3")
          }
          else {
            console.log(response.body);
            abc=response.body.postResponse.location;
            actions.getImage(response.body.postResponse.location);
          }
        })
      }
      this.setState({visible: false})
      let values = {'userId' : loginFieldId.userId, 'name' : name, 'profilePicUrl' : abc?abc:loginFieldId.image, 'phoneNumber' : phone, 'email' : email.toLowerCase(), 'callingCode' : selectedCountryCode, 'cca2' : cca2, 'userName' : username, 'Bio' : bio}
      console.log(values);
      return axios.post(`${Appurl.apiUrl}edituserProfileformdeshboard`, values)
      .then((response) => {
        console.log(response)
        return this.detailsSaved(response);
      }).catch((error) => {
        console.log(error)
        Alert.alert(
          '',
          error.response.data.msg,
          [
            {
              text: strings('globalValues.AlertOKBtn'),
              onPress: () => {
                this.setState({visible: false, isDisabled: false});
              }
            }
          ],
          { cancelable: false }
        );
      })
    }
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
    }); }
  detailsSaved = async (response) => {
    let { name, phone, email, avatarSource } = this.state;
    let { loginFieldId, lang } = this.props.user;
    try {
      let details = {'image': abc?abc:loginFieldId.image , 'name': name , 'userId': loginFieldId.userId, 'email' : email.toLowerCase()}
      console.log(details)
      await AsyncStorage.setItem('user', JSON.stringify(details));
      if(this.state.pageName == "profile")
      {
        this.props.navigation.navigate("profile");
      }
      else
      {
      this.props.navigation.navigate("tabBar");
      }
    }
    catch(error) {
      this.setState({isDisabled: false})
      console.log(error)
    }
  }
  showImage = () => {
    console.log(this.state, 'avatar')
    let { avatarSource, photo } = this.state;
    let { profilepic, loginFieldId } = this.props.user;
    if(avatarSource) {
      console.log(' i m working')
      return <Image source = {{uri: avatarSource}} style = {styles.profilePic}/>
    }
    else {
      console.log(' i m working no more')
      return <Image source={require('./../Images/ic_avatar.png')} style = {styles.profilePic}/>
      // return <FastImage source = {{uri: this.props.user.profilepic ? `${Appurl.apiUrl}resizeimage?imageUrl=`+profilepic+'&width=160&height=160' : `${Appurl.apiUrl}resizeimage?imageUrl=`+loginFieldId.image+'&width=160&height=160'}} style = {{width:80, height:80, borderRadius: 40, opacity: 0.8}}/>
    }
  }
  countryPickerModal = ()=> {
    this.refs.CountryPicker.openModal();
  }
  render() {
    console.log(this.state, 'values')
    let { name, phone, email, avatarSource, isDisabled, visible, cca2, countryCode } = this.state;
    let { flexDirection, textAlign, lang, loginFieldId } = this.props.user;
    return (
       <View style = {{flex:1,backgroundColor : colors.themeHeader}}>
      <SafeAreaView style={{flex: 1}}>
        <Spinner visible={visible} color={colors.themeColor} tintColor={colors.themeColor} animation={'fade'} cancelable={false} textStyle={{color: '#FFF'}} />
        <View style={styles.headerBackGround}>
        <View style={{ justifyContent: 'space-between', marginHorizontal: moderateScale(24), flexDirection: 'row', marginTop:moderateScale(20)}}>
          <TouchableOpacity disabled={isDisabled} hitSlop = {{top:7, left:7, bottom:7, right:7}} style={{height: 20, width:24, justifyContent: 'center'}} >
            {/* <Image source={require('./../Images/icBack.png')} style={{height: 14, width:18}}/> */}
          </TouchableOpacity>
          <Text style={styles.editProfileText}>{strings('editProfile.editProfile')}</Text>
          <TouchableOpacity disabled={isDisabled} onPress = {() => {this.back()}}>
          <Image source={require('./../Images/ic_close_login.png')} />
          </TouchableOpacity>
        </View>
          <Text style={styles.editProfileInfo}>{strings('editProfile.editProfileInfo')}</Text>
          </View>
          
         <View style={styles.containerBorder}>
          <View style = {{flexDirection: flexDirection, marginHorizontal: 24, justifyContent:'space-between', alignItems:'center'}}>
           
              <TouchableOpacity activeOpacity = {0.7} onPress = {() => {this.image()}}>
                {this.showImage()}
                <Image source = {require('./../Images/ic_edit_photo.png')} style = {styles.cameraImage}/>
              </TouchableOpacity>
           
          </View>
  
                    <View style={{ marginTop:moderateScale(15),marginHorizontal: 24}}>
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
                    </View>
                   
                    <View style={{ marginTop:moderateScale(10),marginHorizontal: 24}}>
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
                    </View>
                    <View style={{ marginTop:moderateScale(10), marginHorizontal : moderateScale(24)}}>
                        <Text style={styles.inputLabel}>{strings('editProfile.bio')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={bio => this.bio = bio}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('editProfile.bio')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(bio) => this.setState({ bio })}
                            value={this.state.bio} />
                    </View>
                    <View style={{ marginTop:moderateScale(10),marginHorizontal: moderateScale(24)}}>
                        <Text style={styles.inputLabel}>{strings('register.email')}</Text>
                        <View style={{ flexDirection: 'row'  }}>
                        <TextInput style={styles.textInputStyleRow}
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
                            <TouchableOpacity style={styles.width20} onPress={this.verify.bind(this, 'verifyEmail')}>
                            <Text style={styles.verifyTextEmail}>{strings('editProfile.verify')}</Text>
                            </TouchableOpacity>
                            </View>
                    </View>
                    <View style={{marginHorizontal: 24, marginTop:moderateScale(10)}}>
                        <Text style={styles.inputLabel}>{strings('editProfile.phone')}</Text>
                        <View style={{ flexDirection: 'row'  }}>
                          <View style={{width:'80%', flexDirection: 'row'}}>
                            <View style={styles.countryCodeInnerContainer}>
                            <CountryPicker style={styles.countryCodeInnerContainer}
                                    onChange={value => {
                                        console.log(value, 'the value selected');
                                        this.setState({ cca2: value.cca2, selectedCountry:value.cca2, selectedCountryCode: '+' + value.callingCode })
                                    }}
                                    cca2={this.state.cca2}
                                    filterable
                                    autoFocusFilter={false}
                                    closeable={true}
                                />
                                <View pointerEvents="none" style={styles.countryCodeView}>
                                    <Text pointerEvents="none" numberOfLines={1} ellipsizeMode='tail' style={styles.countryCodeText}>({this.state.selectedCountryCode})</Text>
                                </View>
                                <Image style={{ position: "absolute", right: 0, height: verticalScale(10), width: scale(10), marginTop: 6 }} source={require('./../Images/drop-down.png')}/>
                            </View>
                            <TextInput style={styles.textInputPhoneStyle}
                              selectionColor={colors.tabsActiveColor}
                                ref={phoneNumber => this.phone = phone}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                textContentType='telephoneNumber'
                                contextMenuHidden={true}
                                dataDetectorTypes='phoneNumber'
                                keyboardType='number-pad'
                                onChangeText={(phone) => this.setState({ phone})}
                                returnKeyType={"next"}
                                onSubmitEditing={() => this.email.focus()}
                                value={this.state.phone} />
                                </View>
                                <TouchableOpacity style={styles.width20} onPress={this.verify.bind(this, 'verifyMobile')}>
                                <Text style={styles.verifyText}>{strings('editProfile.verify')}</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={() => this.saveDetails()}>
                        <Text style={styles.loginButtonText}>{strings('editProfile.submit')}</Text>
                    </TouchableOpacity>
                    </View>
        </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(editProfile);
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
width20 : {
  width : "20%"
},
textInputStyleRow: {
  // lineHeight: '19@vs',
  width :'80%',
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
verifyTextEmail: {
  textAlign : "right",
   fontSize : "13@ms",
   marginTop: "5@ms",
   fontFamily : fontFamily.regular,
   color : colors.themeColor,
   lineHeight : "15@ms",
   marginLeft : "10@ms"
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
   flex:1},
  loginButton: {
    position : 'absolute',
   bottom : '10@ms',
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
  
  width80 : {
    width : '80%'
  },
  width90 : {
    width : '82%'
  }
})
