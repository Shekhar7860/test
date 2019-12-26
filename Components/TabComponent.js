import React, { Component } from 'react';

import {
  Text,
  TouchableOpacity,
  NativeModules,
  StyleSheet,
  Platform,
  Image,
  SafeAreaView
} from 'react-native';
import { ScaledSheet, moderateScale, scale, verticalScale } from "react-native-size-matters";
//Redux Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import colors  from '../theme/colors';
import * as userActions from '../src/actions/userActions';

//Common components and helper methods

const TabImages = {
    unselected: [
        require('./../Images/ic_explore_disabled.png'),
        require('./../Images/ic_video_disabled.png'),
        require('./../Images/ic_notification_disabled.png'),
        require('./../Images/ic_profile_disabled.png')
    ],
    selected: [
        require('./../Images/ic_explore_enabled.png'),
        require('./../Images/video.png'),
        require('./../Images/ic_notification_enabled.png'),
        require('./../Images/ic_profile_enabled.png')
    ]
}


class TabComponent extends Component {
  constructor() {
    super();
    this.state = {
      tabName: [
        "Explore",
        "Requests",
        "Alerts",
        "Profile"
      ]
    }
  }

  render() {
    const navigation = this.props.navigation;
    const { routes, index } = this.props.navigation.state;
    return (
      <SafeAreaView style={styles.tabContainer}  >
        {routes.map((route, idx) => {
          const color = index === idx ? colors.tabsActiveColor : colors.tabsInactiveColor;
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(route.routeName);
              }}

              style={styles.tab}
              key={route.routeName}
            >
              {index === idx ?
                <Image source={TabImages.selected[idx]} />
                :
                <Image source={TabImages.unselected[idx]} />
              }
              <Text style={{ color, fontSize: 12, lineHeight: 16 }}>

                {this.state.tabName[idx]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  tabContainer: {
    flexDirection: 'row',
    height: NativeModules.DeviceInfo.isIPhoneX_deprecated == true ?  moderateScale(84) : moderateScale(80),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,

  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: NativeModules.DeviceInfo.isIPhoneX_deprecated == true ? 16 : 0,

    borderRadius: 4,
  },
});

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
export default connect(mapStateToProps, mapDispatchToProps)(TabComponent)