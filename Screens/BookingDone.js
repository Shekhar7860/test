import React, { Component } from 'react';
import { SafeAreaView, Alert, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
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

class  BookingDone extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      textshow: '',
      arr : [1, 2, 3, 4]
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
    this.props.navigator.pop();
  }
  render() {
    let { visible, textshow } = this.state;
    let { textAlign, lang } = this.props.user;
    return (
      <SafeAreaView style={{ flex: 1}}>
        <View style={{ flex: 1 }}>
           <Image source={require('./../Images/Booking_done.png')} style={styles.Image}/>
            <Text style={styles.contentText}>{strings('BookingDone.bookingDoneSuccessfully')}</Text>
            <Text style={styles.secondContent}>{strings('BookingDone.requestSubmitted')}</Text>
            <Text style={styles.thirdContent}>{strings('BookingDone.successfully')}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingDone);
const styles=ScaledSheet.create({
    Image : {
        alignSelf : "center",
        marginTop : "100@ms"
    },
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
        marginHorizontal : "24@ms"
    },
    containerBorder : {
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30), borderWidth : 1, borderColor : colors.borderColor,
        backgroundColor : 'white', flex:1},
headerBackGround : {
    height : '90@ms'
},
countText : {
    fontFamily : fontFamily.bold,
    color : colors.notificationsText,
    marginTop:'20@ms',
    lineHeight: '24@ms',
    fontSize:  '14@ms',
    fontWeight : fontWeight.bold
},
contentText : {
    textAlign : "center",
    fontFamily : fontFamily.bold,
    marginTop:'30@ms',
    lineHeight: '24@ms',
    fontSize:  '18@ms',
    fontWeight : fontWeight.bold
},
secondContent : {
    textAlign : "center",
    fontFamily : fontFamily.regular,
    color : colors.requestTextColor ,
    marginTop:'2@ms',
    lineHeight: '18@ms',
    fontSize:  '14@ms',
   
},
thirdContent : {
    textAlign : "center",
    fontFamily : fontFamily.regular,
    color : colors.requestTextColor ,
    marginTop:'1@ms',
    lineHeight: '18@ms',
    fontSize:  '14@ms'
   
}
,
timeText : {
    alignSelf : 'flex-end'
}
})
  
  
