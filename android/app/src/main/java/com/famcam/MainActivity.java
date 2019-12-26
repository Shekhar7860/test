package com.nejmauser;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.view.Gravity;
// import com.reactnativenavigation.controllers.SplashActivity;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
// import com.reactnativenavigation.NavigationActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView; 
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.content.Intent;

public class MainActivity extends ReactActivity {
    @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this); 
      super.onCreate(savedInstanceState);
  }
     @Override
  protected String getMainComponentName() {
    return "famcam";
  }
  @Override
 protected ReactActivityDelegate createReactActivityDelegate() {
   return new ReactActivityDelegate(this, getMainComponentName()) {
     @Override
    protected ReactRootView createRootView() {
     return new RNGestureHandlerEnabledRootView(MainActivity.this);
     }
   };
 }
  
  

 }
