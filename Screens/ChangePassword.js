import React, { Component } from 'react';
import { SafeAreaView, TextInput, Alert, Text, View, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
// import { MKTextField } from 'react-native-material-kit';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import { strings } from '../locales/i18n';
import Appurl from './../config';
import { ScaledSheet, moderateScale } from "react-native-size-matters";
import Validation from './../src/utils/Validation.js';
import ValidationAr from './../src/utils/ValidationAr.js';
import colors  from '../theme/colors';
import * as userActions from '../src/actions/userActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { verticalScale, scale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window')

class ChangePassword extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      visible: false,
      password: '',
      confirmPassword: '',
      reEnterPass : '',
      oldPass : "",
      newPass : ""
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
  back = () => {
    this.props.navigation.goBack(null)
    // this.props.navigator.pop();
  }
  saveDetails = () => {
    alert("Please wait")
  }
  validationRules= () => {
    return [
      {
        field: this.state.password,
        name: 'New Password',
        rules: 'required|no_space|min:6'
      },
      {
        field: this.state.oldPass,
        name: 'Old Password',
        rules: 'required|no_space|min:6'
      },
      {
        field: this.state.confirmPassword,
        name: 'Confirm Password',
        rules: 'required|no_space|min:6'
      },
    ]
  }
  validationArRules= () => {
    return [
      {
        field: this.state.password,
        name: 'كلمة السر',
        rules: 'required|no_space|min:6'
      },
      {
        field: this.state.confirmPassword,
        name: 'تأكيد كلمة المرور',
        rules: 'required|no_space|min:6'
      },
    ]
  }
  done = ()=> {
    let {password, confirmPassword, visible, isDisabled, oldPass, newPass} = this.state;
    let validation= this.props.user.lang=='en'?Validation.validate(this.validationRules()):ValidationAr.validate(this.validationArRules())
    if(validation.length!=0) {
      return Alert.alert(
        '',
        validation[0],
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
    else if(password!=confirmPassword) {
      return Alert.alert(
        '',
        strings('ChangePassword.noMatch'),
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
      this.setState({visible: true, isDisabled: true})
      let values = {'userId' : this.props.user.loginFieldId.userId, 'password' : password,  'oldPassword' : oldPass}
      return axios.post(`${Appurl.apiUrl}changePasswordOfUser`, values)
      .then((response) => {
        console.log(response)
        Alert.alert(
          '',
          strings('ChangePassword.SuccessAlert'),
          [
            {
              text: strings('globalValues.AlertOKBtn'),
              onPress: () => {
                this.setState({isDisabled: false,visible: false});
                this.props.navigation.goBack(null)
              }
            }
          ],
          { cancelable: false }
        );
      })
      .catch((error) => {
        if(error.response.data.success == 0) {
          Alert.alert(
            '',
            error.response.data.msg,
            [
              {
                text: 'Okay',
                onPress: () => {
                  this.setState({isDisabled: false, visible: false});
                }
              }
            ],
            { cancelable: false }
          );
        }
      })
    }
  }
  render() {
    let { password, visible, isDisabled } = this.state;
    let { textAlign, lang } = this.props.user;
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    return (
      <View style = {{flex:1,backgroundColor : colors.themeHeader}}>
      <SafeAreaView style={{flex: 1}}>
        <Spinner visible={visible} color={colors.themeColor} tintColor={colors.themeColor} animation={'fade'} cancelable={false} textStyle={{color: '#FFF'}} />
        <View style={styles.headerBackGround}>
        <View style={{ justifyContent: 'space-between', marginHorizontal: moderateScale(24), flexDirection: 'row', marginTop:moderateScale(20)}}>
          <TouchableOpacity disabled={isDisabled} hitSlop = {{top:7, left:7, bottom:7, right:7}} style={{height: 20, width:24, justifyContent: 'center'}} >
            {/* <Image source={require('./../Images/icBack.png')} style={{height: 14, width:18}}/> */}
          </TouchableOpacity>
          <Text style={styles.editProfileText}>{strings('ChangePassword.passwordText')}</Text>
          <TouchableOpacity disabled={isDisabled} onPress = {() => {this.back()}}>
          <Image source={require('./../Images/ic_close_login.png')} />
          </TouchableOpacity>
        </View>
          <Text style={styles.editProfileInfo}>{strings('ChangePassword.updatePassword')}</Text>
          </View>
          
         <View style={styles.containerBorder}>
          <View style = {{flexDirection: 'row', marginHorizontal: 24, justifyContent:'space-between', alignItems:'center'}}>
           
           
           
          </View>

            <View style={{ marginTop:moderateScale(15),marginHorizontal: 24}}>
                        <Text style={styles.inputLabel}>{strings('ChangePassword.oldPass')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={oldPass => this.oldPass = oldPass}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('ChangePassword.enterOldPass')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            secureTextEntry={true}
                            returnKeyType={"next"}
                            onChangeText={(oldPass) => this.setState({ oldPass })}
                            value={this.state.oldPass} />
                        <View style={styles.inputLine} />
                    </View>
  
                    <View style={{ marginTop:moderateScale(15),marginHorizontal: 24}}>
                        <Text style={styles.inputLabel}>{strings('ChangePassword.newPass')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={password => this.password = password}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('ChangePassword.enterNewPass')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password} />
                        <View style={styles.inputLine} />
                    </View>
                   
                    <View style={{ marginTop:moderateScale(15),marginHorizontal: 24}}>
                        <Text style={styles.inputLabel}>{strings('ChangePassword.reEnterPass')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={confirmPassword => this.confirmPassword = confirmPassword}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('ChangePassword.reEnterNewPass')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            secureTextEntry={true}
                            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                            value={this.state.confirmPassword} />
                        <View style={styles.inputLine} />
                    </View>

                   
        
                  
                    <TouchableOpacity style={styles.loginButton} onPress={() => this.done()}>
                        <Text style={styles.loginButtonText}>{strings('ChangePassword.SaveChanges')}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
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
  width :'100%',
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
    bottom : 20,
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

