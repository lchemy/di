import { Container, interfaces } from "inversify";

import { container as globalContainer } from "../container";
import { bindToContainer } from "../provide";

export interface ServiceOverride<T> {
	use: interfaces.Newable<T>;
	provide?: interfaces.ServiceIdentifier<T>;
	transient?: boolean;
}

export function setup(overrides: Array<ServiceOverride<any>> = []): Container {
	const container = new Container({
		defaultScope: "Singleton"
	});
	container.parent = globalContainer;

	overrides.forEach(({ use, provide, transient }) => {
		if (provide == null) {
			provide = use;
		}

		bindToContainer(container, provide, use, transient);
	});

	return container;
}
