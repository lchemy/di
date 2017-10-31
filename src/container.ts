import { Container, decorate, injectable } from "inversify";
import "reflect-metadata";

decorate(injectable(), Container);

export const container = new Container({
	defaultScope: "Singleton"
});

container.bind(Container).toConstantValue(container);
