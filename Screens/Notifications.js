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

class  Notifications extends Component {
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeHeader }}>
        <View style={{ flex: 1 }}>
          {/* <Spinner visible={visible} color='#8D3F7D' tintColor='#8D3F7D' animation={'fade'} cancelable={false} textStyle={{ color: '#FFF' }} /> */}
        
          <View style={styles.headerBackGround }>
            <Text style={styles.notificationsText}> {strings('Notifications.notifications')}</Text>
          </View>
          <View style={styles.containerBorder}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.container}
            >
              <Text style={styles.countText}>{strings('Notifications.total')} 4  {strings('Notifications.notifications')} </Text>
              {this.state.arr.map(() => (
      <View>
        <Text style={styles.contentText}>Request Accepted</Text>
        <Text style={styles.secondContent}>Your Request Placed Successfully and accepted</Text>
        <Text style={styles.thirdContent}>Order ID: #233242424244242</Text>
        <Text style={styles.timeText}>1 min</Text>
        </View>
    ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
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
    fontFamily : fontFamily.bold,
    color : colors.themeColor,
    marginTop:'10@ms',
    lineHeight: '24@ms',
    fontSize:  '14@ms',
    fontWeight : fontWeight.bold
},
secondContent : {
    fontFamily : fontFamily.regular,
    color : colors.black,
    marginTop:'2@ms',
    lineHeight: '18@ms',
    fontSize:  '12@ms',
   
},
thirdContent : {
    fontFamily : fontFamily.regular,
    color : colors.black,
    marginTop:'2@ms',
    lineHeight: '18@ms',
    fontSize:  '12@ms',
},
timeText : {
    alignSelf : 'flex-end'
}
})
  
  
