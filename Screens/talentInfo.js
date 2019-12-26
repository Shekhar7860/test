import React, { Component } from 'react';
import { Platform, Text, View, ImageBackground, Dimensions, TouchableOpacity, Alert, ScrollView, Image, PermissionsAndroid, SafeAreaView, FlatList } from 'react-native';
import { ScaledSheet, moderateScale, scale, verticalScale } from "react-native-size-matters";
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import RNFetchBlob from 'react-native-fetch-blob';
import FastImage from 'react-native-fast-image';
import { strings } from '../locales/i18n';
import Appurl from './../config';
import colors  from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import fontWeight from '../theme/fontWeight';
import * as userActions from '../src/actions/userActions';
import Spinner from 'react-native-loading-spinner-overlay';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setTimeout } from 'core-js';
import { Colors } from 'react-native/Libraries/NewAppScreen';

class talentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      visible: false,
      image: '',
      name: '',
      bio: '',
      profession: '',
      profession1: '',
      rTalent: [],
      newrTalent: [],
      rVideos: []
    }
  }
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
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
                this.setState({ isDisabled: false, visible: false });
              }
            }
          ],
          { cancelable: false }
        );
      }
      else {
        this.setState({ visible: true })
        this.getTalentInfo();
      }
    }, 200);

  }
  componentWillUnmount() {
    let { actions } = this.props;
    actions.toggleButton(false);
    actions.toggleButton3(false);
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }
  _handleConnectionChange = (isConnected) => {
    this.props.actions.checkInternet(isConnected);
  }

  getTalentInfo = () => {
    let talentInfo1 = { 'userId': this.props.user.loginFieldId.id, 'talentId': this.props.user.talentId, 'related1': this.props.user.related1, 'related2': this.props.user.related2 }
    console.log(talentInfo1);
    return axios.post(`${Appurl.apiUrl}fetchTalentInform`, talentInfo1)
      .then((response) => {
        console.log(response.data);
        return this.displayInfo(response);
      }).catch((error) => {
        console.log(error)
        if (error.response.msg) {
          Alert.alert(
            '',
            error.response.msg,
            [
              {
                text: strings('globalValues.AlertOKBtn'),
                onPress: () => {
                  this.setState({ isDisabled: false, visible: false });
                  this.props.actions.forceRefreshHome(true)
                  this.props.navigator.pop()
                }
              }
            ],
            { cancelable: false }
          )
        }
        else {
          Alert.alert(
            '',
            strings('globalValues.wrongMessage'),
            [
              {
                text: strings('globalValues.AlertOKBtn'),
                onPress: () => {
                  this.setState({ isDisabled: false, visible: false });
                  this.props.navigator.pop()
                }
              }
            ],
            { cancelable: false }
          )
        }
      })
  }
  displayInfo = (response) => {
    let { actions } = this.props;
    let { rTalent, name, rVideos } = this.state;
    this.setState({ image: response.data.data.talentData.profilePicUrl, name: response.data.data.talentData.name, bio: response.data.data.talentData.Bio, visible : false });
   
    actions.setTalentOrderDetails(response.data.data.talentData.name, response.data.data.talentData.profilePicUrl)
    this.setState({ profession: this.props.user.lang == 'en' ? response.data.data.talentData.professions[0].professionCatagory.en : response.data.data.talentData.professions[0].professionCatagory.ar });
    this.setState({ profession1: response.data.data.talentData.professions[1] ? (this.props.user.lang == 'en' ? response.data.data.talentData.professions[1].professionCatagory.en : response.data.data.talentData.professions[1].professionCatagory.ar) : '' });
    actions.setImageTalent(response.data.data.talentData.profilePicUrl);
    actions.getPrice(response.data.data.talentData.price[0], response.data.data.VipPrice[0].amount);
    actions.setVip(response.data.data.talentData.vipAccepted)
    response.data.data.talentVedios.forEach((item, index) => {
      rVideos.push({ 'id': item._id, 'video': item.vedioUrl, 'duration': item.duration, 'for': item.forWhome, 'image': item.thumbnailUrl, 'videoName': item.videoName });
    });
    this.setState({ rVideos });
    response.data.data.relatedTalent.forEach((item, index) => {
      rTalent.push({ 'id': item._id, 'profession': this.props.user.lang == 'en' ? item.professions[0].professionCatagory.en : item.professions[0].professionCatagory.ar, 'profession1': item.professions[1] ? (this.props.user.lang == 'en' ? item.professions[1].professionCatagory.en : item.professions[1].professionCatagory.ar) : '', 'pic': item.profilePicUrl, 'name': item.name });
    });
    this.setState({ rTalent, visible: false });
  }
  newTalent = (id) => {
    if (!this.props.user.netStatus) {
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
      let { actions } = this.props;
      this.setState({ isDisabled: true, visible: true });
      actions.getTalentId(id);
      this.setState({ rTalent: [], rVideos: [] });
      let talentInfo1 = { 'userId': this.props.user.loginFieldId.id, 'talentId': id, 'related1': this.props.user.related1, 'related2': this.props.user.related2 }
      console.log(talentInfo1);
      return axios.post(`${Appurl.apiUrl}fetchTalentInform`, talentInfo1)
        .then((response) => {
          console.log(response);
          this.setState({ isDisabled: false, visible: true })
          return this.displayInfo(response);
        }).catch((error) => {
          console.log(error.response);
          this.setState({ isDisabled: false, visible: false })
        })
    }
  }
  back = () => {
    // alert("m working")
    this.props.navigation.goBack(null)
  }
  requestPage = () => {
    let { actions } = this.props;
    actions.toggleButton(true);
    this.props.navigation.navigate("shoutout");
    // this.props.navigator.push({
    //   screen: 'shoutout'
    // })
  }
  playVideo = async (video, filePath, fileName) => {
    console.log(video, 'path')
    if (Platform.OS == 'android' && Platform.Version > 22) {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]
      );
      if (granted['android.permission.WRITE_EXTERNAL_STORAGE'] != 'granted') {
        return Alert.alert(
          '',
          strings('globalValues.VideoSave'),
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
    }
    this.setState({ isDisabled: true, visible: true })
    this.props.actions.toggleButton2(true);
    let dirs;
    if (Platform.OS == 'ios') {
      dirs = RNFetchBlob.fs.dirs.DocumentDir;
    }
    else {
      dirs = RNFetchBlob.fs.dirs.MovieDir;
    }
    console.log(dirs)
    let famcamDir = dirs + '/FamCamUser';
    RNFetchBlob.fs.isDir(famcamDir)
      .then((isDir) => {
        console.log(isDir)
        if (!isDir) {
          console.log('not found')
          RNFetchBlob.fs.mkdir(famcamDir)
            .then(() => {
              RNFetchBlob
                .config({
                  // response data will be saved to this path if it has access right.
                  path: famcamDir + '/' + fileName
                })
                .fetch('GET', filePath, {
                  //some headers ..
                })
                .then((res) => {
                  console.log(res)
                  // the path should be dirs.DocumentDir + 'path-to-file.anything'
                  console.log('The file saved to ', res.path())
                  let playpath = res.path();
                  this.props.actions.setPlayVideo(playpath)
                  this.setState({ isDisabled: false, visible: false })
                  if (Platform.OS == 'ios') {
                    setTimeout(() => {
                      Navigation.push(this.props.componentId, {
                        component: {
                          name: 'PlayVideo',
                          options: {
                            topBar: {
                                visible: false
                            }
                          }
                        }
                      });
                    }, 1000)
                  }
                  else {
                    setTimeout(() => {
                      Navigation.showModal({
                        stack: {
                          children: [{
                            component: {
                              name: 'PlayVideo',
                             
                              options: {
                                topBar: {
                                    visible: false
                                }
                              }
                            }
                          }]
                        }
                      });
                    }, 1000)
                  }
                })
            })
        }
        else {
          RNFetchBlob.fs.exists(famcamDir + '/' + fileName)
            .then((exist) => {
              console.log(exist)
              if (!exist) {
                RNFetchBlob
                  .config({
                    // response data will be saved to this path if it has access right.
                    path: famcamDir + '/' + fileName
                  })
                  .fetch('GET', filePath, {
                    //some headers ..
                  })
                  .then((res) => {
                    console.log(res)
                    // the path should be dirs.DocumentDir + 'path-to-file.anything'
                    console.log('The file saved to ', res.path())
                    let playpath = res.path();
                    this.props.actions.setPlayVideo(playpath)
                    this.setState({ isDisabled: false, visible: false })
                    if (Platform.OS == 'ios') {
                      setTimeout(() => {
                        Navigation.push(this.props.componentId, {
                          component: {
                            name: 'PlayVideo',
                            options: {
                              topBar: {
                                  visible: false
                              }
                            }
                          }
                        });
                      }, 1000)
                    }
                    else {
                      setTimeout(() => {
                        Navigation.showModal({
                          stack: {
                            children: [{
                              component: {
                                name: 'PlayVideo',
                               
                                options: {
                                  topBar: {
                                      visible: false
                                  }
                                }
                              }
                            }]
                          }
                        });
                      }, 1000)
                    }
                  })
              }
              else {
                let playpath = famcamDir + '/' + fileName;
                this.props.actions.setPlayVideo(playpath)
                this.setState({ isDisabled: false, visible: false })
                if (Platform.OS == 'ios') {
                  setTimeout(() => {
                    Navigation.push(this.props.componentId, {
                      component: {
                        name: 'PlayVideo',
                        options: {
                          topBar: {
                              visible: false
                          }
                        }
                      }
                    });
                  }, 1000)
                }
                else {
                  setTimeout(() => {
                    Navigation.showModal({
                      stack: {
                        children: [{
                          component: {
                            name: 'PlayVideo',
                           
                            options: {
                              topBar: {
                                  visible: false
                              }
                            }
                          }
                        }]
                      }
                    });
                  }, 1000)
                }
              }
            })
            .catch((err) => {
              this.props.actions.toggleButton2(false);
              console.log(err)
            })
        }
      })
      .catch((err) => {
        this.props.actions.toggleButton2(false);
        console.log(err)
      })
  }
  render() {
    let { data, image, name, bio, profession, profession1, result, rTalent, newName, newImage, newProfession, videos, rVideos, visible } = this.state;
    let { flexDirection, textAlign, lang, price, isDisabled, isDisabled2 } = this.props.user;
    const Width = Dimensions.get('window').width;
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <Spinner visible={visible} color={colors.themeColor} tintColor={colors.themeColor}  animation={'fade'} cancelable={false} textStyle={{ color: '#FFF' }} />
        <FastImage source={{ uri:  image }} style={{ width: Width, height: verticalScale(270) }}>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity hitSlop={{ top: 7, left: 7, bottom: 7, right: 7 }} style={{ height: verticalScale(20), width: scale(24), justifyContent: 'center', margin: moderateScale(20) }} onPress={() => { this.back() }}>
              <Image source={require('./../Images/ic_back_white.png')} style={{ height: verticalScale(14), width: scale(18) }} />
            </TouchableOpacity>
          </SafeAreaView>
        </FastImage>
        <SafeAreaView style={{ flex: 1, borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30), borderWidth : 1, borderColor : colors.borderColor,
    backgroundColor : 'white', position : 'absolute', top : moderateScale(200) }}>
          <View style={{ height: 120, marginHorizontal: moderateScale(24), borderRadius: 5 }}>
          <Text style={{ marginTop: moderateScale(20), color: '#4A4A4A', fontSize: 14, textAlign: textAlign }}>{profession} {profession1 ? '/' : null} {profession1}</Text>
           <View style={{flexDirection : "row"}}>
            <Text style={{ fontSize: 20, fontWeight: '600', marginTop: moderateScale(5), color: '#1F1D1D', textAlign: textAlign, width : "85%" }}>{name}</Text>
            <Text style={{ color : colors.green, marginTop: moderateScale(10), width : "15%", fontFamily : fontFamily.googleBold }}>$120</Text>
            </View>
            <Text numberOfLines={1} style={{ marginTop: 5, color: '#4A4A4A', fontSize: 14, textAlign: textAlign, fontFamily: lang == 'en' ? 'SFProDisplay-Regular' : 'HelveticaNeueLTArabic-Light' }}>{bio}</Text>
          </View>
          <ScrollView
            style={{ height: Dimensions.get('window').height - verticalScale(340) }}
            showsVerticalScrollIndicator={false}
          >
            {rVideos.length ? <View style={{ flex: 0.2 }}>
              <Text style={{ fontSize: 16, color: '#1F1D1D', margin: moderateScale(20), textAlign: textAlign, fontFamily: lang == 'en' ? 'SFUIText-Bold' : 'HelveticaNeueLTArabic-Bold' }}>{strings('talentInfo.videos')}</Text>
              <ScrollView showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                {rVideos.length ?  
                <FlatList 
           data={rVideos}
         renderItem={({item, index}) => <View key={index} style={{ flex: 1, marginHorizontal:moderateScale(10) }}>
      <View style={{ width: scale(144), height: verticalScale(232) }}>
        <TouchableOpacity disabled={isDisabled2} activeOpacity={0.8} onPress={() => { this.playVideo( item, item.video, item.videoName) }}>
          <LinearGradient colors={['black', 'black']} style={{ width: 144, height: 192, borderRadius: 4 }}>
            <FastImage source={{ uri: `${Appurl.apiUrl}resizeimage?imageUrl=` + item.image + '&width=288&height=384' }} style={{ width: scale(120), height: verticalScale(192), borderRadius: 4 }} />
          </LinearGradient>
          <Image source={require('./../Images/GroupCopy3x.png')} style={{ width: 24, height: 24, position: 'absolute', top: 160, left: 5 }} />
          <Text style={{ backgroundColor: 'transparent', fontSize: 12, color: 'white', position: 'absolute', top: 10, left: 100, fontFamily: 'SFUIDisplay-Bold' }}>{item.duration}</Text>
        </TouchableOpacity>
        <View style={{ flex: 0.3 }}></View>
        <View style={{ flexDirection: flexDirection }}>
          <Text style={{ fontSize: 12, color: '#343434', textAlign: textAlign, fontFamily: lang == 'en' ? 'SFUIText-Regular' : 'HelveticaNeueLTArabic-Light' }}>{strings('talentInfo.ForLabel')}  </Text>
          <Text style={{ fontSize: 12, color: '#343434', textAlign: textAlign, fontWeight: 'bold' }}>{item.for}</Text>
        </View>
      </View>
      </View>}
        keyExtractor={item => item.id.toString()}
        numColumns={ 2 }
        extraData={this.state}
      />
                : null
                }
              </ScrollView>
            </View> : null}
            {rTalent.length ? <View style={{ flex: 0.3 }}>
              <Text style={{ fontSize: 16, margin: 20, color: '#1F1D1D', textAlign: textAlign, fontFamily: lang == 'en' ? 'SFUIText-Bold' : 'HelveticaNeueLTArabic-Bold' }}>{strings('talentInfo.RelatedText')}</Text>
              <ScrollView  style={{ flex: 1, marginRight: 10 }}>
                {rTalent.length ?
                 <FlatList 
                  data={rTalent}
                    renderItem={({item, index}) => 
                   <View style={{ flex: 1, flexDirection: 'row' }} key={index}>
                    <View style={{ flex: 0.7, marginLeft: 20 }}>
                      <TouchableOpacity style={{ alignItems: lang == 'en' ? 'flex-start' : 'flex-end' }} activeOpacity={0.7} onPress={() => { this.newTalent(item.id) }}>
                        <FastImage source={{ uri: `${Appurl.apiUrl}resizeimage?imageUrl=` + item.pic + '&width=200&height=200' }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 12, textAlign: textAlign, fontWeight: 'bold' }}>{item.name}</Text>
                      <Text style={{ textAlign: textAlign, fontSize: 12 }}>{item.profession} {item.profession1 ? '/' : null} {item.profession1}</Text>
                    </View>
                  </View>
                }
                keyExtractor={item => item.id.toString()}
                numColumns={ 2 }
                extraData={this.state}
              /> : null
              }
              </ScrollView> 
             
            </View> : null}
          </ScrollView>
         
        </SafeAreaView>
        <TouchableOpacity style={styles.loginButton} onPress={() => this.requestPage()}>
         <Text style={styles.loginButtonText}>{strings('talentInfo.BookNowLabel')}</Text>
         </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(talentInfo);
const styles=ScaledSheet.create({
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
  }
})
