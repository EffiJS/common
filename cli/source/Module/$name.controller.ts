import { Controller } from '@effijs/common';
import { $NameStore } from './$name.store';

@Controller()
class $NameController {
  constructor(public store: $NameStore ) {
  }
}

export { $NameController }
