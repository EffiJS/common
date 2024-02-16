import { Instance } from '@common'

export function getModule(name) {
  return Instance.get(name);
}
