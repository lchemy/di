import { decorate, injectable as inversifyInjectable } from "inversify";
import "reflect-metadata";

export function injectable(): ClassDecorator {
	return (ctor) => {
		// add inversify injectable to class
		decorate(inversifyInjectable(), ctor);

		// check parent class and add injectable if it does not already have it
		const parentCtor = Object.getPrototypeOf(ctor);
		if (parentCtor instanceof Function) {
			const alreadyInjectable = Reflect.hasOwnMetadata("inversify:paramtypes", parentCtor);
			if (!alreadyInjectable) {
				decorate(injectable(), parentCtor);
			}
		}
	};
}
