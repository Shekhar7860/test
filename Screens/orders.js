import React, { Component } from 'react';
import { Text, View, AsyncStorage, SafeAreaView, Image, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
import I18n from 'react-native-i18n';
// import { MKTextField } from 'react-native-material-kit';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import colors  from '../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { strings } from '../locales/i18n';
import Appurl from './../config';
import Requests from './../Components/requests';
import Received from './../Components/received';
import { ScaledSheet } from "react-native-size-matters";
import * as userActions from '../src/actions/userActions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import fontWeight from '../theme/fontWeight';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window')
import fontFamily from '../theme/fontFamily';
const ThumbnailUrl = "https://s3.us-east-2.amazonaws.com/famcamuploads/videoThumbnails/lYRnRSb0rn64iXmaNQKbfFsxS_1.jpg"
class orders extends Component {
  static navigatorStyle = {
    navBarHidden : true
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      arr : [1, 2]
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



  receivedData = () => {
    if (!this.props.user.netStatus) {
      this.setState({ refreshing: false });
      return Alert.alert(
        '',
        strings('globalValues.NetAlert'),
        [
          {
            text: strings('globalValues.AlertOKBtn'),
            onPress: () => {
              this.setState({ isDisabled: false, visible: false });
            }
          }
        ],
        { cancelable: false }
      );
    }
    else {
      let values = { 'userId': this.props.user.loginFieldId.userId }
      return axios.post(`${Appurl.apiUrl}UserVediosUrl`, values)
        .then((response) => {
          return this.getResponse(response.data.data);
        }).catch((error) => {
          console.log(error.response);
        })
    }
  }
  asqw = async (getwq)=> {
    await AsyncStorage.setItem('lang', JSON.stringify(getwq));
    this.props.actions.setLanguage(getwq)
    console.log(this.props.user.lang)
  }
  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  };
  componentDidMount() {
    // this.navigationEventListener = Navigation.events().bindComponent(this);
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

  componentDidAppear = () => {
    let { actions } = this.props;
    AsyncStorage.getItem('user')
      .then((user) => {
        let details = JSON.parse(user);
       // actions.getLoginUserId(details);
        console.log(details, 'values');
      //  alert(JSON.stringify(details))
      });
    this.receivedData();
  }
  componentWillUnmount() {
    let {actions} = this.props;
    actions.toggleButton(false);
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
  }
  _handleConnectionChange = (isConnected) => {
    this.props.actions.checkInternet(isConnected);
  }
  componentWillReceiveProps() {
    console.log('componentWillReceiveProps')
    if(this.props.user.isOrderRecieved==1) {
      this.props.actions.setIsOrderRecieved(2)
      setTimeout(() => this.scrollableTabView.goToPage(1), 300);
    }
    else if(this.props.user.isOrderRecieved==0) {
      this.props.actions.setIsOrderRecieved(2)
      setTimeout(() => this.scrollableTabView.goToPage(0), 300);
    }
  }
  getResponse(data) {
    this.setState({ refreshing: false });
    console.log(data, 'data');
    let { results } = this.state;
    results.splice(0, results.length);
    this.setState({ results });
    for (let i = 0; i < data.length; i++) {
      results.push({ 'for': data[i].forWhome, 'message': data[i].message, 'talentName': data[i].talentName, 'duration': data[i].duration, 'video': data[i].vedioUrl, 'time': data[i].time, 'image': data[i].thumbnailUrl, 'fileName': data[i].videoName });
    }
    this.setState({ results });
  }
  render() {
    let { lang } = this.props.user;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeHeader }}>
      <View style = {{flex:1}}>
      <View style={styles.headerBackGround }>
            <Text style={styles.notificationsText}> {strings('Notifications.videos')}</Text>
            <SegmentedControlTab
        tabStyle={styles.tabStyle}
        values={['No', 'Yes']}
        tabsContainerStyle={styles.tabsContainerStyle}
        activeTabStyle={styles.activeTabStyle}
        firstTabStyle={styles.firstTabStyle}
  lastTabStyle={styles.lastTabStyle}
  tabTextStyle={styles.tabTextStyle}
  activeTabTextStyle={styles.activeTabTextStyle}
          values={["Requested", "Received"]}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
        />
          </View>
          <ScrollView style={styles.containerBorder}>
            {this.state.selectedIndex == 1 ? <View style={styles.containerMargin }>
            {this.state.arr.map(() => (
              <View>
     <View style={styles.imgTextContainer}>
       <View style={styles.width45}>
     
        <View style={{ width: scale(144), height: verticalScale(232) }}>
                        <TouchableOpacity  activeOpacity={0.8} >
                          <LinearGradient colors={['black', 'black']} style={{ width: scale(104), height: verticalScale(205), borderRadius: 4, marginTop : moderateScale(20) }}>
                          <FastImage source={{ uri: `${Appurl.apiUrl}resizeimage?imageUrl=` + ThumbnailUrl + '&width=288&height=384' }} style={{ width: scale(104), height: verticalScale(205), borderRadius: 4, opacity: 0.75 }} />
                          </LinearGradient>
                          <Image source={require('./../Images/GroupCopy3x.png')} style={{ width: scale(24), height: verticalScale(24), position: 'absolute', top: moderateScale(170), left: moderateScale(5)}} />
                          <Text style={{ backgroundColor: 'transparent', fontSize: 12, color: 'white', position: 'absolute', top: 10, left: 100, fontFamily: 'SFUIDisplay-Bold' }}></Text>
                        </TouchableOpacity>
                      </View>
       </View>
     <View style={styles.width45}>
         <Text style={styles.textStyle}>Mark Ferguson</Text>
         <Text style={styles.forMsgText}>For</Text>
   <Text style={styles.nameText}>Augusta Russell</Text>
   <Text style={styles.MsgText}>Message</Text>
   <Text style={styles.msgTextStyle}>Hey, my brother is your big fan i would love if you could wish him and sing you song please </Text>
     </View>
     <View style={styles.width10}>
     <Image source={require('./../Images/ic_download.png')} style={styles.Icon}/>
     </View>
   </View>
   
   <View style={styles.inputLine} /></View>
    ))}
            </View>
             : 
            <View style={styles.containerMargin }>
            {this.state.arr.map(() => (
              <View>
     <View style={styles.imgTextContainer}>
     <View style={styles.width85}>
         <Text style={styles.textStyle}>Mark Ferguson{"\n"}<Text style={styles.statusText}>Pending </Text>:<Text style={styles.replyText}> Waiting For Reply</Text> </Text>
     </View>
     <View style={styles.width15}>
     <Image source={require('./../Images/profile.png')} style={styles.ImageWidth}/>
     </View>

   </View>
   <Text style={styles.forMsgText}>For</Text>
   <Text style={styles.nameText}>Augusta Russell</Text>
   <Text style={styles.MsgText}>Message</Text>
   <Text style={styles.msgTextStyle}>Hey, my brother is your big fan i would love if you could wish him and sing you song please </Text>
   <View style={styles.inputLine} /></View>
    ))}
            
            </View>
            }
          </ScrollView>
       
        {/* <ScrollableTabView
          ref={(ref) => { this.scrollableTabView = ref; }}
          style={{marginTop: 30}}
          initialPage={0}
          tabBarUnderlineStyle = {{backgroundColor : '#D8546E', height:1}}
          tabBarTextStyle = {{fontSize: 24, fontFamily: lang=='en'?'SFUIDisplay-Bold':'HelveticaNeueLTArabic-Bold'}}
          tabBarActiveTextColor = '#BF4D73'
          tabBarInActiveTextColor = '#4A4A4A'
          prerenderingSiblingsNumber = {0}
          renderTabBar={() => <ScrollableTabBar />}
          >
          <Requests tabLabel={strings('globalValues.RequstsLabel')} {...this.props}/>
          <Received tabLabel={strings('globalValues.ReceivedLabel')} {...this.props}/>
        </ScrollableTabView> */}
        </View>
        </SafeAreaView>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(orders);
const styles=ScaledSheet.create({ 
  tabStyle : {
    marginTop : "15@ms",
    color : colors.themeColor,
    backgroundColor : colors.transparent,
    borderColor : colors.transparent,
    width : '30@ms',
    height : "30@ms",
    borderWidth : 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  activeTabStyle : {
    marginTop : "15@ms",
    backgroundColor : colors.themeColor,
    borderWidth : 1,
    borderColor : colors.themeColor,
    width : '30@ms',
    height : "30@ms",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  imgTextContainer : {
    flexDirection : 'row'
  },
  tabsContainerStyle: {
   alignSelf : 'flex-start',
   width : '60%',
   marginLeft : '20@ms'
  },
  firstTabStyle: {
    borderRightWidth: 0, borderTopLeftRadius:15, borderBottomLeftRadius: 15,
    width : '50@ms'
  },
  lastTabStyle: {
    borderLeftWidth: 0, borderTopRightRadius:15, borderBottomRightRadius: 15
  },
  tabTextStyle: {
    color : colors.black
  },
  activeTabTextStyle: {
    fontFamily : fontFamily.bold
  },
  tabBadgeStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  },
  inputLine: {
    height: '1@ms',
    width: width - 46,
    backgroundColor: colors.black,
    opacity: 0.10,
    borderRadius: '4@ms',
    marginTop: '15@ms',
    alignSelf: 'center'
},
  headerBackGround : {
    height : '90@ms'
},
containerMargin : {
  marginHorizontal : "24@ms"
},
textStyle : {
  marginTop:'20@ms',
  color : colors.black,
  fontSize : "14@ms",
  fontFamily : fontFamily.bold,
  fontWeight : fontWeight.bold,
  lineHeight : "24@ms"
},
width85 : {
  width : '85%'
},
width15 : {
  width : '15%'
},
  containerBorder : {
    marginTop:"10@ms",
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30), borderWidth : 1, borderColor : colors.borderColor,
    backgroundColor : 'white', flex:1},
  notificationsText : {
      
    textAlign: 'center',
     fontSize: '18@ms',
     color : colors.notificationsText,
     marginTop : '20@ms',
     fontFamily : fontFamily.bold,
     fontWeight : fontWeight.bold,
     lineHeight : "24@ms"

},
ImageWidth : {
  width : '40@ms',
  height : '40@ms',
  marginTop : "20@ms"
},
Icon : {
  marginTop : "20@ms"
},
replyText : {
  marginTop : "25@ms",
  fontFamily : fontFamily.bold, 
  color : colors.professionText,
  fontSize : "11@ms",
  fontWeight : "500",
  lineHeight : "16@ms"
},
statusText : {
  marginTop : "25@ms",
  fontFamily : fontFamily.bold, 
  color : colors.themeColor,
  fontSize : "11@ms",
  fontWeight : "500",
  lineHeight : "16@ms"
},
forMsgText : {
  marginTop : "10@ms",
  fontSize : "11@ms",
  color : colors.professionText,
  fontFamily : fontFamily.mediumBold
},
MsgText : {
  marginTop : "20@ms",
  fontSize : "11@ms",
  color : colors.professionText,
  fontFamily : fontFamily.mediumBold
},
nameText : {
  fontSize : "12@ms",
  marginTop : "5@ms"
},
msgTextStyle : {
  fontSize : "12@ms",
  marginTop : "5@ms",
  fontFamily : fontFamily.regular,
  color : colors.msgTextColor
},
width35 : {
  width : "35%"
},
width45 : {
  width : "45%"
},
width10 : {
  width : "10%"
}
})
