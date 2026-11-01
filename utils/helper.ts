import { RegistrationData } from "../pages/RegisterPage";
import { RandomDataUtil } from "./dataGenerator";

export class Helper {
  static convertPriceToNumber(price: string): number {
    return Number(price.replace(/[^\d.]/g, ""));
  }

  static getProductDetails() {
    return {
      productName: "MacBook",
      productQuantity: "1",
      totalPrice: "$602.00",
    };
  }

  static getLoginDetails() {
    const email = process.env.APP_EMAIL;
    const password = process.env.APP_PASSWORD;

    if (!email || !password) {
      throw new Error("APP_EMAIL and APP_PASSWORD must be configured for login tests.");
    }

    return {
      email,
      password,
    };
  }

  static getRegistrationDetails(): RegistrationData {
    const password = RandomDataUtil.getPassword(14);
    return {
      firstName: RandomDataUtil.getFirstName(),
      lastName: RandomDataUtil.getLastName(),
      email: RandomDataUtil.getEmail(),
      telephone: RandomDataUtil.getPhoneNumber(),
      password,
    };
  }
}
