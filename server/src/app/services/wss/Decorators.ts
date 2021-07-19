import { wsDecode } from '../../utils/wssUtils';
export function encode() {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    const oldMethods = descriptor.value;
    descriptor.value = function (msg: string, ...r: any[]) {
      return oldMethods.call(this, wsDecode(msg), ...r);
    };
  };
}
