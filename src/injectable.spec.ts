import { injectable } from "./injectable";

describe("injectable decorator", () => {
	it("should add inversify injectable annotations to decorated class", () => {
		@injectable()
		class A {
			constructor(_0: string, _1: number) {
				// noop
			}
		}

		const metadata = Reflect.getMetadata("inversify:paramtypes", A);
		expect(metadata).toEqual([String, Number]);
	});

	it("should add inversify injectable annotations to super classes that don't have it", () => {
		class A {
			constructor(_0: string) {
				// noop
			}
		}

		@injectable()
		class B extends A {
			constructor(_0: string, _1: number) {
				super(_0);
			}
		}

		const aMetadata = Reflect.getMetadata("inversify:paramtypes", A),
			bMetadata = Reflect.getMetadata("inversify:paramtypes", B);
		expect(aMetadata).toEqual([]);
		expect(bMetadata).toEqual([String, Number]);
	});

	it("should not add inversify injectable annotations again to super classes that already have it", () => {
		@injectable()
		class A {
			constructor(_0: string) {
				// noop
			}
		}

		@injectable()
		class B extends A {
			constructor(_0: string, _1: number) {
				super(_0);
			}
		}

		const aMetadata = Reflect.getMetadata("inversify:paramtypes", A),
			bMetadata = Reflect.getMetadata("inversify:paramtypes", B);
		expect(aMetadata).toEqual([String]);
		expect(bMetadata).toEqual([String, Number]);
	});
});
