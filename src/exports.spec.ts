import * as inversify from "inversify";

import * as di from "./index";
import * as testing from "./testing";

describe("exports", () => {
	it("should contain everything that inversify exports", () => {
		Object.keys(inversify).forEach((key) => {
			expect(di).toHaveProperty(key);
		});
	});

	it("should not export testing by default", () => {
		Object.keys(testing).forEach((key) => {
			expect(di).not.toHaveProperty(key);
		});
	});
});
