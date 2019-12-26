import {Navigation} from 'react-native-navigation';
import home from './Screens/home';
import * as React from 'react';
import register from './Screens/register';
import otpInput from './Screens/otpInput';
import login from './Screens/login';
import forgotPassword from './Screens/forgotPassword';
import famcamHome from './Screens/famcamHome';
import orders from './Screens/orders';
import profile from './Screens/profile';
import talentInfo from './Screens/talentInfo';
import shoutout from './Screens/shoutout';
import profileSetup from './Screens/profileSetup';
import editProfile from './Screens/editProfile';
import termsAndConditions from './Screens/termsAndConditions';
import PrivacyPolicy from './Screens/PrivacyPolicy';
import contact from './Screens/contact';
import PlayVideo from './Screens/PlayVideo';
import Language from './Screens/Language';
import Suggestion from './Screens/Suggestion';
import AfterPayment from './Screens/AfterPayment';
import PaymentInfo from './Screens/PaymentInfo';
import payment from './Screens/payment';
import paymentWeb from './Screens/paymentWeb';
import Notifications from './Screens/Notifications';
import paymentMethods from './Screens/paymentMethods';
import ChangePassword from './Screens/ChangePassword';
import contactUs from './Screens/contactUs';
import { Provider } from 'react-redux';
import configureStore from './src/configureStore';
import verifyEmail from './Screens/verifyEmail';
import BookingDone from './Screens/BookingDone';
import creditCard from './Screens/creditCard';
const store = configureStore();

function ReduxProvider(Component) {
   

  return (props) => (
      <Provider store={store}>
          <Component {...props} />
      </Provider>
  );
}

export function registerScreens(store, Provider) {
  Navigation.registerComponent('home', () => ReduxProvider(home), () => home);
  Navigation.registerComponent('register', () => ReduxProvider(register), () => register);
  Navigation.registerComponent('otpInput', () => ReduxProvider(otpInput), () => otpInput);
  Navigation.registerComponent('login', () => ReduxProvider(login), () => login);
  Navigation.registerComponent('forgotPassword', () => ReduxProvider(forgotPassword), () => forgotPassword);
  Navigation.registerComponent('famcamHome', () => ReduxProvider(famcamHome), () => famcamHome);
  Navigation.registerComponent('orders', () => ReduxProvider(orders), () => orders);
  Navigation.registerComponent('profile', () => ReduxProvider(profile), () => profile);
  Navigation.registerComponent('notifications', () => ReduxProvider(Notifications), () => Notifications);
  Navigation.registerComponent('talentInfo', () => ReduxProvider(talentInfo), () => talentInfo);
  Navigation.registerComponent('shoutout', () => ReduxProvider(shoutout), () => shoutout);
  Navigation.registerComponent('profileSetup', () => ReduxProvider(profileSetup), () => profileSetup);
  Navigation.registerComponent('editProfile', () => ReduxProvider(editProfile), () => editProfile);
  Navigation.registerComponent('termsAndConditions', () => ReduxProvider(termsAndConditions), () => termsAndConditions);
  Navigation.registerComponent('PrivacyPolicy', () => ReduxProvider(PrivacyPolicy), () => PrivacyPolicy);
  Navigation.registerComponent('contact', () => ReduxProvider(contact), () => contact);
  Navigation.registerComponent('PlayVideo', () => ReduxProvider(PlayVideo), () => PlayVideo);
  Navigation.registerComponent('Language', () => ReduxProvider(Language), () => Language);
  Navigation.registerComponent('Suggestion', () => ReduxProvider(Suggestion), () => Suggestion);
  Navigation.registerComponent('AfterPayment', () => ReduxProvider(AfterPayment), () => AfterPayment);
  Navigation.registerComponent('PaymentInfo', () => ReduxProvider(PaymentInfo), () => PaymentInfo);
  Navigation.registerComponent('contactUs', () => ReduxProvider(contactUs), () => contactUs);
  Navigation.registerComponent('paymentWeb', () => ReduxProvider(paymentWeb), () => paymentWeb);
  Navigation.registerComponent('ChangePassword', () => ReduxProvider(ChangePassword), () => ChangePassword);
  Navigation.registerComponent('paymentMethods', () => ReduxProvider(paymentMethods), () => paymentMethods);
  Navigation.registerComponent('payment', () => ReduxProvider(payment), () => payment);
  Navigation.registerComponent('verifyEmail', () => ReduxProvider(verifyEmail), () => verifyEmail);
  Navigation.registerComponent('BookingDone', () => ReduxProvider(BookingDone), () => BookingDone);
  Navigation.registerComponent('creditCard', () => ReduxProvider(creditCard), () => creditCard);
}
