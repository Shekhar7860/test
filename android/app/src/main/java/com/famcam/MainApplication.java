package com.nejmauser;
import com.facebook.react.ReactPackage;
import android.app.Application;
// import com.reactnativenavigation.NavigationApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.shell.MainReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.facebook.react.ReactApplication;
import com.react.rnspinkit.RNSpinkitPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.ReactNativeHost;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; 
import co.apptailor.googlesignin.RNGoogleSigninPackage; 
import com.swmansion.reanimated.ReanimatedPackage;


import android.content.Intent;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication  {
    private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }
  
 
  
  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
     new RNI18nPackage(),
      new RNFirebasePackage(),
      new LinearGradientPackage(),
      new FBSDKPackage(),
      new ImagePickerPackage(),
      new ReactVideoPackage(),
      new RNFetchBlobPackage(),
      new KCKeepAwakePackage(),
      new RNSpinkitPackage(),
      new FastImageViewPackage(),
      new NetInfoPackage(),
      new SplashScreenReactPackage(),
       new RNCViewPagerPackage(),
       new RNGoogleSigninPackage(),
        new RNFirebaseMessagingPackage(),
         new RNFirebaseNotificationsPackage(),
         new RNGestureHandlerPackage(),
         new ReanimatedPackage() 
      );
    }
    
    @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };
       @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
  
 }
