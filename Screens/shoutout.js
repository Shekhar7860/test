import React, { Component } from 'react';
import {   Text, View, Dimensions, Image, TouchableOpacity, Alert, TextInput, ScrollView, SafeAreaView } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
// import { MKTextField } from 'react-native-material-kit';
import CheckBox from 'react-native-check-box';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import KeepAwake from 'react-native-keep-awake';
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
 import { ScaledSheet, moderateScale, scale, verticalScale } from "react-native-size-matters";
import { strings } from '../locales/i18n';
import Appurl from './../config';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import LinearGradient from 'react-native-linear-gradient';
import Validation from './../src/utils/Validation.js';
import ValidationAr from './../src/utils/ValidationAr.js';
const { width, height } = Dimensions.get('window')
import * as userActions from '../src/actions/userActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class shoutout extends Component {
  static navigatorStyle = {
    navBarHidden : true,
    tabBarHidden : true
  }
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      email : '',
      instructions : '',
      charCount: 0,
      isDisabled : false,
      promoText: '',
      promo : 0,
      promoApplied : false,
      orderid: '',
      promoPrice: 0,
      checkbox1: true,
      checkbox2: false,
      isChecked: true,
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
    this.setState({visible : true})
    setTimeout(()=> {
      this.setState({visible : false})
    }, 1000)
  }
  componentWillUnmount() {
     let {actions} = this.props;
    actions.toggleButton(false);
    actions.toggleButton1(false);
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }
  _handleConnectionChange = (isConnected) => {
    this.props.actions.checkInternet(isConnected);
  }

  validationRules= () => {
    return [
      {
        field: this.state.name,
        name: 'Full name',
        rules: 'required|min:2|max:30'
      },
      {
        field: this.state.email,
        name: 'Email Id',
        rules: 'required|email|max:100|no_space'
      },
      {
        field: this.state.instructions,
        name : 'Instructions',
        rules : 'required|min:2|max:350'
      },
      {
        field : this.state.promoText,
        name : 'Promo Code',
        rules : 'no_space'
      }
    ]
  }
  validationArRules= () => {
    return [
      {
        field: this.state.name,
        name: 'الإسم الكامل',
        rules: 'required|min:2|max:30'
      },
      {
        field: this.state.email,
        name: 'البريد الإلكتروني',
        rules: 'required|email|max:100|no_space'
      },
      {
        field: this.state.instructions,
        name : 'الرسالة',
        rules : 'required|min:2|max:350'
      },
      {
        field : this.state.promoText,
        name : 'كود الخصم',
        rules : 'no_space'
      }
    ]
  }
  back = () => {
    this.props.navigation.goBack(null)
  }
  bookNow = () => {
    
    let {actions} = this.props;
    let {visible} = this.state;
    let {name, email, instructions} = this.state;
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
    // else {
    //   this.props.actions.toggleButton1(true)
    //   this.setState({visible: true});
    //   KeepAwake.activate();
    //   if(this.promoVip()==0) {
    //     let {name, email, instructions, promo, promoText, promoApplied} = this.state;
    //     this.setState({visible: true})
    //     let values = {'promocode': this.state.promoText, 'userId' : this.props.user.loginFieldId.id, 'talentId' : this.props.user.talentId, 'forWhome' : name, 'foremail': email, 'message': instructions, 'ammount' : this.promoVip(), 'isVip' : this.state.checkbox2, 'isShow' : this.state.checkbox1};
    //     return axios.post(`${Appurl.apiUrl}paymentIfAmountZeero`, values)
    //     .then((response) => {
    //       let payPrice=this.promoVip()
    //       this.props.actions.setTalentPaymentDetails(name, instructions, payPrice, response.data.orderNumber, this.state.checkbox2)
    //       KeepAwake.deactivate();
    //       this.setState({visible: false})
    //       setTimeout(()=> {
    //         this.props.navigator.push({
    //           screen: 'AfterPayment'
    //         })
    //       }, 1000)
    //     }).catch((error) => {
    //       this.props.actions.toggleButton1(false)
    //       return this.showErrorAlert(error.response);
    //     })
    //   }
    //   else {
    //     this.setState({visible: true});
    //     let payPrice=this.promoVip()
    //     let { loginFieldId, talentId, lang, ipAddress } = this.props.user;
    //     this.props.actions.setTalentPay(this.state.promoText, loginFieldId.id, talentId, name, email, instructions, payPrice, this.state.checkbox2, this.state.checkbox1)
    //     let data = '?userId='+loginFieldId.id+'&talentId='+talentId+'&forWhome='+name+'&foremail='+email+'&message='+instructions+'&ammount='+payPrice+'&isVip='+this.state.checkbox2+'&isShow='+this.state.checkbox1+'&lang='+lang+'&customer_ip='+ipAddress
    //     this.setState({visible: false});
    else
    {
      this.props.navigation.navigate("payment");
    }
  
        // this.props.navigator.push({
        //   screen: 'paymentWeb',
        //   passProps: {'paymentData': data}
        // })
    //   }
    // }
  }
  showErrorAlert = (response) => {
    Alert.alert(
      '',
      response.data.msg,
      [
        {
          text: strings('globalValues.AlertOKBtn'),
          onPress: () => {
            this.setState({visible: false});
            KeepAwake.deactivate();
          }
        }
      ],
      { cancelable: false }
    );
  }
  applyPromo = () => {
    let {promoText, promoApplied} = this.state;
    if(!promoApplied) {
      if(promoText == '') {
        Alert.alert(
          '',
          strings('shoutout.PromoEnter'),
          [
            {
              text: strings('globalValues.AlertOKBtn'),
            }
          ],
          { cancelable: false }
        );
      }
      else {
        let values = {'userId' : this.props.user.loginFieldId.id,'promocode' : promoText}
        return axios.post(`${Appurl.apiUrl}getPromo`, values)
        .then((response) => {
          return this.checkPromo(response);
        }).catch((error) => {
          return this.showErrorAlert(error.response);
        })
      }
    }
    else {
      this.setState({promo: 0, promoApplied: false})
      this.setState({promoText: ''})
    }
  }

  _checkUnCheck = () => {
    this.setState({ isChecked: !this.state.isChecked });
}
  checkPromo=(response)=> {
    this.setState({promo:response.data.msg})
    if(response.data.success==2) {
      Alert.alert(
        '',
        strings('shoutout.PromoSuccess'),
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: () => {
              this.setState({promoApplied: true});
              this.promoPriceCalci()
            }
          }
        ],
        { cancelable: false }
      );
    }
    else {
      Alert.alert(
        '',
        response.data.msg,
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: () => {
            }
          }
        ],
        { cancelable: false }
      );
    }
  }
  promoPriceCalci = ()=> {
    let promoCalci = ((this.props.user.price*this.state.promo)/100);
    let dfr = promoCalci%1
    if(dfr!=0) {
      this.setState({promoPrice:promoCalci.toFixed(2)})
    }
    else {
      this.setState({promoPrice:promoCalci})
    }
  }
  promoVip = ()=> {
    if(this.state.promoApplied) {
      if(this.state.checkbox2) {
          return (this.props.user.price+this.props.user.vipPrice)-this.state.promoPrice
      }
      else {
        return this.props.user.price-this.state.promoPrice
      }
    }
    else if (this.state.checkbox2) {
      return this.props.user.price+this.props.user.vipPrice
    }
    else {
      return this.props.user.price
    }
  }
  render() {
    let { name, email, instructions, promo, promoText, promoApplied, visible, charCount, checkbox1, checkbox2, isDisabled } = this.state;
    let { flexDirection, textAlign, lang, talentName, loginFieldId, talentVip, isDisabled1 } = this.props.user;
    const windowHeight = Dimensions.get('window').height;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeHeader }}>
        <View style={{ flex: 1 }}>
          <Spinner visible={visible} color={colors.themeColor} tintColor={colors.themeColor} animation={'fade'} cancelable={false} textStyle={{ color: '#FFF' }} />
          <View style={styles.headerBackGround}>
         <View style={{ justifyContent: 'space-between', marginHorizontal: moderateScale(24), flexDirection: 'row', marginTop:moderateScale(20)}}>
          <TouchableOpacity disabled={isDisabled} hitSlop = {{top:7, left:7, bottom:7, right:7}} style={{height: 20, width:24, justifyContent: 'center'}} >
             <Image source = {{uri: this.props.user.talentImage}} style={styles.topImage}/> 
          </TouchableOpacity>
          <View style={{width:'50%'}}>
          <Text style={styles.editProfileText}>{this.props.user.profession}{"\n"}<Text style={styles.topTextName}>{this.props.user.talentName}</Text>{"\n"}<Text style={styles.topTextPrice}>$150/ Video</Text></Text>
          </View>
          <TouchableOpacity disabled={isDisabled} onPress = {() => {this.back()}}>
          <Image source={require('./../Images/ic_close_login.png')} />
          </TouchableOpacity>
        </View>
          <Text style={styles.editProfileInfo}></Text>
          </View>
          <View style={styles.containerBorder}>
          <View style={{ marginTop:moderateScale(30),marginHorizontal: 24}}>
                        <Text style={styles.inputLabel}>{strings('shoutout.namePerson')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={name => this.name = name}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('shoutout.enterName')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name} />
                       
                    </View>
                    <View style={{ marginTop:moderateScale(30),marginHorizontal: 24}}>
                        <Text style={styles.inputLabel}>{strings('shoutout.deliveryEmail')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={email => this.email = email}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={'abc@xyz.com'}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email} />
                       
                    </View>
                    <View style={{ marginTop:moderateScale(30),marginHorizontal: 24}}>
                        <Text style={styles.inputLabel}>{strings('shoutout.instuctions')}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.themeColor}
                            ref={instructions => this.instructions = instructions}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={colors.textColor}
                            placeholder={strings('shoutout.anySpec')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(instructions) => this.setState({ instructions })}
                            value={this.state.instructions} />
                       
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: moderateScale(23), marginTop : moderateScale(20) }}>
                        <TouchableOpacity activeOpacity={0.5} style={{ marginTop: verticalScale(5) }} onPress={() => this._checkUnCheck()}>
                            {
                                this.state.isChecked === false ?
                                <Image source={require('./../Images/blue_check.png')}  />
                                :
                                <Image source={require('./../Images/blue_check_selected.png')}  />
                            }
                        </TouchableOpacity>
                        <Text style={styles.dontShowText}>{strings('shoutout.dontShowMsg')}</Text>
                    </View>
                 <TouchableOpacity style={styles.loginButton} onPress={() => this.bookNow()}>
                        <Text style={styles.loginButtonText}>{strings('talentInfo.BookNowLabel')}</Text>
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
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(shoutout);
const styles=ScaledSheet.create({

  editProfileText: {
    
    fontSize : "13@ms",
    fontFamily : fontFamily.regular,
    color : colors.actorTextColor,
    lineHeight : "16@ms"
  },
  editProfileInfo : {
    
   
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
    width :'95%',
    height : "40@ms",
    color: colors.textColor,
    justifyContent : "center",
    opacity: 0.80,
    marginTop: '5@ms',
    fontFamily: fontFamily.mediumBold,
    padding: 0,
    paddingRight: '24@ms',
    textAlign: 'left',
    borderRadius : "5@ms",
    borderWidth : 1,
    borderColor : "rgba(0,0,0,0.08)",
    backgroundColor : "#EDF2F5",paddingHorizontal: 10
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
      bottom : 0,
      height: "60@vs",
      width: '100%',
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
    dontShowText : {
      marginLeft: "5@ms",
      fontSize : "14@ms",
      lineHeight : "24@ms",
      color : colors.black,
      fontFamily : fontFamily.regular,
      marginTop : "0@ms"
    },
    width10 : {
      width : "10%"
  },
  width15 : {
      width : "15%"
  },
  iconWidth : {
      
  },
  topImage : {
    marginTop : '30@ms',
    width : "60@s",
    height : "60@vs",
    borderRadius : "30@ms"
  },
  topTextName : {
    fontSize : "18@ms",
    fontFamily : fontFamily.bold,
    color : colors.textColor ,
    lineHeight : "24@ms",
    fontWeight : fontWeight.bold
  },
  topTextPrice : {
    marginTop :"10@ms",
    fontSize : "13@ms",
    fontFamily : fontFamily.semiBold,
    color : colors.actorTextColor,
    lineHeight : "20@ms",
   
  }
})



