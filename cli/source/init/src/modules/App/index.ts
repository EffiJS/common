import { Module } from '@effijs/common';

import {AppController} from './app.controller'
import {AppNavigation} from './app.navigation'

@Module()
class AppModule {
  constructor(public controller: AppController, public navigation: AppNavigation) {
    navigation.SplashScreen();
  }

  // TODO: WHat module allow logout, signin, signup. HTTP Status 403 also goes to logout
}

export { AppModule }
