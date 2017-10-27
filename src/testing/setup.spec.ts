import { container as globalContainer } from "../container";
import { provide } from "../provide";

import { setup } from "./setup";

describe("setup", () => {
	it("should handle scopes properly", () => {
		@provide()
		class A {

		}

		@provide()
		class B {

		}

		const container1 = setup([{
			use: B,
			transient: false
		}]);
		const container2 = setup([{
			use: B,
			transient: true
		}]);
		const container3 = setup();

		const aSingleton = globalContainer.get(A),
			aSingleton1 = container1.get(A),
			aSingleton2 = container2.get(A),
			aSingleton3 = container3.get(A);
		expect(aSingleton1).toBe(aSingleton);
		expect(aSingleton2).toBe(aSingleton);
		expect(aSingleton3).toBe(aSingleton);

		const bSingleton = globalContainer.get(B),
			bSingleton11 = container1.get(B),
			bSingleton12 = container1.get(B),
			bTransient21 = container2.get(B),
			bTransient22 = container2.get(B),
			bSingleton3 = container3.get(B);
		expect(bSingleton11).not.toBe(bSingleton);
		expect(bSingleton12).not.toBe(bSingleton);
		expect(bSingleton11).toBe(bSingleton12);
		expect(bTransient21).not.toBe(bSingleton);
		expect(bTransient22).not.toBe(bSingleton);
		expect(bTransient21).not.toBe(bTransient22);
		expect(bSingleton3).toBe(bSingleton);
	});

	it("should be able to override bindings", () => {
		@provide()
		class A {

		}

		@provide()
		class B extends A {

		}

		const container = setup([{
			provide: A,
			use: B
		}]);

		const aSingleton = globalContainer.get(A),
			bAsASingleton = container.get(A),
			bAsBSingleton = container.get(B);

		expect(aSingleton).toEqual(jasmine.any(A));
		expect(bAsASingleton).toEqual(jasmine.any(B));
		expect(bAsBSingleton).toEqual(jasmine.any(B));
		expect(bAsASingleton).not.toBe(bAsBSingleton);
	});
});
