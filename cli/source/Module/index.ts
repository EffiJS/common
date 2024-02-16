import { Module } from '@effijs/common';

import { $NameController } from './$name.controller'
import { $NameNavigation } from './$name.navigation'

@Module()
class $NameModule {
  constructor(public controller: $NameController, public navigation: $NameNavigation) {
  }
}

export { $NameModule }
