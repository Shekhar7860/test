import React, { Component } from 'react';
import { SafeAreaView, Alert, Text, View, Image, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
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
class  contactUs extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      textshow: '',
      arr : [1, 2, 3, 4],
      isDisabled: false
    }
  }
  showContent = () => {
    this.setState({ visible: true })
    return axios.get(`${Appurl.apiUrl}pAndp`)
      .then((response) => {
        this.setState({ visible: false, textshow: this.props.user.lang == 'ar' ? response.data.data[0].privacyPolicy.ar : response.data.data[0].privacyPolicy.en });
      }).catch((error) => {
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
        )
      })
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

    setTimeout(() => {
      if (!this.props.user.netStatus) {
        return Alert.alert(
          '',
          strings('globalValues.NetAlert'),
          [
            {
              text: strings('globalValues.AlertOKBtn'),
              onPress: () => {
                this.setState({isDisabled: false, visible: false});
              }
            }
          ],
          { cancelable: false }
        );
      }
      else {
        this.showContent()
      }
    }, 200);
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
  }
  logOut = () => {
    // alert("logout")
    // this.props.navigation.navigate('signOut');
  }
  render() {
    let { visible, textshow, isDisabled } = this.state;
    let { textAlign, lang } = this.props.user;
   
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeHeader }}>
        <View style={{ flex: 1 }}>
          {/* <Spinner visible={visible} color='#8D3F7D' tintColor='#8D3F7D' animation={'fade'} cancelable={false} textStyle={{ color: '#FFF' }} /> */}
        
          <View style={styles.headerBackGround}>
        <View style={{ justifyContent: 'space-between', marginHorizontal: moderateScale(24), flexDirection: 'row', marginTop:moderateScale(20)}}>
          <TouchableOpacity disabled={isDisabled} hitSlop = {{top:7, left:7, bottom:7, right:7}} style={{height: 20, width:24, justifyContent: 'center'}} onPress={this.logOut.bind(this)} >
           {/* <Text>LogOut</Text> */}
          </TouchableOpacity>
          <Text style={styles.editProfileText}>{strings('settings.contact')}</Text>
          <TouchableOpacity disabled={isDisabled} onPress = {() => {this.back()}}>
          <Image source={require('./../Images/ic_close_login.png')} />
          </TouchableOpacity>
        </View>
          <Text style={styles.editProfileInfo}>{strings('payment.viewContactInfo')}</Text>
          </View>
          <View style={styles.containerBorder}>
              

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

export default connect(mapStateToProps, mapDispatchToProps)(contactUs);
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
        
    }
})
  
  
