import { Container, decorate, interfaces } from "inversify";

import { container as globalContainer } from "./container";
import { injectable } from "./injectable";

export const CAN_INSTANTIATE = Symbol("CAN_INSTANTIATE");

export function provide(serviceIdentifier?: interfaces.ServiceIdentifier<any>): ClassDecorator {
	return (ctor) => {
		return provideScoped(ctor as any, serviceIdentifier, false);
	};
}

export function provideLocal(serviceIdentifier?: interfaces.ServiceIdentifier<any>): ClassDecorator {
	return (ctor) => {
		return provideScoped(ctor as any, serviceIdentifier, true);
	};
}

function provideScoped<C extends interfaces.Newable<any>>(ctor: C, serviceIdentifier: interfaces.ServiceIdentifier<any> | undefined, transient: boolean): C {
	if (serviceIdentifier == null) {
		serviceIdentifier = ctor;
	}

	const wrapped = wrapConstructor(ctor);

	if (serviceIdentifier === ctor) {
		serviceIdentifier = wrapped;
	}

	decorate(injectable(), wrapped);

	bindToContainer(globalContainer, serviceIdentifier, wrapped, transient);

	return wrapped;
}

function wrapConstructor<C extends interfaces.Newable<any>>(ctor: C): C {
	const name = ctor.name;

	const wrapped = class extends ctor {
		constructor(...args: any[]) {
			const isDerived = new.target === wrapped,
				canInstantiate = (wrapped as any)[CAN_INSTANTIATE];

			if (isDerived && !canInstantiate) {
				throw new Error(`${ name } cannot be instantiated with new, use container.get(${ name }) instead`);
			}

			super(...args);
		}
	};

	const paramtypes = getDesignParamTypes(ctor);
	Reflect.defineMetadata("design:paramtypes", paramtypes, wrapped);

	Object.defineProperties(wrapped, {
		name: {
			configurable: true,
			value: `wrapped ${ name }`
		},
		length: {
			configurable: true,
			value: paramtypes != null ? paramtypes.length : 0
		}
	});

	return wrapped;
}

export function bindToContainer(container: Container, serviceIdentifier: interfaces.ServiceIdentifier<any>, ctor: interfaces.Newable<any>, transient: boolean = false): void {
	const binding = container.bind(serviceIdentifier).toDynamicValue((context: interfaces.Context) => {
		(ctor as any)[CAN_INSTANTIATE] = true;
		const instance = context.container.resolve(ctor);
		(ctor as any)[CAN_INSTANTIATE] = false;
		return instance;
	});
	if (transient) {
		binding.inTransientScope();
	} else {
		binding.inSingletonScope();
	}
}

export function getDesignParamTypes<C extends interfaces.Newable<any>>(ctor: C): any[] | undefined {
	if (ctor.length > 0) {
		return Reflect.getMetadata("design:paramtypes", ctor);
	}

	const parentCtor = Object.getPrototypeOf(ctor);
	if (parentCtor instanceof Function) {
		return getDesignParamTypes(parentCtor);
	}

	return [];
}
