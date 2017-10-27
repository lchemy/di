import { container } from "./container";
import { provide, provideLocal } from "./provide";

describe("provide decorator", () => {
	it("should get from container with injections", () => {
		@provide()
		class A {

		}

		@provide()
		class B {
			constructor(public a: A) {

			}
		}

		const aSingleton = container.get(A),
			bSingleton = container.get(B);
		expect(bSingleton.a).toBe(aSingleton);
	});

	it("should get from container with transient injections", () => {
		@provide()
		class A {

		}

		@provideLocal()
		class B {

		}

		@provide()
		class C {
			constructor(public a: A, public b: B) {

			}
		}

		@provideLocal()
		class D {
			constructor(public a: A, public b: B, public c: C) {

			}
		}

		const aSingleton = container.get(A),
			bTransient = container.get(B),
			cSingleton = container.get(C),
			dTransient1 = container.get(D),
			dTransient2 = container.get(D);

		expect(cSingleton.a).toBe(aSingleton);
		expect(cSingleton.b).not.toBe(bTransient);
		expect(dTransient1.a).toBe(aSingleton);
		expect(dTransient1.b).not.toBe(bTransient);
		expect(dTransient1.c).toBe(cSingleton);
		expect(dTransient2.b).not.toBe(bTransient);
	});

	it("should be able to provide with a value", () => {
		@provide("a")
		class A {

		}
		expect(container.get("a")).toEqual(jasmine.any(A));

		@provide(B)
		class B {

		}
		expect(container.get(B)).toEqual(jasmine.any(B));

		const symbol = Symbol();
		@provide(symbol)
		class C extends B {

		}
		expect(container.get(symbol)).toEqual(jasmine.any(C));
	});

	it("should not be callable or instantiable with new", () => {
		@provide()
		class A {

		}

		expect(() => {
			A.call({});
		}).toThrow();

		expect(() => {
			return new A();
		}).toThrow();
	});
});
